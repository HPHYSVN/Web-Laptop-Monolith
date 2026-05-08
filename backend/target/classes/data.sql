-- Xóa dữ liệu cũ để tránh trùng lặp (Tùy chọn, nếu bạn muốn làm sạch DB)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE users; TRUNCATE TABLE categories; ...
-- SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS (Admin: admin/password123, User: user1/password123 - Mã hóa bcrypt)
INSERT IGNORE INTO users (id, username, password, email, phone, role, create_date, avatar) VALUES 
(1, 'admin', '$2a$10$c4jX23ezti1XsINrvQ9Ubul.dNi91FKVon2RCeD6SlzLnpmsh86vS', 'admin@laptopstore.com', '0123456789', 'ROLE_ADMIN', NOW(), 'admin-avatar.png'),
(2, 'khachhang1', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'khachhang1@gmail.com', '0987654321', 'ROLE_USER', NOW(), 'user1.png'),
(3, 'khachhang2', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'khachhang2@gmail.com', '0912345678', 'ROLE_USER', NOW(), 'user2.png');

-- 2. CATEGORIES
INSERT IGNORE INTO categories (id, category_name, category_description) VALUES 
(1, 'Laptop Gaming', 'Cấu hình mạnh, tản nhiệt tốt, màn hình tần số quét cao'),
(2, 'Laptop Văn phòng', 'Mỏng nhẹ, sang trọng, pin lâu'),
(3, 'MacBook', 'Hệ sinh thái Apple, màn hình Retina, hiệu năng ổn định'),
(4, 'Laptop Đồ họa', 'Màn hình chuẩn màu, CPU/GPU chuyên dụng');

-- 3. SPEC COMPONENTS
-- CPU
INSERT IGNORE INTO cpu_infor (id, brands, speed, model, cores, threads, base_clock, boost_clock, cache) VALUES 
(1, 'Intel', '2.3 GHz', 'Core i7-12700H', 14, 20, '2.3 GHz', '4.7 GHz', '24MB'),
(2, 'Apple', 'Max', 'M3 Pro', 11, 11, 'Max', 'Max', '18MB'),
(3, 'AMD', '3.3 GHz', 'Ryzen 7 6800H', 8, 16, '3.2 GHz', '4.7 GHz', '16MB'),
(4, 'Intel', '2.1 GHz', 'Core i5-1335U', 10, 12, '2.1 GHz', '4.6 GHz', '12MB'),
(5, 'Apple', 'Base', 'M2', 8, 8, 'Base', 'Base', '8MB');

-- RAM
INSERT IGNORE INTO ram_infor (id, size, type, bus, slots) VALUES 
(1, '16GB', 'DDR5', '4800MHz', 2),
(2, '18GB', 'Unified', 'N/A', 0),
(3, '8GB', 'DDR4', '3200MHz', 2),
(4, '32GB', 'LPDDR5', '6400MHz', 0);

-- STORAGE
INSERT IGNORE INTO storage_infor (id, type, capacity, interface_name) VALUES 
(1, 'SSD', '512GB', 'NVMe Gen 4'),
(2, 'SSD', '1TB', 'NVMe Gen 4'),
(3, 'SSD', '256GB', 'NVMe Gen 3');

-- GPU
INSERT IGNORE INTO gpu_infor (id, brand, model, v_ram) VALUES 
(1, 'NVIDIA', 'RTX 3060', '6GB'),
(2, 'Apple', 'M3 Pro GPU', 'Shared'),
(3, 'AMD', 'Radeon Graphics', 'Shared'),
(4, 'NVIDIA', 'RTX 4050', '6GB'),
(5, 'Intel', 'Iris Xe Graphics', 'Shared');

-- SCREEN
INSERT IGNORE INTO screen_infor (id, size, resolution, panel, refresh_rate, brightness) VALUES 
(1, '15.6"', 'FHD', 'IPS', '144Hz', '250 nits'),
(2, '14.2"', '3K', 'Mini-LED', '120Hz', '1000 nits'),
(3, '14.0"', 'FHD', 'OLED', '60Hz', '400 nits'),
(4, '13.3"', 'Retina', 'IPS', '60Hz', '500 nits');

