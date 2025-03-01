package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.PaymentDto;
import com.example.ecommerce_app.dto.PaymentVNPAYDto;
import com.example.ecommerce_app.dto.response.RefundResponse;
import com.example.ecommerce_app.dto.response.VNPayRefundResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {

    String refundVnPayPayment(Long orderId, HttpServletRequest request);

    PaymentDto createVnPayPayment(HttpServletRequest request) ;

    String codPayment(Long id, Long totalPrice, Long cartItemId);

    String VNPAYPayment (PaymentVNPAYDto paymentVNPAYDto);
}
