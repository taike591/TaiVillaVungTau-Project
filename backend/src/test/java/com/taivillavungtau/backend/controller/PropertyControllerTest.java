package com.taivillavungtau.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taivillavungtau.backend.dto.PropertyDTO;
import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.dto.response.PageResponse;
import com.taivillavungtau.backend.service.CloudinaryService;
import com.taivillavungtau.backend.service.PropertyService;
import com.taivillavungtau.backend.service.RefreshTokenService;
import com.taivillavungtau.backend.utils.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import com.taivillavungtau.backend.utils.Translator;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Locale;

import org.junit.jupiter.api.BeforeEach;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PropertyController.class)
@AutoConfigureMockMvc(addFilters = false)
class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PropertyService propertyService;

    @MockBean
    private com.taivillavungtau.backend.service.impl.UserDetailsServiceImpl userDetailsService; // Required by JwtAuthenticationFilter

    @MockBean
    private CloudinaryService cloudinaryService;

    @MockBean
    private MessageSource messageSource;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private RefreshTokenService refreshTokenService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Mock MessageSource for Translator utility
        when(messageSource.getMessage(anyString(), any(), any(Locale.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        // Inject MessageSource into Translator static field
        ReflectionTestUtils.setField(Translator.class, "messageSource", messageSource);
    }

    @Test
    void createProperty_ShouldReturnCreated_WhenValid() throws Exception {
        PropertyDTO dto = new PropertyDTO();
        dto.setCode("MS01");
        dto.setName("Test Villa");
        dto.setBedroomCount(3);
        dto.setBathroomCount(2);
        dto.setStandardGuests(6);
        dto.setPriceWeekday(BigDecimal.valueOf(2000000));
        dto.setPriceWeekend(BigDecimal.valueOf(2500000));

        when(propertyService.createProperty(any(PropertyDTO.class))).thenReturn(dto);

        mockMvc.perform(post("/api/v1/properties")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.code").value("MS01"));
    }

    @Test
    void getProperties_ShouldReturnList() throws Exception {
        PageResponse<PropertyDTO> pageResponse = PageResponse.<PropertyDTO>builder()
                .content(Collections.emptyList())
                .pageNo(0)
                .pageSize(10)
                .totalElements(0)
                .totalPages(0)
                .last(true)
                .build();

        when(propertyService.searchProperties(any(PropertySearchRequest.class))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/properties")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray());
    }
}
