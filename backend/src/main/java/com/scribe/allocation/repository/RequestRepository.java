package com.scribe.allocation.repository;

import com.scribe.allocation.model.Request;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends MongoRepository<Request, String> {

    // Used in controller
    List<Request> findByVolunteerIdAndStatus(String volunteerId, String status);

    // ✅ FIX 1
    List<Request> findByVolunteerIdAndStatusOrderByCompletedAtDesc(String volunteerId, String status);

    // ✅ FIX 2
    List<Request> findByCityIgnoreCaseAndStateIgnoreCaseAndStatus(String city, String state, String status);

    // Optional but useful
    List<Request> findByStudentId(String studentId);
}