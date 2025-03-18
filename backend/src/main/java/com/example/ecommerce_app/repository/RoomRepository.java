package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Room findByRoomId(String roomId);
}
