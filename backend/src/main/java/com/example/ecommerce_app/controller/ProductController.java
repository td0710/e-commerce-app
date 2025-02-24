package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.ProductDto;
import com.example.ecommerce_app.dto.response.ProductResponse;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.ProductVariant;
import com.example.ecommerce_app.service.impl.ProductServiceImpl;
import com.example.ecommerce_app.service.impl.ProductVariantServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/products/secure")
public class ProductController {

    private final ProductServiceImpl productService;
    private final ProductVariantServiceImpl productVariantService;

    ProductController(ProductServiceImpl productService, ProductVariantServiceImpl productVariantService) {
        this.productService = productService;
        this.productVariantService = productVariantService;
    }

    @GetMapping("/getall")
    public ResponseEntity<ProductResponse> getAll(@RequestParam int page, @RequestParam int size) {
        return new ResponseEntity<>(productService.findAllProducts(page, size), HttpStatus.OK);
    }

    @GetMapping("/category")
    public ResponseEntity<ProductResponse> getByCategory(@RequestParam int page, @RequestParam int size,
                                                         @RequestParam String category) {
        return new ResponseEntity<>(productService.findProductsByCategory(page, size,category), HttpStatus.OK);
    }

    @PutMapping("/update/product/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Long productId,@RequestBody ProductDto productDto) {

        Product product = productService.findProductById(productId);

        product.setCategory(productDto.getCategory());
        product.setPrice(productDto.getPrice());
        product.setDescription(productDto.getDescription());
        product.setImage(productDto.getImage());
        product.setTitle(productDto.getTitle());

        productService.save(product) ;
        return ResponseEntity.ok("update success");
    }

    @PutMapping("/update/product/quantity/{productId}")
    public ResponseEntity<?> updateProductQuantity(@PathVariable Long productId,
                                                  @RequestParam String size,
                                                  @RequestParam String color,
                                                  @RequestParam int quantity) {

        ProductVariant productVariant = productVariantService.findByProductIdAndSizeAndColor(productId, size, color);

        productVariant.setStock(quantity);
        productVariantService.save(productVariant) ;

        return ResponseEntity.ok("update quantity success");
    }

    @PostMapping("/create/variant/{productId}")
    public ResponseEntity<?> createProductVariant(@PathVariable Long productId,
                                                   @RequestParam String size,
                                                   @RequestParam String color,
                                                   @RequestParam int quantity) {

        ProductVariant productVariant = new ProductVariant();
        productVariant.setProduct(productService.findProductById(productId));
        productVariant.setSize(size);
        productVariant.setColor(color);
        productVariant.setStock(quantity);

        productVariantService.save(productVariant) ;

        return ResponseEntity.ok("create success");
    }

    @DeleteMapping("/delete/variant/{productId}")
    public ResponseEntity<?> deleteProductVariant(@PathVariable Long productId,
                                                  @RequestParam String size,
                                                  @RequestParam String color) {

        ProductVariant productVariant = productVariantService.findByProductIdAndSizeAndColor(productId, size, color);


        productVariantService.deleteById(productVariant.getId());


        System.out.println(productVariant);
        return ResponseEntity.ok("delete success");
    }

    @PostMapping("/create/product")
    public ResponseEntity<?> createProduct(@RequestBody ProductDto productDto) {
        Product product = new Product();
        product.setCategory(productDto.getCategory());
        product.setPrice(productDto.getPrice());
        product.setDescription(productDto.getDescription());
        product.setImage(productDto.getImage());
        product.setTitle(productDto.getTitle());


        Product savedProduct = productService.save(product);

        if (productDto.getVariants() != null) {
            for (ProductVariant variant : productDto.getVariants()) {
                ProductVariant productVariant = new ProductVariant();
                productVariant.setProduct(savedProduct);
                productVariant.setSize(variant.getSize());
                productVariant.setColor(variant.getColor());
                productVariant.setStock(variant.getStock());

                productVariantService.save(productVariant);
            }
        }

        return ResponseEntity.ok("create success");
    }

    @DeleteMapping("/delete/product/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {

        productService.deleteById(productId) ;
        return ResponseEntity.ok("delete success");
    }
}
