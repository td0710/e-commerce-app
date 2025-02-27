package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;



public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    @Query("SELECT COUNT(w) FROM Wishlist w WHERE w.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    Page<Wishlist> findByUserId(@RequestParam("user_id") Long userId, Pageable pageable);
    Wishlist findByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
