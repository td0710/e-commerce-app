package com.example.ecommerce_app.repository;

import com.example.ecommerce_app.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    @Query("SELECT pv FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.size = :size AND pv.color = :color")
    ProductVariant findByProduct_IdSizeAndColor(Long productId,String size, String color);
    List<ProductVariant> findByProduct_Id(Long productId);
    @Modifying
    @Query("DELETE FROM ProductVariant pv WHERE pv.id = :id")
    void deleteById(@Param("id") Long id);
}
