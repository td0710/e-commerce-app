package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.PaymentDto;
import com.example.ecommerce_app.dto.PaymentVNPAYDto;
import com.example.ecommerce_app.entity.Payment;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    PaymentDto createVnPayPayment(HttpServletRequest request) ;

    void save(Payment payment);

    String codPayment(Long id, Long totalPrice, Long cartItemId);

    String VNPAYPayment (PaymentVNPAYDto paymentVNPAYDto);
}
