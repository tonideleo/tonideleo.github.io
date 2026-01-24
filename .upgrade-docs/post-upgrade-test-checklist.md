# Post-Upgrade Test Checklist

## Visual/Functional Tests
- [ ] Homepage loads without errors
- [ ] Particle.js animation visible and smooth
- [ ] Theme toggle button works (light/dark/system)
- [ ] Particle colors change with theme (black in light, white in dark)
- [ ] Typed.js typewriter effect working on about page ("Borned in Italy", etc.)
- [ ] Profile picture displays correctly
- [ ] Publications page loads
- [ ] Publication preview images display (750px width)
- [ ] Publication abbreviation column is col-sm-4 (wider)
- [ ] CV page loads
- [ ] CV PDF button centered with fa-3x icon
- [ ] Blog page loads
- [ ] Navigation menu works (opacity 0.8)
- [ ] Links have shake animation on hover (0.75s)
- [ ] Responsive layout works on mobile

## Content Integrity Tests
- [ ] All 4 publications present in bibliography
- [ ] Personal info correct (Toni Deleo Ph.D.)
- [ ] Google Scholar link works (-X6GqMsAAAAJ)
- [ ] GitHub profile link (tonideleo)
- [ ] ResearchGate profile (Antonio-Alessandro-Deleo)
- [ ] Resume JSON data intact
- [ ] CV PDF accessible

## Build/Technical Tests
- [ ] `docker compose up` builds without errors
- [ ] No JavaScript console errors
- [ ] No 404 errors in network tab
- [ ] Jekyll build completes successfully
- [ ] All custom JS files loaded
- [ ] All custom CSS applied
- [ ] No SASS compilation errors
- [ ] GitHub Actions deployment succeeds

## Custom Feature Verification
- [ ] Particle.js library loaded (particles.js, particles.min.js)
- [ ] particle-call-function.js executes
- [ ] Custom theme.js modifications preserved
- [ ] Custom SASS animations present (fadeInRight, wiggle, shake)
- [ ] #particles-js container styling correct
- [ ] .typed-info styling applied
- [ ] Simple Parallax JS files present (but disabled)
- [ ] particles-js-rails gem loaded
