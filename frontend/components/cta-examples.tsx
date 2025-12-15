/**
 * CTA Components Usage Examples
 * 
 * This file demonstrates how to use the CTA components in different contexts.
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { CTASection } from "./cta-section";
import { ZaloCTAButton } from "./zalo-cta-button";

export function CTAExamples() {
  return (
    <div className="space-y-12 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Full CTA Section (Default)</h2>
        <p className="text-gray-600 mb-4">
          Use this for dedicated CTA sections on pages like homepage, properties listing, etc.
        </p>
        <CTASection />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Compact CTA Section</h2>
        <p className="text-gray-600 mb-4">
          Use this for inline CTAs within content sections.
        </p>
        <CTASection variant="compact" />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Zalo CTA Buttons</h2>
        <p className="text-gray-600 mb-4">
          Use these for quick contact actions in various contexts.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Default Button</h3>
            <ZaloCTAButton />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Compact Button (for navbar, cards)</h3>
            <ZaloCTAButton variant="compact" />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Icon Only Button</h3>
            <ZaloCTAButton variant="icon" />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Different Sizes</h3>
            <div className="flex items-center gap-4">
              <ZaloCTAButton variant="compact" size="sm" />
              <ZaloCTAButton variant="compact" size="default" />
              <ZaloCTAButton variant="compact" size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Full CTA Section:</strong> Use on homepage, bottom of property listings, 
            or as a standalone section to drive conversions.
          </li>
          <li>
            <strong>Compact CTA:</strong> Use within content areas, sidebars, or between sections 
            where space is limited.
          </li>
          <li>
            <strong>Default Button:</strong> Use in forms, property detail pages, or anywhere 
            you need a prominent call-to-action.
          </li>
          <li>
            <strong>Compact Button:</strong> Use in navigation bars, property cards, or inline 
            within text content.
          </li>
          <li>
            <strong>Icon Button:</strong> Use in tight spaces like mobile menus, floating action 
            buttons, or as secondary actions.
          </li>
        </ul>
      </div>
    </div>
  );
}
