package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.request.AuthResponseDTO;
import com.example.ecommerce_app.dto.request.LoginDto;
import com.example.ecommerce_app.dto.request.OTPRequest;
import com.example.ecommerce_app.dto.request.RegisterDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    AuthResponseDTO login(LoginDto loginDto, HttpServletResponse response);

    AuthResponseDTO register(RegisterDto registerDto, HttpServletResponse response);

    AuthResponseDTO loginGoogle(LoginDto loginDto, HttpServletResponse response);

    AuthResponseDTO refreshToken(HttpServletRequest request, HttpServletResponse response);

    void logout(String token, HttpServletRequest request, HttpServletResponse response) ;

    void getOTP(OTPRequest otpRequest) ;

    boolean checkOTP(String mail,String OTP);
}
