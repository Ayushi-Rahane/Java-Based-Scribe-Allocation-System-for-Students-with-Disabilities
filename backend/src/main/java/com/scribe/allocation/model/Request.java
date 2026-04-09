package com.scribe.allocation.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "requests")
public class Request {
    @Id
    private String id;
    private String studentId;
    
    // Exam Details
    private String subject;
    private String examType;
    private String examDate; 
    private String examTime; 
    private Integer duration; 
    private String language;
    private String location;
    private String requirements;
    private java.util.List<String> materials; // Will store file URLs/Identifiers
    
    // Lifecycle Status
    // e.g. PENDING, MATCHED, COMPLETED, CANCELLED
    private String status;
    
    // Matched Volunteer
    private String volunteerId;
    
    // Post-Completion Review
    private Integer rating;
    private String review;
    
    private LocalDateTime createdAt;
}
