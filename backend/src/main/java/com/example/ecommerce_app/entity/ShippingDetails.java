package com.example.ecommerce_app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "shipping_details")
@Data
public class ShippingDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;

    @Column(nullable = true, length = 100)
    private String country;

    @Column(nullable = true, length = 255)
    private String name;

    @Column(name = "contact_number", nullable = true, length = 20)
    private String contactNumber;

    @Column(length = 255,nullable = true)
    private String email;

    @Column(name = "home_address", nullable = true, columnDefinition = "TEXT")
    private String homeAddress;
}
