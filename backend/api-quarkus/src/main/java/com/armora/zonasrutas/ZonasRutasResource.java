package com.armora.zonasrutas;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

import javax.sql.DataSource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.armora.platform.api.ResponseWrapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/zonas-rutas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Zonas y Rutas")
@RolesAllowed({"ADMINISTRADOR", "OPERADOR"})
public class ZonasRutasResource {

    private static final Pattern COLOR_HEX_PATTERN = Pattern.compile("^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$");

    @Inject
    DataSource dataSource;

    @Inject
    ObjectMapper objectMapper;

    @GET
    @Path("/zonas")
    @Operation(summary = "Listar zonas")
    public ResponseWrapper<List<ZonaResponse>> listarZonas(@QueryParam("q") String q, @QueryParam("estado") String estado) {
        String estadoValidado = hasText(estado) ? validarEstado(estado) : null;
        try (Connection conn = dataSource.getConnection()) {
            StringBuilder sql = new StringBuilder(
                    "SELECT z.id, z.codigo, z.nombre_zona, z.color, z.estado, z.observacion, z.creado_en, z.actualizado_en, "
                    + "COUNT(r.id) AS cantidad_rutas, "
                    + "EXISTS(SELECT 1 FROM zonas_poligonos zp WHERE zp.zona_id = z.id AND zp.activo = true) AS tiene_poligono "
                    + "FROM zonas z LEFT JOIN rutas r ON r.zona_id = z.id WHERE 1=1");
            List<Object> params = new ArrayList<>();
            if (hasText(q)) {
                sql.append(" AND (z.codigo ILIKE ? OR z.nombre_zona ILIKE ?)");
                String pattern = "%" + q.trim() + "%";
                params.add(pattern);
                params.add(pattern);
            }
            if (estadoValidado != null) {
                sql.append(" AND z.estado = ?::estado_registro");
                params.add(estadoValidado);
            }
            sql.append(" GROUP BY z.id ORDER BY z.nombre_zona");
            try (PreparedStatement ps = conn.prepareStatement(sql.toString())) {
                setParams(ps, params);
                try (ResultSet rs = ps.executeQuery()) {
                    List<ZonaResponse> zonas = new ArrayList<>();
                    while (rs.next()) {
                        zonas.add(mapZona(rs));
                    }
                    return ResponseWrapper.ok(zonas);
                }
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al listar zonas");
        }
    }

    @POST
    @Path("/zonas")
    @Operation(summary = "Crear zona")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<IdCodigoResponse> crearZona(@Valid CrearZonaRequest request) {
        validarZona(request.codigo(), request.nombreZona(), request.estado(), request.color());
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                asegurarCodigoDisponible(conn, "zonas", request.codigo(), null);
                UUID id;
                try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO zonas (codigo, nombre_zona, color, estado, observacion) "
                        + "VALUES (?, ?, ?, ?::estado_registro, ?) RETURNING id")) {
                    ps.setString(1, request.codigo().trim());
                    ps.setString(2, request.nombreZona().trim());
                    ps.setString(3, blankToNull(request.color()));
                    ps.setString(4, request.estado() != null ? validarEstado(request.estado()) : "ACTIVO");
                    ps.setString(5, blankToNull(request.observacion()));
                    try (ResultSet rs = ps.executeQuery()) {
                        rs.next();
                        id = UUID.fromString(rs.getString("id"));
                    }
                }
                conn.commit();
                return ResponseWrapper.ok(new IdCodigoResponse(id.toString(), request.codigo().trim()));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al crear zona");
        }
    }

    @PUT
    @Path("/zonas/{id}")
    @Operation(summary = "Actualizar zona")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<IdCodigoResponse> actualizarZona(@PathParam("id") String id, @Valid CrearZonaRequest request) {
        parseUuid(id, "id");
        validarZona(request.codigo(), request.nombreZona(), request.estado(), request.color());
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                asegurarZonaExiste(conn, id, true);
                asegurarCodigoDisponible(conn, "zonas", request.codigo(), id);
                try (PreparedStatement ps = conn.prepareStatement(
                        "UPDATE zonas SET codigo = ?, nombre_zona = ?, color = ?, estado = ?::estado_registro, observacion = ? "
                        + "WHERE id = ?::uuid")) {
                    ps.setString(1, request.codigo().trim());
                    ps.setString(2, request.nombreZona().trim());
                    ps.setString(3, blankToNull(request.color()));
                    ps.setString(4, request.estado() != null ? validarEstado(request.estado()) : "ACTIVO");
                    ps.setString(5, blankToNull(request.observacion()));
                    ps.setString(6, id);
                    ps.executeUpdate();
                }
                conn.commit();
                return ResponseWrapper.ok(new IdCodigoResponse(id, request.codigo().trim()));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al actualizar zona");
        }
    }

    @GET
    @Path("/rutas")
    @Operation(summary = "Listar rutas")
    public ResponseWrapper<List<RutaResponse>> listarRutas(@QueryParam("q") String q, @QueryParam("zonaId") String zonaId) {
        UUID zonaUuid = hasText(zonaId) ? parseUuid(zonaId, "zonaId") : null;
        try (Connection conn = dataSource.getConnection()) {
            StringBuilder sql = new StringBuilder(
                    "SELECT r.id, r.codigo, r.zona_id, z.nombre_zona, z.color, r.nombre_ruta, r.dias_atencion, "
                    + "r.estado, r.observacion, r.creado_en, r.actualizado_en "
                    + "FROM rutas r JOIN zonas z ON z.id = r.zona_id WHERE 1=1");
            List<Object> params = new ArrayList<>();
            if (hasText(q)) {
                sql.append(" AND (r.codigo ILIKE ? OR r.nombre_ruta ILIKE ? OR z.nombre_zona ILIKE ?)");
                String pattern = "%" + q.trim() + "%";
                params.add(pattern);
                params.add(pattern);
                params.add(pattern);
            }
            if (zonaUuid != null) {
                sql.append(" AND r.zona_id = ?::uuid");
                params.add(zonaUuid.toString());
            }
            sql.append(" ORDER BY z.nombre_zona, r.nombre_ruta");
            try (PreparedStatement ps = conn.prepareStatement(sql.toString())) {
                setParams(ps, params);
                try (ResultSet rs = ps.executeQuery()) {
                    List<RutaResponse> rutas = new ArrayList<>();
                    while (rs.next()) {
                        rutas.add(mapRuta(rs));
                    }
                    return ResponseWrapper.ok(rutas);
                }
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al listar rutas");
        }
    }

    @POST
    @Path("/rutas")
    @Operation(summary = "Crear ruta")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<IdCodigoResponse> crearRuta(@Valid CrearRutaRequest request) {
        validarRuta(request.codigo(), request.zonaId(), request.nombreRuta(), request.estado());
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                asegurarZonaExiste(conn, request.zonaId(), false);
                asegurarCodigoDisponible(conn, "rutas", request.codigo(), null);
                UUID id;
                try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO rutas (codigo, zona_id, nombre_ruta, dias_atencion, estado, observacion) "
                        + "VALUES (?, ?::uuid, ?, ?::jsonb, ?::estado_registro, ?) RETURNING id")) {
                    ps.setString(1, request.codigo().trim());
                    ps.setString(2, request.zonaId());
                    ps.setString(3, request.nombreRuta().trim());
                    setNullableJson(ps, 4, request.diasAtencion());
                    ps.setString(5, request.estado() != null ? validarEstado(request.estado()) : "ACTIVO");
                    ps.setString(6, blankToNull(request.observacion()));
                    try (ResultSet rs = ps.executeQuery()) {
                        rs.next();
                        id = UUID.fromString(rs.getString("id"));
                    }
                }
                conn.commit();
                return ResponseWrapper.ok(new IdCodigoResponse(id.toString(), request.codigo().trim()));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al crear ruta");
        }
    }

    @PUT
    @Path("/rutas/{id}")
    @Operation(summary = "Actualizar ruta")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<IdCodigoResponse> actualizarRuta(@PathParam("id") String id, @Valid CrearRutaRequest request) {
        parseUuid(id, "id");
        validarRuta(request.codigo(), request.zonaId(), request.nombreRuta(), request.estado());
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                asegurarRutaExiste(conn, id, true);
                asegurarZonaExiste(conn, request.zonaId(), false);
                asegurarCodigoDisponible(conn, "rutas", request.codigo(), id);
                try (PreparedStatement ps = conn.prepareStatement(
                        "UPDATE rutas SET codigo = ?, zona_id = ?::uuid, nombre_ruta = ?, dias_atencion = ?::jsonb, "
                        + "estado = ?::estado_registro, observacion = ? WHERE id = ?::uuid")) {
                    ps.setString(1, request.codigo().trim());
                    ps.setString(2, request.zonaId());
                    ps.setString(3, request.nombreRuta().trim());
                    setNullableJson(ps, 4, request.diasAtencion());
                    ps.setString(5, request.estado() != null ? validarEstado(request.estado()) : "ACTIVO");
                    ps.setString(6, blankToNull(request.observacion()));
                    ps.setString(7, id);
                    ps.executeUpdate();
                }
                conn.commit();
                return ResponseWrapper.ok(new IdCodigoResponse(id, request.codigo().trim()));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al actualizar ruta");
        }
    }

    @PATCH
    @Path("/{tipo}/{id}/estado")
    @Operation(summary = "Cambiar estado de zona o ruta")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<EstadoResponse> cambiarEstado(@PathParam("tipo") String tipo, @PathParam("id") String id,
            @Valid CambiarEstadoRequest request) {
        parseUuid(id, "id");
        String estado = validarEstado(request.estado());
        String tabla = tablaPorTipo(tipo);
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement("UPDATE " + tabla + " SET estado = ?::estado_registro WHERE id = ?::uuid")) {
            ps.setString(1, estado);
            ps.setString(2, id);
            if (ps.executeUpdate() == 0) {
                throw new WebApplicationException("Registro no encontrado", Response.Status.NOT_FOUND);
            }
            return ResponseWrapper.ok(new EstadoResponse(estado));
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al cambiar estado");
        }
    }

    @DELETE
    @Path("/{tipo}/{id}")
    @Operation(summary = "Eliminar zona o ruta")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<Map<String, Object>> eliminar(@PathParam("tipo") String tipo, @PathParam("id") String id) {
        parseUuid(id, "id");
        String tabla = tablaPorTipo(tipo);
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement("DELETE FROM " + tabla + " WHERE id = ?::uuid")) {
            ps.setString(1, id);
            if (ps.executeUpdate() == 0) {
                throw new WebApplicationException("Registro no encontrado", Response.Status.NOT_FOUND);
            }
            return ResponseWrapper.ok(Map.of("deleted", true));
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al eliminar");
        }
    }

    @GET
    @Path("/zonas/{id}/poligono")
    @Operation(summary = "Obtener poligono activo de una zona")
    public ResponseWrapper<PoligonoResponse> obtenerPoligono(@PathParam("id") String id) {
        parseUuid(id, "id");
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT id, coordenadas, version, activo, creado_en FROM zonas_poligonos "
                        + "WHERE zona_id = ?::uuid AND activo = true ORDER BY version DESC LIMIT 1")) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    throw new WebApplicationException("No hay poligono activo para esta zona", Response.Status.NOT_FOUND);
                }
                Timestamp creadoEn = rs.getTimestamp("creado_en");
                return ResponseWrapper.ok(new PoligonoResponse(
                        rs.getString("id"),
                        readJson(rs, "coordenadas"),
                        rs.getInt("version"),
                        rs.getBoolean("activo"),
                        creadoEn != null ? creadoEn.toString() : null));
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al obtener poligono");
        }
    }

    @PUT
    @Path("/zonas/{id}/poligono")
    @Operation(summary = "Guardar poligono de una zona")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<PoligonoCreatedResponse> guardarPoligono(@PathParam("id") String id,
            @Valid CrearPoligonoRequest request) {
        parseUuid(id, "id");
        validarGeoJsonPolygon(request.coordenadas());
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                asegurarZonaExiste(conn, id, true);
                try (PreparedStatement ps = conn.prepareStatement(
                        "UPDATE zonas_poligonos SET activo = false WHERE zona_id = ?::uuid AND activo = true")) {
                    ps.setString(1, id);
                    ps.executeUpdate();
                }
                int nextVersion;
                try (PreparedStatement ps = conn.prepareStatement(
                        "SELECT COALESCE(MAX(version), 0) + 1 FROM zonas_poligonos WHERE zona_id = ?::uuid")) {
                    ps.setString(1, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        rs.next();
                        nextVersion = rs.getInt(1);
                    }
                }
                UUID poligonoId;
                try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO zonas_poligonos (zona_id, coordenadas, version, activo) VALUES (?::uuid, ?::jsonb, ?, true) RETURNING id")) {
                    ps.setString(1, id);
                    ps.setString(2, toJson(request.coordenadas(), "coordenadas"));
                    ps.setInt(3, nextVersion);
                    try (ResultSet rs = ps.executeQuery()) {
                        rs.next();
                        poligonoId = UUID.fromString(rs.getString("id"));
                    }
                }
                conn.commit();
                return ResponseWrapper.ok(new PoligonoCreatedResponse(poligonoId.toString(), nextVersion));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw serverError("Error al guardar poligono");
        }
    }

    @DELETE
    @Path("/zonas/{id}/poligono")
    @Operation(summary = "Desactivar poligono activo de una zona")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<Map<String, Object>> eliminarPoligono(@PathParam("id") String id) {
        parseUuid(id, "id");
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "UPDATE zonas_poligonos SET activo = false WHERE zona_id = ?::uuid AND activo = true")) {
            ps.setString(1, id);
            int desactivados = ps.executeUpdate();
            return ResponseWrapper.ok(Map.of("deleted", true, "desactivados", desactivados));
        } catch (Exception e) {
            throw serverError("Error al eliminar poligono");
        }
    }

    private ZonaResponse mapZona(ResultSet rs) throws Exception {
        Timestamp creadoEn = rs.getTimestamp("creado_en");
        Timestamp actualizadoEn = rs.getTimestamp("actualizado_en");
        return new ZonaResponse(
                rs.getString("id"),
                rs.getString("codigo"),
                rs.getString("nombre_zona"),
                rs.getString("color"),
                rs.getString("estado"),
                rs.getString("observacion"),
                rs.getInt("cantidad_rutas"),
                rs.getBoolean("tiene_poligono"),
                creadoEn != null ? creadoEn.toString() : null,
                actualizadoEn != null ? actualizadoEn.toString() : null);
    }

    private RutaResponse mapRuta(ResultSet rs) throws Exception {
        Timestamp creadoEn = rs.getTimestamp("creado_en");
        Timestamp actualizadoEn = rs.getTimestamp("actualizado_en");
        return new RutaResponse(
                rs.getString("id"),
                rs.getString("codigo"),
                rs.getString("zona_id"),
                rs.getString("nombre_zona"),
                rs.getString("color"),
                rs.getString("nombre_ruta"),
                readJson(rs, "dias_atencion"),
                rs.getString("estado"),
                rs.getString("observacion"),
                creadoEn != null ? creadoEn.toString() : null,
                actualizadoEn != null ? actualizadoEn.toString() : null);
    }

    private void validarZona(String codigo, String nombreZona, String estado, String color) {
        validarTexto(codigo, "Codigo", 30);
        validarTexto(nombreZona, "Nombre de zona", 150);
        if (estado != null) validarEstado(estado);
        if (hasText(color) && (color.trim().length() > 20 || !COLOR_HEX_PATTERN.matcher(color.trim()).matches())) {
            throw new WebApplicationException("Color debe tener formato hexadecimal, por ejemplo #2563eb", Response.Status.BAD_REQUEST);
        }
    }

    private void validarRuta(String codigo, String zonaId, String nombreRuta, String estado) {
        validarTexto(codigo, "Codigo", 30);
        parseUuid(zonaId, "zonaId");
        validarTexto(nombreRuta, "Nombre de ruta", 150);
        if (estado != null) validarEstado(estado);
    }

    private void validarTexto(String value, String label, int max) {
        if (!hasText(value) || value.trim().length() > max) {
            throw new WebApplicationException(label + " obligatorio de maximo " + max + " caracteres", Response.Status.BAD_REQUEST);
        }
    }

    private void asegurarZonaExiste(Connection conn, String id, boolean forUpdate) throws Exception {
        String sql = "SELECT id FROM zonas WHERE id = ?::uuid" + (forUpdate ? " FOR UPDATE" : "");
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    throw new WebApplicationException("Zona no encontrada", Response.Status.NOT_FOUND);
                }
            }
        }
    }

    private void asegurarRutaExiste(Connection conn, String id, boolean forUpdate) throws Exception {
        String sql = "SELECT id FROM rutas WHERE id = ?::uuid" + (forUpdate ? " FOR UPDATE" : "");
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    throw new WebApplicationException("Ruta no encontrada", Response.Status.NOT_FOUND);
                }
            }
        }
    }

    private void asegurarCodigoDisponible(Connection conn, String tabla, String codigo, String exceptId) throws Exception {
        String sql = exceptId == null
                ? "SELECT id FROM " + tabla + " WHERE codigo = ?"
                : "SELECT id FROM " + tabla + " WHERE codigo = ? AND id != ?::uuid";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, codigo.trim());
            if (exceptId != null) ps.setString(2, exceptId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    throw new WebApplicationException("El codigo ya existe", Response.Status.CONFLICT);
                }
            }
        }
    }

    private String tablaPorTipo(String tipo) {
        if ("zonas".equals(tipo)) return "zonas";
        if ("rutas".equals(tipo)) return "rutas";
        throw new WebApplicationException("Tipo invalido", Response.Status.BAD_REQUEST);
    }

    private void setParams(PreparedStatement ps, List<Object> params) throws Exception {
        for (int i = 0; i < params.size(); i++) {
            ps.setObject(i + 1, params.get(i));
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String blankToNull(String value) {
        return hasText(value) ? value.trim() : null;
    }

    private UUID parseUuid(String value, String field) {
        try {
            return UUID.fromString(value);
        } catch (Exception e) {
            throw new WebApplicationException("Campo " + field + " debe ser UUID valido", Response.Status.BAD_REQUEST);
        }
    }

    private String validarEstado(String estado) {
        if (!"ACTIVO".equals(estado) && !"INACTIVO".equals(estado)) {
            throw new WebApplicationException("Estado invalido. Use ACTIVO o INACTIVO.", Response.Status.BAD_REQUEST);
        }
        return estado;
    }

    private WebApplicationException serverError(String message) {
        return new WebApplicationException(message, Response.Status.INTERNAL_SERVER_ERROR);
    }

    private void setNullableJson(PreparedStatement ps, int index, JsonNode value) throws Exception {
        if (value == null || value.isNull()) {
            ps.setNull(index, java.sql.Types.OTHER);
        } else {
            ps.setString(index, toJson(value, "json"));
        }
    }

    private String toJson(JsonNode node, String field) {
        try {
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
            throw new WebApplicationException("Campo " + field + " debe ser JSON valido", Response.Status.BAD_REQUEST);
        }
    }

    private JsonNode readJson(ResultSet rs, String column) throws Exception {
        String value = rs.getString(column);
        return value != null ? objectMapper.readTree(value) : null;
    }

    private void validarGeoJsonPolygon(JsonNode coordenadas) {
        if (coordenadas == null || coordenadas.isNull() || !coordenadas.isObject()) {
            throw new WebApplicationException("Coordenadas debe ser un objeto GeoJSON Polygon", Response.Status.BAD_REQUEST);
        }
        JsonNode type = coordenadas.get("type");
        JsonNode coordinates = coordenadas.get("coordinates");
        if (type == null || !"Polygon".equals(type.asText()) || coordinates == null || !coordinates.isArray()
                || coordinates.isEmpty() || !coordinates.get(0).isArray()) {
            throw new WebApplicationException("Coordenadas debe tener type Polygon y coordinates validas", Response.Status.BAD_REQUEST);
        }
        JsonNode ring = coordinates.get(0);
        if (ring.size() < 4 || !isSamePoint(ring.get(0), ring.get(ring.size() - 1))) {
            throw new WebApplicationException("El poligono debe tener al menos 3 puntos y estar cerrado", Response.Status.BAD_REQUEST);
        }
        for (JsonNode point : ring) {
            if (!isPoint(point)) {
                throw new WebApplicationException("Cada punto del poligono debe ser [lng, lat]", Response.Status.BAD_REQUEST);
            }
        }
    }

    private boolean isPoint(JsonNode point) {
        return point != null && point.isArray() && point.size() >= 2 && point.get(0).isNumber() && point.get(1).isNumber();
    }

    private boolean isSamePoint(JsonNode a, JsonNode b) {
        return isPoint(a) && isPoint(b) && a.get(0).asDouble() == b.get(0).asDouble() && a.get(1).asDouble() == b.get(1).asDouble();
    }

    public record ZonaResponse(String id, String codigo, String nombreZona, String color, String estado,
            String observacion, int cantidadRutas, boolean tienePoligono, String creadoEn, String actualizadoEn) {}

    public record RutaResponse(String id, String codigo, String zonaId, String nombreZona, String zonaColor,
            String nombreRuta, JsonNode diasAtencion, String estado, String observacion, String creadoEn, String actualizadoEn) {}

    public record CrearZonaRequest(@NotBlank String codigo, @NotBlank String nombreZona, String color,
            String estado, String observacion) {}

    public record CrearRutaRequest(@NotBlank String codigo, @NotBlank String zonaId, @NotBlank String nombreRuta,
            JsonNode diasAtencion, String estado, String observacion) {}

    public record CambiarEstadoRequest(@NotBlank String estado) {}

    public record CrearPoligonoRequest(JsonNode coordenadas) {}

    public record PoligonoResponse(String id, JsonNode coordenadas, int version, boolean activo, String creadoEn) {}

    public record PoligonoCreatedResponse(String id, int version) {}

    public record IdCodigoResponse(String id, String codigo) {}

    public record EstadoResponse(String estado) {}
}
