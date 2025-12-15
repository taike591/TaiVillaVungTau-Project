# Property-Based Testing Infrastructure

## Overview

This directory contains the property-based testing infrastructure for the brand redesign feature. Property-based testing (PBT) validates that our code satisfies universal properties across a wide range of randomly generated inputs.

## Structure

```
__tests__/
├── generators/
│   └── villa-generators.ts      # Data generators for villa objects
├── utils/
│   └── test-helpers.ts          # Helper functions for testing
├── villa-display.property.test.ts  # Property tests for villa display
└── README.md                    # This file
```

## Generators

### Villa Data Generators (`generators/villa-generators.ts`)

Provides arbitraries (generators) for creating realistic villa data:

- **`villaCodeArbitrary`**: Generates villa codes in format "MS:XXX"
- **`bedroomCountArbitrary`**: Generates bedroom counts (1-18)
- **`bedCountArbitrary`**: Generates bed counts (1-31)
- **`bathroomCountArbitrary`**: Generates bathroom counts (1-19)
- **`bedConfigArbitrary`**: Generates bed configurations like "9 đơn - 5 đôi - 4 ba"
- **`priceArbitrary`**: Generates realistic prices (100,000 - 50,000,000 VND)
- **`guestCountArbitrary`**: Generates guest counts (2-50)
- **`addressArbitrary`**: Generates Vietnamese addresses in Vũng Tàu
- **`areaArbitrary`**: Generates area names (Bãi Sau, Bãi Trước, etc.)
- **`distanceToBeachArbitrary`**: Generates distances to beach
- **`amenitiesArbitrary`**: Generates lists of villa amenities
- **`villaNameArbitrary`**: Generates villa names (or empty for fallback testing)

### Complete Villa Generators

- **`villaDataArbitrary`**: Generates complete villa objects with all fields
- **`villaDataWithoutNameArbitrary`**: Generates villas with empty names (for fallback testing)
- **`villaDataWithDistanceArbitrary`**: Generates villas with distance to beach always present

## Test Helpers (`utils/test-helpers.ts`)

Provides utility functions for testing villa display logic:

### Formatting Functions

- **`formatPrice(price, guestCount, roomCount?)`**: Formats price in Facebook style
- **`formatRoomInfo(bedroomCount, bedCount, bathroomCount, bedConfig?)`**: Formats room information
- **`formatDistanceToBeach(distance, area)`**: Formats distance to beach
- **`getVillaDisplayName(villa)`**: Gets display name with fallback logic

### Validation Functions

- **`containsVillaCode(text, code)`**: Checks if text contains villa code
- **`containsRoomInfo(text, bedroomCount, bedCount, bathroomCount)`**: Checks if text contains all room info
- **`containsPriceFormat(text, price, guestCount)`**: Checks if text contains properly formatted price
- **`containsSeasonalDisclaimer(text)`**: Checks for seasonal price disclaimer
- **`containsHolidayDisclaimer(text)`**: Checks for holiday price disclaimer
- **`containsCompleteAddress(text, address, area)`**: Checks for complete address
- **`containsDistanceToBeach(text, distance)`**: Checks for distance to beach
- **`containsAllAmenities(text, amenities)`**: Checks if all amenities are present
- **`containsCheckInOutInfo(text)`**: Checks for check-in/check-out information

### Constants

- **`PRICE_DISCLAIMERS`**: Standard price disclaimer texts
- **`CHECK_IN_OUT`**: Check-in/check-out time constants

## Property Tests

### Villa Display Property Tests (`villa-display.property.test.ts`)

Tests the 10 correctness properties defined in the design document:

1. **Property 1: Villa Code Display** - Villa codes always displayed in format "MS:XXX"
2. **Property 2: Complete Room Information Display** - All room info fields present
3. **Property 3: Price Format and Labels Consistency** - Prices formatted correctly with labels
4. **Property 4: Seasonal Price Disclaimer Presence** - Seasonal disclaimer always present
5. **Property 5: Holiday Price Disclaimer Presence** - Holiday disclaimer always present
6. **Property 6: Complete Address Display** - Both address and area displayed
7. **Property 7: Beach Distance Display** - Distance to beach displayed when available
8. **Property 8: Complete Amenities List Display** - All amenities displayed
9. **Property 9: Check-in/Check-out Information Display** - Check-in/out times displayed
10. **Property 10: Address Fallback for Missing Name** - Address used when name is empty

Each property test runs **100 iterations** with randomly generated data.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run only property tests
npm test villa-display.property

# Run with coverage
npm test -- --coverage
```

## Configuration

Tests are configured in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

## Writing New Property Tests

### 1. Create a Generator

```typescript
// In generators/villa-generators.ts
export const myDataArbitrary = fc.record({
  field1: fc.string(),
  field2: fc.integer({ min: 1, max: 100 }),
});
```

### 2. Create Helper Functions

```typescript
// In utils/test-helpers.ts
export function formatMyData(data: MyData): string {
  return `${data.field1}: ${data.field2}`;
}
```

### 3. Write Property Test

```typescript
// In your-feature.property.test.ts
describe('Property X: Your Property Name', () => {
  it('should satisfy the property', () => {
    fc.assert(
      fc.property(myDataArbitrary, (data) => {
        const result = formatMyData(data);
        expect(result).toContain(data.field1);
      }),
      { numRuns: 100 }
    );
  });
});
```

### 4. Tag Your Test

Always include a comment tag:

```typescript
/**
 * Feature: brand-redesign, Property X: Your Property Name
 * Validates: Requirements X.Y
 * 
 * Description of what this property validates
 */
```

## Best Practices

1. **Use Realistic Constraints**: Generators should produce realistic data that matches actual use cases
2. **Test One Property at a Time**: Each test should validate a single property
3. **Use Descriptive Names**: Test names should clearly describe what property is being tested
4. **Run Enough Iterations**: Use at least 100 iterations (configured with `numRuns`)
5. **Filter Invalid Inputs**: Use `.filter()` to exclude invalid data from generators
6. **Document Properties**: Always include comments linking to requirements

## Troubleshooting

### Tests Failing with Random Data

If tests fail intermittently:

1. Check the failing example in the test output
2. Verify your generator constraints are correct
3. Ensure your property is actually universal
4. Consider if you need to filter out edge cases

### Slow Test Execution

If tests are slow:

1. Reduce `numRuns` during development (increase for CI)
2. Simplify complex generators
3. Use `.filter()` sparingly (it can slow down generation)

### Type Errors

If you get TypeScript errors:

1. Ensure generators match your data types
2. Use `fc.record()` for object types
3. Import types from generators: `import type { VillaData } from './generators/villa-generators'`

## Resources

- [fast-check Documentation](https://fast-check.dev/)
- [@fast-check/vitest Integration](https://github.com/dubzzz/fast-check/tree/main/packages/vitest)
- [Property-Based Testing Guide](https://fast-check.dev/docs/introduction/)
- [Brand Redesign Design Document](../../.kiro/specs/brand-redesign/design.md)

## Contributing

When adding new property tests:

1. Add generators to `generators/villa-generators.ts`
2. Add helper functions to `utils/test-helpers.ts`
3. Create test file following naming convention: `feature-name.property.test.ts`
4. Document your tests with proper comments and tags
5. Run tests to ensure they pass: `npm test`
6. Update this README if adding new patterns or utilities
