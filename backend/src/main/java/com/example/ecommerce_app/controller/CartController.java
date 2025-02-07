package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.response.ProductCartResponse;
import com.example.ecommerce_app.dto.response.CartResponse;
import com.example.ecommerce_app.entity.Cart;
import com.example.ecommerce_app.entity.CartItem;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.ProductVariant;
import com.example.ecommerce_app.service.impl.CartItemServiceImpl;
import com.example.ecommerce_app.service.impl.CartServiceImpl;
import com.example.ecommerce_app.service.impl.ProductServiceImpl;
import com.example.ecommerce_app.service.impl.ProductVariantServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/carts/secure")
public class CartController {

    private final CartServiceImpl cartService;
    private final CartItemServiceImpl cartItemService;
    private final ProductVariantServiceImpl productVariantService;
    private final ProductServiceImpl productService;
    public CartController(CartServiceImpl cartService, CartItemServiceImpl cartItemService,
                          ProductVariantServiceImpl productVariantService,
                          ProductServiceImpl productService) {
        this.cartService = cartService;
        this.cartItemService = cartItemService;
        this.productVariantService = productVariantService;
        this.productService = productService;
    }

    @GetMapping("/get/cart/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId,
                                                @RequestParam int page,
                                                @RequestParam int size) {

        Cart cart = cartService.findById(userId);

        Page<CartItem> cartItems1 = cartItemService.findByCart(cart,page,size);

        List<CartItem> cartItems = cartItems1.getContent();

        List<ProductCartResponse> productCartDtos = new ArrayList<>();

        CartResponse cartResponse = new CartResponse();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();
            ProductVariant productVariant = cartItem.getProductVariant();
            ProductCartResponse productCartDto = new ProductCartResponse();

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

    @PostMapping("/add/cart/{userId}/{productId}")
    public ResponseEntity<?> addCart(@PathVariable Long userId,@PathVariable Long productId,
                                     @RequestParam String size,
                                     @RequestParam String color) {

        ProductVariant productVariant = productVariantService.findByProductIdAndSizeAndColor(productId,size,color);
        Cart cart = cartService.findById(userId);
        CartItem cartItem = cartItemService.findByCartIdAndProductVariantId(cart.getId(),productVariant.getId());
        if(cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity()+1);
            cartItemService.addCartItem(cartItem);
            return ResponseEntity.ok("add cart success");
        }
        CartItem newCartItem = new CartItem();
        newCartItem.setProductVariant(productVariant);
        newCartItem.setQuantity(1);
        newCartItem.setProduct(productService.findProductById(productId)) ;
        newCartItem.setCart(cartService.findById(userId));
        cartItemService.addCartItem(newCartItem);
        return ResponseEntity.ok("add cart success");
    }
}
