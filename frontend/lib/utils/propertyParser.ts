// lib/utils/propertyParser.ts
// Smart Property Parser - Parses unstructured text and extracts property data

export interface ParsedPropertyData {
  code?: string;
  name?: string;
  description?: string;
  address?: string;
  area?: string;
  priceWeekday?: number;
  priceWeekend?: number;
  standardGuests?: number;
  maxGuests?: number;
  bedroomCount?: number;
  bathroomCount?: number;
  bedCount?: number;
  bedConfig?: string;
  distanceToSea?: string;
  poolArea?: string;
  facebookLink?: string;
  locationId?: number;
  propertyTypeId?: number;
  amenityIds: number[];
  priceNote: string;
}

// Location keywords mapping
const LOCATION_KEYWORDS: Record<number, string[]> = {
  1: ['bãi sau', 'thùy vân', 'phan huy ích', 'lê hồng phong', 'lạc long quân'],
  2: ['bãi trước', 'trần phú', 'quang trung', 'hạ long'],
  3: ['long cung', 'chí linh'],
  4: ['bãi dâu'],
  5: [], // Default
};

// Property type keywords
const PROPERTY_TYPE_KEYWORDS: Record<number, string[]> = {
  1: ['villa'],
  2: ['homestay'],
  3: ['căn hộ', 'chung cư'],
};

// Amenity keywords mapping
const AMENITY_KEYWORDS: Record<number, string[]> = {
  1: ['hồ bơi', 'bể bơi', 'pool'],
  2: ['điều hòa', 'máy lạnh'],
  3: ['wifi', 'internet'],
  4: ['tủ lạnh'],
  5: ['máy giặt'],
  6: ['bếp', 'nhà bếp', 'dụng cụ bếp', 'nồi', 'chảo', 'dụng cụ nhà bếp'],
  7: ['karaoke'],
  8: ['bida', 'bi a', 'bi-a'],
  9: ['bbq', 'nướng', 'lò nướng'],
  10: ['tv', 'tivi', 'smart tv'],
  13: ['đậu xe', 'đỗ xe', 'chỗ đậu', 'parking'],
  14: ['gần biển', 'sát biển'],
  16: ['sân vườn'],
};

/**
 * Parse property code from text (MS:XXX or MS XXX → MSXXX)
 */
function parseCode(text: string): string | undefined {
  const match = text.match(/MS[:\s]?(\d+)/i);
  if (match) {
    return `MS${match[1]}`;
  }
  return undefined;
}

/**
 * Extract name from address line - just the street address part
 * E.g., "📍Địa chỉ: 45/37 Thuỳ Vân (Khu vực bãi sau)" → "45/37 Thuỳ Vân"
 */
function parseName(text: string): string | undefined {
  const addressMatch = text.match(/(?:địa chỉ|📍)[:\s]*([^\n(]+)/i);
  if (addressMatch) {
    let name = addressMatch[1].trim();
    // Remove "Địa chỉ:" prefix if still present
    name = name.replace(/^địa chỉ[:\s]*/i, '').trim();
    // Remove trailing commas and extra spaces
    name = name.replace(/[,].*$/, '').trim();
    return name;
  }
  return undefined;
}

/**
 * Parse full address - clean format without parentheses content
 * E.g., "📍Địa chỉ: 45/37 Thuỳ Vân (Khu vực bãi sau)" → "45/37 Thuỳ Vân"
 */
function parseAddress(text: string): string | undefined {
  const match = text.match(/(?:địa chỉ|📍)[:\s]*([^\n]+)/i);
  if (match) {
    let address = match[1].trim();
    // Remove "Địa chỉ:" prefix if still present
    address = address.replace(/^địa chỉ[:\s]*/i, '').trim();
    // Remove parenthetical notes like "(Khu vực bãi sau)"
    address = address.replace(/\s*\([^)]*\)/g, '').trim();
    return address;
  }
  return undefined;
}

