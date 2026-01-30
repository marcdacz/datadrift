package com.datadrift.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class HealthControllerTest {

    @LocalServerPort private int port;

    @Test
    @DisplayName("GET /api/health returns 200 with status, app, and version")
    void health__when_requested__then_returns_ok_with_body() {
        given().baseUri("http://localhost")
                .port(port)
                .when()
                .get("/api/health")
                .then()
                .statusCode(200)
                .body("status", equalTo("ok"))
                .body("app", equalTo("DataDrift"))
                .body("version", equalTo("0.1.0"));
    }
}
