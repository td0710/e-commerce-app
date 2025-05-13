package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.response.CartResponse;
import com.example.ecommerce_app.service.impl.CartServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("http://tdecommerce.online")
@RestController
@RequestMapping("/api/carts/secure")
public class CartController {

    private final CartServiceImpl cartService;

    public CartController(CartServiceImpl cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/get/cart/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId,
                                     @RequestParam int page,
                                     @RequestParam int size) {

        CartResponse cartResponse = cartService.getCart(userId, page, size);

        return ResponseEntity.ok(cartResponse);

    }

    @PostMapping("/add/cart/{userId}/{productId}")
    public ResponseEntity<?> addCart(@PathVariable Long userId,
                                     @PathVariable Long productId,
                                     @RequestParam String size,
                                     @RequestParam String color) {

        String message = cartService.addCart(userId, productId, size, color);

        return ResponseEntity.ok(message);

    }

    @PostMapping("/add/cartpage/{userId}/{productId}")
    public ResponseEntity<?> addCartPage(@PathVariable Long userId,@PathVariable Long productId) {


        String message = cartService.addCartPage(userId, productId);

        return ResponseEntity.ok(message);

    }

    @PostMapping("/decrease/cart/{userId}/{productId}")
    public ResponseEntity<?> decreaseCart(@PathVariable Long userId, @PathVariable Long productId) {
        String message = cartService.decreaseCart(userId, productId);

        return ResponseEntity.ok(message);

    }

    @DeleteMapping("/delete/cart/{userId}/{productId}")
    public ResponseEntity<?> deleteCart(@PathVariable Long userId, @PathVariable Long productId) {

        String message = cartService.deleteCart(userId, productId);

        return ResponseEntity.ok(message);
    }

    @GetMapping("/total/{userId}")
    public ResponseEntity<?> getTotalWishlist(@PathVariable Long userId) {

        return ResponseEntity.ok(cartService.totalProductsInCart(userId));
    }
}
