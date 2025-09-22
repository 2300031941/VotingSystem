package com.onlinevotingsystem.service;

import com.onlinevotingsystem.entity.User;
import com.onlinevotingsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Transactional
    public User signup(User user) {
        logger.info("Attempting to save user with Aadhaar: {}", user.getAadhaarNumber());
        // Check if Aadhaar already exists
        if (userRepository.findByAadhaarNumber(user.getAadhaarNumber()).isPresent()) {
            logger.warn("Aadhaar number already exists: {}", user.getAadhaarNumber());
            throw new RuntimeException("Aadhaar number already exists");
        }
        // Hash password
        user.setPassword(encoder.encode(user.getPassword()));
        logger.info("Password hashed, saving user...");
        User savedUser = userRepository.save(user);
        logger.info("User saved successfully with id: {}", savedUser.getId());
        return savedUser;
    }

    public Optional<User> login(String aadhaarNumber, String password) {
        // Special handling for admin login
        if ("123456789012".equals(aadhaarNumber) && "admin123".equals(password)) {
            User admin = new User();
            admin.setAadhaarNumber(aadhaarNumber);
            admin.setFullName("Admin");
            admin.setPassword("admin123"); // Not hashed for admin
            admin.setRole("admin");
            return Optional.of(admin);
        }
        // Regular user login
        Optional<User> user = userRepository.findByAadhaarNumber(aadhaarNumber);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }
}