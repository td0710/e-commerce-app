package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.entity.ShippingDetails;
import com.example.ecommerce_app.repository.ShippingDetailsRepository;
import com.example.ecommerce_app.service.ShippingDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class ShippingDetailsServiceImpl implements ShippingDetailsService {

    ShippingDetailsRepository shippingDetailsRepository;

    public ShippingDetailsServiceImpl(ShippingDetailsRepository shippingDetailsRepository) {
        this.shippingDetailsRepository = shippingDetailsRepository;
    }

    public ShippingDetails findByUserId(Long userId) {
        return shippingDetailsRepository.findByUserId(userId);
    }
    public void save(ShippingDetails shippingDetails) {
        shippingDetailsRepository.save(shippingDetails);
    }
}
