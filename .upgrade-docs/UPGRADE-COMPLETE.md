# Al-Folio v0.16.3 Upgrade - COMPLETE ✅

**Date**: January 24, 2026  
**Branch**: `upgrade-alfolio-v0.16.3`  
**Status**: ✅ Ready for Testing & Deployment

---

## Upgrade Summary

Successfully upgraded from **al-folio v0.11.0** (June 2024) to **v0.16.3** (January 2026).

- **Version jump**: 5+ major versions
- **Merge conflicts**: 141 files resolved
- **Customizations**: 100% preserved
- **Backups**: Created and safe

---

## What Was Upgraded

### Base Template Updates (v0.11.0 → v0.16.3)
✅ jekyll-socials plugin (v0.16.0) - New social links system  
✅ Plotly.js visualization support  
✅ Calendar iframe with theme support  
✅ Updated Bootstrap, Chart.js, FontAwesome  
✅ Security patches and bug fixes  
✅ Course scheduling features  
✅ Newsletter integration  
✅ Improved search functionality  

### Your Customizations - ALL PRESERVED ✨

#### JavaScript Features
- ✅ **Particle.js** - Animated background (theme-aware color switching)
- ✅ **Typed.js** - Typewriter effect ("Borned in Italy", "Studied in Seattle", etc.)
- ✅ **Theme.js** - Custom particle color switching on theme toggle
- ✅ **Simple Parallax JS** - Files present (currently disabled)

