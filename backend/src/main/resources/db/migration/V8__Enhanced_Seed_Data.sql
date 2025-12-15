-- =============================================
-- ENHANCED SEED DATA MIGRATION
-- =============================================
-- This migration adds comprehensive seed data:
-- - 20+ villa records with diverse locations, prices, and bedroom counts
-- - 15+ amenities with proper icons
-- - 10+ customer requests with varied statuses
-- - High-quality Unsplash images for all villas
-- =============================================

-- 1. DELETE EXISTING SEED DATA (preserve users and admin accounts)
DELETE FROM property_amenities;
DELETE FROM property_images;
DELETE FROM customer_requests WHERE id > 0;
DELETE FROM properties WHERE id > 0;
DELETE FROM amenities WHERE id > 0;

-- 2. CREATE ENHANCED AMENITIES (15+ items)
-- Basic amenities
INSERT INTO amenities (id, name, icon_code) VALUES 
(1, 'Hồ bơi', 'fa-swimming-pool'),
(2, 'Điều hòa', 'fa-snowflake'),
(3, 'WiFi', 'fa-wifi'),
(4, 'Tủ lạnh', 'fa-temperature-low'),
(5, 'Máy giặt', 'fa-tshirt'),
(6, 'Bếp đầy đủ', 'fa-utensils'),
-- Entertainment amenities
(7, 'Karaoke', 'fa-microphone'),
(8, 'Bida', 'fa-circle'),
(9, 'BBQ', 'fa-fire'),
(10, 'Smart TV', 'fa-tv'),
(11, 'Netflix', 'fa-film'),
-- Security & Convenience
(12, 'Camera an ninh', 'fa-video'),
(13, 'Bãi đỗ xe', 'fa-car'),
(14, 'Gần biển', 'fa-water'),
(15, 'View núi', 'fa-mountain'),
(16, 'Sân vườn', 'fa-tree');

