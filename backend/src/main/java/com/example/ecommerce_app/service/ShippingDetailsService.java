package com.example.ecommerce_app.service;

import com.example.ecommerce_app.entity.ShippingDetails;

public interface ShippingDetailsService {
    ShippingDetails findByUserId(Long userId);
    void save(ShippingDetails shippingDetails);
}
