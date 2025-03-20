package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.request.ProductDto;
import com.example.ecommerce_app.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse findAllProducts(int pageNo, int pageSize) ;

    ProductResponse findProductsByCategory(int pageNo, int pageSize, String category);

    String updateProduct(Long id, ProductDto productDto);

    String updateProductQuantity(Long productId, String size, String color, int quantity);

    String createVariant(Long productId, String size, String color, int quantity);

    String createProduct(ProductDto productDto);

    String deleteVariant(Long productId,String size, String color);

    List<ProductDto> searchProducts(String query) ;
}
