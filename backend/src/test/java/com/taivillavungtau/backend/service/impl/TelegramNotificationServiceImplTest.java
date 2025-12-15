package com.taivillavungtau.backend.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class TelegramNotificationServiceImplTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private TelegramNotificationServiceImpl telegramNotificationService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(telegramNotificationService, "botToken", "test-token");
        ReflectionTestUtils.setField(telegramNotificationService, "chatId", "test-chat-id");
    }

    @Test
    void sendNotification_ShouldCallRestTemplate() {
        String message = "Hello Telegram";
        telegramNotificationService.sendNotification(message);

        // Verify that restTemplate.getForObject was called
        // The URL is constructed dynamically, so we can verify it starts with the expected base or contains the token
        verify(restTemplate).getForObject(anyString(), eq(String.class));
    }
}
