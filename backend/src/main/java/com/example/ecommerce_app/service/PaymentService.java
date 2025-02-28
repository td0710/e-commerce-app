package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.PaymentDto;
import com.example.ecommerce_app.dto.PaymentVNPAYDto;
import com.example.ecommerce_app.dto.response.RefundResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {

    RefundResponse refundVnPayPayment(Long orderId, HttpServletRequest request);

    PaymentDto createVnPayPayment(HttpServletRequest request) ;

    String codPayment(Long id, Long totalPrice, Long cartItemId);

    String VNPAYPayment (PaymentVNPAYDto paymentVNPAYDto);
}
