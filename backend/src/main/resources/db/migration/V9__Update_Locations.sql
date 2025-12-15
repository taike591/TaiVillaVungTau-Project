-- 1. Cập nhật Bãi Sau
UPDATE properties 
SET location = 'BAI_SAU' 
WHERE area = 'Bãi Sau' AND location IS NULL;

-- 2. Cập nhật Bãi Trước
UPDATE properties 
SET location = 'BAI_TRUOC' 
WHERE area = 'Bãi Trước' AND location IS NULL;

-- 3. Cập nhật Long Cung
UPDATE properties 
SET location = 'LONG_CUNG' 
WHERE area = 'Long Cung' AND location IS NULL;

-- 4. Map Trần Phú sang Bãi Dâu (Vì đường Trần Phú chạy dọc Bãi Dâu)
UPDATE properties 
SET location = 'BAI_DAU' 
WHERE area = 'Trần Phú' AND location IS NULL;

-- 5. Cập nhật Trung Tâm (Các villa ở đường Lê Hồng Phong, Phan Chu Trinh)
-- MS02: 45 Lê Hồng Phong
UPDATE properties SET location = 'TRUNG_TAM' WHERE code = 'MS02';
-- MS15: 678 Lê Hồng Phong
UPDATE properties SET location = 'TRUNG_TAM' WHERE code = 'MS15';
-- MS08: 167 Phan Chu Trinh (Tuy ghi Bãi Sau nhưng gần trung tâm hơn)
UPDATE properties SET location = 'TRUNG_TAM' WHERE code = 'MS08';

-- 6. Fallback: Nếu còn sót, set về Bãi Sau (Default)
UPDATE properties SET location = 'BAI_SAU' WHERE location IS NULL;
