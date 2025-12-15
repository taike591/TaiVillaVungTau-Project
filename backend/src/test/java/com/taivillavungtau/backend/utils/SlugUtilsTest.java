package com.taivillavungtau.backend.utils;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SlugUtilsTest {

    @Test
    void toSlug_ShouldConvertNormalString() {
        String input = "Hello World";
        String expected = "hello-world";
        assertThat(SlugUtils.toSlug(input)).isEqualTo(expected);
    }

    @Test
    void toSlug_ShouldHandleVietnameseCharacters() {
        String input = "Biệt Thự Biển Vũng Tàu";
        String expected = "biet-thu-bien-vung-tau";
        assertThat(SlugUtils.toSlug(input)).isEqualTo(expected);
    }

    @Test
    void toSlug_ShouldHandleSpecialCharacters() {
        String input = "Villa @ Vung Tau #1";
        // The regex [^\\w-] removes @ and #. 
        // "Villa @ Vung Tau #1" -> "Villa - Vung Tau 1" (whitespace to -)
        // Normalized -> "Villa - Vung Tau 1"
        // NonLatin remove -> "Villa--Vung-Tau-1"
        // Lowercase -> "villa--vung-tau-1"
        // Let's verify the implementation behavior.
        // WHITESPACE replaces with "-" -> "Villa-@-Vung-Tau-#1"
        // NONLATIN [^\\w-] removes @ and # -> "Villa--Vung-Tau-1"
        
        String result = SlugUtils.toSlug(input);
        assertThat(result).contains("villa");
        assertThat(result).contains("vung-tau");
        assertThat(result).doesNotContain("@");
        assertThat(result).doesNotContain("#");
    }

    @Test
    void toSlug_ShouldThrowException_WhenInputIsNull() {
        assertThatThrownBy(() -> SlugUtils.toSlug(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Input cannot be null");
    }
}
