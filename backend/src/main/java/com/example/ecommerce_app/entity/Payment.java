package com.example.ecommerce_app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "transaction_no", unique = true, nullable = false, length = 50)
    private String transactionNo;

    @Column(name = "txn_ref", unique = true, nullable = false, length = 50)
    private String txnRef;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private Long amount;

    @Column(name = "bank_code", length = 20)
    private String bankCode;

    @Column(name = "card_type", length = 20)
    private String cardType;

    @Column(name = "pay_date")
    private LocalDateTime payDate;

    @Column(name = "response_code", length = 10)
    private String responseCode;

    @Column(name = "transaction_status", length = 10)
    private String transactionStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}
