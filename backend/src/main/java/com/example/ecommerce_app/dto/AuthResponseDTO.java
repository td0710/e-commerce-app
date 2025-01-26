package com.example.ecommerce_app.dto;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String token;
    private String userName;
    private String email;

    public AuthResponseDTO(String token, String userName, String email) {
        this.token = token;
        this.userName = userName;
        this.email = email;
    }
}
