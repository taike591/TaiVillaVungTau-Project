package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.dto.PropertyDTO;
import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.dto.response.PageResponse;
import com.taivillavungtau.backend.mapper.PropertyMapper;
import com.taivillavungtau.backend.repository.AmenityRepository;
import com.taivillavungtau.backend.repository.LabelRepository;
import com.taivillavungtau.backend.repository.LocationRepository;
import com.taivillavungtau.backend.repository.PropertyImageRepository;
import com.taivillavungtau.backend.repository.PropertyRepository;
import com.taivillavungtau.backend.repository.PropertyTypeRepository;
import com.taivillavungtau.backend.service.CloudinaryService;
import com.taivillavungtau.backend.util.TestDataBuilder;
import net.jqwik.api.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Property-based tests for pagination functionality
 * Tests universal properties that should hold across all valid pagination
 * inputs
 * 
 * **Feature: backend-testing-improvement**
 * 
 * Note: This test class uses manual mock creation instead
 * of @ExtendWith(MockitoExtension.class)
 * because jqwik property tests don't work well with Mockito's extension.
 */
class PaginationPropertyTest {

        // Helper method to create a properly mocked service for each test
        private PropertyServiceImpl createMockedService() {
                PropertyRepository propertyRepository = org.mockito.Mockito.mock(PropertyRepository.class);
                PropertyMapper propertyMapper = org.mockito.Mockito.mock(PropertyMapper.class);
                PropertyImageRepository propertyImageRepository = org.mockito.Mockito
                                .mock(PropertyImageRepository.class);
                AmenityRepository amenityRepository = org.mockito.Mockito.mock(AmenityRepository.class);
                LabelRepository labelRepository = org.mockito.Mockito.mock(LabelRepository.class);
                LocationRepository locationRepository = org.mockito.Mockito.mock(LocationRepository.class);
                PropertyTypeRepository propertyTypeRepository = org.mockito.Mockito.mock(PropertyTypeRepository.class);
                CloudinaryService cloudinaryService = org.mockito.Mockito.mock(CloudinaryService.class);

                // Mock MessageSource for Translator
                org.springframework.context.MessageSource messageSource = org.mockito.Mockito
                                .mock(org.springframework.context.MessageSource.class);
                org.springframework.test.util.ReflectionTestUtils.setField(
                                com.taivillavungtau.backend.utils.Translator.class, "messageSource", messageSource);
                when(messageSource.getMessage(any(), any(), any(java.util.Locale.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));

                return new PropertyServiceImpl(propertyRepository, propertyMapper, propertyImageRepository,
                                amenityRepository, labelRepository,
                                locationRepository, propertyTypeRepository, cloudinaryService);
        }

        /**
         * **Feature: backend-testing-improvement, Property 5: Pagination Consistency**
         * **Validates: Requirements 2.5**
         * 
         * For any valid page number and page size, the returned page should have:
         * - content.size() <= pageSize
         * - totalElements = actual count in database
         * - totalPages = ceil(totalElements / pageSize)
         */
        @Property(tries = 100)
        void paginationShouldBeConsistent(
                        @ForAll("validPageNumbers") int pageNumber,
                        @ForAll("validPageSizes") int pageSize,
                        @ForAll("totalElementCounts") long totalElements) {

                // Given: Create mocked service for this test iteration
                PropertyRepository mockRepository = org.mockito.Mockito.mock(PropertyRepository.class);
                PropertyMapper mockMapper = org.mockito.Mockito.mock(PropertyMapper.class);
                PropertyImageRepository mockImageRepo = org.mockito.Mockito.mock(PropertyImageRepository.class);
                AmenityRepository mockAmenityRepo = org.mockito.Mockito.mock(AmenityRepository.class);
                LabelRepository mockLabelRepo = org.mockito.Mockito.mock(LabelRepository.class);
                LocationRepository mockLocationRepo = org.mockito.Mockito.mock(LocationRepository.class);
                PropertyTypeRepository mockPropertyTypeRepo = org.mockito.Mockito.mock(PropertyTypeRepository.class);
                CloudinaryService mockCloudinaryService = org.mockito.Mockito.mock(CloudinaryService.class);

                PropertyServiceImpl service = new PropertyServiceImpl(mockRepository, mockMapper, mockImageRepo,
                                mockAmenityRepo, mockLabelRepo, mockLocationRepo, mockPropertyTypeRepo,
                                mockCloudinaryService);

                // Given: A search request with specific page and size
                PropertySearchRequest request = new PropertySearchRequest();
                request.setPage(pageNumber);
                request.setSize(pageSize);

                // Calculate expected values
                int expectedTotalPages = (int) Math.ceil((double) totalElements / pageSize);
                int expectedContentSize = calculateExpectedContentSize(pageNumber, pageSize, totalElements);

                // Create mock properties
                List<com.taivillavungtau.backend.entity.Property> mockProperties = createMockProperties(
                                expectedContentSize);
                Page<com.taivillavungtau.backend.entity.Property> mockPage = new PageImpl<>(
                                mockProperties,
                                org.springframework.data.domain.PageRequest.of(pageNumber, pageSize),
                                totalElements);

                // Mock repository and mapper
                when(mockRepository.findAll(any(Specification.class), any(Pageable.class)))
                                .thenReturn(mockPage);
                when(mockMapper.toDTO(any(com.taivillavungtau.backend.entity.Property.class)))
                                .thenAnswer(inv -> {
                                        com.taivillavungtau.backend.entity.Property prop = inv.getArgument(0);
                                        PropertyDTO dto = new PropertyDTO();
                                        dto.setId(prop.getId());
                                        dto.setCode(prop.getCode());
                                        dto.setName(prop.getName());
                                        return dto;
                                });

                // When: Searching with pagination
                PageResponse<PropertyDTO> response = service.searchProperties(request);

                // Then: Pagination should be consistent
                assertThat(response.getContent().size())
                                .as("Content size should not exceed page size")
                                .isLessThanOrEqualTo(pageSize);

                assertThat(response.getTotalElements())
                                .as("Total elements should match database count")
                                .isEqualTo(totalElements);

                assertThat(response.getTotalPages())
                                .as("Total pages should be ceil(totalElements / pageSize)")
                                .isEqualTo(expectedTotalPages);

                assertThat(response.getPageSize())
                                .as("Page size should match request")
                                .isEqualTo(pageSize);

                assertThat(response.getPageNo())
                                .as("Page number should match request")
                                .isEqualTo(pageNumber);
        }

        /**
         * Edge case: Page number exceeds total pages
         * **Validates: Requirements 7.3**
         */
        @Test
        void shouldReturnEmptyPage_whenPageNumberExceedsTotalPages() {
                // Given: Create mocked service
                PropertyRepository mockRepository = org.mockito.Mockito.mock(PropertyRepository.class);
                PropertyMapper mockMapper = org.mockito.Mockito.mock(PropertyMapper.class);
                PropertyImageRepository mockImageRepo = org.mockito.Mockito.mock(PropertyImageRepository.class);
                AmenityRepository mockAmenityRepo = org.mockito.Mockito.mock(AmenityRepository.class);
                LabelRepository mockLabelRepo = org.mockito.Mockito.mock(LabelRepository.class);
                LocationRepository mockLocationRepo = org.mockito.Mockito.mock(LocationRepository.class);
                PropertyTypeRepository mockPropertyTypeRepo = org.mockito.Mockito.mock(PropertyTypeRepository.class);
                CloudinaryService mockCloudinaryService = org.mockito.Mockito.mock(CloudinaryService.class);

                PropertyServiceImpl service = new PropertyServiceImpl(mockRepository, mockMapper, mockImageRepo,
                                mockAmenityRepo, mockLabelRepo, mockLocationRepo, mockPropertyTypeRepo,
                                mockCloudinaryService);

                // Given: A request for page 10 when only 2 pages exist
                PropertySearchRequest request = new PropertySearchRequest();
                request.setPage(10);
                request.setSize(10);

                long totalElements = 15; // Only 2 pages (0 and 1)
                List<com.taivillavungtau.backend.entity.Property> emptyList = new ArrayList<>();
                Page<com.taivillavungtau.backend.entity.Property> emptyPage = new PageImpl<>(
                                emptyList,
                                org.springframework.data.domain.PageRequest.of(10, 10),
                                totalElements);

                when(mockRepository.findAll(any(Specification.class), any(Pageable.class)))
                                .thenReturn(emptyPage);

                // When: Searching with out-of-range page number
                PageResponse<PropertyDTO> response = service.searchProperties(request);

                // Then: Should return empty page
                assertThat(response.getContent())
                                .as("Content should be empty for out-of-range page")
                                .isEmpty();

                assertThat(response.getTotalElements())
                                .as("Total elements should still be accurate")
                                .isEqualTo(totalElements);

                assertThat(response.getTotalPages())
                                .as("Total pages should be 2")
                                .isEqualTo(2);
        }

        /**
         * Edge case: Page size of 1
         * **Validates: Requirements 7.3**
         */
        @Test
        void shouldHandleMinimumPageSize_whenPageSizeIsOne() {
                // Given: Create mocked service
                PropertyRepository mockRepository = org.mockito.Mockito.mock(PropertyRepository.class);
                PropertyMapper mockMapper = org.mockito.Mockito.mock(PropertyMapper.class);
                PropertyImageRepository mockImageRepo = org.mockito.Mockito.mock(PropertyImageRepository.class);
                AmenityRepository mockAmenityRepo = org.mockito.Mockito.mock(AmenityRepository.class);
                LabelRepository mockLabelRepo = org.mockito.Mockito.mock(LabelRepository.class);
                LocationRepository mockLocationRepo = org.mockito.Mockito.mock(LocationRepository.class);
                PropertyTypeRepository mockPropertyTypeRepo = org.mockito.Mockito.mock(PropertyTypeRepository.class);
                CloudinaryService mockCloudinaryService = org.mockito.Mockito.mock(CloudinaryService.class);

                PropertyServiceImpl service = new PropertyServiceImpl(mockRepository, mockMapper, mockImageRepo,
                                mockAmenityRepo, mockLabelRepo, mockLocationRepo, mockPropertyTypeRepo,
                                mockCloudinaryService);

                // Given: A request with page size of 1
                PropertySearchRequest request = new PropertySearchRequest();
                request.setPage(0);
                request.setSize(1);

                long totalElements = 5;
                List<com.taivillavungtau.backend.entity.Property> singleProperty = createMockProperties(1);
                Page<com.taivillavungtau.backend.entity.Property> singlePage = new PageImpl<>(
                                singleProperty,
                                org.springframework.data.domain.PageRequest.of(0, 1),
                                totalElements);

                when(mockRepository.findAll(any(Specification.class), any(Pageable.class)))
                                .thenReturn(singlePage);
                when(mockMapper.toDTO(any(com.taivillavungtau.backend.entity.Property.class)))
                                .thenAnswer(inv -> {
                                        com.taivillavungtau.backend.entity.Property prop = inv.getArgument(0);
                                        PropertyDTO dto = new PropertyDTO();
                                        dto.setId(prop.getId());
                                        dto.setCode(prop.getCode());
                                        dto.setName(prop.getName());
                                        return dto;
                                });

                // When: Searching with minimum page size
                PageResponse<PropertyDTO> response = service.searchProperties(request);

                // Then: Should work correctly with page size 1
                assertThat(response.getContent())
                                .as("Content should have exactly 1 element")
                                .hasSize(1);

                assertThat(response.getPageSize())
                                .as("Page size should be 1")
                                .isEqualTo(1);

                assertThat(response.getTotalPages())
                                .as("Total pages should be 5 (one per element)")
                                .isEqualTo(5);

                assertThat(response.getTotalElements())
                                .as("Total elements should be 5")
                                .isEqualTo(totalElements);
        }

        // Helper methods

        private int calculateExpectedContentSize(int pageNumber, int pageSize, long totalElements) {
                if (totalElements == 0) {
                        return 0;
                }

                long startIndex = (long) pageNumber * pageSize;
                if (startIndex >= totalElements) {
                        return 0; // Page is out of range
                }

                long remainingElements = totalElements - startIndex;
                return (int) Math.min(remainingElements, pageSize);
        }

        private List<com.taivillavungtau.backend.entity.Property> createMockProperties(int count) {
                List<com.taivillavungtau.backend.entity.Property> properties = new ArrayList<>();
                for (int i = 0; i < count; i++) {
                        com.taivillavungtau.backend.entity.Property property = com.taivillavungtau.backend.util.TestDataBuilder
                                        .validProperty()
                                        .id((long) i)
                                        .code("MS" + (100 + i))
                                        .name("Test Villa " + i)
                                        .build();
                        properties.add(property);
                }
                return properties;
        }

        // Providers for jqwik

        @Provide
        Arbitrary<Integer> validPageNumbers() {
                return Arbitraries.integers().between(0, 99);
        }

        @Provide
        Arbitrary<Integer> validPageSizes() {
                return Arbitraries.integers().between(1, 100);
        }

        @Provide
        Arbitrary<Long> totalElementCounts() {
                return Arbitraries.longs().between(0L, 1000L);
        }
}
