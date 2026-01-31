package com.datadrift.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

import com.datadrift.BaseIntegrationTest;
import com.datadrift.repository.DataSourceRepository;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class DataSourcesControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired private DataSourceRepository dataSourceRepository;

    @Test
    @DisplayName(
            "POST /api/data-sources when valid body then creates and returns 201 with masked config")
    void create__when_valid_body__then_creates_and_returns_201_with_masked_config()
            throws Exception {
        final String uniqueName = "test-rest-" + System.currentTimeMillis();
        final String body =
                objectMapper()
                        .writeValueAsString(
                                Map.of(
                                        "name", uniqueName,
                                        "type", "REST",
                                        "config",
                                                "{\"url\":\"https://api.example.com\",\"apiKey\":\"secret-key-123\"}"));

        final String id =
                given(requestSpec())
                        .contentType("application/json")
                        .body(body)
                        .when()
                        .post("/api/data-sources")
                        .then()
                        .statusCode(201)
                        .body("id", notNullValue())
                        .body("name", notNullValue())
                        .body("type", equalTo("REST"))
                        .body("config", notNullValue())
                        .body("createdAt", notNullValue())
                        .body("updatedAt", notNullValue())
                        .extract()
                        .path("id");
        // Encrypted data is stored (sensitive value not in plaintext in DB).
        org.hamcrest.MatcherAssert.assertThat(
                dataSourceRepository.findByName(uniqueName).orElseThrow().getConfig(),
                org.hamcrest.Matchers.containsString("ENC("));
        org.hamcrest.MatcherAssert.assertThat(
                dataSourceRepository.findByName(uniqueName).orElseThrow().getConfig(),
                org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("secret-key-123")));
        // Sensitive field must be masked on read (never return plaintext secret).
        final String configJson =
                given(requestSpec())
                        .when()
                        .get("/api/data-sources/" + id)
                        .then()
                        .statusCode(200)
                        .extract()
                        .path("config");
        org.hamcrest.MatcherAssert.assertThat(
                configJson,
                org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("secret-key-123")));
        org.hamcrest.MatcherAssert.assertThat(
                configJson, org.hamcrest.Matchers.containsString("******"));
    }

    @Test
    @DisplayName("GET /api/data-sources when empty then returns 200 and empty list")
    void list__when_empty__then_returns_200_and_empty_list() {
        dataSourceRepository.deleteAll();
        given(requestSpec())
                .when()
                .get("/api/data-sources")
                .then()
                .statusCode(200)
                .body("size()", equalTo(0));
    }

    @Test
    @DisplayName("GET /api/data-sources/{id} when not found then returns 404")
    void getById__when_not_found__then_returns_404() {
        given(requestSpec())
                .when()
                .get("/api/data-sources/00000000-0000-0000-0000-000000000000")
                .then()
                .statusCode(404)
                .body("error", notNullValue());
    }

    @Test
    @DisplayName("DELETE /api/data-sources/{id} when not found then returns 404")
    void deleteById__when_not_found__then_returns_404() {
        given(requestSpec())
                .when()
                .delete("/api/data-sources/00000000-0000-0000-0000-000000000000")
                .then()
                .statusCode(404);
    }

    @Test
    @DisplayName("POST /api/data-sources when invalid JSON config then returns 400")
    void create__when_invalid_json_config__then_returns_400() throws Exception {
        final String body =
                objectMapper()
                        .writeValueAsString(
                                Map.of("name", "x", "type", "CSV", "config", "not valid json"));
        given(requestSpec())
                .contentType("application/json")
                .body(body)
                .when()
                .post("/api/data-sources")
                .then()
                .statusCode(400)
                .body("error", notNullValue());
    }

    @Test
    @DisplayName("POST /api/data-sources when missing name then returns 400")
    void create__when_missing_name__then_returns_400() throws Exception {
        final String body =
                objectMapper().writeValueAsString(Map.of("type", "CSV", "config", "{}"));
        given(requestSpec())
                .contentType("application/json")
                .body(body)
                .when()
                .post("/api/data-sources")
                .then()
                .statusCode(400)
                .body("error", notNullValue());
    }

    @Test
    @DisplayName("PUT /api/data-sources/{id} when valid body then updates and returns 200")
    void update__when_valid_body__then_updates_and_returns_200() throws Exception {
        final String createBody =
                objectMapper()
                        .writeValueAsString(
                                Map.of(
                                        "name", "to-update-" + System.currentTimeMillis(),
                                        "type", "CSV",
                                        "config", "{\"path\":\"/old.csv\"}"));
        final String id =
                given(requestSpec())
                        .contentType("application/json")
                        .body(createBody)
                        .when()
                        .post("/api/data-sources")
                        .then()
                        .statusCode(201)
                        .extract()
                        .path("id");
        final String updateBody =
                objectMapper()
                        .writeValueAsString(
                                Map.of(
                                        "name", "updated-name-" + System.currentTimeMillis(),
                                        "type", "REST",
                                        "config",
                                                "{\"url\":\"https://api.example.com\",\"apiKey\":\"new-token\"}"));
        given(requestSpec())
                .contentType("application/json")
                .body(updateBody)
                .when()
                .put("/api/data-sources/" + id)
                .then()
                .statusCode(200)
                .body("id", equalTo(id))
                .body("name", org.hamcrest.Matchers.startsWith("updated-name-"))
                .body("type", equalTo("REST"))
                .body("config", notNullValue())
                .body("config", org.hamcrest.Matchers.containsString("******"));
    }

    @Test
    @DisplayName("PUT /api/data-sources/{id} when not found then returns 404")
    void update__when_not_found__then_returns_404() throws Exception {
        final String body =
                objectMapper()
                        .writeValueAsString(Map.of("name", "x", "type", "CSV", "config", "{}"));
        given(requestSpec())
                .contentType("application/json")
                .body(body)
                .when()
                .put("/api/data-sources/00000000-0000-0000-0000-000000000000")
                .then()
                .statusCode(404)
                .body("error", notNullValue());
    }
}
