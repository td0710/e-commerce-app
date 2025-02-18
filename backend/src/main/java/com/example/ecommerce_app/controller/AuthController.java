package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.security.JWTGenerator;
import com.example.ecommerce_app.repository.RoleRepository;
import com.example.ecommerce_app.repository.UserRepository;
import com.example.ecommerce_app.dto.AuthResponseDTO;
import com.example.ecommerce_app.dto.LoginDto;
import com.example.ecommerce_app.dto.RegisterDto;
import com.example.ecommerce_app.entity.Role;
import com.example.ecommerce_app.entity.Users;
import com.example.ecommerce_app.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;


@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private CartService cartService;
    private PasswordEncoder passwordEncoder;
    private JWTGenerator jwtGenerator;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JWTGenerator jwtGenerator,
                          CartService cartService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
        this.cartService = cartService;
    }


    @PostMapping("login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDto loginDto) {
        String username = loginDto.getUsername();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword()
                ));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);
        Optional<Users> user= userRepository.findByUsername(username);
        System.out.println("!"+token);
        return new ResponseEntity<>(new AuthResponseDTO(token,user.get().getUsername(),user.get().getUser_email()), HttpStatus.OK);
    }

    @PostMapping("register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDto registerDto) {
        if(userRepository.existsByUsername(registerDto.getUsername())) {
            return new ResponseEntity<>(new AuthResponseDTO(null, null, null), HttpStatus.BAD_REQUEST);
        }
        Users user = new Users();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setUser_email(registerDto.getEmail());

        Role roles = roleRepository.findByName("USER").get();

        user.setRoles(Collections.singletonList(roles));
        userRepository.save(user);
        cartService.createCart(user.getId());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerDto.getUsername(), registerDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);


        return new ResponseEntity<>(new AuthResponseDTO(token, user.getUsername(), user.getUser_email()), HttpStatus.OK);

    }
    @PostMapping("login/google")
    public ResponseEntity<AuthResponseDTO> loginGoogle(@RequestBody LoginDto loginDto) {

        String username = loginDto.getUsername();

        Optional<Users> user= userRepository.findByUsername(username);

        if(!user.isPresent()) {
            Users user1 = new Users();
            user1.setUsername(username);
            user1.setUser_email(username);

            Role roles = roleRepository.findByName("USER").get();

            user1.setRoles(Collections.singletonList(roles));

            userRepository.save(user1);

            cartService.createCart(user1.getId());
        }

        user = userRepository.findByUsername(username);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.get().getUsername(), null, Collections.singletonList(new SimpleGrantedAuthority("USER"))
        );;
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        System.out.println("!"+token);

        return new ResponseEntity<>(new AuthResponseDTO(token,user.get().getUsername(),user.get().getUser_email()), HttpStatus.OK);
    }
}
