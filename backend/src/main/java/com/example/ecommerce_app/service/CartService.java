package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.response.CartResponse;
import com.example.ecommerce_app.entity.Cart;


public interface CartService {
    Cart findById(Long id);
    void createCart(Long userId);
    void saveCart(Cart cart);

    Long totalProductsInCart(Long userId);

    Cart findByUserId(Long userId);
    void save(Cart cart);

    CartResponse getCart(Long userId,int page,int size);

    String addCart( Long userId, Long productId, String size, String color) ;

    String addCartPage(Long userId, Long productId) ;

    String decreaseCart(Long userId, Long productId);

    String deleteCart(Long userId, Long productId);
}
