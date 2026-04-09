package com.scribe.allocation.controller;

import com.scribe.allocation.model.Student;
import com.scribe.allocation.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable String id) {
        Optional<Student> student = studentRepository.findById(id);
        return student.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

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
