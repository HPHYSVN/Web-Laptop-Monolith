package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {
    List<CartDetail> findByCartId(Long cartId);

    @Modifying
    @Query("DELETE FROM CartDetail c WHERE c.productDetail.id = :productDetailId")
    void deleteByProductDetailId(@Param("productDetailId") Long productDetailId);
}
