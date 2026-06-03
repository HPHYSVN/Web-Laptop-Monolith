package com.laptop.laptopstore.repositories;

import com.laptop.laptopstore.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    List<Order> findByUserId(Long userId);
    List<Order> findByOrderDateBetween(LocalDateTime from, LocalDateTime to);
    List<Order> findByStatusAndOrderDateBetweenOrderByOrderDateAsc(String status, LocalDateTime from, LocalDateTime to);
    @Query("select o from Order o left join fetch o.user where o.status = :status and o.orderDate between :from and :to order by o.orderDate asc")
    List<Order> findDeliveredOrdersForReport(@Param("status") String status, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
    long countByOrderDateBetween(LocalDateTime from, LocalDateTime to);
    long countByStatusAndOrderDateBetween(String status, LocalDateTime from, LocalDateTime to);
}
