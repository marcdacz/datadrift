package com.datadrift.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.datadrift.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class HealthControllerTest extends BaseIntegrationTest {

    @Test
    @DisplayName("GET /api/health returns 200 with status, app, and version")
    void health__when_requested__then_returns_ok_with_body() {
        given(requestSpec())
                .when()
                .get("/api/health")
                .then()
                .statusCode(200)
                .body("status", equalTo("ok"))
                .body("app", equalTo("DataDrift"))
                .body("version", equalTo("0.1.0"));
    }
}
