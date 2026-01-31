package com.datadrift.service;

import com.datadrift.domain.DataSource;
import com.datadrift.domain.DataSourceType;
import com.datadrift.repository.DataSourceRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles validation, encryption of sensitive config fields before persistence, and masking of
 * secrets on read. No execution or connectivity logic in MVP.
 */
@Service
public class DataSourceService {

    private static final Logger LOG = LoggerFactory.getLogger(DataSourceService.class);
    private static final String MASKED_VALUE = "******";

    /** Config keys whose values are encrypted at rest and masked on API read. */
    private static final Set<String> SENSITIVE_KEYS =
            Set.of(
                    "password",
                    "passwd",
                    "apiKey",
                    "api_key",
                    "token",
                    "access_token",
                    "secret",
                    "credentials");

    private final DataSourceRepository dataSourceRepository;
    private final EncryptionService encryptionService;
    private final ObjectMapper objectMapper;

    public DataSourceService(
            final DataSourceRepository dataSourceRepository,
            final EncryptionService encryptionService,
            final ObjectMapper objectMapper) {
        this.dataSourceRepository = dataSourceRepository;
        this.encryptionService = encryptionService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public DataSource create(
            final String name, final DataSourceType type, final String configJson) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        if (type == null) {
            throw new IllegalArgumentException("type is required");
        }
        if (dataSourceRepository.existsByName(name.trim())) {
            throw new IllegalArgumentException("name must be unique: " + name);
        }
        validateConfigJson(configJson);
        final String encryptedConfig = encryptSensitiveValues(configJson);
        final Instant now = Instant.now();
        final UUID id = UUID.randomUUID();
        final DataSource entity = new DataSource(id, name.trim(), type, encryptedConfig, now, now);
        return dataSourceRepository.save(entity);
    }

    public List<DataSource> findAll() {
        return dataSourceRepository.findAll();
    }

    public DataSource getById(final UUID id) {
        return dataSourceRepository
                .findById(id)
                .orElseThrow(() -> new DataSourceNotFoundException("Data source not found: " + id));
    }

    @Transactional
    public DataSource update(
            final UUID id, final String name, final DataSourceType type, final String configJson) {
        final DataSource entity =
                dataSourceRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new DataSourceNotFoundException(
                                                "Data source not found: " + id));
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        if (type == null) {
            throw new IllegalArgumentException("type is required");
        }
        if (dataSourceRepository.existsByNameAndIdNot(name.trim(), id)) {
            throw new IllegalArgumentException("name must be unique: " + name);
        }
        validateConfigJson(configJson);
        final String encryptedConfig = encryptSensitiveValues(configJson);
        entity.setName(name.trim());
        entity.setType(type);
        entity.setConfig(encryptedConfig);
        entity.setUpdatedAt(Instant.now());
        return dataSourceRepository.save(entity);
    }

    @Transactional
    public void deleteById(final UUID id) {
        if (!dataSourceRepository.existsById(id)) {
            throw new DataSourceNotFoundException("Data source not found: " + id);
        }
        dataSourceRepository.deleteById(id);
    }

    /**
     * Returns config JSON with sensitive fields masked (e.g. "password": "******"). Never returns
     * decrypted secrets.
     */
    public String maskConfigForApi(final String configJson) {
        if (configJson == null || configJson.isBlank()) {
            return configJson;
        }
        try {
            final JsonNode root = objectMapper.readTree(configJson);
            if (!root.isObject()) {
                return configJson;
            }
            final JsonNode masked = maskSensitiveInObject((ObjectNode) root);
            return objectMapper.writeValueAsString(masked);
        } catch (final JsonProcessingException e) {
            LOG.warn("Could not mask config JSON, returning as-is: {}", e.getMessage());
            return configJson;
        }
    }

    private void validateConfigJson(final String configJson) {
        if (configJson == null || configJson.isBlank()) {
            throw new IllegalArgumentException("config is required and must be valid JSON");
        }
        try {
            objectMapper.readTree(configJson);
        } catch (final JsonProcessingException e) {
            throw new IllegalArgumentException("config must be valid JSON: " + e.getMessage());
        }
    }

    /** Encrypts only sensitive leaf values; non-sensitive values remain plaintext. */
    private String encryptSensitiveValues(final String configJson) {
        try {
            final JsonNode root = objectMapper.readTree(configJson);
            if (!root.isObject()) {
                return configJson;
            }
            encryptSensitiveInObject((ObjectNode) root);
            return objectMapper.writeValueAsString(root);
        } catch (final JsonProcessingException e) {
            throw new IllegalStateException("Failed to encrypt config", e);
        }
    }

    private void encryptSensitiveInObject(final ObjectNode node) {
        node.fields()
                .forEachRemaining(
                        entry -> {
                            final String key = entry.getKey();
                            final JsonNode value = entry.getValue();
                            if (value != null && value.isTextual()) {
                                final String str = value.asText();
                                if (isSensitiveKey(key) && !encryptionService.isEncrypted(str)) {
                                    final String encrypted = encryptionService.encrypt(str);
                                    node.put(key, encrypted);
                                }
                            } else if (value != null && value.isObject()) {
                                encryptSensitiveInObject((ObjectNode) value);
                            }
                        });
    }

    private JsonNode maskSensitiveInObject(final ObjectNode node) {
        final ObjectNode copy = node.deepCopy();
        copy.fields()
                .forEachRemaining(
                        entry -> {
                            final String key = entry.getKey();
                            final JsonNode value = entry.getValue();
                            if (value != null && value.isTextual()) {
                                if (isSensitiveKey(key)
                                        || encryptionService.isEncrypted(value.asText())) {
                                    copy.put(key, MASKED_VALUE);
                                }
                            } else if (value != null && value.isObject()) {
                                copy.set(key, maskSensitiveInObject((ObjectNode) value));
                            }
                        });
        return copy;
    }

    private boolean isSensitiveKey(final String key) {
        if (key == null || key.isBlank()) {
            return false;
        }
        return SENSITIVE_KEYS.stream().anyMatch(s -> s.equalsIgnoreCase(key));
    }

    /** Thrown when a data source is not found (e.g. get or delete by id). */
    public static final class DataSourceNotFoundException extends RuntimeException {
        public DataSourceNotFoundException(final String message) {
            super(message);
        }
    }
}
