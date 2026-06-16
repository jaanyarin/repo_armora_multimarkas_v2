package com.armora.platform.api;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/version")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Platform")
public class VersionResource {

    @ConfigProperty(name = "app.version", defaultValue = "0.1.0-SNAPSHOT")
    String version;

    @ConfigProperty(name = "app.environment", defaultValue = "local")
    String environment;

    @GET
    @Operation(summary = "Version de la API")
    public ResponseWrapper<VersionResponse> version() {
        return ResponseWrapper.ok(new VersionResponse("armora-api", version, "v1", environment));
    }
}
