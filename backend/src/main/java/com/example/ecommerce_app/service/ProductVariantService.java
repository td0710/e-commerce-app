package com.example.ecommerce_app.service;

import com.example.ecommerce_app.entity.ProductVariant;
import com.example.ecommerce_app.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class ProductVariantService {
    private final ProductVariantRepository productVariantRepository;
    public ProductVariantService(ProductVariantRepository productVariantRepository) {
        this.productVariantRepository = productVariantRepository;
    }

    public ProductVariant findById(Long id) {
        return productVariantRepository.findById(id).orElse(null);
    }
}
