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
    const newState = !getParticlesPreference();
    setParticlesPreference(newState);
    updateParticleState(newState, true); // true = animate transition
    updateButtonState(button, newState);
  });
}

function createToggleButton() {
  const button = document.createElement('div');
  button.id = 'particle-toggle';
  button.innerHTML = '<i class="ti ti-sparkles"></i>';
  button.className = getParticlesPreference() ? '' : 'disabled';
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

    // Reinitialize if pJSDom doesn't exist or particles were destroyed
    if (typeof particlesJS !== 'undefined' &&
        (typeof pJSDom === 'undefined' || pJSDom.length === 0)) {
      initializeParticles();
    }
  } else {
    // Hide particles
    if (animate) {
      container.style.transition = 'opacity 0.3s ease-in-out';
    }
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';

    // Destroy particles to save CPU (performance optimization)
    if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
      pJSDom[0].pJS.fn.vendors.destroypJS();
      pJSDom = [];
    }
  }
}

function updateButtonState(button, enabled) {
  if (enabled) {
    button.classList.remove('disabled');
    button.style.opacity = '1';
  } else {
    button.classList.add('disabled');
    button.style.opacity = '0.5';
  }
}

function initializeParticles() {
  // Reload particles - matches particle-call-function.js logic
  if (typeof particlesJS !== 'undefined') {
    particlesJS.load('particles-js', '/assets/json/particles.json', function() {
      console.log('Particles reinitialized');

      // Apply current theme colors
      const theme = determineComputedTheme();
      if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
        const particles = pJSDom[0].pJS.particles;
        if (theme === "dark") {
          particles.color.value = '#ffffff';
          particles.line_linked.color = '#ffffff';
        } else {
          particles.color.value = '#000000';
          particles.line_linked.color = '#000000';
        }
        pJSDom[0].pJS.fn.particlesRefresh();
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addParticleToggle);
} else {
  addParticleToggle();
}
