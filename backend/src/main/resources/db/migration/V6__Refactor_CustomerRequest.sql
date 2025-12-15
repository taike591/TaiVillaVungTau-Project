-- 1. Bổ sung cột cấu hình giường cho bảng Properties (Bị thiếu ở V5)
ALTER TABLE properties 
ADD COLUMN bed_config VARCHAR(255) DEFAULT NULL COMMENT 'Chi tiết giường (VD: 1 đơn + 4 đôi)';

-- 2. Tinh gọn bảng Customer Requests (Biến thành CRM Lead)
-- Xóa các cột chi tiết không cần thiết ở giai đoạn đầu
ALTER TABLE customer_requests 
DROP COLUMN check_in_date,
DROP COLUMN check_out_date,
DROP COLUMN adults,
DROP COLUMN children,
DROP COLUMN budget,
DROP COLUMN is_resolved;

-- Thêm các cột quản lý trạng thái và ghi chú cho Admin
ALTER TABLE customer_requests
ADD COLUMN property_code VARCHAR(50) DEFAULT NULL COMMENT 'Mã căn khách quan tâm',
ADD COLUMN status VARCHAR(20) DEFAULT 'NEW' COMMENT 'Trạng thái: NEW, CONTACTED, CLOSED, CANCELLED',
ADD COLUMN admin_note TEXT DEFAULT NULL COMMENT 'Ghi chú nội bộ của Admin';

-- 3. Cập nhật dữ liệu mẫu cho cột mới bed_config
UPDATE properties 
SET bed_config = '1 đơn + 4 đôi'
WHERE code = 'MS01';