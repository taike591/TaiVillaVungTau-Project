package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.service.TelegramNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder; // Import mới

@Service
@RequiredArgsConstructor
@Slf4j
public class TelegramNotificationServiceImpl implements TelegramNotificationService {

    private final RestTemplate restTemplate;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    @Override
    public void sendNotification(String message) {
        if (botToken == null || botToken.isEmpty() || chatId == null || chatId.isEmpty()) {
            log.warn("Telegram bot token or chat ID is not configured.");
            return;
        }

        // Sử dụng UriComponentsBuilder để xử lý khoảng trắng và ký tự đặc biệt
        String url = UriComponentsBuilder.fromHttpUrl("https://api.telegram.org")
                .path("/bot" + botToken + "/sendMessage")
                .queryParam("chat_id", chatId)
                .queryParam("text", message)
                .build()
                .toUriString();

        try {
            restTemplate.getForObject(url, String.class);
            log.info("Telegram notification sent successfully.");
        } catch (Exception e) {
            log.error("Gửi thông báo Telegram thất bại", e);
        }
    }
}