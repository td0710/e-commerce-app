package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/wishlists/secure")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/{userId}")
    public Page<Product> getProductsInWishlistByUserId(
            @PathVariable Long userId,
            Pageable pageable) {
        return wishlistService.getProductsInWishListByUserId(userId, pageable);
    }
    @PostMapping("/add/{userId}")
    public ResponseEntity<?> addProduct(@PathVariable Long UserId, @RequestParam Long productId) {
        return ResponseEntity
                .status(HttpStatus.CREATED).body("Wishlist added successfully");

    }
}
