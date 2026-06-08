-- Xóa dữ liệu cũ để tránh trùng lặp (Tùy chọn, nếu bạn muốn làm sạch DB)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE users; TRUNCATE TABLE categories; ...
-- SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS (Admin: admin/password123, User: user1/password123 - Mã hóa bcrypt)
INSERT IGNORE INTO users (id, username, password, email, phone, role, create_date, avatar, status) VALUES
(1, 'admin', '$2a$10$c4jX23ezti1XsINrvQ9Ubul.dNi91FKVon2RCeD6SlzLnpmsh86vS', 'admin@laptopstore.com', '0123456789', 'ROLE_ADMIN', NOW(), 'admin-avatar.png', 'ACTIVE'),
(2, 'khachhang1', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'khachhang1@gmail.com', '0987654321', 'ROLE_USER', NOW(), 'user1.png', 'ACTIVE'),
(3, 'khachhang2', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'khachhang2@gmail.com', '0912345678', 'ROLE_USER', NOW(), 'user2.png', 'ACTIVE');

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

-- 10. MORE DEMO DATA
-- Password mặc định cho user demo: password123
INSERT IGNORE INTO users (id, username, password, email, phone, role, create_date, avatar, status) VALUES
(4, 'minhquan', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'minhquan@gmail.com', '0901122334', 'ROLE_USER', '2026-01-12 08:30:00', 'user3.png', 'ACTIVE'),
(5, 'lananh', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'lananh@gmail.com', '0902233445', 'ROLE_USER', '2026-01-18 11:20:00', 'user4.png', 'ACTIVE'),
(6, 'ducthang', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'ducthang@gmail.com', '0903344556', 'ROLE_USER', '2026-02-03 15:45:00', 'user5.png', 'ACTIVE'),
(7, 'ngocmai', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'ngocmai@gmail.com', '0904455667', 'ROLE_USER', '2026-02-20 09:10:00', 'user6.png', 'ACTIVE'),
(8, 'hoangnam', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'hoangnam@gmail.com', '0905566778', 'ROLE_USER', '2026-03-05 13:25:00', 'user7.png', 'ACTIVE'),
(9, 'thuyduong', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'thuyduong@gmail.com', '0906677889', 'ROLE_USER', '2026-03-19 18:00:00', 'user8.png', 'ACTIVE'),
(10, 'vietanh', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'vietanh@gmail.com', '0907788990', 'ROLE_USER', '2026-04-02 10:40:00', 'user9.png', 'ACTIVE');

INSERT IGNORE INTO cpu_infor (id, brands, speed, model, cores, threads, base_clock, boost_clock, cache) VALUES
(6, 'Intel', '2.2 GHz', 'Core i7-13620H', 10, 16, '2.2 GHz', '4.9 GHz', '24MB'),
(7, 'Intel', '1.7 GHz', 'Core Ultra 7 155H', 16, 22, '1.7 GHz', '4.8 GHz', '24MB'),
(8, 'AMD', '3.8 GHz', 'Ryzen 9 7940HS', 8, 16, '4.0 GHz', '5.2 GHz', '16MB'),
(9, 'Intel', '1.3 GHz', 'Core i5-1235U', 10, 12, '1.3 GHz', '4.4 GHz', '12MB'),
(10, 'Apple', 'Pro', 'M4 Pro', 12, 12, 'Pro', 'Pro', '24MB');

INSERT IGNORE INTO ram_infor (id, size, type, bus, slots) VALUES
(5, '16GB', 'LPDDR5X', '7467MHz', 0),
(6, '24GB', 'Unified', 'N/A', 0),
(7, '32GB', 'DDR5', '5600MHz', 2);

INSERT IGNORE INTO storage_infor (id, type, capacity, interface_name) VALUES
(4, 'SSD', '1TB', 'NVMe Gen 3'),
(5, 'SSD', '2TB', 'NVMe Gen 4'),
(6, 'SSD', '512GB', 'NVMe Gen 3');

INSERT IGNORE INTO gpu_infor (id, brand, model, v_ram) VALUES
(6, 'NVIDIA', 'RTX 4060', '8GB'),
(7, 'NVIDIA', 'RTX 4070', '8GB'),
(8, 'AMD', 'Radeon 780M', 'Shared'),
(9, 'Intel', 'Arc Graphics', 'Shared'),
(10, 'Apple', 'M4 Pro GPU', 'Shared');

