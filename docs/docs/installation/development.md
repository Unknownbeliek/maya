---
title: Development Guide
description: Workflow for developing MAYA
---

# Development Guide

Guide for developing and validating MAYA locally.

## Development Workflow

### 1. Setup Development Environment

```bash
# Clone and setup
git clone https://github.com/Unknownbeliek/maya.git
cd maya

# Install project dependencies
cd frontend/maya-demo
npm install
cd ../../backend
npm install
cd ../docs
npm install
```

### 2. Start Development Servers

**Backend (Terminal 1):**

```bash
cd backend
node server.js
# Starts on http://localhost:3000
```

**Frontend (Terminal 2):**

```bash
cd frontend/maya-demo
npm run dev
# Starts on http://localhost:5173
```

**Docs (Terminal 3, optional):**

```bash
cd docs
npm run dev
```

### 3. Make Changes

Edit source files and validate behavior in the browser.

### 4. Validate Changes

```bash
# Frontend checks
cd frontend/maya-demo
npm run lint
npm run build

# Docs check
cd ../../docs
npm run build

# Backend syntax/runtime check
cd ../backend
node server.js
```

## Frontend Development

### Project Structure

```
frontend/maya-demo/src/
├── App.jsx
├── main.jsx
├── App.css
├── index.css
├── components/
│   ├── fileUploader.jsx
│   ├── VideoPlayer.js
│   └── TimeLineBadges.jsx
├── hooks/
│   └── useFaceMesh.js
└── utils/
    └── fileAnalyzer.js
```

## Backend Development

### Project Structure

```
backend/
├── server.js
├── package.json
└── package-lock.json
```

## Testing

Automated test scripts are not configured in the current frontend or backend packages.

Use build and runtime validation instead:

```bash
# Frontend
cd frontend/maya-demo
npm run build

# Backend
cd ../../backend
node server.js
```

## Code Style & Linting

### Frontend Linting

```bash
cd frontend/maya-demo
npm run lint
```

## Debugging

### Frontend Debugging

- Open browser DevTools (F12).
- Use Console and Network tabs to verify runtime behavior.

### Backend Debugging

```bash
cd backend
node --inspect server.js
```

Then open `chrome://inspect` and attach to the Node process.

## Build Process

### Frontend Build

```bash
cd frontend/maya-demo
npm run build
npm run preview
```

### Backend Runtime

```bash
cd backend
node server.js
```

## Documentation

### Updating Docs

```bash
cd docs
npm run dev
```

## Environment Variables

No environment variables are required for the current repository state.

## Useful Commands

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
node server.js
```

### Docs

```bash
npm run dev
npm run build
npm run serve
```

## Contributing

### Before Submitting PR

1. ✅ Frontend builds successfully.
2. ✅ Docs build successfully.
3. ✅ Backend runs locally.
4. ✅ Documentation is updated when behavior changes.

### PR Guidelines

- Use a clear, descriptive title.
- Reference related issues when applicable.
- Explain behavior changes in the PR body.

## Resources

- 📚 [React Docs](https://react.dev)
- 🚀 [Vite Docs](https://vite.dev)
- 🔍 [Express Docs](https://expressjs.com)
- 📦 [Node.js Docs](https://nodejs.org/docs)

## Next Steps

- 🚀 [Deployment Guide](/installation/deployment)
- ❓ [FAQ](/faq)
- 🤝 [Contributors](/contributors)
- 📝 [License](/license)

---

**Ready to contribute?** Continue to [Deployment Guide](/installation/deployment).