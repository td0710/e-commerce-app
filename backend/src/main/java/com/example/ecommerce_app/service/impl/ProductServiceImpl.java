package com.example.ecommerce_app.service.impl;


import com.example.ecommerce_app.dto.request.ProductDto;
import com.example.ecommerce_app.dto.response.ProductResponse;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.ProductVariant;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.repository.ProductRepository;
import com.example.ecommerce_app.repository.ProductVariantRepository;
import com.example.ecommerce_app.service.ProductService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@EnableCaching
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    ProductServiceImpl(ProductRepository productRepository, ProductVariantRepository productVariantRepository) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
    }

    @Cacheable(value = "products", key = "#pageNo + ':' + #pageSize")
    public ProductResponse findAllProducts(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Product> products = productRepository.findAll(pageable);
        List<Product> productList = products.getContent();
        List<ProductDto> content = new ArrayList<>();
        for (Product product : productList) {

            ProductDto productDto = new ProductDto(
                    product.getId(),
                    product.getTitle(),
                    product.getDescription(),
                    product.getCategory(),
                    product.getPrice(),
                    product.getImage(),
                    null
            );

            content.add(productDto);
        }


        ProductResponse productResponse = new ProductResponse(
                content,
                products.getNumber(),
                products.getSize(),
                (int) products.getTotalElements(),
                products.getTotalPages(),
                products.isLast()
        );

        return productResponse;
    }

    @Cacheable(value = "product", key = "#productId")
    public Product findById(Long productId) {
        return productRepository.findById(productId).get();
    }

    public ProductResponse findProductsByCategory(int pageNo, int pageSize, String category) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Product> products = productRepository.findByCategory(category, pageable);

        List<Product> productList = products.getContent();

        List<ProductDto> content = new ArrayList<>();
        for (Product product : productList) {

            ProductDto productDto = new ProductDto(
                    product.getId(),
                    product.getTitle(),
                    product.getDescription(),
                    product.getCategory(),
                    product.getPrice(),
                    product.getImage(),
                    null
            );


            content.add(productDto);
        }


        ProductResponse productResponse = new ProductResponse(
                content,
                products.getNumber(),
                products.getSize(),
                products.getTotalPages(),
                (int) products.getTotalElements(),
                products.isLast()
        );

        return productResponse;
    }

    public String updateProduct(Long id, ProductDto productDto) {

        Product product = productRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.PRODUCT_NOT_FOUND)) ;

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
            throw new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND);
        }
        productVariant.setStock(quantity);
        productVariantRepository.save(productVariant) ;

        return "update quantity success" ;
    }

    public String createVariant(Long productId, String size, String color, int quantity) {

        ProductVariant productVariant = new ProductVariant();
        productVariant.setProduct(productRepository.findById(productId)
                .orElseThrow(()-> new AppException(ErrorCode.PRODUCT_NOT_FOUND))) ;
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
            throw new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND);
        }

        return "delete success";
    }

    public List<ProductDto> searchProducts(String query) {
        List<Product> products = productRepository.searchProducts(query);

        List<ProductDto> result = new ArrayList<>();

        for (Product product : products) {

            ProductDto productDto = new ProductDto(
                    product.getId(),
                    product.getTitle(),
                    product.getDescription(),
                    product.getCategory(),
                    product.getPrice(),
                    product.getImage(),
                    null
            );
            result.add(productDto);
        }
        return result;
    }
}
