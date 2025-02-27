package com.example.ecommerce_app.service.impl;


import com.example.ecommerce_app.dto.PaymentDto;
import com.example.ecommerce_app.dto.PaymentVNPAYDto;
import com.example.ecommerce_app.entity.*;
import com.example.ecommerce_app.repository.*;
import com.example.ecommerce_app.security.VNPayConfig;
import com.example.ecommerce_app.service.PaymentService;
import com.example.ecommerce_app.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final VNPayConfig vnPayConfig;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ShippingDetailsRepository shippingDetailsRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    public PaymentDto createVnPayPayment(HttpServletRequest request) {
        long amount = (long) (Double.parseDouble(request.getParameter("amount")) * 100L);
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        return PaymentDto.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();
    }

    public String codPayment(Long userId, Long totalPrice, Long cartItemId) {
        Order order = new Order();
        Users user = userRepository.findById(userId).get();
        CartItem cartItem = cartItemRepository.findById(cartItemId).get() ;
        Product product = productRepository.findById(cartItem.getProduct().getId()).get() ;
        ProductVariant productVariant = productVariantRepository.findById(cartItem.getProductVariant().getId()).get() ;
        System.out.println(productVariant.getId());
        ShippingDetails shippingDetails = shippingDetailsRepository.findByUserId(userId) ;

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

        orderRepository.save(order);

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

        paymentRepository.save(payment) ;

        Cart cart = cartRepository.findByUserId(userId) ;
        cart.setTotal(cart.getTotal() - cartItem.getQuantity());
        cartItemRepository.deleteById(cartItemId); ;

        return "Success" ;
    }

    public String VNPAYPayment (PaymentVNPAYDto paymentVNPAYDto) {


        String status = paymentVNPAYDto.getVnpResponseCode();

        Users user = userRepository.findById(paymentVNPAYDto.getUserId()).get();
        CartItem cartItem = cartItemRepository.findById(paymentVNPAYDto.getCartItemId()).get();
        Product product = productRepository.findById(cartItem.getProduct().getId()).get();
        ProductVariant productVariant = productVariantRepository.findById(cartItem.getProductVariant().getId()).get();
        ShippingDetails shippingDetails = shippingDetailsRepository.findByUserId(paymentVNPAYDto.getUserId());

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

        order = orderRepository.save(order);

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

        paymentRepository.save(payment);

        if ("00".equals(status)) {
            Cart cart = cartRepository.findByUserId(paymentVNPAYDto.getUserId());
            cart.setTotal(cart.getTotal() - cartItem.getQuantity());
            cartRepository.save(cart);
            cartItemRepository.deleteById(paymentVNPAYDto.getCartItemId());
        }

        return "success";
    }
}
