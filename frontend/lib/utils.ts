import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number as Vietnamese currency (VND)
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format date to Vietnamese locale
 * @param date - Date to format
 * @param format - Format style ('short' | 'medium' | 'long')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric' },
  };
  
  return new Intl.DateTimeFormat('vi-VN', optionsMap[format]).format(dateObj);
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Vietnamese phone number format
 * @param phone - Phone number to validate
 * @returns True if valid phone format (10-11 digits)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeInMB - Maximum file size in MB (default: 5)
 * @returns Object with isValid flag and error message if invalid
 */
export function validateImageFile(
  file: File,
  maxSizeInMB: number = 10
): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)',
    };
  }
  
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `Kích thước file không được quá ${maxSizeInMB}MB`,
    };
  }
  
  return { isValid: true };
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate slug from Vietnamese text
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  const vietnameseMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
  };
  
  let slug = text.toLowerCase();
  
  // Replace Vietnamese characters
  Object.keys(vietnameseMap).forEach((key) => {
    slug = slug.replace(new RegExp(key, 'g'), vietnameseMap[key]);
  });
  
  // Replace spaces and special characters with hyphens
  slug = slug
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return slug;
}

/**
 * Debounce function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Parse price string to number
 * @param priceStr - Price string (may contain commas, currency symbols)
 * @returns Parsed number or null if invalid
 */
export function parsePrice(priceStr: string): number | null {
  const cleaned = priceStr.replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Format villa price according to Facebook style
 * Requirements: 3.3, 12.1, 12.2, 12.3
 * @param price - Price in VND
 * @param guestCount - Number of guests
 * @param roomCount - Optional number of rooms
 * @returns Formatted price string (e.g., "2.500.000đ/15 khách/đêm")
 */
export function formatVillaPrice(
  price: number,
  guestCount: number,
  roomCount?: number
): string {
  // Convert to millions and format
  const priceInMillions = (price / 1000000).toFixed(1);
  const formattedPrice = `${priceInMillions.replace('.', ',')}00.000đ`;
  
  let result = `${formattedPrice}/${guestCount} khách`;
  
  if (roomCount) {
    result += `/${roomCount} phòng`;
  }
  
  result += `/đêm`;
  
  return result;
}

/**
 * Price disclaimer constants
 * Requirements: 3.4, 3.5, 12.4, 12.5
 */
export const PRICE_DISCLAIMERS = {
  seasonal: "Giá tại thời điểm đăng bài, có thay đổi theo mùa",
  holiday: "Giá các ngày Lễ, Tết có thay đổi"
} as const;
