package com.datadrift.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * External data source configuration. Config is stored as JSON; sensitive fields within config are
 * encrypted at rest. No execution or connectivity logic in MVP.
 */
@Entity
@Table(name = "data_sources")
public class DataSource {

    @Id private UUID id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private DataSourceType type;

    /**
     * Type-specific configuration as JSON. Sensitive values are stored in encrypted form (e.g.
     * ENC(base64)).
     */
    @Column(name = "config", nullable = false, columnDefinition = "text")
    private String config;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected DataSource() {
        // JPA
    }

    public DataSource(
            final UUID id,
            final String name,
            final DataSourceType type,
            final String config,
            final Instant createdAt,
            final Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.config = config;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public DataSourceType getType() {
        return type;
    }

    public String getConfig() {
        return config;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    /** Updates mutable fields; used for edit. createdAt is never changed. */
    public void setName(final String name) {
        this.name = name;
    }

    public void setType(final DataSourceType type) {
        this.type = type;
    }

    public void setConfig(final String config) {
        this.config = config;
    }

    public void setUpdatedAt(final Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
