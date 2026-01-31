package com.datadrift.api;

import com.datadrift.domain.DataSourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for creating a data source. Accepts plaintext credentials; they are encrypted before
 * persistence.
 */
public record CreateDataSourceRequest(
        @NotBlank(message = "name is required") String name,
        @NotNull(message = "type is required") DataSourceType type,
        @NotBlank(message = "config is required and must be valid JSON") String config) {}
