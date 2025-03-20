package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.util.JsonUtils;
import com.example.ecommerce_app.dto.AuthResponseDTO;
import com.example.ecommerce_app.dto.LoginDto;
import com.example.ecommerce_app.dto.RegisterDto;
import com.example.ecommerce_app.dto.response.MessageResponse;
import com.example.ecommerce_app.entity.Role;
import com.example.ecommerce_app.entity.Room;
import com.example.ecommerce_app.entity.Users;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.repository.RoleRepository;
import com.example.ecommerce_app.repository.RoomRepository;
import com.example.ecommerce_app.repository.UserRepository;
import com.example.ecommerce_app.security.JWTGenerator;
import com.example.ecommerce_app.service.AuthService;
import com.example.ecommerce_app.service.CartService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Transactional
@Service
public class AuthServiceImpl implements AuthService {
    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private CartService cartService;
    private PasswordEncoder passwordEncoder;
    private JWTGenerator jwtGenerator;
    private RoomRepository roomRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JWTGenerator jwtGenerator,
                           CartService cartService,
                           RoomRepository roomRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
        this.cartService = cartService;
        this.roomRepository = roomRepository;
    }

    public AuthResponseDTO login(LoginDto loginDto) {
        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsername(),
                            loginDto.getPassword()
                    ));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtGenerator.generateToken(authentication);

            Users user = userRepository.findByUsername(loginDto.getUsername())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            return new AuthResponseDTO(token, user.getUsername(), user.getUser_email(), user.getRole().getName());
        } catch (BadCredentialsException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

    public AuthResponseDTO register(RegisterDto registerDto) {
        if(userRepository.existsByUsername(registerDto.getUsername())) {
            throw new AppException(ErrorCode.EXISTED_USER) ;
        }
        if(userRepository.findUserIdByEmail(registerDto.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.EXISTED_USER_EMAIL);
        }
        Users user = new Users();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setUser_email(registerDto.getEmail());

        Role roles = roleRepository.findByName("USER").get();

        user.setRole(roles);

        userRepository.save(user);

        cartService.createCart(user.getId());

        Room room = new Room();
        room.setRoomId(registerDto.getUsername());
        MessageResponse message = new MessageResponse();
        message.setContent("Welcome " + registerDto.getUsername() + " to our shop! Feel free to ask any questions here.");
        message.setSender("admin");
        message.setTimestamp(LocalDateTime.now().toString());
        room.setListMessage("["+JsonUtils.toJson(message)+"]");
        roomRepository.save(room);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerDto.getUsername(), registerDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        return new AuthResponseDTO(token, user.getUsername(), user.getUser_email(),user.getRole().getName());

    }

    public AuthResponseDTO loginGoogle (LoginDto loginDto) {

        String username = loginDto.getUsername();

        Optional<Users> user= userRepository.findByUsername(username);

        System.out.println(user);
        if(!user.isPresent()) {
            Users user1 = new Users();
            user1.setUsername(username);
            user1.setUser_email(username);

            Role roles = roleRepository.findByName("USER").get();

            user1.setRole(roles);

            userRepository.save(user1);

            cartService.createCart(user1.getId());

            Room room = new Room();
            room.setRoomId(loginDto.getUsername());
            MessageResponse message = new MessageResponse();
            message.setContent("Welcome " + loginDto.getUsername() + " to our shop! Feel free to ask any questions here.");
            message.setSender("admin");
            message.setTimestamp(LocalDateTime.now().toString());
            room.setListMessage("["+JsonUtils.toJson(message)+"]");
            roomRepository.save(room);
        }

        user = userRepository.findByUsername(username);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.get().getUsername(), null, Collections.singletonList(new SimpleGrantedAuthority(user.get().getRole().getName()))
        );;
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        System.out.println("!"+token);

        return new AuthResponseDTO(token,
                user.get().getUsername(),user.get().getUser_email(),user.get().getRole().getName());
    }
}
