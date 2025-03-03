package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
    Discount findByCode(String code);
}
