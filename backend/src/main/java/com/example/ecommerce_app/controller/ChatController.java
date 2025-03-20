package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.dto.request.MessageDto;
import com.example.ecommerce_app.dto.response.MessageResponse;
import com.example.ecommerce_app.entity.Room;
import com.example.ecommerce_app.repository.RoomRepository;
import com.example.ecommerce_app.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin("http://localhost:3000")
@Controller
@RequestMapping("/api/chat/secure")
public class ChatController {

    private RoomRepository roomRepository;
    private ChatService chatService;

    public ChatController(RoomRepository roomRepository,ChatService chatService) {
        this.roomRepository = roomRepository;
        this.chatService = chatService;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public MessageResponse sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageDto request
    ) {

        Room room = roomRepository.findByRoomId(roomId);
        MessageResponse message = new MessageResponse();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimestamp(LocalDateTime.now().toString());
        if (room != null) {
            room.addMessage(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("room not found !!");
        }

        return message;
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable String roomId

    ) {
        List<MessageResponse> messages = chatService.getMessage(roomId);

        return ResponseEntity.ok(messages);

    }

    @GetMapping("/get/room")
    public ResponseEntity<?> getRoom() {

        List<Room> rooms =  chatService.getRooms();
        return ResponseEntity.ok(rooms);
    }
}
