package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.ShippingDetailsDto;
import com.example.ecommerce_app.dto.response.OrderPageResponse;
import com.example.ecommerce_app.dto.response.OrderResponse;
import com.example.ecommerce_app.entity.Order;

public interface OrderService {
    OrderPageResponse getAllOrders(Long userId,int page, int size);
    Long totalOrders(Long userId);
    OrderResponse getOrder(Long orderId);
    String setShippingDetails(Long orderId, ShippingDetailsDto shippingDetailsDto);
    OrderPageResponse getAllOrders(int page, int size);
    String updateStatus(Long orderId, String status) ;
}
