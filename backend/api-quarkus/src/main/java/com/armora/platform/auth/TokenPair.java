package com.armora.platform.auth;

public record TokenPair(
        String accessToken,
        String refreshToken,
        long expiresIn
) {}
