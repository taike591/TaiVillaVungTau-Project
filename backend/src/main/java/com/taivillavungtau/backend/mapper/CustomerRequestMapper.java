package com.taivillavungtau.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.taivillavungtau.backend.dto.request.CustomerRequestDTO;
import com.taivillavungtau.backend.entity.CustomerRequest;


@Mapper(componentModel = "spring")
public interface CustomerRequestMapper {

    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "adminNote", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    CustomerRequest toEntity(CustomerRequestDTO dto);
    CustomerRequestDTO toDTO(CustomerRequest entity);
    
}
