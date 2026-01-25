# Conflict Resolution Strategy

## Total Conflicts: 141

### Category 1: Personal Content (KEEP OURS - 100%)
These contain your customizations and personal data:
- _bibliography/papers.bib
- assets/json/resume.json  
- _pages/*.md (about, cv, dropdown, profiles, publications, repositories, teaching)
- _data/cv.yml
- assets/img/* (your images)
- assets/pdf/CV_toni.pdf

### Category 2: Template Documentation (ACCEPT THEIRS)
Updated template docs we don't need to customize:
- README.md, CONTRIBUTING.md, FAQ.md, INSTALL.md, CUSTOMIZE.md
- LICENSE
- .prettierignore

### Category 3: Critical Custom Files (MANUAL MERGE REQUIRED)
Files with our customizations that need careful merging:
- _config.yml (custom flags, personal settings)
- assets/js/theme.js (particle color switching)
- _layouts/default.liquid (Particle.js, Typed.js integration)
- _layouts/about.liquid (Ph.D. suffix, Typed.js)
- _layouts/bib.liquid (wider columns, 750px previews)
- _layouts/cv.liquid (centered PDF button)
- _sass/_layout.scss (particle container)
- _sass/_base.scss (custom animations)
- Gemfile (custom gems)

### Category 4: Binary Files (ACCEPT THEIRS)
Updated fonts and assets:
- assets/fonts/*.ttf, *.woff, *.woff2
- assets/webfonts/*.ttf, *.woff2

### Category 5: Template Infrastructure (ACCEPT THEIRS)
Configuration and build files:
- .github/workflows/*.yml
- .devcontainer/devcontainer.json
- Dockerfile, docker-compose.yml
- package.json, package-lock.json
- Gemfile.lock (will regenerate)
- bin/deploy, bin/entry_point.sh

### Category 6: Template Includes/Layouts (ACCEPT THEIRS, except custom ones)
Most includes are template files, accept upstream:
- _includes/*.liquid (except if we customized)
- _layouts/*.liquid (except the 4 we customized)
