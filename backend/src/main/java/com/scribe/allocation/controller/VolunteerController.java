package com.scribe.allocation.controller;

import com.scribe.allocation.model.Request;
import com.scribe.allocation.model.Volunteer;
import com.scribe.allocation.repository.RequestRepository;
import com.scribe.allocation.repository.VolunteerRepository;
import com.scribe.allocation.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**1
 * VolunteerController
 *
 * Base URL: /api/volunteers
 *
 * Endpoints:
 *   POST   /register                    — register a new volunteer
 *   POST   /login                       — login
 *   GET    /{id}/profile                — get profile
 *   PUT    /{id}/profile                — update profile (name, subjects, languages)
 *   PUT    /{id}/availability           — update availability schedule
 *   GET    /{id}/matched-requests       — get scored+sorted pending requests (dashboard feed)
 *   POST   /accept/{requestId}          — accept a request
 *   GET    /{id}/active                 — get active (accepted) assignments
 *   GET    /{id}/history                — get completed sessions
 *   GET    /{id}/certificate            — get certificate data (sessions + rating)
 *   POST   /rate/{requestId}            — student rates a volunteer (called from student module)
 */
@RestController
@RequestMapping("/api/volunteers")
public class VolunteerController {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private MatchingService matchingService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ────────────────────────────────────────────────────────────────────────
    // 0. GET ALL VOLUNTEERS
    // GET /api/volunteers
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getAllVolunteers() {
        List<Volunteer> all = volunteerRepository.findAll();
        all.forEach(v -> v.setPassword(null));
        return ResponseEntity.ok(all);
    }

    // ────────────────────────────────────────────────────────────────────────
    // 1. REGISTRATION
    // POST /api/volunteers/register
    // ────────────────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        try {
            String email = (String) body.get("email");

