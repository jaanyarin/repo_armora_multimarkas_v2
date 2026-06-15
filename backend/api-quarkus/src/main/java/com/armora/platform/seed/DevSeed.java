package com.armora.platform.seed;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.sql.DataSource;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.mindrot.jbcrypt.BCrypt;

import io.quarkus.runtime.StartupEvent;

@ApplicationScoped
public class DevSeed {

    @Inject
    DataSource dataSource;

    @ConfigProperty(name = "app.environment", defaultValue = "local")
    String environment;

    @ConfigProperty(name = "seed.admin.password", defaultValue = "admin123")
    String adminPassword;

    void onStart(@Observes StartupEvent ev) {
        if (!"local".equals(environment) && !"dev".equals(environment) && !"test".equals(environment)) {
            return;
        }
        try (Connection conn = dataSource.getConnection()) {
            String adminEmail = "admin@armora.dev";
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT id FROM usuarios WHERE correo = ?")) {
                ps.setString(1, adminEmail);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        return;
                    }
                }
            }
            String hash = BCrypt.hashpw(adminPassword, BCrypt.gensalt());
            try (PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO usuarios (usuario, correo, clave_hash, tipo, estado) VALUES (?, ?, ?, 'ADMINISTRADOR', 'ACTIVO')")) {
                ps.setString(1, "admin");
                ps.setString(2, adminEmail);
                ps.setString(3, hash);
                ps.executeUpdate();
            }
        } catch (Exception e) {
            throw new RuntimeException("Error creando seed admin", e);
        }
    }
}
