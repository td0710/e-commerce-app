package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.entity.Cart;
import com.example.ecommerce_app.entity.CartItem;
import com.example.ecommerce_app.repository.CartItemRepository;

import com.example.ecommerce_app.service.CartItemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemServiceImpl(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public Page<CartItem> findByCart(Cart cart, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return cartItemRepository.findByCart(cart,pageable);
    }


    public CartItem findByCartIdAndProductVariantId(Long cartId,Long variantId) {
        return cartItemRepository.findByCartIdAndProductVariantId(cartId,variantId) ;
    }

    public void addCartItem(CartItem cartItem) {
        cartItemRepository.save(cartItem);
    }

    public void removeCartItem(CartItem cartItem) {
        cartItemRepository.delete(cartItem);
    }

    public CartItem findById(Long id) {
        return cartItemRepository.findById(id).orElse(null);
    }

    public void delete(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }
}
