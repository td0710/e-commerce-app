package com.example.ecommerce_app.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.HttpClientErrorException;

@Getter
public enum ErrorCode {
    ORDER_NOT_FOUND(1001, "Order not found", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    INVALID_SHIPPING_DETAILS(1003, "Invalid shipping details", HttpStatus.BAD_REQUEST),
    CART_NOT_FOUND(1004, "Cart not found", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND(1005, "Product not found", HttpStatus.NOT_FOUND),
    PRODUCT_OUT_OF_STOCK(1006, "Product out of stock", HttpStatus.CONFLICT),
    PRODUCT_VARIANT_NOT_FOUND(1007, "Product variant not found", HttpStatus.NOT_FOUND),
    SHIPPING_DETAILS_NOT_FOUND(1008, "Shipping details not found", HttpStatus.NOT_FOUND),
    UNAUTHORIZED(1009, "Invalid username or password!", HttpStatus.UNAUTHORIZED),
    EXISTED_USER(10010, "User already exists", HttpStatus.CONFLICT),
    EXPIRE_DISCOUNT(10011, "Expired discount", HttpStatus.CONFLICT),
    INVALID_CODE(10012, "Invalid code", HttpStatus.NOT_FOUND),
    NOT_APPLICABLE(10013, "Discount code is not applicable to this product", HttpStatus.BAD_REQUEST),
    EXISTED_USER_EMAIL(10014, "User email already exists", HttpStatus.CONFLICT),
    ROOM_NOT_FOUND(10015, "Room not found", HttpStatus.NOT_FOUND),
    EXPIRED_REFRESH_TOKEN(10016, "Refresh token has expired", HttpStatus.UNAUTHORIZED),
    ;


    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

}
