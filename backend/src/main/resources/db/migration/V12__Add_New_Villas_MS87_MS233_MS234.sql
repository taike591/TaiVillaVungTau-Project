-- Migration V12: Thêm 3 căn villa mới MS87, MS234, MS233
-- Chú ý: Sử dụng bảng 'property_amenities' (số nhiều)

-- 1. MS87: Villa Bãi Sau - Phan Huy Ích
INSERT INTO properties (
    code, name, slug, description, address, area, location,
    price_weekday, price_weekend,
    bedroom_count, bathroom_count, standard_guests, max_guests,
    status, created_at, updated_at
) VALUES (
    'MS87',
    'Villa Bãi Sau - Phan Huy Ích',
    'villa-bai-sau-phan-huy-ich-ms87',
    'Villa MS87 tọa lạc tại 33 Phan Huy Ích, cách biển bãi sau chỉ 200m. Thiết kế hiện đại, hồ bơi rộng thoáng mát.',
    '33 Phan Huy Ích, Phường 2, TP. Vũng Tàu',
    'Bãi Sau',
    'BAI_SAU',
    3000000, 5000000, -- Giá ước tính
    8, 8, 15, 20,
    'ACTIVE', NOW(), NOW()
);

-- 2. MS234: Villa Lớn Phó Đức Chính
INSERT INTO properties (
    code, name, slug, description, address, area, location,
    price_weekday, price_weekend,
    bedroom_count, bathroom_count, standard_guests, max_guests,
    status, created_at, updated_at
) VALUES (
    'MS234',
    'Villa Lớn Phó Đức Chính',
    'villa-lon-pho-duc-chinh-ms234',
    'Villa khủng MS234 tại hẻm xe hơi Phó Đức Chính. 18 phòng ngủ phù hợp cho đoàn lớn. Đầy đủ tiện nghi karaoke, bida.',
    '27/6 Phó Đức Chính, Phường Thắng Tam, TP. Vũng Tàu',
    'Bãi Sau',
    'BAI_SAU',
    4000000, 7000000, -- Giá ước tính
    18, 18, 30, 50,
    'ACTIVE', NOW(), NOW()
);

-- 3. MS233: Villa Đặng Thùy Trâm
INSERT INTO properties (
    code, name, slug, description, address, area, location,
    price_weekday, price_weekend,
    bedroom_count, bathroom_count, standard_guests, max_guests,
    status, created_at, updated_at
) VALUES (
    'MS233',
    'Villa Đặng Thùy Trâm',
    'villa-dang-thuy-tram-ms233',
    'Villa MS233 nằm trong khu biệt thự yên tĩnh Đặng Thùy Trâm. Cách biển Long Cung 400m. Hồ bơi sân vườn rộng rãi.',
    'B5 Đặng Thuỳ Trâm, Phường 8, TP. Vũng Tàu',
    'Long Cung',
    'LONG_CUNG',
    5000000, 8000000, -- Giá ước tính
    8, 9, 20, 30,
    'ACTIVE', NOW(), NOW()
);

-- Liên kết Amenities (Tiện ích)
-- Giả sử ID: 1=Hồ bơi, 2=Karaoke, 3=Bida, 7=Bãi đậu xe

-- Lấy ID của các property vừa tạo
SET @ms87_id = (SELECT id FROM properties WHERE code = 'MS87');
SET @ms234_id = (SELECT id FROM properties WHERE code = 'MS234');
SET @ms233_id = (SELECT id FROM properties WHERE code = 'MS233');

-- MS87: Hồ bơi (1), Karaoke (2), Bida (3), Bãi đậu xe (7)
INSERT INTO property_amenities (property_id, amenity_id) VALUES (@ms87_id, 1), (@ms87_id, 2), (@ms87_id, 3), (@ms87_id, 7);

-- MS234: Hồ bơi (1), Karaoke (2), Bida (3), Bãi đậu xe (7)
INSERT INTO property_amenities (property_id, amenity_id) VALUES (@ms234_id, 1), (@ms234_id, 2), (@ms234_id, 3), (@ms234_id, 7);

-- MS233: Hồ bơi (1), Karaoke (2), Bida (3), Bãi đậu xe (7)
INSERT INTO property_amenities (property_id, amenity_id) VALUES (@ms233_id, 1), (@ms233_id, 2), (@ms233_id, 3), (@ms233_id, 7);
