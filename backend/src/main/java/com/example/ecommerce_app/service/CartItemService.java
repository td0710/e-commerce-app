package com.example.ecommerce_app.service;

import com.example.ecommerce_app.entity.Cart;
import com.example.ecommerce_app.entity.CartItem;
import com.example.ecommerce_app.repository.CartItemRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public Page<CartItem> findByCart(Cart cart, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return cartItemRepository.findByCart(cart,pageable);
    }
}
