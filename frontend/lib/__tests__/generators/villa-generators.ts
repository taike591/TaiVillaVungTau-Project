/**
 * Property-Based Testing Generators for Villa Data
 * Feature: brand-redesign
 * 
 * These generators create realistic villa data for property-based testing
 * of the brand redesign components and display logic.
 */

import { fc } from '@fast-check/vitest';

/**
 * Villa Code Generator
 * Generates villa codes in format "MS:XXX" where XXX is a number
 */
export const villaCodeArbitrary = fc
  .integer({ min: 1, max: 999 })
  .map(num => `MS:${num}`);

/**
 * Room Count Generators
 * Generates realistic room counts for villas
 */
export const bedroomCountArbitrary = fc.integer({ min: 1, max: 18 });
export const bedCountArbitrary = fc.integer({ min: 1, max: 31 });
export const bathroomCountArbitrary = fc.integer({ min: 1, max: 19 });

/**
 * Bed Configuration Generator
 * Generates bed type configurations like "9 đơn - 5 đôi - 4 ba"
 */
export const bedConfigArbitrary = fc
  .tuple(
    fc.integer({ min: 0, max: 10 }), // single beds
    fc.integer({ min: 0, max: 10 }), // double beds
    fc.integer({ min: 0, max: 5 })   // triple beds
  )
  .filter(([single, double, triple]) => single + double + triple > 0)
  .map(([single, double, triple]) => {
    const parts: string[] = [];
    if (single > 0) parts.push(`${single} đơn`);
    if (double > 0) parts.push(`${double} đôi`);
    if (triple > 0) parts.push(`${triple} ba`);
    return parts.join(' - ');
  });

/**
 * Price Generator
 * Generates realistic villa prices in VND (100,000 to 50,000,000)
 */
export const priceArbitrary = fc.integer({ min: 100000, max: 50000000 })
  .map(price => Math.round(price / 100000) * 100000); // Round to nearest 100k

/**
 * Guest Count Generator
 * Generates realistic guest counts
 */
export const guestCountArbitrary = fc.integer({ min: 2, max: 50 });

/**
 * Vietnamese Address Generator
 * Generates realistic Vietnamese addresses in Vũng Tàu
 */
const streetNames = [
  'Phan Đình Phùng',
  'Phan Văn Trị',
  'La Văn Cầu',
  'Trần Phú',
  'Thùy Vân',
  'Hạ Long',
  'Thi Sách',
  'Lê Lợi',
  'Nguyễn Trãi',
  'Võ Thị Sáu'
];

const areas = [
  'Bãi Sau',
  'Bãi Trước',
  'Bãi Dứa',
  'Thắng Tam',
  'Thắng Nhì',
  'Phường 1',
  'Phường 2',
  'Phường 3'
];

export const addressArbitrary = fc
  .tuple(
    fc.integer({ min: 1, max: 200 }),
    fc.constantFrom(...streetNames)
  )
  .map(([num, street]) => `${num} ${street}`);

export const areaArbitrary = fc.constantFrom(...areas);

/**
 * Distance to Beach Generator
 * Generates realistic distances to beach
 */
export const distanceToBeachArbitrary = fc
  .oneof(
    fc.integer({ min: 50, max: 500 }).map(m => `${m}m`),
    fc.integer({ min: 1, max: 5 }).map(km => `${km}km`),
    fc.constant('100m'),
    fc.constant('200m'),
    fc.constant('500m')
  );

/**
 * Amenities Generator
 * Generates realistic villa amenities
 */
const amenitiesList = [
  'Karaoke',
  'Bi-a',
  'Hồ bơi',
  'Bồn sục',
  'Phòng xông hơi',
  'Máy giặt',
  'Tủ lạnh',
  'Điều hòa',
  'Tivi',
  'Wifi',
  'Bếp đầy đủ',
  'BBQ',
  'Sân vườn',
  'Ban công',
  'Bãi đậu xe'
];

