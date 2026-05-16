-- TX2 mock data generator for MySQL.
-- Usage: mysql -u user -p laptop_store < backend/src/main/resources/mock-data-tx2.sql
-- The script is idempotent enough for demo: generated usernames/product names use TX2 prefixes.

DELIMITER $$

DROP PROCEDURE IF EXISTS seed_tx2_mock_data $$
CREATE PROCEDURE seed_tx2_mock_data()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE product_id BIGINT;
  DECLARE detail_id BIGINT;
  DECLARE order_id BIGINT;
  DECLARE category_id BIGINT;
  DECLARE user_id BIGINT;
  DECLARE order_status VARCHAR(20);

  INSERT IGNORE INTO categories (id, category_name, category_description) VALUES
    (101, 'TX2 Gaming', 'Dữ liệu demo laptop gaming'),
    (102, 'TX2 Office', 'Dữ liệu demo laptop văn phòng'),
    (103, 'TX2 Ultrabook', 'Dữ liệu demo laptop mỏng nhẹ'),
    (104, 'TX2 Workstation', 'Dữ liệu demo laptop đồ họa');

  WHILE i <= 250 DO
    INSERT IGNORE INTO users (username, password, email, phone, role, create_date, avatar, status)
    VALUES (
      CONCAT('tx2_user_', i),
      '$2a$10$ALTEpPL.EGnY1wWQoC8l4ugcKBAEqPKBwnoaz416gvDMMaBqquZFK',
      CONCAT('tx2_user_', i, '@example.com'),
      CONCAT('09', LPAD(i, 8, '0')),
      'ROLE_USER',
      DATE_SUB(NOW(), INTERVAL (i % 180) DAY),
      'default-avatar.png',
      'ACTIVE'
    );
    SET i = i + 1;
  END WHILE;

  SET i = 1;
  WHILE i <= 400 DO
    SET category_id = 101 + (i % 4);
    INSERT INTO products (product_name, product_description, create_date, category_id)
    VALUES (
      CONCAT('TX2 Laptop Demo ', i),
      'Dữ liệu sản phẩm demo dùng cho phân trang, tìm kiếm, lọc và import/export.',
      DATE_SUB(NOW(), INTERVAL (i % 210) DAY),
      category_id
    );
    SET product_id = LAST_INSERT_ID();

    INSERT INTO product_details (product_id, products_specs_id, quantity, price, image_detail, color)
    VALUES (
      product_id,
      NULL,
      5 + (i % 60),
      8000000 + ((i % 45) * 750000),
      'https://via.placeholder.com/300x220?text=TX2+Laptop',
      ELT(1 + (i % 4), 'Black', 'Silver', 'Blue', 'Gray')
    );
    SET i = i + 1;
  END WHILE;

  SET i = 1;
  WHILE i <= 1500 DO
    SELECT id INTO user_id FROM users WHERE username = CONCAT('tx2_user_', 1 + (i % 250)) LIMIT 1;
    SELECT pd.id INTO detail_id
    FROM product_details pd
    JOIN products p ON p.id = pd.product_id
    WHERE p.product_name LIKE 'TX2 Laptop Demo %'
      AND pd.id >= (
        SELECT MIN(pd2.id) + (i % 400)
        FROM product_details pd2
        JOIN products p2 ON p2.id = pd2.product_id
        WHERE p2.product_name LIKE 'TX2 Laptop Demo %'
      )
    ORDER BY pd.id
    LIMIT 1;

    SET order_status = ELT(1 + (i % 4), 'PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED');
    INSERT INTO orders (user_id, order_date, status, total_price, receiver_name, receiver_address, receiver_phone)
    VALUES (
      user_id,
      DATE_SUB(NOW(), INTERVAL (i % 240) DAY),
      order_status,
      9000000 + ((i % 55) * 850000),
      CONCAT('Khách TX2 ', i),
      CONCAT('Địa chỉ demo TX2 số ', i),
      CONCAT('08', LPAD(i, 8, '0'))
    );
    SET order_id = LAST_INSERT_ID();

    INSERT INTO order_details (order_id, product_detail_id, quantity, price)
    VALUES (order_id, detail_id, 1 + (i % 3), 9000000 + ((i % 55) * 850000));

    SET i = i + 1;
  END WHILE;
END $$

DELIMITER ;

CALL seed_tx2_mock_data();
DROP PROCEDURE IF EXISTS seed_tx2_mock_data;
