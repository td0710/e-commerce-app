package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.dto.request.AuthResponseDTO;
import com.example.ecommerce_app.dto.request.LoginDto;
import com.example.ecommerce_app.dto.request.RegisterDto;
import com.example.ecommerce_app.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        AuthResponseDTO authResponseDTO = authService.login(loginDto,response);

        return ResponseEntity.ok(authResponseDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDto registerDto,HttpServletResponse response) {
        AuthResponseDTO authResponseDTO = authService.register(registerDto,response);

        return ResponseEntity.ok(authResponseDTO);
    }

    @PostMapping("/login/google")
    public ResponseEntity<AuthResponseDTO> loginGoogle(@RequestBody LoginDto loginDto, HttpServletResponse response) {

        AuthResponseDTO authResponseDTO = authService.loginGoogle(loginDto,response);

        return ResponseEntity.ok(authResponseDTO);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDTO> refreshToken(HttpServletRequest request,
                                                        HttpServletResponse response) {
        return ResponseEntity.ok(authService.refreshToken(request,response));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody String token,
                                    HttpServletRequest request, HttpServletResponse response) {

        authService.logout(token, request, response);
        return ResponseEntity.ok("Logout successful") ;
    }

}
