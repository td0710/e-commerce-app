package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.ProductDto;
import com.example.ecommerce_app.dto.response.ProductResponse;
import com.example.ecommerce_app.entity.Product;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

public interface ProductService {

    ProductResponse findAllProducts(int pageNo, int pageSize) ;

    ProductResponse findProductsByCategory(int pageNo, int pageSize, String category);

    void deleteById(Long productId);

    String updateProduct(Long id, ProductDto productDto);

    String updateProductQuantity(Long productId, String size, String color, int quantity);

    String createVariant(Long productId, String size, String color, int quantity);

    String createProduct(ProductDto productDto);

    String deleteVariant(Long productId,String size, String color);

    Product findProductById(Long id);
}
