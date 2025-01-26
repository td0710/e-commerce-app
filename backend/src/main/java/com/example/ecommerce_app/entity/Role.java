package com.example.ecommerce_app.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roles")
@Data
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id ;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.EAGER)
    private List<Users> users = new ArrayList<>();
}
