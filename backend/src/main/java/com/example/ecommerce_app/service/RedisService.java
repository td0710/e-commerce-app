package com.example.ecommerce_app.service;

public interface RedisService {

    void saveRefreshToken(String username, String refreshToken) ;

    String getRefreshToken(String username) ;

    boolean validateRefreshToken(String username, String refreshToken) ;

    void deleteRefreshToken(String username) ;

    boolean isBlacklisted(String token) ;

    void blacklistToken(String token) ;

    void saveOTP(String mail,String OTP) ;

    boolean checkOTP(String mail,String OTP) ;
}