package com.datadrift.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class EncryptionServiceTest {

    private static final byte[] KEY_32_BYTES = "01234567890123456789012345678901".getBytes();

    private EncryptionService encryptionService;

    @BeforeEach
    void setUp() {
        encryptionService = new EncryptionService(KEY_32_BYTES);
    }

    @Test
    @DisplayName("encrypt when given plaintext then returns ENC(base64) format")
    void encrypt__when_given_plaintext__then_returns_enc_format() {
        final String plain = "secret-password";
        final String result = encryptionService.encrypt(plain);
        assertTrue(result.startsWith("ENC("));
        assertTrue(result.endsWith(")"));
        assertTrue(encryptionService.isEncrypted(result));
    }

    @Test
    @DisplayName("decrypt when given encrypted value then returns original plaintext")
    void decrypt__when_given_encrypted__then_returns_original() {
        final String plain = "my-api-token";
        final String encrypted = encryptionService.encrypt(plain);
        final String decrypted = encryptionService.decrypt(encrypted);
        assertEquals(plain, decrypted);
    }

    @Test
    @DisplayName("encrypt when called twice then produces different ciphertext (random IV)")
    void encrypt__when_called_twice__then_different_ciphertext() {
        final String plain = "same";
        final String a = encryptionService.encrypt(plain);
        final String b = encryptionService.encrypt(plain);
        assertTrue(encryptionService.isEncrypted(a));
        assertTrue(encryptionService.isEncrypted(b));
        assertEquals(plain, encryptionService.decrypt(a));
        assertEquals(plain, encryptionService.decrypt(b));
        assertFalse(a.equals(b));
    }

    @Test
    @DisplayName("isEncrypted when value is ENC(...) then returns true")
    void isEncrypted__when_value_is_enc_format__then_returns_true() {
        final String encrypted = encryptionService.encrypt("x");
        assertTrue(encryptionService.isEncrypted(encrypted));
        assertTrue(encryptionService.isEncrypted("ENC(abc)"));
    }

    @Test
    @DisplayName("isEncrypted when value is plaintext then returns false")
    void isEncrypted__when_value_is_plaintext__then_returns_false() {
        assertFalse(encryptionService.isEncrypted("plain"));
        assertFalse(encryptionService.isEncrypted("ENC("));
        assertFalse(encryptionService.isEncrypted("ENC()"));
        assertFalse(encryptionService.isEncrypted(null));
    }

    @Test
    @DisplayName("decrypt when value is not ENC format then throws")
    void decrypt__when_value_not_enc_format__then_throws() {
        assertThrows(IllegalArgumentException.class, () -> encryptionService.decrypt("plain"));
        assertThrows(
                IllegalArgumentException.class,
                () -> encryptionService.decrypt("ENC(not-valid-base64!!)"));
    }

    @Test
    @DisplayName("encrypt when null or empty then returns as-is")
    void encrypt__when_null_or_empty__then_returns_as_is() {
        assertEquals(null, encryptionService.encrypt(null));
        assertEquals("", encryptionService.encrypt(""));
    }
}
