"use strict";

// Debug: confirm script loads
console.log('[particle-toggle] Script loaded');

function addParticleToggle() {
  console.log('[particle-toggle] addParticleToggle called');

  // Check if particles are enabled via config
  const particlesContainer = document.getElementById('particles-js');
  if (!particlesContainer) {
    console.log('[particle-toggle] No particles container found');
    return;
  }

  // Check if button already exists (Turbo navigation)
  if (document.getElementById('particle-toggle')) {
    console.log('[particle-toggle] Button already exists, skipping creation');
    return;
  }

  // Create button
  const button = createToggleButton();
  document.body.appendChild(button);
  console.log('[particle-toggle] Button created and added to body');

  // Initialize state from localStorage
  const particlesEnabled = getParticlesPreference();
  updateButtonState(button, particlesEnabled);

  // Add click handler
  button.addEventListener('click', function(e) {
    console.log('[particle-toggle] Button clicked!');
    e.preventDefault();
    e.stopPropagation();

    const currentState = getParticlesPreference();
    const newState = !currentState;
    console.log('[particle-toggle] Toggling from', currentState, 'to', newState);

    setParticlesPreference(newState);
    updateParticleState(newState, true);
    updateButtonState(button, newState);
  });
}

function createToggleButton() {
  const button = document.createElement('div');
  button.id = 'particle-toggle';
  // Mark as permanent so Turbo doesn't remove it on navigation
  button.setAttribute('data-turbo-permanent', '');
  const enabled = getParticlesPreference();
  button.innerHTML = `
    <i class="ti ti-sparkles"></i>
    <span class="toggle-text">${enabled ? 'Disable' : 'Enable'} Particles</span>
  `;
  // Use custom class name to avoid Bootstrap's .disabled which has pointer-events: none
  button.className = enabled ? '' : 'particles-off';
  button.style.cursor = 'pointer';
  button.style.pointerEvents = 'auto';
  button.title = 'Toggle Particles';
  return button;
}

function getParticlesPreference() {
  const pref = localStorage.getItem('particles-enabled');
  return pref === null ? true : pref === 'true';
}

function setParticlesPreference(enabled) {
  localStorage.setItem('particles-enabled', enabled.toString());
}

function ensurePJSDomArray() {
  if (!window.pJSDom || !Array.isArray(window.pJSDom)) {
    window.pJSDom = [];
  }
}

function cleanupParticles() {
  console.log('[particle-toggle] cleanupParticles called');
  const container = document.getElementById('particles-js');

  ensurePJSDomArray();
  if (window.pJSDom.length > 0 && window.pJSDom[0]) {
    try {
      const pJS = window.pJSDom[0].pJS;
      if (pJS && pJS.fn) {
        if (pJS.fn.drawAnimFrame) {
          cancelAnimationFrame(pJS.fn.drawAnimFrame);
        }
        if (pJS.fn.checkAnimFrame) {
          cancelAnimationFrame(pJS.fn.checkAnimFrame);
        }
      }
    } catch (e) {
      console.log('[particle-toggle] Cleanup error (ignored):', e);
    }
  }

  if (container) {
    container.innerHTML = '';
  }

  window.pJSDom = [];
  console.log('[particle-toggle] Cleanup complete, pJSDom reset');
}

function updateParticleState(enabled, animate) {
  console.log('[particle-toggle] updateParticleState:', enabled, animate);
  const container = document.getElementById('particles-js');
  if (!container) return;

  if (enabled) {
    container.style.opacity = '0';
    container.style.pointerEvents = 'auto';
    container.style.transition = '';

    cleanupParticles();

    setTimeout(function() {
      console.log('[particle-toggle] Calling initializeParticles');
      initializeParticles(animate);
    }, 100);
  } else {
    if (animate) {
      container.style.transition = 'opacity 0.3s ease-in-out';
      container.style.opacity = '0';

      setTimeout(function() {
        cleanupParticles();
        container.style.pointerEvents = 'none';
      }, 350);
    } else {
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      cleanupParticles();
    }
  }
}

function updateButtonState(button, enabled) {
  if (!button) return;

  const textElement = button.querySelector('.toggle-text');
  if (enabled) {
    // Use custom class name, NOT 'disabled' (Bootstrap conflict)
    button.className = '';
    button.style.opacity = '1';
    if (textElement) textElement.textContent = 'Disable Particles';
  } else {
    button.className = 'particles-off';
    button.style.opacity = '0.5';
    if (textElement) textElement.textContent = 'Enable Particles';
  }

  // Always ensure button is clickable
  button.style.pointerEvents = 'auto';
}

function initializeParticles(animate) {
  console.log('[particle-toggle] initializeParticles called');
  const container = document.getElementById('particles-js');
  if (!container) {
    console.log('[particle-toggle] No container');
    return;
  }

  if (typeof window.particlesJS === 'undefined') {
    console.error('[particle-toggle] particlesJS not available!');
    return;
  }

  ensurePJSDomArray();
  console.log('[particle-toggle] pJSDom before load:', window.pJSDom);

  container.style.opacity = '0';
  container.style.transition = '';

  window.particlesJS.load('particles-js', '/assets/json/particles.json', function() {
    console.log('[particle-toggle] particlesJS.load callback fired');
    console.log('[particle-toggle] pJSDom after load:', window.pJSDom);

    ensurePJSDomArray();

    if (window.pJSDom.length === 0) {
      console.error('[particle-toggle] Particles failed to initialize - pJSDom empty');
      return;
    }

    try {
      const theme = determineComputedTheme();
      const pJS = window.pJSDom[0].pJS;

      if (pJS && pJS.particles) {
        const particles = pJS.particles;

        if (theme === "dark") {
          particles.color.value = '#ffffff';
          particles.line_linked.color = '#ffffff';
        } else {
          particles.color.value = '#000000';
          particles.line_linked.color = '#000000';
        }

        if (pJS.particles.array) {
          pJS.particles.array.forEach(function(p) {
            p.color.value = particles.color.value;
          });
        }
      }
    } catch (e) {
      console.error('[particle-toggle] Error applying theme:', e);
    }

    requestAnimationFrame(function() {
      console.log('[particle-toggle] Fading in particles');
      if (animate !== false) {
        container.style.transition = 'opacity 2s ease-in';
      }
      container.style.opacity = '1';
    });
  });
}

// Safe initialization that checks if button already exists
function safeInit() {
  if (document.getElementById('particle-toggle')) {
    console.log('[particle-toggle] Button already exists');
    return;
  }
  addParticleToggle();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInit);
} else {
  safeInit();
}

// Turbo support - button persists via data-turbo-permanent
document.addEventListener('turbo:load', safeInit);
