package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.repository.UserRepository;

public class UserServiceImpl {


    UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void saveUser(String username) {
        userRepository.save(username);
    }
}
