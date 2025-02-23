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
        return ResponseEntity.ok("success");
    }

    @PutMapping("/update/product/quantity/{productId}")
    public ResponseEntity<?> updateProductQuantity(@PathVariable Long productId,
                                                  @RequestParam String size,
                                                  @RequestParam String color,
                                                  @RequestParam int quantity) {

        ProductVariant productVariant = productVariantService.findByProductIdAndSizeAndColor(productId, size, color);

        productVariant.setStock(quantity);
        productVariantService.save(productVariant) ;

        return ResponseEntity.ok("success");
    }
}
