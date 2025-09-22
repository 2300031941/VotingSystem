import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCandidates } from '../context/CandidatesContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { electionStatus, userVoteStatus, checkUserVoteStatus, candidates } = useCandidates();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin' && user.aadhaar) {
      checkUserVoteStatus(user.aadhaar);
    }
  }, [user, checkUserVoteStatus]);


  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove ALL candidates and votes? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:4000/api/candidates', {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('All candidates and votes cleared successfully!');
          window.location.reload();
        } else {
          const errorText = await response.text();
          throw new Error(`Failed to clear candidates: ${response.status} ${response.statusText} - ${errorText}`);
        }
      } catch (error) {
        console.error('Error clearing candidates:', error);
        alert('Error clearing candidates: ' + error.message);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container-content">
        <h1>Welcome to the Online Voting System</h1>
        <div className="dashboard-content">
        <div className="user-info">
          <h2>Hello, {user?.name}!</h2>
          <p>Role: {user?.role === 'admin' ? 'Administrator' : 'Voter'}</p>
        </div>

        {user?.role !== 'admin' && (
          <div className="voter-actions">
            <h3>Voter Options</h3>
            <div className="action-buttons">
              <button
                onClick={() => navigate('/voting')}
                className="btn-primary"
                disabled={userVoteStatus}
              >
                {userVoteStatus ? 'Already Voted' : 'Vote'}
              </button>
              <button onClick={() => navigate('/my-vote')} className="btn-secondary">
                My Vote
              </button>
            </div>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="admin-dashboard">
            <div className="admin-actions">
              <h3>Administrator Panel</h3>
              <div className="admin-controls">
                <button onClick={() => navigate('/results')} className="btn-primary">
                  View Results
                </button>
              </div>
            </div>

            <div className="admin-content">
              <div className="candidates-section">
                <div className="candidates-header">
                  <h4>Current Candidates ({candidates.length})</h4>
                  {candidates.length > 0 && (
                    <button onClick={handleClearAll} className="btn-danger">
                      Clear All Data
                    </button>
                  )}
                </div>
                {candidates.length === 0 ? (
                  <p>No candidates added yet.</p>
                ) : (
                  <div className="candidates-grid-admin">
                    {candidates.map((candidate) => (
                      <div key={candidate.id} className="candidate-admin-card-small">
                       <img src={candidate.symbol ? `http://localhost:4000${candidate.symbol}` : '/vite.svg'} alt={candidate.name} className="small-image" />
                        <div className="candidate-info-small">
                          <h5>{candidate.name}</h5>
                          <p className="small-text">{candidate.partyName}</p>
                          <p className="small-text">Age: {candidate.age}</p>
                          <p className="small-text">Votes: {candidate.votes || 0}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        <div className="quick-stats">
          <h3>Election Overview</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Voters</h4>
              <p>1,250</p>
            </div>
            <div className="stat-card">
              <h4>Votes Cast</h4>
              <p>892</p>
            </div>
            <div className="stat-card">
              <h4>Candidates</h4>
              <p>3</p>
            </div>
            <div className="stat-card">
              <h4>Election Status</h4>
              <p className={`status-${electionStatus}`}>
                {electionStatus === 'active' ? 'Active' : 'Ended'}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;