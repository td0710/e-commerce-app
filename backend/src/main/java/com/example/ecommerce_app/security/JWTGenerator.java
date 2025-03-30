package com.example.ecommerce_app.security;

import com.example.ecommerce_app.entity.Users;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Component
public class JWTGenerator {
    @Value("${signerKey}")
    private String signerKey ;

    private SecretKey key;

    private UserRepository userRepository;

    public JWTGenerator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public static final long JWT_EXPIRATION = 2 * 60 * 60 * 1000;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(signerKey.getBytes());
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Optional<Users> user = userRepository.findByUsername(username);
        Long userid = user.get().getId();
        String userId = userid.toString();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRATION);

        String token = Jwts.builder()
                .claim("id",userId)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(key)
                .compact();
        return token;
    }
    public String generateRefreshToken(Authentication authentication) {
        String username = authentication.getName();
        Optional<Users> user = userRepository.findByUsername(username);
        Long userid = user.get().getId();
        String userId = userid.toString();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + JWT_EXPIRATION);

        String token = Jwts.builder()
                .claim("id",userId)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(key)
                .compact();
        return token;
    }

    public String getUsernameFromJwt(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (ExpiredJwtException ex) {
            return ex.getClaims().getSubject();
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }
}