export const amenitiesArbitrary = fc
  .array(fc.constantFrom(...amenitiesList), { minLength: 3, maxLength: 10 })
  .map(arr => [...new Set(arr)]); // Remove duplicates

/**
 * Villa Name Generator
 * Generates realistic villa names (or empty for fallback testing)
 */
const villaNamePrefixes = [
  'Villa',
  'Biệt thự',
  'Nhà phố',
  'Căn hộ',
  'Homestay'
];

const villaNameSuffixes = [
  'Ocean View',
  'Deluxe',
  'Premium',
  'Luxury',
  'Sunset',
  'Paradise',
  'Tropical',
  'Beach',
  'Sea View'
];

export const villaNameArbitrary = fc.oneof(
  fc.tuple(
    fc.constantFrom(...villaNamePrefixes),
    fc.constantFrom(...villaNameSuffixes)
  ).map(([prefix, suffix]) => `${prefix} ${suffix}`),
  fc.constant('') // Empty for fallback testing
);

/**
 * Complete Villa Data Generator
 * Generates a complete villa object with all required fields
 */
export interface VillaData {
  code: string;
  name: string;
  address: string;
  area: string;
  bedroomCount: number;
  bedCount: number;
  bedConfig?: string;
  bathroomCount: number;
  priceWeekday: number;
  priceWeekend?: number;
  guestCount: number;
  distanceToBeach?: string;
  amenities: string[];
  images?: string[];
}

export const villaDataArbitrary: fc.Arbitrary<VillaData> = fc.record({
  code: villaCodeArbitrary,
  name: villaNameArbitrary,
  address: addressArbitrary,
  area: areaArbitrary,
  bedroomCount: bedroomCountArbitrary,
  bedCount: bedCountArbitrary,
  bedConfig: fc.option(bedConfigArbitrary, { nil: undefined }),
  bathroomCount: bathroomCountArbitrary,
  priceWeekday: priceArbitrary,
  priceWeekend: fc.option(priceArbitrary, { nil: undefined }),
  guestCount: guestCountArbitrary,
  distanceToBeach: fc.option(distanceToBeachArbitrary, { nil: undefined }),
  amenities: amenitiesArbitrary,
  images: fc.option(
    fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
    { nil: undefined }
  )
});

/**
 * Villa Data with Missing Name (for fallback testing)
 * Generates villa data where name is always empty
 */
export const villaDataWithoutNameArbitrary: fc.Arbitrary<VillaData> = fc.record({
  code: villaCodeArbitrary,
  name: fc.constant(''),
  address: addressArbitrary,
  area: areaArbitrary,
  bedroomCount: bedroomCountArbitrary,
  bedCount: bedCountArbitrary,
  bedConfig: fc.option(bedConfigArbitrary, { nil: undefined }),
  bathroomCount: bathroomCountArbitrary,
  priceWeekday: priceArbitrary,
  priceWeekend: fc.option(priceArbitrary, { nil: undefined }),
  guestCount: guestCountArbitrary,
  distanceToBeach: fc.option(distanceToBeachArbitrary, { nil: undefined }),
  amenities: amenitiesArbitrary,
  images: fc.option(
    fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
    { nil: undefined }
  )
});

/**
 * Villa Data with Distance to Beach (for distance display testing)
 * Generates villa data where distanceToBeach is always present
 */
export const villaDataWithDistanceArbitrary: fc.Arbitrary<VillaData> = fc.record({
  code: villaCodeArbitrary,
  name: villaNameArbitrary,
  address: addressArbitrary,
  area: areaArbitrary,
  bedroomCount: bedroomCountArbitrary,
  bedCount: bedCountArbitrary,
  bedConfig: fc.option(bedConfigArbitrary, { nil: undefined }),
  bathroomCount: bathroomCountArbitrary,
  priceWeekday: priceArbitrary,
  priceWeekend: fc.option(priceArbitrary, { nil: undefined }),
  guestCount: guestCountArbitrary,
  distanceToBeach: distanceToBeachArbitrary,
  amenities: amenitiesArbitrary,
  images: fc.option(
    fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
    { nil: undefined }
  )
});
