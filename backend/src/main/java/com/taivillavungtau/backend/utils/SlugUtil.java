package com.taivillavungtau.backend.utils;

/**
 * Utility class for generating URL-friendly slugs.
 * This is an alias for SlugUtils to maintain compatibility with
 * LocationServiceImpl and PropertyTypeServiceImpl.
 */
public class SlugUtil {
    public static String toSlug(String input) {
        return SlugUtils.toSlug(input);
    }
}
