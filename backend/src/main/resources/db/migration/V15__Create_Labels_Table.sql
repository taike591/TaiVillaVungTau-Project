-- V15: Create labels table and property_labels join table
-- Labels are property highlights like "Sát biển", "View biển", "Có hồ bơi riêng"

CREATE TABLE labels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7),
    icon_code VARCHAR(50)
);

CREATE TABLE property_labels (
    property_id BIGINT NOT NULL,
    label_id BIGINT NOT NULL,
    PRIMARY KEY (property_id, label_id),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX idx_property_labels_property ON property_labels(property_id);
CREATE INDEX idx_property_labels_label ON property_labels(label_id);

-- Seed initial labels with attractive colors
INSERT INTO labels (name, color, icon_code) VALUES
('Sát biển', '#0EA5E9', 'waves'),
('View biển', '#3B82F6', 'eye'),
('Có hồ bơi riêng', '#14B8A6', 'droplets'),
('Mới', '#F59E0B', 'sparkles'),
('Yên tĩnh', '#10B981', 'volume-x'),
('Gần trung tâm', '#EF4444', 'map-pin'),
('View núi', '#8B5CF6', 'mountain'),
('Có sân vườn', '#22C55E', 'trees');
