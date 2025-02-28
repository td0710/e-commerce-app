package com.example.ecommerce_app.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    Long orderId;
    Long totalPrice;
    int quantity ;
    String status;
    String paymentStatus;
    String size ;
    String color;
    String shippingName;
    String shippingAddress;
    String shippingCountry;
    String shippingEmail;
    String productName;
    String contactNumber;
    String productCategory;
    String productImg;


}
