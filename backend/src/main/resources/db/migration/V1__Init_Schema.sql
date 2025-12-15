-- 1. Bảng Tiện ích (Thêm icon_code)
CREATE TABLE amenities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_code VARCHAR(255)
);

-- 2. Bảng Villa (Cập nhật đầy đủ các trường area, map_url, status...)
CREATE TABLE properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    area VARCHAR(255),
    map_url TEXT,
    price_weekday DECIMAL(19,2), -- BigDecimal map sang Decimal
    price_weekend DECIMAL(19,2),
    standard_guests INT,
    max_guests INT,
    bedroom_count INT,
    bathroom_count INT,
    facebook_link VARCHAR(255),
    status VARCHAR(20),
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

-- 3. Bảng trung gian Villa - Tiện ích
CREATE TABLE property_amenities (
    property_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (amenity_id) REFERENCES amenities(id)
);

-- 4. Bảng Ảnh Villa (Thêm is_thumbnail)
CREATE TABLE property_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT,
    image_url VARCHAR(255) NOT NULL,
    is_thumbnail BOOLEAN DEFAULT 0,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- 5. Bảng Yêu cầu khách hàng (Đã chuẩn hóa tên cột)
CREATE TABLE customer_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255),
    phone_number VARCHAR(255) NOT NULL,
    note TEXT,
    check_in_date DATE,
    check_out_date DATE,
    adults INT,
    children INT,
    budget DOUBLE,
    is_resolved BOOLEAN DEFAULT 0,
    created_at DATETIME(6)
);

-- 6. Bảng User (Admin)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20)
);

-- =============================================
-- DỮ LIỆU MẪU (SEED DATA)
-- =============================================

-- Tiện ích mẫu (Thêm icon code giả định)
INSERT INTO amenities (name, icon_code) VALUES 
('Hồ bơi', 'fa-swimming-pool'), 
('Karaoke', 'fa-microphone'), 
('Bida', 'fa-circle'), 
('BBQ', 'fa-fire'), 
('Gần biển', 'fa-water');

-- Admin mặc định (Pass: 123456)
INSERT INTO users (username, password, full_name, role) 
VALUES ('admin', '$2a$10$kQQAaLdUW95sGizRkL9e7.gs0MXiEhmy5.ZDD6BUn6v.QjoY/luS6', 'Admin Dep Trai', 'ADMIN');