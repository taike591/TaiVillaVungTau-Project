package com.taivillavungtau.backend.controller;

import com.taivillavungtau.backend.dto.response.ApiResponse;
import com.taivillavungtau.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Controller for standalone image upload operations
 * Used when creating new properties (before property ID exists)
 */
@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
@Slf4j
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    /**
     * Upload a single image to Cloudinary
     * Returns the Cloudinary URL
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Uploading standalone image: {}", file.getOriginalFilename());
            String imageUrl = cloudinaryService.uploadImage(file);
            log.info("Image uploaded successfully: {}", imageUrl);
            return ResponseEntity.ok(ApiResponse.success(imageUrl, "Upload ảnh thành công"));
        } catch (IOException e) {
            log.error("Error uploading image: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Upload ảnh thất bại: " + e.getMessage(), null));
        }
    }

    /**
     * Upload multiple images to Cloudinary
     * Returns list of Cloudinary URLs
     */
    @PostMapping("/upload-multiple")
    public ResponseEntity<ApiResponse<List<String>>> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files) {
        try {
            log.info("Uploading {} images", files.length);
            List<String> imageUrls = new ArrayList<>();

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(file);
                    imageUrls.add(imageUrl);
                }
            }

            log.info("Successfully uploaded {} images", imageUrls.size());
            return ResponseEntity.ok(ApiResponse.success(imageUrls, "Upload " + imageUrls.size() + " ảnh thành công"));
        } catch (IOException e) {
            log.error("Error uploading images: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Upload ảnh thất bại: " + e.getMessage(), null));
        }
    }
}
