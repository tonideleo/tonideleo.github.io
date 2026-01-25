# Docker Setup Guide - Fixed for v0.16.3

## Changes Made
✅ Updated `docker-compose.yml` with your user permissions (1000/adeleo)
✅ Updated `Dockerfile` to run as non-root user
✅ Committed changes to upgrade branch

## How to Run Docker

### Option 1: Add Yourself to Docker Group (Recommended)

Run these commands in your terminal:

```bash
# Add yourself to docker group
sudo usermod -aG docker $USER

# Log out and log back in, OR run:
newgrp docker

# Test it works
docker ps

# Now you can run without sudo:
docker compose up
```

### Option 2: Use Sudo with Docker

If you prefer using sudo, the password prompt is expected:

```bash
# Build and start (first time or after changes)
sudo docker compose up --build

# Start (subsequent times)
sudo docker compose up

# Stop
sudo docker compose down
```

### Option 3: Alternative - Build Locally Without Docker

If Docker isn't working, you can build locally:

```bash
# Install Ruby and Bundler
sudo apt-get install ruby-full build-essential zlib1g-dev

# Install gems
bundle install

# Run Jekyll locally
bundle exec jekyll serve --port 8080 --livereload
```

## Expected Behavior

When running `docker compose up` successfully:

1. **First time**: Docker will build the image (5-10 minutes)
   - Downloads Ruby base image
   - Installs system dependencies
   - Installs Jekyll and all gems from Gemfile
   
2. **Subsequent runs**: Starts immediately (10-30 seconds)
   - Uses cached image
   - Mounts your local files
   - Starts Jekyll server

3. **Output**: You should see:
   ```
   Server address: http://0.0.0.0:8080/
   Server running... press ctrl-c to stop.
   ```

4. **Access**: Open browser to http://localhost:8080

## Troubleshooting

### Error: "permission denied while trying to connect to Docker daemon"
**Solution**: You're not in the docker group. Use Option 1 above.

### Error: "Permission denied @ rb_sysopen - .jekyll-cache/.gitignore"
**Solution**: Already fixed in our Dockerfile and docker-compose.yml!

### Error: "unable to get image 'amirpourmand/al-folio:v0.16.3'"
**Solution**: Docker can't pull the image. Try:
```bash
sudo docker compose pull
# Then
sudo docker compose up --build
```

### Error: "port 8080 is already in use"
**Solution**: Stop the existing process:
```bash
sudo docker compose down
# OR find and kill the process
sudo lsof -i :8080
sudo kill -9 <PID>
```

## Testing Your Site

Once running, verify these features work:

- [ ] Site loads at http://localhost:8080
- [ ] **Particle.js**: Animated particles visible on homepage
- [ ] **Theme toggle**: Click theme button, particles change color
- [ ] **Typed.js**: Typewriter effect on about page ("Borned in Italy...")
- [ ] **Publications**: All 4 papers showing with wider columns
- [ ] **CV page**: Centered PDF button with large icon
- [ ] **Links**: Shake animation on hover

## Quick Commands

```bash
# Start development server
sudo docker compose up

# Rebuild after Gemfile changes
sudo docker compose up --build

# Stop server
sudo docker compose down

# View logs
sudo docker compose logs

# Clean everything and rebuild
sudo docker compose down
sudo docker system prune -a
sudo docker compose up --build
```

