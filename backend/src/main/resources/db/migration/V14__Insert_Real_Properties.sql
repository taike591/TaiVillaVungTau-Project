-- V14__Insert_Real_Properties.sql

-- Xóa dữ liệu cũ (nếu có) để đảm bảo sạch sẽ
DELETE FROM property_amenities;
DELETE FROM property_images;
DELETE FROM properties;
-- Reset Auto Increment (MySQL specific)
ALTER TABLE properties AUTO_INCREMENT = 1;

-- INSERT PROPERTIES (với slug)
-- MS233: Bai Sau (1), 5.000.000, 8 Bed, 11 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS233', 'ms233', 'Villa Bãi Sau - MS233', 'B5 Đặng Thuỳ Trâm', 'Villa Vũng Tàu bãi sau. 8 phòng ngủ (5 đơn - 2 đôi - 1 ba ) - 12 giường - 11 WC. Hồ bơi nước mặn 40m2. Cách biển 350m.', 1, 5000000, 7000000, 8, 11, 15, 'ACTIVE', true, NOW(), NOW());

-- MS215: Bai Sau (1), 6.000.000, 6 Bed, 7 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS215', 'ms215', 'Villa Bãi Sau - MS215', '15 Trần Thượng Xuyên', 'Khai trương Villa Vũng Tàu bãi sau. 6 phòng ngủ - 6 giường - 7 WC - 4 bồn tắm. Nội thất mới 100%. Hồ bơi rộng 57m2.', 1, 6000000, 8000000, 6, 7, 15, 'ACTIVE', true, NOW(), NOW());

-- MS211: Bai Sau (1), 4.000.000, 6 Bed, 7 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS211', 'ms211', 'Villa Bãi Sau - MS211', '60D Trần Bình Trọng', 'Villa Vũng Tàu bãi sau. 6 phòng ngủ 8 giường. Hồ bơi sục 60m2. Gần chợ hải sản.', 1, 4000000, 6000000, 6, 7, 15, 'ACTIVE', false, NOW(), NOW());

-- MS207: Bai Dau/Tran Phu (4), 3.000.000, 5 Bed, 6 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS207', 'ms207', 'Villa Trần Phú - MS207', '54/1B Trần Phú', 'Villa Vũng Tàu khu Trần Phú. 5 phòng ngủ 8 giường. Hồ bơi muối ngoài trời 40m2. Gần Gành Hào.', 4, 3000000, 5000000, 5, 6, 15, 'ACTIVE', false, NOW(), NOW());

-- MS208: Bai Sau (1), 6.000.000, 7 Bed, 8 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS208', 'ms208', 'Villa Nguyễn Tuân - MS208', '06 Nguyễn Tuân', 'Khai trương Villa Vũng Tàu bãi sau. 7 phòng ngủ - 16 giường - 8 WC. Hồ Bơi 150m2 Full Đá Mài. Sân vườn BBQ rộng.', 1, 6000000, 8500000, 7, 8, 20, 'ACTIVE', true, NOW(), NOW());

-- MS197: Bai Sau (1), 5.000.000, 6 Bed, 7 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS197', 'ms197', 'Villa Nguyễn Hữu Tiến - MS197', '24 Nguyễn Hữu Tiến', 'Khai trương Villa Vũng Tàu bãi sau. 6 phòng ngủ - 8 giường - 7 WC. Hồ bơi 35m2. Nội thất hiện đại.', 1, 5000000, 7000000, 6, 7, 15, 'ACTIVE', false, NOW(), NOW());

-- MS199: Long Cung (3), 3.000.000, 4 Bed, 5 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS199', 'ms199', 'Villa Long Cung - MS199', 'B2.50 Khu Thanh Bình', 'Khai trương Villa Vũng Tàu Long Cung. 4 phòng ngủ - 4 giường - 5 WC. Hồ bơi 56m2 hồ tràn. Sân vườn pickleball.', 3, 3000000, 5000000, 4, 5, 14, 'ACTIVE', true, NOW(), NOW());

-- MS183: Long Cung (3), 5.000.000, 6 Bed, 7 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS183', 'ms183', 'Villa Long Cung - MS183', '16 Hà Huy Tập', 'VILLA Vũng Tàu khu Long Cung. 6 phòng ngủ 10 giường. Hồ bơi ngoài trời 80m2. Cách bãi tắm 3p đi bộ.', 3, 5000000, 7500000, 6, 7, 20, 'ACTIVE', false, NOW(), NOW());

-- MS177: Bai Sau (1), 4.000.000, 7 Bed, 6 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS177', 'ms177', 'Villa Võ Thị Sáu - MS177', '185 Võ Thị Sáu', 'Villa Vũng Tàu bãi sau. 7 phòng ngủ, 9 giường, 6 WC. Hồ bơi ngoài trời 50m2. Ngay khu du lịch sầm uất.', 1, 4000000, 6000000, 7, 6, 15, 'ACTIVE', false, NOW(), NOW());

