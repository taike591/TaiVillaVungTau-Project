package com.taivillavungtau.backend.service;

import com.taivillavungtau.backend.dto.LabelDTO;

import java.util.List;

public interface LabelService {

    LabelDTO createLabel(LabelDTO labelDTO);

    List<LabelDTO> getAllLabels();

    LabelDTO updateLabel(Long id, LabelDTO labelDTO);

    void deleteLabel(Long id);
}