INSERT IGNORE INTO screen_infor (id, size, resolution, panel, refresh_rate, brightness) VALUES
(5, '16.0"', 'WQXGA', 'IPS', '165Hz', '500 nits'),
(6, '15.6"', 'FHD', 'IPS', '60Hz', '250 nits'),
(7, '14.0"', '2.8K', 'OLED', '120Hz', '500 nits'),
(8, '16.2"', 'Liquid Retina XDR', 'Mini-LED', '120Hz', '1000 nits');

INSERT IGNORE INTO products_specs (id, cpu_id, ram_id, storage_id, gpu_id, screen_id, battery, weight, os) VALUES
(6, 6, 1, 2, 6, 1, '90Wh', '2.25kg', 'Windows 11'),
(7, 7, 5, 4, 9, 7, '75Wh', '1.39kg', 'Windows 11'),
(8, 8, 4, 2, 8, 7, '76Wh', '1.45kg', 'Windows 11'),
(9, 9, 3, 3, 5, 6, '42Wh', '1.66kg', 'Windows 11'),
(10, 10, 6, 5, 10, 8, '100Wh', '2.14kg', 'macOS'),
(11, 6, 7, 5, 7, 5, '99Wh', '2.45kg', 'Windows 11'),
(12, 4, 1, 1, 5, 6, '50Wh', '1.55kg', 'Windows 11'),
(13, 8, 1, 4, 6, 5, '83Wh', '2.2kg', 'Windows 11'),
(14, 7, 4, 5, 9, 7, '70Wh', '1.28kg', 'Windows 11'),
(15, 2, 6, 2, 2, 2, '72Wh', '1.55kg', 'macOS');

INSERT IGNORE INTO products (id, product_name, product_description, create_date, category_id) VALUES
(6, 'Lenovo Legion 5 Pro', 'Laptop gaming màn hình 16 inch, hiệu năng ổn định cho game và render.', '2026-01-10 09:00:00', 1),
(7, 'Asus Zenbook 14 OLED', 'Ultrabook OLED mỏng nhẹ, phù hợp học tập, văn phòng và di chuyển.', '2026-01-22 10:15:00', 2),
(8, 'HP Omen Transcend 14', 'Laptop hiệu năng cao, thiết kế gọn nhẹ cho sáng tạo nội dung.', '2026-02-05 14:30:00', 4),
(9, 'Acer Aspire 5', 'Laptop phổ thông giá tốt cho sinh viên và nhân viên văn phòng.', '2026-02-14 16:20:00', 2),
(10, 'MacBook Pro 16 M4 Pro', 'MacBook màn hình lớn, hiệu năng mạnh cho lập trình và đồ họa chuyên nghiệp.', '2026-03-01 08:45:00', 3),
(11, 'MSI Katana 15', 'Laptop gaming cấu hình RTX, bàn phím RGB và khả năng nâng cấp tốt.', '2026-03-07 13:05:00', 1),
(12, 'Dell Inspiron 15', 'Laptop cân bằng giữa giá, hiệu năng và độ bền cho công việc hằng ngày.', '2026-03-12 11:35:00', 2),
(13, 'Gigabyte G5 KF', 'Laptop gaming tầm trung, hiệu năng GPU tốt trong phân khúc.', '2026-03-25 15:00:00', 1),
(14, 'LG Gram 14', 'Laptop siêu nhẹ, pin lâu, phù hợp người dùng thường xuyên di chuyển.', '2026-04-04 09:50:00', 2),
(15, 'MacBook Pro 14 M3 Max', 'Máy trạm di động cho dựng phim, thiết kế và phát triển phần mềm.', '2026-04-12 17:10:00', 3);

