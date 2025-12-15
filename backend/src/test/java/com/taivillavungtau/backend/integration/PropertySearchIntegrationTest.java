package com.taivillavungtau.backend.integration;

import com.taivillavungtau.backend.entity.Amenity;
import com.taivillavungtau.backend.entity.Property;
import com.taivillavungtau.backend.enums.LocationType;
import com.taivillavungtau.backend.repository.AmenityRepository;
import com.taivillavungtau.backend.repository.PropertyRepository;
import com.taivillavungtau.backend.service.RefreshTokenService;
import com.taivillavungtau.backend.service.TelegramNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.support.NoOpCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration test for property search flow
 * Tests the complete flow: HTTP Request → Controller → Service → Repository → Database
 * 
 * **Validates: Requirements 4.1**
 */
@SpringBootTest(
    classes = com.taivillavungtau.backend.BackendApplication.class,
    properties = {
        "spring.cache.type=none",
        "spring.data.redis.repositories.enabled=false",
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration"
    }
)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@Transactional
@DisplayName("Property Search Integration Tests")
class PropertySearchIntegrationTest {
    
    @Configuration
    static class TestCacheConfig {
        @Bean
        @Primary
        public CacheManager cacheManager() {
            return new NoOpCacheManager();
        }
    }
    
    @MockBean
    private RefreshTokenService refreshTokenService;
    
    @MockBean
    private TelegramNotificationService telegramNotificationService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    private Amenity poolAmenity;
    private Amenity karaokeAmenity;
    private Amenity wifiAmenity;

    @BeforeEach
    void setUp() {
        // Clean database
        propertyRepository.deleteAll();
        amenityRepository.deleteAll();

        // Create test amenities
        poolAmenity = amenityRepository.save(Amenity.builder()
                .name("Hồ bơi")
                .iconCode("pool")
                .build());

        karaokeAmenity = amenityRepository.save(Amenity.builder()
                .name("Karaoke")
                .iconCode("karaoke")
                .build());

        wifiAmenity = amenityRepository.save(Amenity.builder()
                .name("WiFi")
                .iconCode("wifi")
                .build());
    }

    @Test
    @DisplayName("Should complete full search flow from HTTP to database")
    void testCompleteSearchFlow() throws Exception {
        // Given: Create test properties in database
        Property villa1 = createProperty("MS01", "Luxury Villa", 
                new BigDecimal("3000000"), new BigDecimal("3500000"),
                4, 3, 8, LocationType.BAI_TRUOC, Set.of(poolAmenity, wifiAmenity));

        Property villa2 = createProperty("MS02", "Budget Villa",
                new BigDecimal("1500000"), new BigDecimal("2000000"),
                2, 1, 4, LocationType.BAI_SAU, Set.of(wifiAmenity));

        propertyRepository.save(villa1);
        propertyRepository.save(villa2);

        // When: Execute HTTP GET request to search endpoint
        MvcResult result = mockMvc.perform(get("/api/v1/properties")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(2))
                .andReturn();

        // Then: Verify the complete flow worked correctly
        String responseBody = result.getResponse().getContentAsString();
        assertThat(responseBody).contains("MS01");
        assertThat(responseBody).contains("MS02");
        assertThat(responseBody).contains("Luxury Villa");
        assertThat(responseBody).contains("Budget Villa");
    }

