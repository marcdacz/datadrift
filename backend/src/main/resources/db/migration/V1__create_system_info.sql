-- Initial schema for system_info placeholder entity.
-- Reversible: drop table system_info;

CREATE TABLE system_info (
    id UUID NOT NULL PRIMARY KEY,
    "key" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255),
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_system_info_key ON system_info ("key");
