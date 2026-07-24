import { useState, useEffect } from 'react';
import './EcoKudos.css';

interface Props {
  targetId: string;
}

export default function EcoKudos({ targetId }: Props) {
  const [kudos, setKudos] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const key = `bce_kudos_${targetId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setKudos(parseInt(stored, 10));
    }
  }, [targetId]);

  const handleTap = () => {
    const newKudos = kudos + 1;
    setKudos(newKudos);
    const key = `bce_kudos_${targetId}`;
    localStorage.setItem(key, newKudos.toString());
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button 
      className={`eco-kudos-btn ${isAnimating ? 'animating' : ''}`} 
      onClick={handleTap}
    >
      <span className="eco-kudos-emoji">🌿</span>
      <span className="eco-kudos-count">{kudos > 0 ? kudos : 'Give Kudos'}</span>
    </button>
  );
}
