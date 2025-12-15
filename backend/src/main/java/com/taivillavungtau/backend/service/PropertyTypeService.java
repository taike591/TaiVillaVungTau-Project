package com.taivillavungtau.backend.service;

import com.taivillavungtau.backend.dto.PropertyTypeDTO;
import java.util.List;

public interface PropertyTypeService {
    List<PropertyTypeDTO> getAllPropertyTypes();

    PropertyTypeDTO getPropertyTypeById(Long id);

    PropertyTypeDTO createPropertyType(PropertyTypeDTO dto);

    PropertyTypeDTO updatePropertyType(Long id, PropertyTypeDTO dto);

    void deletePropertyType(Long id);
}
