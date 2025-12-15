/**
 * Error handling utilities for missing or invalid data
 * Requirements: 3.10, and error handling from design
 */

export interface PropertyData {
  code?: string;
  name?: string;
  address?: string;
  area?: string;
  priceWeekday?: number;
  priceWeekend?: number;
  images?: any[];
  amenities?: any[];
  distanceToBeach?: string;
}

/**
 * Check if villa code is missing or invalid
 */
export function hasMissingCode(code?: string): boolean {
  return !code || code.trim() === '';
}

/**
 * Get villa code with fallback
 */
export function getVillaCode(code?: string): string {
  return hasMissingCode(code) ? 'MS:---' : code!;
}

/**
 * Check if villa name is missing
 */
export function hasMissingName(name?: string): boolean {
  return !name || name.trim() === '';
}

/**
 * Get display name with fallback logic
 * Requirements: 3.10
 */
export function getDisplayName(property: PropertyData): string {
  // If has name, use name
  if (property.name && property.name.trim()) {
    return property.name;
  }
  
  // If no name, use address
  if (property.address && property.address.trim()) {
    return property.address;
  }
  
  // Fallback: use code + area
  const code = getVillaCode(property.code);
  return `${code} - ${property.area || 'Vũng Tàu'}`;
}

/**
 * Check if price is missing or invalid
 */
export function hasMissingPrice(price?: number): boolean {
  return !price || price <= 0;
}

/**
 * Check if images are missing
 */
export function hasMissingImages(images?: any[]): boolean {
  return !images || images.length === 0;
}

/**
 * Check if amenities are missing
 */
export function hasMissingAmenities(amenities?: any[]): boolean {
  return !amenities || amenities.length === 0;
}

/**
 * Check if distance to beach is missing
 */
export function hasMissingDistance(distance?: string): boolean {
  return !distance || distance.trim() === '';
}

/**
 * Get contact message for missing price
 */
export function getMissingPriceMessage(): {
  title: string;
  subtitle: string;
} {
  return {
    title: 'Liên hệ để biết giá',
    subtitle: 'Vui lòng liên hệ 0868947734 (Thanh Tài)',
  };
}

/**
 * Get message for missing amenities
 */
export function getMissingAmenitiesMessage(): string {
  return 'Đang cập nhật tiện ích';
}

/**
 * Get message for missing images
 */
export function getMissingImagesMessage(): string {
  return 'Đang cập nhật hình ảnh';
}

/**
 * Validate property data completeness
 */
export function validatePropertyData(property: PropertyData): {
  isComplete: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  
  if (hasMissingCode(property.code)) {
    missingFields.push('code');
  }
  
  if (hasMissingName(property.name) && !property.address) {
    missingFields.push('name/address');
  }
  
  if (hasMissingPrice(property.priceWeekday)) {
    missingFields.push('price');
  }
  
  if (hasMissingImages(property.images)) {
    missingFields.push('images');
  }
  
  if (hasMissingAmenities(property.amenities)) {
    missingFields.push('amenities');
  }
  
  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Safe get main image with fallback
 * Priority: 1. Image with isThumbnail=true, 2. First image
 */
export function getMainImage(images?: any[]): string | null {
  if (hasMissingImages(images)) {
    return null;
  }
  
  // First, try to find the thumbnail image (ảnh đại diện)
  const thumbnailImage = images!.find(img => {
    if (typeof img === 'object' && img !== null) {
      return img.isThumbnail === true;
    }
    return false;
  });
  
  if (thumbnailImage && typeof thumbnailImage === 'object' && 'imageUrl' in thumbnailImage) {
    return thumbnailImage.imageUrl;
  }
  
  // Fallback to first image
  const firstImage = images![0];
  
  if (typeof firstImage === 'string') {
    return firstImage;
  }
  
  if (firstImage && typeof firstImage === 'object' && 'imageUrl' in firstImage) {
    return firstImage.imageUrl;
  }
  
  return null;
}

/**
 * Sort images array to put thumbnail (ảnh đại diện) first
 * This ensures the primary image displays first in galleries and carousels
 */
export function sortImagesWithThumbnailFirst(images?: any[]): any[] {
  if (hasMissingImages(images)) {
    return [];
  }
  
  // Create a copy to avoid mutating original array
  const sortedImages = [...images!];
  
  // Sort: isThumbnail=true first, then maintain original order
  sortedImages.sort((a, b) => {
    const aIsThumbnail = typeof a === 'object' && a?.isThumbnail === true;
    const bIsThumbnail = typeof b === 'object' && b?.isThumbnail === true;
    
    if (aIsThumbnail && !bIsThumbnail) return -1;
    if (!aIsThumbnail && bIsThumbnail) return 1;
    return 0;
  });
  
  return sortedImages;
}

