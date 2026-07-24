import React from 'react';
import './CTAButton.css';

export interface CTAButtonProps {
  label: string;
  onClick?: () => void;
  icon?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  label,
  onClick,
  icon = false,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}) => {
  const baseClass = 'cta-button';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const statesClass = [
    disabled ? `${baseClass}--disabled` : '',
    loading ? `${baseClass}--loading` : '',
    icon && variant === 'primary' ? `${baseClass}--with-icon` : '',
  ].filter(Boolean).join(' ');

  const classes = [baseClass, variantClass, sizeClass, statesClass, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="cta-button-spinner" />
      ) : (
        <span className="cta-button-label">{label}</span>
      )}
    </button>
  );
};

export default CTAButton;
