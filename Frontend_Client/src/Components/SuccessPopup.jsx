import React from 'react';
import './SuccessPopup.css';

const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="success-popup-overlay" onClick={onClose}>
      <div className="success-popup" onClick={(e) => e.stopPropagation()}>
        <h3 className="success-title">Success</h3>
        <p className="success-message">{message}</p>
        <p className="support-info">
          Our team will contact you shortly, or you can reach us at <strong>+91-7977022583</strong>.
        </p>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SuccessPopup;
