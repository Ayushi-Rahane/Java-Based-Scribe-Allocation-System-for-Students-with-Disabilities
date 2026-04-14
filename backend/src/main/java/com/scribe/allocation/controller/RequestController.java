package com.scribe.allocation.controller;

import com.scribe.allocation.model.Request;
import com.scribe.allocation.repository.RequestRepository;
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

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Request request) {
        request.setCreatedAt(LocalDateTime.now());
        if (request.getStatus() == null || request.getStatus().isEmpty()) {
            request.setStatus("PENDING");
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
            request.setStatus(update.getStatus());
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
