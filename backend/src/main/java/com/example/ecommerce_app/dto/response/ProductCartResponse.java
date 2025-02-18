package com.example.ecommerce_app.dto.response;

import lombok.Data;

@Data
public class ProductCartResponse {

    private Long id;

    private Long cartItemId;

    private String title;

    private String description;

    private String category;

    private double price;

    private String image;

    private String color;

    private String size ;

    private int quantity ;
}
