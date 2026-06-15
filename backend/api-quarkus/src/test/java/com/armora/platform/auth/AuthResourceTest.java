package com.armora.platform.auth;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class AuthResourceTest {

    @Test
    void loginFailsWithInvalidCredentials() {
        given()
                .contentType("application/json")
                .body("{\"correo\":\"nonexistent@test.com\",\"clave\":\"wrong\"}")
                .when().post("/api/v1/auth/login")
                .then()
                .statusCode(401);
    }

    @Test
    void loginFailsWithEmptyBody() {
        given()
                .contentType("application/json")
                .body("{}")
                .when().post("/api/v1/auth/login")
                .then()
                .statusCode(400);
    }
}
