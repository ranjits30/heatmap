package com.heatmap.config;

import com.heatmap.entity.Role;
import com.heatmap.entity.User;
import com.heatmap.repository.RoleRepository;
import com.heatmap.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class AdminUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserSeeder(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

        userRepository.findByUsername("admin").orElseGet(() -> {
            User admin = new User("admin", passwordEncoder.encode("HeatMap@123"), "admin@heatmap.local");
            admin.setRoles(new HashSet<>());
            admin.getRoles().add(adminRole);
            return userRepository.save(admin);
        });
    }
}