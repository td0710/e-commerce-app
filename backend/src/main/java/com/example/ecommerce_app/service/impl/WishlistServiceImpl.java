package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.dto.response.ProductWishlistResponse;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.Users;
import com.example.ecommerce_app.entity.Wishlist;
import com.example.ecommerce_app.repository.ProductRepository;
import com.example.ecommerce_app.repository.WishlistRepository;
import com.example.ecommerce_app.service.WishlistService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private WishlistRepository wishlistRepository;

    public WishlistServiceImpl(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;

    }

    public Page<ProductWishlistResponse> getProductsInWishListByUserId(Long userId, Pageable pageable) {
        Page<Wishlist> wishlists = wishlistRepository.findByUserId(userId, pageable);

        List<ProductWishlistResponse> products = wishlists.getContent()
                .stream()
                .map(wishlist -> new ProductWishlistResponse(wishlist.getProduct()))
                .collect(Collectors.toList());

        return new PageImpl<>(products, pageable, wishlists.getTotalElements());
    }
    public void AddWishlist(Product product, Users user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlistRepository.save(wishlist);
    }
    public void deleteWishlist(Product product, Users user) {
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), product.getId());
    }

    public boolean isProductInWishlist(Long userId, Long productId) {
        Wishlist wishlist = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if(wishlist != null) {
            return true;
        }
        return false ;
    }
    public long totalProductsInWishlist(Long userId) {
        return wishlistRepository.countByUserId(userId);
    }
}
