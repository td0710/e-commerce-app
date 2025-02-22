package com.example.ecommerce_app.controller;

import com.example.ecommerce_app.dto.ShippingDetailsDto;
import com.example.ecommerce_app.dto.response.OrderPageResponse;
import com.example.ecommerce_app.dto.response.OrderResponse;
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
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {

        Order order = orderService.getOrderById(orderId);

        OrderResponse orderResponse = new OrderResponse();

        orderResponse.setOrderId(order.getId());
        orderResponse.setTotalPrice(order.getTotalPrice());
        orderResponse.setQuantity(order.getQuantity());
        orderResponse.setShippingName(order.getShippingName());
        orderResponse.setShippingAddress(order.getShippingAddress());
        orderResponse.setShippingCountry(order.getShippingCountry());
        orderResponse.setShippingEmail(order.getShippingEmail());
        orderResponse.setStatus(order.getOrderStatus());
        orderResponse.setContactNumber(order.getShippingContact());

        orderResponse.setProductName(order.getProduct().getTitle());
        orderResponse.setProductCategory(order.getProduct().getCategory());
        orderResponse.setProductImg(order.getProduct().getImage());

        orderResponse.setSize(order.getVariant().getSize());
        orderResponse.setColor(order.getVariant().getColor());

        return ResponseEntity.ok(orderResponse) ;

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
