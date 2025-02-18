package com.example.ecommerce_app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class PaymentDto {
    private String code;
    private String message;
    private String paymentUrl;
}
