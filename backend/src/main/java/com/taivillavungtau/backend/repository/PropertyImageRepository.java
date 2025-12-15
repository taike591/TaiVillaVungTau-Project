package com.taivillavungtau.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taivillavungtau.backend.entity.Property;
import com.taivillavungtau.backend.entity.PropertyImage;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
    long countByProperty(Property property);
}
