---
title: Installation & Setup
description: Complete guide to installing and configuring MAYA
---

# Installation & Setup

Get MAYA running locally in just a few steps.

## System Requirements

### Minimum Requirements

- **OS**: Windows 10+, macOS 10.14+, or Linux (any modern distro)
- **CPU**: Dual-core processor (Intel/AMD)
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 2GB free space
- **Browser**: Chrome, Firefox, Safari, or Edge (recent versions)

### Recommended

- **OS**: Windows 11, macOS 12+, Ubuntu 20.04 LTS
- **CPU**: Quad-core or better
- **RAM**: 16GB
- **Disk**: SSD with 5GB free space
- **Browser**: Chrome 90+ or Edge 90+

## Prerequisites

### 1. Node.js & npm

Download and install from [nodejs.org](https://nodejs.org):

**Verify installation:**

```bash
node --version    # v16.0.0 or higher
npm --version     # 7.0.0 or higher
```

### 2. Git

Download and install from [git-scm.com](https://git-scm.com):

**Verify installation:**

```bash
git --version     # git version 2.30.0 or higher
```

### 3. MongoDB (Optional, for backend)

Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community):

**Verify installation:**

```bash
mongod --version
```

### 4. Text Editor

Use any of:
- **VS Code** (recommended) - [code.visualstudio.com](https://code.visualstudio.com)
- **WebStorm**
- **Sublime Text**
- **Vim/Neovim**

## Installation Steps

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/brainwave2026/maya.git
cd maya

# Verify directory structure
ls -la
# Output should show:
# - frontend/
# - backend/
# - docs/
# - README.md
# - LICENSE
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend
cd frontend/maya-demo

# Install dependencies
npm install

# Verify installation
npm list react vite

# Start development server
npm run dev
# Output: VITE v4.X.X ready in XXX ms
# ➜ Local:   http://localhost:5173/
```

### Step 3: Backend Setup (Optional)

```bash
# Navigate to backend (in a new terminal)
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings (see below)
nano .env

# Start backend
npm run dev
# Server running on http://localhost:3000
```

### Step 4: Access MAYA

Open your browser and navigate to:
```
`http://localhost:5173`
```

You should see the MAYA home page!

## Environment Configuration

### Frontend Environment

Create `frontend/maya-demo/.env.local`:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_FACE_MESH=true
VITE_ENABLE_AUDIO_ANALYSIS=true
VITE_ENABLE_METADATA_EXTRACTION=true

# Analytics (optional)
VITE_ANALYTICS_ENABLED=false

# Debug Mode
VITE_DEBUG=false
```

### Backend Environment

Create `backend/.env`:

```bash
# Server
PORT=3000
NODE_ENV=development
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/maya
MONGO_DB_NAME=maya_db

# Cache (Redis)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=100mb
UPLOAD_TEMP_DIR=./temp

# Logging
LOG_LEVEL=info

# Security
JWT_SECRET=your-secret-key-change-this
ALLOWED_ORIGINS=http://localhost:5173

# Analytics
ANALYTICS_ENABLED=false
```

## Project Structure

```
maya/
├── frontend/
│   └── maya-demo/
│       ├── src/
│       │   ├── App.jsx              # Main component
│       │   ├── main.jsx             # Entry point
│       │   ├── index.css            # Global styles
│       │   ├── App.css              # App styles
│       │   ├── components/
│       │   │   ├── fileUploader.jsx # File upload UI
│       │   │   ├── VideoPlayer.js   # Video playback
│       │   │   ├── TimeLineBadges.jsx # Timeline UI
│       │   │   └── ...
│       │   ├── hooks/
│       │   │   └── useFaceMesh.js   # Face detection hook
│       │   └── utils/
│       │       └── fileAnalyzer.js  # Analysis logic
│       ├── public/                  # Static assets
│       ├── index.html               # HTML template
│       ├── vite.config.js           # Vite configuration
│       ├── package.json             # Dependencies
│       └── README.md
│
├── backend/
│   ├── server.js                    # Express app
│   ├── package.json                 # Dependencies
│   ├── .env.example                 # Example env
│   └── README.md
│
└── docs/
    ├── docs/                        # VitePress content
    └── package.json
```

## Verifying Installation

### Check Frontend

```bash
# In frontend directory
cd frontend/maya-demo

# Should see no errors
npm run build

# Check output
ls -la dist/

# Output should show build artifacts
# - index.html
# - assets/
# - vite.svg
```

### Check Backend

```bash
# In backend directory
cd backend

# Test database connection
node -e "require('mongoose').connect(process.env.MONGODB_URI)" 

# Or just verify server starts
npm run dev
# Should see: "Server running on port 3000"
```

### Browser Tests

Open browser console (F12) and test:

```javascript
// Test MediaPipe loading
console.log('FaceMesh available:', typeof FaceMesh);

// Test API connectivity
fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d));
```

## Common Installation Issues

### Issue: Node version mismatch

```bash
# Solution: Use Node 16+
node --version
# Should show v16.0.0 or higher

# If not, update Node.js
# Visit nodejs.org and download latest LTS
```

### Issue: Port already in use

```bash
# Frontend (5173)
npm run dev -- --port 5174

# Backend (3000)
# Edit .env: PORT=3001
npm run dev
```

### Issue: Module not found

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear npm cache if still failing
npm cache clean --force
npm install
```

### Issue: MongoDB connection fails

```bash
# Verify MongoDB is running
mongod --version

# Start MongoDB service
# Windows: mongod (in new terminal)
# Mac: brew services start mongodb-community
# Linux: sudo service mongod start

# Check connection
mongo --version
mongo
# Should connect successfully
```

### Issue: CORS errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Ensure API URL is correctly set:

```javascript
// .env.local
VITE_API_URL=http://localhost:3000

// Verify in browser Network tab
// Should see http://localhost:3000/api/...
```

### Issue: WebGL not available

```
WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost
```

**Solution:**
- Update GPU drivers
- Try different browser
- Enable hardware acceleration in browser settings
- Check GPU compatibility

## Development Quick Start

### Running Everything

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend/maya-demo
npm run dev
```

**Terminal 3 - Docs (optional):**

```bash
cd docs
npm run dev
```

Then open `http://localhost:5173` in your browser

### File Structure Reference

When you edit files, here's what happens:

```
src/App.jsx (edit)
  ↓
Vite detects change (hot reload)
  ↓
Browser automatically refreshes (~100ms)
  ↓
Changes visible immediately
```

## Next Steps

- 💻 [Development Guide](/installation/development) - Development workflow
- 🚀 [Deployment Guide](/installation/deployment) - Deploy to production
- ❓ [FAQ](/faq) - Common questions
- 🤝 [Contributing](/contributors) - Help improve MAYA

---

**Installation complete! You're ready to start developing.** Continue to [Development Guide](/installation/development).