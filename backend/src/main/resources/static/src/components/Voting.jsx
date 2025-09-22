import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCandidates } from '../context/CandidatesContext';
import { useNavigate } from 'react-router-dom';
import VoteConfirmationModal from './VoteConfirmationModal';

const Voting = () => {
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { candidates, electionStatus, userVoteStatus, castVote: recordVote } = useCandidates();
  const navigate = useNavigate();

  const selectedCandidateData = candidates.find(c => c.id === selectedCandidate);

  const handleVoteClick = () => {
    if (userVoteStatus) {
      alert('You have already cast your vote.');
      return;
    }
    if (!selectedCandidate) {
      alert('Please select a candidate');
      return;
    }
    setShowModal(true);
  };

  const confirmVote = async () => {
    try {
      await recordVote(selectedCandidate, user.aadhaar);
      alert('Vote submitted successfully!');
      setShowModal(false);
      navigate('/dashboard');
    } catch (error) {
      alert('Error submitting vote: ' + error.message);
    }
  };

  if (electionStatus === 'ended') {
    return (
      <div className="voting-container">
        <h2>Election Ended</h2>
        <p>The election has ended. Voting is no longer available.</p>
        <div className="election-status ended">
          <p>Status: Election Ended</p>
        </div>
      </div>
    );
  }

  if (userVoteStatus) {
    return (
      <div className="voting-container">
        <h2>Voting Complete</h2>
        <p>You have already cast your vote in this election.</p>
        <div className="election-status active">
          <p>Status: Election Active</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voting-container">
      <div className="container-content">
        <h2>Cast Your Vote</h2>
        <p>Select one candidate to vote for. Your vote is anonymous and secure.</p>

      <div className="candidates-grid">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <img src={candidate.symbol ? `http://localhost:4000${candidate.symbol}` : '/vite.svg'} alt={candidate.name} />
            <h3>{candidate.name}</h3>
            <p>{candidate.partyName} (Age: {candidate.age})</p>
            <div className="candidate-select">
              <input
                type="radio"
                id={candidate.id}
                name="candidate"
                value={candidate.id}
                checked={selectedCandidate == candidate.id}
                onChange={(e) => setSelectedCandidate(e.target.value)}
              />
              <label htmlFor={candidate.id}>Select {candidate.name}</label>
            </div>
          </div>
        ))}
      </div>

      <div className="voting-actions">
        <button onClick={handleVoteClick} className="vote-button" disabled={!selectedCandidate}>
          Submit Vote
        </button>
        {selectedCandidate && (
          <p className="selected-info">Selected: {selectedCandidateData?.name}</p>
        )}
      </div>

      <VoteConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        candidate={selectedCandidateData}
        onConfirm={confirmVote}
      />
      </div>
    </div>
  );
};

export default Voting;