INSERT IGNORE INTO product_details (id, product_id, products_specs_id, quantity, price, image_detail, color) VALUES
(6, 6, 6, 18, 34990000, 'lenovo_legion_5_pro_gray.jpg', 'Storm Grey'),
(7, 6, 11, 8, 43990000, 'lenovo_legion_5_pro_black.jpg', 'Onyx Grey'),
(8, 7, 7, 35, 28990000, 'asus_zenbook_14_oled_blue.jpg', 'Ponder Blue'),
(9, 7, 14, 22, 32990000, 'asus_zenbook_14_oled_silver.jpg', 'Foggy Silver'),
(10, 8, 8, 12, 37990000, 'hp_omen_transcend_white.jpg', 'Ceramic White'),
(11, 8, 13, 10, 42990000, 'hp_omen_transcend_black.jpg', 'Shadow Black'),
(12, 9, 9, 50, 12990000, 'acer_aspire_5_silver.jpg', 'Pure Silver'),
(13, 9, 12, 40, 14990000, 'acer_aspire_5_gray.jpg', 'Steel Gray'),
(14, 10, 10, 9, 69990000, 'macbook_pro_16_m4_space_black.jpg', 'Space Black'),
(15, 10, 10, 7, 69990000, 'macbook_pro_16_m4_silver.jpg', 'Silver'),
(16, 11, 6, 20, 27990000, 'msi_katana_15_black.jpg', 'Black'),
(17, 11, 11, 11, 35990000, 'msi_katana_15_gray.jpg', 'Titanium Gray'),
(18, 12, 12, 38, 15990000, 'dell_inspiron_15_silver.jpg', 'Platinum Silver'),
(19, 12, 3, 25, 17990000, 'dell_inspiron_15_blue.jpg', 'Midnight Blue'),
(20, 13, 13, 16, 25990000, 'gigabyte_g5_kf_black.jpg', 'Black'),
(21, 13, 6, 14, 28990000, 'gigabyte_g5_kf_gray.jpg', 'Mecha Gray'),
(22, 14, 14, 30, 31990000, 'lg_gram_14_white.jpg', 'Snow White'),
(23, 14, 7, 18, 33990000, 'lg_gram_14_black.jpg', 'Obsidian Black'),
(24, 15, 15, 6, 74990000, 'macbook_pro_14_m3max_black.jpg', 'Space Black'),
(25, 15, 15, 5, 74990000, 'macbook_pro_14_m3max_silver.jpg', 'Silver');

INSERT IGNORE INTO discounts (id, code, discount_percent, max_percent, start_date, end_date, description, quantity) VALUES
(5, 'MAY2026', 8.0, 12.0, '2026-05-01 00:00:00', '2026-05-31 23:59:59', 'Ưu đãi tháng 5 năm 2026', 120),
(6, 'GAMING10', 10.0, 15.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'Giảm giá cho laptop gaming', 80),
(7, 'OFFICE7', 7.0, 10.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'Giảm giá laptop văn phòng', 150),
(8, 'MACBOOK5', 5.0, 8.0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'Ưu đãi riêng cho MacBook', 60);

