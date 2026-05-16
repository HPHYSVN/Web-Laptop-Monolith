package com.laptop.laptopstore.config;

import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled || productRepository.count() >= 100 || orderRepository.count() >= 300) {
            return;
        }

        Random random = new Random(42);
        List<Category> categories = ensureCategories();
        ensureUsers();
        List<User> users = userRepository.findAll().stream()
                .filter(user -> !"ROLE_ADMIN".equals(user.getRole()))
                .toList();

        for (int i = 1; i <= 120; i++) {
            Category category = categories.get(random.nextInt(categories.size()));
            Product product = Product.builder()
                    .productName(category.getCategoryName() + " Demo " + i)
                    .productDescription("Dữ liệu demo TX2 cho báo cáo và biểu đồ.")
                    .category(category)
                    .createDate(LocalDateTime.now().minusDays(random.nextInt(180)))
                    .build();
            product = productRepository.save(product);

            ProductDetail detail = ProductDetail.builder()
                    .product(product)
                    .price(8_000_000.0 + random.nextInt(35_000_000))
                    .quantity(5 + random.nextInt(50))
                    .color(List.of("Black", "Silver", "Blue", "Gray").get(random.nextInt(4)))
                    .imageDetail("https://via.placeholder.com/300x220?text=Laptop")
                    .build();
            productDetailRepository.save(detail);
        }

        List<ProductDetail> details = productDetailRepository.findAll();
        List<String> statuses = List.of("PENDING", "PROCESSING", "DELIVERED", "CANCELLED");
        for (int i = 1; i <= 500; i++) {
            User user = users.get(random.nextInt(users.size()));
            ProductDetail detail = details.get(random.nextInt(details.size()));
            int quantity = 1 + random.nextInt(3);
            String status = statuses.get(random.nextInt(statuses.size()));
            Order order = Order.builder()
                    .user(user)
                    .orderDate(LocalDateTime.now().minusDays(random.nextInt(210)))
                    .status(status)
                    .totalPrice(detail.getPrice() * quantity)
                    .receiverName("Khách demo " + i)
                    .receiverPhone("090000" + String.format("%04d", i))
                    .receiverAddress("Địa chỉ demo TX2 " + i)
                    .build();
            order = orderRepository.save(order);

            orderDetailRepository.save(OrderDetail.builder()
                    .order(order)
                    .productDetail(detail)
                    .quantity(quantity)
                    .price(detail.getPrice())
                    .build());
        }
    }

    private List<Category> ensureCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(Category.builder().categoryName("Gaming").categoryDescription("Laptop gaming").build());
            categoryRepository.save(Category.builder().categoryName("Office").categoryDescription("Laptop văn phòng").build());
            categoryRepository.save(Category.builder().categoryName("Ultrabook").categoryDescription("Laptop mỏng nhẹ").build());
            categoryRepository.save(Category.builder().categoryName("Workstation").categoryDescription("Laptop đồ họa").build());
        }
        return categoryRepository.findAll();
    }

    private void ensureUsers() {
        for (int i = 1; i <= 80; i++) {
            String username = "demo_user_" + i;
            if (userRepository.existsByUsername(username)) continue;
            userRepository.save(User.builder()
                    .username(username)
                    .password(passwordEncoder.encode("demo123456"))
                    .email(username + "@example.com")
                    .phone("098000" + String.format("%04d", i))
                    .role("ROLE_USER")
                    .status("ACTIVE")
                    .avatar("default-avatar.png")
                    .createDate(LocalDateTime.now().minusDays(i))
                    .build());
        }
    }
}
