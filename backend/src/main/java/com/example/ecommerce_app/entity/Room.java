package com.example.ecommerce_app.entity;

import com.example.ecommerce_app.dto.response.MessageResponse;
import com.example.ecommerce_app.util.JsonUtils;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "rooms")
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", unique = true, nullable = false)
    private String roomId;

    @Lob
    @Column(name = "list_message", columnDefinition = "TEXT")
    private String listMessage;

    public List<MessageResponse> getMessageList() {
        return JsonUtils.fromJsonList(listMessage, MessageResponse.class);
    }

        public void addMessage(MessageResponse message) {
        List<MessageResponse> messages = getMessageList();
        messages.add(message);
        this.listMessage = JsonUtils.toJson(messages);
    }
}
