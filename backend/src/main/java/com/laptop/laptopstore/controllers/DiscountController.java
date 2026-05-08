package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.dtos.DiscountDTO;
import com.laptop.laptopstore.services.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DiscountController {
    private final DiscountService discountService;

    @GetMapping
    public ResponseEntity<?> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDiscountById(@PathVariable Long id) {
        return ResponseEntity.ok(discountService.getDiscountById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createDiscount(@RequestBody DiscountDTO request) {
        return ResponseEntity.ok(discountService.createDiscount(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDiscount(@PathVariable Long id, @RequestBody DiscountDTO request) {
        try {
            return ResponseEntity.ok(discountService.updateDiscount(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.ok("Xóa khuyến mãi thành công!");
    }
}
