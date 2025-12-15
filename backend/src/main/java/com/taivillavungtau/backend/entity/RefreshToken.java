package com.taivillavungtau.backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.Instant;

@RedisHash(value = "refresh_tokens", timeToLive = 86400) // Default 1 day, can be configured
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
