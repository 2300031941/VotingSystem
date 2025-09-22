import React, { useState, useEffect } from 'react';
import { useCandidates } from '../context/CandidatesContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { candidates, removeCandidate, loading } = useCandidates();
  const navigate = useNavigate();

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this candidate?')) {
      try {
        console.log('Removing candidate with ID:', id, typeof id);
        await removeCandidate(parseInt(id));
        alert('Candidate removed successfully!');
      } catch (error) {
        console.error('Error removing candidate:', error);
        alert('Error removing candidate: ' + error.message);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove ALL candidates and votes? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:4000/api/candidates', {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('All candidates and votes cleared successfully!');
          // Refresh the candidates list
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

  if (loading) {
    return <div className="admin-panel-container"><div className="container-content"><h2>Loading...</h2></div></div>;
  }

  return (
    <div className="admin-panel-container">
      <div className="container-content">
        <div className="admin-header">
          <h2>Candidate Management</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>

        <div className="admin-content">
          <div className="candidates-list-section">
            <div className="candidates-header">
              <h3>Current Candidates ({candidates.length})</h3>
              {candidates.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="btn-danger"
                >
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
                    <img src={`http://localhost:4000${candidate.symbol}`} alt={candidate.name} className="small-image" />
                    <div className="candidate-info-small">
                      <h5>{candidate.name}</h5>
                      <p className="small-text">{candidate.partyName}</p>
                      <p className="small-text">Age: {candidate.age}</p>
                      <p className="small-text">Votes: {candidate.votes || 0}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(candidate.id)}
                      className="btn-danger remove-btn-small"
                      style={{ display: 'none' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;