package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.dto.request.ShippingDetailsDto;
import com.example.ecommerce_app.dto.response.OrderPageResponse;
import com.example.ecommerce_app.dto.response.OrderResponse;
import com.example.ecommerce_app.entity.Order;
import com.example.ecommerce_app.entity.Payment;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.repository.OrderRepository;
import com.example.ecommerce_app.repository.PaymentRepository;
import com.example.ecommerce_app.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final PaymentRepository paymentRepository;
    private OrderRepository orderRepository;
    public OrderServiceImpl(OrderRepository orderRepository, PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }


    public OrderPageResponse getAllOrders(Long userId,int page, int size) {
        Pageable pageable = PageRequest.of(page, size,Sort.by(Sort.Direction.DESC, "id"));
        Page<Order> orders = orderRepository.findByUserId(userId,pageable);
        List<Order> orderList = orders.getContent();

        OrderPageResponse orderPageResponse = new OrderPageResponse();
        List<OrderResponse> content = new ArrayList<>();

        for (Order order : orderList) {
            OrderResponse orderResponse = new OrderResponse();

            orderResponse.setOrderId(order.getId());
            orderResponse.setTotalPrice(order.getTotalPrice());
            orderResponse.setQuantity(order.getQuantity());
            orderResponse.setShippingName(order.getShippingName());
            orderResponse.setShippingAddress(order.getShippingAddress());
            orderResponse.setShippingCountry(order.getShippingCountry());
            orderResponse.setShippingEmail(order.getShippingEmail());
            orderResponse.setStatus(order.getOrderStatus());
            orderResponse.setPaymentStatus(order.getPaymentStatus());
            orderResponse.setContactNumber(order.getShippingContact());

            orderResponse.setProductName(order.getProduct().getTitle());
            orderResponse.setProductCategory(order.getProduct().getCategory());
            orderResponse.setProductImg(order.getProduct().getImage());

            orderResponse.setSize(order.getVariant().getSize());
            orderResponse.setColor(order.getVariant().getColor());

            content.add(orderResponse);
        }

        orderPageResponse.setOrders(content);
        orderPageResponse.setTotalPages(orders.getTotalPages());
        orderPageResponse.setTotalElements(orders.getTotalElements());
        orderPageResponse.setPageNo(orders.getNumber());
        orderPageResponse.setPageSize(orders.getSize());
        orderPageResponse.setLast(orders.isLast());

        return orderPageResponse;
    }

    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(()->new AppException(ErrorCode.ORDER_NOT_FOUND));

        OrderResponse orderResponse = new OrderResponse();

        orderResponse.setOrderId(order.getId());
        orderResponse.setTotalPrice(order.getTotalPrice());
        orderResponse.setQuantity(order.getQuantity());
        orderResponse.setShippingName(order.getShippingName());
        orderResponse.setShippingAddress(order.getShippingAddress());
        orderResponse.setShippingCountry(order.getShippingCountry());
        orderResponse.setShippingEmail(order.getShippingEmail());
        orderResponse.setStatus(order.getOrderStatus());
        orderResponse.setPaymentStatus(order.getPaymentStatus());

        orderResponse.setContactNumber(order.getShippingContact());

        orderResponse.setProductName(order.getProduct().getTitle());
        orderResponse.setProductCategory(order.getProduct().getCategory());
        orderResponse.setProductImg(order.getProduct().getImage());

        orderResponse.setSize(order.getVariant().getSize());
        orderResponse.setColor(order.getVariant().getColor());

        return orderResponse ;
    }

    public String setShippingDetails(Long orderId, ShippingDetailsDto shippingDetailsDto) {
        Order order = orderRepository.findById(orderId).orElseThrow(()->new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (shippingDetailsDto.getHomeAddress() == null || shippingDetailsDto.getEmail() == null||
                shippingDetailsDto.getContactNumber()==null ||
                shippingDetailsDto.getName() == null||
                shippingDetailsDto.getCountry() == null) {
            throw new AppException(ErrorCode.INVALID_SHIPPING_DETAILS);
        }

        order.setShippingAddress(shippingDetailsDto.getHomeAddress());
        order.setShippingEmail(shippingDetailsDto.getEmail());
        order.setShippingContact(shippingDetailsDto.getContactNumber());
        order.setShippingName(shippingDetailsDto.getName());
        order.setShippingCountry(shippingDetailsDto.getCountry());

        orderRepository.save(order);

        return "Saved shipping details successfully" ;
    }

    public OrderPageResponse getAllOrders(int page, int size){
        Pageable pageable = PageRequest.of(page, size,Sort.by(Sort.Direction.DESC, "id"));
        Page<Order> orders = orderRepository.getAlLOrders(pageable);
        List<Order> orderList = orders.getContent();

        OrderPageResponse orderPageResponse = new OrderPageResponse();
        List<OrderResponse> content = new ArrayList<>();

        for (Order order : orderList) {
            OrderResponse orderResponse = new OrderResponse();

            orderResponse.setOrderId(order.getId());
            orderResponse.setTotalPrice(order.getTotalPrice());
            orderResponse.setQuantity(order.getQuantity());
            orderResponse.setShippingName(order.getShippingName());
            orderResponse.setShippingAddress(order.getShippingAddress());
            orderResponse.setShippingCountry(order.getShippingCountry());
            orderResponse.setShippingEmail(order.getShippingEmail());
            orderResponse.setStatus(order.getOrderStatus());
            orderResponse.setPaymentStatus(order.getPaymentStatus());
            orderResponse.setContactNumber(order.getShippingContact());

            orderResponse.setProductName(order.getProduct().getTitle());
            orderResponse.setProductCategory(order.getProduct().getCategory());
            orderResponse.setProductImg(order.getProduct().getImage());

            orderResponse.setSize(order.getVariant().getSize());
            orderResponse.setColor(order.getVariant().getColor());

            content.add(orderResponse);
        }

        orderPageResponse.setOrders(content);
        orderPageResponse.setTotalPages(orders.getTotalPages());
        orderPageResponse.setTotalElements(orders.getTotalElements());
        orderPageResponse.setPageNo(orders.getNumber());
        orderPageResponse.setPageSize(orders.getSize());
        orderPageResponse.setLast(orders.isLast());

        return orderPageResponse;
    }

    public String updateStatus(Long orderId, String status)  {
        Payment payment = paymentRepository.findById(orderId).orElseThrow(()->new AppException(ErrorCode.ORDER_NOT_FOUND));
        Order order = orderRepository.findById(orderId).orElseThrow(()->new AppException(ErrorCode.ORDER_NOT_FOUND));
        if(status.equals("DELIVERED")) {
            order.setPaymentStatus("PAID");
            order.setOrderStatus(status);
            orderRepository.save(order);
            payment.setResponseCode("00");
            payment.setTransactionStatus("SUCCESS");
            payment.setPayDate(LocalDateTime.now());
            paymentRepository.save(payment);

            return "Saved status successfully" ;
        }
        order.setOrderStatus(status);
        orderRepository.save(order);

        return "Saved status successfully" ;
    }



    public Long totalOrders(Long userId) {
        return orderRepository.countByUserId(userId) ;
    }
}
