package com.armora.ubigeo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.armora.platform.api.ResponseWrapper;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/ubigeo")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Ubigeo")
@PermitAll
public class UbigeoResource {

    @Inject
    DataSource dataSource;

    @GET
    @Path("/departamentos")
    @Operation(summary = "Listar departamentos del Peru")
    public ResponseWrapper<List<UbigeoResponse>> listarDepartamentos() {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT id, codigo, nombre FROM departamentos ORDER BY nombre")) {
            try (ResultSet rs = ps.executeQuery()) {
                List<UbigeoResponse> list = new ArrayList<>();
                while (rs.next()) {
                    list.add(new UbigeoResponse(rs.getString("id"), rs.getString("codigo"), rs.getString("nombre")));
                }
                return ResponseWrapper.ok(list);
            }
        } catch (Exception e) {
            throw new WebApplicationException("Error al listar departamentos", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    @GET
    @Path("/departamentos/{departamentoId}/provincias")
    @Operation(summary = "Listar provincias de un departamento")
    public ResponseWrapper<List<UbigeoResponse>> listarProvincias(@PathParam("departamentoId") String departamentoId) {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT id, codigo, nombre FROM provincias WHERE departamento_id = ?::uuid ORDER BY nombre")) {
            ps.setString(1, departamentoId);
            try (ResultSet rs = ps.executeQuery()) {
                List<UbigeoResponse> list = new ArrayList<>();
                while (rs.next()) {
                    list.add(new UbigeoResponse(rs.getString("id"), rs.getString("codigo"), rs.getString("nombre")));
                }
                return ResponseWrapper.ok(list);
            }
        } catch (Exception e) {
            throw new WebApplicationException("Error al listar provincias", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    @GET
    @Path("/provincias/{provinciaId}/distritos")
    @Operation(summary = "Listar distritos de una provincia")
    public ResponseWrapper<List<UbigeoResponse>> listarDistritos(@PathParam("provinciaId") String provinciaId) {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT id, codigo, nombre FROM distritos WHERE provincia_id = ?::uuid ORDER BY nombre")) {
            ps.setString(1, provinciaId);
            try (ResultSet rs = ps.executeQuery()) {
                List<UbigeoResponse> list = new ArrayList<>();
                while (rs.next()) {
                    list.add(new UbigeoResponse(rs.getString("id"), rs.getString("codigo"), rs.getString("nombre")));
                }
                return ResponseWrapper.ok(list);
            }
        } catch (Exception e) {
            throw new WebApplicationException("Error al listar distritos", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    @GET
    @Path("/provincias")
    @Operation(summary = "Listar todas las provincias")
    public ResponseWrapper<List<UbigeoResponse>> listarTodasProvincias() {
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(
                        "SELECT id, codigo, nombre FROM provincias ORDER BY nombre")) {
            try (ResultSet rs = ps.executeQuery()) {
                List<UbigeoResponse> list = new ArrayList<>();
                while (rs.next()) {
                    list.add(new UbigeoResponse(rs.getString("id"), rs.getString("codigo"), rs.getString("nombre")));
                }
                return ResponseWrapper.ok(list);
            }
        } catch (Exception e) {
            throw new WebApplicationException("Error al listar provincias", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    public record UbigeoResponse(String id, String codigo, String nombre) {}
}
