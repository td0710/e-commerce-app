package com.example.ecommerce_app.dto.request;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String token;
    private String userName;
    private String email;
    private String role;

    public AuthResponseDTO(String token, String userName, String email, String role) {
        this.token = token;
        this.userName = userName;
        this.email = email;
        this.role = role;
    }
}
