package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.PaymentDto;

import com.example.ecommerce_app.entity.*;
import com.example.ecommerce_app.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

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
    private final ShippingDetailsService shippingDetailsService;
    private final OrderService orderService;
    public PaymentController(PaymentService paymentService,
                             ProductService productService,
                             UserService userService,
                             ProductVariantService productVariantService,
                             CartItemService cartItemService,
                             CartService cartService,
                             ShippingDetailsService shippingDetailsService,
                             OrderService orderService) {
        this.paymentService = paymentService;
        this.productService = productService;
        this.userService = userService;
        this.productVariantService=productVariantService;
        this.cartItemService=cartItemService;
        this.cartService=cartService;
        this.shippingDetailsService=shippingDetailsService;
        this.orderService=orderService;
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
    @PostMapping("/cod")
    public ResponseEntity<?> codPayment(@RequestParam Long userId,
                                        @RequestParam Long totalPrice,
                                        @RequestParam Long cartItemId
                                        ) {
        Order order = new Order();
        Users user = userService.findById(userId);
        CartItem cartItem = cartItemService.findById(cartItemId) ;
        Product product = productService.findProductById(cartItem.getProduct().getId()) ;
        ProductVariant productVariant = productVariantService.findById(cartItem.getProductVariant().getId()) ;
        System.out.println(productVariant.getId());
        ShippingDetails shippingDetails = shippingDetailsService.findByUserId(userId) ;

        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(cartItem.getQuantity());
        order.setVariant(productVariant);
        order.setTotalPrice(totalPrice);
        order.setOrderStatus("CONFIRMED");
        order.setShippingAddress(shippingDetails.getHomeAddress());
        order.setShippingCountry(shippingDetails.getCountry());
        order.setShippingContact(shippingDetails.getContactNumber());
        order.setShippingName(shippingDetails.getName());
        order.setShippingEmail(shippingDetails.getEmail());
        order.setPaymentStatus("PAID");
        order.setCreatedAt(LocalDateTime.now());

        orderService.save(order);

        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setTransactionNo("COD-" + UUID.randomUUID());
        payment.setTxnRef("COD-" + order.getId());
        payment.setAmount(order.getTotalPrice());
        payment.setBankCode(null);
        payment.setCardType("COD");
        payment.setPayDate(LocalDateTime.now());
        payment.setResponseCode("00");
        payment.setTransactionStatus("SUCCESS");
        payment.setCreatedAt(LocalDateTime.now());

        paymentService.save(payment) ;

        Cart cart = cartService.findByUserId(userId) ;
        cart.setTotal(cart.getTotal() - cartItem.getQuantity());
        cartItemService.delete(cartItemId) ;

        return ResponseEntity.ok("Success");
    }
}