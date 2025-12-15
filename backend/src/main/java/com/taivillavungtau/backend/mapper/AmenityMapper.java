package com.taivillavungtau.backend.mapper;

import org.mapstruct.Mapper;

import com.taivillavungtau.backend.dto.AmenityDTO;
import com.taivillavungtau.backend.entity.Amenity;



@Mapper(componentModel = "spring")
public interface AmenityMapper {


    AmenityDTO toDTO(Amenity amenity);
    Amenity toEntity(AmenityDTO amenityDTO);
    
}
