-- ============================================
-- V7: Add Database Indexes for Performance Optimization
-- ============================================

DROP PROCEDURE IF EXISTS CreateIndexIfNotExists;

DELIMITER $$
CREATE PROCEDURE CreateIndexIfNotExists(IN tableName VARCHAR(255), IN indexName VARCHAR(255), IN columns VARCHAR(255))
BEGIN
    DECLARE indexCount INT;
    SELECT COUNT(*) INTO indexCount 
    FROM information_schema.statistics 
    WHERE table_name = tableName 
    AND index_name = indexName 
    AND table_schema = DATABASE();
    
    IF indexCount = 0 THEN
        SET @s = CONCAT('CREATE INDEX ', indexName, ' ON ', tableName, '(', columns, ')');
        PREPARE stmt FROM @s;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$
DELIMITER ;

-- ============================================
-- PROPERTIES TABLE INDEXES
-- ============================================

CALL CreateIndexIfNotExists('properties', 'idx_properties_status', 'status');
CALL CreateIndexIfNotExists('properties', 'idx_properties_location', 'location');
CALL CreateIndexIfNotExists('properties', 'idx_properties_price_weekday', 'price_weekday');
CALL CreateIndexIfNotExists('properties', 'idx_properties_price_weekend', 'price_weekend');
CALL CreateIndexIfNotExists('properties', 'idx_properties_bedroom_count', 'bedroom_count');
CALL CreateIndexIfNotExists('properties', 'idx_properties_standard_guests', 'standard_guests');
CALL CreateIndexIfNotExists('properties', 'idx_properties_max_guests', 'max_guests');
CALL CreateIndexIfNotExists('properties', 'idx_properties_status_location', 'status, location');
CALL CreateIndexIfNotExists('properties', 'idx_properties_status_price', 'status, price_weekday');
CALL CreateIndexIfNotExists('properties', 'idx_properties_created_at', 'created_at DESC');

-- ============================================
-- CUSTOMER_REQUESTS TABLE INDEXES
-- ============================================

CALL CreateIndexIfNotExists('customer_requests', 'idx_requests_status', 'status');
CALL CreateIndexIfNotExists('customer_requests', 'idx_requests_created_at', 'created_at DESC');
CALL CreateIndexIfNotExists('customer_requests', 'idx_requests_property_code', 'property_code');
CALL CreateIndexIfNotExists('customer_requests', 'idx_requests_status_created', 'status, created_at DESC');

-- ============================================
-- PROPERTY_AMENITIES TABLE INDEXES
-- ============================================

CALL CreateIndexIfNotExists('property_amenities', 'idx_property_amenities_amenity', 'amenity_id');

-- ============================================
-- PROPERTY_IMAGES TABLE INDEXES
-- ============================================

CALL CreateIndexIfNotExists('property_images', 'idx_property_images_property_id', 'property_id');
CALL CreateIndexIfNotExists('property_images', 'idx_property_images_thumbnail', 'property_id, is_thumbnail');

-- Clean up
DROP PROCEDURE IF EXISTS CreateIndexIfNotExists;

