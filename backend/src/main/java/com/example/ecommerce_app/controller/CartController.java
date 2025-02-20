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

            productCartDto.setId(productVariant.getId());
            productCartDto.setCartItemId(cartItem.getId());
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
        Cart cart = cartService.findById(userId);

        ProductVariant productVariant = productVariantService.findByProductIdAndSizeAndColor(productId,size,color) ;
        if(productVariant.getStock() <= 0) {
            return ResponseEntity.ok("out of stock");
        }
        cart.setTotal(cart.getTotal()+1);
        cartService.saveCart(cart);
        productVariant.setStock(productVariant.getStock()-1);
        productVariantService.saveProductVariant(productVariant);
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
        return ResponseEntity.ok("add item success");
    }
    @PostMapping("/add/cartpage/{userId}/{productId}")
    public ResponseEntity<?> addCartPage(@PathVariable Long userId,@PathVariable Long productId) {
        Cart cart = cartService.findById(userId);

        ProductVariant productVariant = productVariantService.findById(productId) ;
        if(productVariant.getStock() <= 0) {
            return ResponseEntity.ok("out of stock");
        }
        cart.setTotal(cart.getTotal()+1);
        cartService.saveCart(cart);
        productVariant.setStock(productVariant.getStock()-1);
        productVariantService.saveProductVariant(productVariant);
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
        return ResponseEntity.ok("add item success");
    }
    @PostMapping("/decrease/cart/{userId}/{productId}")
    public ResponseEntity<?> decreaseCart(@PathVariable Long userId,@PathVariable Long productId,
                                          @RequestParam String size,
                                          @RequestParam String color) {
        Cart cart = cartService.findById(userId);

        ProductVariant productVariant = productVariantService.findById(productId) ;

        cart.setTotal(cart.getTotal()-1);
        cartService.saveCart(cart);
        productVariant.setStock(productVariant.getStock()+1);
        productVariantService.saveProductVariant(productVariant);
        CartItem cartItem = cartItemService.findByCartIdAndProductVariantId(cart.getId(),productVariant.getId());
        cartItem.setQuantity(cartItem.getQuantity()-1);
        if (cartItem.getQuantity()!=0) cartItemService.addCartItem(cartItem);
        else cartItemService.removeCartItem(cartItem);
        return ResponseEntity.ok("decrease item success");
    }

    @DeleteMapping("/delete/cart/{userId}/{productId}")
    public ResponseEntity<?> deleteCart(@PathVariable Long userId,@PathVariable Long productId,
                                        @RequestParam String size,
                                        @RequestParam String color) {
        Cart cart = cartService.findById(userId);

        ProductVariant productVariant = productVariantService.findById(productId) ;

        CartItem cartItem = cartItemService.findByCartIdAndProductVariantId(cart.getId(),productVariant.getId());

        productVariant.setStock(productVariant.getStock()+cartItem.getQuantity());
        productVariantService.saveProductVariant(productVariant);

        cart.setTotal(cart.getTotal()-cartItem.getQuantity());
        cartService.saveCart(cart);

        cartItemService.removeCartItem(cartItem);

        return ResponseEntity.ok("delete item success");
    }

    @GetMapping("/" +
            "total/{userId}")
    public ResponseEntity<Long> getTotalWishlist(@PathVariable Long userId) {
        Long total = cartService.totalProductsInCart(userId);
        return ResponseEntity.ok(total);
    }
}

