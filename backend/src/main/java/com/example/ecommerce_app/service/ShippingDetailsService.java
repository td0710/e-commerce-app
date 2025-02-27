package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.ShippingDetailsDto;
import com.example.ecommerce_app.entity.ShippingDetails;

public interface ShippingDetailsService {
    ShippingDetailsDto getShippingDetails(Long id);
    String saveShippingDetails(Long id,ShippingDetailsDto shippingDetailsDto);
}
