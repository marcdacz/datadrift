package com.datadrift.config;

import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Validates and provides the encryption key at startup. Fails startup if key is missing or invalid
 * (no silent fallback). Key must be Base64-encoded, 32 bytes after decoding (AES-256).
 */
@Configuration
public class EncryptionConfig {

    private static final int REQUIRED_KEY_BYTES = 32;

    @Bean
    public byte[] encryptionKey(@Value("${DATADRIFT_ENCRYPTION_KEY:}") final String rawKey) {
        if (rawKey == null || rawKey.isBlank()) {
            throw new IllegalStateException(
                    "DATADRIFT_ENCRYPTION_KEY is required. Set it in the environment or in a .env"
                            + " file at project root. Generate with: openssl rand -base64 32");
        }
        final byte[] key;
        try {
            key = Base64.getDecoder().decode(rawKey.trim());
        } catch (final IllegalArgumentException e) {
            throw new IllegalStateException(
                    "DATADRIFT_ENCRYPTION_KEY must be valid Base64. Generate with: openssl rand"
                            + " -base64 32",
                    e);
        }
        if (key.length != REQUIRED_KEY_BYTES) {
            throw new IllegalStateException(
                    "DATADRIFT_ENCRYPTION_KEY must decode to exactly "
                            + REQUIRED_KEY_BYTES
                            + " bytes (got "
                            + key.length
                            + "). Generate with: openssl rand -base64 32");
        }
        return key;
    }
}
