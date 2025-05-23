package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.dto.request.ShippingDetailsDto;
import com.example.ecommerce_app.entity.ShippingDetails;
import com.example.ecommerce_app.entity.Users;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.repository.ShippingDetailsRepository;
import com.example.ecommerce_app.repository.UserRepository;
import com.example.ecommerce_app.service.ShippingDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class ShippingDetailsServiceImpl implements ShippingDetailsService {

    private final UserRepository userRepository;
    ShippingDetailsRepository shippingDetailsRepository;

    public ShippingDetailsServiceImpl(ShippingDetailsRepository shippingDetailsRepository, UserRepository userRepository) {
        this.shippingDetailsRepository = shippingDetailsRepository;
        this.userRepository = userRepository;
    }



    public ShippingDetailsDto getShippingDetails(Long id) {


        ShippingDetails shippingDetails = shippingDetailsRepository.findByUserId(id) ;

        if(shippingDetails == null){
            Users user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)) ;
            shippingDetails = new ShippingDetails() ;
            shippingDetails.setUser(user);
            shippingDetailsRepository.save(shippingDetails) ;
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

        return shippingDetailsDto ;
    }

    public String saveShippingDetails(Long id,ShippingDetailsDto shippingDetailsDto) {


        ShippingDetails shippingDetails = shippingDetailsRepository.findByUserId(id);

        if(shippingDetails == null){
            Users user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)) ;
            shippingDetails = new ShippingDetails() ;
            shippingDetails.setUser(user);
            shippingDetailsRepository.save(shippingDetails) ;
        }

        shippingDetails.setCountry(shippingDetailsDto.getCountry());
        shippingDetails.setName(shippingDetailsDto.getName());
        shippingDetails.setContactNumber(shippingDetailsDto.getContactNumber());
        shippingDetails.setEmail(shippingDetailsDto.getEmail());
        shippingDetails.setHomeAddress(shippingDetailsDto.getHomeAddress());

        shippingDetailsRepository.save(shippingDetails);


        return "Shipping details saved successfully";
    }

}
