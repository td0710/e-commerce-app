package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

}
