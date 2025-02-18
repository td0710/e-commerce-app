package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.entity.Users;
import com.example.ecommerce_app.repository.UserRepository;
import com.example.ecommerce_app.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {


    UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void saveUser(String username) {
        userRepository.save(username);
    }
    public Users findById(Long id) {
        return userRepository.findById(id).get();
    }
}
