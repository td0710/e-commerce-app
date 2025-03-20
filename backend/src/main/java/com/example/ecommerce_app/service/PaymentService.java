package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.request.PaymentDto;
import com.example.ecommerce_app.dto.request.PaymentVNPAYDto;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {

    String refundVnPayPayment(Long orderId, HttpServletRequest request);

    PaymentDto createVnPayPayment(HttpServletRequest request) ;

    String codPayment(Long id, Long totalPrice, Long cartItemId);

    String VNPAYPayment (PaymentVNPAYDto paymentVNPAYDto);
}
