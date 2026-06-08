package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderId(Long orderId);

    @Modifying
    @Query("DELETE FROM OrderDetail o WHERE o.productDetail.id = :productDetailId")
    void deleteByProductDetailId(@Param("productDetailId") Long productDetailId);

    @Modifying
    @Query("DELETE FROM OrderDetail o WHERE o.order.id = :orderId")
    void deleteByOrderId(@Param("orderId") Long orderId);

    @Query("""
            select od from OrderDetail od
            join fetch od.order o
            join fetch od.productDetail pd
            join fetch pd.product p
            where o.status = :status
              and o.orderDate between :from and :to
            """)
    List<OrderDetail> findSoldProductDetailsForReport(
            @Param("status") String status,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
