package com.taivillavungtau.backend.util;

import com.taivillavungtau.backend.dto.AmenityDTO;
import com.taivillavungtau.backend.dto.PropertyDTO;
import com.taivillavungtau.backend.dto.request.CustomerRequestDTO;
import com.taivillavungtau.backend.dto.request.LoginRequest;
import com.taivillavungtau.backend.dto.request.RegisterRequest;
import com.taivillavungtau.backend.entity.*;
import com.taivillavungtau.backend.enums.LocationType;
import org.apache.commons.lang3.RandomStringUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashSet;

/**
 * Utility class for building test data objects
 * Provides builder methods for creating valid test entities and DTOs
 */
public class TestDataBuilder {

    /**
     * Creates a valid Property builder with default test values
     * @return Property.PropertyBuilder with sensible defaults
     */
    public static Property.PropertyBuilder validProperty() {
        String code = "MS" + RandomStringUtils.randomNumeric(3);
        return Property.builder()
                .code(code)
                .name("Test Villa " + code)
                .slug("test-villa-" + code.toLowerCase())
                .priceWeekday(new BigDecimal("2000000"))
                .priceWeekend(new BigDecimal("2500000"))
                .bedroomCount(3)
                .bathroomCount(2)
                .standardGuests(6)
                .maxGuests(8)
                .location(LocationType.BAI_TRUOC)
                .description("Test property description")
                .amenities(new HashSet<>())
                .images(new HashSet<>());
    }

    /**
     * Creates a valid PropertyDTO builder with default test values
     * @return PropertyDTO.PropertyDTOBuilder with sensible defaults
     */
    public static PropertyDTO.PropertyDTOBuilder validPropertyDTO() {
        String code = "MS" + RandomStringUtils.randomNumeric(3);
        return PropertyDTO.builder()
                .code(code)
                .name("Test Villa " + code)
                .slug("test-villa-" + code.toLowerCase())
                .priceWeekday(new BigDecimal("2000000"))
                .priceWeekend(new BigDecimal("2500000"))
                .bedroomCount(3)
                .bathroomCount(2)
                .standardGuests(6)
                .maxGuests(8)
                .location(LocationType.BAI_TRUOC)
                .description("Test property description");
    }

    /**
     * Creates a valid User builder with default test values
     * @return User.UserBuilder with sensible defaults
     */
    public static User.UserBuilder validUser() {
        String username = "testuser" + RandomStringUtils.randomNumeric(4);
        return User.builder()
                .username(username)
                .email(username + "@test.com")
                .password("$2a$10$testHashedPassword")
                .role("ROLE_USER")
                .active(true);
    }

    /**
     * Creates a valid admin User builder
     * @return User.UserBuilder configured as admin
     */
    public static User.UserBuilder validAdmin() {
        String username = "admin" + RandomStringUtils.randomNumeric(4);
        return User.builder()
                .username(username)
                .email(username + "@test.com")
                .password("$2a$10$testHashedPassword")
                .role("ROLE_ADMIN")
                .active(true);
    }

    /**
     * Creates a valid Amenity builder with default test values
     * @return Amenity.AmenityBuilder with sensible defaults
     */
    public static Amenity.AmenityBuilder validAmenity() {
        String name = "Test Amenity " + RandomStringUtils.randomNumeric(3);
        return Amenity.builder()
                .name(name)
                .iconCode("test-icon");
    }

    /**
     * Creates a valid AmenityDTO builder with default test values
     * @return AmenityDTO.AmenityDTOBuilder with sensible defaults
     */
    public static AmenityDTO.AmenityDTOBuilder validAmenityDTO() {
        String name = "Test Amenity " + RandomStringUtils.randomNumeric(3);
        return AmenityDTO.builder()
                .name(name)
                .iconCode("test-icon");
    }

    /**
     * Creates a valid CustomerRequest builder with default test values
     * @return CustomerRequest.CustomerRequestBuilder with sensible defaults
     */
    public static CustomerRequest.CustomerRequestBuilder validCustomerRequest() {
        return CustomerRequest.builder()
                .customerName("Test Customer")
                .phoneNumber("0123456789")
                .note("Test booking request")
                .propertyCode("MS001")
                .status("NEW")
                .adminNote("")
                .createdAt(LocalDateTime.now());
    }

    /**
     * Creates a valid CustomerRequestDTO with default test values
     * @return CustomerRequestDTO with sensible defaults
     */
    public static CustomerRequestDTO validCustomerRequestDTO() {
        CustomerRequestDTO dto = new CustomerRequestDTO();
        dto.setCustomerName("Test Customer");
        dto.setPhoneNumber("0123456789");
        dto.setNote("Test booking request");
        dto.setPropertyCode("MS001");
        return dto;
    }

    /**
     * Creates a valid RefreshToken builder with default test values
     * @return RefreshToken.RefreshTokenBuilder with sensible defaults
     */
    public static RefreshToken.RefreshTokenBuilder validRefreshToken() {
        return RefreshToken.builder()
                .token(RandomStringUtils.randomAlphanumeric(64))
                .expiryDate(Instant.now().plusSeconds(86400));
    }

    /**
     * Creates a valid LoginRequest with default test values
     * @return LoginRequest with sensible defaults
     */
    public static LoginRequest validLoginRequest() {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");
        return request;
    }

    /**
     * Creates a valid RegisterRequest with default test values
     * @return RegisterRequest with sensible defaults
     */
    public static RegisterRequest validRegisterRequest() {
        String username = "newuser" + RandomStringUtils.randomNumeric(4);
        RegisterRequest request = new RegisterRequest();
        request.setUsername(username);
        request.setEmail(username + "@test.com");
        request.setPassword("password123");
        return request;
    }

    /**
     * Creates a valid PropertyImage builder with default test values
     * @return PropertyImage.PropertyImageBuilder with sensible defaults
     */
    public static PropertyImage.PropertyImageBuilder validPropertyImage() {
        return PropertyImage.builder()
                .imageUrl("https://test.cloudinary.com/image.jpg")
                .isThumbnail(false);
    }
}
