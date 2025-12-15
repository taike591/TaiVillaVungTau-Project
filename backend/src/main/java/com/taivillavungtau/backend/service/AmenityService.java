package com.taivillavungtau.backend.service;

import java.util.List;

import com.taivillavungtau.backend.dto.AmenityDTO;

public interface AmenityService {
    AmenityDTO createAmenity(AmenityDTO amenityDTO);
    List<AmenityDTO> getAllAmenities();
    void deleteAmenity(Long id);   

}
