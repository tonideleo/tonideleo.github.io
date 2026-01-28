(function() {
  'use strict';

  // Track if particles have been initialized this session
  let particlesInitialized = false;

  function initParticles(isInitialLoad) {
    // Check if particles should be shown based on localStorage preference
    const particlesEnabled = localStorage.getItem('particles-enabled');
    const shouldShow = particlesEnabled === null ? true : particlesEnabled === 'true';

    const container = document.getElementById('particles-js');
    if (!container) return;

    // If particles are already running and enabled, skip reinitialization
    if (particlesInitialized && window.pJSDom && window.pJSDom.length > 0) {
      // Just ensure visibility is correct
      if (shouldShow) {
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
      }
      return;
    }

    // Set initial visibility based on user preference
    if (!shouldShow) {
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      return;
    }

    // Start with opacity 0 for smooth fade-in
    container.style.opacity = '0';
    container.style.transition = '';

    // Load particles configuration
    window.particlesJS.load('particles-js', '/assets/json/particles.json', function() {
      const theme = determineComputedTheme();
      const pJS = window.pJSDom[0].pJS;
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

      particlesInitialized = true;

      // Smooth fade-in: 4s on initial load, 0.3s on navigation
      requestAnimationFrame(() => {
        if (isInitialLoad) {
          container.style.transition = 'opacity 4s ease-in';
        } else {
          container.style.transition = 'opacity 0.3s ease-in';
        }
        container.style.opacity = '1';
      });
    });
  }

  // Initial load
  document.addEventListener("DOMContentLoaded", function() {
    initParticles(true);
  });

  // Turbo navigation - particles persist via data-turbo-permanent
  // This event fires on every navigation including the initial page load
  document.addEventListener("turbo:load", function() {
    // If already initialized, particles persist - just ensure visibility
    if (particlesInitialized) {
      const container = document.getElementById('particles-js');
      const particlesEnabled = localStorage.getItem('particles-enabled');
      const shouldShow = particlesEnabled === null ? true : particlesEnabled === 'true';

      if (container && shouldShow && window.pJSDom && window.pJSDom.length > 0) {
        container.style.opacity = '1';
      }
    }
  });
})();
