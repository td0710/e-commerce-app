package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.entity.ProductVariant;
import com.example.ecommerce_app.repository.ProductVariantRepository;
import com.example.ecommerce_app.service.ProductVariantService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class ProductVariantServiceImpl implements ProductVariantService {
    private final ProductVariantRepository productVariantRepository;
    public ProductVariantServiceImpl(ProductVariantRepository productVariantRepository) {
        this.productVariantRepository = productVariantRepository;
    }

    public ProductVariant findById(Long id) {
        return productVariantRepository.findById(id).orElse(null);
    }

    public ProductVariant findByProductIdAndSizeAndColor(Long productId, String size, String color) {
        return productVariantRepository.findByProduct_IdSizeAndColor(productId,size,color) ;
    }
    public void saveProductVariant(ProductVariant productVariant) {
        productVariantRepository.save(productVariant);
    }
    public List<ProductVariant> findByProductId(Long productId) {
        return productVariantRepository.findByProduct_Id(productId);
    }
    public void save(ProductVariant productVariant) {
        productVariantRepository.save(productVariant);
    }
    public void delete(ProductVariant productVariant) {
        productVariantRepository.delete(productVariant);
    }
    public void deleteById(Long id) {
        productVariantRepository.deleteById(id);
    }
}
