package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.response.OrderPageResponse;
import com.example.ecommerce_app.entity.Order;

public interface OrderService {
    Order save (Order order);
    OrderPageResponse getAllOrders(Long userId,int page, int size);
    Long totalOrders(Long userId);
    Order getOrderById(Long orderId);
}
