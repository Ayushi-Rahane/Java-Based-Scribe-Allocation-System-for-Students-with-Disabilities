package com.scribe.allocation.repository;

import com.scribe.allocation.model.Request;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RequestRepository extends MongoRepository<Request, String> {
    List<Request> findByStudentId(String studentId);
}
