package com.armora.platform.api;

import java.time.OffsetDateTime;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Platform")
public class HealthResource {

    @ConfigProperty(name = "app.environment", defaultValue = "local")
    String environment;

    @GET
    @Operation(summary = "Health check publico de la API")
    public ResponseWrapper<HealthResponse> health() {
        return ResponseWrapper.ok(new HealthResponse("UP", "armora-api", environment, OffsetDateTime.now()));
    }
}
