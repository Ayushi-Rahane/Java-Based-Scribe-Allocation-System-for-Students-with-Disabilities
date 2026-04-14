package com.scribe.allocation.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "requests")
public class Request {

    @Id
    private String id;

    private String studentId;
    private String studentName;
    private String disabilityType;

    // Exam Details
    private String subject;
    private String examType;
    private String examDate;
    private String examTime;
    private Integer duration;

    private String preferredLanguage; // ✅ FIXED (was "language")
    private String city;              // ✅ REQUIRED for matching
    private String state;             // ✅ REQUIRED for matching
    private String location;
    private String requirements;

    private List<String> materials;

    // Status
    private String status; // PENDING, MATCHED, COMPLETED

    // Volunteer
    private String volunteerId;

    // Review
    private Integer rating;
    private String review;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime acceptedAt;   // ✅ ADD THIS
    private LocalDateTime completedAt;  // ✅ ADD THIS
}