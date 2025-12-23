package com.taivillavungtau.backend.mapper;

import com.taivillavungtau.backend.dto.LabelDTO;
import com.taivillavungtau.backend.entity.Label;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LabelMapper {

    LabelDTO toDTO(Label label);

    Label toEntity(LabelDTO dto);
}
