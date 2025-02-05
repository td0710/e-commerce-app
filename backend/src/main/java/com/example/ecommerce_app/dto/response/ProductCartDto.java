package com.example.ecommerce_app.dto.response;

import lombok.Data;

@Data
public class ProductCartDto {

    private Long id;


    private String title;


    private String description;


    private String category;


    private double price;


    private String image;


    private String color;

    private String size ;

    private int stock ;
}
