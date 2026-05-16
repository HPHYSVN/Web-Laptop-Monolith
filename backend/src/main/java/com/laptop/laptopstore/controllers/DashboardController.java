package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.dtos.DashboardDTO;
import com.laptop.laptopstore.dtos.LabelValueDTO;
import com.laptop.laptopstore.dtos.MonthlyRevenueDTO;
import com.laptop.laptopstore.models.Order;
import com.laptop.laptopstore.repositories.OrderRepository;
import com.laptop.laptopstore.repositories.ProductRepository;
import com.laptop.laptopstore.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue-monthly")
    public ResponseEntity<List<MonthlyRevenueDTO>> getMonthlyRevenue() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, Double> revenueByMonth = orderRepository.findAll().stream()
                .filter(order -> "DELIVERED".equals(order.getStatus()))
                .filter(order -> order.getOrderDate() != null)
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().format(formatter),
                        TreeMap::new,
                        Collectors.summingDouble(Order::getTotalPrice)
                ));

        return ResponseEntity.ok(revenueByMonth.entrySet().stream()
                .map(entry -> new MonthlyRevenueDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/order-status")
    public ResponseEntity<List<LabelValueDTO>> getOrderStatusStats() {
        Map<String, Long> countByStatus = orderRepository.findAll().stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));

        return ResponseEntity.ok(countByStatus.entrySet().stream()
                .map(entry -> new LabelValueDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(LabelValueDTO::getLabel))
                .collect(Collectors.toList()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/category-share")
    public ResponseEntity<List<LabelValueDTO>> getCategoryShare() {
        Map<String, Long> countByCategory = productRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        product -> product.getCategory() != null ? product.getCategory().getCategoryName() : "Uncategorized",
                        Collectors.counting()
                ));

        return ResponseEntity.ok(countByCategory.entrySet().stream()
                .map(entry -> new LabelValueDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(LabelValueDTO::getValue).reversed())
                .collect(Collectors.toList()));
    }
}
