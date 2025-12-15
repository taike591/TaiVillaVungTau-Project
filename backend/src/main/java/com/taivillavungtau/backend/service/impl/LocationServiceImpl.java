package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.dto.LocationDTO;
import com.taivillavungtau.backend.entity.Location;
import com.taivillavungtau.backend.exception.ResourceNotFoundException;
import com.taivillavungtau.backend.exception.DuplicateResourceException;
import com.taivillavungtau.backend.repository.LocationRepository;
import com.taivillavungtau.backend.service.LocationService;
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
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;

    @Override
    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LocationDTO getLocationById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khu vực không tồn tại"));
        return toDTO(location);
    }

    @Override
    @Transactional
    public LocationDTO createLocation(LocationDTO dto) {
        if (locationRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Tên khu vực đã tồn tại");
        }

        String slug = SlugUtil.toSlug(dto.getName());
        if (locationRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Location location = Location.builder()
                .name(dto.getName())
                .slug(slug)
                .description(dto.getDescription())
                .build();

        Location saved = locationRepository.save(location);
        log.info("Created location: {}", saved.getName());
        return toDTO(saved);
    }

    @Override
    @Transactional
    public LocationDTO updateLocation(Long id, LocationDTO dto) {
        Location existing = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khu vực không tồn tại"));

        if (!existing.getName().equals(dto.getName()) && locationRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Tên khu vực đã tồn tại");
        }

        existing.setName(dto.getName());
        existing.setSlug(SlugUtil.toSlug(dto.getName()));
        existing.setDescription(dto.getDescription());

        Location saved = locationRepository.save(existing);
        log.info("Updated location: {}", saved.getName());
        return toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Khu vực không tồn tại");
        }
        locationRepository.deleteById(id);
        log.info("Deleted location ID: {}", id);
    }

    private LocationDTO toDTO(Location entity) {
        return LocationDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .build();
    }
}
