package com.taivillavungtau.backend.config;

import com.taivillavungtau.backend.service.TelegramNotificationService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.support.ResourceBundleMessageSource;

import static org.mockito.Mockito.mock;

/**
 * Test configuration class for providing test-specific beans
 * This configuration is used across all test classes to provide consistent test setup
 */
@TestConfiguration
public class TestConfig {

    /**
     * Provides a test MessageSource bean for internationalization in tests
     * @return MessageSource configured for test environment
     */
    @Bean
    @Primary
    public MessageSource messageSource() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("messages");
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setUseCodeAsDefaultMessage(true);
        return messageSource;
    }

    /**
     * Provides a mock TelegramNotificationService to avoid external calls during tests
     * @return Mocked TelegramNotificationService
     */
    @Bean
    @Primary
    public TelegramNotificationService mockTelegramService() {
        return mock(TelegramNotificationService.class);
    }
}
