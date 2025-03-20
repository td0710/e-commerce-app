package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.request.ShippingDetailsDto;
import com.example.ecommerce_app.service.ShippingDetailsService;
import com.example.ecommerce_app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/shippingdetails/secure")
public class ShippingDetailsController {

    ShippingDetailsService shippingDetailsService;
    UserService userService;
    public ShippingDetailsController(ShippingDetailsService shippingDetailsService, UserService userService) {
        this.shippingDetailsService = shippingDetailsService;
        this.userService = userService;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getShippingDetails(@RequestParam Long id) {

        ShippingDetailsDto shippingDetailsDto = shippingDetailsService.getShippingDetails(id);

        return ResponseEntity.ok(shippingDetailsDto);
    }

    @PutMapping("/save")
    public ResponseEntity<?> saveShippingDetails(@RequestParam Long id, @RequestBody ShippingDetailsDto shippingDetailsDto) {

        String message = shippingDetailsService.saveShippingDetails(id, shippingDetailsDto);

        return ResponseEntity.ok(message);
    }
}
