package com.taivillavungtau.backend.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.taivillavungtau.backend.dto.AmenityDTO;
import com.taivillavungtau.backend.entity.Amenity;
import com.taivillavungtau.backend.exception.DuplicateResourceException;
import com.taivillavungtau.backend.mapper.AmenityMapper;
import com.taivillavungtau.backend.repository.AmenityRepository;
import com.taivillavungtau.backend.service.AmenityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AmenityServiceImpl implements AmenityService {


    private final AmenityRepository amenityRepository;
    private final AmenityMapper amenityMapper;
    @Override
    public AmenityDTO createAmenity(AmenityDTO amenityDTO) {
        if (amenityDTO == null) {
            throw new IllegalArgumentException("AmenityDTO must not be null");
        }
         // Check trùng tên tiện ích
        if (amenityRepository.existsByName(amenityDTO.getName())) {
            throw new DuplicateResourceException("Tiện ích này đã tồn tại");
        }
        Amenity amenity = amenityMapper.toEntity(amenityDTO);
        return amenityMapper.toDTO(amenityRepository.save(Objects.requireNonNull(amenity)));
    }
    
    @Override
    public List<AmenityDTO> getAllAmenities() {
        return amenityRepository.findAll().stream()
                .map(amenityMapper::toDTO)
                .collect(Collectors.toList());
    }
    @Override
    public void deleteAmenity(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Amenity ID must not be null");
        }
         amenityRepository.deleteById(id);
    }

    
}
