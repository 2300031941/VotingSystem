package com.onlinevotingsystem.config;

import com.onlinevotingsystem.entity.Candidate;
import com.onlinevotingsystem.repository.CandidateRepository;
import com.onlinevotingsystem.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Override
    public void run(String... args) throws Exception {
        // Always ensure the fixed candidates exist
        // First delete all votes (due to foreign key constraints)
        voteRepository.deleteAll();
        // Then delete all candidates
        candidateRepository.deleteAll();
        candidateRepository.save(new Candidate("Jagan Mohan Reddy", "YSRCP", 50, null));
        candidateRepository.save(new Candidate("Chandra Babu Naidu", "TDP", 74, null));
        candidateRepository.save(new Candidate("Pawan Kalyan", "Janasena", 52, null));
        System.out.println("Fixed candidates seeded successfully");
    }
}