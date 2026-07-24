---
title: Deployment Guide
description: Deploy MAYA to production
---

# Deployment Guide

Complete guide to deploying MAYA to production.

## Architecture Overview

```
┌──────────────┐
│  Vercel CDN  │ Frontend
└───────┬──────┘
        │
    HTTPS
        │
┌───────▼──────────────────────────┐
│  Load Balancer (Optional)        │
└───────┬────────────────────────┬─┘
        │                        │
  ┌─────▼──┐             ┌──────▼──┐
  │ Render │             │ Railway │
  │ Backend│             │ Backend │
  └─────┬──┘             └──────┬──┘
        │                       │
        └───────────┬───────────┘
                    │
            ┌───────▼───────┐
            │    MongoDB    │
            │   Atlas       │
            └───────────────┘
```

## Frontend Deployment (Vercel)

### Prerequisites

- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub account with repository pushed

### Step 1: Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Find your `maya` repository
4. Click "Import"

### Step 2: Configure Project

```
Project name: maya
Framework: Vite
Root directory: frontend/maya-demo
```

### Step 3: Environment Variables

Add to Vercel dashboard:

```bash
VITE_API_URL=https://maya-api.onrender.com
VITE_ANALYTICS_ENABLED=true
```

### Step 4: Deploy

```bash
# Vercel automatically deploys on git push
git push origin main

# Or deploy manually
npm install -g vercel
vercel deploy
```

**Result:**
- URL: `maya.vercel.app` (custom domain available)
- SSL: Automatic HTTPS
- CDN: Global edge network

### Optimization

**vercel.json:**

```json
{
  "buildCommand": "cd frontend/maya-demo && npm run build",
  "outputDirectory": "frontend/maya-demo/dist",
  "env": {
    "VITE_API_URL": "@api_url"
  },
  "functions": {
    "api/**": {
      "memory": 512,
      "maxDuration": 60
    }
  }
}
```

## Backend Deployment (Render or Railway)

### Option 1: Render

#### Step 1: Connect Repository

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click "Create" → "Web Service"
3. Connect GitHub repository
4. Select `maya/backend`

#### Step 2: Configure

```
Name: maya-api
Environment: Node
Build command: npm install
Start command: npm start
Instance type: Standard (starter recommended for MVP)
```

#### Step 3: Environment Variables

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/maya
REDIS_URL=redis://:password@redis-host:6379
CORS_ORIGIN=https://maya.vercel.app
NODE_ENV=production
```

#### Step 4: Deploy

```bash
git push origin main
# Render auto-deploys
```

**Result:**
- URL: `maya-api.onrender.com`
- SSL: Automatic HTTPS
- Auto-scaling: Available

### Option 2: Railway

#### Step 1: Connect Repository

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose repository

#### Step 2: Configure

```
Root directory: backend
```

#### Step 3: Environment Variables

Set in Railway dashboard

#### Step 4: Deploy

```bash
# Railway CLI
npm install -g @railway/cli
railway login
railway init
railway deploy
```

## Database Setup

### MongoDB Atlas (Cloud)

#### Step 1: Create Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster

#### Step 2: Configure

```
Cluster name: maya-production
Provider: AWS (or your preference)
Region: us-east-1
Cluster tier: M0 (free, good for MVP)
```

#### Step 3: Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Set username and password
4. Copy connection string

#### Step 4: Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/maya
```

Add to backend `.env`:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maya
```

#### Step 5: Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Add current IP or `0.0.0.0/0` (less secure)

### Redis Cloud (Cache)

#### Step 1: Create Account

1. Go to [redis.com/cloud](https://redis.com/cloud)
2. Create free account
3. Create new database

#### Step 2: Get Connection String

```
redis://default:password@host:port
```

Add to `.env`:

```bash
REDIS_URL=redis://default:password@host:port
```

## Production Build

### Frontend Build

```bash
cd frontend/maya-demo

# Build for production
npm run build

# Check output size
ls -lh dist/

# Should see:
# - dist/index.html
# - dist/assets/
```

### Backend Build

```bash
cd backend

# Install production dependencies only
npm install --production

