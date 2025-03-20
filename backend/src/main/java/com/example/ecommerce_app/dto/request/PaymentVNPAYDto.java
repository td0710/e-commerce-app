package com.example.ecommerce_app.dto.request;

import lombok.Data;

import java.time.LocalDateTime;


@Data
public class PaymentVNPAYDto {
    private Long userId;
    private Long cartItemId;
    private Long vnpAmount;
    private String vnpBankCode;
    private String vnpCardType;
    private LocalDateTime vnpPayDate;
    private String vnpResponseCode;
    private String vnpTransactionNo;
    private String vnpTransactionStatus;
    private String vnpTxnRef;
}
