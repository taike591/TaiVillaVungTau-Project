-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: taivillavungtau
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `taivillavungtau`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `taivillavungtau` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `taivillavungtau`;

--
-- Table structure for table `amenities`
--

DROP TABLE IF EXISTS `amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amenities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `icon_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amenities`
--

LOCK TABLES `amenities` WRITE;
/*!40000 ALTER TABLE `amenities` DISABLE KEYS */;
INSERT INTO `amenities` VALUES (1,'Hồ bơi','fa-swimming-pool'),(2,'Điều hòa','fa-snowflake'),(3,'WiFi','fa-wifi'),(4,'Tủ lạnh','fa-temperature-low'),(5,'Máy giặt','fa-tshirt'),(6,'Bếp đầy đủ','fa-utensils'),(7,'Karaoke','fa-microphone'),(8,'Bida','fa-circle'),(9,'BBQ','fa-fire'),(10,'Smart TV','fa-tv'),(11,'Netflix','fa-film'),(12,'Camera an ninh','fa-video'),(13,'Bãi đỗ xe','fa-car'),(14,'Gần biển','fa-water'),(15,'View núi','fa-mountain'),(16,'Sân vườn','fa-tree');
/*!40000 ALTER TABLE `amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_requests`
--

DROP TABLE IF EXISTS `customer_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `note` text,
  `created_at` datetime(6) DEFAULT NULL,
  `property_code` varchar(50) DEFAULT NULL COMMENT 'Mã căn khách quan tâm',
  `status` varchar(20) DEFAULT 'NEW' COMMENT 'Trạng thái: NEW, CONTACTED, CLOSED, CANCELLED',
  `admin_note` text COMMENT 'Ghi chú nội bộ của Admin',
  PRIMARY KEY (`id`),
  KEY `idx_requests_status` (`status`),
  KEY `idx_requests_created_at` (`created_at` DESC),
  KEY `idx_requests_property_code` (`property_code`),
  KEY `idx_requests_status_created` (`status`,`created_at` DESC)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_requests`
--

LOCK TABLES `customer_requests` WRITE;
/*!40000 ALTER TABLE `customer_requests` DISABLE KEYS */;
INSERT INTO `customer_requests` VALUES (14,'Nguyễn Văn An','0909123456','Cần villa gần biển cho gia đình 10 người, có hồ bơi và karaoke. Ngày 15-20/11.','2025-11-01 10:30:00.000000','MS05','CLOSED','Đã book MS05 thành công, khách hài lòng.'),(15,'Trần Thị Bình','0912345678','Tìm villa cao cấp view biển, có đầy đủ tiện nghi cho nhóm 15 người. Dịp lễ 2/9.','2025-08-15 14:20:00.000000','MS11','CLOSED','Đã xác nhận đặt MS11, đã thanh toán đặt cọc.'),(16,'Lê Hoàng Cường','0923456789','Villa giá rẻ cho nhóm bạn 8 người, gần trung tâm. Cuối tuần 10-12/10.','2025-09-28 09:15:00.000000','MS02','CLOSED','Khách đã đặt MS02, check-out suôn sẻ.'),(17,'Phạm Thị Dung','0934567890','Cần villa có sân vườn rộng cho tổ chức sinh nhật, khoảng 20 người. Ngày 5/11.','2025-10-20 16:45:00.000000','MS15','CLOSED','Tổ chức sinh nhật tại MS15 thành công.'),(18,'Hoàng Văn Em','0945678901','Tìm villa tại Hồ Tràm cho đại gia đình 25 người, dịp Tết Dương lịch. Cần có hồ bơi lớn và khu BBQ.','2025-12-01 11:00:00.000000','MS13','CONTACTED','Đã gửi thông tin MS13, đang chờ khách xác nhận.'),(19,'Vũ Thị Phương','0956789012','Villa view biển cho honeymoon, 2 người, yên tĩnh và lãng mạn. Tuần sau 15-17/12.','2025-12-07 13:30:00.000000','MS05','CONTACTED','Đã liên hệ, giới thiệu MS05 và MS14.'),(20,'Đỗ Minh Giang','0967890123','Cần villa cho team building công ty 30 người. Có phòng họp, karaoke, bida. Ngày 20-22/12.','2025-12-05 08:45:00.000000','MS21','CONTACTED','Đã báo giá MS21, đang đàm phán.'),(21,'Bùi Thị Hà','0978901234','Villa giá tốt tại Long Hải, nhóm 12 người. Cần gần biển và có bếp đầy đủ. Cuối tuần 14-15/12.','2025-12-06 15:20:00.000000',NULL,'CONTACTED',NULL),(22,'Ngô Văn Ích','0989012345','Tìm villa cao cấp tại Bình Châu gần suối nước nóng. Nhóm 18 người, ngày 25-27/12.','2025-12-03 10:10:00.000000',NULL,'NEW',NULL),(23,'Đinh Thị Kim','0990123456','Villa cho gia đình 15 người dịp Tết Nguyên Đán. Cần đầy đủ tiện nghi, gần trung tâm Vũng Tàu.','2025-12-04 14:00:00.000000',NULL,'NEW',NULL),(24,'Trương Văn Long','0901234567','Villa budget cho sinh viên, nhóm 10 người. Chỉ cần sạch sẽ, có WiFi. Ngày 18-19/12.','2025-12-06 09:30:00.000000','MS01','CANCELLED','Khách hủy do thay đổi kế hoạch.'),(25,'Lý Thị Mai','0912345670','Cần villa sang trọng cho kỷ niệm 10 năm ngày cưới. 2 người, có jacuzzi và view đẹp. Ngày 22-24/12.','2025-12-05 16:00:00.000000','MS14','CANCELLED','Khách chọn resort khác.'),(26,'Tai','0868947734','15 người','2025-12-12 08:25:19.527197',NULL,'NEW',NULL),(27,'taine','0907736247','12398213021093','2025-12-12 08:37:37.634658','MS215','NEW',NULL),(28,'aaaa','0865371273',NULL,'2025-12-12 09:17:28.060784','MS215','NEW',NULL),(29,'Tai','08665316616','sakjdhkjsakjdsa','2025-12-12 09:23:49.191179',NULL,'NEW',NULL),(30,'asdsadasd','0986612361','ashdgahgdsad','2025-12-12 09:26:52.901656',NULL,'NEW',NULL),(31,'taiaksakdsaj','0846512737','aydgsajdsahgd','2025-12-12 09:27:59.629723',NULL,'NEW',NULL),(32,'asdsadsa','0866727651','sasadsad','2025-12-12 09:33:26.956066',NULL,'NEW',NULL),(33,'Tai','0917263174','asjdhaskjdsakjdkhdsa','2025-12-12 09:34:39.647878',NULL,'NEW',NULL);
/*!40000 ALTER TABLE `customer_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','Init Schema','SQL','V1__Init_Schema.sql',2120287373,'root','2025-12-01 05:06:03',207,1),(2,'2','Update User Table','SQL','V2__Update_User_Table.sql',-1687311962,'root','2025-12-01 05:06:04',110,1),(3,'3','Seed Data','SQL','V3__Seed_Data.sql',-1661813854,'root','2025-12-01 05:06:04',34,1),(4,'4','Add Location Column','SQL','V4__Add_Location_Column.sql',-701637329,'root','2025-12-01 05:06:04',35,1),(5,'5','Add Detail Columns','SQL','V5__Add_Detail_Columns.sql',448906888,'root','2025-12-01 05:06:04',51,1),(6,'6','Refactor CustomerRequest','SQL','V6__Refactor_CustomerRequest.sql',-391978605,'root','2025-12-01 05:06:04',58,1),(7,'7','Add Database Indexes','SQL','V7__Add_Database_Indexes.sql',1061426941,'root','2025-12-01 05:06:05',842,1),(8,'8','Enhanced Seed Data','SQL','V8__Enhanced_Seed_Data.sql',-265041661,'root','2025-12-09 03:02:53',44,1),(9,'9','Update Locations','SQL','V9__Update_Locations.sql',785606762,'root','2025-12-09 11:12:09',38,1),(10,'11','Add Is Featured Column','SQL','V11__Add_Is_Featured_Column.sql',-1125434355,'root','2025-12-09 16:39:38',88,1),(11,'12','Add New Villas MS87 MS233 MS234','SQL','V12__Add_New_Villas_MS87_MS233_MS234.sql',1730046031,'root','2025-12-09 16:47:09',42,1),(12,'13','Add Locations And Property Types','SQL','V13__Add_Locations_And_Property_Types.sql',103209341,'root','2025-12-09 17:23:36',567,1),(13,'14','Insert Real Properties','SQL','V14__Insert_Real_Properties.sql',139336915,'root','2025-12-12 03:07:36',106,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Bãi Sau','bai-sau','Khu vực Bãi Sau - biển đẹp','2025-12-09 17:23:36'),(2,'Bãi Trước','bai-truoc','Khu vực Bãi Trước - trung tâm','2025-12-09 17:23:36'),(3,'Long Cung','long-cung','Khu vực Long Cung - Chí Linh','2025-12-09 17:23:36'),(4,'Bãi Dâu','bai-dau','Khu vực Bãi Dâu - yên tĩnh','2025-12-09 17:23:36'),(5,'Trung Tâm','trung-tam','Trung tâm thành phố Vũng Tàu','2025-12-09 17:23:36');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `address` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `map_url` text,
  `price_weekday` decimal(19,2) DEFAULT NULL,
  `price_weekend` decimal(19,2) DEFAULT NULL,
  `standard_guests` int DEFAULT NULL,
  `max_guests` int DEFAULT NULL,
  `bedroom_count` int DEFAULT NULL,
  `bathroom_count` int DEFAULT NULL,
  `facebook_link` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `bed_count` int DEFAULT '0' COMMENT 'Tổng số lượng giường',
  `distance_to_sea` varchar(255) DEFAULT NULL COMMENT 'Khoảng cách đến biển (VD: 100m, Sát biển)',
  `price_note` varchar(255) DEFAULT NULL COMMENT 'Ghi chú giá (VD: Giá thay đổi theo mùa)',
  `meta_title` varchar(255) DEFAULT NULL COMMENT 'Tiêu đề SEO (VD: Villa Bãi Sau 5PN - Giá Rẻ)',
  `meta_description` varchar(500) DEFAULT NULL COMMENT 'Mô tả SEO (Hiện khi share link)',
  `bed_config` varchar(255) DEFAULT NULL COMMENT 'Chi tiết giường (VD: 1 đơn + 4 đôi)',
  `is_featured` tinyint(1) DEFAULT '0',
  `location_id` bigint DEFAULT NULL,
  `property_type_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_properties_status` (`status`),
  KEY `idx_properties_location` (`location`),
  KEY `idx_properties_price_weekday` (`price_weekday`),
  KEY `idx_properties_price_weekend` (`price_weekend`),
  KEY `idx_properties_bedroom_count` (`bedroom_count`),
  KEY `idx_properties_standard_guests` (`standard_guests`),
  KEY `idx_properties_max_guests` (`max_guests`),
  KEY `idx_properties_status_location` (`status`,`location`),
  KEY `idx_properties_status_price` (`status`,`price_weekday`),
  KEY `idx_properties_created_at` (`created_at` DESC),
  KEY `fk_property_location` (`location_id`),
  KEY `fk_property_type` (`property_type_id`),
  CONSTRAINT `fk_property_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`),
  CONSTRAINT `fk_property_type` FOREIGN KEY (`property_type_id`) REFERENCES `property_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,'MS233','Villa Bãi Sau - MS233','villa-bai-sau---ms233-ms233','Villa Vũng Tàu bãi sau. 8 phòng ngủ (5 đơn - 2 đôi - 1 ba ) - 12 giường - 11 WC. Hồ bơi nước mặn 40m2. Cách biển 350m.','B5 Đặng Thuỳ Trâm','','',5000000.00,7000000.00,15,15,8,11,'','ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:36:01.363800',NULL,11,'','',NULL,NULL,'',1,1,NULL),(2,'MS215','Villa Bãi Sau - MS215','villa-bai-sau---ms215-ms215','Khai trương Villa Vũng Tàu bãi sau. 6 phòng ngủ - 6 giường - 7 WC - 4 bồn tắm. Nội thất mới 100%. Hồ bơi rộng 57m2.','15 Trần Thượng Xuyên','','',6000000.00,8000000.00,13,15,6,7,'','ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:36:57.331188',NULL,10,'','',NULL,NULL,'',1,1,NULL),(3,'MS211','Villa Bãi Sau - MS211','villa-bai-sau---ms211-ms211','Villa Vũng Tàu bãi sau. 6 phòng ngủ 8 giường. Hồ bơi sục 60m2. Gần chợ hải sản.','60D Trần Bình Trọng','','',4000000.00,6000000.00,1,15,6,7,'','ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 06:58:40.871097',NULL,1,'','',NULL,NULL,'',1,1,1),(4,'MS207','Villa Trần Phú - MS207','ms207','Villa Vũng Tàu khu Trần Phú. 5 phòng ngủ 8 giường. Hồ bơi muối ngoài trời 40m2. Gần Gành Hào.','54/1B Trần Phú',NULL,NULL,3000000.00,5000000.00,NULL,15,5,6,NULL,'ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:07:36.000000',NULL,0,NULL,NULL,NULL,NULL,NULL,0,4,NULL),(5,'MS208','Villa Nguyễn Tuân - MS208','ms208','Khai trương Villa Vũng Tàu bãi sau. 7 phòng ngủ - 16 giường - 8 WC. Hồ Bơi 150m2 Full Đá Mài. Sân vườn BBQ rộng.','06 Nguyễn Tuân',NULL,NULL,6000000.00,8500000.00,NULL,20,7,8,NULL,'ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:26:09.379579',NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,NULL),(6,'MS197','Villa Nguyễn Hữu Tiến - MS197','villa-nguyen-huu-tien---ms197-ms197','Khai trương Villa Vũng Tàu bãi sau. 6 phòng ngủ - 8 giường - 7 WC. Hồ bơi 35m2. Nội thất hiện đại.','24 Nguyễn Hữu Tiến','','',5000000.00,7000000.00,15,15,6,7,'','ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:20:06.984489',NULL,10,'','',NULL,NULL,'',1,1,NULL),(7,'MS199','Villa Long Cung - MS199','ms199','Khai trương Villa Vũng Tàu Long Cung. 4 phòng ngủ - 4 giường - 5 WC. Hồ bơi 56m2 hồ tràn. Sân vườn pickleball.','B2.50 Khu Thanh Bình',NULL,NULL,3000000.00,5000000.00,NULL,14,4,5,NULL,'ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:43:46.151552',NULL,0,NULL,NULL,NULL,NULL,NULL,0,3,NULL),(8,'MS183','Villa Long Cung - MS183','villa-long-cung---ms183-ms183','VILLA Vũng Tàu khu Long Cung. 6 phòng ngủ 10 giường. Hồ bơi ngoài trời 80m2. Cách bãi tắm 3p đi bộ.','16 Hà Huy Tập','','',5000000.00,7500000.00,16,20,6,7,'','ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:44:44.895257',NULL,8,'','',NULL,NULL,'',1,3,NULL),(9,'MS177','Villa Võ Thị Sáu - MS177','ms177','Villa Vũng Tàu bãi sau. 7 phòng ngủ, 9 giường, 6 WC. Hồ bơi ngoài trời 50m2. Ngay khu du lịch sầm uất.','185 Võ Thị Sáu',NULL,NULL,4000000.00,6000000.00,NULL,15,7,6,NULL,'ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:07:36.000000',NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,NULL),(10,'MS169','Villa Trần Phú Sát Biển - MS169','ms169','Villa Vũng Tàu sát biển. 4 phòng ngủ, 7 giường, 4 WC. Hồ bơi vô cực sát biển 40m2. Diện tích 350m2.','19 Trần Phú',NULL,NULL,8000000.00,11000000.00,NULL,15,4,4,NULL,'ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:07:36.000000',NULL,0,NULL,NULL,NULL,NULL,NULL,1,4,NULL),(11,'MS163','Villa Bãi Trước - MS163','ms163','Villa Vũng Tàu bãi trước. 7 phòng ngủ 13 giường, 9 WC. Hồ bơi ngoài trời 50m2. Rooftop siêu mát.','Số 1 Phan Đình Phùng',NULL,NULL,5000000.00,7000000.00,NULL,20,7,9,NULL,'ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:07:36.000000',NULL,0,NULL,NULL,NULL,NULL,NULL,0,2,NULL),(12,'MS122','Villa Nguyễn Hữu Tiến - MS122','ms122','Villa Vũng Tàu bãi sau. 4 phòng ngủ 4 giường, 5WC. Hồ bơi ngoài trời 30m2. Có Bi lắc.','A29 Nguyễn Hữu Tiến',NULL,NULL,4000000.00,5500000.00,NULL,15,4,5,NULL,'ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:07:36.000000',NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,NULL),(13,'MS91','Villa Trần Phú View Biển - MS91','ms91','VILLA Vũng Tàu view biển khu Trần Phú. 12 phòng ngủ 15 giường 14 WC. Phòng Cinema + Karaoke. Hồ bơi vô cực 90m2.','12/10B Trần Phú',NULL,NULL,7000000.00,10000000.00,NULL,15,12,14,NULL,'ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 03:07:36.000000',NULL,0,NULL,NULL,NULL,NULL,NULL,1,4,NULL),(14,'MS33C','Villa Phan Huy Ích Mới - MS33C','villa-phan-huy-ich-moi---ms33c-ms33c','Villa bãi sau mới TOANH. 5 phòng ngủ, 8 giường, 7 WC. Hồ bơi 2 tầng 140 m2 (có thác nước).','33C Phan Huy Ích','','',8000000.00,12000000.00,1,18,5,7,'','ACTIVE','2025-12-12 03:07:36.000000','2025-12-12 06:51:31.592120',NULL,1,'','',NULL,NULL,'',1,1,1),(15,'MS224','Homestay Nguyễn Hiền - MS224','ms224','Homestay Vũng Tàu bãi sau. 4 phòng ngủ 5 giường 5 WC. Ngay trung tâm Bãi Sau.','38A Nguyễn Hiền',NULL,NULL,1500000.00,2500000.00,NULL,15,4,5,NULL,'DELETED','2025-12-12 03:07:36.000000','2025-12-12 06:51:35.062516',NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,NULL);
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_amenities`
--

