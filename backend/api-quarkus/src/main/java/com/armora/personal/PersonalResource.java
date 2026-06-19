package com.armora.personal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.sql.DataSource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.armora.platform.api.ResponseWrapper;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.mindrot.jbcrypt.BCrypt;

@Path("/personal")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Personal")
@RolesAllowed({"ADMINISTRADOR", "OPERADOR"})
public class PersonalResource {

    @Inject
    DataSource dataSource;

    // =========================================================================
    // CREATE
    // =========================================================================

    @POST
    @Operation(summary = "Crear personal")
    public ResponseWrapper<PersonalResponse> crear(@Valid CrearPersonalRequest request) {
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // Verificar si usuario/correo ya existe
                try (PreparedStatement ps = conn.prepareStatement(
                        "SELECT id FROM usuarios WHERE usuario = ? OR correo = ?")) {
                    ps.setString(1, request.usuario());
                    ps.setString(2, request.correo());
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            throw new WebApplicationException("El usuario o correo ya existe", Response.Status.CONFLICT);
                        }
                    }
                }

                // Insertar usuario
                String hash = BCrypt.hashpw(request.clave(), BCrypt.gensalt());
                UUID usuarioId;
                try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO usuarios (usuario, correo, clave_hash, tipo, estado) VALUES (?, ?, ?, 'OPERADOR', 'ACTIVO') RETURNING id")) {
                    ps.setString(1, request.usuario());
                    ps.setString(2, request.correo());
                    ps.setString(3, hash);
                    try (ResultSet rs = ps.executeQuery()) {
                        rs.next();
                        usuarioId = UUID.fromString(rs.getString("id"));
                    }
                }

                // Insertar personal con TODOS los campos
                UUID personalId;
                try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO personal "
                        + "(usuario_id, nombres_completos, tipo_documento, numero_documento, "
                        + "sexo, estado_civil, fecha_nacimiento, "
                        + "cargo, area, sede, "
                        + "email_contacto, email_personal, "
                        + "telefono_fijo, telefono_celular, "
                        + "direccion, referencia, "
                        + "contacto_emergencia, "
                        + "departamento_nombre, provincia_nombre, distrito_nombre, "
                        + "ubigeo_codigo, "
                        + "observaciones, "
                        + "foto_url, "
                        + "estado, "
                        + "es_vendedor, es_transportista) "
                        + "VALUES (?, ?, ?::tipo_documento_personal, ?, "
                        + "?::sexo_personal, ?::estado_civil_personal, ?, "
                        + "?, ?, ?, "
                        + "?, ?, "
                        + "?, ?, "
                        + "?, ?, "
                        + "?, "
                        + "?, ?, ?, "
                        + "?, "
                        + "?, "
                        + "?, "
                        + "?::estado_registro, "
                        + "?, ?) RETURNING id")) {
                    ps.setObject(1, usuarioId);
                    ps.setString(2, request.nombresCompletos());
                    ps.setString(3, request.tipoDocumento() != null ? request.tipoDocumento() : "DNI");
                    ps.setString(4, request.numeroDocumento());
                    ps.setString(5, request.sexo());
                    ps.setString(6, request.estadoCivil());
                    ps.setDate(7, request.fechaNacimiento() != null ? java.sql.Date.valueOf(request.fechaNacimiento()) : null);
                    ps.setString(8, request.cargo());
                    ps.setString(9, request.area());
                    ps.setString(10, request.sede());
                    ps.setString(11, request.emailContacto());
                    ps.setString(12, request.emailPersonal());
                    ps.setString(13, request.telefonoFijo());
                    ps.setString(14, request.telefonoCelular());
                    ps.setString(15, request.direccion());
                    ps.setString(16, request.referencia());
                    ps.setString(17, request.contactoEmergencia());
                    ps.setString(18, request.departamentoNombre());
                    ps.setString(19, request.provinciaNombre());
                    ps.setString(20, request.distritoNombre());
                    ps.setString(21, request.ubigeoCodigo());
                    ps.setString(22, request.observaciones());
                    ps.setString(23, request.fotoUrl());
                    ps.setString(24, request.estado() != null ? request.estado() : "ACTIVO");
                    ps.setBoolean(25, request.esVendedor() != null && request.esVendedor());
                    ps.setBoolean(26, request.esTransportista() != null && request.esTransportista());
                    try (ResultSet rs = ps.executeQuery()) {
                        rs.next();
                        personalId = UUID.fromString(rs.getString("id"));
                    }
                }

                conn.commit();
                return ResponseWrapper.ok(new PersonalResponse(personalId.toString(), usuarioId.toString(),
                        request.nombresCompletos(), request.usuario()));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error al crear personal: " + e.getMessage(), Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================================
    // LIST
    // =========================================================================

    @GET
    @Operation(summary = "Listar personal")
    public ResponseWrapper<List<PersonalListResponse>> listar() {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT p.id, p.nombres_completos, p.tipo_documento, p.numero_documento, "
                        + "p.telefono_celular, p.email_contacto, "
                        + "p.es_vendedor, p.es_transportista, "
                        + "p.cargo, p.area, p.sede, "
                        + "u.usuario, p.estado, u.ultimo_acceso_en "
                        + "FROM personal p "
                        + "JOIN usuarios u ON u.id = p.usuario_id "
                        + "ORDER BY p.nombres_completos")) {
            try (ResultSet rs = ps.executeQuery()) {
                List<PersonalListResponse> list = new ArrayList<>();
                while (rs.next()) {
                    java.sql.Timestamp ultimoAcceso = rs.getTimestamp("ultimo_acceso_en");
                    list.add(new PersonalListResponse(
                        rs.getString("id"),
                        rs.getString("nombres_completos"),
                        rs.getString("tipo_documento"),
                        rs.getString("numero_documento"),
                        rs.getString("telefono_celular"),
                        rs.getString("email_contacto"),
                        rs.getBoolean("es_vendedor"),
                        rs.getBoolean("es_transportista"),
                        rs.getString("usuario"),
                        rs.getString("estado"),
                        rs.getString("cargo"),
                        rs.getString("area"),
                        rs.getString("sede"),
                        ultimoAcceso != null ? ultimoAcceso.toString() : null
                    ));
                }
                return ResponseWrapper.ok(list);
            }
        } catch (Exception e) {
            throw new WebApplicationException("Error al listar personal", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================================
    // GET BY ID (con TODOS los campos)
    // =========================================================================

    @GET
    @Path("/{id}")
    @Operation(summary = "Obtener personal por ID (todos los campos)")
    public ResponseWrapper<PersonalDetalleResponse> obtener(@PathParam("id") String id) {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT p.*, u.usuario, u.correo, p.estado, u.ultimo_acceso_en "
                        + "FROM personal p "
                        + "JOIN usuarios u ON u.id = p.usuario_id "
                        + "WHERE p.id = ?::uuid")) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    throw new WebApplicationException("Personal no encontrado", Response.Status.NOT_FOUND);
                }
                java.sql.Timestamp ultimoAcceso = rs.getTimestamp("ultimo_acceso_en");
                return ResponseWrapper.ok(new PersonalDetalleResponse(
                    rs.getString("id"),
                    rs.getString("usuario_id"),
                    rs.getString("nombres_completos"),
                    rs.getString("tipo_documento"),
                    rs.getString("numero_documento"),
                    rs.getString("sexo"),
                    rs.getString("estado_civil"),
                    rs.getDate("fecha_nacimiento") != null ? rs.getDate("fecha_nacimiento").toString() : null,
                    rs.getString("cargo"),
                    rs.getString("area"),
                    rs.getString("sede"),
                    rs.getString("email_contacto"),
                    rs.getString("email_personal"),
                    rs.getString("telefono_fijo"),
                    rs.getString("telefono_celular"),
                    rs.getString("direccion"),
                    rs.getString("referencia"),
                    rs.getString("contacto_emergencia"),
                    rs.getString("departamento_nombre"),
                    rs.getString("provincia_nombre"),
                    rs.getString("distrito_nombre"),
                    rs.getString("ubigeo_codigo"),
                    rs.getString("observaciones"),
                    rs.getString("foto_url"),
                    rs.getBoolean("es_vendedor"),
                    rs.getBoolean("es_transportista"),
                    rs.getString("usuario"),
                    rs.getString("estado"),
                    ultimoAcceso != null ? ultimoAcceso.toString() : null
                ));
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error al obtener personal", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================================
    // UPDATE (con TODOS los campos)
    // =========================================================================

    @PUT
    @Path("/{id}")
    @Operation(summary = "Actualizar personal (todos los campos)")
    public ResponseWrapper<PersonalResponse> actualizar(@PathParam("id") String id, @Valid ActualizarPersonalRequest request) {
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // Verificar que el personal existe (con FOR UPDATE)
                String usuarioIdStr;
                try (PreparedStatement ps = conn.prepareStatement(
                        "SELECT p.id, p.usuario_id FROM personal p WHERE p.id = ?::uuid FOR UPDATE")) {
                    ps.setString(1, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (!rs.next()) {
                            throw new WebApplicationException("Personal no encontrado", Response.Status.NOT_FOUND);
                        }
                        usuarioIdStr = rs.getString("usuario_id");
                    }
                }

                // Validar que el numeroDocumento no pertenezca a otro registro
                try (PreparedStatement ps = conn.prepareStatement(
                        "SELECT COUNT(id) FROM personal WHERE numero_documento = ? AND id != ?::uuid")) {
                    ps.setString(1, request.numeroDocumento());
                    ps.setString(2, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        rs.next();
                        if (rs.getInt(1) > 0) {
                            throw new WebApplicationException("El número de documento ya pertenece a otro registro",
                                    Response.Status.CONFLICT);
                        }
                    }
                }

                // Actualizar datos del personal con TODOS los campos editables
                try (PreparedStatement ps = conn.prepareStatement(
                        "UPDATE personal SET "
                        + "nombres_completos = ?, "
                        + "tipo_documento = ?::tipo_documento_personal, "
                        + "numero_documento = ?, "
                        + "sexo = ?::sexo_personal, "
                        + "estado_civil = ?::estado_civil_personal, "
                        + "fecha_nacimiento = ?, "
                        + "cargo = ?, "
                        + "area = ?, "
                        + "sede = ?, "
                        + "email_contacto = ?, "
                        + "email_personal = ?, "
                        + "telefono_fijo = ?, "
                        + "telefono_celular = ?, "
                        + "direccion = ?, "
                        + "referencia = ?, "
                        + "contacto_emergencia = ?, "
                        + "departamento_nombre = ?, "
                        + "provincia_nombre = ?, "
                        + "distrito_nombre = ?, "
                        + "ubigeo_codigo = ?, "
                        + "observaciones = ?, "
                        + "foto_url = ?, "
                        + "estado = ?::estado_registro, "
                        + "es_vendedor = ?, "
                        + "es_transportista = ? "
                        + "WHERE id = ?::uuid")) {
                    ps.setString(1, request.nombresCompletos());
                    ps.setString(2, request.tipoDocumento() != null ? request.tipoDocumento() : "DNI");
                    ps.setString(3, request.numeroDocumento());
                    ps.setString(4, request.sexo());
                    ps.setString(5, request.estadoCivil());
                    ps.setDate(6, request.fechaNacimiento() != null ? java.sql.Date.valueOf(request.fechaNacimiento()) : null);
                    ps.setString(7, request.cargo());
                    ps.setString(8, request.area());
                    ps.setString(9, request.sede());
                    ps.setString(10, request.emailContacto());
                    ps.setString(11, request.emailPersonal());
                    ps.setString(12, request.telefonoFijo());
                    ps.setString(13, request.telefonoCelular());
                    ps.setString(14, request.direccion());
                    ps.setString(15, request.referencia());
                    ps.setString(16, request.contactoEmergencia());
                    ps.setString(17, request.departamentoNombre());
                    ps.setString(18, request.provinciaNombre());
                    ps.setString(19, request.distritoNombre());
                    ps.setString(20, request.ubigeoCodigo());
                    ps.setString(21, request.observaciones());
                    ps.setString(22, request.fotoUrl());
                    ps.setString(23, request.estado());
                    ps.setBoolean(24, request.esVendedor() != null && request.esVendedor());
                    ps.setBoolean(25, request.esTransportista() != null && request.esTransportista());
                    ps.setString(26, id);
                    int updated = ps.executeUpdate();
                    if (updated == 0) {
                        throw new WebApplicationException("Personal no encontrado", Response.Status.NOT_FOUND);
                    }
                }

                conn.commit();
                return ResponseWrapper.ok(new PersonalResponse(id, usuarioIdStr, request.nombresCompletos(), null));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error al actualizar personal: " + e.getMessage(), Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================================
    // CHANGE PASSWORD
    // =========================================================================

    @PATCH
    @Path("/{id}/cambiar-clave")
    @Operation(summary = "Cambiar contraseña del personal")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<Map<String, Object>> cambiarClave(@PathParam("id") String id, @Valid CambiarClaveRequest request) {
        if (request.nuevaClave() == null || request.nuevaClave().length() < 6) {
            throw new WebApplicationException("La nueva contraseña debe tener al menos 6 caracteres",
                    Response.Status.BAD_REQUEST);
        }
        if (!request.nuevaClave().equals(request.confirmarClave())) {
            throw new WebApplicationException("Las contraseñas no coinciden",
                    Response.Status.BAD_REQUEST);
        }
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                String usuarioId;
                try (PreparedStatement ps = conn.prepareStatement(
                        "SELECT p.id, u.id AS usuario_id FROM personal p "
                        + "JOIN usuarios u ON u.id = p.usuario_id "
                        + "WHERE p.id = ?::uuid FOR UPDATE")) {
                    ps.setString(1, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (!rs.next()) {
                            throw new WebApplicationException("Personal no encontrado", Response.Status.NOT_FOUND);
                        }
                        usuarioId = rs.getString("usuario_id");
                    }
                }
                String hash = BCrypt.hashpw(request.nuevaClave(), BCrypt.gensalt());
                try (PreparedStatement ps = conn.prepareStatement(
                        "UPDATE usuarios SET clave_hash = ? WHERE id = ?::uuid")) {
                    ps.setString(1, hash);
                    ps.setString(2, usuarioId);
                    int updated = ps.executeUpdate();
                    if (updated == 0) {
                        throw new WebApplicationException("Usuario no encontrado", Response.Status.NOT_FOUND);
                    }
                }
                conn.commit();
                return ResponseWrapper.ok(Map.of(
                        "success", true,
                        "message", "Contraseña actualizada correctamente"
                ));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error al cambiar contraseña: " + e.getMessage(),
                    Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================================
    // PERMISOS endpoints
    // =========================================================================

    @GET
    @Path("/{id}/permisos")
    @Operation(summary = "Obtener permisos del personal")
    public ResponseWrapper<List<PersonalPermisoResponse>> listarPermisos(@PathParam("id") String id) {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT codigo_permiso, grupo FROM personal_permisos WHERE personal_id = ?::uuid ORDER BY grupo, codigo_permiso")) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                List<PersonalPermisoResponse> list = new ArrayList<>();
                while (rs.next()) {
                    list.add(new PersonalPermisoResponse(
                        rs.getString("codigo_permiso"),
                        rs.getString("grupo")
                    ));
                }
                return ResponseWrapper.ok(list);
            }
        } catch (Exception e) {
            throw new WebApplicationException("Error al listar permisos del personal", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    @PUT
    @Path("/{id}/permisos")
    @Operation(summary = "Reemplazar todos los permisos del personal")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<Map<String, Object>> reemplazarPermisos(
            @PathParam("id") String id, List<PersonalPermisoRequest> permisos) {
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // Verificar que el personal existe
                try (PreparedStatement ps = conn.prepareStatement(
                        "SELECT id FROM personal WHERE id = ?::uuid FOR UPDATE")) {
                    ps.setString(1, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (!rs.next()) {
                            throw new WebApplicationException("Personal no encontrado", Response.Status.NOT_FOUND);
                        }
                    }
                }

                // Eliminar permisos existentes
                try (PreparedStatement ps = conn.prepareStatement(
                        "DELETE FROM personal_permisos WHERE personal_id = ?::uuid")) {
                    ps.setString(1, id);
                    ps.executeUpdate();
                }

                // Insertar nuevos permisos
                if (permisos != null && !permisos.isEmpty()) {
                    try (PreparedStatement ps = conn.prepareStatement(
                            "INSERT INTO personal_permisos (personal_id, codigo_permiso, grupo) VALUES (?::uuid, ?, ?)")) {
                        for (PersonalPermisoRequest p : permisos) {
                            ps.setString(1, id);
                            ps.setString(2, p.codigoPermiso());
                            ps.setString(3, p.grupo());
                            ps.addBatch();
                        }
                        ps.executeBatch();
                    }
                }

                conn.commit();
                return ResponseWrapper.ok(Map.of(
                        "success", true,
                        "count", permisos != null ? permisos.size() : 0
                ));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error al actualizar permisos del personal: " + e.getMessage(),
                    Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================================
    // RECURSOS endpoints (rutas, almacenes, listas_precios)
    // =========================================================================

    @GET
    @Path("/{id}/recursos")
    @Operation(summary = "Obtener recursos asignados del personal")
    public ResponseWrapper<PersonalRecursosResponse> obtenerRecursos(@PathParam("id") String id) {
        try (Connection conn = dataSource.getConnection()) {
            // Verificar personal existe
            try (PreparedStatement ps = conn.prepareStatement("SELECT id FROM personal WHERE id = ?::uuid")) {
                ps.setString(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    if (!rs.next()) {
                        throw new WebApplicationException("Personal no encontrado", Response.Status.NOT_FOUND);
                    }
                }
            }

            // Rutas
            List<String> rutasIds = new ArrayList<>();
            List<String> rutasNombres = new ArrayList<>();
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT pmr.mapa_ruta_id, mr.nombre "
                    + "FROM personal_mapas_rutas pmr "
                    + "JOIN mapas_rutas mr ON mr.id = pmr.mapa_ruta_id "
                    + "WHERE pmr.personal_id = ?::uuid")) {
                ps.setString(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        rutasIds.add(rs.getString("mapa_ruta_id"));
                        rutasNombres.add(rs.getString("nombre"));
                    }
                }
            }

            // Almacenes
            List<String> almacenesIds = new ArrayList<>();
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT almacen_id FROM personal_almacenes WHERE personal_id = ?::uuid")) {
                ps.setString(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        almacenesIds.add(rs.getString("almacen_id"));
                    }
                }
            }

            // Listas de Precios
            List<String> listasIds = new ArrayList<>();
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT lista_precio_id FROM personal_listas_precios WHERE personal_id = ?::uuid")) {
                ps.setString(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        listasIds.add(rs.getString("lista_precio_id"));
                    }
                }
            }

            return ResponseWrapper.ok(new PersonalRecursosResponse(
                rutasIds, rutasNombres, almacenesIds, listasIds
            ));
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error al obtener recursos del personal", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    @PUT
    @Path("/{id}/recursos")
    @Operation(summary = "Reemplazar recursos asignados del personal")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<Map<String, Object>> reemplazarRecursos(
            @PathParam("id") String id, PersonalRecursosRequest request) {
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // Verificar personal existe
                try (PreparedStatement ps = conn.prepareStatement(
                        "SELECT id FROM personal WHERE id = ?::uuid FOR UPDATE")) {
                    ps.setString(1, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (!rs.next()) {
                            throw new WebApplicationException("Personal no encontrado", Response.Status.NOT_FOUND);
                        }
                    }
                }

                // Limpiar recursos existentes
                try (PreparedStatement ps = conn.prepareStatement(
                        "DELETE FROM personal_mapas_rutas WHERE personal_id = ?::uuid")) {
                    ps.setString(1, id);
                    ps.executeUpdate();
                }
                try (PreparedStatement ps = conn.prepareStatement(
                        "DELETE FROM personal_almacenes WHERE personal_id = ?::uuid")) {
                    ps.setString(1, id);
                    ps.executeUpdate();
                }
                try (PreparedStatement ps = conn.prepareStatement(
                        "DELETE FROM personal_listas_precios WHERE personal_id = ?::uuid")) {
                    ps.setString(1, id);
                    ps.executeUpdate();
                }

                // Insertar rutas
                if (request.rutasIds() != null) {
                    try (PreparedStatement ps = conn.prepareStatement(
                            "INSERT INTO personal_mapas_rutas (personal_id, mapa_ruta_id) VALUES (?::uuid, ?::uuid)")) {
                        for (String rutaId : request.rutasIds()) {
                            ps.setString(1, id);
                            ps.setString(2, rutaId);
                            ps.addBatch();
                        }
                        ps.executeBatch();
                    }
                }

                // Insertar almacenes
                if (request.almacenesIds() != null) {
                    try (PreparedStatement ps = conn.prepareStatement(
                            "INSERT INTO personal_almacenes (personal_id, almacen_id) VALUES (?::uuid, ?::uuid)")) {
                        for (String almId : request.almacenesIds()) {
                            ps.setString(1, id);
                            ps.setString(2, almId);
                            ps.addBatch();
                        }
                        ps.executeBatch();
                    }
                }

                // Insertar listas de precios
                if (request.listasPreciosIds() != null) {
                    try (PreparedStatement ps = conn.prepareStatement(
                            "INSERT INTO personal_listas_precios (personal_id, lista_precio_id) VALUES (?::uuid, ?::uuid)")) {
                        for (String lpId : request.listasPreciosIds()) {
                            ps.setString(1, id);
                            ps.setString(2, lpId);
                            ps.addBatch();
                        }
                        ps.executeBatch();
                    }
                }

                conn.commit();
                return ResponseWrapper.ok(Map.of("success", true));
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error al actualizar recursos del personal: " + e.getMessage(),
                    Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================================
    // DTOs / RECORDS
    // =========================================================================

    // --- CREATE REQUEST ---

    public record CrearPersonalRequest(
        @NotBlank String nombresCompletos,
        @NotBlank String usuario,
        @NotBlank @Email String correo,
        @NotBlank String clave,
        String tipoDocumento,
        @NotBlank String numeroDocumento,
        String sexo,
        String estadoCivil,
        String fechaNacimiento,
        String cargo,
        String area,
        String sede,
        String emailContacto,
        String emailPersonal,
        String telefonoFijo,
        String telefonoCelular,
        String direccion,
        String referencia,
        String contactoEmergencia,
        String departamentoNombre,
        String provinciaNombre,
        String distritoNombre,
        String ubigeoCodigo,
        String observaciones,
        String fotoUrl,
        String estado,
        Boolean esVendedor,
        Boolean esTransportista
    ) {}

    // --- UPDATE REQUEST ---

    public record ActualizarPersonalRequest(
        @NotBlank String nombresCompletos,
        String tipoDocumento,
        @NotBlank String numeroDocumento,
        String sexo,
        String estadoCivil,
        String fechaNacimiento,
        String cargo,
        String area,
        String sede,
        String emailContacto,
        String emailPersonal,
        String telefonoFijo,
        String telefonoCelular,
        String direccion,
        String referencia,
        String contactoEmergencia,
        String departamentoNombre,
        String provinciaNombre,
        String distritoNombre,
        String ubigeoCodigo,
        String observaciones,
        String fotoUrl,
        String estado,
        Boolean esVendedor,
        Boolean esTransportista
    ) {}

    // --- CHANGE PASSWORD REQUEST ---

    public record CambiarClaveRequest(
        @NotBlank String nuevaClave,
        @NotBlank String confirmarClave
    ) {}

    // --- PERMISO REQUEST ---

    public record PersonalPermisoRequest(
        String codigoPermiso,
        String grupo
    ) {}

    // --- PERMISO RESPONSE ---

    public record PersonalPermisoResponse(
        String codigoPermiso,
        String grupo
    ) {}

    // --- RECURSOS REQUEST ---

    public record PersonalRecursosRequest(
        List<String> rutasIds,
        List<String> almacenesIds,
        List<String> listasPreciosIds
    ) {}

    // --- RECURSOS RESPONSE ---

    public record PersonalRecursosResponse(
        List<String> rutasIds,
        List<String> rutasNombres,
        List<String> almacenesIds,
        List<String> listasPreciosIds
    ) {}

    // --- SIMPLE RESPONSE ---

    public record PersonalResponse(String id, String usuarioId, String nombresCompletos, String usuario) {}

    // --- LIST RESPONSE ---

    public record PersonalListResponse(
        String id,
        String nombresCompletos,
        String tipoDocumento,
        String numeroDocumento,
        String telefonoCelular,
        String emailContacto,
        boolean esVendedor,
        boolean esTransportista,
        String usuario,
        String estado,
        String cargo,
        String area,
        String sede,
        String ultimoAcceso
    ) {}

    // --- DETALLE RESPONSE (TODOS los campos) ---

    public record PersonalDetalleResponse(
        String id,
        String usuarioId,
        String nombresCompletos,
        String tipoDocumento,
        String numeroDocumento,
        String sexo,
        String estadoCivil,
        String fechaNacimiento,
        String cargo,
        String area,
        String sede,
        String emailContacto,
        String emailPersonal,
        String telefonoFijo,
        String telefonoCelular,
        String direccion,
        String referencia,
        String contactoEmergencia,
        String departamentoNombre,
        String provinciaNombre,
        String distritoNombre,
        String ubigeoCodigo,
        String observaciones,
        String fotoUrl,
        boolean esVendedor,
        boolean esTransportista,
        String usuario,
        String estado,
        String ultimoAcceso
    ) {}
}
