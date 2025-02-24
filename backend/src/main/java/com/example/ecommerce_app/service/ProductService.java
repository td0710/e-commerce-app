package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.response.ProductResponse;
import com.example.ecommerce_app.entity.Product;

public interface ProductService {
    ProductResponse findAllProducts(int pageNo, int pageSize) ;
    Product findProductById(Long id);
    ProductResponse findProductsByCategory(int pageNo, int pageSize, String category);

    Product save(Product product);

    void deleteById(Long productId);
}
