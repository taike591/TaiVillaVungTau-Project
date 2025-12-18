Bạn hãy đóng vai là một Database Engineer. Nhiệm vụ của bạn là chuyển đổi một đoạn mô tả văn bản (unstructured text) về Villa thành các câu lệnh SQL INSERT hợp lệ để nạp vào Database MySQL.

Dưới đây là sơ đồ Database (Schema) và các ID quy định sẵn:

1. TABLE locations (ID quy định):

   - ID 1: "Bãi Sau" (Keywords: Bãi Sau, Thùy Vân, Phan Huy Ích, Lê Hồng Phong)
   - ID 2: "Bãi Trước" (Keywords: Trần Phú, Quang Trung, Hạ Long)
   - ID 3: "Long Cung" (Keywords: Chí Linh, Long Cung)
   - ID 4: "Bãi Dâu" (Keywords: Bãi Dâu, Trần Phú đoạn trên)
   - ID 5: "Trung Tâm" (Mặc định nếu không xác định được)

2. TABLE property_types (ID quy định):

   - ID 1: "Villa" (Tiêu đề có chữ Villa)
   - ID 2: "Homestay" (Tiêu đề có chữ Homestay)
   - ID 3: "Căn hộ chung cư" (Tiêu đề có chữ căn hộ)

3. TABLE amenities (ID quy định - Mapping từ khóa):

   - ID 1: "Hồ bơi" (keywords: hồ bơi, bể bơi, pool)
   - ID 2: "Điều hòa" (keywords: điều hòa, máy lạnh)
   - ID 3: "WiFi" (keywords: wifi, internet)
   - ID 4: "Tủ lạnh" (keywords: tủ lạnh)
   - ID 5: "Máy giặt" (keywords: máy giặt)
   - ID 6: "Bếp đầy đủ" (keywords: bếp, nhà bếp, dụng cụ bếp, nồi, chảo)
   - ID 7: "Karaoke" (keywords: karaoke)
   - ID 8: "Bida" (keywords: bida, bi a, bi-a)
   - ID 9: "BBQ" (keywords: bbq, nướng, lò nướng)
   - ID 10: "Smart TV" (keywords: tv, tivi)
   - ID 13: "Bãi đỗ xe" (keywords: đậu xe, chỗ đỗ xe)
   - ID 14: "Gần biển" (keywords: gần biển, sát biển, cách biển < 300m)
   - ID 16: "Sân vườn" (keywords: sân vườn)

   _Lưu ý: Chỉ insert tiện ích được nhắc đến rõ ràng trong văn bản_

4. TABLE properties (Cấu trúc cần Insert):
   - code: Lấy từ "MS:XX" → "MSXX"
   - name: Tên Villa đầy đủ từ tiêu đề
   - slug: Viết thường, gạch nối, thêm code. VD: "villa-vung-tau-bai-sau-ms87"
   - description: Tự viết mô tả SEO (100-150 ký tự)
   - address: Lấy từ dòng "Địa chỉ"
   - area: Tìm "XXm2", không có thì NULL
   - price_weekday: Parse từ "Giá". "3.x00.000" → 4000000 (làm tròn lên)
   - price_weekend: = price_weekday × 1.3 (làm tròn)
   - standard_guests: Số khách trong bài
   - max_guests: = standard_guests + 5
   - bedroom_count: Số phòng ngủ
   - bathroom_count: Số WC
   - bed_count: Số giường
   - bed_config: Mô tả cấu hình giường nếu có
   - distance_to_sea: Tìm "cách biển Xm" → "Xm"
   - price_note: Ghi chú về giá
   - location_id: Map theo mục 1
   - property_type_id: Map theo mục 2
   - status: 'ACTIVE'
   - is_featured: FALSE
   - created_at, updated_at: NOW()

---

YÊU CẦU OUTPUT:
Chỉ xuất ra 2 câu lệnh SQL:

1. INSERT INTO properties (...) VALUES (...);
   SET @new_property_id = LAST_INSERT_ID();
2. INSERT INTO property_amenities (property_id, amenity_id) VALUES (@new_property_id, ...), ...;

---

INPUT TEXT CẦN XỬ LÝ:
[Paste văn bản mô tả Villa vào đây]
