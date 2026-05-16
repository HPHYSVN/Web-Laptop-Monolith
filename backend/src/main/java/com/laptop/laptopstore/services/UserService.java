package com.laptop.laptopstore.services;

import com.laptop.laptopstore.models.User;
import com.laptop.laptopstore.models.Cart;
import com.laptop.laptopstore.models.Order;
import com.laptop.laptopstore.repositories.CartDetailRepository;
import com.laptop.laptopstore.repositories.CartRepository;
import com.laptop.laptopstore.repositories.OrderDetailRepository;
import com.laptop.laptopstore.repositories.OrderRepository;
import com.laptop.laptopstore.repositories.UserRepository;
import com.laptop.laptopstore.repositories.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.laptop.laptopstore.dtos.PageResponseDTO;
import com.laptop.laptopstore.dtos.UserDTO;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        
        user.setCreateDate(LocalDateTime.now());
        // Bảo mật: Luôn gán quyền USER khi đăng ký công khai
        user.setRole("ROLE_USER");
        
        if (user.getAvatar() == null) {
            user.setAvatar("default-avatar.png");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public PageResponseDTO<UserDTO> getUsersPage(int page, int size, String keyword, String status, String role) {
        Page<UserDTO> userPage = userRepository
                .findAll(UserSpecification.filter(keyword, status, role), PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createDate")))
                .map(this::convertToDTO);

        return PageResponseDTO.<UserDTO>builder()
                .content(userPage.getContent())
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .first(userPage.isFirst())
                .last(userPage.isLast())
                .build();
    }

    public UserDTO updateUserStatus(Long id, String status) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
        return convertToDTO(user);
    }

    @Transactional
    public void deleteUsers(List<Long> ids) {
        for (Long id : ids) {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) continue;
            if ("ROLE_ADMIN".equals(user.getRole()) || "ADMIN".equals(user.getRole())) {
                throw new RuntimeException("Không được xóa tài khoản ADMIN");
            }

            cartRepository.findByUserId(id).ifPresent(cart -> {
                cartDetailRepository.deleteAll(cartDetailRepository.findByCartId(cart.getId()));
                cartRepository.delete(cart);
            });

            List<Order> orders = orderRepository.findByUserId(id);
            for (Order order : orders) {
                orderDetailRepository.deleteByOrderId(order.getId());
                orderRepository.delete(order);
            }

            userRepository.delete(user);
        }
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .createDate(user.getCreateDate())
                .avatar(user.getAvatar())
                .build();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
