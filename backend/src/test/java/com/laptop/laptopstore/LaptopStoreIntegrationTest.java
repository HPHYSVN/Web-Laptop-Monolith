package com.laptop.laptopstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laptop.laptopstore.models.*;
import com.laptop.laptopstore.repositories.*;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
        LocalDateTime mayOrderDate = LocalDateTime.of(2026, 5, 20, 10, 30);
        LocalDateTime juneFirstOrderDate = LocalDateTime.of(2026, 6, 1, 9, 0);
        LocalDateTime juneSecondOrderDate = LocalDateTime.of(2026, 6, 2, 16, 15);

        Order mayDelivered = orderRepository.save(Order.builder()
                .user(user)
                .orderDate(mayOrderDate)
                .status("DELIVERED")
                .totalPrice(10000000.0)
                .receiverName("Tester")
                .receiverPhone("0900000000")
                .receiverAddress("Ha Noi")
                .build());
        Order juneDelivered = orderRepository.save(Order.builder()
                .user(user)
                .orderDate(juneFirstOrderDate)
                .status("DELIVERED")
                .totalPrice(50000000.0)
                .receiverName("Tester")
                .receiverPhone("0900000000")
                .receiverAddress("Ha Noi")
                .build());
        orderRepository.save(Order.builder()
                .user(user)
                .orderDate(juneSecondOrderDate)
                .status("PENDING")
                .totalPrice(90000000.0)
                .receiverName("Pending Tester")
                .receiverPhone("0900000001")
                .receiverAddress("Ha Noi")
                .build());
        orderRepository.save(Order.builder()
                .user(user)
                .orderDate(juneSecondOrderDate)
                .status("CANCELLED")
                .totalPrice(70000000.0)
                .receiverName("Cancelled Tester")
                .receiverPhone("0900000002")
                .receiverAddress("Ha Noi")
                .build());
        orderDetailRepository.save(OrderDetail.builder().order(mayDelivered).productDetail(detail).quantity(1).price(detail.getPrice()).build());
        orderDetailRepository.save(OrderDetail.builder().order(juneDelivered).productDetail(detail).quantity(1).price(detail.getPrice()).build());

        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", bearer(token))
                        .param("fromDate", "2026-06-01")
                        .param("toDate", "2026-06-02"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRevenue").value(50000000.0))
                .andExpect(jsonPath("$.deliveredOrders").value(1))
                .andExpect(jsonPath("$.averageOrderValue").value(50000000.0));

        mockMvc.perform(get("/api/admin/dashboard/revenue-series")
                        .header("Authorization", bearer(token))
                        .param("fromDate", "2026-05-01")
                        .param("toDate", "2026-06-30")
                        .param("groupBy", "MONTH"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].label").value("2026-05"))
                .andExpect(jsonPath("$[0].revenue").value(10000000.0))
                .andExpect(jsonPath("$[1].label").value("2026-06"))
                .andExpect(jsonPath("$[1].revenue").value(50000000.0));

        mockMvc.perform(get("/api/admin/dashboard/order-status")
                        .header("Authorization", bearer(token))
                        .param("fromDate", "2026-06-01")
                        .param("toDate", "2026-06-02"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].label").exists());

        mockMvc.perform(get("/api/admin/dashboard/top-products")
                        .header("Authorization", bearer(token))
                        .param("fromDate", "2026-06-01")
                        .param("toDate", "2026-06-02")
                        .param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productName").value("Asus ROG Test"))
                .andExpect(jsonPath("$[0].quantity").value(1));

        mockMvc.perform(get("/api/admin/dashboard/report")
                        .header("Authorization", bearer(token))
                        .param("fromDate", "2026-06-01")
                        .param("toDate", "2026-06-02")
                        .param("groupBy", "DAY"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=revenue-report-20260601-20260602.xlsx"))
                .andExpect(content().contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .andExpect(result -> {
                    byte[] report = result.getResponse().getContentAsByteArray();
                    assertTrue(report.length > 0);
                    try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(report))) {
                        assertTrue(workbook.getSheetIndex("Sản phẩm bán chạy") >= 0);
                        Sheet summary = workbook.getSheet("Tổng quan");
                        assertNull(summary.getRow(0).getCell(6));
                    }
                });
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