# Test production mode
NODE_ENV=production npm start
```

## SSL/TLS Certificate

### Automatic (Recommended)

- **Vercel**: Automatic
- **Render**: Automatic
- **Railway**: Automatic

### Manual (Self-hosted)

Use [Let's Encrypt](https://letsencrypt.org):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d maya.example.com

# Update nginx config
sudo vi /etc/nginx/sites-available/default

# Add SSL configuration
ssl_certificate /etc/letsencrypt/live/maya.example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/maya.example.com/privatekey.pem;

# Reload nginx
sudo systemctl reload nginx
```

## Monitoring & Logging

### Vercel Monitoring

1. Dashboard → Deployments
2. Click deployment → Logs
3. Search for errors

### Backend Logging

```javascript
// server.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
```

### Error Tracking

```javascript
import Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.errorHandler());
```

## Performance Optimization

### Frontend Optimization

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'mediapipe': ['@mediapipe/face_mesh'],
          'vendor': ['react', 'react-dom']
        }
      }
    }
  }
}
```

### Backend Optimization

```javascript
// Use compression
import compression from 'compression';
app.use(compression());

// Connection pooling
const pool = mongoose.connection.openUri(mongoUrl, {
  maxPoolSize: 10,
  minPoolSize: 5
});

// Caching
import redis from 'redis';
const cache = redis.createClient();
```

## Scaling Strategy

### Horizontal Scaling

```
┌─────────────────┐
│ DNS / Load      │
│ Balancer        │
└────────┬────────┘
         │
    ┌────┼────┐
    │    │    │
┌───▼┐ ┌▼──┐ ┌▼──┐
│API1│ │API│ │API│
│    │ │ 2 │ │ 3 │
└────┘ └───┘ └───┘
    │    │    │
    └────┼────┘
         │
    ┌────▼───┐
    │Database│
    │ Replica│
    └────────┘
```

### Auto-Scaling Rules

```yaml
# Render/Railway scaling
CPU Threshold: >70% → Scale up
Memory Threshold: >80% → Scale up
Min Instances: 1
Max Instances: 5
Scale-down cooldown: 10 minutes
```

## Backup Strategy

### Database Backups

```bash
# MongoDB Atlas automatic backups
# Enabled by default
# Retention: 30 days (free tier)
# Backup frequency: Every 6 hours

# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster/maya"
```

### Configuration Backups

```bash
# Store .env files securely
git-crypt lock  # Encrypt sensitive files
git add .env    # Commit encrypted
git push origin main
```

## Monitoring & Uptime

### Uptime Monitoring

Use [UptimeRobot](https://uptimerobot.com):

1. Create account
2. Add monitors:
   - `https://maya.vercel.app`
   - `https://maya-api.onrender.com/health`
3. Get alerts if down

### Performance Monitoring

```javascript
// New Relic integration
import newrelic from 'newrelic';

// Automatically tracks:
// - Response times
// - Error rates
// - Database queries
// - CPU usage
```

## Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render/Railway
- [ ] Database configured (MongoDB Atlas)
- [ ] Cache configured (Redis)
- [ ] Environment variables set
- [ ] SSL certificates active
- [ ] Domain configured
- [ ] CORS properly configured
- [ ] Analytics enabled
- [ ] Error tracking setup (Sentry)
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Documentation updated
- [ ] Security headers configured

### Security Headers

```javascript
// Helmet.js
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:']
  }
}));
```

## Rollback Procedures

### Frontend Rollback

```bash
# Vercel automatic rollback
# Dashboard → Deployments → Click previous → Redeploy

# Or manual:
git revert <commit-hash>
git push origin main
```

### Backend Rollback

```bash
# Railway/Render
# Dashboard → Deployments → Select previous → Redeploy

# Or via CLI:
railway rollback
```

## Zero-Downtime Deployment

### Strategy

```
1. Deploy new version to staging
2. Run smoke tests
3. Gradually shift traffic (canary deployment)
4. Monitor metrics
5. Complete migration
6. Keep old version ready for 5 minutes
```

### Implementation

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
  
  // Stop accepting new connections
  // Wait for existing requests to complete
  // Close database connections
  // Exit after timeout
  setTimeout(() => process.exit(1), 30000);
});
```

## Next Steps

- ❓ [FAQ](/faq) - Common questions
- 🤝 [Contributors](/contributors) - Meet the team
- 📝 [License](/license) - Legal terms
- 📖 [Tech Stack](/reference/tech-stack) - Technologies used

---

**MAYA is now in production!** Continue to [FAQ](/faq) for common questions.