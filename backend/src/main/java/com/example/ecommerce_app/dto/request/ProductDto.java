package com.example.ecommerce_app.dto.request;

import com.example.ecommerce_app.entity.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {

    private Long id;


    private String title;


    private String description;


    private String category;


    private double price;


    private String image;


    private List<ProductVariant> variants;
}
