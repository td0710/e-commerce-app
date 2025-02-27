package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.ProductDto;
import com.example.ecommerce_app.dto.response.ProductResponse;
import com.example.ecommerce_app.entity.Product;
import com.example.ecommerce_app.entity.ProductVariant;
import com.example.ecommerce_app.repository.ProductRepository;
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
    private final ProductRepository productRepository;

    ProductController(ProductServiceImpl productService, ProductVariantServiceImpl productVariantService, ProductRepository productRepository) {
        this.productService = productService;
        this.productVariantService = productVariantService;
        this.productRepository = productRepository;
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

        try {
            String message = productService.updateProduct(productId, productDto);
            return ResponseEntity.ok(message);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()) ;
        }
    }

    @PutMapping("/update/product/quantity/{productId}")
    public ResponseEntity<?> updateProductQuantity(@PathVariable Long productId,
                                                  @RequestParam String size,
                                                  @RequestParam String color,
                                                  @RequestParam int quantity) {

       try {
           String message = productService.updateProductQuantity(productId, size, color, quantity);
           return ResponseEntity.ok(message);
       }
       catch (Exception e) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()) ;
       }
    }

    @PostMapping("/create/variant/{productId}")
    public ResponseEntity<?> createProductVariant(@PathVariable Long productId,
                                                   @RequestParam String size,
                                                   @RequestParam String color,
                                                   @RequestParam int quantity) {

        try {
            String message = productService.createVariant(productId, size, color, quantity);
            return ResponseEntity.ok(message);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()) ;
        }
    }

    @DeleteMapping("/delete/variant/{productId}")
    public ResponseEntity<?> deleteProductVariant(@PathVariable Long productId,
                                                  @RequestParam String size,
                                                  @RequestParam String color) {

        try {
            String message = productService.deleteVariant(productId, size, color);

            return ResponseEntity.ok(message);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()) ;

        }
    }

    @PostMapping("/create/product")
    public ResponseEntity<?> createProduct(@RequestBody ProductDto productDto) {

        try {
            String message = productService.createProduct(productDto);
            return ResponseEntity.ok(message);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()) ;
        }
    }

    @DeleteMapping("/delete/product/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {

        productRepository.deleteById(productId) ;

        return ResponseEntity.ok("delete success");
    }
}
