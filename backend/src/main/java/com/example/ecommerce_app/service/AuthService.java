package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.request.AuthResponseDTO;
import com.example.ecommerce_app.dto.request.LoginDto;
import com.example.ecommerce_app.dto.request.RegisterDto;

public interface AuthService {

    AuthResponseDTO login(LoginDto loginDto);

    AuthResponseDTO register(RegisterDto registerDto);

    AuthResponseDTO loginGoogle(LoginDto loginDto);
}
