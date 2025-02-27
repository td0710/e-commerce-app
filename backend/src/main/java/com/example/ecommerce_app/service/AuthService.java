package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.AuthResponseDTO;
import com.example.ecommerce_app.dto.LoginDto;
import com.example.ecommerce_app.dto.RegisterDto;

public interface AuthService {

    AuthResponseDTO login(LoginDto loginDto);

    AuthResponseDTO register(RegisterDto registerDto);

    AuthResponseDTO loginGoogle(LoginDto loginDto);
}
