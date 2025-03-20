package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.request.ShippingDetailsDto;
import com.example.ecommerce_app.dto.response.OrderPageResponse;
import com.example.ecommerce_app.dto.response.OrderResponse;

public interface OrderService {
    OrderPageResponse getAllOrders(Long userId,int page, int size);
    Long totalOrders(Long userId);
    OrderResponse getOrder(Long orderId);
    String setShippingDetails(Long orderId, ShippingDetailsDto shippingDetailsDto);
    OrderPageResponse getAllOrders(int page, int size);
    String updateStatus(Long orderId, String status) ;
}