-- 4. PRODUCTS SPECS (Phối hợp linh kiện)
INSERT IGNORE INTO products_specs (id, cpu_id, ram_id, storage_id, gpu_id, screen_id, battery, weight, os) VALUES 
(1, 1, 1, 1, 1, 1, '90Wh', '2.3kg', 'Windows 11'),
(2, 2, 2, 2, 2, 2, '70Wh', '1.6kg', 'macOS'),
(3, 4, 3, 1, 5, 3, '54Wh', '1.4kg', 'Windows 11'),
(4, 5, 3, 3, 2, 4, '52.6Wh', '1.24kg', 'macOS'),
(5, 3, 1, 2, 4, 1, '80Wh', '2.1kg', 'Windows 11');

-- 5. PRODUCTS
INSERT IGNORE INTO products (id, product_name, product_description, create_date, category_id) VALUES 
(1, 'Asus ROG Strix G15', 'Laptop gaming hiệu năng cao cho game thủ chuyên nghiệp.', NOW(), 1),
(2, 'MacBook Pro 14 M3 Pro', 'Sự lựa chọn hoàn hảo cho dân sáng tạo và lập trình.', NOW(), 3),
(3, 'Dell Vostro 5410', 'Laptop văn phòng bền bỉ, mỏng nhẹ và bảo mật.', NOW(), 2),
(4, 'MacBook Air M2', 'Thiết kế siêu mỏng, hiệu năng vượt trội với chip M2.', NOW(), 3),
(5, 'Acer Nitro 5 Tiger', 'Vua laptop gaming phân khúc tầm trung.', NOW(), 1);

-- 6. PRODUCT DETAILS (Biến thể giá/màu)
INSERT IGNORE INTO product_details (id, product_id, products_specs_id, quantity, price, image_detail, color) VALUES 
(1, 1, 1, 50, 26990000, 'asus_rog.jpg', 'Eclipse Gray'),
(2, 2, 2, 20, 52990000, 'mac_pro.jpg', 'Space Black'),
(3, 3, 3, 30, 16490000, 'dell_vostro.jpg', 'Titan Grey'),
(4, 4, 4, 45, 25990000, 'mac_air.jpg', 'Starlight'),
(5, 5, 5, 25, 21990000, 'acer_nitro.jpg', 'Obsidian Black');

-- 7. ORDERS (Dữ liệu cho Dashboard)
INSERT IGNORE INTO orders (id, user_id, order_date, status, total_price, receiver_name, receiver_address, receiver_phone) VALUES 
(1, 2, '2026-05-01 10:00:00', 'DELIVERED', 26990000, 'Khách hàng 1', 'Hà Nội', '0987654321'),
(2, 3, '2026-05-02 14:30:00', 'DELIVERED', 52990000, 'Khách hàng 2', 'TP.HCM', '0912345678'),
(3, 2, '2026-05-05 09:15:00', 'PENDING', 16490000, 'Khách hàng 1', 'Hà Nội', '0987654321'),
(4, 3, '2026-05-06 16:00:00', 'CANCELLED', 21990000, 'Khách hàng 2', 'Đà Nẵng', '0912345678');

-- 8. DISCOUNTS
INSERT IGNORE INTO discounts (id, code, discount_percent, max_percent, start_date, end_date, description, quantity) VALUES 
(1, 'SUMMER2024', 10.0, 20.0, '2024-06-01 00:00:00', '2024-08-31 23:59:59', 'Khuyến mãi mùa hè giảm 10%', 100),
(2, 'NEWUSER', 15.0, 15.0, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'Khuyến mãi người dùng mới giảm 15%', 50),
(3, 'FLASHSALE', 20.0, 25.0, '2024-05-01 00:00:00', '2024-05-31 23:59:59', 'Flash sale tháng 5 giảm 20%', 30),
(4, 'YEAR2025', 5.0, 10.0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'Khuyến mãi năm 2025 giảm 5%', 200);

-- 9. COMMENTS
INSERT IGNORE INTO comments (user_id, product_id, content, date) VALUES 
(2, 1, 'Máy chạy rất mượt, chiến game AAA đỉnh cao!', NOW()),
(3, 2, 'Màn hình quá đẹp, đáng đồng tiền bát gạo.', NOW()),
(2, 4, 'Màu Starlight bên ngoài đẹp hơn trong hình nhiều.', NOW());
