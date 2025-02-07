package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.response.ProductWishlistResponse;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WishlistService {
    void AddWishlist(Product product, Users user) ;
    void deleteWishlist(Product product, Users user);
    boolean isProductInWishlist(Long userId, Long productId);
    long totalProductsInWishlist(Long userId);
    Page<ProductWishlistResponse> getProductsInWishListByUserId(Long userId, Pageable pageable) ;
}
