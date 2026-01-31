package com.datadrift.api;

import com.datadrift.domain.DataSourceType;
import java.time.Instant;
import java.util.UUID;

/**
 * Data source as returned by the API. Sensitive fields in config are masked (e.g. "password":
 * "******"); decrypted secrets are never returned.
 */
public record DataSourceResponse(
        UUID id,
        String name,
        DataSourceType type,
        String config,
        Instant createdAt,
        Instant updatedAt) {}