DROP TABLE IF EXISTS `property_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_amenities` (
  `property_id` bigint NOT NULL,
  `amenity_id` bigint NOT NULL,
  PRIMARY KEY (`property_id`,`amenity_id`),
  KEY `idx_property_amenities_amenity` (`amenity_id`),
  CONSTRAINT `property_amenities_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`),
  CONSTRAINT `property_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_amenities`
--

LOCK TABLES `property_amenities` WRITE;
/*!40000 ALTER TABLE `property_amenities` DISABLE KEYS */;
INSERT INTO `property_amenities` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(1,3),(2,3),(3,3),(4,3),(5,3),(6,3),(7,3),(8,3),(9,3),(10,3),(11,3),(12,3),(13,3),(14,3),(15,3),(1,4),(2,4),(3,4),(4,4),(5,4),(6,4),(7,4),(8,4),(9,4),(10,4),(11,4),(12,4),(13,4),(14,4),(15,4),(1,6),(2,6),(3,6),(4,6),(5,6),(6,6),(7,6),(8,6),(9,6),(10,6),(11,6),(12,6),(13,6),(14,6),(15,6),(1,7),(2,7),(3,7),(4,7),(5,7),(6,7),(7,7),(8,7),(9,7),(10,7),(11,7),(12,7),(13,7),(14,7),(1,8),(2,8),(3,8),(4,8),(5,8),(6,8),(7,8),(8,8),(9,8),(10,8),(11,8),(13,8),(14,8),(5,9),(10,9),(13,9),(14,9),(1,13),(2,13),(3,13),(4,13),(5,13),(6,13),(7,13),(8,13),(9,13),(10,13),(11,13),(12,13),(13,13),(14,13),(15,13),(10,14),(11,14),(13,14),(14,14),(5,16),(7,16),(14,16);
/*!40000 ALTER TABLE `property_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_images`
--

DROP TABLE IF EXISTS `property_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `property_id` bigint DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_thumbnail` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_property_images_property_id` (`property_id`),
  KEY `idx_property_images_thumbnail` (`property_id`,`is_thumbnail`),
  CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=337 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_images`
--

LOCK TABLES `property_images` WRITE;
/*!40000 ALTER TABLE `property_images` DISABLE KEYS */;
INSERT INTO `property_images` VALUES (307,6,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765509588/taivilla/bn963fzyhfrt9o0jkkp8.jpg',0),(308,6,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765509588/taivilla/ncsgwx3oegcufvncgnup.jpg',0),(309,6,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765509589/taivilla/epvpghdvemogdxxylgpi.jpg',0),(310,6,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765509589/taivilla/fjnbyrn2n0o88cqw0jol.jpg',0),(311,6,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765509589/taivilla/wlgbbohcet3vbkrizd86.jpg',1),(312,14,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510469/taivilla/ect7bgircqclrjfnwqur.jpg',1),(313,14,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510469/taivilla/l6uudot6x7bm43kevjyo.jpg',0),(314,14,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510474/taivilla/bpl4vnejqljcqajvehin.jpg',0),(315,14,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510474/taivilla/wezlnvbq5bn642oxudwq.jpg',0),(316,14,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510475/taivilla/ibey4xlbzkymng8jvqtl.jpg',0),(317,1,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510553/taivilla/esy04yomcp36scdznx4i.jpg',1),(318,1,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510553/taivilla/zfpfynylnzqprnzk3tjp.jpg',0),(319,1,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510559/taivilla/lvyrs3dma1tcovnnqkjk.jpg',0),(320,1,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510559/taivilla/inouak7bfs9k4orqarsk.jpg',0),(321,1,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510559/taivilla/nb5updkwxxgkvp2wwqsn.jpg',0),(322,2,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510615/taivilla/xq0tcsof3hvnwhkijwcu.jpg',1),(323,2,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510615/taivilla/t2oc1c6fd68axjhpwkch.jpg',0),(324,2,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510615/taivilla/ueujsdsfragzmhtexyea.jpg',0),(325,2,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510615/taivilla/j7wzzzkj4dcsoj64zc4r.jpg',0),(326,2,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765510615/taivilla/b0o11zqjh4f694syr2jo.jpg',0),(327,8,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765511078/taivilla/eoynkh2uaxo5c29zkmu3.jpg',1),(328,8,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765511077/taivilla/z0bkwrc7vlxdurwu98zd.jpg',0),(329,8,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765511077/taivilla/s9fghjoiisgpoqjpiicn.jpg',0),(330,8,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765511082/taivilla/qo0syx6s284ayqr2w3vf.jpg',0),(331,8,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765511083/taivilla/l1yguvsaswqk6olqgybg.jpg',0),(332,3,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765522664/taivilla/epwkhivrwwvj3xuk45vn.jpg',1),(333,3,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765522664/taivilla/jfojusrn4ysacav6gsfk.jpg',0),(334,3,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765522665/taivilla/c7zgbeducs5eu6m1mtce.jpg',0),(335,3,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765522665/taivilla/tsfyusjzcwpzozubo8la.jpg',0),(336,3,'https://res.cloudinary.com/dyzyev4af/image/upload/v1765522665/taivilla/muypdcwhp2iubo1hw1gr.jpg',0);
/*!40000 ALTER TABLE `property_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_types`
--

DROP TABLE IF EXISTS `property_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `icon_code` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_types`
--

LOCK TABLES `property_types` WRITE;
/*!40000 ALTER TABLE `property_types` DISABLE KEYS */;
INSERT INTO `property_types` VALUES (1,'Villa','villa','home','2025-12-09 17:23:36'),(2,'Homestay','homestay','house','2025-12-09 17:23:36'),(3,'Căn Hộ','can-ho','building','2025-12-09 17:23:36'),(4,'Nhà Phố','nha-pho','city','2025-12-09 17:23:36');
/*!40000 ALTER TABLE `property_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2a$10$kQQAaLdUW95sGizRkL9e7.gs0MXiEhmy5.ZDD6BUn6v.QjoY/luS6','Admin Dep Trai','ADMIN',NULL,NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15  3:58:08
