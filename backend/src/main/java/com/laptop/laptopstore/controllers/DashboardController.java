package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.dtos.DashboardDTO;
import com.laptop.laptopstore.repositories.OrderRepository;
import com.laptop.laptopstore.repositories.ProductRepository;
import com.laptop.laptopstore.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.count();
        
        // Tính tổng doanh thu của các đơn hàng đã giao thành công
        Double revenue = orderRepository.findAll().stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()))
                .mapToDouble(o -> o.getTotalPrice())
                .sum();

        DashboardDTO stats = DashboardDTO.builder()
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .totalRevenue(revenue != null ? revenue : 0.0)
                .build();
                
        return ResponseEntity.ok(stats);
    }
}
