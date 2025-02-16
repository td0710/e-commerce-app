package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.response.ProductResponse;
import com.example.ecommerce_app.service.impl.ProductServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/products/secure")
public class ProductController {

    private final ProductServiceImpl productService;

    ProductController(ProductServiceImpl productService) {
        this.productService = productService;
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
}
