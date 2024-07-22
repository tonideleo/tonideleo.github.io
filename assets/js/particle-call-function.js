document.addEventListener("DOMContentLoaded", function () {
  // Function to determine the user's system theme preference
  const getSystemTheme = () => {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
      }
      return "light";
  };

  // Load and modify particles configuration based on the system theme
  particlesJS.load('particles-js', '/assets/json/particles.json', function() {
      console.log('callback - particles.js config loaded');
      
      // Modify particle colors based on the theme
      const theme = getSystemTheme();
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
