'use client';

import { PropertyForm } from '@/components/admin/PropertyForm';
import { useCreateProperty } from '@/lib/hooks/useProperties';
import { PropertyFormData } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { showSuccess, showError } from '@/lib/notifications';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPropertyPage() {
  const router = useRouter();
  const createProperty = useCreateProperty();

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      await createProperty.mutateAsync(data);
      showSuccess.created('Property');
      router.push('/admin/properties');
    } catch (error: any) {
      showError.create('property');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/properties"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-1">Create a new villa listing</p>
      </div>

      {/* Form */}
      <PropertyForm
        onSubmit={handleSubmit}
        isLoading={createProperty.isPending}
      />
    </div>
  );
}
