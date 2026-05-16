package com.laptop.laptopstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Map;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LaptopStoreIntegrationTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private ProductDetailRepository productDetailRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartDetailRepository cartDetailRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderDetailRepository orderDetailRepository;

    private User admin;
    private User user;
    private Category category;
    private Product product;
    private ProductDetail detail;

    @BeforeEach
    void setUp() {
        orderDetailRepository.deleteAll();
        orderRepository.deleteAll();
        cartDetailRepository.deleteAll();
        cartRepository.deleteAll();
        productDetailRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        admin = userRepository.save(User.builder()
                .username("admin")
                .password(passwordEncoder.encode("password123"))
                .email("admin@test.com")
                .role("ROLE_ADMIN")
                .status("ACTIVE")
                .createDate(LocalDateTime.now())
                .build());
        user = userRepository.save(User.builder()
                .username("user1")
                .password(passwordEncoder.encode("password123"))
                .email("user1@test.com")
                .role("ROLE_USER")
                .status("ACTIVE")
                .createDate(LocalDateTime.now())
                .build());
        category = categoryRepository.save(Category.builder().categoryName("Gaming").categoryDescription("Gaming laptops").build());
        product = productRepository.save(Product.builder()
                .productName("Asus ROG Test")
                .productDescription("Gaming laptop")
                .category(category)
                .createDate(LocalDateTime.now())
                .build());
        detail = productDetailRepository.save(ProductDetail.builder()
                .product(product)
                .price(25000000.0)
                .quantity(10)
                .color("Black")
                .imageDetail("rog.jpg")
                .build());
    }

    @Test
    void loginSuccessAndFailure() throws Exception {
        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("username", "admin", "password", "password123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("username", "admin", "password", "wrong"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void adminCreateProductAndValidationError() throws Exception {
        String token = login("admin", "password123");
        String validBody = """
                {"productName":"Dell XPS Test","productDescription":"Office laptop","categoryId":%d,
                 "details":[{"price":32000000,"quantity":5,"color":"Silver","imageDetail":"xps.jpg"}]}
                """.formatted(category.getId());

        mockMvc.perform(post("/api/products")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName").value("Dell XPS Test"));

        mockMvc.perform(post("/api/products")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productName\":\"\",\"details\":[{\"price\":0,\"quantity\":-1}]}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    void productPaginationSearchAndFilterReturnsMetadata() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "5")
                        .param("keyword", "rog")
                        .param("minPrice", "10000000")
                        .param("maxPrice", "30000000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].productName").value("Asus ROG Test"))
                .andExpect(jsonPath("$.totalElements").value(greaterThanOrEqualTo(1)));
    }

    @Test
    void checkoutCreatesOrderAndClearsCart() throws Exception {
        String token = login("user1", "password123");
        Cart cart = cartRepository.save(Cart.builder().user(user).build());
        cartDetailRepository.save(CartDetail.builder()
                .cart(cart)
                .productDetail(detail)
                .quantity(2)
                .price(detail.getPrice())
                .color(detail.getColor())
                .build());

        mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("userId", user.getId(), "receiverName", "Tester", "phone", "0900000000", "address", "Ha Noi"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));

        mockMvc.perform(get("/api/carts/" + user.getId()).header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void mergeCartAddsQuantityWhenItemExists() throws Exception {
        String token = login("user1", "password123");
        mockMvc.perform(post("/api/carts/add")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("userId", user.getId(), "productDetailId", detail.getId(), "quantity", 1))))
                .andExpect(status().isOk());

        String mergeBody = """
                {"userId":%d,"items":[{"productDetailId":%d,"quantity":3}]}
                """.formatted(user.getId(), detail.getId());
        mockMvc.perform(post("/api/carts/merge")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mergeBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantity").value(4));
    }

    @Test
    void bulkDeleteProductsAndUsersEnforcesAdminRule() throws Exception {
        String token = login("admin", "password123");
        mockMvc.perform(delete("/api/products/bulk")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("ids", new Long[]{product.getId()}))))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/users/bulk")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("ids", new Long[]{admin.getId()}))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void dashboardAggregationReturnsRevenueAndStatus() throws Exception {
        String token = login("admin", "password123");
        Order delivered = orderRepository.save(Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status("DELIVERED")
                .totalPrice(50000000.0)
                .receiverName("Tester")
                .receiverPhone("0900000000")
                .receiverAddress("Ha Noi")
                .build());
        orderDetailRepository.save(OrderDetail.builder().order(delivered).productDetail(detail).quantity(1).price(detail.getPrice()).build());

        mockMvc.perform(get("/api/admin/dashboard/revenue-monthly").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].revenue").value(50000000.0));

        mockMvc.perform(get("/api/admin/dashboard/order-status").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].label").exists());
    }

    private String login(String username, String password) throws Exception {
        String response = mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("username", username, "password", password))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode json = objectMapper.readTree(response);
        return json.get("token").asText();
    }

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}
