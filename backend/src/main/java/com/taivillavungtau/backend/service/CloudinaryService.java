package com.taivillavungtau.backend.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        // Upload file lên Cloudinary
        // folder: "taivilla" -> Gom hết ảnh vào thư mục này trên cloud cho gọn
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "taivilla"));

        // Trả về đường dẫn ảnh (URL)
        return uploadResult.get("secure_url").toString();
    }

    /**
     * Xóa ảnh khỏi Cloudinary
     * 
     * @param imageUrl URL đầy đủ của ảnh (VD:
     *                 https://res.cloudinary.com/xxx/image/upload/v123/taivilla/abc.jpg)
     */
    public void deleteImage(String imageUrl) {
        try {
            // Extract public_id from URL
            // URL format:
            // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{ext}
            // We need to extract: folder/public_id (without extension)
            String publicId = extractPublicId(imageUrl);
            if (publicId != null && !publicId.isEmpty()) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            // Log error but don't throw - image deletion from DB should still succeed
            System.err.println("Failed to delete image from Cloudinary: " + imageUrl + " - " + e.getMessage());
        }
    }

    /**
     * Extract public_id from Cloudinary URL
     */
    private String extractPublicId(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return null;
        }
        try {
            // Find the part after /upload/v{version}/
            int uploadIndex = imageUrl.indexOf("/upload/");
            if (uploadIndex == -1)
                return null;

            String afterUpload = imageUrl.substring(uploadIndex + 8); // Skip "/upload/"
            // Skip version (v123456789/)
            if (afterUpload.startsWith("v")) {
                int slashIndex = afterUpload.indexOf("/");
                if (slashIndex != -1) {
                    afterUpload = afterUpload.substring(slashIndex + 1);
                }
            }
            // Remove file extension
            int dotIndex = afterUpload.lastIndexOf(".");
            if (dotIndex != -1) {
                afterUpload = afterUpload.substring(0, dotIndex);
            }
            return afterUpload; // Returns "taivilla/filename"
        } catch (Exception e) {
            return null;
        }
    }

}
