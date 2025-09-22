package com.onlinevotingsystem.service;

import com.onlinevotingsystem.entity.Vote;
import com.onlinevotingsystem.entity.User;
import com.onlinevotingsystem.entity.Candidate;
import com.onlinevotingsystem.repository.VoteRepository;
import com.onlinevotingsystem.repository.UserRepository;
import com.onlinevotingsystem.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Transactional
    public Vote castVote(String aadhaarNumber, Long candidateId) {
        // Find user
        User user = userRepository.findByAadhaarNumber(aadhaarNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user has already voted
        if (voteRepository.existsByUser(user)) {
            throw new RuntimeException("User has already voted");
        }

        // Find candidate
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // Increment candidate votes
        candidate.setVotes(candidate.getVotes() + 1);
        candidateRepository.save(candidate);

        // Create vote
        Vote vote = new Vote(user, candidate);
        return voteRepository.save(vote);
    }

    public boolean hasUserVoted(String aadhaarNumber) {
        User user = userRepository.findByAadhaarNumber(aadhaarNumber).orElse(null);
        return user != null && voteRepository.existsByUser(user);
    }

    public List<Map<String, Object>> getVoteResults() {
        List<Object[]> results = voteRepository.getVoteResults();
        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("candidateId", row[0]);
            map.put("name", row[1]);
            map.put("party", row[2]);
            map.put("votes", row[3]);
            return map;
        }).toList();
    }

    public long getTotalVotes() {
        return voteRepository.count();
    }
}