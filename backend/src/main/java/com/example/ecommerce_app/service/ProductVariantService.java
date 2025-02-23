package com.example.ecommerce_app.service;

import com.example.ecommerce_app.entity.ProductVariant;

import java.util.List;

public interface ProductVariantService {
    ProductVariant findByProductIdAndSizeAndColor(Long productId, String size, String color);
    void saveProductVariant(ProductVariant productVariant);
    ProductVariant findById(Long id);
    List<ProductVariant> findByProductId(Long productId);

    void save(ProductVariant productVariant);

    void delete(ProductVariant productVariant);

    void deleteById(Long id);
}
