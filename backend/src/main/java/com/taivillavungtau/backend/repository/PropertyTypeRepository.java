package com.taivillavungtau.backend.repository;

import com.taivillavungtau.backend.entity.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PropertyTypeRepository extends JpaRepository<PropertyType, Long> {
    Optional<PropertyType> findBySlug(String slug);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);
}
