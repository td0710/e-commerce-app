package com.example.ecommerce_app.dto.response;

import lombok.Data;

import java.util.List;


@Data
public class OrderPageResponse {
    List<OrderResponse> orders;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}

