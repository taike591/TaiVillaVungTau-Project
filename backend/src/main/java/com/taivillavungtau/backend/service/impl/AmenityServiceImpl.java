package com.taivillavungtau.backend.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taivillavungtau.backend.dto.AmenityDTO;
import com.taivillavungtau.backend.entity.Amenity;
import com.taivillavungtau.backend.exception.DuplicateResourceException;
import com.taivillavungtau.backend.mapper.AmenityMapper;
import com.taivillavungtau.backend.repository.AmenityRepository;
import com.taivillavungtau.backend.service.AmenityService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AmenityServiceImpl implements AmenityService {

    private final AmenityRepository amenityRepository;
    private final AmenityMapper amenityMapper;

    @PersistenceContext
    private EntityManager entityManager;

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
    @Transactional
    public void deleteAmenity(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Amenity ID must not be null");
        }

        // 1. Xóa tất cả liên kết trong bảng property_amenities trước
        entityManager.createNativeQuery("DELETE FROM property_amenities WHERE amenity_id = :amenityId")
                .setParameter("amenityId", id)
                .executeUpdate();

        // 2. Sau đó mới xóa amenity
        amenityRepository.deleteById(id);
    }

}
