package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.response.CartResponse;
import com.example.ecommerce_app.service.impl.CartServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("http://localhost:3000")
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
        try {
            CartResponse cartResponse = cartService.getCart(userId, page, size);

            if (cartResponse.getProducts() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No products found in cart");
            }

            return ResponseEntity.ok(cartResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error retrieving cart");
        }
    }

    @PostMapping("/add/cart/{userId}/{productId}")
    public ResponseEntity<?> addCart(@PathVariable Long userId,
                                     @PathVariable Long productId,
                                     @RequestParam String size,
                                     @RequestParam String color) {
        try {
            String message = cartService.addCart(userId, productId, size, color);

            if (message.equals("Product out of stock")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
            } else if (!message.equals("Added item to the cart")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
            }

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error adding product to cart");
        }
    }

    @PostMapping("/add/cartpage/{userId}/{productId}")
    public ResponseEntity<?> addCartPage(@PathVariable Long userId,@PathVariable Long productId) {

        try {
        String message = cartService.addCartPage(userId, productId);

        if (!message.equals("Added item to the cart")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
        }

        return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error adding product to cart");
        }
    }

    @PostMapping("/decrease/cart/{userId}/{productId}")
    public ResponseEntity<?> decreaseCart(@PathVariable Long userId, @PathVariable Long productId) {
        try {
            String message = cartService.decreaseCart(userId, productId);

            if (!message.equals("Removed item successfully")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
            }

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error decreasing product quantity");
        }
    }

    @DeleteMapping("/delete/cart/{userId}/{productId}")
    public ResponseEntity<?> deleteCart(@PathVariable Long userId, @PathVariable Long productId) {
        try {
            String message = cartService.deleteCart(userId, productId);

            if (!message.equals("Delete item success")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
            }

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error deleting item from cart");
        }
    }

    @GetMapping("/total/{userId}")
    public ResponseEntity<?> getTotalWishlist(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(cartService.totalProductsInCart(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error retrieving cart total");
        }
    }
}
