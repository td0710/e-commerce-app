package com.example.ecommerce_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShippingDetailsDto {

    private Long id;
    private Long userId;
    private String country;
    private String name;
    private String contactNumber;
    private String email;
    private String homeAddress;
}
