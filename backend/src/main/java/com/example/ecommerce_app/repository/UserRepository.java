package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);
    Boolean existsByUsername(String username);
    @Query("SELECT u.id FROM Users u WHERE u.user_email = :email")
    Optional<Long> findUserIdByEmail(@Param("email") String email);
}
