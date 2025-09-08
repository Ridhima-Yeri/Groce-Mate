import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Import the new accessibility CSS
import './index.css';

// Add polyfill for inert attribute if needed
if (!('inert' in HTMLElement.prototype)) {
  // Simple inert polyfill (you might want to use a proper polyfill in production)
  Object.defineProperty(HTMLElement.prototype, 'inert', {
    set: function(value) {
      if (value) {
        this.setAttribute('aria-hidden', 'true');
        this.setAttribute('tabindex', '-1');
      } else {
        this.removeAttribute('aria-hidden');
        this.removeAttribute('tabindex');
      }
    },
    get: function() {
      return this.hasAttribute('inert');
    }
  });
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);