package com.scribe.allocation.repository;

import com.scribe.allocation.model.Volunteer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends MongoRepository<Volunteer, String> {

    // Used by AuthController for login
    Optional<Volunteer> findByEmail(String email);

    // Used by MatchingService Layer 1 — hard location filter
    List<Volunteer> findByCityIgnoreCaseAndStateIgnoreCase(String city, String state);

    // Used by MatchingService — filter by city only (broader fallback if needed)
    List<Volunteer> findByCityIgnoreCase(String city);

    // Check if email already exists during registration
    boolean existsByEmail(String email);

    // Find volunteers who have a specific subject (case-insensitive contains)
    @Query("{ 'subjects': { $regex: ?0, $options: 'i' } }")
    List<Volunteer> findBySubjectContaining(String subject);

    // Find volunteers by language
    @Query("{ 'languages': { $regex: ?0, $options: 'i' } }")
    List<Volunteer> findByLanguageContaining(String language);
}