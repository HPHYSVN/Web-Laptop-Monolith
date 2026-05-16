package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.models.CartDetail;
import com.laptop.laptopstore.services.CartService;
import com.laptop.laptopstore.dtos.MergeCartRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
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
    public ResponseEntity<?> mergeCart(@Valid @RequestBody MergeCartRequestDTO request) {
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
    @NotNull(message = "User ID không được để trống")
    private Long userId;

    @NotNull(message = "Product detail ID không được để trống")
    private Long productDetailId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
}
