package com.taivillavungtau.backend.mapper;

import com.taivillavungtau.backend.dto.PropertyDTO;
import com.taivillavungtau.backend.dto.PropertyImageDTO;
import com.taivillavungtau.backend.entity.Property;
import com.taivillavungtau.backend.entity.PropertyImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { AmenityMapper.class, LabelMapper.class })
public interface PropertyMapper {

    // Entity -> DTO
    @Mapping(target = "amenityIds", ignore = true) // Không cần map ngược lại ID
    @Mapping(target = "labelIds", ignore = true) // Không cần map ngược lại ID
    @Mapping(target = "images", source = "images") // MapStruct tự động map Set<PropertyImage> sang
                                                   // List<PropertyImageDTO>
    @Mapping(target = "locationId", source = "locationEntity.id")
    @Mapping(target = "locationName", source = "locationEntity.name")
    @Mapping(target = "propertyTypeId", source = "propertyType.id")
    @Mapping(target = "propertyTypeName", source = "propertyType.name")
    PropertyDTO toDTO(Property property);

    // DTO -> Entity
    @Mapping(target = "amenities", ignore = true) // Sẽ xử lý tay trong Service
    @Mapping(target = "labels", ignore = true) // Sẽ xử lý tay trong Service
    @Mapping(target = "images", ignore = true) // Sẽ xử lý tay trong Service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "locationEntity", ignore = true) // Xử lý tay trong Service
    @Mapping(target = "propertyType", ignore = true) // Xử lý tay trong Service
    Property toEntity(PropertyDTO dto);

    PropertyImageDTO toImageDTO(PropertyImage propertyImage);

}