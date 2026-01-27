document.addEventListener("DOMContentLoaded", function () {
  // Check if particles should be shown based on localStorage preference
  const particlesEnabled = localStorage.getItem('particles-enabled');
  const shouldShow = particlesEnabled === null ? true : particlesEnabled === 'true';

  const container = document.getElementById('particles-js');
  if (!container) return;

  // Set initial visibility based on user preference
  if (!shouldShow) {
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    return; // Don't initialize if disabled
  }

  // Load particles configuration and set initial colors based on current theme
  window.particlesJS.load('particles-js', '/assets/json/particles.json', function() {
      console.log('callback - particles.js config loaded');

      // Set particle colors based on the current computed theme
      const theme = determineComputedTheme();
      const particles = window.pJSDom[0].pJS.particles;

      if (theme === "dark") {
          particles.color.value = '#ffffff';
          particles.line_linked.color = '#ffffff';
      } else {
          particles.color.value = '#000000';
          particles.line_linked.color = '#000000';
      }

      // Refresh particles.js settings
      window.pJSDom[0].pJS.fn.particlesRefresh();
  });
});
