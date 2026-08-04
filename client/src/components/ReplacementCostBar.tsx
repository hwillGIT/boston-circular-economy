import React from 'react';
import './ReplacementCostBar.css';

export interface ReplacementCostBarProps {
  newCost: number;
  landfillLbs: number;
  co2Lbs: number;
}

const ReplacementCostBar: React.FC<ReplacementCostBarProps> = ({
  newCost,
  landfillLbs,
  co2Lbs,
}) => {
  return (
    <div className="replacement-cost-bar">
      <div className="replacement-icon">⚠️</div>
      <div className="replacement-text">
        <strong>Buying new:</strong> ${newCost}
        <span className="replacement-dot">•</span>
        Sends {landfillLbs} lbs to landfill
        <span className="replacement-dot">•</span>
        {co2Lbs} lbs CO₂ emitted
      </div>
    </div>
  );
};

export default ReplacementCostBar;
