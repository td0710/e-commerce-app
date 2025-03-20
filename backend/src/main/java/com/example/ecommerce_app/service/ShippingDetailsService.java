package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.request.ShippingDetailsDto;

public interface ShippingDetailsService {
    ShippingDetailsDto getShippingDetails(Long id);
    String saveShippingDetails(Long id,ShippingDetailsDto shippingDetailsDto);
}
