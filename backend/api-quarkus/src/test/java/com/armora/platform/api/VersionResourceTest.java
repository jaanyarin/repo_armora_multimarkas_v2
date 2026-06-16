package com.armora.platform.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class VersionResourceTest {

    @Test
    void returnsVersion() {
        given()
                .when().get("/api/v1/version")
                .then()
                .statusCode(200)
                .body("data.service", equalTo("armora-api"))
                .body("data.apiVersion", equalTo("v1"))
                .body("data.environment", equalTo("test"));
    }
}
