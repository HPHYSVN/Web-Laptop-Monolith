package com.laptop.laptopstore.services;

import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final UserRepository userRepository;
    private final ProductDetailRepository productDetailRepository;

    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Cart newCart = Cart.builder().user(user).build();
            return cartRepository.save(newCart);
        });
    }

    public List<CartDetail> getCartDetails(Long userId) {
        Cart cart = getCartByUserId(userId);
        return cartDetailRepository.findByCartId(cart.getId());
    }

    public CartDetail addToCart(Long userId, Long productDetailId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        ProductDetail productDetail = productDetailRepository.findById(productDetailId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item already exists in cart
        List<CartDetail> existingDetails = cartDetailRepository.findByCartId(cart.getId());
        for (CartDetail detail : existingDetails) {
            if (detail.getProductDetail().getId().equals(productDetailId)) {
                detail.setQuantity(detail.getQuantity() + quantity);
                return cartDetailRepository.save(detail);
            }
        }

        // Add new item
        CartDetail newDetail = CartDetail.builder()
                .cart(cart)
                .productDetail(productDetail)
                .quantity(quantity)
                .price(productDetail.getPrice())
                .color(productDetail.getColor())
                .build();
        
        return cartDetailRepository.save(newDetail);
    }
}
