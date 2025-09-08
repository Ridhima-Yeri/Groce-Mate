import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/VideoFix.css'; // Add the new VideoFix CSS

// Add these accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
  // Apply accessible labels to elements missing them
  setTimeout(() => {
    // Find all interactive elements without accessible names
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    
    interactiveElements.forEach((el) => {
      const element = el as HTMLElement;
      const hasAccessibleName = 
        element.hasAttribute('aria-label') || 
        element.hasAttribute('aria-labelledby') ||
        (element.textContent && element.textContent.trim() !== '');
      
      if (!hasAccessibleName) {
        // Try to generate a label
        const iconName = element.querySelector('ion-icon')?.getAttribute('name')
          ?.replace('-outline', '')
          .replace(/-/g, ' ');
          
        if (iconName) {
          element.setAttribute('aria-label', iconName);
        }
      }
    });
  }, 1000);
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
