package com.datadrift.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.datadrift.domain.DataSourceType;
import com.datadrift.repository.DataSourceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@DataJpaTest
class DataSourceServiceTest {

    private static final byte[] TEST_KEY = "01234567890123456789012345678901".getBytes();

    @Autowired private DataSourceRepository dataSourceRepository;

    private DataSourceService dataSourceService;

    @BeforeEach
    void setUp() {
        EncryptionService encryptionService = new EncryptionService(TEST_KEY);
        dataSourceService =
                new DataSourceService(dataSourceRepository, encryptionService, new ObjectMapper());
    }

    @Test
    @DisplayName("create when valid input then persists and encrypts password in config")
    void create__when_valid_input__then_persists_and_encrypts_password() {
        final String config =
                "{\"url\":\"jdbc:postgresql://localhost/db\",\"password\":\"secret123\"}";
        final var created = dataSourceService.create("my-db", DataSourceType.DATABASE, config);
        assertEquals("my-db", created.getName());
        assertEquals(DataSourceType.DATABASE, created.getType());
        assertTrue(created.getConfig().contains("ENC("));
        assertTrue(created.getConfig().contains("url"));
        assertTrue(created.getConfig().contains("jdbc:postgresql"));
        assertTrue(!created.getConfig().contains("secret123"));
    }

    @Test
    @DisplayName("maskConfigForApi when config has password then masks value")
    void maskConfigForApi__when_config_has_password__then_masks_value() {
        final String config = "{\"host\":\"localhost\",\"password\":\"secret\"}";
        final String masked = dataSourceService.maskConfigForApi(config);
        assertTrue(masked.contains("\"password\":\"******\""));
        assertTrue(masked.contains("\"host\":\"localhost\""));
    }

    @Test
    @DisplayName("maskConfigForApi when config has ENC value then masks value")
    void maskConfigForApi__when_config_has_enc_value__then_masks_value() {
        final String encrypted = new EncryptionService(TEST_KEY).encrypt("secret");
        final String config = "{\"apiKey\":\"" + encrypted + "\"}";
        final String masked = dataSourceService.maskConfigForApi(config);
        assertTrue(masked.contains("\"apiKey\":\"******\""));
    }

    @Test
    @DisplayName("create when name blank then throws")
    void create__when_name_blank__then_throws() {
        final String config = "{}";
        assertThrows(
                IllegalArgumentException.class,
                () -> dataSourceService.create("", DataSourceType.CSV, config));
        assertThrows(
                IllegalArgumentException.class,
                () -> dataSourceService.create("   ", DataSourceType.CSV, config));
    }

    @Test
    @DisplayName("create when config invalid JSON then throws")
    void create__when_config_invalid_json__then_throws() {
        assertThrows(
                IllegalArgumentException.class,
                () -> dataSourceService.create("x", DataSourceType.CSV, "not json"));
    }

    @Test
    @DisplayName("create when duplicate name then throws")
    void create__when_duplicate_name__then_throws() {
        final String config = "{}";
        dataSourceService.create("unique-name", DataSourceType.JSON, config);
        assertThrows(
                IllegalArgumentException.class,
                () -> dataSourceService.create("unique-name", DataSourceType.CSV, config));
    }

    @Test
    @DisplayName("update when valid input then updates and re-encrypts config")
    void update__when_valid_input__then_updates_and_re_encrypts() {
        final String config = "{\"path\":\"/old.csv\",\"password\":\"old-secret\"}";
        final var created = dataSourceService.create("original", DataSourceType.CSV, config);
        final String newConfig = "{\"path\":\"/new.csv\",\"password\":\"new-secret\"}";
        final var updated =
                dataSourceService.update(
                        created.getId(), "renamed", DataSourceType.JSON, newConfig);
        assertEquals(created.getId(), updated.getId());
        assertEquals("renamed", updated.getName());
        assertEquals(DataSourceType.JSON, updated.getType());
        assertTrue(updated.getConfig().contains("ENC("));
        assertTrue(updated.getConfig().contains("/new.csv"));
        assertTrue(!updated.getConfig().contains("new-secret"));
    }

    @Test
    @DisplayName("update when id not found then throws")
    void update__when_id_not_found__then_throws() {
        assertThrows(
                DataSourceService.DataSourceNotFoundException.class,
                () ->
                        dataSourceService.update(
                                java.util.UUID.randomUUID(), "x", DataSourceType.CSV, "{}"));
    }

    @Test
    @DisplayName("update when name taken by another then throws")
    void update__when_name_taken_by_another__then_throws() {
        dataSourceService.create("other", DataSourceType.CSV, "{}");
        final var created = dataSourceService.create("mine", DataSourceType.JSON, "{}");
        assertThrows(
                IllegalArgumentException.class,
                () ->
                        dataSourceService.update(
                                created.getId(), "other", DataSourceType.JSON, "{}"));
    }
}