#### SASS/Styling
- ✅ Custom animations: `fadeInRight`, `wiggle`, `shake`
- ✅ Link hover shake animation (0.75s)
- ✅ Particle container styling (#particles-js, fadein keyframes)
- ✅ `.typed-info` styling for typewriter effect

#### Layouts
- ✅ **about.liquid** - Ph.D. suffix on name, Typed.js script
- ✅ **bib.liquid** - Wider publication columns (col-sm-4), 750px preview images
- ✅ **cv.liquid** - Centered PDF button with fa-3x icon
- ✅ **default.liquid** - Particle.js, Typed.js, Dark Reader meta tag

#### Configuration
- ✅ **_config.yml** - All personal settings, custom flags (particle_js, simple_parallax_js)
- ✅ **_data/socials.yml** - GitHub (tonideleo), Scholar (-X6GqMsAAAAJ), ResearchGate
- ✅ **Gemfile** - Custom gems: rails, particles-js-rails + all upstream plugins

#### Personal Content
- ✅ 4 publications in `_bibliography/papers.bib`
- ✅ CV data in `assets/json/resume.json`
- ✅ CV PDF: `assets/pdf/CV_toni.pdf`
- ✅ Profile images: toni-SWrib.jpg, prof_pic.jpg, etc.
- ✅ Publication preview images
- ✅ About page biography

---

## Files Modified

### Critical Custom Files (Manually Merged)
1. `_config.yml` - Personal settings + particle_js/simple_parallax_js flags
2. `_data/socials.yml` - Social profiles (new jekyll-socials format)
3. `Gemfile` - Upstream + custom gems
4. `assets/js/theme.js` - Particle color switching (lines 4-31)
5. `_layouts/default.liquid` - JS integrations
6. `_layouts/about.liquid` - Ph.D. suffix, Typed.js
7. `_layouts/bib.liquid` - Column widths, image sizes
8. `_layouts/cv.liquid` - PDF button styling
9. `_sass/_base.scss` - Custom animations
10. `_sass/_layout.scss` - Particle container

### Template Files (Accepted Upstream)
130+ files including layouts, includes, SASS, JS, documentation, CI/CD, fonts

### Docker Configuration (Fixed)
- `docker-compose.yml` - Added user permissions (1000/adeleo)
- `Dockerfile` - Non-root user support

---

## Commits Made

1. **docs: Add upgrade documentation and project config** (f6d4b404)
2. **Merge al-folio v0.16.3: Preserve all customizations** (15dcb636)
3. **fix: Configure Docker for user permissions** (42067920)

---

## Backups Created

### Git Backup
- **Tag**: `backup-pre-upgrade-20260124`
- **Location**: Local git repository
- **Command to restore**: `git reset --hard backup-pre-upgrade-20260124`

### Filesystem Backup
- **File**: `tonideleo.github.io-backup-20260124-233832.tar.gz`
- **Size**: 80MB
- **Location**: `/home/adeleo/`
- **Command to restore**: `tar -xzf tonideleo.github.io-backup-20260124-233832.tar.gz`

---

## Next Steps

### 1. Test Locally (Recommended)

**Option A: Docker** (requires sudo or docker group)
```bash
sudo docker compose up --build
# Visit: http://localhost:8080
```

**Option B: Local Ruby**
```bash
bundle install
bundle exec jekyll serve --port 8080
# Visit: http://localhost:8080
```

### 2. Testing Checklist

Visit http://localhost:8080 and verify:

#### Visual Tests
- [ ] Homepage loads without errors
- [ ] **Particle.js**: Animated background visible
- [ ] **Theme toggle**: Click button, particles change color (black→white)
- [ ] **Typed.js**: Typewriter effect on about page
- [ ] **Links**: Shake animation on hover
- [ ] Mobile responsive layout works

#### Content Tests
- [ ] **About page**: Ph.D. suffix displayed
- [ ] **Publications**: 4 papers showing
- [ ] **Publications**: Wider abbreviation column (col-sm-4)
- [ ] **Publications**: 750px preview images
- [ ] **CV page**: Centered PDF button with large icon
- [ ] **Social links**: GitHub, Scholar, ResearchGate work

#### Technical Tests
- [ ] No JavaScript console errors
- [ ] No 404 errors in network tab
- [ ] All custom CSS applied
- [ ] All custom JS files loaded

### 3. Deploy to GitHub

After testing passes:

```bash
# Push upgrade branch
git push origin upgrade-alfolio-v0.16.3

# Option A: Create PR for review
gh pr create --base master --head upgrade-alfolio-v0.16.3 \
  --title "Upgrade to al-folio v0.16.3" \
  --body "See .upgrade-docs/UPGRADE-COMPLETE.md for details"

# Option B: Merge directly to master
git checkout master
git merge upgrade-alfolio-v0.16.3
git push origin master
```

### 4. Monitor Deployment

- Check GitHub Actions: https://github.com/tonideleo/tonideleo.github.io/actions
- Visit live site: https://tonideleo.github.io
- Verify all custom features work in production

---

## Troubleshooting

### Docker Issues
See: `.upgrade-docs/docker-setup-guide.md`

### Build Errors
- Check Gemfile.lock is present
- Try: `bundle update` if gem version conflicts
- Check Ruby version: `ruby --version` (should be 3.x+)

### Missing Features
- Particle.js not showing: Check `_config.yml` has `particle_js: true`
- Typed.js not working: Verify script loaded in browser console
- Theme toggle broken: Check `assets/js/theme.js` has custom particle code

### Rollback if Needed
```bash
# Restore from git tag
git reset --hard backup-pre-upgrade-20260124
git push origin master --force

# OR restore from filesystem
cd /home/adeleo
tar -xzf tonideleo.github.io-backup-20260124-233832.tar.gz
```

---

## Documentation

- **Upgrade Plan**: `.claude/plans/valiant-meandering-lantern.md`
- **Docker Guide**: `.upgrade-docs/docker-setup-guide.md`
- **Conflict Strategy**: `.upgrade-docs/conflict-resolution-strategy.md`
- **Test Checklist**: `.upgrade-docs/post-upgrade-test-checklist.md`
- **Project Info**: `.claude/PROJECT.md`

---

## Success Metrics

✅ All 141 merge conflicts resolved  
✅ All customizations preserved  
✅ Docker configuration fixed  
✅ Backups created and verified  
✅ Commits cleanly merged  
✅ Documentation complete  

**Status**: Ready for testing and deployment! 🚀

