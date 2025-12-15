'use client';

import { useCallback, useRef, DragEvent } from 'react';
import Image from 'next/image';
import { X, Upload, GripVertical, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImagePreview } from '@/lib/hooks/useImageUpload';

export interface ImageUploaderProps {
  images: ImagePreview[];
  onChange: (images: ImagePreview[]) => void;
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onRetry?: (imageId: string) => void;
  onSetThumbnail?: (imageId: string) => void;
  thumbnailId?: string | null;
  maxImages?: number;
  maxSizeInMB?: number;
  disabled?: boolean;
}

export function ImageUploader({
  images,
  onAdd,
  onRemove,
  onReorder,
  onRetry,
  onSetThumbnail,
  thumbnailId,
  maxImages = 20,
  disabled = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItemRef = useRef<number | null>(null);
  const dragOverItemRef = useRef<number | null>(null);

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAdd(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop for file upload
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onAdd(files);
      }
    },
    [onAdd, disabled]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle drag start for reordering
  const handleDragStart = (index: number) => {
    dragItemRef.current = index;
  };

  // Handle drag enter for reordering
  const handleDragEnter = (index: number) => {
    dragOverItemRef.current = index;
  };

  // Handle drag end for reordering
  const handleDragEnd = () => {
    if (
      dragItemRef.current !== null &&
      dragOverItemRef.current !== null &&
      dragItemRef.current !== dragOverItemRef.current
    ) {
      onReorder(dragItemRef.current, dragOverItemRef.current);
    }
    dragItemRef.current = null;
    dragOverItemRef.current = null;
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer',
            'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Kéo thả ảnh vào đây hoặc click để chọn
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, WebP (tối đa {maxImages} ảnh)
          </p>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable={!disabled}
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                'relative group rounded-lg overflow-hidden border-2 border-gray-200',
                'transition-all hover:border-primary',
                !disabled && 'cursor-move',
                dragItemRef.current === index && 'opacity-50'
              )}
            >
              {/* Drag Handle */}
              {!disabled && (
                <div className="absolute top-2 left-2 z-10 bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-white" />
                </div>
              )}

              {/* Order Badge */}
              <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded">
                {index + 1}
              </div>

              {/* Thumbnail Badge - Click to set as thumbnail */}
              <button
                type="button"
                onClick={() => !disabled && onSetThumbnail?.(image.id)}
                disabled={disabled}
                className={cn(
                  'absolute top-2 left-10 z-10 rounded p-1.5 transition-all',
                  thumbnailId === image.id || (index === 0 && !thumbnailId)
                    ? 'bg-yellow-500 text-white'
                    : 'bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-yellow-500 hover:text-white',
                  !disabled && 'cursor-pointer'
                )}
                title={thumbnailId === image.id || (index === 0 && !thumbnailId) ? 'Ảnh đại diện' : 'Click để đặt làm ảnh đại diện'}
              >
                <Star className={cn('h-4 w-4', (thumbnailId === image.id || (index === 0 && !thumbnailId)) && 'fill-current')} />
              </button>

              {/* Remove Button */}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(image.id)}
                  className="absolute bottom-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Image */}
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                />
                
                {/* Upload Progress Overlay */}
                {image.uploadProgress !== undefined &&
                  image.uploadProgress < 100 &&
                  !image.uploadError && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                      <div className="w-3/4 bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${image.uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-white text-xs font-medium">
                        {image.uploadProgress}%
                      </span>
                    </div>
                  )}
                
                {/* Upload Error Overlay */}
                {image.uploadError && (
                  <div className="absolute inset-0 bg-red-500/90 flex flex-col items-center justify-center p-2">
                    <AlertCircle className="h-8 w-8 text-white mb-2" />
                    <p className="text-white text-xs text-center mb-2">
                      {image.uploadError}
                    </p>
                    {onRetry && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onRetry(image.id)}
                        className="bg-white hover:bg-gray-100"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Thử lại
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      {images.length > 0 && (
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>
            {images.length} / {maxImages} ảnh • Kéo thả để sắp xếp • ⭐ Click để đặt ảnh đại diện
          </p>
          {images.some((img) => img.uploadProgress !== undefined && img.uploadProgress < 100) && (
            <p className="text-primary font-medium">Đang tải lên...</p>
          )}
          {images.some((img) => img.uploadError) && (
            <p className="text-red-600 font-medium">
              Một số ảnh tải lên thất bại. Vui lòng thử lại.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
