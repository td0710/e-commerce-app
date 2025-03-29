package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedisServiceImpl implements RedisService {

    private static final long REFRESH_TOKEN_EXPIRY = 7;

    private RedisTemplate<String, String> redisTemplate;

    public RedisServiceImpl(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveRefreshToken(String username, String refreshToken) {
        String key = "refresh_token:" + username;
        redisTemplate.opsForValue().set(key, refreshToken, Duration.ofDays(REFRESH_TOKEN_EXPIRY));
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
}
