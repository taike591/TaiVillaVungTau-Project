/**
 * AmenitiesGrid Component Examples
 * 
 * This file demonstrates various usage scenarios for the AmenitiesGrid component.
 * These examples are for documentation purposes and testing.
 */

import { AmenitiesGrid } from './AmenitiesGrid';

// Example 1: Basic amenities without categories
export function BasicAmenitiesExample() {
  const basicAmenities = [
    { id: 1, name: 'WiFi miễn phí' },
    { id: 2, name: 'Điều hòa' },
    { id: 3, name: 'Bể bơi riêng' },
    { id: 4, name: 'Bãi đậu xe miễn phí' },
    { id: 5, name: 'Nhà bếp đầy đủ tiện nghi' },
    { id: 6, name: 'TV màn hình phẳng' },
    { id: 7, name: 'Máy giặt' },
    { id: 8, name: 'Ban công với view biển' },
    { id: 9, name: 'BBQ ngoài trời' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Basic Amenities (No Categories)</h1>
      <AmenitiesGrid amenities={basicAmenities} />
    </div>
  );
}

// Example 2: Amenities with categories
export function CategorizedAmenitiesExample() {
  const categorizedAmenities = [
    // Technology
    { id: 1, name: 'WiFi tốc độ cao', category: 'Công nghệ' },
    { id: 2, name: 'TV màn hình phẳng 55 inch', category: 'Công nghệ' },
    { id: 3, name: 'Loa Bluetooth', category: 'Công nghệ' },
    
    // Kitchen
    { id: 4, name: 'Bếp gas 4 bếp', category: 'Nhà bếp' },
    { id: 5, name: 'Tủ lạnh 2 cửa', category: 'Nhà bếp' },
    { id: 6, name: 'Lò vi sóng', category: 'Nhà bếp' },
    { id: 7, name: 'Máy pha cà phê', category: 'Nhà bếp' },
    { id: 8, name: 'Bộ đồ ăn đầy đủ', category: 'Nhà bếp' },
    
    // Comfort
    { id: 9, name: 'Điều hòa trong tất cả phòng', category: 'Tiện nghi' },
    { id: 10, name: 'Quạt trần', category: 'Tiện nghi' },
    { id: 11, name: 'Máy nước nóng', category: 'Tiện nghi' },
    
    // Bathroom
    { id: 12, name: 'Máy sấy tóc', category: 'Phòng tắm' },
    { id: 13, name: 'Khăn tắm cao cấp', category: 'Phòng tắm' },
    { id: 14, name: 'Dầu gội & sữa tắm', category: 'Phòng tắm' },
    
    // Outdoor
    { id: 15, name: 'Bể bơi riêng', category: 'Ngoài trời' },
    { id: 16, name: 'Khu vực BBQ', category: 'Ngoài trời' },
    { id: 17, name: 'Ghế tắm nắng', category: 'Ngoài trời' },
    { id: 18, name: 'Bãi đậu xe riêng', category: 'Ngoài trời' },
    
    // Entertainment
    { id: 19, name: 'Bàn bi-a', category: 'Giải trí' },
    { id: 20, name: 'Karaoke', category: 'Giải trí' },
    { id: 21, name: 'Board games', category: 'Giải trí' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Categorized Amenities</h1>
      <AmenitiesGrid amenities={categorizedAmenities} />
    </div>
  );
}

// Example 3: Minimal amenities
export function MinimalAmenitiesExample() {
  const minimalAmenities = [
    { id: 1, name: 'WiFi' },
    { id: 2, name: 'Điều hòa' },
    { id: 3, name: 'Bãi đậu xe' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Minimal Amenities</h1>
      <AmenitiesGrid amenities={minimalAmenities} />
    </div>
  );
}

// Example 4: Empty amenities (component returns null)
export function EmptyAmenitiesExample() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Empty Amenities</h1>
      <p className="text-gray-600 mb-4">
        When amenities array is empty, the component returns null and nothing is rendered.
      </p>
      <AmenitiesGrid amenities={[]} />
      <p className="text-gray-600 mt-4">
        (No amenities grid should appear above this text)
      </p>
    </div>
  );
}

// Example 5: Luxury villa with extensive amenities
export function LuxuryVillaExample() {
  const luxuryAmenities = [
    // Premium Technology
    { id: 1, name: 'Smart Home System', category: 'Công nghệ cao cấp' },
    { id: 2, name: 'Home Theater với màn hình 75 inch', category: 'Công nghệ cao cấp' },
    { id: 3, name: 'Hệ thống âm thanh Bose', category: 'Công nghệ cao cấp' },
    { id: 4, name: 'WiFi mesh tốc độ 1Gbps', category: 'Công nghệ cao cấp' },
    
    // Premium Kitchen
    { id: 5, name: 'Bếp từ cao cấp', category: 'Nhà bếp cao cấp' },
    { id: 6, name: 'Tủ lạnh Side by Side', category: 'Nhà bếp cao cấp' },
    { id: 7, name: 'Máy rửa bát Bosch', category: 'Nhà bếp cao cấp' },
    { id: 8, name: 'Lò nướng âm tủ', category: 'Nhà bếp cao cấp' },
    { id: 9, name: 'Máy pha cà phê Nespresso', category: 'Nhà bếp cao cấp' },
    
    // Luxury Comfort
    { id: 10, name: 'Điều hòa Daikin inverter', category: 'Tiện nghi cao cấp' },
    { id: 11, name: 'Giường king size với nệm cao cấp', category: 'Tiện nghi cao cấp' },
    { id: 12, name: 'Ga trải giường cotton Ai Cập', category: 'Tiện nghi cao cấp' },
    { id: 13, name: 'Rèm cửa tự động', category: 'Tiện nghi cao cấp' },
    
    // Spa & Wellness
    { id: 14, name: 'Bồn tắm Jacuzzi', category: 'Spa & Chăm sóc sức khỏe' },
    { id: 15, name: 'Phòng xông hơi', category: 'Spa & Chăm sóc sức khỏe' },
    { id: 16, name: 'Phòng gym riêng', category: 'Spa & Chăm sóc sức khỏe' },
    { id: 17, name: 'Yoga deck với view biển', category: 'Spa & Chăm sóc sức khỏe' },
    
    // Outdoor Luxury
    { id: 18, name: 'Bể bơi vô cực view biển', category: 'Ngoài trời cao cấp' },
    { id: 19, name: 'Khu vực BBQ với bếp nướng Weber', category: 'Ngoài trời cao cấp' },
    { id: 20, name: 'Gazebo với ghế sofa ngoài trời', category: 'Ngoài trời cao cấp' },
    { id: 21, name: 'Sân vườn nhiệt đới', category: 'Ngoài trời cao cấp' },
    { id: 22, name: 'Bãi đậu xe cho 3 ô tô', category: 'Ngoài trời cao cấp' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Luxury Villa Amenities</h1>
      <AmenitiesGrid amenities={luxuryAmenities} />
    </div>
  );
}

// Example 6: All examples in one page
export function AllAmenitiesExamples() {
  return (
    <div className="space-y-16 py-8">
      <BasicAmenitiesExample />
      <CategorizedAmenitiesExample />
      <MinimalAmenitiesExample />
      <EmptyAmenitiesExample />
      <LuxuryVillaExample />
    </div>
  );
}
