package com.example.ecommerce_app.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    List<ProductCartResponse> products;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
