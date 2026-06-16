package com.armora.platform.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class HealthResourceTest {

    @Test
    void returnsHealthStatus() {
        given()
                .when().get("/api/v1/health")
                .then()
                .statusCode(200)
                .body("data.status", equalTo("UP"))
                .body("data.service", equalTo("armora-api"))
                .body("data.environment", equalTo("test"))
                .body("data.timestamp", notNullValue());
    }
}
