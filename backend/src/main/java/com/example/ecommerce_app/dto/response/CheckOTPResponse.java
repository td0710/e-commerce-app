package com.example.ecommerce_app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckOTPResponse {
    private String OTP;
    private String mail;
}
