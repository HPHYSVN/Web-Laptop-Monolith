package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.dtos.CartItemResponseDTO;
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
    public ResponseEntity<List<CartItemResponseDTO>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody CartItemRequest request) {
        try {
            cartService.addToCart(
                    request.getUserId(), 
                    request.getProductDetailId(), 
                    request.getQuantity());
            return ResponseEntity.ok(cartService.getCartItems(request.getUserId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{cartDetailId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long cartDetailId, @Valid @RequestBody CartQuantityRequest request) {
        try {
            cartService.updateQuantity(request.getUserId(), cartDetailId, request.getQuantity());
            return ResponseEntity.ok(cartService.getCartItems(request.getUserId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{cartDetailId}")
    public ResponseEntity<?> deleteItem(@PathVariable Long cartDetailId, @RequestParam Long userId) {
        try {
            cartService.deleteItem(userId, cartDetailId);
            return ResponseEntity.ok(cartService.getCartItems(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PostMapping("/merge")
    public ResponseEntity<?> mergeCart(@Valid @RequestBody MergeCartRequestDTO request) {
        try {
            cartService.mergeCart(request);
            return ResponseEntity.ok(cartService.getCartItems(request.getUserId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

@Data
class CartItemRequest {
    @NotNull(message = "User ID không được để trống")
    private Long userId;

    @NotNull(message = "Product detail ID không được để trống")
    private Long productDetailId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
}

@Data
class CartQuantityRequest {
    @NotNull(message = "User ID không được để trống")
    private Long userId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer quantity;
}
