package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.dto.ShippingDetailsDto;
import com.example.ecommerce_app.dto.response.OrderPageResponse;
import com.example.ecommerce_app.entity.Order;
import com.example.ecommerce_app.entity.ShippingDetails;
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
    public ResponseEntity<ShippingDetailsDto> getOrder(@PathVariable Long orderId) {

        Order order = orderService.getOrderById(orderId);

        ShippingDetailsDto shippingDetailsDto = new ShippingDetailsDto(
                order.getId(),
                order.getUser().getId(),
                order.getShippingCountry(),
                order.getShippingName(),
                order.getShippingContact(),
                order.getShippingEmail(),
                order.getShippingAddress()
        );

        return ResponseEntity.ok(shippingDetailsDto) ;

    }
    @PutMapping("/edit/{orderId}")
    public ResponseEntity<?> setShippingDetails(@PathVariable Long orderId,
                                                @RequestBody ShippingDetailsDto shippingDetailsDto) {

        Order order = orderService.getOrderById(orderId);

        order.setShippingAddress(shippingDetailsDto.getHomeAddress());
        order.setShippingEmail(shippingDetailsDto.getEmail());
        order.setShippingContact(shippingDetailsDto.getContactNumber());
        order.setShippingName(shippingDetailsDto.getName());
        order.setShippingEmail(shippingDetailsDto.getEmail());
        order.setShippingCountry(shippingDetailsDto.getCountry());

        orderService.save(order);

        return ResponseEntity.ok("success");
    }
}
