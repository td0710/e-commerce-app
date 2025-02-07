package com.example.ecommerce_app.dto.response;

import com.example.ecommerce_app.entity.Product;
import lombok.Data;

@Data
public class ProductWishlistResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private double price;
    private String image;

    public ProductWishlistResponse(Product product) {
        this.id = product.getId();
        this.title = product.getTitle();
        this.description = product.getDescription();
        this.category = product.getCategory();
        this.price = product.getPrice();
        this.image = product.getImage();
    }
}
