'use client';

import { useState } from 'react';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { useCreateProperty } from '@/lib/hooks/useProperties';
import { PropertyFormData } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { showSuccess, showError } from '@/lib/notifications';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SmartImportDialog } from '@/components/admin/SmartImportDialog';
import { ParsedPropertyData } from '@/lib/utils/propertyParser';

export default function NewPropertyPage() {
  const router = useRouter();
  const createProperty = useCreateProperty();
  const [initialData, setInitialData] = useState<Partial<PropertyFormData> | undefined>(undefined);
  const [formKey, setFormKey] = useState(0); // Force form re-render on import

  /**
   * Handle property creation
   * UNIFIED FLOW:
   * 1. PropertyForm calls onSubmit to create property (metadata only)
   * 2. This function returns created property with ID
   * 3. PropertyForm uploads images using that ID
   * 4. PropertyForm calls onComplete when done
   * 5. We redirect in onComplete
   */
  const handleSubmit = async (data: PropertyFormData) => {
    const createdProperty = await createProperty.mutateAsync(data);
    return createdProperty; // Return for PropertyForm to use the ID for image upload
  };

  /**
   * Called after all steps complete (including image upload)
   */
  const handleComplete = () => {
    showSuccess.created('Property');
    router.push('/taike-manage/properties');
  };

  const handleSmartImport = (data: ParsedPropertyData) => {
    // Transform parsed data to form format
    const formData: Partial<PropertyFormData> = {
      code: data.code,
      name: data.name || '',
      description: data.description || '',
      address: data.address || '',
      priceWeekday: data.priceWeekday,
      priceWeekend: data.priceWeekend,
      standardGuests: data.standardGuests,
      maxGuests: data.maxGuests,
      bedroomCount: data.bedroomCount,
      bathroomCount: data.bathroomCount,
      bedCount: data.bedCount,
      bedConfig: data.bedConfig || '',
      distanceToSea: data.distanceToSea || '',
      poolArea: data.poolArea || '',
      facebookLink: data.facebookLink || '',
      priceNote: data.priceNote || '',
      locationId: data.locationId,
      propertyTypeId: data.propertyTypeId,
      amenityIds: data.amenityIds || [],
      status: 'ACTIVE',
    };
    
    setInitialData(formData);
    setFormKey(prev => prev + 1); // Force form to re-render with new initial data
    showSuccess.custom('Đã điền form từ văn bản. Vui lòng kiểm tra và bổ sung ảnh!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/taike-manage/properties"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
        
        {/* Smart Import Button */}
        <SmartImportDialog onImport={handleSmartImport} />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-1">Create a new villa listing</p>
      </div>

      {/* Form */}
      <PropertyForm
        key={formKey}
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={createProperty.isPending}
        onComplete={handleComplete}
      />
    </div>
  );
}
