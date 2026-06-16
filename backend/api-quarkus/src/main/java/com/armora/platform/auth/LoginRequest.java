package com.armora.platform.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String identificador,
        @NotBlank String clave
) {
}
