package com.scribe.allocation.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Document(collection = "volunteers")
public class Volunteer {

    @Id
    private String id;

    // Personal & Account Information
    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String password; // stored as bcrypt hash

    private String phone;
    private LocalDate dateOfBirth;

    // Location Information
    private String city;
    private String state;

    // Skills & Expertise
    private List<String> subjects;   // e.g. ["Mathematics", "Physics", "Chemistry"]
    private List<String> languages;  // e.g. ["English", "Hindi", "Marathi"]

    // Availability Schedule
    // Key: "Monday", "Tuesday", etc.
    // Value: Map of slot -> boolean e.g. {"morning": true, "afternoon": false, "evening": true}
    private Map<String, Map<String, Boolean>> availability;

    // Stats & Rating
    private double rating;           // average rating given by students
    private int totalRatings;        // number of ratings received
    private int totalSessionsCompleted;

    // Role field (for JWT / AuthController)
    private String role = "VOLUNTEER";

    // Constructors
    public Volunteer() {}

    public Volunteer(String fullName, String email, String password, String phone,
                     LocalDate dateOfBirth, String city, String state,
                     List<String> subjects, List<String> languages,
                     Map<String, Map<String, Boolean>> availability) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.city = city;
        this.state = state;
        this.subjects = subjects;
        this.languages = languages;
        this.availability = availability;
        this.rating = 0.0;
        this.totalRatings = 0;
        this.totalSessionsCompleted = 0;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public List<String> getSubjects() { return subjects; }
    public void setSubjects(List<String> subjects) { this.subjects = subjects; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public Map<String, Map<String, Boolean>> getAvailability() { return availability; }
    public void setAvailability(Map<String, Map<String, Boolean>> availability) {
        this.availability = availability;
    }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getTotalRatings() { return totalRatings; }
    public void setTotalRatings(int totalRatings) { this.totalRatings = totalRatings; }

    public int getTotalSessionsCompleted() { return totalSessionsCompleted; }
    public void setTotalSessionsCompleted(int totalSessionsCompleted) {
        this.totalSessionsCompleted = totalSessionsCompleted;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}