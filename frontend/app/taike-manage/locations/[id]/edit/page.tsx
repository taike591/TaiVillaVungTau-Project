'use client';

import { LocationForm } from '@/components/admin/locations/LocationForm';
import { useLocation, useUpdateLocation } from '@/lib/hooks/useLocationsAndTypes';
import { useRouter, useParams } from 'next/navigation';
import { showSuccess, showError } from '@/lib/notifications';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.id as string;

  const { data: location, isLoading: isLoadingLocation, error } = useLocation(locationId);
  const updateLocation = useUpdateLocation();

  const handleSubmit = async (data: any) => {
    try {
      await updateLocation.mutateAsync({
        id: Number(locationId),
        data,
      });
      showSuccess.updated('Location');
      router.push('/taike-manage/locations');
    } catch (error) {
      showError.update('location');
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/locations"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </div>
        <Card className="p-12 text-center">
          <p className="text-red-600">Không thể tải thông tin vị trí. Vui lòng thử lại.</p>
        </Card>
      </div>
    );
  }

  if (isLoadingLocation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/locations"
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

  if (!location) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/locations"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </div>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Không tìm thấy vị trí.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/taike-manage/locations"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa Vị trí</h1>
        <p className="text-gray-600 mt-1">Cập nhật thông tin: {location.name}</p>
      </div>

      <LocationForm
        initialData={location}
        onSubmit={handleSubmit}
        isLoading={updateLocation.isPending}
        isEdit
      />
    </div>
  );
}
