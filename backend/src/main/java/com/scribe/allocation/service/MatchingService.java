package com.scribe.allocation.service;

import com.scribe.allocation.model.Request;
import com.scribe.allocation.model.Volunteer;
import com.scribe.allocation.repository.RequestRepository;
import com.scribe.allocation.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * MatchingService — Multi-Layered Heuristic Matching Engine
 *
 * Given a volunteer, returns a sorted list of PENDING requests
 * that are most relevant to them.
 *
 * Scoring:
 *   +50  same city + state (Layer 1 hard filter — others are excluded)
 *   +30  subject match (fuzzy)
 *   +20  language match
 * Max possible score: 100
 */
@Service
public class MatchingService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    // ── DTOs ────────────────────────────────────────────────────────────────

    public static class MatchedRequest {
        private Request request;
        private int matchScore;

        public MatchedRequest(Request request, int matchScore) {
            this.request = request;
            this.matchScore = matchScore;
        }

        public Request getRequest() { return request; }
        public int getMatchScore() { return matchScore; }
    }

    // ── Main method ─────────────────────────────────────────────────────────

    /**
     * Returns all PENDING requests visible to this volunteer,
     * sorted by matchScore descending.
     */
    public List<MatchedRequest> getMatchedRequestsForVolunteer(String volunteerId) {

        // Fetch volunteer
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found: " + volunteerId));

        // LAYER 1 — Hard filter: same city + state only
        List<Request> pendingRequests = requestRepository
                .findByCityIgnoreCaseAndStateIgnoreCaseAndStatus(
                        volunteer.getCity(),
                        volunteer.getState(),
                        "PENDING"
                );

        if (pendingRequests.isEmpty()) {
            return Collections.emptyList();
        }

        // LAYER 2 — Score each request
        List<MatchedRequest> scored = new ArrayList<>();
        for (Request request : pendingRequests) {
            int score = calculateMatchScore(volunteer, request);
            scored.add(new MatchedRequest(request, score));
        }

        // Sort descending by score
        scored.sort((a, b) -> b.getMatchScore() - a.getMatchScore());

        return scored;
    }

    // ── Scoring logic ────────────────────────────────────────────────────────

    private int calculateMatchScore(Volunteer volunteer, Request request) {
        int score = 50; // base: already passed location hard filter

        // +30 subject match (fuzzy — partial match counts)
        if (isSubjectMatch(volunteer.getSubjects(), request.getSubject())) {
            score += 30;
        }

        // +20 language match
        if (isLanguageMatch(volunteer.getLanguages(), request.getPreferredLanguage())) {
            score += 20;
        }

        return score;
    }

    /**
     * Fuzzy subject match:
     * Returns true if any of the volunteer's subjects partially match
     * the request's subject (case-insensitive).
     *
     * Examples:
     *   volunteer has "Mathematics" → matches request subject "Calculus" (common alias)
     *   volunteer has "Physics"     → matches request subject "Applied Physics"
     */
    private boolean isSubjectMatch(List<String> volunteerSubjects, String requestSubject) {
        if (volunteerSubjects == null || volunteerSubjects.isEmpty()) return false;
        if (requestSubject == null || requestSubject.isBlank()) return false;

        String reqLower = requestSubject.toLowerCase().trim();

        for (String subject : volunteerSubjects) {
            String subLower = subject.toLowerCase().trim();

            // Direct or partial match
            if (subLower.contains(reqLower) || reqLower.contains(subLower)) {
                return true;
            }

            // Known aliases
            if (isKnownAlias(subLower, reqLower)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Subject alias map — expand this as needed for your domain.
     */
    private boolean isKnownAlias(String volunteerSubject, String requestSubject) {
        Map<String, List<String>> aliases = new HashMap<>();
        aliases.put("mathematics", Arrays.asList("calculus", "algebra", "statistics",
                "maths", "math", "trigonometry", "linear algebra", "discrete mathematics"));
        aliases.put("physics", Arrays.asList("applied physics", "mechanics",
                "electromagnetism", "thermodynamics", "optics"));
        aliases.put("chemistry", Arrays.asList("organic chemistry", "inorganic chemistry",
                "physical chemistry", "biochemistry"));
        aliases.put("computer science", Arrays.asList("programming", "data structures",
                "algorithms", "software engineering", "dbms", "os", "networking",
                "artificial intelligence", "machine learning"));
        aliases.put("biology", Arrays.asList("botany", "zoology", "microbiology",
                "genetics", "ecology"));
        aliases.put("english", Arrays.asList("literature", "grammar", "writing",
                "communication skills"));

        List<String> aliasList = aliases.get(volunteerSubject);
        if (aliasList != null) {
            return aliasList.stream().anyMatch(alias ->
                    alias.equalsIgnoreCase(requestSubject) ||
                    requestSubject.contains(alias) ||
                    alias.contains(requestSubject));
        }
        return false;
    }

    /**
     * Language match: volunteer speaks the student's preferred language.
     */
    private boolean isLanguageMatch(List<String> volunteerLanguages, String preferredLanguage) {
        if (volunteerLanguages == null || volunteerLanguages.isEmpty()) return false;
        if (preferredLanguage == null || preferredLanguage.isBlank()) return false;

        return volunteerLanguages.stream()
                .anyMatch(lang -> lang.equalsIgnoreCase(preferredLanguage.trim()));
    }

    // ── Rating update helper (called after session completion) ───────────────

    /**
     * Updates the volunteer's average rating when a student submits a review.
     * Call this from VolunteerController when a rating is submitted.
     */
    public Volunteer updateVolunteerRating(String volunteerId, int newRating) {
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found: " + volunteerId));

        int totalRatings = volunteer.getTotalRatings();
        double currentAvg = volunteer.getRating();

        // Recalculate average
        double newAvg = ((currentAvg * totalRatings) + newRating) / (totalRatings + 1);

        volunteer.setRating(Math.round(newAvg * 10.0) / 10.0); // round to 1 decimal
        volunteer.setTotalRatings(totalRatings + 1);

        return volunteerRepository.save(volunteer);
    }
}