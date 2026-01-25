document.addEventListener("DOMContentLoaded", function () {
  // Load particles configuration and set initial colors based on current theme
  particlesJS.load('particles-js', '/assets/json/particles.json', function() {
      console.log('callback - particles.js config loaded');

      // Set particle colors based on the current computed theme
      const theme = determineComputedTheme();
      const particles = pJSDom[0].pJS.particles;

      if (theme === "dark") {
          particles.color.value = '#ffffff';
          particles.line_linked.color = '#ffffff';
      } else {
          particles.color.value = '#000000';
          particles.line_linked.color = '#000000';
      }

      // Refresh particles.js settings
      pJSDom[0].pJS.fn.particlesRefresh();
  });
});