/**
 * Parse price from text
 * Simple approach: find number after "Giá:", multiply by 1,000,000
 * If "x" appears in price, it means 500,000 (e.g., 3.x00.000 = 3,500,000)
 */
function parsePrice(text: string): { weekday?: number; guests?: number } {
  let price: number | undefined;
  
  // Find "Giá:" followed by a digit (the millions part)
  const priceMatch = text.match(/giá[:\s]*(\d)/i);
  if (priceMatch) {
    const basePrice = parseInt(priceMatch[1], 10) * 1000000;
    
    // Check if there's "x" in the price context (means +500,000)
    // Look for patterns like "3.x" or "3,x" or "3x"
    const hasX = text.match(/giá[:\s]*\d[.,]?x/i);
    
    if (hasX) {
      price = basePrice + 500000;
    } else {
      price = basePrice;
    }
  }
  
  // Check for guest count - "/15 khách" or "15 khách"
  const guestMatch = text.match(/\/(\d+)\s*khách/i) || text.match(/(\d{1,2})\s*khách/i);
  const guests = guestMatch ? parseInt(guestMatch[1], 10) : undefined;
  
  return { weekday: price, guests };
}

/**
 * Parse bedroom count - handles "4 phòng ngủ" or "4pn"
 */
function parseBedroomCount(text: string): number | undefined {
  const match = text.match(/(\d+)\s*(?:phòng ngủ|phòng\s*ngủ|pn|bedroom)/i);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Parse bathroom count - handles "4 wc" or "4wc" or "4 WC"
 */
function parseBathroomCount(text: string): number | undefined {
  const match = text.match(/(\d+)\s*(?:wc|toilet|nhà vệ sinh|phòng tắm|vs)/i);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Parse bed count and configuration
 */
function parseBedInfo(text: string): { count?: number; config?: string } {
  const bedMatch = text.match(/(\d+)\s*giường/i);
  const count = bedMatch ? parseInt(bedMatch[1], 10) : undefined;
  
  // Look for bed configuration in parentheses
  const configMatch = text.match(/giường\s*\(([^)]+)\)/i);
  const config = configMatch ? configMatch[1].trim() : undefined;
  
  return { count, config };
}

/**
 * Parse distance to sea - handles "cách biển 700m" or "cách biển bãi sau 700m"
 */
function parseDistanceToSea(text: string): string | undefined {
  // More flexible pattern to handle "cách biển bãi sau 700m"
  const match = text.match(/cách\s+biển[^\d]*(\d+)\s*(?:m|km)/i);
  if (match) {
    const value = match[1];
    const unit = text.toLowerCase().includes('km') ? 'km' : 'm';
    return `${value}${unit}`;
  }
  return undefined;
}

/**
 * Parse pool area - handles "hồ bơi 45m²" or "45m^2" or "45 m2"
 */
function parsePoolArea(text: string): string | undefined {
  // Look for pattern like "45m^2" or "45m²" or "45 m2" near "hồ bơi"
  const match = text.match(/(?:hồ bơi|bể bơi)[^\d]*(\d+)\s*m[²2^\s]/i) ||
                text.match(/(\d+)\s*m[²2^]\s*(?=.*(?:hồ bơi|bể bơi|pool))/i);
  if (match) {
    return `${match[1]}m²`;
  }
  return undefined;
}

/**
 * Extract Facebook link
 */
function parseFacebookLink(text: string): string | undefined {
  const match = text.match(/(https?:\/\/(?:www\.)?facebook\.com\/[^\s]+)/i);
  return match ? match[1] : undefined;
}

/**
 * Detect location ID based on keywords
 */
function detectLocationId(text: string): number {
  const lowerText = text.toLowerCase();
  
  for (const [id, keywords] of Object.entries(LOCATION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return parseInt(id, 10);
      }
    }
  }
  
  return 5; // Default: Trung Tâm
}

/**
 * Detect property type ID based on keywords
 */
