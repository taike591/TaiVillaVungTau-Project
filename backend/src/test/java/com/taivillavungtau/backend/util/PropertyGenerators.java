package com.taivillavungtau.backend.util;

import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.enums.LocationType;
import net.jqwik.api.Arbitraries;
import net.jqwik.api.Arbitrary;
import net.jqwik.api.Combinators;
import net.jqwik.api.Provide;

import java.math.BigDecimal;
import java.util.Set;

/**
 * Property generators for jqwik property-based testing
 * Provides Arbitrary instances for generating random test data
 */
public class PropertyGenerators {

    /**
     * Generates valid price values for properties
     * Range: 500,000 to 50,000,000 VND
     * @return Arbitrary<BigDecimal> for property prices
     */
    @Provide
    public static Arbitrary<BigDecimal> validPrices() {
        return Arbitraries.bigDecimals()
                .between(BigDecimal.valueOf(500000), BigDecimal.valueOf(50000000))
                .ofScale(0);
    }

    /**
     * Generates valid property codes (e.g., "MS123", "VL456")
     * Format: 2 uppercase letters + 1-3 digits
     * @return Arbitrary<String> for property codes
     */
    @Provide
    public static Arbitrary<String> validPropertyCodes() {
        return Combinators.combine(
                Arbitraries.strings().withCharRange('A', 'Z').ofLength(2),
                Arbitraries.integers().between(1, 999)
        ).as((prefix, number) -> prefix + number);
    }

    /**
     * Generates valid bedroom counts
     * Range: 1 to 10 bedrooms
     * @return Arbitrary<Integer> for bedroom counts
     */
    @Provide
    public static Arbitrary<Integer> validBedroomCounts() {
        return Arbitraries.integers().between(1, 10);
    }

    /**
     * Generates valid bathroom counts
     * Range: 1 to 8 bathrooms
     * @return Arbitrary<Integer> for bathroom counts
     */
    @Provide
    public static Arbitrary<Integer> validBathroomCounts() {
        return Arbitraries.integers().between(1, 8);
    }

    /**
     * Generates valid guest counts
     * Range: 1 to 20 guests
     * @return Arbitrary<Integer> for guest counts
     */
    @Provide
    public static Arbitrary<Integer> validGuestCounts() {
        return Arbitraries.integers().between(1, 20);
    }

    /**
     * Generates valid location types
     * @return Arbitrary<LocationType> for property locations
     */
    @Provide
    public static Arbitrary<LocationType> validLocationTypes() {
        return Arbitraries.of(LocationType.class);
    }

    /**
     * Generates valid property search requests with consistent constraints
     * Ensures minPrice <= maxPrice and other logical constraints
     * @return Arbitrary<PropertySearchRequest> for search testing
     */
    @Provide
    public static Arbitrary<PropertySearchRequest> searchRequests() {
        return Combinators.combine(
                validPrices(),
                validPrices(),
                validBedroomCounts(),
                validLocationTypes()
        ).as((price1, price2, bedrooms, location) -> {
            PropertySearchRequest req = new PropertySearchRequest();
            
            // Ensure minPrice <= maxPrice
            BigDecimal minPrice = price1.min(price2);
            BigDecimal maxPrice = price1.max(price2);
            
            req.setMinPrice(minPrice);
            req.setMaxPrice(maxPrice);
            req.setMinBedroom(bedrooms);
            req.setLocation(location);
            
            return req;
        });
    }

    /**
     * Generates valid sets of amenity IDs
     * Range: 1 to 10 amenity IDs
     * @return Arbitrary<Set<Long>> for amenity ID sets
     */
    @Provide
    public static Arbitrary<Set<Long>> amenityIdSets() {
        return Arbitraries.longs()
                .between(1L, 100L)
                .set()
                .ofMinSize(1)
                .ofMaxSize(10);
    }

    /**
     * Generates valid page numbers
     * Range: 0 to 99 (0-indexed)
     * @return Arbitrary<Integer> for page numbers
     */
    @Provide
    public static Arbitrary<Integer> validPageNumbers() {
        return Arbitraries.integers().between(0, 99);
    }

    /**
     * Generates valid page sizes
     * Range: 1 to 100 items per page
     * @return Arbitrary<Integer> for page sizes
     */
    @Provide
    public static Arbitrary<Integer> validPageSizes() {
        return Arbitraries.integers().between(1, 100);
    }

    /**
     * Generates valid non-empty strings for names and descriptions
     * Length: 1 to 100 characters
     * @return Arbitrary<String> for text fields
     */
    @Provide
    public static Arbitrary<String> validTextFields() {
        return Arbitraries.strings()
                .alpha()
                .numeric()
                .withChars(' ', '-', '_')
                .ofMinLength(1)
                .ofMaxLength(100);
    }

    /**
     * Generates valid email addresses
     * @return Arbitrary<String> for email addresses
     */
    @Provide
    public static Arbitrary<String> validEmails() {
        return Combinators.combine(
                Arbitraries.strings().alpha().ofMinLength(3).ofMaxLength(20),
                Arbitraries.of("gmail.com", "yahoo.com", "test.com", "example.com")
        ).as((username, domain) -> username.toLowerCase() + "@" + domain);
    }

    /**
     * Generates valid phone numbers (Vietnamese format)
     * Format: 10 digits starting with 0
     * @return Arbitrary<String> for phone numbers
     */
    @Provide
    public static Arbitrary<String> validPhoneNumbers() {
        return Arbitraries.strings()
                .numeric()
                .ofLength(9)
                .map(digits -> "0" + digits);
    }
}
