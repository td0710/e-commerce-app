package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.response.ProductWishlistResponse;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.Users;
import com.example.ecommerce_app.repository.ProductRepository;
import com.example.ecommerce_app.repository.UserRepository;
import com.example.ecommerce_app.service.impl.WishlistServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/wishlists/secure")
public class WishlistController {

    private WishlistServiceImpl wishlistService;
    private UserRepository userRepository;
    private ProductRepository productRepository;

    WishlistController(WishlistServiceImpl wishlistService, UserRepository userRepository,
                       ProductRepository productRepository) {
        this.wishlistService = wishlistService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }
    @GetMapping("/{userId}")
    public Page<ProductWishlistResponse> getProductsInWishlistByUserId(
            @PathVariable Long userId,
            Pageable pageable) {
        return wishlistService.getProductsInWishListByUserId(userId, pageable);
    }
        @PostMapping("/add/{userId}")
        public ResponseEntity<?> addProduct(@PathVariable Long userId, @RequestParam Long productId) {
            Optional<Users> user = userRepository.findById(userId);
            Optional<Product> product = productRepository.findById(productId);
            if (!product.isPresent() || !user.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build() ;
            }
            wishlistService.AddWishlist(product.get(), user.get());
            return ResponseEntity.ok("Successfully added product");
        }
        @DeleteMapping("/delete/{userId}")
        public ResponseEntity<?> deleteProduct(@PathVariable Long userId, @RequestParam(name = "productId") Long productId) {
            Optional<Users> user = userRepository.findById(userId);
            Optional<Product> product = productRepository.findById(productId);
            if (!product.isPresent() || !user.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build() ;
            }
            wishlistService.deleteWishlist(product.get(), user.get());
            return  ResponseEntity.ok("deleted product");
        }
    @GetMapping("/check/{userId}")
    public ResponseEntity<Boolean> checkWishlist(
            @PathVariable Long userId,
            @RequestParam(name = "productId") Long productId) {
        boolean isFavorite = wishlistService.isProductInWishlist(userId, productId);
        return ResponseEntity.ok(isFavorite);
    }
    @GetMapping("/" +
            "total/{userId}")
    public ResponseEntity<Long> getTotalWishlist(@PathVariable Long userId) {
        Long total = wishlistService.totalProductsInWishlist(userId);
        return ResponseEntity.ok(total);
    }
}
