/**
 * Accessibility Utilities Tests
 * Task 18: Accessibility Implementation
 */

import { describe, it, expect } from 'vitest';
import {
  ACCESSIBLE_COLOR_COMBINATIONS,
  ariaLabels,
  skipLinks,
  formatPriceForScreenReader,
  formatRoomInfoForScreenReader,
  generatePropertyImageAlt,
  keyboardHelpers,
} from '../accessibility';

describe('Accessibility Utilities', () => {
  describe('Color Combinations', () => {
    it('should have accessible color combinations defined', () => {
      expect(ACCESSIBLE_COLOR_COMBINATIONS.orangeDarkOnWhite.ratio).toBeGreaterThanOrEqual(4.5);
      expect(ACCESSIBLE_COLOR_COMBINATIONS.whiteOnOrangeDark.ratio).toBeGreaterThanOrEqual(4.5);
      expect(ACCESSIBLE_COLOR_COMBINATIONS.cyanDarkOnWhite.ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have color combinations with proper structure', () => {
      const combo = ACCESSIBLE_COLOR_COMBINATIONS.orangeDarkOnWhite;
      expect(combo).toHaveProperty('foreground');
      expect(combo).toHaveProperty('background');
      expect(combo).toHaveProperty('ratio');
    });
  });

  describe('ARIA Labels', () => {
    it('should have navigation labels', () => {
      expect(ariaLabels.navigation.main).toBe('Main navigation');
      expect(ariaLabels.navigation.mobile).toBe('Mobile navigation');
    });

    it('should have action labels', () => {
      expect(ariaLabels.actions.close).toBe('Close');
      expect(ariaLabels.actions.menu).toBe('Menu');
    });

    it('should generate property-specific labels', () => {
      const label = ariaLabels.property.viewDetails('Ocean Villa');
      expect(label).toBe('View details for Ocean Villa');
    });

    it('should generate image labels with context', () => {
      const label = ariaLabels.property.image('Beach Villa', 1, 5);
      expect(label).toBe('Image 1 of 5 for Beach Villa');
    });
  });

  describe('Skip Links', () => {
    it('should have skip links defined', () => {
      expect(skipLinks).toHaveLength(3);
      expect(skipLinks[0].href).toBe('#main-content');
      expect(skipLinks[1].href).toBe('#navigation');
      expect(skipLinks[2].href).toBe('#footer');
    });

    it('should have descriptive labels', () => {
      expect(skipLinks[0].label).toBe('Skip to main content');
    });
  });

  describe('Screen Reader Formatting', () => {
    it('should format price for screen readers', () => {
      const formatted = formatPriceForScreenReader(5000000, 10);
      expect(formatted).toContain('5.0 million');
      expect(formatted).toContain('10 guests');
    });

    it('should format room info for screen readers', () => {
      const formatted = formatRoomInfoForScreenReader(4, 6, 3);
      expect(formatted).toBe('4 bedrooms, 6 beds, 3 bathrooms');
    });
  });

  describe('Image Alt Text Generation', () => {
    it('should generate basic alt text', () => {
      const alt = generatePropertyImageAlt('Ocean Villa', 0, 5);
      expect(alt).toBe('Ocean Villa - Image 1 of 5');
    });

    it('should include image type when provided', () => {
      const alt = generatePropertyImageAlt('Beach House', 2, 10, 'exterior');
      expect(alt).toBe('exterior view of Beach House - Image 3 of 10');
    });

    it('should handle different image types', () => {
      const types: Array<'exterior' | 'interior' | 'amenity' | 'view'> = [
        'exterior',
        'interior',
        'amenity',
        'view',
      ];

      types.forEach((type) => {
        const alt = generatePropertyImageAlt('Villa', 0, 1, type);
        expect(alt).toContain(type);
      });
    });
  });

  describe('Keyboard Helpers', () => {
    it('should detect Enter key', () => {
      const event = { key: 'Enter' } as React.KeyboardEvent;
      expect(keyboardHelpers.isEnterOrSpace(event)).toBe(true);
    });

    it('should detect Space key', () => {
      const event = { key: ' ' } as React.KeyboardEvent;
      expect(keyboardHelpers.isEnterOrSpace(event)).toBe(true);
    });

    it('should detect Escape key', () => {
      const event = { key: 'Escape' } as React.KeyboardEvent;
      expect(keyboardHelpers.isEscape(event)).toBe(true);
    });

    it('should detect arrow keys', () => {
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      keys.forEach((key) => {
        const event = { key } as React.KeyboardEvent;
        expect(keyboardHelpers.isArrowKey(event)).toBe(true);
      });
    });

    it('should not detect non-arrow keys as arrow keys', () => {
      const event = { key: 'Enter' } as React.KeyboardEvent;
      expect(keyboardHelpers.isArrowKey(event)).toBe(false);
    });
  });
});
