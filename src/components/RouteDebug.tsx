import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

export const RouteDebug: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showDebug = localStorage.getItem('showRouteDebug') === 'true';
    setIsVisible(showDebug);
    
    // Add keyboard shortcut (Ctrl+Shift+D) to toggle debug panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const newValue = !isVisible;
        setIsVisible(newValue);
        localStorage.setItem('showRouteDebug', newValue.toString());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);
  
  // Track route changes
  useEffect(() => {
    if (isVisible) {
      console.log('Route changed:', location.pathname + location.search);
    }
  }, [location, isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '60px',
      left: '0',
      right: '0',
      background: 'rgba(0,0,0,0.85)',
      color: 'white',
      zIndex: 9999,
      padding: '10px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxHeight: '30vh',
      overflowY: 'auto',
    }}>
      <div>
        <strong>Path:</strong> {location.pathname}
      </div>
      <div>
        <strong>Query:</strong> {location.search}
      </div>
      <div>
        <strong>Component:</strong> Unknown
      </div>
      <div>
        <button 
          onClick={() => history.goBack()} 
          style={{margin: '5px', padding: '3px 8px'}}
        >
          Back
        </button>
        <button 
          onClick={() => history.push('/')} 
          style={{margin: '5px', padding: '3px 8px'}}
        >
          Home
        </button>
        <button 
          onClick={() => history.push('/products')} 
          style={{margin: '5px', padding: '3px 8px'}}
        >
          Products
        </button>
        <button 
          onClick={() => setIsVisible(false)} 
          style={{margin: '5px', padding: '3px 8px', background: 'red'}}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RouteDebug;
