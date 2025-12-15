package com.taivillavungtau.backend.repository;

import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.entity.Amenity;
import com.taivillavungtau.backend.entity.Property;
import com.taivillavungtau.backend.enums.LocationType;
import com.taivillavungtau.backend.repository.specification.PropertySpecification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class PropertyRepositoryTest {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    private Amenity pool;
    private Amenity karaoke;

    @BeforeEach
    void setUp() {
        // Clean up
        propertyRepository.deleteAll();
        amenityRepository.deleteAll();

        // Create Amenities
        pool = Amenity.builder().name("Hồ bơi").iconCode("pool").build();
        karaoke = Amenity.builder().name("Karaoke").iconCode("mic").build();
        amenityRepository.saveAll(List.of(pool, karaoke));

        // Create Properties
        createProperty("MS01", "Villa Bãi Sau", LocationType.BAI_SAU, new BigDecimal("5000000"), 5, Set.of(pool));
        createProperty("MS02", "Villa Bãi Trước", LocationType.BAI_TRUOC, new BigDecimal("7000000"), 7, Set.of(pool, karaoke));
        createProperty("MS03", "Villa Long Cung", LocationType.LONG_CUNG, new BigDecimal("3000000"), 3, Set.of(karaoke));
    }

    private void createProperty(String code, String name, LocationType location, BigDecimal price, int bedrooms, Set<Amenity> amenities) {
        Property property = Property.builder()
                .code(code)
                .name(name)
                .slug(code.toLowerCase())
                .location(location)
                .priceWeekday(price)
                .bedroomCount(bedrooms)
                .status("ACTIVE")
                .amenities(new HashSet<>(amenities))
                .build();
        propertyRepository.save(property);
    }

    @Test
    void filter_ShouldFilterByKeyword() {
        PropertySearchRequest request = new PropertySearchRequest();
        request.setKeyword("Bãi Sau");

        Specification<Property> spec = PropertySpecification.filter(request);
        List<Property> results = propertyRepository.findAll(spec);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCode()).isEqualTo("MS01");
    }

    @Test
    void filter_ShouldFilterByPriceRange() {
        PropertySearchRequest request = new PropertySearchRequest();
        request.setMinPrice(new BigDecimal("4000000"));
        request.setMaxPrice(new BigDecimal("6000000"));

        Specification<Property> spec = PropertySpecification.filter(request);
        List<Property> results = propertyRepository.findAll(spec);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCode()).isEqualTo("MS01");
    }

    @Test
    void filter_ShouldFilterByLocation() {
        PropertySearchRequest request = new PropertySearchRequest();
        request.setLocation(LocationType.BAI_TRUOC);

        Specification<Property> spec = PropertySpecification.filter(request);
        List<Property> results = propertyRepository.findAll(spec);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCode()).isEqualTo("MS02");
    }

    @Test
    void filter_ShouldFilterByAmenities() {
        PropertySearchRequest request = new PropertySearchRequest();
        request.setAmenityIds(Collections.singletonList(pool.getId()));

        Specification<Property> spec = PropertySpecification.filter(request);
        List<Property> results = propertyRepository.findAll(spec);

        // MS01 and MS02 have pool
        assertThat(results).hasSize(2);
        assertThat(results).extracting(Property::getCode).containsExactlyInAnyOrder("MS01", "MS02");
    }

    @Test
    void filter_ShouldCombineFilters() {
        PropertySearchRequest request = new PropertySearchRequest();
        request.setMinBedroom(4);
        request.setAmenityIds(Collections.singletonList(karaoke.getId()));

        // MS02: 7 bedrooms, has karaoke. MS03: 3 bedrooms (fail), has karaoke.
        Specification<Property> spec = PropertySpecification.filter(request);
        List<Property> results = propertyRepository.findAll(spec);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCode()).isEqualTo("MS02");
    }
}
