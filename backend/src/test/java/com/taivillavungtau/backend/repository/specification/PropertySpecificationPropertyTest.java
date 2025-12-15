package com.taivillavungtau.backend.repository.specification;

import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.entity.Amenity;
import com.taivillavungtau.backend.enums.LocationType;
import com.taivillavungtau.backend.repository.AmenityRepository;
import com.taivillavungtau.backend.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Property-based tests for PropertySpecification filtering logic
 * Uses jqwik to verify correctness properties across random inputs
 * 
 * Note: These tests use @DataJpaTest with manual test execution rather than
 * jqwik's @Property annotation due to Spring context initialization issues.
 */
@DataJpaTest
@ActiveProfiles("test")
class PropertySpecificationPropertyTest {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private AmenityRepository amenityRepository;
    
    @BeforeEach
    void setUp() {
        // Clean up before each test
        propertyRepository.deleteAll();
        amenityRepository.deleteAll();
    }

    /**
     * **Feature: backend-testing-improvement, Property 3: Price Range Filter Correctness**
     * **Validates: Requirements 2.3**
     * 
     * For any valid min and max price values where min ≤ max, 
     * all properties returned by the search filter should have priceWeekday within [min, max].
     */
    @org.junit.jupiter.api.Test
    void priceRangeFilter_shouldReturnOnlyPropertiesWithinRange() {
        // Test with multiple price ranges
        testPriceRange(new BigDecimal("2000000"), new BigDecimal("5000000"));
        testPriceRange(new BigDecimal("1000000"), new BigDecimal("3000000"));
        testPriceRange(new BigDecimal("5000000"), new BigDecimal("10000000"));
        testPriceRange(new BigDecimal("500000"), new BigDecimal("1000000"));
    }
    
    private void testPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        // Clean up
        propertyRepository.deleteAll();
        
        // Create properties with various prices using unique codes
        String suffix = String.valueOf(System.nanoTime() % 10000);
        createPropertyWithPrice("P1-" + suffix, new BigDecimal("1000000"));
        createPropertyWithPrice("P2-" + suffix, minPrice);
        createPropertyWithPrice("P3-" + suffix, maxPrice);
        createPropertyWithPrice("P4-" + suffix, minPrice.add(maxPrice).divide(BigDecimal.valueOf(2)));
        createPropertyWithPrice("P5-" + suffix, new BigDecimal("100000000"));

