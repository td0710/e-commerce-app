package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.dto.response.ErrorResponse;
import com.example.ecommerce_app.entity.Discount;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.service.DiscountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/discounts/secure")
public class DiscountController {

    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getDiscount(@RequestParam String code,
                                                @RequestParam Long productId,
                                                @RequestParam String category) {

        Discount discount = discountService.getDiscount(code, productId, category);

        return ResponseEntity.ok(discount);


    }
}
