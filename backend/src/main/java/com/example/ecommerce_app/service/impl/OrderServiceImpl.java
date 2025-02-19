package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.entity.Order;
import com.example.ecommerce_app.repository.OrderRepository;
import com.example.ecommerce_app.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private OrderRepository orderRepository;
    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public void save(Order order) {
        orderRepository.save(order);
    }
}
