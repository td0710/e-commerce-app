package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.response.ProductCartDto;
import com.example.ecommerce_app.dto.response.CartResponse;
import com.example.ecommerce_app.entity.Cart;
import com.example.ecommerce_app.entity.CartItem;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.ProductVariant;
import com.example.ecommerce_app.service.CartItemService;
import com.example.ecommerce_app.service.CartService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/carts/secure")
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;
    public CartController(CartService cartService, CartItemService cartItemService) {
        this.cartService = cartService;
        this.cartItemService = cartItemService;
    }

    @GetMapping("/get/cart/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId,
                                                @RequestParam int page,
                                                @RequestParam int size) {

        Cart cart = cartService.findById(userId);

        Page<CartItem> cartItems1 = cartItemService.findByCart(cart,page,size);

        List<CartItem> cartItems = cartItems1.getContent();

        List<ProductCartDto> productCartDtos = new ArrayList<>();

        CartResponse cartResponse = new CartResponse();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();
            ProductVariant productVariant = cartItem.getProductVariant();
            ProductCartDto productCartDto = new ProductCartDto();

            productCartDto.setId(cartItem.getId());
            productCartDto.setCategory(product.getCategory());
            productCartDto.setPrice(product.getPrice());
            productCartDto.setTitle(product.getTitle());
            productCartDto.setImage(product.getImage());
            productCartDto.setColor(productVariant.getColor());
            productCartDto.setSize(productVariant.getSize());
            productCartDto.setQuantity(cartItem.getQuantity());
            productCartDtos.add(productCartDto);
        }

        cartResponse.setProducts(productCartDtos);
        cartResponse.setPageNo(cartItems1.getNumber());
        cartResponse.setPageSize(cartItems1.getSize());
        cartResponse.setTotalElements(cartItems1.getTotalElements());
        cartResponse.setTotalPages(cartItems1.getTotalPages());
        cartResponse.setLast(cartItems1.isLast());
        return ResponseEntity.ok(cartResponse);
    }

}
