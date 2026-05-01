package com.laptop.laptopstore.services;

import com.laptop.laptopstore.models.User;
import com.laptop.laptopstore.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        
        user.setCreateDate(LocalDateTime.now());
        user.setRole("USER");
        if (user.getAvatar() == null) {
            user.setAvatar("default-avatar.png");
        }
        // TODO: Cần mã hóa mật khẩu bằng BCrypt
        return userRepository.save(user);
    }

    public User login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Tạm thời so sánh plain text. Sẽ update BCrypt sau.
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
    }
}
