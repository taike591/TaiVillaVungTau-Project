import { useState, useCallback } from 'react';
import { validateImageFile } from '../utils';
import api from '../api';

export interface ImagePreview {
  id: string;
  url: string;
  file?: File;
  order: number;
  uploadProgress?: number;
  uploadError?: string;
  isUploaded?: boolean;
  backendId?: number; // Backend PropertyImage ID for deletion
}

export interface UseImageUploadOptions {
  maxImages?: number;
  maxSizeInMB?: number;
  onError?: (error: string) => void;
  onUploadComplete?: (imageUrl: string) => void;
  onDelete?: (backendId: number) => Promise<void>; // Callback to delete from server
}

/**
 * Hook to manage image upload state and operations
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxImages = 20,
    maxSizeInMB = 10,
    onError,
    onUploadComplete,
    onDelete,
  } = options;
  
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  /**
   * Add new images to the list
   */
  const addImages = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    
    // Validate each file
    for (const file of files) {
      const validation = validateImageFile(file, maxSizeInMB);
      if (!validation.isValid) {
        onError?.(validation.error || 'Invalid file');
        continue;
      }
      validFiles.push(file);
    }
    
    // Check max images limit
    if (images.length + validFiles.length > maxImages) {
      onError?.(`Không được tải quá ${maxImages} ảnh`);
      return;
    }
    
    // Create previews
    const newPreviews: ImagePreview[] = validFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      file,
      order: images.length + index,
    }));
    
    setImages((prev) => [...prev, ...newPreviews]);
  }, [images.length, maxImages, maxSizeInMB, onError]);
  
  /**
   * Remove an image from the list
   */
  const removeImage = useCallback(async (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    
    // If this is an existing image with a backend ID, call delete API
    if (imageToRemove?.backendId && onDelete) {
      try {
        await onDelete(imageToRemove.backendId);
      } catch (error) {
        console.error('[useImageUpload] API delete failed:', error);
        onError?.('Lỗi khi xóa ảnh từ server');
        return; // Don't remove from local state if API call failed
      }
    }
    
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // Revoke object URL to free memory
      const removed = prev.find((img) => img.id === id);
      if (removed?.url.startsWith('blob:')) {
        URL.revokeObjectURL(removed.url);
      }
      // Reorder remaining images
      return filtered.map((img, index) => ({ ...img, order: index }));
    });
  }, [images, onDelete, onError]);
  
  /**
   * Reorder images
   */
  const reorderImages = useCallback((startIndex: number, endIndex: number) => {
    setImages((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      // Update order property
      return result.map((img, index) => ({ ...img, order: index }));
    });
  }, []);
  
  /**
   * Clear all images
   */
  const clearImages = useCallback(() => {
    // Revoke all object URLs
    images.forEach((img) => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
    setImages([]);
  }, [images]);
  
  /**
   * Set images from existing URLs (for edit mode)
   * Uses backendId as stable ID when available to handle inconsistent API order
   */
  const setExistingImages = useCallback((urls: string[], backendIds?: (number | undefined)[]) => {
    const previews: ImagePreview[] = urls.map((url, index) => ({
      // Use backendId as stable id when available, fallback to index-based
      id: backendIds?.[index] ? `backend-${backendIds[index]}` : `existing-${index}`,
      url,
      order: index,
      isUploaded: true,
      backendId: backendIds?.[index],
    }));
    setImages(previews);
  }, []);
  
  /**
   * Upload a single image to the server
   */
  const uploadImage = useCallback(async (
    imageId: string,
    file: File,
    propertyId?: number,
    retryCount = 0
  ): Promise<string | null> => {
    const maxRetries = 2;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Update progress to show upload starting
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, uploadProgress: 0, uploadError: undefined }
            : img
        )
      );
      
      // If propertyId is provided, upload to specific property
      const endpoint = propertyId
        ? `/api/v1/properties/${propertyId}/images`
        : '/api/v1/upload'; // Generic upload endpoint if needed
      
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImages((prev) =>
              prev.map((img) =>
                img.id === imageId ? { ...img, uploadProgress: progress } : img
              )
            );
          }
        },
      });
      
      const imageUrl = response.data.data;
      
      // Update image with uploaded URL
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                url: imageUrl,
                uploadProgress: 100,
                isUploaded: true,
                uploadError: undefined,
              }
            : img
        )
      );
      
      onUploadComplete?.(imageUrl);
      return imageUrl;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Upload failed';
      
      // Retry logic
      if (retryCount < maxRetries) {
        return uploadImage(imageId, file, propertyId, retryCount + 1);
      }
      
      // Update image with error
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                uploadProgress: 0,
                uploadError: errorMessage,
                isUploaded: false,
              }
            : img
        )
      );
      
      onError?.(errorMessage);
      return null;
    }
  }, [onError, onUploadComplete]);
  
  /**
   * Upload all pending images
   */
  const uploadAllImages = useCallback(async (propertyId?: number) => {
    setIsUploading(true);
    
    const pendingImages = images.filter((img) => img.file && !img.isUploaded);
    
    try {
      const uploadPromises = pendingImages.map((img) =>
        img.file ? uploadImage(img.id, img.file, propertyId) : Promise.resolve(null)
      );
      
      const results = await Promise.all(uploadPromises);
      const successCount = results.filter((url) => url !== null).length;
      
      if (successCount === pendingImages.length) {
        return { success: true, uploadedUrls: results.filter((url) => url !== null) as string[] };
      } else {
        return { success: false, uploadedUrls: results.filter((url) => url !== null) as string[] };
      }
    } catch (error) {
      return { success: false, uploadedUrls: [] };
    } finally {
      setIsUploading(false);
    }
  }, [images, uploadImage]);
  
  /**
   * Retry failed upload
   */
  const retryUpload = useCallback(async (imageId: string, propertyId?: number) => {
    const image = images.find((img) => img.id === imageId);
    if (image?.file) {
      return uploadImage(imageId, image.file, propertyId);
    }
    return null;
  }, [images, uploadImage]);
  
  return {
    images,
    isUploading,
    setIsUploading,
    addImages,
    removeImage,
    reorderImages,
    clearImages,
    setExistingImages,
    uploadImage,
    uploadAllImages,
    retryUpload,
  };
}
