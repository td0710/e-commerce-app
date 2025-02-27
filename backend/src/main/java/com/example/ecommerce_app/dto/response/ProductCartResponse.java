package com.example.ecommerce_app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCartResponse {

    private Long id;

    private Long cartItemId;

    private Long productId;


    private String title;

    private String description;

    private String category;

    private double price;

    private String image;

    private String color;

    private String size ;

    private int quantity ;
}
