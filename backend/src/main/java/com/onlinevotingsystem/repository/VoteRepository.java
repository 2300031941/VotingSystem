package com.onlinevotingsystem.repository;

import com.onlinevotingsystem.entity.Vote;
import com.onlinevotingsystem.entity.User;
import com.onlinevotingsystem.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    // Check if user has already voted
    boolean existsByUser(User user);

    // Find vote by user
    Optional<Vote> findByUser(User user);

    // Count votes for a candidate
    long countByCandidate(Candidate candidate);

    // Get all votes with candidate details for results
    @Query("SELECT v.candidate.id, v.candidate.name, v.candidate.partyName, COUNT(v) as voteCount " +
           "FROM Vote v GROUP BY v.candidate.id, v.candidate.name, v.candidate.partyName " +
           "ORDER BY voteCount DESC")
    List<Object[]> getVoteResults();
}