package com.taivillavungtau.backend.util;

import com.taivillavungtau.backend.dto.PropertyDTO;
import com.taivillavungtau.backend.entity.Amenity;
import com.taivillavungtau.backend.entity.Property;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Custom assertions for property-based testing
 * Provides reusable assertion methods for common validation scenarios
 */
public class PropertyAssertions {

    /**
     * Asserts that a Property entity has valid basic fields
     * @param property the property to validate
     */
    public static void assertValidProperty(Property property) {
        assertThat(property).isNotNull();
        assertThat(property.getCode())
                .isNotNull()
                .matches("^[A-Z]{2}\\d+$");
        assertThat(property.getName())
                .isNotNull()
                .isNotBlank();
        assertThat(property.getSlug())
                .isNotNull()
                .isNotBlank();
        assertThat(property.getPriceWeekday())
                .isNotNull()
                .isGreaterThan(BigDecimal.ZERO);
        assertThat(property.getPriceWeekend())
                .isNotNull()
                .isGreaterThan(BigDecimal.ZERO);
        assertThat(property.getBedroomCount())
                .isNotNull()
                .isGreaterThan(0);
        assertThat(property.getBathroomCount())
                .isNotNull()
                .isGreaterThan(0);
    }

    /**
     * Asserts that a PropertyDTO has valid basic fields
     * @param propertyDTO the property DTO to validate
     */
    public static void assertValidPropertyDTO(PropertyDTO propertyDTO) {
        assertThat(propertyDTO).isNotNull();
        assertThat(propertyDTO.getCode())
                .isNotNull()
                .matches("^[A-Z]{2}\\d+$");
        assertThat(propertyDTO.getName())
                .isNotNull()
                .isNotBlank();
        assertThat(propertyDTO.getPriceWeekday())
                .isNotNull()
                .isGreaterThan(BigDecimal.ZERO);
    }

    /**
     * Asserts that a property's price is within the specified range
     * @param property the property to check
     * @param min minimum price (inclusive)
     * @param max maximum price (inclusive)
     */
    public static void assertPriceInRange(Property property, BigDecimal min, BigDecimal max) {
        assertThat(property.getPriceWeekday())
                .isGreaterThanOrEqualTo(min)
                .isLessThanOrEqualTo(max);
    }

    /**
     * Asserts that a property DTO's price is within the specified range
     * @param propertyDTO the property DTO to check
     * @param min minimum price (inclusive)
     * @param max maximum price (inclusive)
     */
    public static void assertPriceInRange(PropertyDTO propertyDTO, BigDecimal min, BigDecimal max) {
        assertThat(propertyDTO.getPriceWeekday())
                .isGreaterThanOrEqualTo(min)
                .isLessThanOrEqualTo(max);
    }

    /**
     * Asserts that a property contains all specified amenities
     * @param property the property to check
     * @param requiredAmenityIds the amenity IDs that must be present
     */
    public static void assertContainsAllAmenities(Property property, Set<Long> requiredAmenityIds) {
        Set<Long> propertyAmenityIds = property.getAmenities().stream()
                .map(Amenity::getId)
                .collect(java.util.stream.Collectors.toSet());
        
        assertThat(propertyAmenityIds)
                .as("Property should contain all required amenities")
                .containsAll(requiredAmenityIds);
    }

    /**
     * Asserts that a property has at least the specified number of bedrooms
     * @param property the property to check
     * @param minBedrooms minimum number of bedrooms
     */
    public static void assertMinimumBedrooms(Property property, Integer minBedrooms) {
        assertThat(property.getBedroomCount())
                .isGreaterThanOrEqualTo(minBedrooms);
    }

    /**
     * Asserts that a collection is not null and not empty
     * @param collection the collection to check
     * @param description description for the assertion message
     */
    public static void assertNotEmpty(Collection<?> collection, String description) {
        assertThat(collection)
                .as(description)
                .isNotNull()
                .isNotEmpty();
    }

    /**
     * Asserts that a slug is valid (lowercase, alphanumeric with hyphens)
     * @param slug the slug to validate
     */
    public static void assertValidSlug(String slug) {
        assertThat(slug)
                .isNotNull()
                .isNotBlank()
                .matches("^[a-z0-9]+(-[a-z0-9]+)*$");
    }

    /**
     * Asserts that pagination metadata is consistent
     * @param totalElements total number of elements
     * @param pageSize size of each page
     * @param totalPages total number of pages
     * @param currentPageSize size of current page content
     */
    public static void assertPaginationConsistency(long totalElements, int pageSize, int totalPages, int currentPageSize) {
        // Current page size should not exceed page size
        assertThat(currentPageSize)
                .as("Current page size should not exceed configured page size")
                .isLessThanOrEqualTo(pageSize);
        
        // Total pages should be correct
        int expectedTotalPages = (int) Math.ceil((double) totalElements / pageSize);
        assertThat(totalPages)
                .as("Total pages should match calculation: ceil(totalElements / pageSize)")
                .isEqualTo(expectedTotalPages);
    }

    /**
     * Asserts that two values are equal with a descriptive message
     * @param actual the actual value
     * @param expected the expected value
     * @param description description for the assertion
     * @param <T> type of values being compared
     */
    public static <T> void assertEqual(T actual, T expected, String description) {
        assertThat(actual)
                .as(description)
                .isEqualTo(expected);
    }
}
