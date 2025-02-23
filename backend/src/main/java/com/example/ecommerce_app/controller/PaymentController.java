package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.PaymentDto;

import com.example.ecommerce_app.dto.PaymentVNPAYDto;
import com.example.ecommerce_app.entity.*;
import com.example.ecommerce_app.service.*;
import jakarta.servlet.http.HttpServletRequest;
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
    @PostMapping("/vn-pay-callback")
    public ResponseEntity<?> payCallbackHandler(@RequestBody PaymentVNPAYDto paymentVNPAYDto) {


        String status = paymentVNPAYDto.getVnpResponseCode();

        Users user = userService.findById(paymentVNPAYDto.getUserId());
        CartItem cartItem = cartItemService.findById(paymentVNPAYDto.getCartItemId());
        Product product = productService.findProductById(cartItem.getProduct().getId());
        ProductVariant productVariant = productVariantService.findById(cartItem.getProductVariant().getId());
        ShippingDetails shippingDetails = shippingDetailsService.findByUserId(paymentVNPAYDto.getUserId());

        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(cartItem.getQuantity());
        order.setVariant(productVariant);
        order.setTotalPrice(paymentVNPAYDto.getVnpAmount()/100);
        order.setShippingAddress(shippingDetails.getHomeAddress());
        order.setShippingCountry(shippingDetails.getCountry());
        order.setShippingContact(shippingDetails.getContactNumber());
        order.setShippingName(shippingDetails.getName());
        order.setShippingEmail(shippingDetails.getEmail());
        order.setCreatedAt(LocalDateTime.now());

        if ("00".equals(status)) {
            order.setOrderStatus("CONFIRMED");
            order.setPaymentStatus("PAID");
        } else {
            order.setOrderStatus("CANCELLED");
            order.setPaymentStatus("UNPAID");
        }

        order = orderService.save(order);

        Payment payment = new Payment();
        payment.setOrder(order); //
        payment.setTransactionNo(paymentVNPAYDto.getVnpTransactionNo());
        payment.setTxnRef(paymentVNPAYDto.getVnpTxnRef());
        payment.setAmount(order.getTotalPrice() / 100);
        payment.setBankCode(paymentVNPAYDto.getVnpBankCode());
        payment.setCardType(paymentVNPAYDto.getVnpCardType());
        payment.setPayDate(LocalDateTime.now());
        payment.setResponseCode(paymentVNPAYDto.getVnpResponseCode());
        payment.setTransactionStatus(paymentVNPAYDto.getVnpTransactionStatus());
        payment.setCreatedAt(LocalDateTime.now());

        paymentService.save(payment);

        if ("00".equals(status)) {
            Cart cart = cartService.findByUserId(paymentVNPAYDto.getUserId());
            cart.setTotal(cart.getTotal() - cartItem.getQuantity());
            cartService.save(cart);
            cartItemService.delete(paymentVNPAYDto.getCartItemId());
        }

        return ResponseEntity.ok("success");
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