// Simplified tab selection handling with ripple effect

document.addEventListener('DOMContentLoaded', () => {
  function updateTabSelection() {
    const currentPath = window.location.pathname;
    const tabButtons = document.querySelectorAll('ion-tab-button');

    tabButtons.forEach(btn => {
      btn.classList.remove('tab-selected');
      btn.setAttribute('aria-selected', 'false');
      btn.style.border = 'none';
      btn.style.borderBottom = 'none';
      btn.style.boxShadow = 'none';
      btn.style.background = 'transparent';
    });

    tabButtons.forEach(btn => {
      const href = btn.getAttribute('href');
      if (!href) return;
      if (href === currentPath || (currentPath === '/' && href === '/')) {
        // Keep the ARIA selected state for accessibility
        btn.classList.add('tab-selected');
        btn.setAttribute('aria-selected', 'true');
        // Remove visual highlighting
        btn.style.border = 'none';
        btn.style.borderBottom = 'none';
        btn.style.boxShadow = 'none';
        btn.style.background = 'transparent';
        const icon = btn.querySelector('ion-icon');
        if (icon) {
          // Remove animation
          icon.style.animation = 'none';
        }
      }
    });
  }

  function addClickHandlers() {
    const tabButtons = document.querySelectorAll('ion-tab-button');
    tabButtons.forEach(btn => {
      // Remove any existing click listeners
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      // Add clean click handler with ripple effect
      newBtn.addEventListener('click', function() {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('tab-ripple');
        ripple.style.position = 'absolute';
        ripple.style.width = '100%';
        ripple.style.height = '100%';
        ripple.style.backgroundColor = `rgba(var(--ion-color-primary-rgb), 0.1)`;
        ripple.style.borderRadius = '0';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.3s ease-out';
        
        // Add the ripple element
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        // Remove the ripple after animation completes
        setTimeout(() => {
          if (this.contains(ripple)) {
            this.removeChild(ripple);
          }
        }, 300);
        
        // Update selection state for accessibility
        const tabButtons = document.querySelectorAll('ion-tab-button');
        tabButtons.forEach(b => {
          b.classList.remove('tab-selected');
          b.setAttribute('aria-selected', 'false');
          b.style.border = 'none';
          b.style.borderBottom = 'none';
          b.style.boxShadow = 'none';
          b.style.background = 'transparent';
        });
        
        this.classList.add('tab-selected');
        this.setAttribute('aria-selected', 'true');
      }, { passive: true });
    });
  }

  // Add ripple animation style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    
    .tab-ripple {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(var(--ion-color-primary-rgb), 0.1);
      border-radius: 0;
      transform: scale(0);
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  // Initial run
  updateTabSelection();
  addClickHandlers();

  // Browser history navigation
  window.addEventListener('popstate', updateTabSelection);

  // Detect SPA (React Router) URL changes
  let lastUrl = location.href;
  new MutationObserver(() => {
    const current = location.href;
    if (current !== lastUrl) {
      lastUrl = current;
      setTimeout(updateTabSelection, 30);
    }
  }).observe(document, { subtree: true, childList: true });

  // Observe tab bar attribute changes
  const tabBar = document.querySelector('ion-tab-bar');
  if (tabBar) {
    new MutationObserver(updateTabSelection).observe(tabBar, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'aria-selected']
    });
  }
  
  // Apply fix again after delays to ensure everything loads
  setTimeout(updateTabSelection, 100);
  setTimeout(updateTabSelection, 500);
  setTimeout(updateTabSelection, 1000);
  
  // Watch for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTabSelection);
});