function detectPropertyTypeId(text: string): number {
  const lowerText = text.toLowerCase();
  
  for (const [id, keywords] of Object.entries(PROPERTY_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return parseInt(id, 10);
      }
    }
  }
  
  return 1; // Default: Villa
}

/**
 * Detect amenity IDs based on keywords
 * Also auto-detect "Gần biển" (ID 14) if distance to sea is < 500m
 */
function detectAmenityIds(text: string): number[] {
  const lowerText = text.toLowerCase();
  const amenityIds: number[] = [];
  
  // Standard keyword matching
  for (const [id, keywords] of Object.entries(AMENITY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        amenityIds.push(parseInt(id, 10));
        break; // Only add each amenity once
      }
    }
  }
  
  // Auto-detect "Gần biển" (ID 14) if distance to sea is < 500m
  if (!amenityIds.includes(14)) {
    const distanceMatch = lowerText.match(/cách\s+biển[^\d]*(\d+)\s*m/);
    if (distanceMatch) {
      const distance = parseInt(distanceMatch[1], 10);
      if (distance < 500) {
        amenityIds.push(14);
      }
    }
  }
  
  return amenityIds;
}

/**
 * Generate description from original text
 * Use full text but remove "Video dưới bình luận" line
 */
function generateDescription(originalText: string): string {
  let description = originalText;
  
  // Remove lines containing "Video dưới bình luận" or similar
  description = description.replace(/.*video.*bình luận.*/gi, '');
  
  // Remove empty lines that result from the above
  description = description.replace(/\n{3,}/g, '\n\n');
  
  // Trim whitespace
  description = description.trim();
  
  return description;
}

/**
 * Default price note
 */
const DEFAULT_PRICE_NOTE = `⚠️
Giá tại thời điểm đăng bài, có thể tăng giảm theo mùa

🔥 Giá Thứ 6, Thứ 7, Chủ nhật, Lễ, Tết có thay đổi

☎️ Vui lòng liên hệ để có giá chính xác !!`;

/**
 * Main parser function - parses unstructured text and returns structured property data
 */
export function parsePropertyText(text: string): ParsedPropertyData {
  const code = parseCode(text);
  const name = parseName(text);
  const address = parseAddress(text);
  const { weekday: priceWeekday, guests: standardGuests } = parsePrice(text);
  const bedroomCount = parseBedroomCount(text);
  const bathroomCount = parseBathroomCount(text);
  const { count: bedCount, config: bedConfig } = parseBedInfo(text);
  const distanceToSea = parseDistanceToSea(text);
  const poolArea = parsePoolArea(text);
  const facebookLink = parseFacebookLink(text);
  const locationId = detectLocationId(text);
  const propertyTypeId = detectPropertyTypeId(text);
  const amenityIds = detectAmenityIds(text);

  const data: ParsedPropertyData = {
    code,
    name,
    address,
    priceWeekday,
    priceWeekend: priceWeekday ? priceWeekday * 2 : undefined,
    standardGuests,
    maxGuests: standardGuests ? standardGuests + 5 : undefined,
    bedroomCount,
    bathroomCount,
    bedCount,
    bedConfig,
    distanceToSea,
    poolArea,
    facebookLink,
    locationId,
    propertyTypeId,
    amenityIds,
    priceNote: DEFAULT_PRICE_NOTE,
  };

  // Generate description from original text (removing "Video dưới bình luận" line)
  data.description = generateDescription(text);

  return data;
}

/**
 * Validate parsed data - returns list of missing required fields
 */
export function validateParsedData(data: ParsedPropertyData): string[] {
  const missing: string[] = [];
  
  if (!data.code) missing.push('Mã property (MS:XXX)');
  if (!data.name) missing.push('Tên property');
  if (!data.priceWeekday) missing.push('Giá ngày thường');
  if (!data.bedroomCount) missing.push('Số phòng ngủ');
  if (!data.bathroomCount) missing.push('Số WC');
  if (!data.standardGuests) missing.push('Số khách');
  
  return missing;
}
