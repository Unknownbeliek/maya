---
title: Deployment Guide
description: Deploy MAYA to production
---

# Deployment Guide

Deployment guidance for the current MAYA repository layout.

## Architecture Overview

Current repository components:

- Frontend: `frontend/maya-demo` (Vite + React static build)
- Backend: `backend/server.js` (Express server)
- Docs: `docs` (VitePress)

## Frontend Deployment

### Build

```bash
cd frontend/maya-demo
npm install
npm run build
```

Build output is generated in `frontend/maya-demo/dist`.

### Host Options

The frontend build can be deployed to any static host (for example Vercel, Netlify, or GitHub Pages).

## Backend Deployment

### Install and Run

```bash
cd backend
npm install
node server.js
```

The current backend listens on port `3000` (hardcoded in `backend/server.js`).

### Managed Platform Note

If your hosting platform requires dynamic ports, update `backend/server.js` accordingly before deployment.

## Production Build

### Frontend Build

```bash
cd frontend/maya-demo
npm run build
```

### Backend Runtime Check

```bash
cd backend
node server.js
```

## Monitoring & Logging

For the current backend, verify runtime health by checking:

- Process status in your hosting platform
- Startup log: `Example app listening on port 3000`
- HTTP response on `/`

## Production Checklist

- [ ] Frontend dependencies installed
- [ ] Frontend build succeeds (`npm run build`)
- [ ] Backend dependencies installed
- [ ] Backend starts successfully (`node server.js`)
- [ ] Public repository URL points to [Unknownbeliek/maya](https://github.com/Unknownbeliek/maya)
- [ ] Documentation links resolve correctly

## Rollback Procedures

```bash
git revert <commit-hash>
git push origin main
```

## Next Steps

- ❓ [FAQ](/faq)
- 🤝 [Contributors](/contributors)
- 📝 [License](/license)
- 📖 [Tech Stack](/reference/tech-stack)

---

**Deployment baseline validated.** Continue to [FAQ](/faq) for common questions.