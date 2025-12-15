package com.taivillavungtau.backend.service.impl;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.taivillavungtau.backend.entity.User;
import com.taivillavungtau.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // SỬA ĐOẠN NÀY:
        // Thay vì dùng .roles(user.getRole()) -> Dùng .authorities(...)
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(
                        user.getRole().startsWith("ROLE_") ? user.getRole() : "ROLE_" + user.getRole()))) // Truyền
                                                                                                          // nguyên
                                                                                                          // chuỗi
                                                                                                          // ROLE_ADMIN
                                                                                                          // vào đây
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }

}
