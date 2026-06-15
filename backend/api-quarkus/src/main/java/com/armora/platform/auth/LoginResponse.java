package com.armora.platform.auth;

public record LoginResponse(
        String token,
        String refreshToken,
        long expiresIn,
        String tipo,
        String correo
) {
    public LoginResponse(TokenPair pair, String tipo, String correo) {
        this(pair.accessToken(), pair.refreshToken(), pair.expiresIn(), tipo, correo);
    }
}
