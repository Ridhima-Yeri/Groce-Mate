// Helper functions for accessibility improvements

// Announce messages to screen readers
export function announceToScreenReader(message: string) {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'assertive');
  announcer.setAttribute('role', 'status');
  announcer.className = 'sr-only';
  announcer.textContent = '';
  
  document.body.appendChild(announcer);
  
  // Use two timeouts to ensure the announcement is made
  // First render empty, then populate after a brief delay
  setTimeout(() => {
    announcer.textContent = message;
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 3000);
  }, 100);
}

// Helper to determine if an element is tabbable
export function isTabbable(element: HTMLElement): boolean {
  // List of tabbable elements
  const tabbableTags = ['a', 'button', 'input', 'select', 'textarea'];
  
  // Check if element is tabbable by tag
  if (tabbableTags.includes(element.tagName.toLowerCase())) {
    return !element.hasAttribute('disabled') && 
           !element.hasAttribute('hidden') &&
           element.getAttribute('tabindex') !== '-1';
  }
  
  // Check for tabindex
  const tabIndex = parseInt(element.getAttribute('tabindex') || '', 10);
  return !isNaN(tabIndex) && tabIndex >= 0;
}

// Create accessible label from text content
export function createAriaLabel(element: HTMLElement): string {
  // Try to extract text content for labels
  const textContent = element.textContent?.trim();
  if (textContent && textContent.length > 0) {
    return textContent;
  }
  
  // Try to find an icon and use its name
  const iconElement = element.querySelector('ion-icon');
  if (iconElement) {
    const iconName = iconElement.getAttribute('name') || 
                    iconElement.getAttribute('md') ||
                    iconElement.getAttribute('ios');
    if (iconName) {
      // Convert camelCase or kebab-case to readable text
      return iconName
        .replace(/([A-Z])/g, ' $1') // camelCase to spaces
        .replace(/-/g, ' ') // kebab-case to spaces
        .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
    }
  }
  
  return 'Unlabeled element';
}

// Helper function to handle tab selection without visual highlighting
export function setTabSelectedState(tabButton: HTMLElement, isSelected: boolean) {
  // Keep ARIA state for accessibility
  tabButton.setAttribute('aria-selected', isSelected ? 'true' : 'false');
  
  // Add or remove the selected class (for JavaScript reference)
  if (isSelected) {
    tabButton.classList.add('tab-selected');
  } else {
    tabButton.classList.remove('tab-selected');
  }
  
  // Ensure no visual highlighting
  tabButton.style.borderBottom = 'none';
  tabButton.style.boxShadow = 'none';
}
