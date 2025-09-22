import React, { createContext, useContext, useState, useEffect } from 'react';

const CandidatesContext = createContext();

const API_BASE = 'http://localhost:4000/api';

export const useCandidates = () => {
  return useContext(CandidatesContext);
};

export const CandidatesProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [electionStatus, setElectionStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [userVoteStatus, setUserVoteStatus] = useState(false);
  const [results, setResults] = useState([]);

  const fetchCandidates = async () => {
    try {
      console.log('Fetching candidates from:', `${API_BASE}/candidates`);
      const response = await fetch(`${API_BASE}/candidates`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched candidates:', data);
        setCandidates(data);
      } else {
        console.error('Failed to fetch candidates:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchElectionStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/election-status`);
      if (response.ok) {
        const data = await response.json();
        setElectionStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching election status:', error);
    }
  };

  const checkUserVoteStatus = async (aadhaarNumber) => {
    try {
      const response = await fetch(`${API_BASE}/vote-status?aadhaarNumber=${aadhaarNumber}`);
      if (response.ok) {
        const data = await response.json();
        setUserVoteStatus(data.hasVoted);
      }
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE}/results`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchElectionStatus();

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchCandidates();
      fetchElectionStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addCandidate = async (name, partyName, age, symbol) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('partyName', partyName);
    formData.append('age', age);
    formData.append('symbol', symbol);

    const response = await fetch(`${API_BASE}/candidates`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add candidate: ${response.status} ${response.statusText} - ${errorText}`);
    }
    await fetchCandidates(); // Refresh data
  };

  const removeCandidate = async (id) => {
    const response = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to remove candidate: ${response.status} ${response.statusText} - ${errorText}`);
    }
    await fetchCandidates(); // Refresh data
  };

  const castVote = async (candidateId, aadhaarNumber) => {
    try {
      const response = await fetch(`${API_BASE}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, aadhaarNumber })
      });
      if (response.ok) {
        setUserVoteStatus(true); // Update local state
        fetchCandidates(); // Refresh data
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to cast vote' }));
        throw new Error(errorData.message || 'Failed to cast vote');
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  };

  const toggleElectionStatus = async () => {
    const newStatus = electionStatus === 'active' ? 'ended' : 'active';
    try {
      const response = await fetch(`${API_BASE}/election-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setElectionStatus(newStatus);
      } else {
        console.error('Failed to update election status');
      }
    } catch (error) {
      console.error('Error updating election status:', error);
    }
  };

  return (
    <CandidatesContext.Provider value={{
      candidates,
      electionStatus,
      loading,
      userVoteStatus,
      results,
      addCandidate,
      removeCandidate,
      castVote,
      checkUserVoteStatus,
      fetchResults,
      toggleElectionStatus
    }}>
      {children}
    </CandidatesContext.Provider>
  );
};