package com.armora.platform.auth;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.smallrye.jwt.build.Jwt;

@ApplicationScoped
public class TokenService {

    @Inject
    @ConfigProperty(name = "mp.jwt.verify.issuer", defaultValue = "armora-local")
    String issuer;

    public String generateToken(String usuarioId, String correo, String tipo) {
        return Jwt.issuer(issuer)
                .upn(correo)
                .claim("usuarioId", usuarioId)
                .claim("tipo", tipo)
                .groups(tipo)
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                .sign();
    }
}
