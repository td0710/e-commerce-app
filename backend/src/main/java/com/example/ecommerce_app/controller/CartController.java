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
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId,
                                                @RequestParam int page,
                                                @RequestParam int size) {

        CartResponse cartResponse = cartService.getCart(userId, page, size);

        if (cartResponse.getProducts() == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(cartResponse);
    }

    @PostMapping("/add/cart/{userId}/{productId}")
    public ResponseEntity<String> addCart(@PathVariable Long userId,
                                          @PathVariable Long productId,
                                          @RequestParam String size,
                                          @RequestParam String color) {
        String message = cartService.addCart(userId, productId, size, color);

        if (!message.equals("Added item to the cart")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
        }

        return ResponseEntity.ok(message);
    }
    @PostMapping("/add/cartpage/{userId}/{productId}")
    public ResponseEntity<?> addCartPage(@PathVariable Long userId,@PathVariable Long productId) {
        String message = cartService.addCartPage(userId, productId);

        if (!message.equals("Added item to the cart")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
        }

        return ResponseEntity.ok(message);
    }
    @PostMapping("/decrease/cart/{userId}/{productId}")
    public ResponseEntity<?> decreaseCart(@PathVariable Long userId,@PathVariable Long productId) {

        String message = cartService.decreaseCart(userId, productId);

        if (!message.equals("Removed item successfully")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
        }

        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/delete/cart/{userId}/{productId}")
    public ResponseEntity<?> deleteCart(@PathVariable Long userId,
                                        @PathVariable Long productId) {


        String message = cartService.deleteCart(userId, productId);

        if (!message.equals("Delete item success")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
        }

        return ResponseEntity.ok(message);
    }

    @GetMapping("/" +
            "total/{userId}")
    public ResponseEntity<Long> getTotalWishlist(@PathVariable Long userId) {

        return ResponseEntity.ok(cartService.totalProductsInCart(userId));
    }
}

