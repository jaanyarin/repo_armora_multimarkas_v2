package com.armora.platform.api;

import java.time.OffsetDateTime;

public record HealthResponse(
        String status,
        String service,
        String environment,
        OffsetDateTime timestamp
) {
}
