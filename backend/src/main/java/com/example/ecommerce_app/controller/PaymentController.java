package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.PaymentDto;
import com.example.ecommerce_app.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/payment/secure")
public class PaymentController {
    private final PaymentService paymentService;
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    @GetMapping("/vn-pay")
    public ResponseEntity<PaymentDto> pay(HttpServletRequest request) {
        return ResponseEntity.ok(paymentService.createVnPayPayment(request));
    }
    @GetMapping("/vn-pay-callback")
    public ResponseEntity<PaymentDto> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if ("00".equals(status)) {
            return ResponseEntity.ok(new PaymentDto("00", "Success", ""));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new PaymentDto("99", "Failed", ""));
        }
    }
}
