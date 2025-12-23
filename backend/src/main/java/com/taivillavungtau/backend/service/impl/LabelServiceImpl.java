package com.taivillavungtau.backend.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taivillavungtau.backend.dto.LabelDTO;
import com.taivillavungtau.backend.entity.Label;
import com.taivillavungtau.backend.exception.DuplicateResourceException;
import com.taivillavungtau.backend.exception.ResourceNotFoundException;
import com.taivillavungtau.backend.mapper.LabelMapper;
import com.taivillavungtau.backend.repository.LabelRepository;
import com.taivillavungtau.backend.service.LabelService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabelServiceImpl implements LabelService {

    private final LabelRepository labelRepository;
    private final LabelMapper labelMapper;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public LabelDTO createLabel(LabelDTO labelDTO) {
        if (labelDTO == null) {
            throw new IllegalArgumentException("LabelDTO must not be null");
        }
        log.info("Creating new label: {}", labelDTO.getName());

        // Check duplicate name
        if (labelRepository.existsByName(labelDTO.getName())) {
            throw new DuplicateResourceException("Label này đã tồn tại");
        }

        Label label = labelMapper.toEntity(labelDTO);
        Label saved = labelRepository.save(Objects.requireNonNull(label));
        log.info("Label created successfully with ID: {}", saved.getId());
        return labelMapper.toDTO(saved);
    }

    @Override
    public List<LabelDTO> getAllLabels() {
        return labelRepository.findAll().stream()
                .map(labelMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LabelDTO updateLabel(Long id, LabelDTO labelDTO) {
        Objects.requireNonNull(id, "Label ID must not be null");
        log.info("Updating label ID: {}", id);

        Label existing = labelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy label với ID: " + id));

        // Check if new name conflicts with another label
        if (labelDTO.getName() != null && !labelDTO.getName().equals(existing.getName())) {
            if (labelRepository.existsByName(labelDTO.getName())) {
                throw new DuplicateResourceException("Tên label đã tồn tại");
            }
            existing.setName(labelDTO.getName());
        }

        if (labelDTO.getColor() != null) {
            existing.setColor(labelDTO.getColor());
        }

        if (labelDTO.getIconCode() != null) {
            existing.setIconCode(labelDTO.getIconCode());
        }

        Label updated = labelRepository.save(existing);
        log.info("Label updated successfully. ID: {}", id);
        return labelMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteLabel(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Label ID must not be null");
        }
        log.info("Deleting label ID: {}", id);

        // 1. Delete all relations in property_labels first
        entityManager.createNativeQuery("DELETE FROM property_labels WHERE label_id = :labelId")
                .setParameter("labelId", id)
                .executeUpdate();

        // 2. Then delete the label
        labelRepository.deleteById(id);
        log.info("Label deleted successfully. ID: {}", id);
    }
}
