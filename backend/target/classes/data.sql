-- Thêm dữ liệu Users mẫu (Mật khẩu đã được mã hóa bằng bcrypt)
INSERT INTO users (username, password, email, phone, role, create_date, avatar) VALUES 
('admin', '$2a$10$c4jX23ezti1XsINrvQ9Ubul.dNi91FKVon2RCeD6SlzLnpmsh86vS', 'admin@laptopstore.com', '0123456789', 'ADMIN', NOW(), 'admin-avatar.png'),
('khachhang1', '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK', 'khachhang1@gmail.com', '0987654321', 'USER', NOW(), 'default-avatar.png');

-- Thêm dữ liệu Categories
INSERT INTO categories (category_name, category_description) VALUES 
('Laptop Gaming', 'Laptop cấu hình mạnh mẽ dành cho game thủ'),
('Laptop Văn phòng', 'Laptop mỏng nhẹ, pin trâu dành cho dân văn phòng, học sinh sinh viên'),
('MacBook', 'Sản phẩm máy tính xách tay đến từ Apple');

-- Thêm dữ liệu cấu hình phần cứng mẫu
INSERT INTO cpu_infor (brands, speed, model, cores, threads, base_clock, boost_clock, cache) VALUES 
('Intel', '2.3 GHz', 'Core i7-12700H', 14, 20, '2.3 GHz', '4.7 GHz', '24MB'),
('Apple', 'Max', 'M3 Pro', 11, 11, 'Max', 'Max', '18MB'),
('AMD', '3.3 GHz', 'Ryzen 7 6800H', 8, 16, '3.2 GHz', '4.7 GHz', '16MB');

INSERT INTO ram_infor (size, type, bus, slots) VALUES 
('16GB', 'DDR5', '4800MHz', 2),
('18GB', 'Unified Memory', 'N/A', 0),
('8GB', 'DDR4', '3200MHz', 2);

INSERT INTO storage_infor (type, capacity, interface_name) VALUES 
('SSD', '512GB', 'NVMe PCIe Gen 4.0'),
('SSD', '1TB', 'NVMe PCIe Gen 4.0');

INSERT INTO gpu_infor (brand, model, v_ram) VALUES 
('NVIDIA', 'RTX 3060', '6GB GDDR6'),
('Apple', 'M3 Pro GPU', 'N/A'),
('AMD', 'Radeon Graphics', 'Shared');

INSERT INTO screen_infor (size, resolution, panel, refresh_rate, brightness) VALUES 
('15.6 inch', 'FHD (1920x1080)', 'IPS', '144Hz', '250 nits'),
('14.2 inch', 'Liquid Retina XDR (3024x1964)', 'Mini-LED', '120Hz', '1000 nits'),
('14 inch', 'FHD (1920x1080)', 'OLED', '90Hz', '400 nits');

-- Thêm Specs (kết hợp các cấu hình trên)
-- Spec 1: Gaming (Intel i7, 16GB DDR5, 512GB SSD, RTX 3060, 15.6 FHD 144Hz)
INSERT INTO products_specs (cpu_id, ram_id, storage_id, gpu_id, screen_id, battery, weight, os) VALUES 
(1, 1, 1, 1, 1, '90Wh', '2.3kg', 'Windows 11 Home'),
-- Spec 2: MacBook M3 Pro (M3 Pro, 18GB, 512GB, M3 GPU, 14.2 XDR)
(2, 2, 1, 2, 2, '70Wh', '1.6kg', 'macOS Sonoma'),
-- Spec 3: Văn phòng (AMD Ryzen 7, 8GB DDR4, 512GB SSD, AMD Graphics, 14 OLED)
(3, 3, 1, 3, 3, '50Wh', '1.4kg', 'Windows 11 Home');

-- Thêm dữ liệu Products
INSERT INTO products (product_name, product_description, create_date, category_id) VALUES 
('Asus ROG Strix G15', 'Laptop gaming quốc dân với cấu hình khủng và tản nhiệt mát mẻ.', NOW(), 1),
('MacBook Pro 14 inch M3 Pro', 'MacBook Pro siêu mạnh mẽ dành cho dân thiết kế, lập trình.', NOW(), 3),
('Asus ZenBook 14 OLED', 'Laptop văn phòng mỏng nhẹ, màn hình OLED rực rỡ.', NOW(), 2);

-- Thêm dữ liệu ProductDetails (biến thể, giá, số lượng)
INSERT INTO product_details (product_id, products_specs_id, quantity, price, image_detail, color) VALUES 
(1, 1, 50, 25990000.0, 'https://raw.githubusercontent.com/antigravity/images/main/asus_rog.jpg', 'Eclipse Gray'),
(2, 2, 20, 49990000.0, 'https://raw.githubusercontent.com/antigravity/images/main/macbook_pro_14.jpg', 'Space Black'),
(3, 3, 100, 18990000.0, 'https://raw.githubusercontent.com/antigravity/images/main/zenbook_14.jpg', 'Ponder Blue');
