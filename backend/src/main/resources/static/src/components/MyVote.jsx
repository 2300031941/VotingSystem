import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCandidates } from '../context/CandidatesContext';

const MyVote = () => {
  const { user } = useAuth();
  const { userVoteStatus } = useCandidates();

  // For now, since voting is not fully implemented, show a placeholder
  // In a real implementation, this would fetch the user's vote from backend

  return (
    <div className="my-vote-container">
      <div className="container-content">
        <h2>My Vote</h2>
        {userVoteStatus ? (
          <div className="vote-info">
            <p>You have successfully cast your vote.</p>
            <p><strong>Note:</strong> For security reasons, your specific vote choice is not displayed.</p>
            <p>Thank you for participating in the election!</p>
          </div>
        ) : (
          <div className="no-vote">
            <p>You have not cast your vote yet.</p>
            <p>Please go to the Voting page to participate.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVote;