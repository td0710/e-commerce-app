package com.example.ecommerce_app.controller;


import com.example.ecommerce_app.dto.ShippingDetailsDto;
import com.example.ecommerce_app.entity.ShippingDetails;
import com.example.ecommerce_app.entity.Users;
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
    public ResponseEntity<ShippingDetailsDto> getShippingDetails(@RequestParam Long id) {

        ShippingDetails shippingDetails = shippingDetailsService.findByUserId(id) ;
        if(shippingDetails == null){
            Users user = userService.findById(id) ;
            shippingDetails = new ShippingDetails() ;
            shippingDetails.setUser(user);
            shippingDetailsService.save(shippingDetails) ;
        }

        ShippingDetailsDto shippingDetailsDto = new ShippingDetailsDto(
                shippingDetails.getId(),
                shippingDetails.getUser().getId(),
                shippingDetails.getCountry(),
                shippingDetails.getName(),
                shippingDetails.getContactNumber(),
                shippingDetails.getEmail(),
                shippingDetails.getHomeAddress()
        );

        return ResponseEntity.ok(shippingDetailsDto) ;
    }

    @PutMapping("/save")
    public ResponseEntity<?> saveShippingDetails(@RequestParam Long id, @RequestBody ShippingDetailsDto shippingDetailsDto) {
        ShippingDetails shippingDetails = shippingDetailsService.findByUserId(id);

        if(shippingDetails == null){
            Users user = userService.findById(id) ;
            shippingDetails = new ShippingDetails() ;
            shippingDetails.setUser(user);
            shippingDetailsService.save(shippingDetails) ;
        }

        shippingDetails.setCountry(shippingDetailsDto.getCountry());
        shippingDetails.setName(shippingDetailsDto.getName());
        shippingDetails.setContactNumber(shippingDetailsDto.getContactNumber());
        shippingDetails.setEmail(shippingDetailsDto.getEmail());
        shippingDetails.setHomeAddress(shippingDetailsDto.getHomeAddress());

        shippingDetailsService.save(shippingDetails);

        ShippingDetailsDto responseDto = new ShippingDetailsDto(
                shippingDetails.getId(),
                shippingDetails.getUser().getId(),
                shippingDetails.getCountry(),
                shippingDetails.getName(),
                shippingDetails.getContactNumber(),
                shippingDetails.getEmail(),
                shippingDetails.getHomeAddress()
        );

        return ResponseEntity.ok(responseDto);
    }
}