INSERT IGNORE INTO orders (id, user_id, discount_id, order_date, status, total_price, receiver_name, receiver_address, receiver_phone) VALUES
(5, 4, 6, '2026-01-15 09:20:00', 'DELIVERED', 31491000, 'Nguyễn Minh Quân', 'Cầu Giấy, Hà Nội', '0901122334'),
(6, 5, 7, '2026-01-28 19:05:00', 'DELIVERED', 26960700, 'Trần Lan Anh', 'Quận 3, TP.HCM', '0902233445'),
(7, 6, NULL, '2026-02-08 08:45:00', 'PROCESSING', 37990000, 'Phạm Đức Thắng', 'Hải Châu, Đà Nẵng', '0903344556'),
(8, 7, NULL, '2026-02-19 14:15:00', 'PENDING', 12990000, 'Lê Ngọc Mai', 'Ninh Kiều, Cần Thơ', '0904455667'),
(9, 8, 8, '2026-03-03 10:30:00', 'DELIVERED', 66490500, 'Vũ Hoàng Nam', 'Biên Hòa, Đồng Nai', '0905566778'),
(10, 9, 6, '2026-03-11 16:40:00', 'CANCELLED', 25191000, 'Đỗ Thùy Dương', 'Thủ Đức, TP.HCM', '0906677889'),
(11, 10, NULL, '2026-03-17 12:25:00', 'DELIVERED', 15990000, 'Bùi Việt Anh', 'Hoàn Kiếm, Hà Nội', '0907788990'),
(12, 4, 5, '2026-03-26 20:10:00', 'DELIVERED', 39550800, 'Nguyễn Minh Quân', 'Cầu Giấy, Hà Nội', '0901122334'),
(13, 5, NULL, '2026-04-02 09:05:00', 'PROCESSING', 31990000, 'Trần Lan Anh', 'Quận 3, TP.HCM', '0902233445'),
(14, 6, 8, '2026-04-09 18:55:00', 'DELIVERED', 71240500, 'Phạm Đức Thắng', 'Hải Châu, Đà Nẵng', '0903344556'),
(15, 7, 7, '2026-04-18 11:30:00', 'PENDING', 14870700, 'Lê Ngọc Mai', 'Ninh Kiều, Cần Thơ', '0904455667'),
(16, 8, 6, '2026-04-25 15:45:00', 'DELIVERED', 50382000, 'Vũ Hoàng Nam', 'Biên Hòa, Đồng Nai', '0905566778'),
(17, 9, NULL, '2026-05-03 13:20:00', 'PROCESSING', 33990000, 'Đỗ Thùy Dương', 'Thủ Đức, TP.HCM', '0906677889'),
(18, 10, 5, '2026-05-10 17:35:00', 'DELIVERED', 68990800, 'Bùi Việt Anh', 'Hoàn Kiếm, Hà Nội', '0907788990'),
(19, 4, NULL, '2026-05-12 08:50:00', 'PENDING', 28990000, 'Nguyễn Minh Quân', 'Cầu Giấy, Hà Nội', '0901122334'),
(20, 5, 6, '2026-05-14 21:00:00', 'DELIVERED', 23391000, 'Trần Lan Anh', 'Quận 3, TP.HCM', '0902233445');

INSERT IGNORE INTO order_details (id, order_id, product_detail_id, quantity, price) VALUES
(1, 1, 1, 1, 26990000),
(2, 2, 2, 1, 52990000),
(3, 3, 3, 1, 16490000),
(4, 4, 5, 1, 21990000),
(5, 5, 6, 1, 34990000),
(6, 6, 8, 1, 28990000),
(7, 7, 10, 1, 37990000),
(8, 8, 12, 1, 12990000),
(9, 9, 14, 1, 69990000),
(10, 10, 16, 1, 27990000),
(11, 11, 18, 1, 15990000),
(12, 12, 11, 1, 42990000),
(13, 13, 22, 1, 31990000),
(14, 14, 24, 1, 74990000),
(15, 15, 18, 1, 15990000),
(16, 16, 20, 2, 25990000),
(17, 17, 23, 1, 33990000),
(18, 18, 15, 1, 69990000),
(19, 19, 8, 1, 28990000),
(20, 20, 20, 1, 25990000);

-- 11. ORDERS FROM MID-2025 TO JUNE 2026
INSERT IGNORE INTO users (id, username, password, email, phone, role, create_date, avatar, status) VALUES
(11, 'huyhoang', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'huyhoang@gmail.com', '0911002001', 'ROLE_USER', '2025-06-10 09:15:00', 'user10.png', 'ACTIVE'),
(12, 'phuonglinh', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'phuonglinh@gmail.com', '0911002002', 'ROLE_USER', '2025-07-05 14:20:00', 'user11.png', 'ACTIVE'),
(13, 'quocbao', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'quocbao@gmail.com', '0911002003', 'ROLE_USER', '2025-08-18 10:45:00', 'user12.png', 'ACTIVE'),
(14, 'kimngan', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'kimngan@gmail.com', '0911002004', 'ROLE_USER', '2025-09-22 16:05:00', 'user13.png', 'ACTIVE'),
(15, 'anhkhoa', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'anhkhoa@gmail.com', '0911002005', 'ROLE_USER', '2025-11-03 08:50:00', 'user14.png', 'ACTIVE'),
(16, 'baotran', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'baotran@gmail.com', '0911002006', 'ROLE_USER', '2025-12-12 19:30:00', 'user15.png', 'ACTIVE');

