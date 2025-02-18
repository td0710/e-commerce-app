package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.PaymentDto;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    PaymentDto createVnPayPayment(HttpServletRequest request) ;
}
