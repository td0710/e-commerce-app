package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    @Query("SELECT pv FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.size = :size AND pv.color = :color")
    ProductVariant findByProduct_IdSizeAndColor(Long productId,String size, String color);
}
