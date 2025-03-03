package com.example.ecommerce_app.service.impl;

import com.example.ecommerce_app.entity.Discount;
import com.example.ecommerce_app.exception.AppException;
import com.example.ecommerce_app.exception.ErrorCode;
import com.example.ecommerce_app.repository.DiscountRepository;
import com.example.ecommerce_app.service.DiscountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class DiscountServiceImpl implements DiscountService {

    private DiscountRepository discountRepository;
    public DiscountServiceImpl(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    public Discount getDiscount(String code,Long productId,String category) {

        Discount discount = discountRepository.findByCode(code) ;

        if(discount == null) {
            throw new AppException(ErrorCode.INVALID_CODE) ;
        }
        else if(discount!=null && discount.getProductId()==null && discount.getCategory()==null) {
            return discount ;
        }
        else if(discount.getEnd().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.EXPIRE_DISCOUNT) ;
        }
        else if((discount.getProductId()!= null && discount.getProductId().equals(productId))
                || (discount.getCategory()!= null && discount.getCategory().equals(category))) {
            return discount ;
        }
        else {
            throw new AppException(ErrorCode.NOT_APPLICABLE) ;
        }
    }
}
