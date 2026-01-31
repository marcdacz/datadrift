package com.datadrift;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

/**
 * Base class for REST API integration tests. Starts the full application with a random port and
 * provides a shared RestAssured request spec (base URI + port) so tests stay DRY and work in CI.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @LocalServerPort private int port;

    private RequestSpecification requestSpec;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void baseSetUp() {
        requestSpec = new RequestSpecBuilder().setBaseUri("http://localhost").setPort(port).build();
    }

    /** Request spec with base URI and port preconfigured for the running server. */
    protected RequestSpecification requestSpec() {
        return requestSpec;
    }

    /** Shared ObjectMapper for JSON request/response bodies. */
    protected ObjectMapper objectMapper() {
        return objectMapper;
    }
}
