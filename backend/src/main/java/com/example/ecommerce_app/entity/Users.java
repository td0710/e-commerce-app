package com.example.ecommerce_app.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username")
    private String username ;

    @Column(name = "password")
    private String password ;

    @Column(name = "user_email")
    private String user_email ;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

}
