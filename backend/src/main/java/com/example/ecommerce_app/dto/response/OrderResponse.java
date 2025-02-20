package com.example.ecommerce_app.dto.response;


import lombok.Data;

@Data
public class OrderResponse {
    Long orderId;
    Long totalPrice;
    int quantity ;
    String status;
    String size ;
    String color;
    String shippingName;
    String shippingAddress;
    String shippingCountry;
    String shippingEmail;
    String productName;
    String productCategory;
    String productImg;
}
