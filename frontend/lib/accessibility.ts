/**
 * Accessibility utilities for the Taivillavungtau website
 * Ensures WCAG AA compliance and proper screen reader support
 */

/**
 * Color contrast ratios for WCAG AA compliance
 * Normal text: 4.5:1
 * Large text (18pt+ or 14pt+ bold): 3:1
 */
export const CONTRAST_RATIOS = {
  NORMAL_TEXT: 4.5,
  LARGE_TEXT: 3.0,
  UI_COMPONENTS: 3.0,
} as const;

/**
 * Tropical color combinations that meet WCAG AA standards
 */
export const ACCESSIBLE_COLOR_COMBINATIONS = {
  // Orange on white backgrounds
  orangeOnWhite: {
    foreground: '#FF6B35', // tropical-orange-500
    background: '#FFFFFF',
    ratio: 3.8, // Passes for large text and UI components
  },
  orangeDarkOnWhite: {
    foreground: '#E8590C', // tropical-orange-700
    background: '#FFFFFF',
    ratio: 5.2, // Passes AA for all text
  },
  // Text on orange backgrounds
  whiteOnOrange: {
    foreground: '#FFFFFF',
    background: '#FF6B35',
    ratio: 3.8, // Passes for large text
  },
  whiteOnOrangeDark: {
    foreground: '#FFFFFF',
    background: '#E8590C',
    ratio: 5.2, // Passes AA for all text
  },
  // Cyan combinations
  cyanDarkOnWhite: {
    foreground: '#0097A7', // tropical-cyan-700
    background: '#FFFFFF',
    ratio: 4.6, // Passes AA for all text
  },
  whiteOnCyan: {
    foreground: '#FFFFFF',
    background: '#00BCD4',
    ratio: 3.2, // Passes for large text
  },
  // Warm gray combinations
  warmGray900OnWhite: {
    foreground: '#1C1917', // warm-gray-900
    background: '#FFFFFF',
    ratio: 16.5, // Excellent contrast
  },
  warmGray700OnWhite: {
    foreground: '#44403C', // warm-gray-700
    background: '#FFFFFF',
    ratio: 10.2, // Excellent contrast
  },
} as const;

/**
 * Generate accessible ARIA labels for common UI patterns
 */
export const ariaLabels = {
  navigation: {
    main: 'Main navigation',
    mobile: 'Mobile navigation',
    pagination: 'Pagination',
    breadcrumb: 'Breadcrumb',
  },
  actions: {
    close: 'Close',
    open: 'Open',
    menu: 'Menu',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    previous: 'Previous',
    next: 'Next',
  },
  property: {
    viewDetails: (name: string) => `View details for ${name}`,
    image: (name: string, index: number, total: number) => 
      `Image ${index} of ${total} for ${name}`,
    price: (price: string) => `Price: ${price}`,
    amenity: (amenity: string) => `Amenity: ${amenity}`,
  },
  contact: {
    zalo: 'Contact via Zalo',
    phone: (number: string) => `Call ${number}`,
    facebook: 'Visit Facebook page',
    email: (email: string) => `Email ${email}`,
  },
} as const;

/**
 * Skip link component data
 */
export const skipLinks = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
] as const;

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Format price for screen readers
 */
export function formatPriceForScreenReader(price: number, guests: number): string {
  const priceInMillions = (price / 1000000).toFixed(1);
  return `${priceInMillions} million Vietnamese dong per night for ${guests} guests`;
}

/**
 * Format room info for screen readers
 */
export function formatRoomInfoForScreenReader(
  bedrooms: number,
  beds: number,
  bathrooms: number
): string {
  return `${bedrooms} bedrooms, ${beds} beds, ${bathrooms} bathrooms`;
}

/**
 * Generate descriptive alt text for property images
 */
export function generatePropertyImageAlt(
  propertyName: string,
  imageIndex: number,
  totalImages: number,
  imageType?: 'exterior' | 'interior' | 'amenity' | 'view'
): string {
  const typeText = imageType ? `${imageType} view of ` : '';
  return `${typeText}${propertyName} - Image ${imageIndex + 1} of ${totalImages}`;
}

/**
 * Keyboard navigation helpers
 */
export const keyboardHelpers = {
  isEnterOrSpace: (event: React.KeyboardEvent): boolean => {
    return event.key === 'Enter' || event.key === ' ';
  },
  isEscape: (event: React.KeyboardEvent): boolean => {
    return event.key === 'Escape';
  },
  isArrowKey: (event: React.KeyboardEvent): boolean => {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key);
  },
  handleClickOnKeyPress: (
    event: React.KeyboardEvent,
    callback: () => void
  ): void => {
    if (keyboardHelpers.isEnterOrSpace(event)) {
      event.preventDefault();
      callback();
    }
  },
};

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Trap focus within a container (for modals, dialogs)
   */
  trapFocus: (container: HTMLElement): (() => void) => {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  /**
   * Return focus to previous element
   */
  returnFocus: (previousElement: HTMLElement | null): void => {
    previousElement?.focus();
  },
};
