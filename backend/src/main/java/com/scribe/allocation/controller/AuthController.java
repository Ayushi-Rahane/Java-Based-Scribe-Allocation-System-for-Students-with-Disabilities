package com.scribe.allocation.controller;

import com.scribe.allocation.model.Student;
import com.scribe.allocation.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
        try {
            // Check if email already exists
            if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "error", "Email already registered"));
            }

            // Save the student
            Student savedStudent = studentRepository.save(student);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "user", savedStudent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        try {
            Optional<Student> studentOpt = studentRepository.findByEmail(email);

            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                // Simple password check (Note: use BCrypt in production)
                if (student.getPassword().equals(password)) {
                    return ResponseEntity.ok(Map.of("success", true, "user", student));
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "error", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Login failed: " + e.getMessage()));
        }
    }
}
