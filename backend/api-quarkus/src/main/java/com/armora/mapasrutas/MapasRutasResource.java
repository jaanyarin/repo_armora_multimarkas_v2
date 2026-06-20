package com.armora.mapasrutas;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.armora.platform.api.ResponseWrapper;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("/mapas-rutas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Mapas de Rutas")
@RolesAllowed({"ADMINISTRADOR", "OPERADOR"})
public class MapasRutasResource {

    @Inject
    DataSource dataSource;

    @GET
    @Operation(summary = "Listar mapas de rutas")
    public ResponseWrapper<List<MapaRutaResponse>> listar(@QueryParam("q") String q) {
        try (Connection conn = dataSource.getConnection()) {
            StringBuilder sql = new StringBuilder(
                    "SELECT id, codigo, nombre, cant_rutas, estado, actualizado_en "
                    + "FROM mapas_rutas WHERE 1=1");
            List<Object> params = new ArrayList<>();

            if (q != null && !q.trim().isBlank()) {
                sql.append(" AND (codigo ILIKE ? OR nombre ILIKE ?)");
                String pattern = "%" + q.trim() + "%";
                params.add(pattern);
                params.add(pattern);
            }

            sql.append(" ORDER BY nombre");

            try (PreparedStatement ps = conn.prepareStatement(sql.toString())) {
                for (int i = 0; i < params.size(); i++) {
                    ps.setObject(i + 1, params.get(i));
                }

                try (ResultSet rs = ps.executeQuery()) {
                    List<MapaRutaResponse> list = new ArrayList<>();
                    while (rs.next()) {
                        Timestamp actualizado = rs.getTimestamp("actualizado_en");
                        list.add(new MapaRutaResponse(
                                rs.getString("id"),
                                rs.getString("codigo"),
                                rs.getString("nombre"),
                                rs.getInt("cant_rutas"),
                                rs.getString("estado"),
                                actualizado != null ? actualizado.toString() : null
                        ));
                    }
                    return ResponseWrapper.ok(list);
                }
            }
        } catch (Exception e) {
            throw new WebApplicationException("Error al listar mapas de rutas: " + e.getMessage(),
                    Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    public record MapaRutaResponse(
            String id,
            String codigo,
            String nombre,
            Integer cantRutas,
            String estado,
            String actualizadoEn
    ) {
    }
}
