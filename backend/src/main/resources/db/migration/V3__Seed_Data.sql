-- 1. XÓA DỮ LIỆU CŨ (Xóa bảng con trước, bảng cha sau)
DELETE FROM property_amenities;
DELETE FROM property_images;
DELETE FROM customer_requests;
DELETE FROM properties;
DELETE FROM amenities;
-- Không xóa users để tránh mất tài khoản admin hiện tại (hoặc xóa nếu muốn reset sạch)

-- 2. TẠO TIỆN ÍCH (AMENITIES)
-- Lưu ý: Entity Amenity chỉ có (id, name, icon_code), KHÔNG CÓ description
INSERT INTO amenities (id, name, icon_code) VALUES 
(1, 'Hồ bơi', 'fa-swimming-pool'),
(2, 'Karaoke', 'fa-microphone'),
(3, 'Bida', 'fa-circle'),
(4, 'BBQ', 'fa-fire'),
(5, 'Gần biển', 'fa-water');

-- 3. TẠO VILLA (PROPERTIES)
INSERT INTO properties (
    id, code, name, slug, description, address, area, 
    price_weekday, price_weekend, standard_guests, max_guests, 
    bedroom_count, bathroom_count, status, created_at, updated_at,
    map_url, facebook_link
) 
VALUES 
(1, 'MS01', 'Villa Bãi Sau Giá Rẻ', 'villa-bai-sau-gia-re-ms01', 'Villa thiết kế hiện đại, phù hợp nhóm nhỏ.', '123 Thùy Vân, Bãi Sau', '200m2', 
3000000, 5000000, 10, 15, 4, 4, 'ACTIVE', NOW(), NOW(), 
'https://goo.gl/maps/example1', 'https://facebook.com/example1'),

(2, 'MS02', 'Luxury Villa View Biển', 'luxury-villa-view-bien-ms02', 'Villa đẳng cấp 5 sao, view trực diện biển.', '45 Trần Phú, Bãi Trước', '500m2', 
8000000, 12000000, 20, 30, 8, 9, 'ACTIVE', NOW(), NOW(), 
'https://goo.gl/maps/example2', 'https://facebook.com/example2'),

(3, 'MS03', 'Villa Sân Vườn Rộng', 'villa-san-vuon-rong-ms03', 'Không gian xanh mát, thích hợp nghỉ dưỡng gia đình.', '88 Lê Hồng Phong', '350m2', 
4500000, 7000000, 15, 20, 5, 6, 'ACTIVE', NOW(), NOW(), 
'https://goo.gl/maps/example3', 'https://facebook.com/example3');

-- 4. GÁN TIỆN ÍCH CHO VILLA (PROPERTY_AMENITIES)
INSERT INTO property_amenities (property_id, amenity_id) VALUES 
(1, 1), (1, 2),          -- Villa 1: Hồ bơi, Karaoke
(2, 1), (2, 2), (2, 3),  -- Villa 2: Hồ bơi, Karaoke, Bida
(3, 4), (3, 5);          -- Villa 3: BBQ, Gần biển

-- 5. TẠO ẢNH MẪU (PROPERTY_IMAGES)
INSERT INTO property_images (property_id, image_url, is_thumbnail) VALUES 
(1, 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', 1),
(1, 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', 0),
(2, 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', 1),
(3, 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', 1);

-- 6. TẠO YÊU CẦU KHÁCH HÀNG MẪU (CUSTOMER_REQUESTS)
INSERT INTO customer_requests (customer_name, phone_number, note, check_in_date, check_out_date, adults, children, budget, is_resolved, created_at)
VALUES 
('Nguyen Van A', '0909123456', 'Cần tìm villa cho gia đình', '2025-12-01', '2025-12-03', 10, 2, 5000000, 0, NOW());