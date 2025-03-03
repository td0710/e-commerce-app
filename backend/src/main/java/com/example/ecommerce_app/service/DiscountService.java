package com.example.ecommerce_app.service;

import com.example.ecommerce_app.entity.Discount;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public interface DiscountService {
    Discount getDiscount(String code,Long productId,String category);
}
