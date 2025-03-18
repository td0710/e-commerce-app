package com.example.ecommerce_app.entity;

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

    public List<Message> getMessageList() {
        return JsonUtils.fromJsonList(listMessage, Message.class);
    }

    public void addMessage(Message message) {
        List<Message> messages = getMessageList();
        messages.add(message);
        this.listMessage = JsonUtils.toJson(messages);
    }
}
