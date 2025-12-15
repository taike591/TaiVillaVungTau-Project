import { describe, it, expect } from 'vitest';
import { fc } from '@fast-check/vitest';
import { propertySchema, contactSchema } from '../validation';

/**
 * Property-Based Tests for Validation Schemas
 * Feature: frontend-enhancement
 * 
 * These tests verify that validation schemas correctly reject invalid data
 * and enforce validation rules across a wide range of inputs.
 */

describe('Validation Schema Property Tests', () => {
  /**
   * Feature: frontend-enhancement, Property 4: Invalid data triggers validation errors
   * Validates: Requirements 1.5
   * 
   * For any form field with invalid data, attempting to validate should
   * return validation errors without accepting the data.
   */
  describe('Property 4: Invalid data triggers validation errors', () => {
    it('should reject property data with invalid code format', () => {
      fc.assert(
        fc.property(
          // Generate strings that violate the code pattern (not uppercase alphanumeric)
          fc.string().filter(s => s.length >= 3 && s.length <= 20 && !/^[A-Z0-9]+$/.test(s)),
          (invalidCode) => {
            const data = {
              code: invalidCode,
              name: 'Valid Property Name',
              description: 'This is a valid description with more than 20 characters',
              area: '100m2',
              priceWeekday: 1000000,
              priceWeekend: 1500000,
              bedroomCount: 3,
              bathroomCount: 2,
              standardGuests: 4,
              maxGuests: 6,
              amenityIds: [],
              images: ['image1.jpg'],
              status: 'ACTIVE' as const,
            };

            const result = propertySchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('code'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject property data with name too short', () => {
      fc.assert(
        fc.property(
          // Generate strings shorter than 5 characters
          fc.string({ minLength: 0, maxLength: 4 }),
          (shortName) => {
            const data = {
              code: 'VILLA01',
              name: shortName,
              description: 'This is a valid description with more than 20 characters',
              area: '100m2',
              priceWeekday: 1000000,
              priceWeekend: 1500000,
              bedroomCount: 3,
              bathroomCount: 2,
              standardGuests: 4,
              maxGuests: 6,
              amenityIds: [],
              images: ['image1.jpg'],
              status: 'ACTIVE' as const,
            };

            const result = propertySchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject property data with description too short', () => {
      fc.assert(
        fc.property(
          // Generate strings shorter than 20 characters
          fc.string({ minLength: 0, maxLength: 19 }),
          (shortDescription) => {
            const data = {
              code: 'VILLA01',
              name: 'Valid Property Name',
              description: shortDescription,
              area: '100m2',
              priceWeekday: 1000000,
              priceWeekend: 1500000,
              bedroomCount: 3,
              bathroomCount: 2,
              standardGuests: 4,
              maxGuests: 6,
              amenityIds: [],
              images: ['image1.jpg'],
              status: 'ACTIVE' as const,
            };

            const result = propertySchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('description'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject property data with invalid price (negative or zero)', () => {
      fc.assert(
        fc.property(
          // Generate non-positive numbers or numbers below minimum
          fc.oneof(
            fc.integer({ max: 0 }),
            fc.integer({ min: 1, max: 99999 })
          ),
          (invalidPrice) => {
            const data = {
              code: 'VILLA01',
              name: 'Valid Property Name',
              description: 'This is a valid description with more than 20 characters',
              area: '100m2',
              priceWeekday: invalidPrice,
              priceWeekend: 1500000,
              bedroomCount: 3,
              bathroomCount: 2,
              standardGuests: 4,
              maxGuests: 6,
              amenityIds: [],
              images: ['image1.jpg'],
              status: 'ACTIVE' as const,
            };

            const result = propertySchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('priceWeekday'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject property data with invalid bedroom count', () => {
      fc.assert(
        fc.property(
          // Generate invalid bedroom counts (non-positive or too large)
          fc.oneof(
            fc.integer({ max: 0 }),
            fc.integer({ min: 21, max: 100 }),
            fc.float() // Non-integer
          ),
          (invalidBedrooms) => {
            const data = {
              code: 'VILLA01',
              name: 'Valid Property Name',
              description: 'This is a valid description with more than 20 characters',
              area: '100m2',
              priceWeekday: 1000000,
              priceWeekend: 1500000,
              bedroomCount: invalidBedrooms,
              bathroomCount: 2,
              standardGuests: 4,
              maxGuests: 6,
              amenityIds: [],
              images: ['image1.jpg'],
              status: 'ACTIVE' as const,
            };

            const result = propertySchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('bedroomCount'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject property data when maxGuests < standardGuests', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 50 }),
          fc.integer({ min: 1, max: 4 }),
          (standardGuests, maxGuests) => {
            const data = {
              code: 'VILLA01',
              name: 'Valid Property Name',
              description: 'This is a valid description with more than 20 characters',
              area: '100m2',
              priceWeekday: 1000000,
              priceWeekend: 1500000,
              bedroomCount: 3,
              bathroomCount: 2,
              standardGuests: standardGuests,
              maxGuests: maxGuests,
              amenityIds: [],
              images: ['image1.jpg'],
              status: 'ACTIVE' as const,
            };

            const result = propertySchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('maxGuests'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: frontend-enhancement, Property 21: Email validation rejects invalid formats
   * Validates: Requirements 6.1
   * 
   * For any string that doesn't match valid email format, the email field
   * validation should fail and display an error message.
   */
  describe('Property 21: Email validation rejects invalid formats', () => {
    it('should reject invalid email formats', () => {
      fc.assert(
        fc.property(
          // Generate strings that are clearly not valid emails
          fc.oneof(
            fc.string().filter(s => s.length > 0 && !s.includes('@')),
            fc.string().filter(s => s.includes('@') && !s.includes('.')),
            fc.constant('invalid@'),
            fc.constant('@invalid.com'),
            fc.constant('invalid@.com'),
            fc.constant('invalid..email@test.com')
          ),
          (invalidEmail) => {
            const data = {
              customerName: 'John Doe',
              phoneNumber: '0123456789',
              email: invalidEmail,
            };

            const result = contactSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept empty string as valid email (optional field)', () => {
      const data = {
        customerName: 'John Doe',
        phoneNumber: '0123456789',
        email: '',
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  /**
   * Feature: frontend-enhancement, Property 22: Phone validation rejects invalid numbers
   * Validates: Requirements 6.2
   * 
   * For any string that doesn't match valid phone number format, the phone field
   * validation should fail and display an error message.
   */
  describe('Property 22: Phone validation rejects invalid numbers', () => {
    it('should reject phone numbers with invalid length', () => {
      fc.assert(
        fc.property(
          // Generate strings with invalid lengths (not 10-11 digits)
          fc.oneof(
            fc.string({ minLength: 0, maxLength: 9 }).filter(s => /^[0-9]*$/.test(s)),
            fc.string({ minLength: 12, maxLength: 20 }).filter(s => /^[0-9]+$/.test(s))
          ),
          (invalidPhone) => {
            const data = {
              customerName: 'John Doe',
              phoneNumber: invalidPhone,
              email: '',
            };

            const result = contactSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('phoneNumber'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject phone numbers with non-numeric characters', () => {
      fc.assert(
        fc.property(
          // Generate strings with letters or special characters
          fc.string({ minLength: 10, maxLength: 11 }).filter(s => !/^[0-9]{10,11}$/.test(s)),
          (invalidPhone) => {
            const data = {
              customerName: 'John Doe',
              phoneNumber: invalidPhone,
              email: '',
            };

            const result = contactSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('phoneNumber'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept valid 10-digit phone numbers', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 10 }).filter(s => /^[0-9]{10}$/.test(s)),
          (validPhone) => {
            const data = {
              customerName: 'John Doe',
              phoneNumber: validPhone,
              email: '',
            };

            const result = contactSchema.safeParse(data);
            expect(result.success).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept valid 11-digit phone numbers', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 11, maxLength: 11 }).filter(s => /^[0-9]{11}$/.test(s)),
          (validPhone) => {
            const data = {
              customerName: 'John Doe',
              phoneNumber: validPhone,
              email: '',
            };

            const result = contactSchema.safeParse(data);
            expect(result.success).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: frontend-enhancement, Property 23: Required fields enforce presence
   * Validates: Requirements 6.3
   * 
   * For any required field, leaving it empty should trigger a validation error
   * with appropriate highlighting.
   */
  describe('Property 23: Required fields enforce presence', () => {
    it('should reject property data with missing required code field', () => {
      const data = {
        // code is missing
        name: 'Valid Property Name',
        description: 'This is a valid description with more than 20 characters',
        area: '100m2',
        priceWeekday: 1000000,
        priceWeekend: 1500000,
        bedroomCount: 3,
        bathroomCount: 2,
        standardGuests: 4,
        maxGuests: 6,
        amenityIds: [],
        images: ['image1.jpg'],
        status: 'ACTIVE' as const,
      };

      const result = propertySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('code'))).toBe(true);
      }
    });

    it('should reject property data with missing required name field', () => {
      const data = {
        code: 'VILLA01',
        // name is missing
        description: 'This is a valid description with more than 20 characters',
        area: '100m2',
        priceWeekday: 1000000,
        priceWeekend: 1500000,
        bedroomCount: 3,
        bathroomCount: 2,
        standardGuests: 4,
        maxGuests: 6,
        amenityIds: [],
        images: ['image1.jpg'],
        status: 'ACTIVE' as const,
      };

      const result = propertySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true);
      }
    });

    it('should reject contact data with missing required customerName field', () => {
      const data = {
        // customerName is missing
        phoneNumber: '0123456789',
        email: '',
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('customerName'))).toBe(true);
      }
    });

    it('should reject contact data with missing required phoneNumber field', () => {
      const data = {
        customerName: 'John Doe',
        // phoneNumber is missing
        email: '',
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('phoneNumber'))).toBe(true);
      }
    });

    it('should reject property data with empty images array', () => {
      const data = {
        code: 'VILLA01',
        name: 'Valid Property Name',
        description: 'This is a valid description with more than 20 characters',
        area: '100m2',
        priceWeekday: 1000000,
        priceWeekend: 1500000,
        bedroomCount: 3,
        bathroomCount: 2,
        standardGuests: 4,
        maxGuests: 6,
        amenityIds: [],
        images: [], // Empty array should fail
        status: 'ACTIVE' as const,
      };

      const result = propertySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('images'))).toBe(true);
      }
    });
  });

  /**
   * Feature: frontend-enhancement, Property 24: Price validation enforces format
   * Validates: Requirements 6.4
   * 
   * For any invalid price input, the validation should fail and display
   * format requirements.
   */
  describe('Property 24: Price validation enforces format', () => {
    it('should reject prices below minimum threshold', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 99999 }),
          (lowPrice) => {
            const data = {
              code: 'VILLA01',
              name: 'Valid Property Name',
              description: 'This is a valid description with more than 20 characters',
              area: '100m2',
              priceWeekday: lowPrice,
              priceWeekend: lowPrice,
              bedroomCount: 3,
              bathroomCount: 2,
              standardGuests: 4,
              maxGuests: 6,
              amenityIds: [],
              images: ['image1.jpg'],
              status: 'ACTIVE' as const,
            };

            const result = propertySchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              const hasPriceError = result.error.issues.some(
                issue => issue.path.includes('priceWeekday') || issue.path.includes('priceWeekend')
              );
              expect(hasPriceError).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject negative prices', () => {
      fc.assert(
        fc.property(
          fc.integer({ max: -1 }),
          (negativePrice) => {
            const data = {
              code: 'VILLA01',
              name: 'Valid Property Name',
              description: 'This is a valid description with more than 20 characters',
              area: '100m2',
              priceWeekday: negativePrice,
              priceWeekend: 1500000,
              bedroomCount: 3,
              bathroomCount: 2,
              standardGuests: 4,
              maxGuests: 6,
              amenityIds: [],
              images: ['image1.jpg'],
              status: 'ACTIVE' as const,
            };

            const result = propertySchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues.some(issue => issue.path.includes('priceWeekday'))).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject zero prices', () => {
      const data = {
        code: 'VILLA01',
        name: 'Valid Property Name',
        description: 'This is a valid description with more than 20 characters',
        area: '100m2',
        priceWeekday: 0,
        priceWeekend: 0,
        bedroomCount: 3,
        bathroomCount: 2,
        standardGuests: 4,
        maxGuests: 6,
        amenityIds: [],
        images: ['image1.jpg'],
        status: 'ACTIVE' as const,
      };

      const result = propertySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const hasPriceError = result.error.issues.some(
          issue => issue.path.includes('priceWeekday') || issue.path.includes('priceWeekend')
        );
        expect(hasPriceError).toBe(true);
      }
    });

    it('should accept valid prices above minimum threshold', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100000, max: 100000000 }),
          (validPrice) => {
            const data = {
              code: 'VILLA01',
              name: 'Valid Property Name',
              description: 'This is a valid description with more than 20 characters',
              area: '100m2',
              priceWeekday: validPrice,
              priceWeekend: validPrice,
              bedroomCount: 3,
              bathroomCount: 2,
              standardGuests: 4,
              maxGuests: 6,
              amenityIds: [],
              images: ['image1.jpg'],
              status: 'ACTIVE' as const,
            };

            const result = propertySchema.safeParse(data);
            expect(result.success).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
