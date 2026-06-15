package com.armora.platform.auth;

public record MeResponse(
        String id,
        String usuario,
        String correo,
        String tipo,
        String estado
) {
}
