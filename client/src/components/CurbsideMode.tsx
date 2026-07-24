import React, { useState } from 'react';
import './CurbsideMode.css';

export default function CurbsideMode() {
  const [isActive, setIsActive] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const toggleMode = () => {
    setIsActive(!isActive);
    setIsFormOpen(false);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !address) return;
    
    // In a real app, this would get coordinates from address and save to global state/map
    alert(`Reported: ${description} at ${address}`);
    setIsFormOpen(false);
    setDescription('');
    setAddress('');
  };

  return (
    <div className="curbside-container">
      <button 
        className={`curbside-toggle ${isActive ? 'active' : ''}`}
        onClick={toggleMode}
      >
        🚶 Curbside Finds
      </button>

      {isActive && (
        <div className="curbside-banner">
          <div className="curbside-banner-header">
            <h4>Allston Christmas Mode 🎄</h4>
            <p>Report curbside finds for neighbors!</p>
          </div>
          
          <button 
            className="curbside-report-btn"
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            📸 Report a Find
          </button>

          {isFormOpen && (
            <form className="curbside-form" onSubmit={handleReport}>
              <div className="curbside-photo-placeholder">
                📷 Tap to add photo
              </div>
              <input
                type="text"
                className="curbside-input"
                placeholder="What is it? (e.g. Wooden chair)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <input
                type="text"
                className="curbside-input"
                placeholder="Street address or intersection"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <button type="submit" className="curbside-submit-btn">Post Find</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
