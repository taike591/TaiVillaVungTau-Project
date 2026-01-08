'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, PropertyFormData } from '@/lib/validation';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { useAmenities } from '@/lib/hooks/useAmenities';
import { useLabels } from '@/lib/hooks/useLabels';
import { useLocations, usePropertyTypes } from '@/lib/hooks/useLocationsAndTypes';
import api from '@/lib/api';
import { ImageUploader } from './ImageUploader';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { UpdateProgressOverlay, UpdateStep } from './UpdateProgressOverlay';

export interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  isLoading: boolean;
  propertyId?: number;
}

export function PropertyForm({
  initialData,
  onSubmit,
  isLoading,
  propertyId,
}: PropertyFormProps) {
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      locationId: initialData?.locationId || 0,
      propertyTypeId: initialData?.propertyTypeId || undefined,
      area: initialData?.area || '',
      address: initialData?.address || '',
      location: initialData?.location || '',
      priceWeekday: initialData?.priceWeekday || 0,
      priceWeekend: initialData?.priceWeekend || 0,
      bedroomCount: initialData?.bedroomCount || 1,
      bathroomCount: initialData?.bathroomCount || 1,
      bedCount: initialData?.bedCount || 1,
      standardGuests: initialData?.standardGuests || 1,
      maxGuests: initialData?.maxGuests || 1,
      bedConfig: initialData?.bedConfig || '',
      poolArea: initialData?.poolArea || '',
      distanceToSea: initialData?.distanceToSea || '',
      priceNote: initialData?.priceNote || '',
      mapUrl: initialData?.mapUrl || '',
      facebookLink: initialData?.facebookLink || '',
      metaDescription: initialData?.metaDescription || '',
      googleSheetsUrl: initialData?.googleSheetsUrl || '',
      googleSheetsNote: initialData?.googleSheetsNote || '',
      amenityIds: initialData?.amenityIds || [],
      labelIds: initialData?.labelIds || [],
      images: initialData?.images || [],
      status: initialData?.status || 'ACTIVE',
    },
  });

  const { data: amenities, isLoading: amenitiesLoading } = useAmenities();
  const { data: labels, isLoading: labelsLoading } = useLabels();
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: propertyTypes, isLoading: propertyTypesLoading } = usePropertyTypes();

  const {
    images,
    addImages,
    removeImage,
    reorderImages,
    setExistingImages,
    uploadAllImages, // Deconstruct upload function
  } = useImageUpload({
    maxImages: 5,
    maxSizeInMB: 5,
    onError: (error) => {
      form.setError('images', { message: error });
    },
    onDelete: propertyId ? async (backendImageId: number) => {
      // Call backend API to delete image from DB and cloud
      await api.delete(`/api/v1/properties/${propertyId}/images/${backendImageId}`);
    } : undefined,
  });

  // State for selected thumbnail - stores the frontend image.id 
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);
  // Track the original thumbnail backend ID to detect changes
  const [originalThumbnailBackendId, setOriginalThumbnailBackendId] = useState<number | null>(null);

  // Update progress overlay state
  const [showProgressOverlay, setShowProgressOverlay] = useState(false);
  const [updateError, setUpdateError] = useState<string | undefined>(undefined);
  const [updateSteps, setUpdateSteps] = useState<UpdateStep[]>([
    { id: 'upload', label: 'Tải ảnh lên server', status: 'pending', icon: 'upload' },
    { id: 'thumbnail', label: 'Cập nhật ảnh đại diện', status: 'pending', icon: 'image' },
    { id: 'save', label: 'Lưu thông tin property', status: 'pending', icon: 'database' },
  ]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Helper function to update step status
  const updateStepStatus = useCallback((stepId: string, status: UpdateStep['status']) => {
    setUpdateSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }, []);

  // Set existing images when editing
  useEffect(() => {
    if (initialData?.images && Array.isArray(initialData.images)) {
      // Backend returns PropertyImage objects: { id, imageUrl, isThumbnail }
      // Handle both cases: string URLs or objects with imageUrl
      const imageData = initialData.images
        .map((img: any, index: number) => {
          if (typeof img === 'string') {
            return { url: img, backendId: undefined, isThumbnail: false };
          }
          if (img && typeof img === 'object' && img.imageUrl) {
            return { url: img.imageUrl, backendId: img.id, isThumbnail: img.isThumbnail || false };
          }
          return null;
        })
        .filter((data): data is { url: string; backendId: number | undefined; isThumbnail: boolean } => data !== null);
      
      if (imageData.length > 0) {
        setExistingImages(imageData.map(d => d.url), imageData.map(d => d.backendId));
        
        // Find the thumbnail image and set its frontend ID using backendId for stability
        const thumbnailData = imageData.find(d => d.isThumbnail);
        if (thumbnailData && thumbnailData.backendId) {
          // Use the same ID format as setExistingImages: `backend-{backendId}`
          setThumbnailId(`backend-${thumbnailData.backendId}`);
          setOriginalThumbnailBackendId(thumbnailData.backendId);
        }
      }
    }
  }, [initialData?.images, setExistingImages]);

  // Sync images with form
  useEffect(() => {
    form.setValue('images', images.map(img => img.url));
  }, [images, form]);

  const handleFormSubmit = async (data: PropertyFormData) => {
    // Validate images
    if (images.length === 0) {
      form.setError('images', { message: 'Phải có ít nhất 1 ảnh' });
      return;
    }

    // Reset and show progress overlay
    setUpdateError(undefined);
    setUpdateSteps([
      { id: 'upload', label: 'Tải ảnh lên server', status: 'pending', icon: 'upload' },
      { id: 'thumbnail', label: 'Cập nhật ảnh đại diện', status: 'pending', icon: 'image' },
      { id: 'save', label: 'Lưu thông tin property', status: 'pending', icon: 'database' },
    ]);
    setCurrentStepIndex(0);
    setShowProgressOverlay(true);

    try {
      // If we have a propertyId (Edit Mode), upload new images first
      if (propertyId) {
        // Step 1: Upload images
        updateStepStatus('upload', 'in-progress');
        
        const hasPendingImages = images.some(img => !img.isUploaded);
        if (hasPendingImages) {
          const uploadResult = await uploadAllImages(propertyId);
          if (!uploadResult.success && uploadResult.uploadedUrls.length === 0) {
            const stillHasPending = images.some(img => !img.isUploaded);
            if (stillHasPending) {
              updateStepStatus('upload', 'error');
              setUpdateError('Có lỗi khi upload ảnh. Vui lòng thử lại.');
              setTimeout(() => setShowProgressOverlay(false), 3000);
              return;
            }
          }
        }
        updateStepStatus('upload', 'completed');
        setCurrentStepIndex(1);

        // Step 2: Update thumbnail
        updateStepStatus('thumbnail', 'in-progress');
        
        if (thumbnailId) {
          const selectedImage = images.find(img => img.id === thumbnailId);
          if (selectedImage?.backendId && selectedImage.backendId !== originalThumbnailBackendId) {
            try {
              await api.put(`/api/v1/properties/${propertyId}/images/${selectedImage.backendId}/thumbnail`);
            } catch (error) {
              console.error('Failed to update thumbnail:', error);
            }
          }
        } else {
          // If no thumbnail selected, set first image as thumbnail
          const firstImage = images[0];
          if (firstImage?.backendId && firstImage.backendId !== originalThumbnailBackendId) {
            try {
              await api.put(`/api/v1/properties/${propertyId}/images/${firstImage.backendId}/thumbnail`);
            } catch (error) {
              console.error('Failed to set first image as thumbnail:', error);
            }
          }
        }
        updateStepStatus('thumbnail', 'completed');
        setCurrentStepIndex(2);
        
        // Wait briefly for DB transaction to fully commit before next update
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // For create mode, skip image upload and thumbnail steps
        updateStepStatus('upload', 'completed');
        updateStepStatus('thumbnail', 'completed');
        setCurrentStepIndex(2);
      }

      // Step 3: Save property data with retry mechanism
      updateStepStatus('save', 'in-progress');
      
      // Retry logic for transient lock errors
      const maxRetries = 3;
      let lastError: any = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await onSubmit(data);
          updateStepStatus('save', 'completed');
          lastError = null;
          break; // Success, exit retry loop
        } catch (error: any) {
          lastError = error;
          const isLockError = error?.message?.includes('Lock') || 
                             error?.response?.data?.message?.includes('Lock') ||
                             error?.response?.status === 500;
          
          if (isLockError && attempt < maxRetries) {
            // Wait before retry with exponential backoff
            const waitTime = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
            console.warn(`Lock timeout, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          } else {
            // Either not a lock error or last attempt - throw
            throw error;
          }
        }
      }
      
      if (lastError) {
        throw lastError;
      }
      
      // Keep overlay visible briefly to show completion (reduced from 800ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      setShowProgressOverlay(false);
      
    } catch (error: any) {
      updateStepStatus('save', 'error');
      setUpdateError(error?.message || 'Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.');
      // Keep overlay visible to show error
      setTimeout(() => setShowProgressOverlay(false), 3000);
    }
  };

  const onFormError = (errors: any) => {
    if (Object.keys(errors).length > 0) {
      console.error('[PropertyForm] Validation errors:', errors);
    }
  };

  return (
    <>
      {/* Update Progress Overlay */}
      <UpdateProgressOverlay
        isVisible={showProgressOverlay}
        steps={updateSteps}
        currentStep={currentStepIndex}
        error={updateError}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit, onFormError)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã property *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: VILLA001" {...field} />
                  </FormControl>
                  <FormDescription>
                    Chỉ chữ in hoa và số, 3-20 ký tự
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Tên property *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Villa Biển Xanh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Mô tả *</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Mô tả chi tiết về property..."
                      className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Location Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin vị trí & Loại hình</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locationsLoading ? (
                        <SelectItem value="loading" disabled>Đang tải...</SelectItem>
                      ) : locations && locations.length > 0 ? (
                        locations.map((loc) => (
                          <SelectItem key={loc.id} value={String(loc.id)}>
                            {loc.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>Không có vị trí</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại hình</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyTypesLoading ? (
                        <SelectItem value="loading" disabled>Đang tải...</SelectItem>
                      ) : propertyTypes && propertyTypes.length > 0 ? (
                        propertyTypes.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>Không có loại hình</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Địa chỉ chi tiết" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distanceToSea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khoảng cách đến biển</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: 100m" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mapUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Google Maps</FormLabel>
                  <FormControl>
                    <Input placeholder="https://maps.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Pricing Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin giá</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priceWeekday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá ngày thường (VND) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1000000"
                      {...field}
                      onChange={(e) => {
                        const weekdayPrice = Number(e.target.value);
                        field.onChange(weekdayPrice);
                        // Auto-update weekend price to 2x weekday price
                        form.setValue('priceWeekend', weekdayPrice * 2);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Giá cuối tuần sẽ tự động nhân đôi (x2)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceWeekend"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá cuối tuần (VND) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1500000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceNote"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Ghi chú về giá</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Giá có thể thay đổi theo mùa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Property Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Chi tiết property</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="bedroomCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số phòng ngủ *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathroomCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số WC *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số giường</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="standardGuests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số khách tiêu chuẩn *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxGuests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số khách tối đa *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedConfig"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-2">
                  <FormLabel>Cấu hình giường</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: 2 giường đôi, 1 giường đơn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="poolArea"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-2">
                  <FormLabel>Diện tích hồ bơi</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: 30m2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Amenities */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Tiện ích</h2>
          <FormField
            control={form.control}
            name="amenityIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn tiện ích</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenitiesLoading ? (
                      <p className="text-sm text-gray-500 col-span-full">Đang tải tiện ích...</p>
                    ) : amenities && amenities.length > 0 ? (
                      amenities.map((amenity) => (
                        <label
                          key={amenity.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={field.value?.includes(amenity.id)}
                            onChange={(e) => {
                              const currentValue = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...currentValue, amenity.id]);
                              } else {
                                field.onChange(
                                  currentValue.filter((id) => id !== amenity.id)
                                );
                              }
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{amenity.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 col-span-full">
                        Chưa có tiện ích nào. Vui lòng thêm tiện ích trước.
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        {/* Labels (Sát biển, View biển, etc.) */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Nhãn đặc điểm (Labels)</h2>
          <FormField
            control={form.control}
            name="labelIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn nhãn hiển thị trên card</FormLabel>
                <FormDescription>
                  Labels sẽ hiển thị ở góc trên bên trái của ảnh property (tối đa 2 labels)
                </FormDescription>
                <FormControl>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                    {labelsLoading ? (
                      <p className="text-sm text-gray-500 col-span-full">Đang tải labels...</p>
                    ) : labels && labels.length > 0 ? (
                      labels.map((label) => (
                        <label
                          key={label.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={field.value?.includes(label.id)}
                            onChange={(e) => {
                              const currentValue = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...currentValue, label.id]);
                              } else {
                                field.onChange(
                                  currentValue.filter((id) => id !== label.id)
                                );
                              }
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-white text-xs font-medium"
                            style={{ backgroundColor: label.color || '#0EA5E9' }}
                          >
                            {label.name}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 col-span-full">
                        Chưa có label nào. Vui lòng thêm label ở menu &quot;Nhãn (Labels)&quot;.
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Hình ảnh *</h2>
          <ImageUploader
            images={images}
            onChange={() => {}}
            onAdd={addImages}
            onRemove={removeImage}
            onReorder={reorderImages}
            onSetThumbnail={setThumbnailId}
            thumbnailId={thumbnailId}
            maxImages={5}
            disabled={isLoading}
          />
          {form.formState.errors.images && (
            <p className="text-sm text-red-600 mt-2">
              {form.formState.errors.images.message}
            </p>
          )}
        </Card>

        {/* Additional Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin bổ sung</h2>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="facebookLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Facebook</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description (SEO)</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Mô tả ngắn gọn cho SEO (tối đa 500 ký tự)"
                      className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Google Sheets Management Section */}
            <div className="col-span-2 border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Quản lý Google Sheets</h3>
            </div>

            <FormField
              control={form.control}
              name="googleSheetsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Google Sheets</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="googleSheetsNote"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Ghi chú từ Google Sheets</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Nhập ghi chú, thông tin từ Google Sheets..."
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={2000}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
        </form>
      </Form>
    </>
  );
}
