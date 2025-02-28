package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserId(Long userId, Pageable pageable) ;
    Long countByUserId(Long userId);
    @Query("SELECT x FROM Order x")
    Page<Order> getAlLOrders(Pageable pageable);

}
