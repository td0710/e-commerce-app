package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.security.JWTGenerator;
import com.example.ecommerce_app.repository.RoleRepository;
import com.example.ecommerce_app.repository.UserRepository;
import com.example.ecommerce_app.dto.AuthResponseDTO;
import com.example.ecommerce_app.dto.LoginDto;
import com.example.ecommerce_app.dto.RegisterDto;
import com.example.ecommerce_app.entity.Role;
import com.example.ecommerce_app.entity.Users;
import com.example.ecommerce_app.service.AuthService;
import com.example.ecommerce_app.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;


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
