package com.example.ecommerce_app.service.impl;


import com.example.ecommerce_app.dto.ProductDto;
import com.example.ecommerce_app.dto.response.ProductResponse;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.repository.ProductRepository;
import com.example.ecommerce_app.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    public ProductResponse findAllProducts(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Product> products = productRepository.findAll(pageable);
        List<Product> productList = products.getContent();


        ProductResponse productResponse = new ProductResponse();


        List<ProductDto> content = new ArrayList<>();
        for (Product product : productList) {
            ProductDto productDto = new ProductDto();


            productDto.setId(product.getId());
            productDto.setTitle(product.getTitle());
            productDto.setDescription(product.getDescription());
            productDto.setCategory(product.getCategory());
            productDto.setPrice(product.getPrice());
            productDto.setImage(product.getImage());


            content.add(productDto);
        }


        productResponse.setContent(content);
        productResponse.setPageNo(products.getNumber());
        productResponse.setPageSize(products.getSize());
        productResponse.setTotalPages(products.getTotalPages());
        productResponse.setTotalElements(products.getTotalElements());
        productResponse.setLast(products.isLast());

        return productResponse;
    }

    public Product findProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
}
