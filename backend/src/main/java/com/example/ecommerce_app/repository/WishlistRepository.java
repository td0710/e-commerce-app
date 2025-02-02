package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Page<Wishlist> findByUserId(@RequestParam("user_id") Long userId, Pageable pageable);
}
