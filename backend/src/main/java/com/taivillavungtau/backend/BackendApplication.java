package com.taivillavungtau.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            System.out.println("--------------------------------------");
            System.out.println("MÃ HASH CỦA 123456 LÀ:");
            System.out.println(new BCryptPasswordEncoder().encode("123456"));
            System.out.println("--------------------------------------");
        };
    }

}