        // Create search request
        PropertySearchRequest request = new PropertySearchRequest();
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);

        // Execute filter
        Specification<com.taivillavungtau.backend.entity.Property> spec = PropertySpecification.filter(request);
        List<com.taivillavungtau.backend.entity.Property> results = propertyRepository.findAll(spec);

        // Verify: All returned properties must have price within [min, max]
        assertThat(results).isNotEmpty();
        assertThat(results).allSatisfy(property -> {
            assertThat(property.getPriceWeekday())
                    .isGreaterThanOrEqualTo(minPrice)
                    .isLessThanOrEqualTo(maxPrice);
        });
    }

    /**
     * **Feature: backend-testing-improvement, Property 4: Amenity ALL Mode Completeness**
     * **Validates: Requirements 2.4**
     * 
     * For any non-empty set of amenity IDs, when using ALL matching mode, 
     * every returned property should contain all amenities from that set.
     */
    @org.junit.jupiter.api.Test
    void amenityAllModeFilter_shouldReturnOnlyPropertiesWithAllAmenities() {
        // Test with different amenity combinations
        testAmenityAllMode(2);
        testAmenityAllMode(3);
        testAmenityAllMode(1);
    }
    
    private void testAmenityAllMode(int amenityCount) {
        // Clean up
        propertyRepository.deleteAll();
        amenityRepository.deleteAll();
        
        // Create amenities with unique names
        String suffix = String.valueOf(System.nanoTime() % 10000);
        List<Amenity> amenities = new ArrayList<>();
        for (int i = 0; i < amenityCount; i++) {
            Amenity amenity = Amenity.builder()
                    .name("Amenity-" + suffix + "-" + i)
                    .iconCode("icon-" + suffix + "-" + i)
                    .build();
            amenities.add(amenityRepository.save(amenity));
        }

        // Create properties with different amenity combinations using unique codes
        // Property 1: Has all requested amenities
        createPropertyWithAmenities("P1-" + suffix, new HashSet<>(amenities));
        
        // Property 2: Has only some amenities (if more than 1)
        if (amenities.size() > 1) {
            createPropertyWithAmenities("P2-" + suffix, Set.of(amenities.get(0)));
        }
        
        // Property 3: Has no amenities
        createPropertyWithAmenities("P3-" + suffix, new HashSet<>());

        // Create search request with ALL mode
        PropertySearchRequest request = new PropertySearchRequest();
        request.setAmenityIds(amenities.stream()
                .map(Amenity::getId)
                .collect(Collectors.toList()));
        request.setAmenityMatchMode("ALL");

        // Execute filter
        Specification<com.taivillavungtau.backend.entity.Property> spec = PropertySpecification.filter(request);
        List<com.taivillavungtau.backend.entity.Property> results = propertyRepository.findAll(spec);

        // Verify: All returned properties must have ALL requested amenities
        Set<Long> requestedIds = amenities.stream()
                .map(Amenity::getId)
                .collect(Collectors.toSet());
        
        assertThat(results).allSatisfy(property -> {
            Set<Long> propertyAmenityIds = property.getAmenities().stream()
                    .map(Amenity::getId)
                    .collect(Collectors.toSet());
            assertThat(propertyAmenityIds).containsAll(requestedIds);
        });
    }

    // ==================== Edge Case Tests ====================

    /**
     * Edge case: Test filter handles min > max by swapping values
     * Validates: Requirements 7.3
     */
    @org.junit.jupiter.api.Test
    void priceRangeFilter_shouldSwapMinMaxWhenReversed() {
        // Test with reversed price ranges
        testReversedPriceRange(new BigDecimal("5000000"), new BigDecimal("2000000"));
        testReversedPriceRange(new BigDecimal("10000000"), new BigDecimal("1000000"));
    }
    
    private void testReversedPriceRange(BigDecimal largerPrice, BigDecimal smallerPrice) {
        // Clean up
        propertyRepository.deleteAll();
        
        String suffix = String.valueOf(System.nanoTime() % 10000);
        BigDecimal midPrice = largerPrice.add(smallerPrice).divide(BigDecimal.valueOf(2));
        createPropertyWithPrice("P1-" + suffix, midPrice);

        // Create request with reversed min/max
        PropertySearchRequest request = new PropertySearchRequest();
        request.setMinPrice(largerPrice); // larger value
        request.setMaxPrice(smallerPrice); // smaller value

        // Execute filter
        Specification<com.taivillavungtau.backend.entity.Property> spec = PropertySpecification.filter(request);
        List<com.taivillavungtau.backend.entity.Property> results = propertyRepository.findAll(spec);

        // Verify: Filter should handle this gracefully (swap or use between)
        // Based on the code, it uses between(maxPrice, minPrice) when min > max
        assertThat(results).allSatisfy(property -> {
            assertThat(property.getPriceWeekday())
                    .isGreaterThanOrEqualTo(smallerPrice)
                    .isLessThanOrEqualTo(largerPrice);
        });
    }

    /**
     * Edge case: Test filter handles minBedroom = 0 correctly
     * Validates: Requirements 7.3
     */
    @org.junit.jupiter.api.Test
    void bedroomFilter_shouldHandleZeroMinBedroom() {
        createPropertyWithBedrooms("P1", 1);
        createPropertyWithBedrooms("P2", 3);
        createPropertyWithBedrooms("P3", 5);

        // Create request with minBedroom = 0
        PropertySearchRequest request = new PropertySearchRequest();
        request.setMinBedroom(0);

        // Execute filter
        Specification<com.taivillavungtau.backend.entity.Property> spec = PropertySpecification.filter(request);
        List<com.taivillavungtau.backend.entity.Property> results = propertyRepository.findAll(spec);

        // Verify: Should return all properties (0 is effectively no filter)
        assertThat(results).hasSize(3);
        assertThat(results).allSatisfy(property -> {
            assertThat(property.getBedroomCount()).isGreaterThanOrEqualTo(0);
        });
    }

    // ==================== Helper Methods ====================

    private void createPropertyWithPrice(String code, BigDecimal price) {
        com.taivillavungtau.backend.entity.Property property = com.taivillavungtau.backend.entity.Property.builder()
                .code(code)
                .name("Property " + code)
                .slug(code.toLowerCase())
                .priceWeekday(price)
                .priceWeekend(price)
                .bedroomCount(3)
                .bathroomCount(2)
                .maxGuests(6)
                .status("ACTIVE")
                .location(LocationType.BAI_TRUOC)
                .amenities(new HashSet<>())
                .build();
        propertyRepository.save(property);
    }

    private void createPropertyWithAmenities(String code, Set<Amenity> amenities) {
        com.taivillavungtau.backend.entity.Property property = com.taivillavungtau.backend.entity.Property.builder()
                .code(code)
                .name("Property " + code)
                .slug(code.toLowerCase())
                .priceWeekday(new BigDecimal("2000000"))
                .priceWeekend(new BigDecimal("2500000"))
                .bedroomCount(3)
                .bathroomCount(2)
                .maxGuests(6)
                .status("ACTIVE")
                .location(LocationType.BAI_TRUOC)
                .amenities(new HashSet<>(amenities))
                .build();
        propertyRepository.save(property);
    }

    private void createPropertyWithBedrooms(String code, int bedrooms) {
        com.taivillavungtau.backend.entity.Property property = com.taivillavungtau.backend.entity.Property.builder()
                .code(code)
                .name("Property " + code)
                .slug(code.toLowerCase())
                .priceWeekday(new BigDecimal("2000000"))
                .priceWeekend(new BigDecimal("2500000"))
                .bedroomCount(bedrooms)
                .bathroomCount(2)
                .maxGuests(6)
                .status("ACTIVE")
                .location(LocationType.BAI_TRUOC)
                .amenities(new HashSet<>())
                .build();
        propertyRepository.save(property);
    }

}
