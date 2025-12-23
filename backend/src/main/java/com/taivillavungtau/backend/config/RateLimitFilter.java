package com.taivillavungtau.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate limiting filter to protect API endpoints from abuse.
 * Uses token bucket algorithm with IP-based tracking.
 * 
 * Configuration:
 * - rate.limit.search.requests-per-minute: Limit for search endpoints (default:
 * 30)
 * - rate.limit.general.requests-per-minute: Limit for general endpoints
 * (default: 100)
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Value("${rate.limit.search.requests-per-minute:30}")
    private int searchRequestsPerMinute;

    @Value("${rate.limit.general.requests-per-minute:100}")
    private int generalRequestsPerMinute;

    // Store request counts per IP with timestamp
    private final Map<String, RateLimitBucket> ipBuckets = new ConcurrentHashMap<>();

    // Cleanup old entries every 5 minutes
    private long lastCleanup = System.currentTimeMillis();
    private static final long CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
    private static final long BUCKET_EXPIRY_MS = 60 * 1000; // 1 minute

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String clientIp = getClientIp(request);
        String requestPath = request.getRequestURI();

        // Determine rate limit based on endpoint
        int limit = isSearchEndpoint(requestPath) ? searchRequestsPerMinute : generalRequestsPerMinute;

        // Check rate limit
        if (!isAllowed(clientIp, requestPath, limit)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.\",\"code\":429}");
            return;
        }

        // Periodic cleanup of expired buckets
        cleanupIfNeeded();

        filterChain.doFilter(request, response);
    }

    /**
     * Get client IP, considering proxy headers (Cloudflare, nginx)
     */
    private String getClientIp(HttpServletRequest request) {
        // Cloudflare's CF-Connecting-IP takes priority
        String cfIp = request.getHeader("CF-Connecting-IP");
        if (cfIp != null && !cfIp.isEmpty()) {
            return cfIp;
        }

        // Standard X-Forwarded-For header
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Take the first IP in the chain (original client)
            return xForwardedFor.split(",")[0].trim();
        }

        // X-Real-IP (nginx)
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        // Fallback to remote address
        return request.getRemoteAddr();
    }

    /**
     * Check if request path is a search endpoint
     */
    private boolean isSearchEndpoint(String path) {
        return path.contains("/api/v1/properties") && !path.matches(".*/\\d+.*");
    }

    /**
     * Check if request is allowed based on rate limit
     */
    private boolean isAllowed(String clientIp, String path, int limit) {
        String key = clientIp + ":" + (isSearchEndpoint(path) ? "search" : "general");
        long now = System.currentTimeMillis();

        RateLimitBucket bucket = ipBuckets.compute(key, (k, existing) -> {
            if (existing == null || existing.isExpired(now)) {
                return new RateLimitBucket(now, limit);
            }
            return existing;
        });

        return bucket.tryConsume();
    }

    /**
     * Cleanup expired buckets periodically
     */
    private void cleanupIfNeeded() {
        long now = System.currentTimeMillis();
        if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
            lastCleanup = now;
            ipBuckets.entrySet().removeIf(entry -> entry.getValue().isExpired(now));
        }
    }

    /**
     * Simple token bucket for rate limiting
     */
    private static class RateLimitBucket {
        private final long windowStart;
        private final AtomicInteger tokens;
        private final int maxTokens;

        RateLimitBucket(long windowStart, int maxTokens) {
            this.windowStart = windowStart;
            this.maxTokens = maxTokens;
            this.tokens = new AtomicInteger(maxTokens);
        }

        boolean tryConsume() {
            int remaining = tokens.decrementAndGet();
            return remaining >= 0;
        }

        boolean isExpired(long now) {
            return now - windowStart > BUCKET_EXPIRY_MS;
        }
    }
}
