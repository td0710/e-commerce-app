package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.dto.response.OrderPageResponse;
import com.example.ecommerce_app.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/orders/secure")
public class OrderController {

    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/getall")
    public ResponseEntity<OrderPageResponse> getAllOrders(@RequestParam Long userId,
                                                          @RequestParam int page,
                                                          @RequestParam int size) {
        return ResponseEntity.ok(orderService.getAllOrders(userId,page,size));
    }
    @GetMapping("/total/{userId}")
    public ResponseEntity<Long> getTotalOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.totalOrders(userId));
    }
}
