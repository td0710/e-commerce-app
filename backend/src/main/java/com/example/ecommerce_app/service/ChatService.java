package com.example.ecommerce_app.service;

import com.example.ecommerce_app.dto.MessageDto;
import com.example.ecommerce_app.dto.response.MessageResponse;
import com.example.ecommerce_app.entity.Room;

import java.util.List;

public interface ChatService {
    MessageResponse sendMessage(String roomId, MessageDto message) ;
    List<MessageResponse> getMessage(String roomId);
    List<Room> getRooms();
}
