package com.example.ecommerce_app.service;

import com.example.ecommerce_app.entity.Users;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


public interface UserService {
    Users findById(Long id);
}
