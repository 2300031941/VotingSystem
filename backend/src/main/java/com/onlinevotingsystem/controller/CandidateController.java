package com.onlinevotingsystem.controller;

import com.onlinevotingsystem.entity.Candidate;
import com.onlinevotingsystem.service.CandidateService;
import com.onlinevotingsystem.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private VoteService voteService;

    @GetMapping("/candidates")
    public ResponseEntity<List<Candidate>> getCandidates() {
        List<Candidate> candidates = candidateService.getAllCandidates();
        System.out.println("Returning candidates: " + candidates.size());
        return ResponseEntity.ok(candidates);
    }

    @PostMapping("/candidates")
    public ResponseEntity<?> addCandidate(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "partyName", required = false) String partyName,
            @RequestParam(value = "age", required = false) String ageStr,
            @RequestParam(value = "symbol", required = false) MultipartFile symbol) {
        System.out.println("Add candidate called with name: " + name + ", party: " + partyName + ", age: " + ageStr + ", symbol: " + (symbol != null ? symbol.getOriginalFilename() : "null"));
        try {
            // Validate inputs
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Candidate name is required");
            }
            if (partyName == null || partyName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Party name is required");
            }
            if (symbol == null || symbol.isEmpty()) {
                return ResponseEntity.badRequest().body("Symbol image is required");
            }
            int age;
            try {
                age = Integer.parseInt(ageStr);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Age must be a valid number");
            }
            if (age < 18) {
                return ResponseEntity.badRequest().body("Age must be at least 18");
            }

            // Save the image file
            String fileName = System.currentTimeMillis() + "_" + symbol.getOriginalFilename();
            Path filePath = Paths.get("uploads", fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, symbol.getBytes());
            System.out.println("File saved to: " + filePath.toAbsolutePath());

            Candidate candidate = new Candidate(name.trim(), partyName.trim(), age, "/uploads/" + fileName);
            Candidate savedCandidate = candidateService.addCandidate(candidate);
            System.out.println("Candidate saved: " + savedCandidate);
            return ResponseEntity.ok(savedCandidate);
        } catch (IOException e) {
            System.out.println("IOException: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to save image: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to add candidate: " + e.getMessage());
        }
    }

    @PostMapping("/vote")
    public ResponseEntity<?> vote(@RequestBody Map<String, Object> voteData) {
        Long candidateId = Long.valueOf(voteData.get("candidateId").toString());
        String aadhaarNumber = (String) voteData.get("aadhaarNumber");
        try {
            voteService.castVote(aadhaarNumber, candidateId);
            return ResponseEntity.ok("Vote recorded successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/results")
    public ResponseEntity<List<Map<String, Object>>> getResults() {
        List<Map<String, Object>> results = voteService.getVoteResults();
        return ResponseEntity.ok(results);
    }

    @DeleteMapping("/candidates/{id}")
    public ResponseEntity<?> removeCandidate(@PathVariable Long id) {
        try {
            candidateService.deleteCandidate(id);
            return ResponseEntity.ok("Candidate removed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to remove candidate: " + e.getMessage());
        }
    }

    @DeleteMapping("/candidates")
    public ResponseEntity<?> clearAllCandidates() {
        try {
            candidateService.deleteAllCandidates();
            return ResponseEntity.ok("All candidates removed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to clear candidates: " + e.getMessage());
        }
    }

    @GetMapping("/vote-status")
    public ResponseEntity<Map<String, Boolean>> checkVoteStatus(@RequestParam String aadhaarNumber) {
        boolean hasVoted = voteService.hasUserVoted(aadhaarNumber);
        Map<String, Boolean> response = new HashMap<>();
        response.put("hasVoted", hasVoted);
        return ResponseEntity.ok(response);
    }
}