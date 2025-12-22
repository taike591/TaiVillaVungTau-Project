'use client';

import { PropertyTypeForm } from '@/components/admin/property-types/PropertyTypeForm';
import { usePropertyType, useUpdatePropertyType } from '@/lib/hooks/useLocationsAndTypes';
import { useRouter, useParams } from 'next/navigation';
import { showSuccess, showError } from '@/lib/notifications';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function EditPropertyTypePage() {
  const router = useRouter();
  const params = useParams();
  const typeId = params.id as string;

  const { data: propertyType, isLoading: isLoadingType, error } = usePropertyType(typeId);
  const updatePropertyType = useUpdatePropertyType();

  const handleSubmit = async (data: any) => {
    try {
      await updatePropertyType.mutateAsync({
        id: Number(typeId),
        data,
      });
      showSuccess.updated('Property Type');
      router.push('/taike-manage/property-types');
    } catch (error) {
      showError.update('property type');
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/property-types"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </div>
        <Card className="p-12 text-center">
          <p className="text-red-600">Không thể tải thông tin loại hình. Vui lòng thử lại.</p>
        </Card>
      </div>
    );
  }

  if (isLoadingType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/property-types"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </div>
        <Card className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
        </Card>
      </div>
    );
  }

  if (!propertyType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/property-types"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </div>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Không tìm thấy loại hình.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/taike-manage/property-types"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa Loại hình</h1>
        <p className="text-gray-600 mt-1">Cập nhật thông tin: {propertyType.name}</p>
      </div>

      <PropertyTypeForm
        initialData={propertyType}
        onSubmit={handleSubmit}
        isLoading={updatePropertyType.isPending}
        isEdit
      />
    </div>
  );
}
