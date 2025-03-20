package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.dto.request.AuthResponseDTO;
import com.example.ecommerce_app.dto.request.LoginDto;
import com.example.ecommerce_app.dto.request.RegisterDto;
import com.example.ecommerce_app.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;



    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDto loginDto) {
        AuthResponseDTO authResponseDTO = authService.login(loginDto);

        return ResponseEntity.ok(authResponseDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDto registerDto) {
        AuthResponseDTO authResponseDTO = authService.register(registerDto);

        return ResponseEntity.ok(authResponseDTO);
    }
    @PostMapping("/login/google")
    public ResponseEntity<AuthResponseDTO> loginGoogle(@RequestBody LoginDto loginDto) {

        AuthResponseDTO authResponseDTO = authService.loginGoogle(loginDto);

        return ResponseEntity.ok(authResponseDTO);
    }
}
