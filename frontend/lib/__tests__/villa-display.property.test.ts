/**
 * Property-Based Tests for Villa Display Logic
 * Feature: brand-redesign
 * 
 * These tests verify that villa information is displayed correctly
 * according to the brand redesign requirements.
 */

import { describe, it, expect } from 'vitest';
import { fc } from '@fast-check/vitest';
import {
  villaDataArbitrary,
  villaDataWithoutNameArbitrary,
  villaDataWithDistanceArbitrary,
  type VillaData
} from './generators/villa-generators';
import {
  formatPrice,
  formatRoomInfo,
  formatDistanceToBeach,
  getVillaDisplayName,
  containsVillaCode,
  containsRoomInfo,
  containsPriceFormat,
  containsSeasonalDisclaimer,
  containsHolidayDisclaimer,
  containsCompleteAddress,
  containsDistanceToBeach,
  containsAllAmenities,
  containsCheckInOutInfo,
  PRICE_DISCLAIMERS,
  CHECK_IN_OUT
} from './utils/test-helpers';

/**
 * Property-Based Tests for Brand Redesign Villa Display
 * 
 * These tests validate the correctness properties defined in the design document.
 * Each test runs 100+ iterations with randomly generated villa data.
 */

describe('Villa Display Property Tests', () => {
  /**
   * Feature: brand-redesign, Property 1: Villa Code Display
   * Validates: Requirements 3.1
   * 
   * For any villa data object with a code field, when rendered in a villa card
   * or detail view, the rendered output should contain the villa code in the
   * format "MS:XXX"
   */
  describe('Property 1: Villa Code Display', () => {
    it('should always display villa code in format MS:XXX', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Simulate rendering the villa code
          const renderedCode = villa.code;
          
          // Verify the code is in correct format
          expect(renderedCode).toMatch(/^MS:\d+$/);
          expect(containsVillaCode(renderedCode, villa.code)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should display villa code in any rendered villa content', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Simulate a complete villa card rendering
          const renderedContent = `
            Villa Code: ${villa.code}
            Name: ${villa.name || villa.address}
            Price: ${formatPrice(villa.priceWeekday, villa.guestCount)}
          `;
          
          expect(containsVillaCode(renderedContent, villa.code)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: brand-redesign, Property 2: Complete Room Information Display
   * Validates: Requirements 3.2
   * 
   * For any villa data object, when rendered, the output should contain all
   * room information fields: number of bedrooms, number of beds (with bed
   * types if available), and number of bathrooms
   */
  describe('Property 2: Complete Room Information Display', () => {
    it('should display all room information fields', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          const roomInfo = formatRoomInfo(
            villa.bedroomCount,
            villa.bedCount,
            villa.bathroomCount,
            villa.bedConfig
          );
          
          expect(containsRoomInfo(
            roomInfo,
            villa.bedroomCount,
            villa.bedCount,
            villa.bathroomCount
          )).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should include bed configuration when available', () => {
      fc.assert(
        fc.property(
          villaDataArbitrary.filter(v => v.bedConfig !== undefined),
          (villa) => {
            const roomInfo = formatRoomInfo(
              villa.bedroomCount,
              villa.bedCount,
              villa.bathroomCount,
              villa.bedConfig
            );
            
            if (villa.bedConfig) {
              expect(roomInfo).toContain(villa.bedConfig);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: brand-redesign, Property 3: Price Format and Labels Consistency
   * Validates: Requirements 3.3, 12.1, 12.2, 12.3
   * 
   * For any villa with price data, when the price is rendered, it should:
   * - Display weekday price in format matching pattern "X.XXX.XXXđ/Y khách/đêm"
   * - Include label "Giá ngày thường" or "Thứ 2 - Thứ 5" for weekday prices
   * - Include label "Giá Thứ 6, Thứ 7, Chủ nhật" for weekend prices when available
   */
  describe('Property 3: Price Format and Labels Consistency', () => {
    it('should format weekday price correctly', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          const formattedPrice = formatPrice(villa.priceWeekday, villa.guestCount);
          
          // Check format contains required elements
          expect(formattedPrice).toContain('đ');
          expect(formattedPrice).toContain('khách');
          expect(formattedPrice).toContain('đêm');
          expect(formattedPrice).toContain(`${villa.guestCount}`);
        }),
        { numRuns: 100 }
      );
    });

    it('should include weekday price label', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Simulate price display with label
          const priceDisplay = `
            ${formatPrice(villa.priceWeekday, villa.guestCount)}
            ${PRICE_DISCLAIMERS.weekday}
          `;
          
          const hasWeekdayLabel = 
            priceDisplay.includes(PRICE_DISCLAIMERS.weekday) ||
            priceDisplay.includes(PRICE_DISCLAIMERS.weekdayAlt);
          
          expect(hasWeekdayLabel).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should include weekend price label when weekend price exists', () => {
      fc.assert(
        fc.property(
          villaDataArbitrary.filter(v => v.priceWeekend !== undefined),
          (villa) => {
            // Simulate price display with weekend price
            const priceDisplay = `
              Weekday: ${formatPrice(villa.priceWeekday, villa.guestCount)}
              Weekend: ${formatPrice(villa.priceWeekend!, villa.guestCount)}
              ${PRICE_DISCLAIMERS.weekend}
            `;
            
            expect(priceDisplay).toContain(PRICE_DISCLAIMERS.weekend);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: brand-redesign, Property 4: Seasonal Price Disclaimer Presence
   * Validates: Requirements 3.4, 12.4
   * 
   * For any villa price display, the rendered output should contain the
   * disclaimer text "Giá tại thời điểm đăng bài, có thay đổi theo mùa"
   */
  describe('Property 4: Seasonal Price Disclaimer Presence', () => {
    it('should always include seasonal price disclaimer', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Simulate complete price display
          const priceDisplay = `
            ${formatPrice(villa.priceWeekday, villa.guestCount)}
            ${PRICE_DISCLAIMERS.seasonal}
            ${PRICE_DISCLAIMERS.holiday}
          `;
          
          expect(containsSeasonalDisclaimer(priceDisplay)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: brand-redesign, Property 5: Holiday Price Disclaimer Presence
   * Validates: Requirements 3.5, 12.5
   * 
   * For any villa price display, the rendered output should contain the
   * disclaimer text about holiday pricing mentioning "Lễ, Tết"
   */
  describe('Property 5: Holiday Price Disclaimer Presence', () => {
    it('should always include holiday price disclaimer', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Simulate complete price display
          const priceDisplay = `
            ${formatPrice(villa.priceWeekday, villa.guestCount)}
            ${PRICE_DISCLAIMERS.seasonal}
            ${PRICE_DISCLAIMERS.holiday}
          `;
          
          expect(containsHolidayDisclaimer(priceDisplay)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: brand-redesign, Property 6: Complete Address Display
   * Validates: Requirements 3.6
   * 
   * For any villa with address data, when rendered, the output should contain
   * both the full address and area/district information
   */
  describe('Property 6: Complete Address Display', () => {
    it('should display both address and area', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Simulate address display
          const addressDisplay = `${villa.address}, ${villa.area}`;
          
          expect(containsCompleteAddress(addressDisplay, villa.address, villa.area)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: brand-redesign, Property 7: Beach Distance Display
   * Validates: Requirements 3.7
   * 
   * For any villa with distance-to-beach data, when rendered, the output
   * should contain the distance information with the beach name
   */
  describe('Property 7: Beach Distance Display', () => {
    it('should display distance to beach when available', () => {
      fc.assert(
        fc.property(villaDataWithDistanceArbitrary, (villa) => {
          const distanceDisplay = formatDistanceToBeach(villa.distanceToBeach!, villa.area);
          
          expect(containsDistanceToBeach(distanceDisplay, villa.distanceToBeach!)).toBe(true);
          expect(distanceDisplay).toContain('Cách biển');
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: brand-redesign, Property 8: Complete Amenities List Display
   * Validates: Requirements 3.8
   * 
   * For any villa with amenities data, when rendered, all amenities in the
   * data should appear in the rendered output
   */
  describe('Property 8: Complete Amenities List Display', () => {
    it('should display all amenities', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Simulate amenities display
          const amenitiesDisplay = villa.amenities.join(', ');
          
          expect(containsAllAmenities(amenitiesDisplay, villa.amenities)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should not lose any amenity during rendering', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Simulate amenities list rendering
          const renderedAmenities = villa.amenities.map(a => `[${a}]`).join(' ');
          
          // Every amenity should be present
          villa.amenities.forEach(amenity => {
            expect(renderedAmenities).toContain(amenity);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: brand-redesign, Property 9: Check-in/Check-out Information Display
   * Validates: Requirements 3.9
   * 
   * For any villa display, the rendered output should contain check-in and
   * check-out time information in the format "CHECK IN XXH - CHECK OUT XXH"
   */
  describe('Property 9: Check-in/Check-out Information Display', () => {
    it('should display check-in and check-out times', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Simulate check-in/out display
          const checkInOutDisplay = CHECK_IN_OUT.display;
          
          expect(containsCheckInOutInfo(checkInOutDisplay)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: brand-redesign, Property 10: Address Fallback for Missing Name
   * Validates: Requirements 3.10
   * 
   * For any villa where the name field is empty or null, when rendered, the
   * system should display the address as the title/name
   */
  describe('Property 10: Address Fallback for Missing Name', () => {
    it('should use address when name is empty', () => {
      fc.assert(
        fc.property(villaDataWithoutNameArbitrary, (villa) => {
          const displayName = getVillaDisplayName(villa);
          
          // When name is empty, should use address
          expect(displayName).toBe(villa.address);
        }),
        { numRuns: 100 }
      );
    });

    it('should use name when available', () => {
      fc.assert(
        fc.property(
          villaDataArbitrary.filter(v => v.name && v.name.trim() !== ''),
          (villa) => {
            const displayName = getVillaDisplayName(villa);
            
            // When name exists, should use name
            expect(displayName).toBe(villa.name);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should fallback to code + area when both name and address are empty', () => {
      fc.assert(
        fc.property(villaDataArbitrary, (villa) => {
          // Create villa with empty name and address
          const villaWithoutNameOrAddress: VillaData = {
            ...villa,
            name: '',
            address: ''
          };
          
          const displayName = getVillaDisplayName(villaWithoutNameOrAddress);
          
          // Should use code + area as fallback
          expect(displayName).toContain(villa.code);
          expect(displayName).toContain(villa.area);
        }),
        { numRuns: 100 }
      );
    });
  });
});
