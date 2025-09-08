/**
 * Utilities to improve application accessibility
 */

// Helper to manage focus trapping in modals and dialogs
export const trapFocus = (containerElement: HTMLElement | null) => {
  if (!containerElement) return;
  
  // Get all focusable elements within the container
  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Set focus to the first element
  firstElement.focus();
  
  // Add keydown handler for tab key
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // If shift+tab and focus is on first element, move to last element
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // If tab and focus is on last element, move to first element
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  // Add event listener
  containerElement.addEventListener('keydown', handleTabKey);
  
  // Return a cleanup function
  return () => {
    containerElement.removeEventListener('keydown', handleTabKey);
  };
};

// Helper to create an accessible modal
export const setupAccessibleModal = (
  modalRef: HTMLIonModalElement | null, 
  onClose: () => void
) => {
  if (!modalRef) return;
  
  // Handle Escape key to close modal
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };
  
  // Add event listener
  modalRef.addEventListener('keydown', handleEscape);
  
  // Return cleanup function
  return () => {
    modalRef.removeEventListener('keydown', handleEscape);
  };
};

// Helper to announce messages to screen readers
export const announceToScreenReader = (message: string) => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'assertive');
  announcer.setAttribute('role', 'status');
  announcer.className = 'sr-only'; // Add this class in your CSS
  
  document.body.appendChild(announcer);
  
  // Delay to ensure screen readers pick up the change
  setTimeout(() => {
    announcer.textContent = message;
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 3000);
  }, 100);
};
