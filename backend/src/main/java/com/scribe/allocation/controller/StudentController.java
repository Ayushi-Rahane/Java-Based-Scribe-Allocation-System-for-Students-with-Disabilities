package com.scribe.allocation.controller;

import com.scribe.allocation.config.JwtUtil;
import com.scribe.allocation.model.Student;
import com.scribe.allocation.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ===== REGISTER =====
    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        Student saved = studentRepository.save(student);
        String token = jwtUtil.generateToken(saved.getEmail(), "STUDENT");
        return ResponseEntity.ok(Map.of(
            "token", token,
            "studentId", saved.getId(),
            "message", "Registration successful"
        ));
    }

    // ===== LOGIN =====
    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        Student student = studentOpt.get();
        if (!passwordEncoder.matches(password, student.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        String token = jwtUtil.generateToken(student.getEmail(), "STUDENT");
        return ResponseEntity.ok(Map.of(
            "token", token,
            "studentId", student.getId(),
            "message", "Login successful"
        ));
    }

    // ===== GET PROFILE =====
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable String id) {
        Optional<Student> student = studentRepository.findById(id);
        return student.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ===== UPDATE PROFILE =====
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable String id, @RequestBody Student updatedData) {
        return studentRepository.findById(id).map(student -> {
            if (updatedData.getFullName() != null) student.setFullName(updatedData.getFullName());
            if (updatedData.getPhone() != null) student.setPhone(updatedData.getPhone());
            if (updatedData.getDateOfBirth() != null) student.setDateOfBirth(updatedData.getDateOfBirth());
            if (updatedData.getUniversity() != null) student.setUniversity(updatedData.getUniversity());
            if (updatedData.getCourse() != null) student.setCourse(updatedData.getCourse());
            if (updatedData.getCity() != null) student.setCity(updatedData.getCity());
            if (updatedData.getState() != null) student.setState(updatedData.getState());
            if (updatedData.getDisabilityType() != null) student.setDisabilityType(updatedData.getDisabilityType());
            if (updatedData.getCertificateNumber() != null) student.setCertificateNumber(updatedData.getCertificateNumber());
            if (updatedData.getSpecificNeeds() != null) student.setSpecificNeeds(updatedData.getSpecificNeeds());
            if (updatedData.getCurrentYear() != null) student.setCurrentYear(updatedData.getCurrentYear());
            if (updatedData.getExamFrequency() != null) student.setExamFrequency(updatedData.getExamFrequency());
            if (updatedData.getPreferredSubjects() != null) student.setPreferredSubjects(updatedData.getPreferredSubjects());
            if (updatedData.getAcademicNotes() != null) student.setAcademicNotes(updatedData.getAcademicNotes());
            if (updatedData.getPreferredLanguage() != null) student.setPreferredLanguage(updatedData.getPreferredLanguage());
            if (updatedData.getNotificationMethod() != null) student.setNotificationMethod(updatedData.getNotificationMethod());
            if (updatedData.getPreferredTime() != null) student.setPreferredTime(updatedData.getPreferredTime());
            if (updatedData.getProfilePicture() != null) student.setProfilePicture(updatedData.getProfilePicture());

            Student saved = studentRepository.save(student);
            return ResponseEntity.ok(saved);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}