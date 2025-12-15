-- Thêm các cột chi tiết phục vụ hiển thị giống Facebook
ALTER TABLE properties 
ADD COLUMN bed_count INT DEFAULT 0 COMMENT 'Tổng số lượng giường',
ADD COLUMN distance_to_sea VARCHAR(255) DEFAULT NULL COMMENT 'Khoảng cách đến biển (VD: 100m, Sát biển)',
ADD COLUMN price_note VARCHAR(255) DEFAULT NULL COMMENT 'Ghi chú giá (VD: Giá thay đổi theo mùa)';

-- Thêm các cột phục vụ SEO (Khi share link Zalo/Facebook)
ALTER TABLE properties
ADD COLUMN meta_title VARCHAR(255) DEFAULT NULL COMMENT 'Tiêu đề SEO (VD: Villa Bãi Sau 5PN - Giá Rẻ)',
ADD COLUMN meta_description VARCHAR(500) DEFAULT NULL COMMENT 'Mô tả SEO (Hiện khi share link)';

-- Cập nhật dữ liệu mẫu
UPDATE properties 
SET bed_count = 9,
    distance_to_sea = '100m',
    price_note = 'Giá thay đổi theo mùa, Lễ Tết vui lòng liên hệ',
    meta_title = 'Villa Bãi Sau MS44 - 5 Phòng Ngủ - Cách Biển 100m',
    meta_description = 'Villa MS44 Bãi Sau Vũng Tàu, 5PN, 9 giường, có Karaoke, Hồ bơi. Giá chỉ từ 3tr/đêm. Xem ngay!'
WHERE code = 'MS01';