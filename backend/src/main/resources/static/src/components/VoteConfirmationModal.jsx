import React from 'react';

const VoteConfirmationModal = ({ isOpen, onClose, candidate, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Your Vote</h2>
        <div className="confirmation-details">
          <p>You are about to cast your vote for:</p>
          <div className="candidate-confirm">
            <h3>{candidate?.name}</h3>
            <p>{candidate?.description}</p>
          </div>
          <div className="warning">
            <p><strong>Important:</strong> Once submitted, your vote cannot be changed.</p>
            <p>Please ensure this is your final choice.</p>
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-primary">Confirm Vote</button>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmationModal;