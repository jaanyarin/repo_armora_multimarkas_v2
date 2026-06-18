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

    @POST
    @Operation(summary = "Crear personal")
    public ResponseWrapper<PersonalResponse> crear(@Valid CrearPersonalRequest request) {
        // 1. Crear usuario en tabla usuarios
        // 2. Crear registro en tabla personal
        // Usar transaccion con conn.setAutoCommit(false)
        // Hash de password con BCrypt
        // tipo_usuario = 'OPERADOR'
        // estado = 'ACTIVO'
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

                // Insertar personal
                UUID personalId;
                try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO personal (usuario_id, nombres_completos, tipo_documento, numero_documento, sexo, estado_civil, fecha_nacimiento, email_contacto, telefono_fijo, telefono_celular, direccion, referencia, es_vendedor, es_transportista, foto_url) VALUES (?, ?, ?::tipo_documento_personal, ?, ?::sexo_personal, ?::estado_civil_personal, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id")) {
                    ps.setObject(1, usuarioId);
                    ps.setString(2, request.nombresCompletos());
                    ps.setString(3, request.tipoDocumento() != null ? request.tipoDocumento() : "DNI");
                    ps.setString(4, request.numeroDocumento());
                    ps.setString(5, request.sexo());
                    ps.setString(6, request.estadoCivil());
                    ps.setDate(7, request.fechaNacimiento() != null ? java.sql.Date.valueOf(request.fechaNacimiento()) : null);
                    ps.setString(8, request.emailContacto());
                    ps.setString(9, request.telefonoFijo());
                    ps.setString(10, request.telefonoCelular());
                    ps.setString(11, request.direccion());
                    ps.setString(12, request.referencia());
                    ps.setBoolean(13, request.esVendedor() != null && request.esVendedor());
                    ps.setBoolean(14, request.esTransportista() != null && request.esTransportista());
                    ps.setString(15, request.fotoUrl());
                    try (ResultSet rs = ps.executeQuery()) {
                        rs.next();
                        personalId = UUID.fromString(rs.getString("id"));
                    }
                }

                conn.commit();
                return ResponseWrapper.ok(new PersonalResponse(personalId.toString(), usuarioId.toString(), request.nombresCompletos(), request.usuario()));
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

    @GET
    @Operation(summary = "Listar personal")
    public ResponseWrapper<List<PersonalListResponse>> listar() {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT p.id, p.nombres_completos, p.tipo_documento, p.numero_documento, p.telefono_celular, p.email_contacto, p.es_vendedor, p.es_transportista, u.usuario, u.estado, u.ultimo_acceso_en FROM personal p JOIN usuarios u ON u.id = p.usuario_id ORDER BY p.nombres_completos")) {
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
                        ultimoAcceso != null ? ultimoAcceso.toString() : null
                    ));
                }
                return ResponseWrapper.ok(list);
            }
        } catch (Exception e) {
            throw new WebApplicationException("Error al listar personal", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Obtener personal por ID")
    public ResponseWrapper<PersonalDetalleResponse> obtener(@PathParam("id") String id) {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT p.*, u.usuario, u.correo, u.estado, u.ultimo_acceso_en FROM personal p JOIN usuarios u ON u.id = p.usuario_id WHERE p.id = ?::uuid")) {
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
                    rs.getString("email_contacto"),
                    rs.getString("telefono_fijo"),
                    rs.getString("telefono_celular"),
                    rs.getString("direccion"),
                    rs.getString("referencia"),
                    rs.getString("usuario"),
                    rs.getString("estado"),
                    rs.getBoolean("es_vendedor"),
                    rs.getBoolean("es_transportista"),
                    ultimoAcceso != null ? ultimoAcceso.toString() : null
                ));
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error al obtener personal", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Actualizar personal")
    public ResponseWrapper<PersonalResponse> actualizar(@PathParam("id") String id, @Valid ActualizarPersonalRequest request) {
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // Verificar que el personal existe (con FOR UPDATE para bloquear fila)
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

                // Actualizar datos del personal con todos los campos editables
                try (PreparedStatement ps = conn.prepareStatement(
                        "UPDATE personal SET nombres_completos = ?, tipo_documento = ?::tipo_documento_personal, " +
                        "numero_documento = ?, sexo = ?::sexo_personal, estado_civil = ?::estado_civil_personal, " +
                        "fecha_nacimiento = ?, email_contacto = ?, telefono_fijo = ?, telefono_celular = ?, " +
                        "direccion = ?, referencia = ?, foto_url = ?, " +
                        "es_vendedor = ?, es_transportista = ? WHERE id = ?::uuid")) {
                    ps.setString(1, request.nombresCompletos());
                    ps.setString(2, request.tipoDocumento() != null ? request.tipoDocumento() : "DNI");
                    ps.setString(3, request.numeroDocumento());
                    ps.setString(4, request.sexo());
                    ps.setString(5, request.estadoCivil());
                    ps.setDate(6, request.fechaNacimiento() != null ? java.sql.Date.valueOf(request.fechaNacimiento()) : null);
                    ps.setString(7, request.emailContacto());
                    ps.setString(8, request.telefonoFijo());
                    ps.setString(9, request.telefonoCelular());
                    ps.setString(10, request.direccion());
                    ps.setString(11, request.referencia());
                    ps.setString(12, request.fotoUrl());
                    ps.setBoolean(13, request.esVendedor() != null && request.esVendedor());
                    ps.setBoolean(14, request.esTransportista() != null && request.esTransportista());
                    ps.setString(15, id);
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

    @PATCH
    @Path("/{id}/cambiar-clave")
    @Operation(summary = "Cambiar contraseña del personal")
    @RolesAllowed({"ADMINISTRADOR"})
    public ResponseWrapper<Map<String, Object>> cambiarClave(@PathParam("id") String id, @Valid CambiarClaveRequest request) {
        // Validar que nuevaClave tenga al menos 6 caracteres
        if (request.nuevaClave() == null || request.nuevaClave().length() < 6) {
            throw new WebApplicationException("La nueva contraseña debe tener al menos 6 caracteres",
                    Response.Status.BAD_REQUEST);
        }

        // Validar que nuevaClave y confirmarClave coincidan
        if (!request.nuevaClave().equals(request.confirmarClave())) {
            throw new WebApplicationException("Las contraseñas no coinciden",
                    Response.Status.BAD_REQUEST);
        }

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // Validar que el personal existe y obtener su usuario_id (con FOR UPDATE)
                String usuarioId;
                try (PreparedStatement ps = conn.prepareStatement(
                        "SELECT p.id, u.id AS usuario_id FROM personal p " +
                        "JOIN usuarios u ON u.id = p.usuario_id " +
                        "WHERE p.id = ?::uuid FOR UPDATE")) {
                    ps.setString(1, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (!rs.next()) {
                            throw new WebApplicationException("Personal no encontrado", Response.Status.NOT_FOUND);
                        }
                        usuarioId = rs.getString("usuario_id");
                    }
                }

                // Hashear la nueva contraseña
                String hash = BCrypt.hashpw(request.nuevaClave(), BCrypt.gensalt());

                // Actualizar la contraseña en la tabla usuarios
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

    // --- Records ---

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
        String emailContacto,
        String telefonoFijo,
        String telefonoCelular,
        String direccion,
        String referencia,
        Boolean esVendedor,
        Boolean esTransportista,
        String fotoUrl
    ) {}

    public record CambiarClaveRequest(
        @NotBlank String nuevaClave,
        @NotBlank String confirmarClave
    ) {}

    public record ActualizarPersonalRequest(
        @NotBlank String nombresCompletos,
        String tipoDocumento,
        @NotBlank String numeroDocumento,
        String sexo,
        String estadoCivil,
        String fechaNacimiento,
        String emailContacto,
        String telefonoFijo,
        String telefonoCelular,
        String direccion,
        String referencia,
        String fotoUrl,
        Boolean esVendedor,
        Boolean esTransportista
    ) {}

    public record PersonalResponse(String id, String usuarioId, String nombresCompletos, String usuario) {}

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
        String ultimoAcceso
    ) {}

    public record PersonalDetalleResponse(
        String id,
        String usuarioId,
        String nombresCompletos,
        String tipoDocumento,
        String numeroDocumento,
        String sexo,
        String estadoCivil,
        String fechaNacimiento,
        String emailContacto,
        String telefonoFijo,
        String telefonoCelular,
        String direccion,
        String referencia,
        String usuario,
        String estado,
        boolean esVendedor,
        boolean esTransportista,
        String ultimoAcceso
    ) {}
}


