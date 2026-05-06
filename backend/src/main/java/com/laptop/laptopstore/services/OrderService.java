package com.laptop.laptopstore.services;

import com.laptop.laptopstore.dtos.OrderDTO;
import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartService cartService;
    private final CartDetailRepository cartDetailRepository;
    private final UserRepository userRepository;

    private OrderDTO convertToDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .receiverAddress(order.getReceiverAddress())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .orderDate(order.getOrderDate())
                .username(order.getUser() != null ? order.getUser().getUsername() : null)
                .build();
    }

    @Transactional
    public OrderDTO checkout(Long userId, String receiverName, String address, String phone) {
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

        return convertToDTO(order);
    }

    // ADMIN APIs
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return convertToDTO(orderRepository.save(order));
    }
}
