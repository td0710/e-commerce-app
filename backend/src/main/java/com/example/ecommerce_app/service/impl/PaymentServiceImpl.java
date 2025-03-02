package com.example.ecommerce_app.service.impl;


import com.example.ecommerce_app.dto.PaymentDto;
import com.example.ecommerce_app.dto.PaymentVNPAYDto;
import com.example.ecommerce_app.dto.response.RefundResponse;
import com.example.ecommerce_app.dto.response.VNPayRefundResponse;
import com.example.ecommerce_app.entity.*;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.repository.*;
import com.example.ecommerce_app.security.VNPayConfig;
import com.example.ecommerce_app.service.PaymentService;
import com.example.ecommerce_app.util.VNPayUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

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
    private WebClient webClient;

    @Autowired
    public void setWebClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
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

    public String refundVnPayPayment(Long orderId, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId).get();
        Payment payment = paymentRepository.findByOrder(order) ;

        if(order.getPaymentStatus().equals("PAID")) {


            Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();

            List<String> params  = new ArrayList<>();

            String vnp_RequestId = String.valueOf(System.currentTimeMillis());
            String vnp_Version = vnPayConfig.getVnp_Version() ;
            String vnp_Command = "refund" ;
            String vnp_TmnCode = vnPayConfig.getVnp_TmnCode() ;
            String vnp_TransactionType = "03" ;
            String vnp_TxnRef = payment.getTxnRef() ;
            String vnp_Amount = payment.getAmount().toString() ;
            String vnp_OrderInfo = "Refund order id: " + order.getId() ;
            String vnp_TransactionNo = payment.getTransactionNo() ;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String vnp_TransactionDate = payment.getPayDate().format(formatter);
            String vnp_CreateBy = "USER" ;
            String vnp_CreateDate = LocalDateTime.now().format(formatter);
            String vnp_IpAddr = request.getHeader("X-Forwarded-For");
            if (vnp_IpAddr == null || vnp_IpAddr.isEmpty()) {
                vnp_IpAddr = request.getRemoteAddr();
            }


            params.add(vnp_RequestId);
            params.add(vnp_Version);
            params.add(vnp_Command);
            params.add(vnp_TmnCode);
            params.add(vnp_TransactionType);
            params.add(vnp_TxnRef);
            params.add(vnp_Amount);
            params.add(vnp_TransactionNo);
            params.add(vnp_TransactionDate);
            params.add(vnp_CreateBy);
            params.add(vnp_CreateDate);
            params.add(vnp_IpAddr);
            params.add(vnp_OrderInfo);

            String queryUrl = VNPayUtil.getRefundData(params);

            String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), queryUrl);

            RefundResponse refundResponse = new RefundResponse(
                    vnp_RequestId,
                    vnp_Version,
                    vnp_Command,
                    vnp_TmnCode,
                    vnp_TransactionType,
                    vnp_TxnRef,
                    vnp_Amount,
                    vnp_TransactionNo,
                    vnp_TransactionDate,
                    vnp_CreateBy,
                    vnp_CreateDate,
                    vnp_IpAddr,
                    vnp_OrderInfo,
                    vnpSecureHash)  ;

            String url =
                    "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction" ;
            VNPayRefundResponse response = webClient.post()
                    .uri(url)
                    .bodyValue(refundResponse)
                    .retrieve()
                    .bodyToMono(VNPayRefundResponse.class)
                    .block();

            if (response.getResponseCode().equals("00")) {
                payment.setTransactionStatus("REFUNDED");
                payment.setRefundTransactionNo(response.getTransactionNo()) ;

                order.setPaymentStatus("REFUNDED");
                order.setOrderStatus("CANCELLED");

                paymentRepository.save(payment);
                orderRepository.save(order);
                return "Cancelled successfully" ;
            }

            return "Cancel failed" ;
        }
            payment.setTransactionStatus("CANCELLED");

            order.setPaymentStatus("CANCELLED");
            order.setOrderStatus("CANCELLED");

            paymentRepository.save(payment);
            orderRepository.save(order);

        return "Cancelled successfully" ;
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
        order.setOrderStatus("PENDING");
        order.setShippingAddress(shippingDetails.getHomeAddress());
        order.setShippingCountry(shippingDetails.getCountry());
        order.setShippingContact(shippingDetails.getContactNumber());
        order.setShippingName(shippingDetails.getName());
        order.setShippingEmail(shippingDetails.getEmail());
        order.setPaymentStatus("UNPAID");
        order.setCreatedAt(LocalDateTime.now());

        orderRepository.save(order);

        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setTransactionNo("COD-" + UUID.randomUUID());
        payment.setTxnRef("COD-" + order.getId());
        payment.setAmount(order.getTotalPrice());
        payment.setBankCode("COD");
        payment.setCardType("COD");
        payment.setPayDate(null);
        payment.setResponseCode("01");
        payment.setTransactionStatus("PENDING");
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
            order.setOrderStatus("PENDING");
            order.setPaymentStatus("PAID");
        } else {
            order.setOrderStatus("CANCELLED");
            order.setPaymentStatus("UNPAID");
        }

        order = orderRepository.save(order);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setTransactionNo(paymentVNPAYDto.getVnpTransactionNo());
        payment.setTxnRef(paymentVNPAYDto.getVnpTxnRef());
        payment.setAmount(order.getTotalPrice() / 100);
        payment.setBankCode(paymentVNPAYDto.getVnpBankCode());
        payment.setCardType(paymentVNPAYDto.getVnpCardType());
        payment.setPayDate(LocalDateTime.now());
        payment.setResponseCode(paymentVNPAYDto.getVnpResponseCode());
        if(paymentVNPAYDto.getVnpResponseCode().equals("00")) {
            payment.setTransactionStatus("SUCCESS");
        }
        else {
            payment.setTransactionStatus("FAILED");
        }
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
