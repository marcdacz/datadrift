package com.datadrift.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Placeholder entity for JPA stub. */
@Entity
@Table(name = "system_info")
public class SystemInfo {

    @Id private UUID id;

    @Column(name = "key", nullable = false)
    private String key;

    @Column(name = "value")
    private String value;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected SystemInfo() {
        // JPA
    }

    public SystemInfo(
            final UUID id, final String key, final String value, final Instant createdAt) {
        this.id = id;
        this.key = key;
        this.value = value;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getKey() {
        return key;
    }

    public String getValue() {
        return value;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
