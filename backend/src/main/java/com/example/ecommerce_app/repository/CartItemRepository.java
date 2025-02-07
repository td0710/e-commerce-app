package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Cart;
import com.example.ecommerce_app.entity.CartItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Page<CartItem> findByCart(Cart cart, Pageable pageable);
    CartItem findByCartIdAndProductVariantId(Long cartId, Long variantId);
}
