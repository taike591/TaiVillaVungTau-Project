package com.taivillavungtau.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration for performance optimization.
 * 
 * Note: HTTP compression (gzip) should be enabled in application.properties:
 * server.compression.enabled=true
 * server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain,application/javascript,text/css
 * server.compression.min-response-size=1024
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // Additional web MVC configurations can be added here
    // Compression is handled by Spring Boot properties (see comment above)
}
