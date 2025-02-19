package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
