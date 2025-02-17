package com.example.ecommerce_app.service;

import com.example.ecommerce_app.entity.ProductVariant;

public interface ProductVariantService {
    ProductVariant findByProductIdAndSizeAndColor(Long productId, String size, String color);
    void saveProductVariant(ProductVariant productVariant);
    ProductVariant findById(Long id);
}
