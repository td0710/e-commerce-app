package com.example.ecommerce_app.service.impl;


import com.example.ecommerce_app.dto.ProductDto;
import com.example.ecommerce_app.dto.response.ProductResponse;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.ProductVariant;
import com.example.ecommerce_app.repository.ProductRepository;
import com.example.ecommerce_app.repository.ProductVariantRepository;
import com.example.ecommerce_app.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    ProductServiceImpl(ProductRepository productRepository, ProductVariantRepository productVariantRepository) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
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

    public ProductResponse findProductsByCategory(int pageNo, int pageSize, String category) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Product> products = productRepository.findByCategory(category, pageable);

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

    public String updateProduct(Long id, ProductDto productDto) {

        Product product = productRepository.findById(id).
                orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Product not found")) ;;

        product.setCategory(productDto.getCategory());
        product.setPrice(productDto.getPrice());
        product.setDescription(productDto.getDescription());
        product.setImage(productDto.getImage());
        product.setTitle(productDto.getTitle());

        productRepository.save(product);

        return "update success";
    }
    public String updateProductQuantity(Long productId, String size, String color, int quantity) {

        ProductVariant productVariant = productVariantRepository.findByProduct_IdSizeAndColor(productId, size, color);

        if(productVariant == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Product variant not found");
        }
        productVariant.setStock(quantity);
        productVariantRepository.save(productVariant) ;

        return "update quantity success" ;
    }

    public String createVariant(Long productId, String size, String color, int quantity) {

        ProductVariant productVariant = new ProductVariant();
        productVariant.setProduct(productRepository.findById(productId).
                orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Product not found")));
        productVariant.setSize(size);
        productVariant.setColor(color);
        productVariant.setStock(quantity);

        productVariantRepository.save(productVariant) ;

        return "create success";
    }

    public String createProduct(ProductDto productDto) {

        Product product = new Product();
        product.setCategory(productDto.getCategory());
        product.setPrice(productDto.getPrice());
        product.setDescription(productDto.getDescription());
        product.setImage(productDto.getImage());
        product.setTitle(productDto.getTitle());


        Product savedProduct = productRepository.save(product);

        if (productDto.getVariants() != null) {
            for (ProductVariant variant : productDto.getVariants()) {
                ProductVariant productVariant = new ProductVariant();
                productVariant.setProduct(savedProduct);
                productVariant.setSize(variant.getSize());
                productVariant.setColor(variant.getColor());
                productVariant.setStock(variant.getStock());

                productVariantRepository.save(productVariant);
            }
        }

        return "create success";
    }

    public String deleteVariant(Long productId,String size, String color) {

        ProductVariant productVariant = productVariantRepository.findByProduct_IdSizeAndColor(productId, size, color);

        productVariantRepository.deleteById(productVariant.getId());

        if(productVariant == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Product variant not found");
        }

        return "delete success";
    }


}
