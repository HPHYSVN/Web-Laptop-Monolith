package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderId(Long orderId);

    @Modifying
    @Query("DELETE FROM OrderDetail o WHERE o.productDetail.id = :productDetailId")
    void deleteByProductDetailId(@Param("productDetailId") Long productDetailId);
}
