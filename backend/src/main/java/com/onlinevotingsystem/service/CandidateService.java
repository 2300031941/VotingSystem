package com.onlinevotingsystem.service;

import com.onlinevotingsystem.entity.Candidate;
import com.onlinevotingsystem.repository.CandidateRepository;
import com.onlinevotingsystem.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteRepository voteRepository;

    public Candidate addCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Optional<Candidate> getCandidateById(Long id) {
        return candidateRepository.findById(id);
    }

    public void deleteCandidate(Long id) {
        candidateRepository.deleteById(id);
    }

    public void deleteAllCandidates() {
        // First delete all votes (due to foreign key constraints)
        voteRepository.deleteAll();
        // Then delete all candidates
        candidateRepository.deleteAll();
    }

    public Candidate updateCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }
}