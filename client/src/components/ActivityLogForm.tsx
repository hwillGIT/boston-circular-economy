import React, { useState, useEffect } from 'react';
import type { Location } from '../lib/types';
import { logActivity } from '../lib/api';
import { estimateMultiImpact } from '../lib/co2';
import '../styles/forms.css';
import './ActivityLogForm.css';

const ACTION_CHIPS = [
  { value: 'repair', label: '🔧 Repair' },
  { value: 'donate', label: '🎁 Donate' },
  { value: 'swap', label: '🔄 Swap' },
  { value: 'recycle', label: '♻️ Recycle' },
  { value: 'mend', label: '🧵 Mend' },
  { value: 'compost', label: '🌿 Compost' },
  { value: 'refurbish', label: '🛠️ Refurbish' },
];

interface ActivityLogFormProps {
  location?: Location | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const ActivityLogForm: React.FC<ActivityLogFormProps> = ({ location, onClose, onSuccess }) => {
  const [actions, setActions] = useState<Set<string>>(new Set());
  const [item, setItem] = useState('');
  const [notes, setNotes] = useState('');
  const [savings, setSavings] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const impact = actions.size > 0 ? estimateMultiImpact([...actions]) : null;
  const isFormValid = actions.size > 0 && item.trim().length > 0;

  const toggleAction = (value: string) => {
    setActions((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const getPlaceholder = () => {
    if (actions.size === 0) return 'What did you do?';
    if (actions.size === 1) {
      const a = [...actions][0];
      const labels: Record<string, string> = {
        repair: 'What did you repair?',
        donate: 'What did you donate?',
        swap: 'What did you swap?',
        recycle: 'What did you recycle?',
        mend: 'What did you mend?',
        compost: 'What did you compost?',
        refurbish: 'What did you refurbish?',
      };
      return labels[a] || 'What did you do?';
    }
    return 'What items were involved?';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await logActivity({
        date: new Date().toISOString(),
        action: [...actions].join(', '),
        item,
        location_id: location?.id ?? undefined,
        location_name: location?.name,
        co2_saved: impact?.co2 ?? 2.0,
        savings: parseFloat(savings) || 0,
        credits: impact?.credits ?? 20,
        notes: notes || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="alf-overlay modal-overlay" onClick={onClose}>
      <div className="alf-modal" onClick={(e) => e.stopPropagation()}>
        <button className="alf-close" onClick={onClose} aria-label="Close form">
          ✕
        </button>

        {success ? (
          <div className="alf-success">
            <div className="alf-success-icon">✅</div>
            <h3>Activity Logged!</h3>
            <p>
              You prevented <strong>{impact?.co2} lbs</strong> CO₂
              <br />— {impact?.equivalency}!
            </p>
            {impact?.credits ? <p>Eco streak: +{impact.credits} credits!</p> : null}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="alf-body">
            <div className="alf-step">
              <label>1. What did you do?</label>
              <div className="alf-chips chip-container">
                {ACTION_CHIPS.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    className={`alf-chip chip-toggle ${actions.has(a.value) ? 'active' : ''}`}
                    onClick={() => toggleAction(a.value)}
                  >
                    {a.label}
                    {actions.has(a.value) && <span className="alf-chip-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className={`alf-step ${actions.size > 0 ? 'visible' : 'hidden'}`}>
              <label htmlFor="alf-item">2. {getPlaceholder()}</label>
              <input
                id="alf-item"
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. Winter jacket, Toaster"
                required
                autoComplete="off"
                autoFocus={actions.size > 0}
                className="form-input"
              />
            </div>

            {isFormValid && impact && (
              <div className="alf-preview-panel">
                <div className="alf-preview-item">
                  <span>🌍 CO₂ prevented</span>
                  <strong>{impact.co2} lbs</strong>
                </div>
                <div className="alf-preview-subtext">{impact.equivalency}</div>

                <div className="alf-preview-item">
                  <span>⭐ Credits earned</span>
                  <strong>{impact.credits} credits</strong>
                </div>

                {location && (
                  <div className="alf-preview-item">
                    <span>📍 Location</span>
                    <strong>{location.name}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="alf-optional-section">
              <button
                type="button"
                className="alf-optional-toggle"
                onClick={() => setShowOptional(!showOptional)}
              >
                Add details {showOptional ? '▲' : '▼'}
              </button>

              {showOptional && (
                <div className="alf-optional-fields">
                  <div className="alf-field">
                    <label htmlFor="alf-savings">Money saved ($)</label>
                    <input
                      id="alf-savings"
                      type="number"
                      min="0"
                      step="0.01"
                      value={savings}
                      onChange={(e) => setSavings(e.target.value)}
                      placeholder="0.00"
                      className="form-input"
                    />
                  </div>
                  <div className="alf-field">
                    <label htmlFor="alf-notes">Notes</label>
                    <textarea
                      id="alf-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any extra details?"
                      rows={2}
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && <div className="alf-error form-error">{error}</div>}

            <button
              type="submit"
              className="alf-submit-btn btn-primary"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? <span className="alf-spinner"></span> : 'Log This Activity →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ActivityLogForm;
