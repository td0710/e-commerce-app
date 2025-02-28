package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Order;
import com.example.ecommerce_app.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByOrder(Order order);
}
