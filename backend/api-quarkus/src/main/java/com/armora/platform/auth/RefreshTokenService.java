package com.armora.platform.auth;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class RefreshTokenService {

    private final Map<String, RefreshTokenInfo> store = new ConcurrentHashMap<>();

    @Inject
    TokenService tokenService;

    public record RefreshTokenInfo(String usuarioId, String correo, String tipo, Instant expiresAt) {}

    public TokenPair generatePair(String usuarioId, String correo, String tipo) {
        String accessToken = tokenService.generateToken(usuarioId, correo, tipo);
        String refreshToken = UUID.randomUUID().toString();
        store.put(refreshToken, new RefreshTokenInfo(usuarioId, correo, tipo,
                Instant.now().plusSeconds(7 * 86400)));
        return new TokenPair(accessToken, refreshToken, 86400);
    }

    public TokenPair refresh(String refreshToken) {
        RefreshTokenInfo info = store.remove(refreshToken);
        if (info == null || info.expiresAt().isBefore(Instant.now())) {
            return null;
        }
        return generatePair(info.usuarioId(), info.correo(), info.tipo());
    }

    public void invalidate(String refreshToken) {
        store.remove(refreshToken);
    }
}
