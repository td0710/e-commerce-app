package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {

}
