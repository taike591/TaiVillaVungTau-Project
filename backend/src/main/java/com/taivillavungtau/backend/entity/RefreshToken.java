package com.taivillavungtau.backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.Instant;

@RedisHash(value = "refresh_tokens", timeToLive = 2592000) // 30 days for long-term sessions
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    @Id
    private String id;

    @Indexed
    private String token;

    @Indexed
    private Long userId;

    private Instant expiryDate;
}
