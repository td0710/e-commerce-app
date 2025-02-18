package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.ShippingDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingDetailsRepository extends JpaRepository<ShippingDetails, Long> {
    ShippingDetails findByUserId(Long userId);
}
