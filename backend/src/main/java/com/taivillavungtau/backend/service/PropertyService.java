package com.taivillavungtau.backend.service;

import com.taivillavungtau.backend.dto.PropertyDTO;
import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.dto.response.PageResponse;

import java.util.List;

import org.springframework.data.domain.Page;

public interface PropertyService {
    PropertyDTO createProperty(PropertyDTO propertyDTO);

    List<PropertyDTO> getAllProperties();

    PageResponse<PropertyDTO> searchProperties(PropertySearchRequest request);

    void addImageToProperty(Long propertyId, String imageUrl);

    void deleteImageFromProperty(Long propertyId, Long imageId);

    void setThumbnail(Long propertyId, Long imageId);

    PropertyDTO getPropertyById(Long id); // Xem chi tiết 1 căn

    PropertyDTO updateProperty(Long id, PropertyDTO propertyDTO); // Sửa

    PropertyDTO patchProperty(Long id, PropertyDTO propertyDTO); // Partial update (PATCH)

    void deleteProperty(Long id);

    /**
     * Permanently delete a property and all associated data (images, amenity
     * links).
     * WARNING: This action is irreversible!
     */
    void permanentDeleteProperty(Long id);
}