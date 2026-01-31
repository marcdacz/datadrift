package com.datadrift.domain;

/**
 * Supported data source kinds. Each type has type-specific configuration in the {@code config}
 * JSON; sensitive fields within config are encrypted at rest.
 */
public enum DataSourceType {
    CSV,
    JSON,
    REST,
    DATABASE
}
