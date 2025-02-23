package com.example.ecommerce_app.security;

import com.example.ecommerce_app.repository.UserRepository;
import com.example.ecommerce_app.entity.Role;
import com.example.ecommerce_app.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String password = user.getPassword();
        if (password == null || password.isEmpty()) {
            password = "{noop}N/A";
        }

        return new User(user.getUsername(), password, mapRoleToAuthority(user.getRole()));
    }

    private Collection<GrantedAuthority> mapRoleToAuthority(Role role) {
        return List.of(new SimpleGrantedAuthority(role.getName()));
    }

}
