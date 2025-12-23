'use client';

import { PropertyForm } from '@/components/admin/PropertyForm';
import { useProperty, useUpdateProperty } from '@/lib/hooks/useProperties';
import { PropertyFormData } from '@/lib/validation';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { showSuccess } from '@/lib/notifications';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Card } from '@/components/ui/card';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const searchParams = useSearchParams();
  const returnPage = searchParams.get('page') || '0';
  
  const { data: property, isLoading: isLoadingProperty, error } = useProperty(propertyId);
  const updateProperty = useUpdateProperty();

  // Transform property data to form data format
  const initialData = useMemo(() => {
    if (!property) return undefined;

    return {
      code: property.code,
      name: property.name,
      description: property.description,
      area: property.area,
      address: property.address || '',
      location: property.location || '',
      locationId: property.locationId,
      propertyTypeId: property.propertyTypeId, // Add propertyTypeId mapping
      priceWeekday: property.priceWeekday,
      priceWeekend: property.priceWeekend,
      bedroomCount: property.bedroomCount,
      bathroomCount: property.bathroomCount,
      bedCount: property.bedCount,
      standardGuests: property.standardGuests,
      maxGuests: property.maxGuests,
      bedConfig: property.bedConfig || '',
      distanceToSea: property.distanceToSea || '',
      priceNote: property.priceNote || '',
      mapUrl: property.mapUrl || '',
      facebookLink: property.facebookLink || '',
      metaDescription: property.metaDescription || '',
      amenityIds: property.amenities?.map(a => a.id) || [],
      labelIds: property.labels?.map(l => l.id) || [],
      // Preserve full image objects so PropertyForm can get backendId for deletion
      images: property.images || [],
      status: property.status,
    } as PropertyFormData;
  }, [property]);

  const handleSubmit = async (data: PropertyFormData) => {
    // Note: PropertyForm handles the progress overlay and step tracking
    // This function is called during the "save" step
    await updateProperty.mutateAsync({
      id: Number(propertyId),
      data,
    });
    // Show success notification and redirect
    // The redirect happens after the overlay shows completion (handled by PropertyForm)
    showSuccess.updated('Property');
    router.push(`/taike-manage/properties?page=${returnPage}`);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/properties"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
        <Card className="p-12 text-center">
          <p className="text-red-600">Failed to load property. Please try again.</p>
        </Card>
      </div>
    );
  }

  if (isLoadingProperty) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/properties"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
        <Card className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-600 mt-4">Loading property data...</p>
        </Card>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/properties"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Property not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/taike-manage/properties"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-gray-600 mt-1">Update villa listing: {property.name}</p>
      </div>

      {/* Form */}
      <PropertyForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={updateProperty.isPending}
        propertyId={Number(propertyId)}
      />
    </div>
  );
}
