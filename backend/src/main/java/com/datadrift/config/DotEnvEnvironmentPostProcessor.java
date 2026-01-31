package com.datadrift.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

/**
 * Loads a {@code .env} file from the working directory if present, and adds its entries to the
 * environment. Environment variables take precedence over .env values.
 */
public class DotEnvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String ENV_FILE = ".env";
    private static final String PROPERTY_SOURCE_NAME = "dotenv";

    @Override
    public void postProcessEnvironment(
            final ConfigurableEnvironment environment, final SpringApplication application) {
        final Path envPath = Path.of(System.getProperty("user.dir"), ENV_FILE);
        if (!Files.isRegularFile(envPath)) {
            return;
        }
        final Map<String, Object> map = new HashMap<>();
        try {
            for (final String line : Files.readAllLines(envPath)) {
                final String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                    continue;
                }
                final int eq = trimmed.indexOf('=');
                if (eq <= 0) {
                    continue;
                }
                final String key = trimmed.substring(0, eq).trim();
                String value = trimmed.substring(eq + 1).trim();
                if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
                    value = value.substring(1, value.length() - 1).replace("\\\"", "\"");
                } else if (value.startsWith("'") && value.endsWith("'") && value.length() >= 2) {
                    value = value.substring(1, value.length() - 1);
                }
                map.put(key, value);
            }
        } catch (final IOException e) {
            throw new IllegalStateException("Failed to read " + envPath + ": " + e.getMessage(), e);
        }
        if (!map.isEmpty()) {
            environment
                    .getPropertySources()
                    .addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, map));
        }
    }
}
