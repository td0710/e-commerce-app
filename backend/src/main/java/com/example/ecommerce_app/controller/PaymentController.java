package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.PaymentDto;

import com.example.ecommerce_app.dto.PaymentVNPAYDto;
import com.example.ecommerce_app.dto.response.RefundResponse;
import com.example.ecommerce_app.entity.*;
import com.example.ecommerce_app.repository.CartRepository;
import com.example.ecommerce_app.repository.ShippingDetailsRepository;
import com.example.ecommerce_app.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;

import static io.jsonwebtoken.Jwts.header;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/payment/secure")
public class PaymentController {
    private final PaymentService paymentService;
    private final ProductService productService;
    private final UserService userService;
    private final ProductVariantService productVariantService;
    private final CartItemService cartItemService;
    private final CartService cartService;
    private final CartRepository cartRepository;
    private final ShippingDetailsService shippingDetailsService;
    private final OrderService orderService;
    private final ShippingDetailsRepository shippingDetailsRepository;
    private final WebClient webClient;
    public PaymentController(PaymentService paymentService,
                             ProductService productService,
                             UserService userService,
                             ProductVariantService productVariantService,
                             CartItemService cartItemService,
                             CartService cartService,
                             ShippingDetailsService shippingDetailsService,
                             OrderService orderService,
                             CartRepository cartRepository,
                             ShippingDetailsRepository shippingDetailsRepository,
                             WebClient.Builder webClientBuilder) {
        this.paymentService = paymentService;
        this.productService = productService;
        this.userService = userService;
        this.productVariantService=productVariantService;
        this.cartItemService=cartItemService;
        this.cartService=cartService;
        this.shippingDetailsService=shippingDetailsService;
        this.orderService=orderService;
        this.cartRepository=cartRepository;
        this.shippingDetailsRepository = shippingDetailsRepository;
        this.webClient = webClientBuilder.build();
    }

    @GetMapping("/vn-pay")
    public ResponseEntity<PaymentDto> pay(HttpServletRequest request) {
        return ResponseEntity.ok(paymentService.createVnPayPayment(request));
    }

    @PostMapping("/vn-pay-callback")
    public ResponseEntity<?> payCallbackHandler(@RequestBody PaymentVNPAYDto paymentVNPAYDto) {

        String message = paymentService.VNPAYPayment(paymentVNPAYDto);

        return ResponseEntity.ok(message);

    }

    @PostMapping("/cod")
    public ResponseEntity<?> codPayment(@RequestParam Long userId,
                                        @RequestParam Long totalPrice,
                                        @RequestParam Long cartItemId
                                        ) {

        String message = paymentService.codPayment(userId, totalPrice, cartItemId);

        return ResponseEntity.ok(message);
    }
    @PostMapping("/get/refund/{orderId}")
    public ResponseEntity<?> createPayment1(@PathVariable Long orderId,HttpServletRequest request) {
        RefundResponse refundResponse = paymentService.refundVnPayPayment(orderId,request) ;
        String url =
                "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction" ;
        String response = webClient.post()
                .uri(url)
                .bodyValue(refundResponse)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        System.out.println(response);
        return ResponseEntity.ok("ok");
    }
}