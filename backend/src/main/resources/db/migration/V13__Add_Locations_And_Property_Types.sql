-- V13: Add Location and Property Type management tables
-- This migration converts hardcoded LocationType enum to dynamic tables

-- 1. Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create property_types table  
CREATE TABLE IF NOT EXISTS property_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    icon_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed initial locations (from current enum)
INSERT INTO locations (name, slug, description) VALUES
('Bãi Sau', 'bai-sau', 'Khu vực Bãi Sau - biển đẹp'),
('Bãi Trước', 'bai-truoc', 'Khu vực Bãi Trước - trung tâm'),
('Long Cung', 'long-cung', 'Khu vực Long Cung - Chí Linh'),
('Bãi Dâu', 'bai-dau', 'Khu vực Bãi Dâu - yên tĩnh'),
('Trung Tâm', 'trung-tam', 'Trung tâm thành phố Vũng Tàu');

-- 4. Seed initial property types
INSERT INTO property_types (name, slug, icon_code) VALUES
('Villa', 'villa', 'home'),
('Homestay', 'homestay', 'house'),
('Căn Hộ', 'can-ho', 'building'),
('Nhà Phố', 'nha-pho', 'city');

-- 5. Add location_id and property_type_id columns to properties
ALTER TABLE properties ADD COLUMN location_id BIGINT;
ALTER TABLE properties ADD COLUMN property_type_id BIGINT;

-- 6. Add foreign keys
ALTER TABLE properties 
ADD CONSTRAINT fk_property_location FOREIGN KEY (location_id) REFERENCES locations(id);

ALTER TABLE properties 
ADD CONSTRAINT fk_property_type FOREIGN KEY (property_type_id) REFERENCES property_types(id);

-- 7. Migrate existing data (map old enum to new location_id)
UPDATE properties SET location_id = 1 WHERE location = 'BAI_SAU';
UPDATE properties SET location_id = 2 WHERE location = 'BAI_TRUOC';
UPDATE properties SET location_id = 3 WHERE location = 'LONG_CUNG';
UPDATE properties SET location_id = 4 WHERE location = 'BAI_DAU';
UPDATE properties SET location_id = 5 WHERE location = 'TRUNG_TAM';

-- 8. Set default property type to Villa for existing properties
UPDATE properties SET property_type_id = 1 WHERE property_type_id IS NULL;

-- 9. Keep old location column for now (can drop later after verifying migration)
-- ALTER TABLE properties DROP COLUMN location;