INSERT IGNORE INTO orders (id, user_id, discount_id, order_date, status, total_price, receiver_name, receiver_address, receiver_phone) VALUES
(21, 11, 4, '2025-06-16 09:30:00', 'DELIVERED', 25640500, 'Lê Huy Hoàng', 'Thanh Xuân, Hà Nội', '0911002001'),
(22, 12, NULL, '2025-06-27 15:10:00', 'PENDING', 16490000, 'Nguyễn Phương Linh', 'Quận 7, TP.HCM', '0911002002'),
(23, 13, 4, '2025-07-08 11:45:00', 'DELIVERED', 20890500, 'Trương Quốc Bảo', 'Hải Châu, Đà Nẵng', '0911002003'),
(24, 14, NULL, '2025-07-21 18:25:00', 'PROCESSING', 25990000, 'Võ Kim Ngân', 'Nha Trang, Khánh Hòa', '0911002004'),
(25, 15, 4, '2025-08-05 08:20:00', 'DELIVERED', 50340500, 'Đặng Anh Khoa', 'Biên Hòa, Đồng Nai', '0911002005'),
(26, 16, NULL, '2025-08-19 20:05:00', 'CANCELLED', 14990000, 'Phan Bảo Trân', 'Ninh Kiều, Cần Thơ', '0911002006'),
(27, 11, NULL, '2025-09-03 10:40:00', 'DELIVERED', 28990000, 'Lê Huy Hoàng', 'Thanh Xuân, Hà Nội', '0911002001'),
(28, 12, 4, '2025-09-17 14:55:00', 'DELIVERED', 28490500, 'Nguyễn Phương Linh', 'Quận 7, TP.HCM', '0911002002'),
(29, 13, NULL, '2025-10-02 16:15:00', 'PENDING', 37990000, 'Trương Quốc Bảo', 'Hải Châu, Đà Nẵng', '0911002003'),
(30, 14, 4, '2025-10-14 09:05:00', 'DELIVERED', 26590500, 'Võ Kim Ngân', 'Nha Trang, Khánh Hòa', '0911002004'),
(31, 15, NULL, '2025-11-06 13:35:00', 'PROCESSING', 33990000, 'Đặng Anh Khoa', 'Biên Hòa, Đồng Nai', '0911002005'),
(32, 16, 4, '2025-11-20 19:45:00', 'DELIVERED', 66490500, 'Phan Bảo Trân', 'Ninh Kiều, Cần Thơ', '0911002006'),
(33, 11, 4, '2025-12-04 08:10:00', 'DELIVERED', 24690500, 'Lê Huy Hoàng', 'Thanh Xuân, Hà Nội', '0911002001'),
(34, 12, NULL, '2025-12-18 17:25:00', 'REFUNDED', 17990000, 'Nguyễn Phương Linh', 'Quận 7, TP.HCM', '0911002002'),
(35, 13, 6, '2026-01-06 09:50:00', 'DELIVERED', 39591000, 'Trương Quốc Bảo', 'Hải Châu, Đà Nẵng', '0911002003'),
(36, 14, NULL, '2026-01-22 11:30:00', 'PENDING', 12990000, 'Võ Kim Ngân', 'Nha Trang, Khánh Hòa', '0911002004'),
(37, 15, NULL, '2026-02-04 15:20:00', 'DELIVERED', 32990000, 'Đặng Anh Khoa', 'Biên Hòa, Đồng Nai', '0911002005'),
(38, 16, 7, '2026-02-18 18:45:00', 'DELIVERED', 14870700, 'Phan Bảo Trân', 'Ninh Kiều, Cần Thơ', '0911002006'),
(39, 11, 8, '2026-03-06 10:05:00', 'DELIVERED', 47493600, 'Lê Huy Hoàng', 'Thanh Xuân, Hà Nội', '0911002001'),
(40, 12, NULL, '2026-03-23 21:15:00', 'PROCESSING', 25990000, 'Nguyễn Phương Linh', 'Quận 7, TP.HCM', '0911002002'),
(41, 13, 6, '2026-04-07 08:55:00', 'DELIVERED', 62982000, 'Trương Quốc Bảo', 'Hải Châu, Đà Nẵng', '0911002003'),
(42, 14, NULL, '2026-04-21 14:10:00', 'CANCELLED', 28990000, 'Võ Kim Ngân', 'Nha Trang, Khánh Hòa', '0911002004'),
(43, 15, 5, '2026-05-06 12:35:00', 'DELIVERED', 25290800, 'Đặng Anh Khoa', 'Biên Hòa, Đồng Nai', '0911002005'),
(44, 16, NULL, '2026-05-24 16:40:00', 'REFUNDED', 15990000, 'Phan Bảo Trân', 'Ninh Kiều, Cần Thơ', '0911002006'),
(45, 11, 6, '2026-06-01 09:00:00', 'DELIVERED', 81882000, 'Lê Huy Hoàng', 'Thanh Xuân, Hà Nội', '0911002001'),
(46, 12, NULL, '2026-06-03 13:15:00', 'PROCESSING', 31990000, 'Nguyễn Phương Linh', 'Quận 7, TP.HCM', '0911002002'),
(47, 13, 8, '2026-06-05 18:20:00', 'DELIVERED', 66490500, 'Trương Quốc Bảo', 'Hải Châu, Đà Nẵng', '0911002003'),
(48, 14, NULL, '2026-06-08 10:30:00', 'PENDING', 28990000, 'Võ Kim Ngân', 'Nha Trang, Khánh Hòa', '0911002004');

