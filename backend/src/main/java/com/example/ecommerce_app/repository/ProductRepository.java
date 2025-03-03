package com.example.ecommerce_app.repository;


import com.example.ecommerce_app.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategory(String category, Pageable pageable);
    @Query("SELECT p FROM Product p WHERE p.title LIKE %:query% OR p.description LIKE %:query%")
    List<Product> searchProducts(@Param("query") String query);
}
