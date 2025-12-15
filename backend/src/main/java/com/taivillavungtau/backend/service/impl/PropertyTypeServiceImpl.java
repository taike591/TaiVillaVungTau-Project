package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.dto.PropertyTypeDTO;
import com.taivillavungtau.backend.entity.PropertyType;
import com.taivillavungtau.backend.exception.ResourceNotFoundException;
import com.taivillavungtau.backend.exception.DuplicateResourceException;
import com.taivillavungtau.backend.repository.PropertyTypeRepository;
import com.taivillavungtau.backend.service.PropertyTypeService;
import com.taivillavungtau.backend.utils.SlugUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyTypeServiceImpl implements PropertyTypeService {

    private final PropertyTypeRepository propertyTypeRepository;

    @Override
    public List<PropertyTypeDTO> getAllPropertyTypes() {
        return propertyTypeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PropertyTypeDTO getPropertyTypeById(Long id) {
        PropertyType propertyType = propertyTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loại BĐS không tồn tại"));
        return toDTO(propertyType);
    }

    @Override
    @Transactional
    public PropertyTypeDTO createPropertyType(PropertyTypeDTO dto) {
        if (propertyTypeRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Tên loại BĐS đã tồn tại");
        }

        String slug = SlugUtil.toSlug(dto.getName());
        if (propertyTypeRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        PropertyType propertyType = PropertyType.builder()
                .name(dto.getName())
                .slug(slug)
                .iconCode(dto.getIconCode())
                .build();

        PropertyType saved = propertyTypeRepository.save(propertyType);
        log.info("Created property type: {}", saved.getName());
        return toDTO(saved);
    }

    @Override
    @Transactional
    public PropertyTypeDTO updatePropertyType(Long id, PropertyTypeDTO dto) {
        PropertyType existing = propertyTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loại BĐS không tồn tại"));

        if (!existing.getName().equals(dto.getName()) && propertyTypeRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Tên loại BĐS đã tồn tại");
        }

        existing.setName(dto.getName());
        existing.setSlug(SlugUtil.toSlug(dto.getName()));
        existing.setIconCode(dto.getIconCode());

        PropertyType saved = propertyTypeRepository.save(existing);
        log.info("Updated property type: {}", saved.getName());
        return toDTO(saved);
    }

    @Override
    @Transactional
    public void deletePropertyType(Long id) {
        if (!propertyTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Loại BĐS không tồn tại");
        }
        propertyTypeRepository.deleteById(id);
        log.info("Deleted property type ID: {}", id);
    }

    private PropertyTypeDTO toDTO(PropertyType entity) {
        return PropertyTypeDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .slug(entity.getSlug())
                .iconCode(entity.getIconCode())
                .build();
    }
}
