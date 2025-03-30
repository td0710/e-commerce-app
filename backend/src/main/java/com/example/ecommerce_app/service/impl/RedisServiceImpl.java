package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.service.RedisService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class RedisServiceImpl implements RedisService {

    private static final long REFRESH_TOKEN_EXPIRY = 2;

    private RedisTemplate<String, String> redisTemplate;

    public RedisServiceImpl(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveRefreshToken(String username, String refreshToken) {
        String key = "refresh_token:" + username;
        redisTemplate.opsForValue().set(key, refreshToken, Duration.ofHours(REFRESH_TOKEN_EXPIRY));
    }

    public String getRefreshToken(String username) {
        String key = "refresh_token:" + username;
        return redisTemplate.opsForValue().get(key);
    }

    public boolean validateRefreshToken(String username, String refreshToken) {
        String storedToken = getRefreshToken(username);
        return storedToken != null && storedToken.equals(refreshToken);
    }

    public void deleteRefreshToken(String username) {
        String key = "refresh_token:" + username;
        redisTemplate.delete(key);
    }

    public boolean isBlacklisted(String token) {
        if (token == null) {
            return false;
        }
        String jwtToken = extractJwt(token);
        return redisTemplate.hasKey("blacklist:" + jwtToken);
    }

    public void blacklistToken(String token) {
        if (token == null) {
            return;
        }
        String jwtToken = extractJwt(token);
        long expiration = 15 * 60;
        redisTemplate.opsForValue().set(
                "blacklist:" + jwtToken,
                "invalid",
                expiration,
                TimeUnit.SECONDS
        );
    }

    private String extractJwt(String token) {
        if (token == null || token.trim().isEmpty()) {
            return "";
        }

        if (token.startsWith("eyJ")) {
            return token;
        }

        if (token.startsWith("{\"token\":\"") && token.endsWith("\"}")) {
            int start = token.indexOf(":\"") + 2;  // Bắt đầu sau "token":"
            int end = token.length() - 2;         // Trước "}"
            return token.substring(start, end);
        }

        return token;
    }



}
