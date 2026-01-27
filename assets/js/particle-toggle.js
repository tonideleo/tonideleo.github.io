"use strict";

function addParticleToggle() {
  // Check if particles are enabled via config
  const particlesContainer = document.getElementById('particles-js');
  if (!particlesContainer) {
    return; // Particles not enabled in config
  }

  // Create button
  const button = createToggleButton();
  document.body.appendChild(button);

  // Initialize state from localStorage
  const particlesEnabled = getParticlesPreference();
  updateButtonState(button, particlesEnabled);

  // Add click handler
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const currentState = getParticlesPreference();
    const newState = !currentState;
    console.log('Particle toggle clicked, current:', currentState, 'new:', newState);
    setParticlesPreference(newState);
    updateParticleState(newState, true); // true = animate transition
    updateButtonState(button, newState);
  });
}

function createToggleButton() {
  const button = document.createElement('div');
  button.id = 'particle-toggle';
  const enabled = getParticlesPreference();
  button.innerHTML = `
    <i class="ti ti-sparkles"></i>
    <span class="toggle-text">${enabled ? 'Disable' : 'Enable'} Particles</span>
  `;
  button.className = enabled ? '' : 'disabled';
  button.style.cursor = 'pointer';
  button.title = 'Toggle Particles';
  return button;
}

function getParticlesPreference() {
  const pref = localStorage.getItem('particles-enabled');
  // Default to true if not set
  return pref === null ? true : pref === 'true';
}

function setParticlesPreference(enabled) {
  localStorage.setItem('particles-enabled', enabled.toString());
}

function updateParticleState(enabled, animate) {
  const container = document.getElementById('particles-js');
  if (!container) return;

  if (enabled) {
    // Show particles
    if (animate) {
      container.style.transition = 'opacity 0.3s ease-in-out';
    }
    container.style.opacity = '1';
    container.style.pointerEvents = 'auto';

    // Always reinitialize when enabling (simpler and more reliable)
    if (typeof window.particlesJS !== 'undefined') {
      console.log('Reinitializing particles...', 'pJSDom before:', window.pJSDom);
      // Clear container completely before reinitializing
      container.innerHTML = '';
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        initializeParticles();
      }, 50);
    }
  } else {
    // Hide particles
    if (animate) {
      container.style.transition = 'opacity 0.3s ease-in-out';
    }
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';

    // Destroy particles to save CPU (performance optimization)
    if (typeof window.pJSDom !== 'undefined' && window.pJSDom.length > 0 && window.pJSDom[0]) {
      console.log('Destroying particles...');
      window.pJSDom[0].pJS.fn.vendors.destroypJS();
      // Don't manually clear pJSDom - let destroypJS handle it
      // Clear the container after destruction
      container.innerHTML = '';
    }
  }
}

function updateButtonState(button, enabled) {
  const textElement = button.querySelector('.toggle-text');
  if (enabled) {
    button.classList.remove('disabled');
    button.style.opacity = '1';
    if (textElement) textElement.textContent = 'Disable Particles';
  } else {
    button.classList.add('disabled');
    button.style.opacity = '0.5';
    if (textElement) textElement.textContent = 'Enable Particles';
  }
}

function initializeParticles() {
  // Reload particles - matches particle-call-function.js logic
  console.log('initializeParticles called, particlesJS available:', typeof window.particlesJS !== 'undefined');
  if (typeof window.particlesJS !== 'undefined') {
    console.log('Calling particlesJS.load...');
    window.particlesJS.load('particles-js', '/assets/json/particles.json', function() {
      console.log('Particles reinitialized successfully, pJSDom:', window.pJSDom);

      // Apply current theme colors
      const theme = determineComputedTheme();
      if (typeof window.pJSDom !== 'undefined' && window.pJSDom.length > 0) {
        const particles = window.pJSDom[0].pJS.particles;
        if (theme === "dark") {
          particles.color.value = '#ffffff';
          particles.line_linked.color = '#ffffff';
        } else {
          particles.color.value = '#000000';
          particles.line_linked.color = '#000000';
        }
        window.pJSDom[0].pJS.fn.particlesRefresh();
        console.log('Theme colors applied');
      } else {
        console.warn('pJSDom not available after load');
      }
    });
  } else {
    console.error('particlesJS library not available');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addParticleToggle);
} else {
  addParticleToggle();
}
