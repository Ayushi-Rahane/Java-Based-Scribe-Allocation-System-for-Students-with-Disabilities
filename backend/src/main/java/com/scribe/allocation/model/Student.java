package com.scribe.allocation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "students")
public class Student {
    @Id
    private String id;
    
    // Personal & Account information
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String dateOfBirth;
    private String university;
    private String course;
    private String city;
    private String state;
    private String profilePicture;
    
    // Disability information
    private String disabilityType;
    private String certificateNumber;
    private String specificNeeds;
    
    // Academic Requirements
    private String currentYear;
    private String examFrequency;
    private List<String> preferredSubjects;
    private String academicNotes;
    
    // Communication Preferences
    private String preferredLanguage;
    private String notificationMethod;
    private String preferredTime;
    
    // Role
    private String role = "student";
}
