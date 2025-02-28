package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.PaymentDto;
import com.example.ecommerce_app.dto.PaymentVNPAYDto;
import com.example.ecommerce_app.dto.RefundDto;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {

    RefundDto refundVnPayPayment(HttpServletRequest request);

    PaymentDto createVnPayPayment(HttpServletRequest request) ;

    String codPayment(Long id, Long totalPrice, Long cartItemId);

    String VNPAYPayment (PaymentVNPAYDto paymentVNPAYDto);
}
