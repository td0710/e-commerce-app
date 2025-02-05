package com.example.ecommerce_app.service;


import com.example.ecommerce_app.entity.Cart;
import com.example.ecommerce_app.repository.CartItemRepository;
import com.example.ecommerce_app.repository.CartRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class CartService {

    private CartRepository cartRepository;
    private CartItemRepository cartItemRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }
    public Page<Cart> findAll(Pageable pageable) {
        return cartRepository.findAll(pageable);
    }
}
