package com.example.ecommerce_app.dto;

import com.example.ecommerce_app.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
public class ProductDto {

    private Long id;


    private String title;


    private String description;


    private String category;


    private double price;


    private String image;


    private List<ProductVariant> variants;
}
