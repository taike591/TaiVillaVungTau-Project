package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.dto.AmenityDTO;
import com.taivillavungtau.backend.entity.Amenity;
import com.taivillavungtau.backend.exception.DuplicateResourceException;
import com.taivillavungtau.backend.mapper.AmenityMapper;
import com.taivillavungtau.backend.repository.AmenityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AmenityServiceImpl Unit Tests")
class AmenityServiceImplTest {

        @Mock
        private AmenityRepository amenityRepository;

        @Mock
        private AmenityMapper amenityMapper;

        @Mock
        private jakarta.persistence.EntityManager entityManager;

        @Mock
        private jakarta.persistence.Query nativeQuery;

        @InjectMocks
        private AmenityServiceImpl amenityService;

        private Amenity testAmenity;
        private AmenityDTO testAmenityDTO;

        @BeforeEach
        void setUp() {
                testAmenity = Amenity.builder()
                                .id(1L)
                                .name("WiFi")
                                .iconCode("wifi")
                                .build();

                testAmenityDTO = AmenityDTO.builder()
                                .id(1L)
                                .name("WiFi")
                                .iconCode("wifi")
                                .build();
        }

        @Nested
        @DisplayName("Create Operations")
        class CreateTests {

                @Test
                @DisplayName("Should create amenity successfully and return DTO")
                void shouldCreateAmenitySuccessfully_andReturnDTO() {
                        // Given
                        AmenityDTO inputDTO = AmenityDTO.builder()
                                        .name("Swimming Pool")
                                        .iconCode("pool")
                                        .build();

                        Amenity entityToSave = Amenity.builder()
                                        .name("Swimming Pool")
                                        .iconCode("pool")
                                        .build();

                        Amenity savedEntity = Amenity.builder()
                                        .id(2L)
                                        .name("Swimming Pool")
                                        .iconCode("pool")
                                        .build();

                        AmenityDTO expectedDTO = AmenityDTO.builder()
                                        .id(2L)
                                        .name("Swimming Pool")
                                        .iconCode("pool")
                                        .build();

                        when(amenityRepository.existsByName(inputDTO.getName())).thenReturn(false);
                        when(amenityMapper.toEntity(inputDTO)).thenReturn(entityToSave);
                        when(amenityRepository.save(entityToSave)).thenReturn(savedEntity);
                        when(amenityMapper.toDTO(savedEntity)).thenReturn(expectedDTO);

                        // When
                        AmenityDTO result = amenityService.createAmenity(inputDTO);

                        // Then
                        assertThat(result).isNotNull();
                        assertThat(result.getId()).isEqualTo(2L);
                        assertThat(result.getName()).isEqualTo("Swimming Pool");
                        assertThat(result.getIconCode()).isEqualTo("pool");

                        verify(amenityRepository).existsByName(inputDTO.getName());
                        verify(amenityMapper).toEntity(inputDTO);
                        verify(amenityRepository).save(entityToSave);
                        verify(amenityMapper).toDTO(savedEntity);
                }

                @Test
                @DisplayName("Should throw DuplicateResourceException when amenity name already exists")
                void shouldThrowDuplicateResourceException_whenAmenityNameAlreadyExists() {
                        // Given
                        AmenityDTO inputDTO = AmenityDTO.builder()
                                        .name("WiFi")
                                        .iconCode("wifi")
                                        .build();

                        when(amenityRepository.existsByName(inputDTO.getName())).thenReturn(true);

                        // When & Then
                        assertThatThrownBy(() -> amenityService.createAmenity(inputDTO))
                                        .isInstanceOf(DuplicateResourceException.class)
                                        .hasMessageContaining("Tiện ích này đã tồn tại");

                        verify(amenityRepository).existsByName(inputDTO.getName());
                        verify(amenityMapper, never()).toEntity(any());
                        verify(amenityRepository, never()).save(any());
                }
        }

        @Nested
        @DisplayName("Retrieval Operations")
        class RetrievalTests {

