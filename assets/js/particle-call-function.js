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

  // Start with opacity 0 for smooth fade-in
  container.style.opacity = '0';

  // Load particles configuration and set initial colors based on current theme
  window.particlesJS.load('particles-js', '/assets/json/particles.json', function() {
    // Set particle colors based on the current computed theme
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

    // Update existing particles with new colors (avoid particlesRefresh which causes pop-in)
    if (pJS.particles.array) {
      pJS.particles.array.forEach(function(p) {
        p.color.value = particles.color.value;
      });
    }

    // Trigger smooth fade-in after canvas is ready
    requestAnimationFrame(() => {
      container.style.transition = 'opacity 2s ease-in';
      container.style.opacity = '1';
    });
  });
});
