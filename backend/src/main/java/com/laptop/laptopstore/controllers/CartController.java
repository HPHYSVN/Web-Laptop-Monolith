package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.models.CartDetail;
import com.laptop.laptopstore.services.CartService;
import com.laptop.laptopstore.dtos.MergeCartRequestDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartDetail>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartDetails(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            CartDetail detail = cartService.addToCart(
                    request.getUserId(), 
                    request.getProductDetailId(), 
                    request.getQuantity());
            return ResponseEntity.ok(detail);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/merge")
    public ResponseEntity<?> mergeCart(@RequestBody MergeCartRequestDTO request) {
        try {
            List<CartDetail> mergedDetails = cartService.mergeCart(request);
            return ResponseEntity.ok(mergedDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

@Data
class AddToCartRequest {
    private Long userId;
    private Long productDetailId;
    private Integer quantity;
}
