package com.laptop.laptopstore.services;

import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartService cartService;
    private final CartDetailRepository cartDetailRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order checkout(Long userId, String receiverName, String address, String phone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<CartDetail> cartItems = cartService.getCartDetails(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống");
        }

        double total = cartItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        // Create Order
        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status("PENDING")
                .totalPrice(total)
                .receiverName(receiverName)
                .receiverAddress(address)
                .receiverPhone(phone)
                .build();
        order = orderRepository.save(order);

        // Create Order Details
        for (CartDetail item : cartItems) {
            OrderDetail detail = OrderDetail.builder()
                    .order(order)
                    .productDetail(item.getProductDetail())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .build();
            orderDetailRepository.save(detail);
        }

        // Clear Cart
        cartDetailRepository.deleteAll(cartItems);

        return order;
    }
}
