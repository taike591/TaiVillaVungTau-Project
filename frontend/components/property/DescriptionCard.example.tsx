/**
 * Example usage of DescriptionCard component
 * This file demonstrates the component with various scenarios
 */

import { DescriptionCard } from './DescriptionCard';

export function DescriptionCardExamples() {
  return (
    <div className="space-y-8 p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">DescriptionCard Examples</h1>

      {/* Example 1: With bed configuration */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Example 1: With Bed Configuration</h2>
        <DescriptionCard
          description={`Villa sang trọng với view biển tuyệt đẹp.
Phòng khách rộng rãi, bếp hiện đại đầy đủ tiện nghi.
Hồ bơi riêng và khu vườn nhiệt đới.

Thích hợp cho gia đình hoặc nhóm bạn.`}
          bedConfig="3 giường đôi - 2 giường đơn"
        />
      </div>

      {/* Example 2: Without bed configuration */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Example 2: Without Bed Configuration</h2>
        <DescriptionCard
          description={`Căn villa hiện đại nằm gần biển Vũng Tàu.
Không gian thoáng mát, thiết kế tối giản.
Đầy đủ tiện nghi cao cấp.`}
        />
      </div>

      {/* Example 3: Long description with multiple paragraphs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Example 3: Long Description</h2>
        <DescriptionCard
          description={`Villa Ocean View là một trong những căn villa đẹp nhất tại Vũng Tàu.

Với thiết kế hiện đại, sang trọng, villa có view nhìn ra biển tuyệt đẹp. Phòng khách rộng rãi với sofa êm ái, TV màn hình lớn. Bếp được trang bị đầy đủ thiết bị hiện đại: tủ lạnh, lò vi sóng, bếp từ, máy rửa chén.

Khu vực ngoài trời có hồ bơi riêng, ghế tắm nắng và khu BBQ. Vườn nhiệt đới xanh mát tạo không gian thư giãn lý tưởng.

Phòng ngủ được thiết kế sang trọng với giường king size, điều hòa, tủ quần áo rộng. Phòng tắm hiện đại với bồn tắm và vòi sen.

Villa cách biển chỉ 5 phút đi bộ, gần các nhà hàng, quán cafe và khu vui chơi giải trí.`}
          bedConfig="4 giường đôi king size - 2 giường đơn - 1 giường tầng"
        />
      </div>

      {/* Example 4: Short description */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Example 4: Short Description</h2>
        <DescriptionCard
          description="Villa 2 phòng ngủ gần biển."
          bedConfig="2 giường đôi"
        />
      </div>
    </div>
  );
}
