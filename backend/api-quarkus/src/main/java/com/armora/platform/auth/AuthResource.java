package com.armora.platform.auth;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.sql.DataSource;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.mindrot.jbcrypt.BCrypt;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Auth")
public class AuthResource {

    @Inject
    DataSource dataSource;

    @Inject
    TokenService tokenService;

    @Inject
    RefreshTokenService refreshTokenService;

    @Inject
    JsonWebToken jwt;

    @POST
    @Path("/login")
    @PermitAll
    @Operation(summary = "Iniciar sesion y obtener token JWT")
    public LoginResponse login(@Valid LoginRequest request) {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT id, usuario, correo, clave_hash, tipo, estado FROM usuarios WHERE correo = ?")) {
            ps.setString(1, request.correo());
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    throw new WebApplicationException("Credenciales invalidas", Response.Status.UNAUTHORIZED);
                }
                String hash = rs.getString("clave_hash");
                if (!BCrypt.checkpw(request.clave(), hash)) {
                    throw new WebApplicationException("Credenciales invalidas", Response.Status.UNAUTHORIZED);
                }
                String id = rs.getString("id");
                String correo = rs.getString("correo");
                String tipo = rs.getString("tipo");
                TokenPair pair = refreshTokenService.generatePair(id, correo, tipo);
                return new LoginResponse(pair, tipo, correo);
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error interno", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    @POST
    @Path("/refresh")
    @PermitAll
    @Operation(summary = "Renovar token JWT con refresh token")
    public LoginResponse refresh(@Valid RefreshRequest request) {
        try {
            TokenPair pair = refreshTokenService.refresh(request.refreshToken());
            if (pair == null) {
                throw new WebApplicationException("Refresh token invalido o expirado", Response.Status.UNAUTHORIZED);
            }
            return new LoginResponse(pair, "DESCONOCIDO", "");
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error interno", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    @POST
    @Path("/logout")
    @PermitAll
    @Operation(summary = "Invalidar refresh token")
    public Response logout(@Valid RefreshRequest request) {
        refreshTokenService.invalidate(request.refreshToken());
        return Response.ok("{\"mensaje\":\"Sesion cerrada\"}").build();
    }

    @GET
    @Path("/me")
    @RolesAllowed({"ADMINISTRADOR", "OPERADOR", "CLIENTE", "PROVEEDOR"})
    @Operation(summary = "Obtener informacion del usuario autenticado")
    public MeResponse me() {
        String id = jwt.getClaim("usuarioId");
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT id, usuario, correo, tipo, estado FROM usuarios WHERE id = ?::uuid")) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    throw new WebApplicationException("Usuario no encontrado", Response.Status.NOT_FOUND);
                }
                return new MeResponse(
                        rs.getString("id"),
                        rs.getString("usuario"),
                        rs.getString("correo"),
                        rs.getString("tipo"),
                        rs.getString("estado"));
            }
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            throw new WebApplicationException("Error interno", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    public record RefreshRequest(@NotBlank String refreshToken) {}
}
