package com.armora.platform.api;

public record VersionResponse(
        String service,
        String version,
        String apiVersion,
        String environment
) {
}
