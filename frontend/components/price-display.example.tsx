/**
 * PriceDisplay Component Examples
 * 
 * This file demonstrates the usage of the PriceDisplay component
 * with different variants and configurations.
 */

import { PriceDisplay } from './price-display';

export function PriceDisplayExamples() {
  return (
    <div className="space-y-8 p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">PriceDisplay Component Examples</h1>

      {/* Example 1: Default variant with weekend price */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Default Variant (with weekend price)</h2>
        <PriceDisplay
          weekdayPrice={2500000}
          weekendPrice={3000000}
          guestCount={15}
          roomCount={4}
          variant="default"
        />
      </div>

      {/* Example 2: Detailed variant with disclaimers */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Detailed Variant (with disclaimers)</h2>
        <PriceDisplay
          weekdayPrice={4500000}
          weekendPrice={5500000}
          guestCount={30}
          roomCount={8}
          variant="detailed"
        />
      </div>

      {/* Example 3: Compact variant */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Compact Variant</h2>
        <PriceDisplay
          weekdayPrice={1800000}
          guestCount={10}
          variant="compact"
        />
      </div>

      {/* Example 4: Without room count */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Without Room Count</h2>
        <PriceDisplay
          weekdayPrice={3200000}
          weekendPrice={3800000}
          guestCount={20}
          variant="detailed"
        />
      </div>

      {/* Example 5: Without weekend price */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Without Weekend Price</h2>
        <PriceDisplay
          weekdayPrice={2000000}
          guestCount={12}
          roomCount={3}
          variant="detailed"
        />
      </div>

      {/* Example 6: High-end villa */}
      <div>
        <h2 className="text-xl font-semibold mb-3">High-End Villa</h2>
        <PriceDisplay
          weekdayPrice={8000000}
          weekendPrice={10000000}
          guestCount={50}
          roomCount={15}
          variant="detailed"
        />
      </div>
    </div>
  );
}

/**
 * Usage in Property Card:
 * 
 * <PriceDisplay
 *   weekdayPrice={property.priceWeekday}
 *   weekendPrice={property.priceWeekend}
 *   guestCount={property.standardGuests}
 *   roomCount={property.bedroomCount}
 *   variant="detailed"
 * />
 */

/**
 * Usage in Property Detail Page:
 * 
 * <PriceDisplay
 *   weekdayPrice={property.priceWeekday}
 *   weekendPrice={property.priceWeekend}
 *   guestCount={property.standardGuests}
 *   roomCount={property.bedroomCount}
 *   variant="detailed"
 *   className="mb-6"
 * />
 */