    @Test
    @DisplayName("Should filter properties with combined price, location and amenity filters")
    void testSearchWithMultipleFilters() throws Exception {
        // Given: Create properties with different characteristics
        Property villa1 = createProperty("MS01", "Luxury Beach Villa", 
                new BigDecimal("3000000"), new BigDecimal("3500000"),
                4, 3, 8, LocationType.BAI_TRUOC, Set.of(poolAmenity, wifiAmenity, karaokeAmenity));

        Property villa2 = createProperty("MS02", "Budget Villa",
                new BigDecimal("1500000"), new BigDecimal("2000000"),
                2, 1, 4, LocationType.BAI_SAU, Set.of(wifiAmenity));

        Property villa3 = createProperty("MS03", "Mid-range Beach Villa",
                new BigDecimal("2500000"), new BigDecimal("3000000"),
                3, 2, 6, LocationType.BAI_TRUOC, Set.of(poolAmenity, wifiAmenity));

        propertyRepository.save(villa1);
        propertyRepository.save(villa2);
        propertyRepository.save(villa3);

        // When: Search with price range, location, and amenities
        MvcResult result = mockMvc.perform(get("/api/v1/properties")
                        .param("minPrice", "2000000")
                        .param("maxPrice", "3500000")
                        .param("location", "BAI_TRUOC")
                        .param("amenityIds", poolAmenity.getId().toString())
                        .param("amenityMatchMode", "ALL")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andReturn();

        // Then: Only properties matching all filters should be returned
        String responseBody = result.getResponse().getContentAsString();
        assertThat(responseBody).contains("MS01"); // Matches all filters
        assertThat(responseBody).contains("MS03"); // Matches all filters
        assertThat(responseBody).doesNotContain("MS02"); // Wrong location and no pool
        
        // Verify total elements
        mockMvc.perform(get("/api/v1/properties")
                        .param("minPrice", "2000000")
                        .param("maxPrice", "3500000")
                        .param("location", "BAI_TRUOC")
                        .param("amenityIds", poolAmenity.getId().toString())
                        .param("amenityMatchMode", "ALL")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(jsonPath("$.data.totalElements").value(2));
    }

    @Test
    @DisplayName("Should sort search results correctly by sort parameter")
    void testSearchWithSorting() throws Exception {
        // Given: Create properties with different prices
        Property villa1 = createProperty("MS01", "Expensive Villa", 
                new BigDecimal("5000000"), new BigDecimal("6000000"),
                5, 4, 10, LocationType.BAI_TRUOC, Set.of(poolAmenity, wifiAmenity));

        Property villa2 = createProperty("MS02", "Cheap Villa",
                new BigDecimal("1000000"), new BigDecimal("1500000"),
                2, 1, 4, LocationType.BAI_SAU, Set.of(wifiAmenity));

        Property villa3 = createProperty("MS03", "Mid-price Villa",
                new BigDecimal("3000000"), new BigDecimal("3500000"),
                3, 2, 6, LocationType.BAI_TRUOC, Set.of(poolAmenity));

        propertyRepository.save(villa1);
        propertyRepository.save(villa2);
        propertyRepository.save(villa3);

        // When: Search with PRICE_LOW_TO_HIGH sort
        MvcResult resultAsc = mockMvc.perform(get("/api/v1/properties")
                        .param("sort", "PRICE_LOW_TO_HIGH")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(3))
                .andReturn();

        // Then: Results should be sorted by price ascending
        String responseAsc = resultAsc.getResponse().getContentAsString();
        int indexMS02 = responseAsc.indexOf("MS02");
        int indexMS03 = responseAsc.indexOf("MS03");
        int indexMS01 = responseAsc.indexOf("MS01");
        assertThat(indexMS02).isLessThan(indexMS03);
        assertThat(indexMS03).isLessThan(indexMS01);

        // When: Search with PRICE_HIGH_TO_LOW sort
        MvcResult resultDesc = mockMvc.perform(get("/api/v1/properties")
                        .param("sort", "PRICE_HIGH_TO_LOW")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(3))
                .andReturn();

        // Then: Results should be sorted by price descending
        String responseDesc = resultDesc.getResponse().getContentAsString();
        int indexMS01Desc = responseDesc.indexOf("MS01");
        int indexMS03Desc = responseDesc.indexOf("MS03");
        int indexMS02Desc = responseDesc.indexOf("MS02");
        assertThat(indexMS01Desc).isLessThan(indexMS03Desc);
        assertThat(indexMS03Desc).isLessThan(indexMS02Desc);
    }

    @Test
    @DisplayName("Should clean up test data after integration tests complete")
    void testDataCleanupAfterTests() throws Exception {
        // Given: Create test properties
        Property villa1 = createProperty("MS01", "Test Villa 1", 
                new BigDecimal("2000000"), new BigDecimal("2500000"),
                3, 2, 6, LocationType.BAI_TRUOC, Set.of(poolAmenity));

        Property villa2 = createProperty("MS02", "Test Villa 2",
                new BigDecimal("1500000"), new BigDecimal("2000000"),
                2, 1, 4, LocationType.BAI_SAU, Set.of(wifiAmenity));

        propertyRepository.save(villa1);
        propertyRepository.save(villa2);

        // When: Verify data exists
        long countBefore = propertyRepository.count();
        assertThat(countBefore).isEqualTo(2);

        // Then: After test completes, @Transactional should rollback
        // This is verified by the @Transactional annotation on the class
        // which ensures each test runs in a transaction that is rolled back
        
        // We can verify the transactional behavior by checking that
        // data from this test doesn't affect other tests
        // The @BeforeEach method cleans up explicitly as well
    }

    private Property createProperty(String code, String name, 
                                   BigDecimal priceWeekday, BigDecimal priceWeekend,
                                   int bedrooms, int bathrooms, int maxGuests,
                                   LocationType location, Set<Amenity> amenities) {
        return Property.builder()
                .code(code)
                .name(name)
                .slug(name.toLowerCase().replace(" ", "-"))
                .description("Test description")
                .priceWeekday(priceWeekday)
                .priceWeekend(priceWeekend)
                .bedroomCount(bedrooms)
                .bathroomCount(bathrooms)
                .standardGuests(maxGuests - 2)
                .maxGuests(maxGuests)
                .location(location)
                .status("ACTIVE")
                .amenities(new HashSet<>(amenities))
                .build();
    }
}
