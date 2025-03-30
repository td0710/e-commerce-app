package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.dto.request.OTPRequest;
import com.example.ecommerce_app.service.RedisService;
import com.example.ecommerce_app.util.CookieUtil;
import com.example.ecommerce_app.util.JsonUtils;
import com.example.ecommerce_app.dto.request.AuthResponseDTO;
import com.example.ecommerce_app.dto.request.LoginDto;
import com.example.ecommerce_app.dto.request.RegisterDto;
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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Transactional
@Service
public class AuthServiceImpl implements AuthService {


    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private CartService cartService;
    private PasswordEncoder passwordEncoder;
    private JWTGenerator jwtGenerator;
    private RoomRepository roomRepository;
    private RedisService redisService ;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JWTGenerator jwtGenerator,
                           CartService cartService,
                           RoomRepository roomRepository,
            RedisService redisService,JavaMailSender javaMailSender){
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
        this.cartService = cartService;
        this.roomRepository = roomRepository;
        this.redisService = redisService;
        this.mailSender = javaMailSender;
    }

    public AuthResponseDTO login(LoginDto loginDto,HttpServletResponse response) {
        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsername(),
                            loginDto.getPassword()
                    ));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtGenerator.generateToken(authentication);
            String refreshToken = jwtGenerator.generateRefreshToken(authentication);
            Users user = userRepository.findByUsername(loginDto.getUsername())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            CookieUtil.addRefreshTokenCookie(response, refreshToken);

            redisService.saveRefreshToken(user.getUsername(), refreshToken);

            return new AuthResponseDTO(token, refreshToken,
                    user.getUsername(), user.getUser_email(), user.getRole().getName());
        } catch (BadCredentialsException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

    public AuthResponseDTO register(RegisterDto registerDto, HttpServletResponse response) {
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
        String refreshToken = jwtGenerator.generateRefreshToken(authentication);

        CookieUtil.addRefreshTokenCookie(response, refreshToken);

        redisService.saveRefreshToken(user.getUsername(), refreshToken);

        return new AuthResponseDTO(token, refreshToken, user.getUsername(), user.getUser_email(),user.getRole().getName());

    }

    public AuthResponseDTO loginGoogle (LoginDto loginDto, HttpServletResponse response) {

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
        String refreshToken = jwtGenerator.generateRefreshToken(authentication);

        CookieUtil.addRefreshTokenCookie(response, refreshToken);

        redisService.saveRefreshToken(loginDto.getUsername(), refreshToken);


        System.out.println("!"+token);

        return new AuthResponseDTO(token, refreshToken,
                user.get().getUsername(),user.get().getUser_email(),user.get().getRole().getName());
    }

    public AuthResponseDTO refreshToken(HttpServletRequest request, HttpServletResponse response) {

        String refreshTokenCookie = CookieUtil.getRefreshTokenFromCookie(request);


        String username = jwtGenerator.getUsernameFromJwt(refreshTokenCookie);


        if (refreshTokenCookie == null) {
            throw new AppException(ErrorCode. EXPIRED_REFRESH_TOKEN);
        }

        if(!redisService.validateRefreshToken(username,refreshTokenCookie)) {
            redisService.deleteRefreshToken(username);
            throw new AppException(ErrorCode. EXPIRED_REFRESH_TOKEN);
        }



        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(), null, Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getName()))
        );

        String newAccessToken = jwtGenerator.generateToken(authentication);
        String refreshToken = jwtGenerator.generateRefreshToken(authentication);

        redisService.saveRefreshToken(username, refreshToken);

        CookieUtil.addRefreshTokenCookie(response, refreshToken);

        return new AuthResponseDTO(newAccessToken, refreshToken,
                user.getUsername(), user.getUser_email(), user.getRole().getName());
    }

    public void logout(String token, HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = CookieUtil.getRefreshTokenFromCookie(request);

        if (refreshToken != null) {
            String username = jwtGenerator.getUsernameFromJwt(refreshToken);
            redisService.blacklistToken(token);
            redisService.deleteRefreshToken(username) ;
        }

        CookieUtil.clearRefreshTokenCookie(response);
    }

    public void getOTP(OTPRequest otpRequest) {
        Optional<Users> users = userRepository.findByUsername(otpRequest.getUsername()) ;
        Optional<Long> users2 = userRepository.findUserIdByEmail(otpRequest.getToEmail());

        if(users.isPresent() ) {
            throw new AppException(ErrorCode.EXISTED_USER) ;
        }
        if(users2.isPresent()) {
            throw new AppException(ErrorCode.EXISTED_USER_EMAIL);
        }

        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        String subject = "Your OTP Code for Thai Duong Ecommerce App";
        String body = "Your One-Time Password (OTP) is: " + otp + "\nThis code is valid for 5 minutes.";

        System.out.println(fromEmail);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(otpRequest.getToEmail());
        message.setText(body);
        message.setSubject(subject);

        redisService.saveOTP(otpRequest.getToEmail(),String.valueOf(otp));

        mailSender.send(message);
    }

    public boolean checkOTP(String mail,String OTP) {
        return redisService.checkOTP(mail,OTP);
    }

}
