package com.taivillavungtau.backend.service.impl;

import com.taivillavungtau.backend.entity.RefreshToken;
import com.taivillavungtau.backend.repository.RefreshTokenRepository;
import com.taivillavungtau.backend.util.TestDataBuilder;
import net.jqwik.api.*;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

/**
 * Property-based tests for RefreshTokenServiceImpl using jqwik
 */
class RefreshTokenServiceImplPropertyTest {

    private RefreshTokenRepository refreshTokenRepository;
    private RefreshTokenServiceImpl refreshTokenService;

    private void setUp() {
        refreshTokenRepository = Mockito.mock(RefreshTokenRepository.class);
        refreshTokenService = new RefreshTokenServiceImpl(refreshTokenRepository);
        ReflectionTestUtils.setField(refreshTokenService, "refreshTokenDurationMs", 86400000L);
    }

    @Provide
    Arbitrary<Integer> numberOfThreads() {
        return Arbitraries.integers().between(2, 10);
    }

    @Provide
    Arbitrary<Integer> numberOfThreadsForDelete() {
        return Arbitraries.integers().between(2, 5);
    }

    /**
     * Feature: backend-testing-improvement, Property 8: Thread Safety of Token Operations
     * Validates: Requirements 7.5
     * 
     * For any sequence of concurrent refresh token operations (create, verify, delete) on different tokens,
     * the system should maintain consistency without race conditions or data corruption.
     */
    @Property(tries = 100)
    @Label("Should maintain thread safety for concurrent token operations")
    void shouldMaintainThreadSafety_forConcurrentTokenOperations(
            @ForAll("numberOfThreads") int numThreads) throws InterruptedException {
        
        // Given
        setUp();
        ExecutorService executorService = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        AtomicInteger successfulOperations = new AtomicInteger(0);

        // Mock repository to simulate concurrent operations
        when(refreshTokenRepository.findByUserId(any()))
                .thenReturn(Collections.emptyList());
        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(invocation -> {
                    // Simulate some processing time
                    Thread.sleep(5);
                    return invocation.getArgument(0);
                });

        // When - Execute concurrent token creation operations
        for (int i = 0; i < numThreads; i++) {
            final Long userId = (long) (i + 1);
            executorService.submit(() -> {
                try {
                    RefreshToken token = refreshTokenService.createRefreshToken(userId);
                    if (token != null && token.getUserId().equals(userId)) {
                        successfulOperations.incrementAndGet();
                    }
                } catch (Exception e) {
                    // Expected in concurrent scenarios
                } finally {
                    latch.countDown();
                }
            });
        }

        // Wait for all threads to complete
        boolean completed = latch.await(10, TimeUnit.SECONDS);
        executorService.shutdown();

        // Then - Verify all operations completed
        assertThat(completed).isTrue();
        assertThat(successfulOperations.get()).isEqualTo(numThreads);
    }

    /**
     * Feature: backend-testing-improvement, Property 8: Thread Safety of Token Operations
     * Validates: Requirements 7.5
     * 
     * For any sequence of concurrent delete operations, the system should handle them without errors.
     */
    @Property(tries = 50)
    @Label("Should handle concurrent delete operations without errors")
    void shouldHandleConcurrentDeleteOperations_withoutErrors(
            @ForAll("numberOfThreadsForDelete") int numThreads) throws InterruptedException {
        
        // Given
        setUp();
        ExecutorService executorService = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        AtomicInteger completedOperations = new AtomicInteger(0);

        RefreshToken testToken = TestDataBuilder.validRefreshToken()
                .userId(1L)
                .build();

        when(refreshTokenRepository.findByUserId(any()))
                .thenReturn(List.of(testToken));
        doNothing().when(refreshTokenRepository).deleteAll(anyList());

        // When - Execute concurrent delete operations
        for (int i = 0; i < numThreads; i++) {
            final Long userId = (long) (i + 1);
            executorService.submit(() -> {
                try {
                    refreshTokenService.deleteByUserId(userId);
                    completedOperations.incrementAndGet();
                } catch (Exception e) {
                    // Should not throw exceptions
                } finally {
                    latch.countDown();
                }
            });
        }

        // Wait for all threads to complete
        boolean completed = latch.await(10, TimeUnit.SECONDS);
        executorService.shutdown();

        // Then - All operations should complete without errors
        assertThat(completed).isTrue();
        assertThat(completedOperations.get()).isEqualTo(numThreads);
    }
}
