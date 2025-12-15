package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.dto.PropertyDTO;
import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.dto.response.PageResponse;
import com.taivillavungtau.backend.entity.Property;
import com.taivillavungtau.backend.exception.DuplicateResourceException;
import com.taivillavungtau.backend.exception.ResourceNotFoundException;
import com.taivillavungtau.backend.mapper.PropertyMapper;
import com.taivillavungtau.backend.repository.AmenityRepository;
import com.taivillavungtau.backend.repository.PropertyImageRepository;
import com.taivillavungtau.backend.repository.PropertyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.mockito.quality.Strictness;
import org.junit.jupiter.api.BeforeEach;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class PropertyServiceImplTest {

    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private PropertyMapper propertyMapper;
    @Mock
    private PropertyImageRepository propertyImageRepository;
    @Mock
    private AmenityRepository amenityRepository;
    @Mock
    private org.springframework.context.MessageSource messageSource;

    @InjectMocks
    private PropertyServiceImpl propertyService;

    @BeforeEach
    void setUp() {
        // Mock MessageSource for Translator (used in exception messages)
        org.springframework.test.util.ReflectionTestUtils.setField(
            com.taivillavungtau.backend.utils.Translator.class, "messageSource", messageSource);
        when(messageSource.getMessage(anyString(), any(), any(java.util.Locale.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void createProperty_ShouldSaveProperty_WhenCodeIsUnique() {
        PropertyDTO dto = new PropertyDTO();
        dto.setCode("MS01");
        dto.setName("Villa Test");

        Property property = new Property();
        property.setId(1L);
        property.setCode("MS01");

        when(propertyRepository.existsByCode(dto.getCode())).thenReturn(false);
        when(propertyMapper.toEntity(dto)).thenReturn(property);
        when(propertyRepository.save(any(Property.class))).thenReturn(property);
        when(propertyMapper.toDTO(property)).thenReturn(dto);

        PropertyDTO result = propertyService.createProperty(dto);

        assertThat(result.getCode()).isEqualTo("MS01");
        verify(propertyRepository).save(any(Property.class));
    }

    @Test
    void createProperty_ShouldThrowException_WhenCodeExists() {
        PropertyDTO dto = new PropertyDTO();
        dto.setCode("MS01");

        when(propertyRepository.existsByCode(dto.getCode())).thenReturn(true);

        assertThatThrownBy(() -> propertyService.createProperty(dto))
                .isInstanceOf(DuplicateResourceException.class);

        verify(propertyRepository, never()).save(any(Property.class));
    }

    @Test
    void searchProperties_ShouldReturnPageResponse() {
        PropertySearchRequest request = new PropertySearchRequest();
        request.setPage(0);
        request.setSize(10);

        Property property = new Property();
        Page<Property> page = new PageImpl<>(Collections.singletonList(property));

        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        when(propertyMapper.toDTO(any(Property.class))).thenReturn(new PropertyDTO());

        PageResponse<PropertyDTO> response = propertyService.searchProperties(request);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getTotalElements()).isEqualTo(1);
    }

    @Test
    void getPropertyById_ShouldReturnProperty_WhenFound() {
        Long id = 1L;
        Property property = new Property();
        property.setId(id);
        PropertyDTO dto = new PropertyDTO();

        when(propertyRepository.findById(id)).thenReturn(Optional.of(property));
        when(propertyMapper.toDTO(property)).thenReturn(dto);

        PropertyDTO result = propertyService.getPropertyById(id);

        assertThat(result).isNotNull();
    }

    @Test
    void getPropertyById_ShouldThrowException_WhenNotFound() {
        Long id = 1L;
        when(propertyRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.getPropertyById(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateProperty_ShouldUpdateFields_WhenFound() {
        Long id = 1L;
        PropertyDTO dto = new PropertyDTO();
        dto.setName("Updated Name");
        dto.setCode("MS01"); // Needed for slug generation logic

        Property existing = new Property();
        existing.setId(id);
        existing.setCode("MS01");
        existing.setName("Old Name");

        when(propertyRepository.findById(id)).thenReturn(Optional.of(existing));
        when(propertyRepository.save(any(Property.class))).thenReturn(existing);
        when(propertyMapper.toDTO(any(Property.class))).thenReturn(dto);

        PropertyDTO result = propertyService.updateProperty(id, dto);

        assertThat(result.getName()).isEqualTo("Updated Name");
        verify(propertyRepository).save(existing);
    }

    @Test
    void deleteProperty_ShouldDelete_WhenFound() {
        Long id = 1L;
        when(propertyRepository.existsById(id)).thenReturn(true);

        propertyService.deleteProperty(id);

        verify(propertyRepository).deleteById(id);
    }

    @Test
    void deleteProperty_ShouldThrowException_WhenNotFound() {
        Long id = 1L;
        when(propertyRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> propertyService.deleteProperty(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
