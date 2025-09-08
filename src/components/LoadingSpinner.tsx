import React from 'react';
import { IonSpinner } from '@ionic/react';
import '../styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullPage = false
}) => {
  return (
    <div className={`loading-spinner-container ${fullPage ? 'full-page' : ''}`}>
      <div className={`loading-spinner ${size}`}>
        <IonSpinner name="crescent" />
        <div className="loading-dots">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
      </div>
      {message && (
        <p className="loading-message">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