            // Check duplicate email
            if (volunteerRepository.existsByEmail(email)) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Email already registered"));
            }

            Volunteer volunteer = new Volunteer();
            volunteer.setFullName((String) body.get("fullName"));
            volunteer.setEmail(email);
            volunteer.setPassword(passwordEncoder.encode((String) body.get("password")));
            volunteer.setPhone((String) body.get("phone"));

            String dobStr = (String) body.get("dateOfBirth");
            if (dobStr != null && !dobStr.isBlank()) {
                volunteer.setDateOfBirth(LocalDate.parse(dobStr));
            }

            volunteer.setCity((String) body.get("city"));
            volunteer.setState((String) body.get("state"));

            // subjects and languages come as List<String> from JSON
            volunteer.setSubjects((List<String>) body.get("subjects"));
            volunteer.setLanguages((List<String>) body.get("languages"));

            // availability: Map<String, Map<String, Boolean>>
            volunteer.setAvailability(
                    (Map<String, Map<String, Boolean>>) body.get("availability"));

            Volunteer saved = volunteerRepository.save(volunteer);

            // Don't return password in response
            saved.setPassword(null);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    // 2. LOGIN
    // POST /api/volunteers/login
    // ────────────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String rawPassword = body.get("password");

            Optional<Volunteer> optVolunteer = volunteerRepository.findByEmail(email);

            if (optVolunteer.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid email or password"));
            }

            Volunteer volunteer = optVolunteer.get();

            if (!passwordEncoder.matches(rawPassword, volunteer.getPassword())) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid email or password"));
            }

            // In a full setup, generate and return a JWT here.
            // For now, returning volunteer data without password.
            volunteer.setPassword(null);

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "volunteer", volunteer,
                    "role", "VOLUNTEER"
            ));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    // 3. GET PROFILE
    // GET /api/volunteers/{id}/profile
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getProfile(@PathVariable String id) {
        return volunteerRepository.findById(id)
                .map(v -> {
                    v.setPassword(null); // never expose password
                    return ResponseEntity.ok((Object) v);
                })
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Volunteer not found")));
    }

    // ────────────────────────────────────────────────────────────────────────
    // 4. UPDATE PROFILE
    // PUT /api/volunteers/{id}/profile
    // Body: { fullName, phone, city, state, subjects, languages }
    // ────────────────────────────────────────────────────────────────────────
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {

        return volunteerRepository.findById(id)
                .map(volunteer -> {
                    if (body.containsKey("fullName"))
                        volunteer.setFullName((String) body.get("fullName"));
                    if (body.containsKey("phone"))
                        volunteer.setPhone((String) body.get("phone"));
                    if (body.containsKey("city"))
                        volunteer.setCity((String) body.get("city"));
                    if (body.containsKey("state"))
                        volunteer.setState((String) body.get("state"));
                    if (body.containsKey("subjects"))
                        volunteer.setSubjects((List<String>) body.get("subjects"));
                    if (body.containsKey("languages"))
                        volunteer.setLanguages((List<String>) body.get("languages"));
                    if (body.containsKey("dateOfBirth")) {
                        Object dob = body.get("dateOfBirth");
                        if (dob != null && !dob.toString().isBlank()) {
                            volunteer.setDateOfBirth(LocalDate.parse(dob.toString()));
                        }
                    }

                    Volunteer updated = volunteerRepository.save(volunteer);
                    updated.setPassword(null);
                    return ResponseEntity.ok((Object) updated);
                })
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Volunteer not found")));
    }

    // ────────────────────────────────────────────────────────────────────────
    // 5. UPDATE AVAILABILITY SCHEDULE
    // PUT /api/volunteers/{id}/availability
    // Body: { "Monday": { "morning": true, "afternoon": false, "evening": true }, ... }
    // ────────────────────────────────────────────────────────────────────────
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(
            @PathVariable String id,
            @RequestBody Map<String, Map<String, Boolean>> availabilityBody) {

        return volunteerRepository.findById(id)
                .map(volunteer -> {
                    volunteer.setAvailability(availabilityBody);
                    Volunteer updated = volunteerRepository.save(volunteer);
                    updated.setPassword(null);
                    return ResponseEntity.ok(Map.of(
                            "message", "Availability updated successfully",
                            "availability", updated.getAvailability()
                    ));
                })
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Volunteer not found")));
    }

    // ────────────────────────────────────────────────────────────────────────
    // 6. GET MATCHED REQUESTS (Dashboard Feed)
    // GET /api/volunteers/{id}/matched-requests
    // Returns PENDING requests sorted by match score (highest first)
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}/matched-requests")
    public ResponseEntity<?> getMatchedRequests(@PathVariable String id) {
        try {
            List<MatchingService.MatchedRequest> matches =
                    matchingService.getMatchedRequestsForVolunteer(id);

            // Build response list with score included
            List<Map<String, Object>> result = new ArrayList<>();
            for (MatchingService.MatchedRequest match : matches) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("request", match.getRequest());
                item.put("matchScore", match.getMatchScore());
                result.add(item);
            }

            return ResponseEntity.ok(Map.of(
                    "totalMatches", result.size(),
                    "requests", result
            ));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch matched requests: " + e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    // 7. ACCEPT A REQUEST
    // POST /api/volunteers/accept/{requestId}
    // Body: { "volunteerId": "..." }
    // ────────────────────────────────────────────────────────────────────────
    @PostMapping("/accept/{requestId}")
    public ResponseEntity<?> acceptRequest(
            @PathVariable String requestId,
            @RequestBody Map<String, String> body) {

        String volunteerId = body.get("volunteerId");

        // Validate volunteer exists
        if (!volunteerRepository.existsById(volunteerId)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Volunteer not found"));
        }

        Optional<Request> optRequest = requestRepository.findById(requestId);
        if (optRequest.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Request not found"));
        }

        Request request = optRequest.get();

        // Only accept PENDING requests
        if (!"PENDING".equals(request.getStatus())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Request is already " + request.getStatus()));
        }

        request.setVolunteerId(volunteerId);
        request.setStatus("ACCEPTED");
        request.setAcceptedAt(LocalDateTime.now());

        Request updated = requestRepository.save(request);

        return ResponseEntity.ok(Map.of(
                "message", "Request accepted successfully",
                "request", updated
        ));
    }

    // ────────────────────────────────────────────────────────────────────────
    // 8. GET ACTIVE ASSIGNMENTS
    // GET /api/volunteers/{id}/active
    // Returns all requests with status ACCEPTED for this volunteer
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}/active")
    public ResponseEntity<?> getActiveAssignments(@PathVariable String id) {
        if (!volunteerRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Volunteer not found"));
        }

        List<Request> activeRequests =
                requestRepository.findByVolunteerIdAndStatus(id, "ACCEPTED");

        return ResponseEntity.ok(Map.of(
                "total", activeRequests.size(),
                "activeAssignments", activeRequests
        ));
    }

    // ────────────────────────────────────────────────────────────────────────
    // 9. GET HISTORY
    // GET /api/volunteers/{id}/history
    // Returns all COMPLETED requests for this volunteer
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}/history")
    public ResponseEntity<?> getHistory(@PathVariable String id) {
        if (!volunteerRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Volunteer not found"));
        }

        List<Request> history =
                requestRepository.findByVolunteerIdAndStatusOrderByCompletedAtDesc(
                        id, "COMPLETED");

        return ResponseEntity.ok(Map.of(
                "totalCompleted", history.size(),
                "history", history
        ));
    }

    // ────────────────────────────────────────────────────────────────────────
    // 10. GET CERTIFICATE DATA
    // GET /api/volunteers/{id}/certificate
    // Returns volunteer name, total sessions, average rating — for certificate display
    // ────────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}/certificate")
    public ResponseEntity<?> getCertificate(@PathVariable String id) {
        return volunteerRepository.findById(id)
                .map(volunteer -> {
                    int completedSessions = requestRepository
                            .findByVolunteerIdAndStatus(id, "COMPLETED").size();

                    Map<String, Object> certData = new LinkedHashMap<>();
                    certData.put("volunteerName", volunteer.getFullName());
                    certData.put("volunteerId", volunteer.getId());
                    certData.put("totalSessionsCompleted", completedSessions);
                    certData.put("averageRating", volunteer.getRating());
                    certData.put("totalRatings", volunteer.getTotalRatings());
                    certData.put("subjects", volunteer.getSubjects());
                    certData.put("generatedAt", LocalDateTime.now().toString());

                    return ResponseEntity.ok((Object) certData);
                })
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Volunteer not found")));
    }

    // ────────────────────────────────────────────────────────────────────────
    // 11. RATE A VOLUNTEER (called when student submits review)
    // POST /api/volunteers/rate/{requestId}
    // Body: { "rating": 4, "review": "Very helpful!" }
    // ────────────────────────────────────────────────────────────────────────
    @PostMapping("/rate/{requestId}")
    public ResponseEntity<?> rateVolunteer(
            @PathVariable String requestId,
            @RequestBody Map<String, Object> body) {

        Optional<Request> optRequest = requestRepository.findById(requestId);
        if (optRequest.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Request not found"));
        }

        Request request = optRequest.get();

        if (!"COMPLETED".equals(request.getStatus())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Can only rate completed sessions"));
        }

        if (request.getRating() != null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "This session has already been rated"));
        }

        int rating = ((Number) body.get("rating")).intValue();
        if (rating < 1 || rating > 5) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Rating must be between 1 and 5"));
        }

        // Save rating on request
        request.setRating(rating);
        request.setReview((String) body.get("review"));
        requestRepository.save(request);

        // Update volunteer's average rating
        Volunteer updatedVolunteer =
                matchingService.updateVolunteerRating(request.getVolunteerId(), rating);

        return ResponseEntity.ok(Map.of(
                "message", "Rating submitted successfully",
                "newAverageRating", updatedVolunteer.getRating()
        ));
    }

    // ────────────────────────────────────────────────────────────────────────
    // 12. MARK REQUEST AS COMPLETED
    // PUT /api/volunteers/complete/{requestId}
    // Body: { "volunteerId": "..." }
    // ────────────────────────────────────────────────────────────────────────
    @PutMapping("/complete/{requestId}")
    public ResponseEntity<?> markComplete(
            @PathVariable String requestId,
            @RequestBody Map<String, String> body) {

        String volunteerId = body.get("volunteerId");

        Optional<Request> optRequest = requestRepository.findById(requestId);
        if (optRequest.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Request not found"));
        }

        Request request = optRequest.get();

        if (!volunteerId.equals(request.getVolunteerId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not assigned to this request"));
        }

        if (!"ACCEPTED".equals(request.getStatus())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Request is not in ACCEPTED state"));
        }

        request.setStatus("COMPLETED");
        request.setCompletedAt(LocalDateTime.now());

        // Increment sessions count on volunteer
        volunteerRepository.findById(volunteerId).ifPresent(volunteer -> {
            volunteer.setTotalSessionsCompleted(
                    volunteer.getTotalSessionsCompleted() + 1);
            volunteerRepository.save(volunteer);
        });

        requestRepository.save(request);

        return ResponseEntity.ok(Map.of(
                "message", "Session marked as completed",
                "requestId", requestId
        ));
    }

    // ────────────────────────────────────────────────────────────────────────
    // 13. RECALCULATE VOLUNTEER RATING
    // POST /api/volunteers/{id}/recalculate-rating
    // Scans all COMPLETED requests with ratings and recomputes the average
    // ────────────────────────────────────────────────────────────────────────
    @PostMapping("/{id}/recalculate-rating")
    public ResponseEntity<?> recalculateRating(@PathVariable String id) {
        Optional<Volunteer> optVolunteer = volunteerRepository.findById(id);
        if (optVolunteer.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Volunteer not found"));
        }

        Volunteer volunteer = optVolunteer.get();

        // Get all completed requests for this volunteer
        List<Request> completed = requestRepository
                .findByVolunteerIdAndStatus(id, "COMPLETED");

        // Filter to those with ratings
        List<Request> rated = completed.stream()
                .filter(r -> r.getRating() != null && r.getRating() > 0)
                .toList();

        if (rated.isEmpty()) {
            volunteer.setRating(0.0);
            volunteer.setTotalRatings(0);
        } else {
            double sum = rated.stream().mapToInt(Request::getRating).sum();
            double avg = sum / rated.size();
            volunteer.setRating(Math.round(avg * 10.0) / 10.0);
            volunteer.setTotalRatings(rated.size());
        }

        volunteer.setTotalSessionsCompleted(completed.size());
        volunteerRepository.save(volunteer);

        return ResponseEntity.ok(Map.of(
                "message", "Rating recalculated successfully",
                "averageRating", volunteer.getRating(),
                "totalRatings", volunteer.getTotalRatings(),
                "totalSessionsCompleted", volunteer.getTotalSessionsCompleted()
        ));
    }
}