-- MS169: Bai Dau/Tran Phu (4), 8.000.000, 4 Bed, 4 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS169', 'ms169', 'Villa Trần Phú Sát Biển - MS169', '19 Trần Phú', 'Villa Vũng Tàu sát biển. 4 phòng ngủ, 7 giường, 4 WC. Hồ bơi vô cực sát biển 40m2. Diện tích 350m2.', 4, 8000000, 11000000, 4, 4, 15, 'ACTIVE', true, NOW(), NOW());

-- MS163: Bai Truoc (2), 5.000.000, 7 Bed, 9 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS163', 'ms163', 'Villa Bãi Trước - MS163', 'Số 1 Phan Đình Phùng', 'Villa Vũng Tàu bãi trước. 7 phòng ngủ 13 giường, 9 WC. Hồ bơi ngoài trời 50m2. Rooftop siêu mát.', 2, 5000000, 7000000, 7, 9, 20, 'ACTIVE', false, NOW(), NOW());

-- MS122: Bai Sau (1), 4.000.000, 4 Bed, 5 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS122', 'ms122', 'Villa Nguyễn Hữu Tiến - MS122', 'A29 Nguyễn Hữu Tiến', 'Villa Vũng Tàu bãi sau. 4 phòng ngủ 4 giường, 5WC. Hồ bơi ngoài trời 30m2. Có Bi lắc.', 1, 4000000, 5500000, 4, 5, 15, 'ACTIVE', false, NOW(), NOW());

-- MS91: Bai Dau/Tran Phu (4), 7.000.000, 12 Bed, 14 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS91', 'ms91', 'Villa Trần Phú View Biển - MS91', '12/10B Trần Phú', 'VILLA Vũng Tàu view biển khu Trần Phú. 12 phòng ngủ 15 giường 14 WC. Phòng Cinema + Karaoke. Hồ bơi vô cực 90m2.', 4, 7000000, 10000000, 12, 14, 15, 'ACTIVE', true, NOW(), NOW());

-- MS33C: Bai Sau (1), 8.000.000, 5 Bed, 7 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS33C', 'ms33c', 'Villa Phan Huy Ích Mới - MS33C', '33C Phan Huy Ích', 'Villa bãi sau mới TOANH. 5 phòng ngủ, 8 giường, 7 WC. Hồ bơi 2 tầng 140 m2 (có thác nước).', 1, 8000000, 12000000, 5, 7, 18, 'ACTIVE', true, NOW(), NOW());

-- MS224: Bai Sau (1), 1.500.000, 4 Bed, 5 Bath
INSERT INTO properties (code, slug, name, address, description, location_id, price_weekday, price_weekend, bedroom_count, bathroom_count, max_guests, status, is_featured, created_at, updated_at)
VALUES 
('MS224', 'ms224', 'Homestay Nguyễn Hiền - MS224', '38A Nguyễn Hiền', 'Homestay Vũng Tàu bãi sau. 4 phòng ngủ 5 giường 5 WC. Ngay trung tâm Bãi Sau.', 1, 1500000, 2500000, 4, 5, 15, 'ACTIVE', false, NOW(), NOW());


-- INSERT AMENITIES MAPPING
-- Common Amenities: 1(Pool), 2(AC), 3(Wifi), 4(Fridge), 5(Washer), 6(Kitchen), 13(Parking)
-- Plus specific: 7(Karaoke), 8(Bida), 9(BBQ), 16(Garden), 14(Near Sea)

-- Insert for all (Basic)
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 2 FROM properties; -- AC
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 3 FROM properties; -- WiFi
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 4 FROM properties; -- Fridge
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 6 FROM properties; -- Kitchen
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 13 FROM properties; -- Parking

-- Pool (All except MS224)
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 1 FROM properties WHERE code != 'MS224';

-- Karaoke
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 7 FROM properties WHERE code IN ('MS233', 'MS215', 'MS211', 'MS207', 'MS208', 'MS197', 'MS199', 'MS183', 'MS177', 'MS169', 'MS163', 'MS122', 'MS91', 'MS33C');

-- Bida
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 8 FROM properties WHERE code IN ('MS233', 'MS215', 'MS211', 'MS207', 'MS208', 'MS197', 'MS199', 'MS183', 'MS177', 'MS169', 'MS163', 'MS91', 'MS33C');

-- BBQ
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 9 FROM properties WHERE code IN ('MS208', 'MS169', 'MS91', 'MS33C');

-- Near Sea
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 14 FROM properties WHERE code IN ('MS169', 'MS163', 'MS91', 'MS33C');

-- Sân vườn
INSERT INTO property_amenities (property_id, amenity_id)
SELECT id, 16 FROM properties WHERE code IN ('MS208', 'MS199', 'MS33C');
