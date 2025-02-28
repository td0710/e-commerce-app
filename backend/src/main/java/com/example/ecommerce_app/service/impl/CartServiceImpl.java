package com.example.ecommerce_app.service.impl;


import com.example.ecommerce_app.dto.response.CartResponse;
import com.example.ecommerce_app.dto.response.ProductCartResponse;
import com.example.ecommerce_app.entity.Cart;
import com.example.ecommerce_app.entity.CartItem;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.ProductVariant;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.repository.*;
import com.example.ecommerce_app.service.CartService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
public class CartServiceImpl implements CartService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private CartRepository cartRepository;
    private CartItemRepository cartItemRepository;
    private UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, UserRepository userRepository, ProductVariantRepository productVariantRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productVariantRepository = productVariantRepository;
        this.productRepository = productRepository;
    }


    public void createCart(Long userId) {
        Cart cart = new Cart();
        cart.setUser(userRepository.findById(userId).get());
        cart.setTotal(0L);
        cartRepository.save(cart);
    }

    public Long totalProductsInCart(Long userId)  {
        Cart cart = cartRepository.findByUserId(userId);
        return cart.getTotal();
    }

    public CartResponse getCart(Long userId, int page, int size) {
        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(page, size,Sort.by(Sort.Direction.DESC, "id"));

        Page<CartItem> cartItems1 = cartItemRepository.findByCart(cart, pageable);

        List<CartItem> cartItems = cartItems1.getContent();

        List<ProductCartResponse> productCartDtos = new ArrayList<>();

        CartResponse cartResponse = new CartResponse();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();
            ProductVariant productVariant = cartItem.getProductVariant();
            ProductCartResponse productCartDto = new ProductCartResponse();

            productCartDto.setProductId(product.getId());
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

        return cartResponse;
    }

    public String addCart(Long userId,
                        Long productId,
                        String size,
                        String color) {
        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        ProductVariant productVariant = productVariantRepository.findByProduct_IdSizeAndColor(productId,size,color) ;

        if (productVariant.getStock() <= 0) {
            throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK) ;
        }
        cart.setTotal(cart.getTotal()+1);
        cartRepository.save(cart);
        productVariant.setStock(productVariant.getStock()-1);
        productVariantRepository.save(productVariant);
        CartItem cartItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(),productVariant.getId());
        if(cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity()+1);
            cartItemRepository.save(cartItem);
            return "Added item to the cart";
        }
        CartItem newCartItem = new CartItem();
        newCartItem.setProductVariant(productVariant);
        newCartItem.setQuantity(1);
        newCartItem.setProduct(productRepository.findById(productId).orElseThrow(()->new AppException(ErrorCode.PRODUCT_NOT_FOUND)));
        newCartItem.setCart(cartRepository.findById(userId).orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND)));
        cartItemRepository.save(newCartItem);

        return "Added item to the cart";
    }

    public String addCartPage(Long userId, Long productId) {


        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        ProductVariant productVariant = productVariantRepository.findById(productId)
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND)) ;
        if (productVariant.getStock() <= 0) {
            return "Product out of stock";
        }
        cart.setTotal(cart.getTotal()+1);
        cartRepository.save(cart);
        productVariant.setStock(productVariant.getStock()-1);
        productVariantRepository.save(productVariant);
        CartItem cartItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(),productVariant.getId());
        if(cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity()+1);
            cartItemRepository.save(cartItem);
            return "Added item to the cart";
        }
        CartItem newCartItem = new CartItem();
        newCartItem.setProductVariant(productVariant);
        newCartItem.setQuantity(1);
        newCartItem.setProduct(productRepository.findById(productId).orElseThrow(()->new AppException(ErrorCode.PRODUCT_NOT_FOUND)));
        newCartItem.setCart(cartRepository.findById(userId).orElseThrow(()->new AppException(ErrorCode.CART_NOT_FOUND)));
        cartItemRepository.save(newCartItem);

        return "Added item to the cart";
    }

    public String decreaseCart(Long userId, Long productId) {

        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        ProductVariant productVariant = productVariantRepository.findById(productId)
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND)) ;
        cart.setTotal(cart.getTotal()-1);
        cartRepository.save(cart);
        productVariant.setStock(productVariant.getStock()+1);
        productVariantRepository.save(productVariant);
        CartItem cartItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(),productVariant.getId());
        cartItem.setQuantity(cartItem.getQuantity()-1);


        if (cartItem.getQuantity()!=0) cartItemRepository.save(cartItem);

        else cartItemRepository.delete(cartItem);

        return "Removed item successfully";
    }

    public String deleteCart(Long userId, Long productId) {

        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        ProductVariant productVariant = productVariantRepository.findById(productId)
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND)) ;

        CartItem cartItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(),productVariant.getId());

        productVariant.setStock(productVariant.getStock()+cartItem.getQuantity());
        productVariantRepository.save(productVariant);

        cart.setTotal(cart.getTotal()-cartItem.getQuantity());
        cartRepository.save(cart);

        cartItemRepository.delete(cartItem);

        return "Delete item success";
    }

}
