package com.onlinevotingsystem.controller;

import com.onlinevotingsystem.entity.User;
import com.onlinevotingsystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Enable CORS for React frontend
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User savedUser = userService.signup(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String aadhaarNumber = credentials.get("aadhaarNumber");
            String password = credentials.get("password");
            System.out.println("Login attempt for Aadhaar: " + aadhaarNumber);
            Optional<User> user = userService.login(aadhaarNumber, password);
            if (user.isPresent()) {
                System.out.println("Login successful for Aadhaar: " + aadhaarNumber);
                return ResponseEntity.ok(user.get());
            } else {
                System.out.println("Login failed: Invalid credentials for Aadhaar: " + aadhaarNumber);
                return ResponseEntity.status(401).body("Invalid credentials");
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            if ("123456789012".equals(username) && "admin123".equals(password)) {
                Map<String, String> response = new HashMap<>();
                response.put("token", "admin_token_123");
                response.put("message", "Admin login successful");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("Invalid admin credentials");
            }
        } catch (Exception e) {
            System.err.println("Admin login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

}