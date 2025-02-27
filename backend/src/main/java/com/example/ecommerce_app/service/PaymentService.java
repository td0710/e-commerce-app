package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.PaymentDto;
import com.example.ecommerce_app.dto.PaymentVNPAYDto;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    PaymentDto createVnPayPayment(HttpServletRequest request) ;

    String codPayment(Long id, Long totalPrice, Long cartItemId);

    String VNPAYPayment (PaymentVNPAYDto paymentVNPAYDto);
}
