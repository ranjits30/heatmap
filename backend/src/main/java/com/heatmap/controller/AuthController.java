package com.heatmap.controller;

import com.heatmap.dto.AuthRequest;
import com.heatmap.dto.AuthResponse;
import com.heatmap.entity.Role;
import com.heatmap.entity.User;
import com.heatmap.repository.RoleRepository;
import com.heatmap.repository.UserRepository;
import com.heatmap.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));

        String token = jwtService.generateToken(user.getUsername(), claims);
        return new AuthResponse(token);
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        User user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()), request.getUsername() + "@example.com");
        Role defaultRole = roleRepository.findByName("ROLE_EMPLOYEE").orElseGet(() -> roleRepository.save(new Role("ROLE_EMPLOYEE")));
        user.setRoles(new HashSet<>());
        user.getRoles().add(defaultRole);
        userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));

        String token = jwtService.generateToken(user.getUsername(), claims);
        return new AuthResponse(token);
    }
}
