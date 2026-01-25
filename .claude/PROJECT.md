# tonideleo.github.io - Al-Folio Upgrade Project

## Project Overview
Personal academic portfolio website based on al-folio Jekyll theme.
- **Owner:** Toni Deleo (Antonio Alessandro Deleo)
- **Stack:** Jekyll, Ruby, Docker
- **Repository:** https://github.com/tonideleo/tonideleo.github.io

## Upgrade Mission
- **Current:** al-folio v0.11.0 (June 2024)
- **Target:** al-folio v0.16.3 (January 2026)
- **Scope:** 7+ months of upstream changes, 5+ major versions

## Critical Customizations to Preserve

### JavaScript Features
1. **Particle.js** - Animated background with theme-aware color switching
   - `assets/js/particles.js`, `particle-call-function.js`, `particles.json`
   - Integration in `_layouts/default.liquid`
   - Config flag: `particle_js: true` in `_config.yml`

2. **Typed.js** - Typewriter effect on about page
   - CDN loaded in `_layouts/default.liquid`
   - Implementation in `_layouts/about.liquid`
   - Strings: "Borned in Italy", "Studied in Seattle", etc.

3. **Theme.js** - Custom particle color switching
   - `assets/js/theme.js` lines 4-29
   - Black particles (light mode), white (dark mode)

### SASS Customizations
1. **Custom Animations** (`_sass/_base.scss`)
   - `@keyframes fadeInRight`, `wiggle`, `shake`
   - Link hover shake animation

2. **Particle Container** (`_sass/_layout.scss`)
   - `#particles-js` fixed container with fadein
   - Fadein keyframes

### Layout Modifications
- `_layouts/about.liquid`: Ph.D. suffix, Typed.js
- `_layouts/bib.liquid`: col-sm-4 (wider), 750px previews
- `_layouts/cv.liquid`: Centered PDF button, fa-3x icon
- `_layouts/default.liquid`: Dark Reader meta, Particle.js/Typed.js

### Configuration
- `_config.yml`: particle_js, simple_parallax_js flags, scholar settings
- `Gemfile`: particles-js-rails, rails gems

### Personal Content (NEVER OVERWRITE)
- `_pages/about.md` - Personal biography
- `_bibliography/papers.bib` - 4 publications
- `assets/json/resume.json` - CV data
- `assets/pdf/CV_toni.pdf` - CV PDF
- Profile images: `toni-SWrib.jpg`, `prof_pic.jpg`, etc.
- Publication previews: `assets/img/publication_preview/*.png`

## Development Commands

```bash
# Start local development
docker compose up

# Stop development server
docker compose down

# Rebuild from scratch
docker compose build --no-cache

# Run Jekyll build
docker compose run --rm app bundle exec jekyll build

# Install/update gems
docker compose run --rm app bundle install

# Git status
git status

# View current branch
git branch
```

## Testing Checklist

After upgrade, verify:
- [ ] Site builds without errors
- [ ] Particle.js animation visible and smooth
- [ ] Theme toggle changes particle colors (black→white)
- [ ] Typed.js typewriter effect on about page
- [ ] All 4 publications display
- [ ] Links have shake animation on hover
- [ ] Publications have wider columns (col-sm-4)
- [ ] Publication previews at 750px
- [ ] CV PDF button centered with fa-3x icon
- [ ] Ph.D. suffix on name
- [ ] No console errors
- [ ] Mobile responsive works

## Upgrade Strategy

1. **Backup:** Git tag + filesystem backup
2. **Merge:** Use merge (not rebase) for complex customizations
3. **Conflicts:** Resolve systematically in priority order
4. **Testing:** After each critical file resolution
5. **Deploy:** Branch first, then master
6. **Rollback:** Backup tag ready if needed

## Critical Files for Merge Conflicts

Expected conflicts in:
1. `_config.yml` - Personal settings + custom flags
2. `assets/js/theme.js` - Particle color switching
3. `_layouts/default.liquid` - JS integrations
4. `_sass/_layout.scss` - Particle container
5. `_sass/_base.scss` - Custom animations
6. `Gemfile` - Custom gems
7. `_layouts/about.liquid`, `bib.liquid`, `cv.liquid`

## Documentation

- Upgrade plan: `.claude/plans/valiant-meandering-lantern.md`
- Upgrade docs: `.upgrade-docs/` (created during upgrade)
- Customizations: Will create `CUSTOMIZATIONS.md` post-upgrade
