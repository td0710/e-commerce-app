package com.example.ecommerce_app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @Column(name = "total_price", nullable = false)
    private Long totalPrice;


    @Column(name = "order_status", nullable = false)
    private String orderStatus ;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus ;

    @Column(name = "shipping_name")
    private String shippingName;

    @Column(name = "shipping_contact")
    private String shippingContact;

    @Column(name = "shipping_email")
    private String shippingEmail;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "shipping_country")
    private String shippingCountry;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}
