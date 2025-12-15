'use client';

import { PropertyTypeForm } from '@/components/admin/property-types/PropertyTypeForm';
import { useCreatePropertyType } from '@/lib/hooks/useLocationsAndTypes';
import { useRouter } from 'next/navigation';
import { showSuccess, showError } from '@/lib/notifications';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPropertyTypePage() {
  const router = useRouter();
  const createPropertyType = useCreatePropertyType();

  const handleSubmit = async (data: any) => {
    try {
      await createPropertyType.mutateAsync(data);
      showSuccess.created('Property Type');
      router.push('/admin/property-types');
    } catch (error) {
      showError.create('property type');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/property-types"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Thêm Loại hình Mới</h1>
        <p className="text-gray-600 mt-1">Tạo một loại hình bất động sản mới cho hệ thống.</p>
      </div>

      <PropertyTypeForm
        onSubmit={handleSubmit}
        isLoading={createPropertyType.isPending}
      />
    </div>
  );
}
