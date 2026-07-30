import { MBTA_LINES } from '../lib/types';
import './MBTAFilter.css';

interface MBTAFilterProps {
  selectedLine: string;
  onChange: (lineKey: string) => void;
}

export default function MBTAFilter({ selectedLine, onChange }: MBTAFilterProps) {
  return (
    <div className="mbta-filter">
      <label htmlFor="mbta-select" className="mbta-filter-label">
        Transit Access
      </label>
      <div className="mbta-select-wrapper">
        <select
          id="mbta-select"
          className="mbta-select"
          value={selectedLine}
          onChange={(e) => onChange(e.target.value)}
        >
          {MBTA_LINES.map((line) => (
            <option key={line.key} value={line.key}>
              {line.label}
            </option>
          ))}
        </select>

        {/* Visual indicator of the selected color */}
        <div
          className="mbta-color-indicator"
          style={{
            backgroundColor: MBTA_LINES.find((l) => l.key === selectedLine)?.color || '#64748B',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
