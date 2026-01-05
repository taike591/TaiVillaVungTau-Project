package com.taivillavungtau.backend.exception;

import com.taivillavungtau.backend.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

        // 1. Lỗi sai Tên đăng nhập hoặc Mật khẩu
        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ApiResponse<Object>> handleBadCredentialsException(BadCredentialsException ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(ApiResponse.error(HttpStatus.UNAUTHORIZED.value(),
                                                "Tên đăng nhập hoặc mật khẩu không chính xác",
                                                null));
        }

        // 2. Lỗi tài khoản bị khóa hoặc vô hiệu hóa
        @ExceptionHandler({ LockedException.class, DisabledException.class })
        public ResponseEntity<ApiResponse<Object>> handleAccountLockException(Exception ex) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(ApiResponse.error(HttpStatus.FORBIDDEN.value(),
                                                "Tài khoản đã bị khóa hoặc chưa kích hoạt",
                                                null));
        }

        // 3. Lỗi không có quyền truy cập (Ví dụ: User thường cố gọi API Admin)
        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(ApiResponse.error(HttpStatus.FORBIDDEN.value(),
                                                "Bạn không có quyền thực hiện thao tác này",
                                                null));
        }

        // 4. Lỗi không tìm thấy dữ liệu (404)
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), ex.getMessage(), null));
        }

        // 5. Lỗi trùng lặp dữ liệu (409)
        @ExceptionHandler(DuplicateResourceException.class)
        public ResponseEntity<ApiResponse<Object>> handleDuplicateResourceException(DuplicateResourceException ex) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(ApiResponse.error(HttpStatus.CONFLICT.value(), ex.getMessage(), null));
        }

        // 6. Lỗi Validate dữ liệu (400)
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
                Map<String, String> errors = new HashMap<>();
                ex.getBindingResult().getAllErrors().forEach((error) -> {
                        String fieldName = ((FieldError) error).getField();
                        String errorMessage = error.getDefaultMessage();
                        errors.put(fieldName, errorMessage);
                });
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(), "Dữ liệu đầu vào không hợp lệ",
                                                errors));
        }

        // 7. Lỗi gửi sai kiểu dữ liệu (Ví dụ: ID là số nhưng gửi chữ "abc")
        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ApiResponse<Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
                String message = "Giá trị '" + ex.getValue() + "' không hợp lệ cho trường '" + ex.getName() + "'";
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(), message, null));
        }

        // 8. Lỗi JSON sai định dạng (Ví dụ: thiếu dấu phẩy, sai cú pháp)
        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<ApiResponse<Object>> handleJsonError(HttpMessageNotReadableException ex) {
                log.error("JSON parsing error: {}", ex.getMessage());
                String detailMessage = ex.getMostSpecificCause().getMessage();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(),
                                                "Định dạng JSON không đúng: " + detailMessage, null));
        }

        // 9. Lỗi Upload file quá lớn
        @ExceptionHandler(MaxUploadSizeExceededException.class)
        public ResponseEntity<ApiResponse<Object>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                                .body(ApiResponse.error(HttpStatus.PAYLOAD_TOO_LARGE.value(),
                                                "File tải lên quá lớn (Tối đa 10MB)",
                                                null));
        }

        // 10. Lỗi hệ thống chung (500)
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
                log.error("Lỗi hệ thống không mong muốn: ", ex);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                                "Lỗi hệ thống: " + ex.getMessage(),
                                                null));
        }
}