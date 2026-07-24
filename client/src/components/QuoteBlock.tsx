import React from 'react';
import './QuoteBlock.css';

export interface QuoteBlockProps {
  title: string;
  quote: string;
  persona?: string;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ title, quote, persona }) => {
  return (
    <div className="quote-block">
      <div className="quote-block-content">
        <div className="quote-block-header">
          <h4 className="quote-block-title">{title}</h4>
          {persona && <span className="quote-block-persona">{persona}</span>}
        </div>
        <p className="quote-block-text">"{quote}"</p>
      </div>
    </div>
  );
};

export default QuoteBlock;
