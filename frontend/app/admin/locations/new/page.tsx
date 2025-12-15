'use client';

import { LocationForm } from '@/components/admin/locations/LocationForm';
import { useCreateLocation } from '@/lib/hooks/useLocationsAndTypes';
import { useRouter } from 'next/navigation';
import { showSuccess, showError } from '@/lib/notifications';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewLocationPage() {
  const router = useRouter();
  const createLocation = useCreateLocation();

  const handleSubmit = async (data: any) => {
    try {
      await createLocation.mutateAsync(data);
      showSuccess.created('Location');
      router.push('/admin/locations');
    } catch (error) {
      showError.create('location');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/locations"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Thêm Vị trí Mới</h1>
        <p className="text-gray-600 mt-1">Tạo một khu vực/địa điểm mới cho hệ thống.</p>
      </div>

      <LocationForm
        onSubmit={handleSubmit}
        isLoading={createLocation.isPending}
      />
    </div>
  );
}
