import { useState } from 'react';
import './EcoKudos.css';

interface Props {
  targetId: string;
}

export default function EcoKudos({ targetId }: Props) {
  return <KudosButton key={targetId} targetId={targetId} />;
}

function KudosButton({ targetId }: Props) {
  const [kudos, setKudos] = useState(() => {
    const stored = localStorage.getItem(`bce_kudos_${targetId}`);
    return stored ? parseInt(stored, 10) : 0;
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTap = () => {
    const newKudos = kudos + 1;
    setKudos(newKudos);
    const key = `bce_kudos_${targetId}`;
    localStorage.setItem(key, newKudos.toString());

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button className={`eco-kudos-btn ${isAnimating ? 'animating' : ''}`} onClick={handleTap}>
      <span className="eco-kudos-emoji">🌿</span>
      <span className="eco-kudos-count">{kudos > 0 ? kudos : 'Give Kudos'}</span>
    </button>
  );
}
