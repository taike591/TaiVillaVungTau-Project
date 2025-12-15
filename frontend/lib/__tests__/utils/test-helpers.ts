/**
 * Test Utilities and Helpers for Brand Redesign Property Tests
 * Feature: brand-redesign
 * 
 * These utilities provide helper functions for testing villa display logic
 * and formatting functions.
 */

import type { VillaData } from '../generators/villa-generators';

/**
 * Format price according to Facebook style
 * Format: "X.XXX.XXXđ/Y khách/đêm"
 */
export function formatPrice(price: number, guestCount: number, roomCount?: number): string {
  // Convert to millions and format with dots
  const millions = Math.floor(price / 1000000);
  const thousands = Math.floor((price % 1000000) / 1000);
  
  let priceStr = `${millions}.`;
  if (thousands === 0) {
    priceStr += '000';
  } else {
    priceStr += thousands.toString().padStart(3, '0');
  }
  priceStr += '.000đ';
  
  let result = `${priceStr}/${guestCount} khách`;
  
  if (roomCount && roomCount > 0) {
    result += `/${roomCount} phòng`;
  }
  
  result += '/đêm';
  
  return result;
}

/**
 * Format room information
 * Format: "X phòng ngủ, Y giường, Z WC"
 * or "X phòng ngủ, Y giường (bed config), Z WC"
 */
export function formatRoomInfo(
  bedroomCount: number,
  bedCount: number,
  bathroomCount: number,
  bedConfig?: string
): string {
  let result = `${bedroomCount} phòng ngủ, `;
  
  if (bedConfig) {
    result += `${bedCount} giường (${bedConfig}), `;
  } else {
    result += `${bedCount} giường, `;
  }
  
  result += `${bathroomCount} WC`;
  
  return result;
}

/**
 * Format distance to beach
 * Format: "Cách biển [area] [distance]"
 */
export function formatDistanceToBeach(distance: string, area: string): string {
  return `Cách biển ${area.toLowerCase()} ${distance}`;
}

/**
 * Get villa display name with fallback logic
 * If name exists, use name
 * If name is empty, use address
 * If both empty, use code + area
 */
export function getVillaDisplayName(villa: VillaData): string {
  if (villa.name && villa.name.trim()) {
    return villa.name;
  }
  
  if (villa.address && villa.address.trim()) {
    return villa.address;
  }
  
  return `${villa.code} - ${villa.area || 'Vũng Tàu'}`;
}

/**
 * Price disclaimer constants
 */
export const PRICE_DISCLAIMERS = {
  seasonal: 'Giá tại thời điểm đăng bài, có thay đổi theo mùa',
  holiday: 'Giá Thứ 6, Chủ nhật, Thứ 7, các ngày Lễ, Tết có thay đổi',
  weekday: 'Giá ngày thường',
  weekdayAlt: 'Thứ 2 - Thứ 5',
  weekend: 'Giá Thứ 6, Thứ 7, Chủ nhật'
};

/**
 * Check-in/Check-out constants
 */
export const CHECK_IN_OUT = {
  checkIn: '14H',
  checkOut: '12H',
  display: 'CHECK IN 14H - CHECK OUT 12H'
};

/**
 * Check if a string contains villa code in format "MS:XXX"
 */
export function containsVillaCode(text: string, code: string): boolean {
  return text.includes(code);
}

/**
 * Check if a string contains all room information
 */
export function containsRoomInfo(
  text: string,
  bedroomCount: number,
  bedCount: number,
  bathroomCount: number
): boolean {
  const hasBedroomCount = text.includes(`${bedroomCount} phòng ngủ`);
  const hasBedCount = text.includes(`${bedCount} giường`);
  const hasBathroomCount = text.includes(`${bathroomCount} WC`);
  
  return hasBedroomCount && hasBedCount && hasBathroomCount;
}

/**
 * Check if a string contains price with proper format
 */
export function containsPriceFormat(text: string, price: number, guestCount: number): boolean {
  const formattedPrice = formatPrice(price, guestCount);
  return text.includes('đ') && text.includes('khách') && text.includes('đêm');
}

/**
 * Check if a string contains price disclaimers
 */
export function containsSeasonalDisclaimer(text: string): boolean {
  return text.includes(PRICE_DISCLAIMERS.seasonal);
}

export function containsHolidayDisclaimer(text: string): boolean {
  return text.includes('Lễ') && text.includes('Tết');
}

/**
 * Check if a string contains complete address
 */
export function containsCompleteAddress(text: string, address: string, area: string): boolean {
  return text.includes(address) && text.includes(area);
}

/**
 * Check if a string contains distance to beach
 */
export function containsDistanceToBeach(text: string, distance: string): boolean {
  return text.includes('Cách biển') && text.includes(distance);
}

/**
 * Check if a string contains all amenities
 */
export function containsAllAmenities(text: string, amenities: string[]): boolean {
  return amenities.every(amenity => text.includes(amenity));
}

/**
 * Check if a string contains check-in/check-out info
 */
export function containsCheckInOutInfo(text: string): boolean {
  return text.includes('CHECK IN') && 
         text.includes('CHECK OUT') && 
         text.includes('14H') && 
         text.includes('12H');
}

/**
 * Normalize whitespace for comparison
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Check if text contains a pattern (case-insensitive)
 */
export function containsPattern(text: string, pattern: string): boolean {
  return text.toLowerCase().includes(pattern.toLowerCase());
}

/**
 * Extract numbers from text
 */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Check if a rendered component output is valid HTML
 */
export function isValidHTML(html: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.children.length > 0;
  } catch {
    return false;
  }
}
