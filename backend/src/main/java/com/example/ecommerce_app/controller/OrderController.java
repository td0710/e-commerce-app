package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.dto.request.ShippingDetailsDto;
import com.example.ecommerce_app.dto.response.OrderPageResponse;
import com.example.ecommerce_app.dto.response.OrderResponse;
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

    @GetMapping("/get/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable Long orderId) {

        OrderResponse orderResponse = orderService.getOrder(orderId);

        return ResponseEntity.ok(orderResponse);
    }

    @PutMapping("/edit/{orderId}")
    public ResponseEntity<?> setShippingDetails(@PathVariable Long orderId,
                                                @RequestBody ShippingDetailsDto shippingDetailsDto) {

        String message = orderService.setShippingDetails(orderId, shippingDetailsDto);

        return ResponseEntity.ok(message);
    }

    @GetMapping("/admin/getall")
    public ResponseEntity<OrderPageResponse> getAllOrdersAdmin(@RequestParam int page,
                                                               @RequestParam int size) {

        OrderPageResponse orderPageResponse = orderService.getAllOrders(page , size);

        return ResponseEntity.ok(orderPageResponse);
    }

    @PutMapping("/admin/update/status/{orderId}")
    public ResponseEntity<?> updateStatus (@PathVariable Long orderId,@RequestParam String status) {

        String message = orderService.updateStatus(orderId, status);

        return ResponseEntity.ok(message) ;
    }
}
