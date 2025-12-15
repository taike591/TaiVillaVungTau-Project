/**
 * Error Handling Utilities Tests
 * Tests for error handling and data validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  hasMissingCode,
  getVillaCode,
  hasMissingName,
  getDisplayName,
  hasMissingPrice,
  hasMissingImages,
  hasMissingAmenities,
  hasMissingDistance,
  getMissingPriceMessage,
  getMissingAmenitiesMessage,
  getMissingImagesMessage,
  validatePropertyData,
  getMainImage,
} from '../error-handling';

describe('Error Handling Utilities', () => {
  describe('Villa Code Handling', () => {
    it('should detect missing code', () => {
      expect(hasMissingCode(undefined)).toBe(true);
      expect(hasMissingCode('')).toBe(true);
      expect(hasMissingCode('   ')).toBe(true);
      expect(hasMissingCode('MS:123')).toBe(false);
    });

    it('should return fallback code for missing code', () => {
      expect(getVillaCode(undefined)).toBe('MS:---');
      expect(getVillaCode('')).toBe('MS:---');
      expect(getVillaCode('   ')).toBe('MS:---');
    });

    it('should return actual code when present', () => {
      expect(getVillaCode('MS:123')).toBe('MS:123');
      expect(getVillaCode('MS:456')).toBe('MS:456');
    });
  });

  describe('Display Name Handling', () => {
    it('should detect missing name', () => {
      expect(hasMissingName(undefined)).toBe(true);
      expect(hasMissingName('')).toBe(true);
      expect(hasMissingName('   ')).toBe(true);
      expect(hasMissingName('Villa ABC')).toBe(false);
    });

    it('should use name when available', () => {
      const property = {
        name: 'Villa Ocean View',
        address: '123 Beach Road',
        code: 'MS:123',
        area: 'Bãi Sau',
      };
      expect(getDisplayName(property)).toBe('Villa Ocean View');
    });

    it('should fallback to address when name is missing', () => {
      const property = {
        name: '',
        address: '123 Beach Road',
        code: 'MS:123',
        area: 'Bãi Sau',
      };
      expect(getDisplayName(property)).toBe('123 Beach Road');
    });

    it('should fallback to code + area when both name and address are missing', () => {
      const property = {
        name: '',
        address: '',
        code: 'MS:123',
        area: 'Bãi Sau',
      };
      expect(getDisplayName(property)).toBe('MS:123 - Bãi Sau');
    });

    it('should use default area when area is missing', () => {
      const property = {
        name: '',
        address: '',
        code: 'MS:123',
      };
      expect(getDisplayName(property)).toBe('MS:123 - Vũng Tàu');
    });
  });

  describe('Price Handling', () => {
    it('should detect missing price', () => {
      expect(hasMissingPrice(undefined)).toBe(true);
      expect(hasMissingPrice(0)).toBe(true);
      expect(hasMissingPrice(-100)).toBe(true);
      expect(hasMissingPrice(1000000)).toBe(false);
    });

    it('should return correct missing price message', () => {
      const message = getMissingPriceMessage();
      expect(message.title).toBe('Liên hệ để biết giá');
      expect(message.subtitle).toContain('0868947734');
      expect(message.subtitle).toContain('Thanh Tài');
    });
  });

  describe('Images Handling', () => {
    it('should detect missing images', () => {
      expect(hasMissingImages(undefined)).toBe(true);
      expect(hasMissingImages([])).toBe(true);
      expect(hasMissingImages(['image1.jpg'])).toBe(false);
    });

    it('should return null for missing images', () => {
      expect(getMainImage(undefined)).toBe(null);
      expect(getMainImage([])).toBe(null);
    });

    it('should return first image when images are strings', () => {
      const images = ['image1.jpg', 'image2.jpg'];
      expect(getMainImage(images)).toBe('image1.jpg');
    });

    it('should return imageUrl from object', () => {
      const images = [
        { id: 1, imageUrl: 'image1.jpg', displayOrder: 1 },
        { id: 2, imageUrl: 'image2.jpg', displayOrder: 2 },
      ];
      expect(getMainImage(images)).toBe('image1.jpg');
    });

    it('should return correct missing images message', () => {
      expect(getMissingImagesMessage()).toBe('Đang cập nhật hình ảnh');
    });
  });

  describe('Amenities Handling', () => {
    it('should detect missing amenities', () => {
      expect(hasMissingAmenities(undefined)).toBe(true);
      expect(hasMissingAmenities([])).toBe(true);
      expect(hasMissingAmenities([{ id: 1, name: 'WiFi' }])).toBe(false);
    });

    it('should return correct missing amenities message', () => {
      expect(getMissingAmenitiesMessage()).toBe('Đang cập nhật tiện ích');
    });
  });

  describe('Distance Handling', () => {
    it('should detect missing distance', () => {
      expect(hasMissingDistance(undefined)).toBe(true);
      expect(hasMissingDistance('')).toBe(true);
      expect(hasMissingDistance('   ')).toBe(true);
      expect(hasMissingDistance('100m')).toBe(false);
    });
  });

  describe('Property Data Validation', () => {
    it('should validate complete property data', () => {
      const property = {
        code: 'MS:123',
        name: 'Villa ABC',
        address: '123 Beach Road',
        priceWeekday: 2000000,
        images: ['image1.jpg'],
        amenities: [{ id: 1, name: 'WiFi' }],
      };
      
      const result = validatePropertyData(property);
      expect(result.isComplete).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it('should detect missing code', () => {
      const property = {
        code: '',
        name: 'Villa ABC',
        priceWeekday: 2000000,
        images: ['image1.jpg'],
        amenities: [{ id: 1, name: 'WiFi' }],
      };
      
      const result = validatePropertyData(property);
      expect(result.isComplete).toBe(false);
      expect(result.missingFields).toContain('code');
    });

    it('should detect missing name/address', () => {
      const property = {
        code: 'MS:123',
        name: '',
        address: '',
        priceWeekday: 2000000,
        images: ['image1.jpg'],
        amenities: [{ id: 1, name: 'WiFi' }],
      };
      
      const result = validatePropertyData(property);
      expect(result.isComplete).toBe(false);
      expect(result.missingFields).toContain('name/address');
    });

    it('should detect missing price', () => {
      const property = {
        code: 'MS:123',
        name: 'Villa ABC',
        priceWeekday: 0,
        images: ['image1.jpg'],
        amenities: [{ id: 1, name: 'WiFi' }],
      };
      
      const result = validatePropertyData(property);
      expect(result.isComplete).toBe(false);
      expect(result.missingFields).toContain('price');
    });

    it('should detect missing images', () => {
      const property = {
        code: 'MS:123',
        name: 'Villa ABC',
        priceWeekday: 2000000,
        images: [],
        amenities: [{ id: 1, name: 'WiFi' }],
      };
      
      const result = validatePropertyData(property);
      expect(result.isComplete).toBe(false);
      expect(result.missingFields).toContain('images');
    });

    it('should detect missing amenities', () => {
      const property = {
        code: 'MS:123',
        name: 'Villa ABC',
        priceWeekday: 2000000,
        images: ['image1.jpg'],
        amenities: [],
      };
      
      const result = validatePropertyData(property);
      expect(result.isComplete).toBe(false);
      expect(result.missingFields).toContain('amenities');
    });

    it('should detect multiple missing fields', () => {
      const property = {
        code: '',
        name: '',
        priceWeekday: 0,
        images: [],
        amenities: [],
      };
      
      const result = validatePropertyData(property);
      expect(result.isComplete).toBe(false);
      expect(result.missingFields.length).toBeGreaterThan(1);
    });
  });
});
