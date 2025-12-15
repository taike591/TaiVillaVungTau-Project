package com.taivillavungtau.backend.config;

import com.taivillavungtau.backend.entity.Location;
import com.taivillavungtau.backend.entity.PropertyType;
import com.taivillavungtau.backend.repository.LocationRepository;
import com.taivillavungtau.backend.repository.PropertyTypeRepository;
import com.taivillavungtau.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

        private final LocationRepository locationRepository;
        private final PropertyTypeRepository propertyTypeRepository;
        private final UserRepository userRepository;
        private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                seedLocations();
                seedPropertyTypes();
                seedUsers();
        }

        private void seedLocations() {
                if (locationRepository.count() > 0) {
                        log.info("Locations already seeded, skipping.");
                        return;
                }

                log.info("Seeding locations...");
                List<Location> locations = Arrays.asList(
                                Location.builder()
                                                .name("Bãi Sau")
                                                .slug("bai-sau")
                                                .description(
                                                                "Khu vực bãi biển Thùy Vân sôi động, tập trung nhiều khách sạn và dịch vụ du lịch.")
                                                .build(),
                                Location.builder()
                                                .name("Bãi Trước")
                                                .slug("bai-truoc")
                                                .description("Trung tâm thành phố Vũng Tàu, gần công viên Bãi Trước và Bạch Dinh.")
                                                .build(),
                                Location.builder()
                                                .name("Long Cung")
                                                .slug("long-cung")
                                                .description("Khu vực nghỉ dưỡng yên tĩnh, bãi cát rộng và sạch.")
                                                .build(),
                                Location.builder()
                                                .name("Bãi Dâu")
                                                .slug("bai-dau")
                                                .description("Khu vực yên bình, thích hợp nghỉ dưỡng, gần Đức Mẹ Bãi Dâu.")
                                                .build(),
                                Location.builder()
                                                .name("Trung Tâm")
                                                .slug("trung-tam")
                                                .description("Khu vực trung tâm, thuận tiện di chuyển đến các điểm ăn uống và vui chơi.")
                                                .build(),
                                Location.builder()
                                                .name("Chí Linh")
                                                .slug("chi-linh")
                                                .description("Khu du lịch Chí Linh, không gian thoáng đãng, gần gũi thiên nhiên.")
                                                .build());

                locationRepository.saveAll(locations);
                log.info("Seeding locations completed.");
        }

        private void seedPropertyTypes() {
                if (propertyTypeRepository.count() > 0) {
                        log.info("Property types already seeded, skipping.");
                        return;
                }

                log.info("Seeding property types...");
                List<PropertyType> propertyTypes = Arrays.asList(
                                PropertyType.builder()
                                                .name("Villa")
                                                .slug("villa")
                                                .iconCode("home")
                                                .build(),
                                PropertyType.builder()
                                                .name("Căn hộ")
                                                .slug("can-ho")
                                                .iconCode("building")
                                                .build(),
                                PropertyType.builder()
                                                .name("Nhà phố")
                                                .slug("nha-pho")
                                                .iconCode("home-modern")
                                                .build());

                propertyTypeRepository.saveAll(propertyTypes);
                log.info("Seeding property types completed.");
        }

        private void seedUsers() {
                if (userRepository.count() > 0) {
                        log.info("Users already seeded, skipping.");
                        return;
                }

                log.info("Seeding users...");
                com.taivillavungtau.backend.entity.User admin = com.taivillavungtau.backend.entity.User.builder()
                                .username("admin")
                                .password(passwordEncoder.encode("admin"))
                                .fullName("Administrator")
                                .role("ADMIN")
                                .email("admin@taivilla.com")
                                .phoneNumber("0999999999")
                                .active(true)
                                .build();

                userRepository.save(admin);
                log.info("Seeding users completed.");
        }
}