                @Test
                @DisplayName("Should get all amenities and return complete list")
                void shouldGetAllAmenities_andReturnCompleteList() {
                        // Given
                        Amenity amenity1 = Amenity.builder()
                                        .id(1L)
                                        .name("WiFi")
                                        .iconCode("wifi")
                                        .build();

                        Amenity amenity2 = Amenity.builder()
                                        .id(2L)
                                        .name("Swimming Pool")
                                        .iconCode("pool")
                                        .build();

                        Amenity amenity3 = Amenity.builder()
                                        .id(3L)
                                        .name("Parking")
                                        .iconCode("parking")
                                        .build();

                        List<Amenity> amenities = Arrays.asList(amenity1, amenity2, amenity3);

                        AmenityDTO dto1 = AmenityDTO.builder()
                                        .id(1L)
                                        .name("WiFi")
                                        .iconCode("wifi")
                                        .build();

                        AmenityDTO dto2 = AmenityDTO.builder()
                                        .id(2L)
                                        .name("Swimming Pool")
                                        .iconCode("pool")
                                        .build();

                        AmenityDTO dto3 = AmenityDTO.builder()
                                        .id(3L)
                                        .name("Parking")
                                        .iconCode("parking")
                                        .build();

                        when(amenityRepository.findAll()).thenReturn(amenities);
                        when(amenityMapper.toDTO(amenity1)).thenReturn(dto1);
                        when(amenityMapper.toDTO(amenity2)).thenReturn(dto2);
                        when(amenityMapper.toDTO(amenity3)).thenReturn(dto3);

                        // When
                        List<AmenityDTO> result = amenityService.getAllAmenities();

                        // Then
                        assertThat(result).isNotNull();
                        assertThat(result).hasSize(3);
                        assertThat(result.get(0).getName()).isEqualTo("WiFi");
                        assertThat(result.get(1).getName()).isEqualTo("Swimming Pool");
                        assertThat(result.get(2).getName()).isEqualTo("Parking");

                        verify(amenityRepository).findAll();
                        verify(amenityMapper, times(3)).toDTO(any(Amenity.class));
                }
        }

        @Nested
        @DisplayName("Delete Operations")
        class DeleteTests {

                @Test
                @DisplayName("Should delete amenity by ID")
                void shouldDeleteAmenity_byId() {
                        // Given
                        Long amenityId = 1L;
                        when(entityManager.createNativeQuery(anyString())).thenReturn(nativeQuery);
                        when(nativeQuery.setParameter(anyString(), any())).thenReturn(nativeQuery);
                        when(nativeQuery.executeUpdate()).thenReturn(1);
                        doNothing().when(amenityRepository).deleteById(amenityId);

                        // When
                        amenityService.deleteAmenity(amenityId);

                        // Then
                        verify(entityManager).createNativeQuery(anyString());
                        verify(amenityRepository).deleteById(amenityId);
                }
        }

        @Nested
        @DisplayName("Property-Based Tests")
        class PropertyBasedTests {

                /**
                 * Feature: backend-testing-improvement, Property 6: Null Input Rejection
                 * Validates: Requirements 7.1
                 * 
                 * For any service method that accepts object parameters, passing null should
                 * result in
                 * either IllegalArgumentException or a validation exception (never
                 * NullPointerException).
                 */
                @Test
                @DisplayName("Should reject null input in createAmenity")
                void shouldRejectNullInput_inCreateAmenity() {
                        // When & Then
                        assertThatThrownBy(() -> amenityService.createAmenity(null))
                                        .isNotInstanceOf(NullPointerException.class);
                }

                @Test
                @DisplayName("Should reject null ID in deleteAmenity")
                void shouldRejectNullId_inDeleteAmenity() {
                        // When & Then
                        assertThatThrownBy(() -> amenityService.deleteAmenity(null))
                                        .isNotInstanceOf(NullPointerException.class);
                }
        }
}
