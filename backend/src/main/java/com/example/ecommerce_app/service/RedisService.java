package com.example.ecommerce_app.service;

public interface RedisService {

    void saveRefreshToken(String username, String refreshToken) ;

    String getRefreshToken(String username) ;

    boolean validateRefreshToken(String username, String refreshToken) ;

    void deleteRefreshToken(String username) ;
}