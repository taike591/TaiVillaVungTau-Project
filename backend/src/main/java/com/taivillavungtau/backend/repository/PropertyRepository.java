package com.taivillavungtau.backend.repository;

import com.taivillavungtau.backend.entity.Property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    @Override
    Page<Property> findAll(Specification<Property> spec, Pageable pageable);

    // Override findById to fetch images and amenities eagerly for detail view
    @Override
    @EntityGraph(attributePaths = { "amenities", "images" })
    Optional<Property> findById(Long id);

    // Tìm theo mã căn (MS44) - Fetch luôn amenities & images
    @EntityGraph(attributePaths = { "amenities", "images" })
    Optional<Property> findByCode(String code);

    // Tìm theo slug để làm SEO - Fetch luôn amenities & images
    @EntityGraph(attributePaths = { "amenities", "images" })
    Optional<Property> findBySlug(String slug);

    // Kiểm tra mã đã tồn tại chưa
    boolean existsByCode(String code);

    long countByStatus(String status);
}