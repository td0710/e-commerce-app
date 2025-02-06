package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.response.ProductResponse;

public interface ProductService {
    ProductResponse findAllProducts(int pageNo, int pageSize) ;
}
