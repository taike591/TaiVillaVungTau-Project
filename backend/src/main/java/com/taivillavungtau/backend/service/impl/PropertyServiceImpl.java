package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.dto.PropertyDTO;
import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.dto.response.PageResponse;
import com.taivillavungtau.backend.entity.Amenity;
import com.taivillavungtau.backend.entity.Property;
import com.taivillavungtau.backend.entity.PropertyImage;
import com.taivillavungtau.backend.enums.SortType;
import com.taivillavungtau.backend.exception.DuplicateResourceException;
import com.taivillavungtau.backend.exception.ResourceNotFoundException;
import com.taivillavungtau.backend.mapper.PropertyMapper;
import com.taivillavungtau.backend.repository.PropertyRepository;
import com.taivillavungtau.backend.repository.specification.PropertySpecification;
import com.taivillavungtau.backend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Objects;

import com.taivillavungtau.backend.repository.AmenityRepository;
import com.taivillavungtau.backend.repository.LocationRepository;
import com.taivillavungtau.backend.repository.PropertyImageRepository;
import com.taivillavungtau.backend.repository.PropertyTypeRepository;
import com.taivillavungtau.backend.service.CloudinaryService;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import com.taivillavungtau.backend.utils.SlugUtils;
import com.taivillavungtau.backend.utils.Translator;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyServiceImpl implements PropertyService {
    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;
    private final PropertyImageRepository propertyImageRepository;
    private final AmenityRepository amenityRepository;
    private final LocationRepository locationRepository;
    private final PropertyTypeRepository propertyTypeRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    // Khi tạo mới -> Xóa cache danh sách tìm kiếm để user thấy bài mới ngay
    @CacheEvict(value = "property_search", allEntries = true)
    public PropertyDTO createProperty(PropertyDTO dto) {
        log.info("Creating new property with code: {}", dto.getCode());
        // 1. GIỮ LẠI LOGIC: Check trùng mã Villa
        if (propertyRepository.existsByCode(dto.getCode())) {
            log.warn("Duplicate property code attempted: {}", dto.getCode());
            throw new DuplicateResourceException(
                    String.format(Translator.toLocale("error.villa.code_existed"), dto.getCode()));
        }

        Property property = propertyMapper.toEntity(dto);

        // 2. GIỮ LẠI LOGIC: Tạo Slug
        String slugRaw = dto.getName() + "-" + dto.getCode();
        property.setSlug(SlugUtils.toSlug(slugRaw));

        // 3. Xử lý Amenities (Tiện ích)
        if (dto.getAmenityIds() != null && !dto.getAmenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepository.findAllById(Objects.requireNonNull(dto.getAmenityIds()));
            property.setAmenities(new HashSet<>(amenities));
        }

        if (dto.getIsFeatured() != null) {
            property.setIsFeatured(dto.getIsFeatured());
        }

        // 4. Xử lý Location mới (dynamic)
        if (dto.getLocationId() != null) {
            locationRepository.findById(dto.getLocationId())
                    .ifPresent(property::setLocationEntity);
        }

        // 5. Xử lý Property Type
        if (dto.getPropertyTypeId() != null) {
            propertyTypeRepository.findById(dto.getPropertyTypeId())
                    .ifPresent(property::setPropertyType);
        }

        property.setStatus("ACTIVE");
        Property savedProperty = propertyRepository.save(property);
        log.info("Property created successfully with ID: {}", savedProperty.getId());
        return propertyMapper.toDTO(savedProperty);
    }

    @Override
    public List<PropertyDTO> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(propertyMapper::toDTO) // Method Reference: Gọn gàng
                .collect(Collectors.toList());
    }

    @Override
    // Cache kết quả tìm kiếm. Key tự động sinh dựa trên tham số request
    @Cacheable(value = "property_search", key = "#request.toString()")
    @Transactional(readOnly = true)
    public PageResponse<PropertyDTO> searchProperties(PropertySearchRequest request) {
        log.debug("Searching properties with request: {}", request);

        // 1. Xây dựng Specification từ request
        Specification<Property> spec = PropertySpecification.filter(request);

        // 2. Xử lý Sorting
        SortType sortType = SortType.fromValue(request.getSort());
        Sort sort;
        switch (sortType) {
            case PRICE_ASC:
                sort = Sort.by(Sort.Direction.ASC, "priceWeekday")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case PRICE_DESC:
                sort = Sort.by(Sort.Direction.DESC, "priceWeekday")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case NAME_ASC:
                sort = Sort.by(Sort.Direction.ASC, "name")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case NAME_DESC:
                sort = Sort.by(Sort.Direction.DESC, "name")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case STATUS_ASC:
                sort = Sort.by(Sort.Direction.ASC, "status")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case STATUS_DESC:
                sort = Sort.by(Sort.Direction.DESC, "status")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case CREATED_AT_ASC:
                sort = Sort.by(Sort.Direction.ASC, "createdAt")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case CREATED_AT_DESC:
                sort = Sort.by(Sort.Direction.DESC, "createdAt")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case UPDATED_AT_ASC:
                sort = Sort.by(Sort.Direction.ASC, "updatedAt")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case UPDATED_AT_DESC:
                sort = Sort.by(Sort.Direction.DESC, "updatedAt")
                        .and(Sort.by(Sort.Direction.DESC, "code"));
                break;
            case CODE_ASC:
            case CODE_DESC:
            case NEWEST:
            default:
                // Default & Code sort handled in Specification (Length(code) + Code)
                sort = Sort.unsorted();
                break;
        }

        // 3. Xử lý Phân trang (với giá trị mặc định an toàn)
        int page = (request.getPage() != null && request.getPage() >= 0) ? request.getPage() : 0;
        int size = (request.getSize() != null && request.getSize() > 0 && request.getSize() <= 100)
                ? request.getSize()
                : 10;
        Pageable pageable = PageRequest.of(page, size, sort);

        // 4. Gọi Repository với Specification
        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);

        log.debug("Found {} properties matching search criteria", propertyPage.getTotalElements());

        // 5. Map Entity sang DTO
        List<PropertyDTO> dtos = propertyPage.getContent().stream()
                .map(propertyMapper::toDTO)
                .collect(Collectors.toList());

        // 6. Đóng gói vào PageResponse
        return PageResponse.<PropertyDTO>builder()
                .content(dtos)
                .pageNo(propertyPage.getNumber())
                .pageSize(propertyPage.getSize())
                .totalElements(propertyPage.getTotalElements())
                .totalPages(propertyPage.getTotalPages())
                .last(propertyPage.isLast())
                .build();
    }

    @Override
    @Transactional
    // Khi thêm ảnh -> Xóa cache của căn đó để user thấy ảnh mới
    @CacheEvict(value = "properties", key = "#propertyId")
    public void addImageToProperty(Long propertyId, String imageUrl) {
        Objects.requireNonNull(propertyId, "Property ID must not be null");
        log.info("Adding image to property ID: {}", propertyId);
        // 1. Tìm Villa
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> {
                    log.error("Property not found for adding image. ID: {}", propertyId);
                    return new ResourceNotFoundException(Translator.toLocale("error.villa.not_found"));
                });

        // 2. GIỮ LẠI LOGIC: Kiểm tra ảnh đầu tiên là thumbnail (Logic này rất tốt, tối
        // ưu hiệu năng)
        long imageCount = propertyImageRepository.countByProperty(property);
        boolean isFirstImage = (imageCount == 0);

        // 3. Tạo đối tượng ảnh
        PropertyImage image = PropertyImage.builder()
                .imageUrl(imageUrl)
                .property(property)
                .isThumbnail(isFirstImage)
                .build();

        propertyImageRepository.save(Objects.requireNonNull(image));
    }

    @Override
    // Cache chi tiết từng căn. Key là ID (VD: properties::4)
    @Cacheable(value = "properties", key = "#id")
    @Transactional(readOnly = true)
    public PropertyDTO getPropertyById(Long id) {
        Objects.requireNonNull(id, "Property ID must not be null");
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Translator.toLocale("error.villa.not_found")));
        return propertyMapper.toDTO(property);
    }

    @Override
    @Transactional
    // Khi update -> Xóa cache của chính căn đó VÀ xóa cache tìm kiếm
    @Caching(evict = {
            @CacheEvict(value = "properties", key = "#id"),
            @CacheEvict(value = "property_search", allEntries = true)
    })
    public PropertyDTO updateProperty(Long id, PropertyDTO dto) {
        Objects.requireNonNull(id, "Property ID must not be null");
        log.info("Updating property ID: {}", id);
        Property existing = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Translator.toLocale("error.villa.not_found")));
        existing.setLocation(dto.getLocation()); // Thêm dòng này
        // --- CẬP NHẬT CÁC TRƯỜNG (Dùng getter chuẩn hóa) ---
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setAddress(dto.getAddress());
        existing.setArea(dto.getArea());
        existing.setMapUrl(dto.getMapUrl());
        existing.setFacebookLink(dto.getFacebookLink());

        // Cập nhật giá & sức chứa (Dùng tên mới chuẩn hóa)
        existing.setPriceWeekday(dto.getPriceWeekday());
        existing.setPriceWeekend(dto.getPriceWeekend());
        existing.setStandardGuests(dto.getStandardGuests());
        existing.setMaxGuests(dto.getMaxGuests());
        existing.setBedroomCount(dto.getBedroomCount());
        existing.setBathroomCount(dto.getBathroomCount());

        // --- CẬP NHẬT CÁC TRƯỜNG MỚI (Fix lỗi không lưu) ---
        existing.setBedCount(dto.getBedCount());
        existing.setBedConfig(dto.getBedConfig());
        existing.setDistanceToSea(dto.getDistanceToSea());
        existing.setPriceNote(dto.getPriceNote());

        // Update isFeatured if provided
        if (dto.getIsFeatured() != null) {
            existing.setIsFeatured(dto.getIsFeatured());
        }

        // Cập nhật Slug nếu tên thay đổi
        String slugRaw = dto.getName() + "-" + existing.getCode();
        existing.setSlug(SlugUtils.toSlug(slugRaw));

        // Cập nhật Tiện ích
        if (dto.getAmenityIds() != null) {
            existing.getAmenities().clear();
            if (!dto.getAmenityIds().isEmpty()) {
                List<Amenity> amenities = amenityRepository.findAllById(Objects.requireNonNull(dto.getAmenityIds()));
                existing.getAmenities().addAll(amenities);
            }
        }

        // Cập nhật Location mới (dynamic)
        if (dto.getLocationId() != null) {
            locationRepository.findById(dto.getLocationId())
                    .ifPresent(existing::setLocationEntity);
        }

        // Cập nhật Property Type
        if (dto.getPropertyTypeId() != null) {
            propertyTypeRepository.findById(dto.getPropertyTypeId())
                    .ifPresent(existing::setPropertyType);
        }

        Property updated = propertyRepository.save(existing);
        log.info("Property updated successfully. ID: {}", id);
        return propertyMapper.toDTO(updated);
    }

    @Override
    @Transactional
    // Khi xóa -> Xóa cache của chính căn đó VÀ xóa cache tìm kiếm
    @Caching(evict = {
            @CacheEvict(value = "properties", key = "#id"),
            @CacheEvict(value = "property_search", allEntries = true)
    })
    public void deleteProperty(Long id) {
        Objects.requireNonNull(id, "Property ID must not be null");
        log.info("Deleting property ID: {}", id);

        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Attempt to delete non-existent property ID: {}", id);
                    return new ResourceNotFoundException(Translator.toLocale("error.villa.not_found"));
                });

        // SOFT DELETE: Change status to DELETED instead of removing from DB
        property.setStatus("DELETED");
        propertyRepository.save(property);

        log.info("Property soft-deleted successfully. ID: {}", id);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "properties", key = "#id"),
            @CacheEvict(value = "property_search", allEntries = true)
    })
    public PropertyDTO patchProperty(Long id, PropertyDTO dto) {
        Objects.requireNonNull(id, "Property ID must not be null");
        log.info("Patching property ID: {} with partial data", id);

        Property existing = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Translator.toLocale("error.villa.not_found")));

        // Only update fields that are explicitly provided (not null)
        if (dto.getIsFeatured() != null) {
            existing.setIsFeatured(dto.getIsFeatured());
        }
        if (dto.getName() != null) {
            existing.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            existing.setDescription(dto.getDescription());
        }
        if (dto.getPriceWeekday() != null) {
            existing.setPriceWeekday(dto.getPriceWeekday());
        }
        if (dto.getPriceWeekend() != null) {
            existing.setPriceWeekend(dto.getPriceWeekend());
        }
        // Handle status change (for enable/disable toggle)
        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }

        Property updated = propertyRepository.save(existing);
        log.info("Property patched successfully. ID: {}", id);
        return propertyMapper.toDTO(updated);
    }

    @Override
    @Transactional
    @CacheEvict(value = "properties", key = "#propertyId")
    public void deleteImageFromProperty(Long propertyId, Long imageId) {
        Objects.requireNonNull(propertyId, "Property ID must not be null");
        Objects.requireNonNull(imageId, "Image ID must not be null");
        log.info("Deleting image ID: {} from property ID: {}", imageId, propertyId);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException(Translator.toLocale("error.villa.not_found")));

        PropertyImage image = property.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Ảnh không tồn tại"));

        // Delete from Cloudinary first (before DB)
        String imageUrl = image.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            cloudinaryService.deleteImage(imageUrl);
            log.info("Image deleted from cloud storage: {}", imageUrl);
        }

        property.getImages().remove(image);
        propertyImageRepository.delete(image);
        log.info("Image deleted from database. ID: {}", imageId);
    }

    @Override
    @Transactional
    @CacheEvict(value = "properties", key = "#propertyId")
    public void setThumbnail(Long propertyId, Long imageId) {
        Objects.requireNonNull(propertyId, "Property ID must not be null");
        Objects.requireNonNull(imageId, "Image ID must not be null");
        log.info("Setting thumbnail for property ID: {} to image ID: {}", propertyId, imageId);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException(Translator.toLocale("error.villa.not_found")));

        // Reset all thumbnails to false, then set the selected one to true
        property.getImages().forEach(img -> img.setIsThumbnail(false));

        PropertyImage targetImage = property.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Ảnh không tồn tại"));

        targetImage.setIsThumbnail(true);
        propertyRepository.save(property);
        log.info("Thumbnail set successfully for property ID: {}", propertyId);
    }

}