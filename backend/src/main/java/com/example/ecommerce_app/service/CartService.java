package com.example.ecommerce_app.service;

import com.example.ecommerce_app.entity.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CartService {
    Cart findById(Long id);
    void createCart(Long userId);
    void saveCart(Cart cart);

    Long totalProductsInCart(Long userId);

    Cart findByUserId(Long userId);
    void save(Cart cart);
}
