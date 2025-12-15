package com.taivillavungtau.backend.repository;

import com.taivillavungtau.backend.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    boolean existsByName(String name);
    
}