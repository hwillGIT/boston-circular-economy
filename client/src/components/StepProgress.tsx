import React from 'react';
import './StepProgress.css';

export interface Step {
  label: string;
}

export interface StepProgressProps {
  currentStep: number;
  steps: Step[];
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className="step-progress-container">
      <div className="step-progress-track">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          
          let stateClass = '';
          if (isCompleted) stateClass = 'completed';
          else if (isActive) stateClass = 'active';
          else if (isUpcoming) stateClass = 'upcoming';

          return (
            <React.Fragment key={index}>
              <div className={`step-progress-item ${stateClass}`}>
                <div className="step-progress-circle-container">
                  <div className="step-progress-circle">
                    {isCompleted ? (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>
                  {isActive && <div className="step-progress-pulse" />}
                </div>
                <div className="step-progress-label">{step.label}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-progress-connector ${stepNumber < currentStep ? 'completed' : 'upcoming'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
