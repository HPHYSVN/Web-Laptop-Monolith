package com.laptop.laptopstore.services;

import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import com.laptop.laptopstore.dtos.CartItemResponseDTO;
import com.laptop.laptopstore.dtos.MergeCartRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional(readOnly = true)
    public List<CartItemResponseDTO> getCartItems(Long userId) {
        return getCartDetails(userId).stream().map(this::convertToDTO).toList();
    }

    private CartItemResponseDTO convertToDTO(CartDetail detail) {
        ProductDetail productDetail = detail.getProductDetail();
        Product product = productDetail.getProduct();
        return CartItemResponseDTO.builder()
                .id(detail.getId())
                .productDetailId(productDetail.getId())
                .productName(product != null ? product.getProductName() : "")
                .quantity(detail.getQuantity())
                .price(detail.getPrice())
                .color(detail.getColor())
                .image(productDetail.getImageDetail())
                .build();
    }

    @Transactional
    public CartDetail addToCart(Long userId, Long productDetailId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        ProductDetail productDetail = productDetailRepository.findById(productDetailId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (quantity <= 0) {
            throw new RuntimeException("Số lượng phải lớn hơn 0");
        }
        if (productDetail.getQuantity() != null && productDetail.getQuantity() < quantity) {
            throw new RuntimeException("Sản phẩm không đủ hàng");
        }

        // Check if item already exists in cart
        List<CartDetail> existingDetails = cartDetailRepository.findByCartId(cart.getId());
        for (CartDetail detail : existingDetails) {
            if (detail.getProductDetail().getId().equals(productDetailId)) {
                int newQuantity = detail.getQuantity() + quantity;
                if (productDetail.getQuantity() != null && productDetail.getQuantity() < newQuantity) {
                    throw new RuntimeException("Sản phẩm không đủ hàng");
                }
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

    @Transactional
    public CartDetail updateQuantity(Long userId, Long cartDetailId, Integer quantity) {
        if (quantity <= 0) {
            deleteItem(userId, cartDetailId);
            return null;
        }

        Cart cart = getCartByUserId(userId);
        CartDetail detail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!detail.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item not found");
        }
        ProductDetail productDetail = detail.getProductDetail();
        if (productDetail.getQuantity() != null && productDetail.getQuantity() < quantity) {
            throw new RuntimeException("Sản phẩm không đủ hàng");
        }
        detail.setQuantity(quantity);
        return cartDetailRepository.save(detail);
    }

    @Transactional
    public void deleteItem(Long userId, Long cartDetailId) {
        Cart cart = getCartByUserId(userId);
        CartDetail detail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!detail.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item not found");
        }
        cartDetailRepository.delete(detail);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cartDetailRepository.deleteAll(cartDetailRepository.findByCartId(cart.getId()));
    }

    @Transactional
    public List<CartDetail> mergeCart(MergeCartRequestDTO request) {
        Long userId = request.getUserId();
        if (request.getItems() != null) {
            for (MergeCartRequestDTO.CartItemDTO item : request.getItems()) {
                try {
                    addToCart(userId, item.getProductDetailId(), item.getQuantity());
                } catch (Exception e) {
                    System.err.println("Failed to merge cart item: " + item.getProductDetailId() + " - " + e.getMessage());
                }
            }
        }
        return getCartDetails(userId);
    }
}
