package com.example.ecommerce_app.dto.request;

import lombok.Data;

@Data
public class MessageDto {
    private String content;
    private String sender;
    private String roomId;
}
