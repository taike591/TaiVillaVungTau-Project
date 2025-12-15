/**
 * Skip Links Component
 * Provides keyboard navigation shortcuts for accessibility
 * Requirements: Accessibility from design
 */

import { skipLinks } from '@/lib/accessibility';

export function SkipLinks() {
  return (
    <div className="skip-links" suppressHydrationWarning>
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
          suppressHydrationWarning
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