INSERT IGNORE INTO order_details (id, order_id, product_detail_id, quantity, price) VALUES
(21, 21, 1, 1, 26990000),
(22, 22, 3, 1, 16490000),
(23, 23, 5, 1, 21990000),
(24, 24, 4, 1, 25990000),
(25, 25, 2, 1, 52990000),
(26, 26, 13, 1, 14990000),
(27, 27, 8, 1, 28990000),
(28, 28, 22, 1, 31990000),
(29, 29, 10, 1, 37990000),
(30, 30, 16, 1, 27990000),
(31, 31, 23, 1, 33990000),
(32, 32, 14, 1, 69990000),
(33, 33, 20, 1, 25990000),
(34, 34, 19, 1, 17990000),
(35, 35, 11, 1, 42990000),
(36, 36, 12, 1, 12990000),
(37, 37, 9, 1, 32990000),
(38, 38, 18, 1, 15990000),
(39, 39, 2, 1, 52990000),
(40, 40, 20, 1, 25990000),
(41, 41, 6, 2, 34990000),
(42, 42, 8, 1, 28990000),
(43, 43, 16, 1, 27990000),
(44, 44, 18, 1, 15990000),
(45, 45, 6, 1, 34990000),
(46, 45, 7, 1, 43990000),
(47, 46, 22, 1, 31990000),
(48, 47, 14, 1, 69990000),
(49, 48, 8, 1, 28990000);

INSERT IGNORE INTO comments (user_id, product_id, content, date) VALUES
(4, 6, 'Máy chạy êm, màn hình 16 inch nhìn rất đã khi code và chơi game.', '2026-01-18 10:00:00'),
(5, 7, 'Màn OLED đẹp, máy nhẹ, pin đủ dùng cả ngày làm việc.', '2026-01-30 20:30:00'),
(6, 8, 'Hiệu năng tốt cho dựng video ngắn và chạy nhiều tab cùng lúc.', '2026-02-10 09:15:00'),
(7, 9, 'Giá hợp lý cho nhu cầu học tập, bàn phím gõ ổn.', '2026-02-21 15:20:00'),
(8, 10, 'Màn hình lớn, loa hay, build rất chắc chắn.', '2026-03-05 11:10:00'),
(10, 12, 'Máy văn phòng ổn định, cổng kết nối đầy đủ.', '2026-03-20 14:00:00'),
(4, 13, 'RTX 4060 xử lý game tốt, nhiệt độ chấp nhận được.', '2026-03-28 19:25:00'),
(5, 14, 'Rất nhẹ, mang đi họp cả ngày không bị mỏi vai.', '2026-04-05 08:40:00'),
(6, 15, 'Hiệu năng render tốt, phù hợp làm đồ họa chuyên nghiệp.', '2026-04-15 22:10:00'),
(9, 14, 'Pin tốt và màn OLED rất sắc nét.', '2026-05-04 12:35:00');
