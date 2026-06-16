package com.armora.platform.auth;

import static io.restassured.RestAssured.given;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class AuthResourceTest {

    @Test
    void loginFailsWithInvalidEmailFormat() {
        given()
                .contentType("application/json")
                .body("{\"correo\":\"admin\",\"clave\":\"admin\"}")
                .when().post("/api/v1/auth/login")
                .then()
                .statusCode(400);
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