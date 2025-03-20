package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.dto.request.MessageDto;
import com.example.ecommerce_app.dto.response.MessageResponse;
import com.example.ecommerce_app.entity.Room;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.repository.RoomRepository;
import com.example.ecommerce_app.service.ChatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    private RoomRepository roomRepository;

    ChatServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public MessageResponse sendMessage(String roomId, MessageDto messageDto) {
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND) ;
        }
        MessageResponse message = new MessageResponse();
        message.setContent(messageDto.getContent());
        message.setSender(messageDto.getSender());
        message.setTimestamp(LocalDateTime.now().toString());
        if (room != null) {
            room.addMessage(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("room not found !!");
        }

        return message;
    }
    public List<MessageResponse> getMessage(String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND) ;
        }

        List<MessageResponse> messages = room.getMessageList();

        return messages;
    }
    public List<Room> getRooms() {
        List<Room> rooms = roomRepository.findAll();

        if(rooms == null) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND) ;
        }
        for (Room room : rooms) {
            if(room.getMessageList().size()==0) {
                rooms.remove(room);
            }
        }
        return rooms ;
    }
}
