import React, { useState, useEffect } from 'react';
import './GratitudeFeed.css';

interface GratitudeMessage {
  id: string;
  locationName: string;
  activity: string;
  timestamp: number;
}

const STORAGE_KEY = 'bce_gratitude_feed';

const MOCK_MESSAGES: GratitudeMessage[] = [
  {
    id: '1',
    locationName: 'Boston Building Resources',
    activity: 'helping me fix my door',
    timestamp: Date.now() - 3600000,
  },
  {
    id: '2',
    locationName: 'JP Tool Library',
    activity: 'lending a drill',
    timestamp: Date.now() - 7200000,
  },
];

export default function GratitudeFeed() {
  const [messages, setMessages] = useState<GratitudeMessage[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [activity, setActivity] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages(MOCK_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MESSAGES));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || !activity) return;

    const newMessage: GratitudeMessage = {
      id: Date.now().toString(),
      locationName,
      activity,
      timestamp: Date.now(),
    };

    const updated = [newMessage, ...messages].slice(0, 10);
    setMessages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setIsFormOpen(false);
    setLocationName('');
    setActivity('');
  };

  return (
    <div className="gratitude-feed-container">
      <div className="gratitude-header">
        <h3 className="gratitude-title">Community Gratitude</h3>
        <button className="gratitude-btn" onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? 'Cancel' : 'Send Thanks 💖'}
        </button>
      </div>

      {isFormOpen && (
        <form className="gratitude-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="gratitude-input"
            placeholder="Who are you thanking? (e.g. JP Tool Library)"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            required
          />
          <input
            type="text"
            className="gratitude-input"
            placeholder="For what? (e.g. lending a drill)"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />
          <button type="submit" className="gratitude-submit-btn">
            Post Thanks
          </button>
        </form>
      )}

      <div className="gratitude-list">
        {messages.map((msg) => (
          <div key={msg.id} className="gratitude-card">
            <span className="gratitude-emoji">💖</span>
            <div className="gratitude-text">
              User thanked <strong>{msg.locationName}</strong> for {msg.activity}
            </div>
            <div className="gratitude-time">{new Date(msg.timestamp).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
