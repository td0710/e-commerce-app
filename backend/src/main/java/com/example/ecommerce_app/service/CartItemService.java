package com.example.ecommerce_app.service;

import com.example.ecommerce_app.entity.Cart;
import com.example.ecommerce_app.entity.CartItem;
import org.springframework.data.domain.Page;

public interface CartItemService {
    Page<CartItem> findByCart(Cart cart, int page, int size) ;
}
