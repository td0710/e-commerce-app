package com.example.ecommerce_app.service.impl;


import com.example.ecommerce_app.entity.Cart;
import com.example.ecommerce_app.repository.CartItemRepository;
import com.example.ecommerce_app.repository.CartRepository;
import com.example.ecommerce_app.repository.UserRepository;
import com.example.ecommerce_app.service.CartService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class CartServiceImpl implements CartService {

    private CartRepository cartRepository;
    private CartItemRepository cartItemRepository;
    private UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }
    public Cart findById(Long id) {
        return cartRepository.findByUserId(id) ;
    }

    public void createCart(Long userId) {
        Cart cart = new Cart();
        cart.setUser(userRepository.findById(userId).get());
        cart.setTotal(0L);
        cartRepository.save(cart);
    }
}
