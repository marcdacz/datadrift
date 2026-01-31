-- Data sources: external system or file configuration.
-- config stores type-specific JSON; sensitive fields are encrypted at rest.

CREATE TABLE data_sources (
    id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    config TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uq_data_sources_name UNIQUE (name)
);

CREATE INDEX idx_data_sources_name ON data_sources (name);
CREATE INDEX idx_data_sources_type ON data_sources (type);
