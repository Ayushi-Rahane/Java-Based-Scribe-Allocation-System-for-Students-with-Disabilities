package com.scribe.allocation.controller;

import com.scribe.allocation.model.Request;
import com.scribe.allocation.model.Student;
import com.scribe.allocation.model.Volunteer;
import com.scribe.allocation.repository.RequestRepository;
import com.scribe.allocation.repository.StudentRepository;
import com.scribe.allocation.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")

public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Request request) {
        request.setCreatedAt(LocalDateTime.now());
        if (request.getStatus() == null || request.getStatus().isEmpty()) {
            request.setStatus("PENDING");
        }

        if (request.getStudentId() != null) {
            Optional<Student> studentOpt = studentRepository.findById(request.getStudentId());
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                request.setStudentName(student.getFullName());
                request.setDisabilityType(student.getDisabilityType());
                if (request.getCity() == null || request.getCity().isEmpty()) {
                    request.setCity(student.getCity());
                }
                if (request.getState() == null || request.getState().isEmpty()) {
                    request.setState(student.getState());
                }
            }
        }

        Request savedRequest = requestRepository.save(request);
        return ResponseEntity.ok(savedRequest);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Request>> getStudentRequests(@PathVariable String studentId) {
        List<Request> requests = requestRepository.findByStudentId(studentId);
        return ResponseEntity.ok(requests);
    }
    
    @PutMapping("/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable String requestId, @RequestBody Request update) {
        Optional<Request> existingOpt = requestRepository.findById(requestId);
        if (existingOpt.isPresent()) {
            Request request = existingOpt.get();
            String oldStatus = request.getStatus();
            request.setStatus(update.getStatus());
            
            if ("COMPLETED".equalsIgnoreCase(update.getStatus()) && !"COMPLETED".equalsIgnoreCase(oldStatus)) {
                request.setCompletedAt(LocalDateTime.now());
                
                // Increment sessions count on volunteer
                if (request.getVolunteerId() != null) {
                    volunteerRepository.findById(request.getVolunteerId()).ifPresent(volunteer -> {
                        volunteer.setTotalSessionsCompleted(volunteer.getTotalSessionsCompleted() + 1);
                        volunteerRepository.save(volunteer);
                    });
                }
            }
            
            if (update.getRating() != null) request.setRating(update.getRating());
            if (update.getReview() != null) request.setReview(update.getReview());
            return ResponseEntity.ok(requestRepository.save(request));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{requestId}")
    public ResponseEntity<?> cancelRequest(@PathVariable String requestId) {
        Optional<Request> existingOpt = requestRepository.findById(requestId);
        if (existingOpt.isPresent()){
            Request request = existingOpt.get();
            request.setStatus("CANCELLED");
            return ResponseEntity.ok(requestRepository.save(request));
         }
         return ResponseEntity.notFound().build();
    }
}
