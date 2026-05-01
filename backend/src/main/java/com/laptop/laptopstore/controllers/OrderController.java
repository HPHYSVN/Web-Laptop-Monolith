package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.models.Order;
import com.laptop.laptopstore.services.OrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        try {
            Order order = orderService.checkout(
                    request.getUserId(),
                    request.getReceiverName(),
                    request.getAddress(),
                    request.getPhone()
            );
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

@Data
class CheckoutRequest {
    private Long userId;
    private String receiverName;
    private String address;
    private String phone;
}
