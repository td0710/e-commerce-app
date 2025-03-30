package com.example.ecommerce_app.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OTPRequest {

    private String toEmail ;
    private String username;
}
