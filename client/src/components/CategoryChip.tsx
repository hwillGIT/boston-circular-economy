import React from 'react';
import './CategoryChip.css';

export interface CategoryChipProps {
  label: string;
  emoji?: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  emoji,
  active = false,
  onClick,
  count,
}) => {
  return (
    <button className={`category-chip ${active ? 'active' : ''}`} onClick={onClick} type="button">
      {emoji && <span className="category-chip-emoji">{emoji}</span>}
      <span className="category-chip-label">{label}</span>
      {count !== undefined && <span className="category-chip-count">{count}</span>}
    </button>
  );
};

export default CategoryChip;
