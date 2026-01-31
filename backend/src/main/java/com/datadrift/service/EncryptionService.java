package com.datadrift.service;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

/**
 * AES-256-GCM authenticated encryption for sensitive config values. Encrypted values are
 * identifiable via ENC(base64) prefix so we never decrypt non-encrypted strings. Random IV per
 * encryption.
 */
@Service
public class EncryptionService {

    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH_BYTES = 12;
    private static final int GCM_TAG_LENGTH_BITS = 128;
    private static final String ENC_PREFIX = "ENC(";
    private static final String ENC_SUFFIX = ")";

    private final byte[] key;
    private final SecureRandom secureRandom;

    public EncryptionService(final byte[] encryptionKey) {
        this.key = encryptionKey.clone();
        this.secureRandom = new SecureRandom();
    }

    /**
     * Encrypts a plaintext value. Result is ENC(base64(ciphertext)) so it can be detected and
     * decrypted later without storing IV separately (IV is prepended to ciphertext).
     */
    public String encrypt(final String plaintext) {
        if (plaintext == null || plaintext.isEmpty()) {
            return plaintext;
        }
        try {
            final byte[] iv = new byte[GCM_IV_LENGTH_BYTES];
            secureRandom.nextBytes(iv);
            final Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            final GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, "AES"), spec);
            final byte[] plain = plaintext.getBytes(StandardCharsets.UTF_8);
            final byte[] ciphertext = cipher.doFinal(plain);
            final ByteBuffer buf = ByteBuffer.allocate(iv.length + ciphertext.length);
            buf.put(iv);
            buf.put(ciphertext);
            final String encoded = Base64.getEncoder().encodeToString(buf.array());
            return ENC_PREFIX + encoded + ENC_SUFFIX;
        } catch (final Exception e) {
            throw new IllegalStateException("Encryption failed", e);
        }
    }

    /**
     * Decrypts a value previously produced by {@link #encrypt}. Only call for values that {@link
     * #isEncrypted} returns true for; never decrypt untrusted or non-encrypted strings.
     */
    public String decrypt(final String encrypted) {
        if (!isEncrypted(encrypted)) {
            throw new IllegalArgumentException("Value is not in ENC(...) format");
        }
        final String payload =
                encrypted.substring(ENC_PREFIX.length(), encrypted.length() - ENC_SUFFIX.length());
        final byte[] raw;
        try {
            raw = Base64.getDecoder().decode(payload);
        } catch (final IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid ENC payload: not valid Base64", e);
        }
        if (raw.length < GCM_IV_LENGTH_BYTES) {
            throw new IllegalArgumentException("Invalid ENC payload: too short");
        }
        try {
            final ByteBuffer buf = ByteBuffer.wrap(raw);
            final byte[] iv = new byte[GCM_IV_LENGTH_BYTES];
            buf.get(iv);
            final byte[] ciphertext = new byte[buf.remaining()];
            buf.get(ciphertext);
            final Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            final GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, "AES"), spec);
            final byte[] plain = cipher.doFinal(ciphertext);
            return new String(plain, StandardCharsets.UTF_8);
        } catch (final Exception e) {
            throw new IllegalStateException("Decryption failed", e);
        }
    }

    /** Returns true if the value is in ENC(base64) format (encrypted at rest). */
    public boolean isEncrypted(final String value) {
        return value != null
                && value.startsWith(ENC_PREFIX)
                && value.endsWith(ENC_SUFFIX)
                && value.length() > ENC_PREFIX.length() + ENC_SUFFIX.length();
    }
}