-- 3. CREATE VILLA RECORDS (20+ villas)
-- Budget villas (2-4M VND/night, 2-3 bedrooms)
INSERT INTO properties (
    id, code, name, slug, description, address, area,
    price_weekday, price_weekend, standard_guests, max_guests,
    bedroom_count, bathroom_count, status, created_at, updated_at,
    map_url, facebook_link
) VALUES
-- Budget Category: Bãi Sau
(1, 'MS01', 'Villa Bãi Sau Cozy', 'villa-bai-sau-cozy-ms01', 
'Villa nhỏ xinh với thiết kế hiện đại, phù hợp cho gia đình nhỏ hoặc nhóm bạn. Gần biển Bãi Sau, đi bộ 5 phút. Không gian thoáng mát với sân vườn nhỏ.', 
'123 Thùy Vân, Phường Thắng Tam, Vũng Tàu', 'Bãi Sau',
2500000, 3750000, 6, 8, 2, 2, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau1', 'https://facebook.com/villa.ms01'),

(2, 'MS02', 'Villa Hồ Bơi Mini', 'villa-ho-boi-mini-ms02',
'Villa kinh tế với hồ bơi mini riêng biệt. Thiết kế đơn giản nhưng đầy đủ tiện nghi. Khu vực yên tĩnh, thích hợp nghỉ ngơi thư giãn cùng gia đình.',
'45 Lê Hồng Phong, Phường 2, Vũng Tàu', 'Bãi Sau',
3000000, 4500000, 8, 10, 3, 2, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau2', 'https://facebook.com/villa.ms02'),

(3, 'MS03', 'Villa Sân Vườn Xanh', 'villa-san-vuon-xanh-ms03',
'Villa với sân vườn rộng rãi, nhiều cây xanh. Không gian thoáng đãng, view đẹp. Phù hợp cho gia đình có trẻ nhỏ muốn không gian an toàn để vui chơi.',
'78 Trần Phú, Phường 1, Vũng Tàu', 'Trần Phú',
3500000, 5250000, 8, 12, 3, 3, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau3', 'https://facebook.com/villa.ms03'),

-- Budget Category: Long Cung
(4, 'MS04', 'Villa Long Cung View Biển', 'villa-long-cung-view-bien-ms04',
'Villa giá tốt tại Long Cung với view nhìn ra biển. Thiết kế đơn giản, sạch sẽ. Gần chợ và các tiện ích. Thích hợp cho nhóm bạn trẻ hoặc gia đình nhỏ.',
'12 Võ Thị Sáu, Long Cung, Vũng Tàu', 'Long Cung',
2800000, 4200000, 6, 9, 2, 2, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/longhai1', 'https://facebook.com/villa.ms04'),

-- Standard villas (4-7M VND/night, 3-5 bedrooms)
(5, 'MS05', 'Villa Luxury Bãi Trước', 'villa-luxury-bai-truoc-ms05',
'Villa cao cấp ngay trung tâm Bãi Trước. Thiết kế sang trọng với đầy đủ tiện nghi hiện đại. Hồ bơi riêng, karaoke, BBQ. View biển tuyệt đẹp từ tầng 2.',
'88 Trần Phú, Phường 1, Vũng Tàu', 'Bãi Trước',
5500000, 8250000, 12, 16, 4, 4, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau4', 'https://facebook.com/villa.ms05'),

(6, 'MS06', 'Villa Paradise Trần Phú', 'villa-paradise-tran-phu-ms06',
'Villa nghỉ dưỡng tại Trần Phú với không gian rộng rãi. Sân vườn đẹp, hồ bơi lớn. Gần biển chỉ 3 phút đi bộ. Phù hợp cho nhóm lớn hoặc team building.',
'234 Trần Phú, Phường 1, Vũng Tàu', 'Trần Phú',
6000000, 9000000, 15, 20, 5, 5, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/hotram1', 'https://facebook.com/villa.ms06'),
(7, 'MS07', 'Villa Modern Long Cung', 'villa-modern-long-cung-ms07',
'Villa hiện đại tại khu vực Long Cung yên tĩnh. Thiết kế tối giản nhưng sang trọng. Gần biển và các tiện ích. Thích hợp cho những ai muốn nghỉ dưỡng yên tĩnh.',
'56 Long Cung, Vũng Tàu', 'Long Cung',
4500000, 6750000, 10, 14, 4, 3, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/binhchau1', 'https://facebook.com/villa.ms07'),

(8, 'MS08', 'Villa Gia Đình Bãi Sau', 'villa-gia-dinh-bai-sau-ms08',
'Villa thiết kế theo phong cách gia đình ấm cúng. Có phòng bếp rộng, phòng khách lớn. Sân thượng view đẹp. Gần chợ và siêu thị, thuận tiện mua sắm.',
'167 Phan Chu Trinh, Phường 2, Vũng Tàu', 'Bãi Sau',
4800000, 7200000, 12, 15, 4, 4, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau5', 'https://facebook.com/villa.ms08'),

(9, 'MS09', 'Villa Sunset Bãi Trước', 'villa-sunset-bai-truoc-ms09',
'Villa view hoàng hôn tuyệt đẹp tại Bãi Trước. Thiết kế mở, tận dụng ánh sáng tự nhiên. Hồ bơi infinity nhìn ra biển. Không gian lý tưởng cho các buổi tiệc ngoài trời.',
'89 Nguyễn Thái Học, Bãi Trước, Vũng Tàu', 'Bãi Trước',
5200000, 7800000, 14, 18, 5, 4, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/longhai2', 'https://facebook.com/villa.ms09'),

(10, 'MS10', 'Villa Tropical Trần Phú', 'villa-tropical-tran-phu-ms10',
'Villa phong cách nhiệt đới với nhiều cây xanh. Thiết kế mở, gần gũi thiên nhiên. Có khu BBQ riêng biệt. Gần các tiện ích và bãi biển.',
'345 Trần Phú, Phường 1, Vũng Tàu', 'Trần Phú',
5800000, 8700000, 14, 18, 5, 5, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/hotram2', 'https://facebook.com/villa.ms10'),

-- Luxury villas (7-15M VND/night, 5-8 bedrooms)
(11, 'MS11', 'Villa Royal Bãi Trước', 'villa-royal-bai-truoc-ms11',
'Villa siêu sang trọng ngay mặt tiền biển Bãi Trước. Thiết kế đẳng cấp 5 sao với đầy đủ tiện nghi cao cấp. Hồ bơi vô cực, phòng gym, spa. Phục vụ tận tình 24/7.',
'1 Trần Phú, Phường 1, Vũng Tàu', 'Bãi Trước',
12000000, 18000000, 20, 30, 8, 8, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau6', 'https://facebook.com/villa.ms11'),

(12, 'MS12', 'Villa Ocean View Deluxe', 'villa-ocean-view-deluxe-ms12',
'Villa cao cấp với view 180 độ nhìn ra biển. Nội thất nhập khẩu, thiết kế hiện đại. Hồ bơi lớn, phòng karaoke chuyên nghiệp, bàn bida. Thích hợp cho sự kiện lớn.',
'234 Thùy Vân, Phường Thắng Tam, Vũng Tàu', 'Bãi Sau',
10000000, 15000000, 18, 25, 7, 7, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau7', 'https://facebook.com/villa.ms12'),

(13, 'MS13', 'Villa Beachfront Trần Phú', 'villa-beachfront-tran-phu-ms13',
'Villa mặt tiền biển Trần Phú với bãi cát riêng. Thiết kế resort mini với đầy đủ tiện nghi. Có nhân viên phục vụ, đầu bếp riêng. Trải nghiệm nghỉ dưỡng đẳng cấp.',
'1 Trần Phú, Phường 1, Vũng Tàu', 'Trần Phú',
13000000, 19500000, 22, 30, 8, 9, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/hotram3', 'https://facebook.com/villa.ms13'),
(14, 'MS14', 'Villa Penthouse Bãi Trước', 'villa-penthouse-bai-truoc-ms14',
'Villa penthouse cao cấp với view toàn cảnh thành phố và biển. Thiết kế sang trọng, nội thất cao cấp. Sân thượng rộng với jacuzzi. Dịch vụ butler 24/7.',
'456 Trần Phú, Phường 1, Vũng Tàu', 'Bãi Trước',
11000000, 16500000, 20, 28, 7, 8, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau8', 'https://facebook.com/villa.ms14'),

(15, 'MS15', 'Villa Garden Paradise', 'villa-garden-paradise-ms15',
'Villa với khu vườn nhiệt đới rộng 1000m2. Thiết kế hòa quyện với thiên nhiên. Hồ bơi tự nhiên, khu BBQ ngoài trời. Không gian lý tưởng cho tiệc cưới và sự kiện.',
'678 Lê Hồng Phong, Phường 2, Vũng Tàu', 'Bãi Sau',
9000000, 13500000, 16, 22, 6, 6, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau9', 'https://facebook.com/villa.ms15'),

(16, 'MS16', 'Villa Spa & Wellness', 'villa-spa-wellness-ms16',
'Villa cao cấp với khu spa và wellness center riêng. Phòng massage, sauna, steam room. Hồ bơi nước nóng. Thực đơn healthy food. Trải nghiệm nghỉ dưỡng chăm sóc sức khỏe.',
'123 Long Cung, Vũng Tàu', 'Long Cung',
10500000, 15750000, 18, 24, 7, 7, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/binhchau2', 'https://facebook.com/villa.ms16'),

-- Additional standard villas for diversity
(17, 'MS17', 'Villa Cozy Corner', 'villa-cozy-corner-ms17',
'Villa góc yên tĩnh với thiết kế ấm cúng. Phù hợp cho gia đình muốn không gian riêng tư. Có sân vườn nhỏ, hồ bơi mini. Gần các điểm tham quan du lịch.',
'234 Võ Thị Sáu, Long Cung, Vũng Tàu', 'Long Cung',
4200000, 6300000, 10, 13, 4, 3, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/longhai3', 'https://facebook.com/villa.ms17'),

(18, 'MS18', 'Villa Sunrise Beach', 'villa-sunrise-beach-ms18',
'Villa view bình minh tuyệt đẹp. Thiết kế hiện đại với ban công rộng. Gần biển, có lối đi riêng xuống bãi tắm. Không gian lý tưởng cho những ai yêu thích bình minh.',
'567 Trần Phú, Phường 1, Vũng Tàu', 'Trần Phú',
6500000, 9750000, 15, 20, 5, 5, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/hotram4', 'https://facebook.com/villa.ms18'),

(19, 'MS19', 'Villa Mountain View', 'villa-mountain-view-ms19',
'Villa view núi Minh Đạm độc đáo. Thiết kế rustic kết hợp hiện đại. Không gian yên tĩnh, thoáng mát. Thích hợp cho những ai muốn trải nghiệm khác biệt.',
'789 Long Cung, Vũng Tàu', 'Long Cung',
5000000, 7500000, 12, 16, 4, 4, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/binhchau3', 'https://facebook.com/villa.ms19'),

(20, 'MS20', 'Villa Family Resort', 'villa-family-resort-ms20',
'Villa thiết kế theo phong cách resort mini. Nhiều phòng ngủ, phòng khách rộng. Khu vui chơi trẻ em an toàn. Hồ bơi lớn. Phù hợp cho đại gia đình hoặc nhóm bạn đông.',
'890 Thùy Vân, Phường Thắng Tam, Vũng Tàu', 'Bãi Sau',
7500000, 11250000, 18, 24, 6, 6, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau10', 'https://facebook.com/villa.ms20'),
-- Additional luxury villas
(21, 'MS21', 'Villa Elite Oceanfront', 'villa-elite-oceanfront-ms21',
'Villa siêu cao cấp mặt tiền biển với thiết kế kiến trúc độc đáo. Hồ bơi vô cực, phòng gym, home theater. Dịch vụ concierge 24/7. Trải nghiệm nghỉ dưỡng đẳng cấp quốc tế.',
'12 Trần Phú, Phường 1, Vũng Tàu', 'Bãi Trước',
14000000, 21000000, 25, 35, 8, 9, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/vungtau11', 'https://facebook.com/villa.ms21'),

(22, 'MS22', 'Villa Boutique Trần Phú', 'villa-boutique-tran-phu-ms22',
'Villa boutique với thiết kế nghệ thuật độc đáo. Mỗi phòng có concept riêng. Hồ bơi nghệ thuật, khu vườn điêu khắc. Không gian sáng tạo cho những ai yêu nghệ thuật.',
'345 Trần Phú, Phường 1, Vũng Tàu', 'Trần Phú',
8500000, 12750000, 16, 22, 6, 6, 'ACTIVE', NOW(), NOW(),
'https://goo.gl/maps/longhai4', 'https://facebook.com/villa.ms22');

-- 4. ASSIGN AMENITIES TO VILLAS (property_amenities)
-- Budget villas: basic amenities (3-5 amenities)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
-- MS01: Basic amenities
(1, 2), (1, 3), (1, 6), (1, 14),
-- MS02: Basic + pool
(2, 1), (2, 2), (2, 3), (2, 6), (2, 13),
-- MS03: Basic + garden
(3, 2), (3, 3), (3, 6), (3, 16), (3, 13),
-- MS04: Basic + beach view
(4, 2), (4, 3), (4, 6), (4, 14);

-- Standard villas: basic + entertainment (5-7 amenities)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
-- MS05: Standard + entertainment
(5, 1), (5, 2), (5, 3), (5, 6), (5, 7), (5, 9), (5, 14),
-- MS06: Full standard
(6, 1), (6, 2), (6, 3), (6, 5), (6, 6), (6, 10), (6, 14), (6, 16),
-- MS07: Modern amenities
(7, 1), (7, 2), (7, 3), (7, 4), (7, 6), (7, 10), (7, 13),
-- MS08: Family friendly
(8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 6), (8, 13),
-- MS09: Beach villa
(9, 1), (9, 2), (9, 3), (9, 6), (9, 9), (9, 10), (9, 14),
-- MS10: Tropical
(10, 1), (10, 2), (10, 3), (10, 6), (10, 9), (10, 16), (10, 14);

-- Luxury villas: all amenities (7-10 amenities)
INSERT INTO property_amenities (property_id, amenity_id) VALUES
-- MS11: Royal - all amenities
(11, 1), (11, 2), (11, 3), (11, 4), (11, 5), (11, 6), (11, 7), (11, 8), (11, 10), (11, 12), (11, 13), (11, 14),
-- MS12: Deluxe
(12, 1), (12, 2), (12, 3), (12, 4), (12, 5), (12, 6), (12, 7), (12, 8), (12, 10), (12, 11), (12, 12), (12, 13),
-- MS13: Beachfront
(13, 1), (13, 2), (13, 3), (13, 4), (13, 5), (13, 6), (13, 9), (13, 10), (13, 11), (13, 12), (13, 13), (13, 14),
-- MS14: Penthouse
(14, 1), (14, 2), (14, 3), (14, 4), (14, 5), (14, 6), (14, 7), (14, 10), (14, 11), (14, 12), (14, 13), (14, 15),
-- MS15: Garden Paradise
(15, 1), (15, 2), (15, 3), (15, 4), (15, 5), (15, 6), (15, 9), (15, 10), (15, 12), (15, 13), (15, 16),
-- MS16: Spa & Wellness
(16, 1), (16, 2), (16, 3), (16, 4), (16, 5), (16, 6), (16, 10), (16, 11), (16, 12), (16, 13), (16, 15);
-- Additional standard villas
INSERT INTO property_amenities (property_id, amenity_id) VALUES
-- MS17: Cozy
(17, 1), (17, 2), (17, 3), (17, 6), (17, 13), (17, 16),
-- MS18: Sunrise
(18, 1), (18, 2), (18, 3), (18, 6), (18, 10), (18, 14), (18, 16),
-- MS19: Mountain View
(19, 1), (19, 2), (19, 3), (19, 6), (19, 9), (19, 15), (19, 16),
-- MS20: Family Resort
(20, 1), (20, 2), (20, 3), (20, 4), (20, 5), (20, 6), (20, 7), (20, 10), (20, 13),
-- MS21: Elite
(21, 1), (21, 2), (21, 3), (21, 4), (21, 5), (21, 6), (21, 7), (21, 8), (21, 10), (21, 11), (21, 12), (21, 13), (21, 14),
-- MS22: Boutique
(22, 1), (22, 2), (22, 3), (22, 4), (22, 5), (22, 6), (22, 10), (22, 11), (22, 12), (22, 13), (22, 16);

-- 5. CREATE HIGH-QUALITY IMAGES FROM UNSPLASH (3-5 images per villa)
-- Budget villas
INSERT INTO property_images (property_id, image_url, is_thumbnail) VALUES
-- MS01 (3 images)
(1, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80', 1),
(1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80', 0),
(1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80', 0),
-- MS02 (4 images)
(2, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80', 1),
(2, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80', 0),
(2, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 0),
(2, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80', 0),
-- MS03 (4 images)
(3, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1920&q=80', 1),
(3, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1920&q=80', 0),
(3, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=80', 0),
(3, 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920&q=80', 0),
-- MS04 (3 images)
(4, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80', 1),
(4, 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1920&q=80', 0),
(4, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&q=80', 0);

-- Standard villas
INSERT INTO property_images (property_id, image_url, is_thumbnail) VALUES
-- MS05 (5 images)
(5, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80', 1),
(5, 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1920&q=80', 0),
(5, 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=1920&q=80', 0),
(5, 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1920&q=80', 0),
(5, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80', 0),
-- MS06 (5 images)
(6, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80', 1),
(6, 'https://images.unsplash.com/photo-1582268611968-a0a22e8f6f0e?w=1920&q=80', 0),
(6, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80', 0),
(6, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80', 0),
(6, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80', 0),
-- MS07 (4 images)
(7, 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1920&q=80', 1),
(7, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 0),
(7, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80', 0),
(7, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1920&q=80', 0),
-- MS08 (4 images)
(8, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1920&q=80', 1),
(8, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=80', 0),
(8, 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920&q=80', 0),
(8, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80', 0),
-- MS09 (5 images)
(9, 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1920&q=80', 1),
(9, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&q=80', 0),
(9, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80', 0),
(9, 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1920&q=80', 0),
(9, 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=1920&q=80', 0),
-- MS10 (5 images)
(10, 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1920&q=80', 1),
(10, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80', 0),
(10, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80', 0),
(10, 'https://images.unsplash.com/photo-1582268611968-a0a22e8f6f0e?w=1920&q=80', 0),
(10, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80', 0);

-- Luxury villas
INSERT INTO property_images (property_id, image_url, is_thumbnail) VALUES
-- MS11 (5 images)
(11, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80', 1),
(11, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 0),
(11, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80', 0),
(11, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1920&q=80', 0),
(11, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1920&q=80', 0),
-- MS12 (5 images)
(12, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=80', 1),
(12, 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920&q=80', 0),
(12, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80', 0),
(12, 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1920&q=80', 0),
(12, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&q=80', 0),
-- MS13 (5 images)
(13, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80', 1),
(13, 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1920&q=80', 0),
(13, 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=1920&q=80', 0),
(13, 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1920&q=80', 0),
(13, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80', 0),
-- MS14 (5 images)
(14, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80', 1),
(14, 'https://images.unsplash.com/photo-1582268611968-a0a22e8f6f0e?w=1920&q=80', 0),
(14, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80', 0),
(14, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80', 0),
(14, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 0),
-- MS15 (5 images)
(15, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80', 1),
(15, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1920&q=80', 0),
(15, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1920&q=80', 0),
(15, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=80', 0),
(15, 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920&q=80', 0),
-- MS16 (5 images)
(16, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80', 1),
(16, 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1920&q=80', 0),
(16, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&q=80', 0),
(16, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80', 0),
(16, 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1920&q=80', 0),
-- MS17 (4 images)
(17, 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=1920&q=80', 1),
(17, 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1920&q=80', 0),
(17, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80', 0),
(17, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80', 0),
-- MS18 (5 images)
(18, 'https://images.unsplash.com/photo-1582268611968-a0a22e8f6f0e?w=1920&q=80', 1),
(18, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80', 0),
(18, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80', 0),
(18, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 0),
(18, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80', 0),
-- MS19 (4 images)
(19, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1920&q=80', 1),
(19, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1920&q=80', 0),
(19, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=80', 0),
(19, 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920&q=80', 0),
-- MS20 (5 images)
(20, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80', 1),
(20, 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1920&q=80', 0),
(20, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&q=80', 0),
(20, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80', 0),
(20, 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1920&q=80', 0),
-- MS21 (5 images)
(21, 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=1920&q=80', 1),
(21, 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1920&q=80', 0),
(21, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80', 0),
(21, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80', 0),
(21, 'https://images.unsplash.com/photo-1582268611968-a0a22e8f6f0e?w=1920&q=80', 0),
-- MS22 (5 images)
(22, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80', 1),
(22, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80', 0),
(22, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 0),
(22, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80', 0),
(22, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1920&q=80', 0);

-- 6. CREATE CUSTOMER REQUESTS (10+ requests with diverse statuses)
-- Note: After V6 refactor, customer_requests table has simplified schema
INSERT INTO customer_requests (
    customer_name, phone_number, note, property_code, status, admin_note, created_at
) VALUES
-- CLOSED requests (successfully handled)
('Nguyễn Văn An', '0909123456', 
'Cần villa gần biển cho gia đình 10 người, có hồ bơi và karaoke. Ngày 15-20/11.', 
'MS05', 'CLOSED', 'Đã book MS05 thành công, khách hài lòng.', '2025-11-01 10:30:00'),

('Trần Thị Bình', '0912345678', 
'Tìm villa cao cấp view biển, có đầy đủ tiện nghi cho nhóm 15 người. Dịp lễ 2/9.', 
'MS11', 'CLOSED', 'Đã xác nhận đặt MS11, đã thanh toán đặt cọc.', '2025-08-15 14:20:00'),

('Lê Hoàng Cường', '0923456789', 
'Villa giá rẻ cho nhóm bạn 8 người, gần trung tâm. Cuối tuần 10-12/10.', 
'MS02', 'CLOSED', 'Khách đã đặt MS02, check-out suôn sẻ.', '2025-09-28 09:15:00'),

('Phạm Thị Dung', '0934567890', 
'Cần villa có sân vườn rộng cho tổ chức sinh nhật, khoảng 20 người. Ngày 5/11.', 
'MS15', 'CLOSED', 'Tổ chức sinh nhật tại MS15 thành công.', '2025-10-20 16:45:00'),

-- CONTACTED requests (in progress)
('Hoàng Văn Em', '0945678901', 
'Tìm villa tại Hồ Tràm cho đại gia đình 25 người, dịp Tết Dương lịch. Cần có hồ bơi lớn và khu BBQ.', 
'MS13', 'CONTACTED', 'Đã gửi thông tin MS13, đang chờ khách xác nhận.', '2025-12-01 11:00:00'),

('Vũ Thị Phương', '0956789012', 
'Villa view biển cho honeymoon, 2 người, yên tĩnh và lãng mạn. Tuần sau 15-17/12.', 
'MS05', 'CONTACTED', 'Đã liên hệ, giới thiệu MS05 và MS14.', '2025-12-07 13:30:00'),

('Đỗ Minh Giang', '0967890123', 
'Cần villa cho team building công ty 30 người. Có phòng họp, karaoke, bida. Ngày 20-22/12.', 
'MS21', 'CONTACTED', 'Đã báo giá MS21, đang đàm phán.', '2025-12-05 08:45:00'),

-- NEW requests (not yet contacted)
('Bùi Thị Hà', '0978901234', 
'Villa giá tốt tại Long Hải, nhóm 12 người. Cần gần biển và có bếp đầy đủ. Cuối tuần 14-15/12.', 
NULL, 'NEW', NULL, '2025-12-06 15:20:00'),

('Ngô Văn Ích', '0989012345', 
'Tìm villa cao cấp tại Bình Châu gần suối nước nóng. Nhóm 18 người, ngày 25-27/12.', 
NULL, 'NEW', NULL, '2025-12-03 10:10:00'),

('Đinh Thị Kim', '0990123456', 
'Villa cho gia đình 15 người dịp Tết Nguyên Đán. Cần đầy đủ tiện nghi, gần trung tâm Vũng Tàu.', 
NULL, 'NEW', NULL, '2025-12-04 14:00:00'),

-- CANCELLED requests
('Trương Văn Long', '0901234567', 
'Villa budget cho sinh viên, nhóm 10 người. Chỉ cần sạch sẽ, có WiFi. Ngày 18-19/12.', 
'MS01', 'CANCELLED', 'Khách hủy do thay đổi kế hoạch.', '2025-12-06 09:30:00'),

('Lý Thị Mai', '0912345670', 
'Cần villa sang trọng cho kỷ niệm 10 năm ngày cưới. 2 người, có jacuzzi và view đẹp. Ngày 22-24/12.', 
'MS14', 'CANCELLED', 'Khách chọn resort khác.', '2025-12-05 16:00:00');

-- =============================================
-- MIGRATION COMPLETE
-- Summary:
-- - 22 villas created (MS01-MS22)
-- - 16 amenities created
-- - 12 customer requests created (4 CLOSED, 3 CONTACTED, 3 NEW, 2 CANCELLED)
-- - 100+ images added (3-5 per villa)
-- - Location distribution: Bãi Sau (6), Bãi Trước (6), Trần Phú (6), Long Cung (4)
-- - Price range: 2.5M - 21M VND
-- - Bedroom range: 2-8 bedrooms
-- =============================================
