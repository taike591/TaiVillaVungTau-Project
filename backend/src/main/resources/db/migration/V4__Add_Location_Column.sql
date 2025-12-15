-- 1. Thêm cột location (Cho phép NULL ban đầu để tránh lỗi dữ liệu cũ)
ALTER TABLE properties ADD COLUMN location VARCHAR(50) DEFAULT NULL;

-- 2. Cập nhật dữ liệu cho các Villa cũ (Dựa trên Code hoặc ID)
-- MS01 ở Bãi Sau
UPDATE properties SET location = 'BAI_SAU' WHERE code = 'MS01';

-- MS02 ở Bãi Trước
UPDATE properties SET location = 'BAI_TRUOC' WHERE code = 'MS02';

-- MS03 ở Lê Hồng Phong (Trung Tâm)
UPDATE properties SET location = 'TRUNG_TAM' WHERE code = 'MS03';