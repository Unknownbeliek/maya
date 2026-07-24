---
title: Development Guide
description: Workflow for developing MAYA
---

# Development Guide

Guide for contributing to MAYA's development.

## Development Workflow

### 1. Setup Development Environment

```bash
# Clone and setup
git clone https://github.com/brainwave2026/maya.git
cd maya

# Install all dependencies
cd frontend/maya-demo && npm install
cd ../../backend && npm install
cd ../docs && npm install
```

### 2. Start Development Servers

**Backend (Terminal 1):**

```bash
cd backend
npm run dev
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
# Starts on http://localhost:5173
```

### 3. Make Changes

Edit files and see changes immediately (hot reload).

### 4. Test Changes

```bash
# Frontend tests
npm run test

# Backend tests
npm run test

# Linting
npm run lint

# Build check
npm run build
```

## Frontend Development

### Project Structure

```
frontend/maya-demo/src/
├── App.jsx                  # Main component
├── main.jsx                 # Vite entry
├── App.css                  # App styles
├── index.css                # Global styles
├── components/
│   ├── fileUploader.jsx    # File upload
│   ├── VideoPlayer.js      # Video playback
│   ├── TimeLineBadges.jsx  # Timeline UI
│   └── ...
├── hooks/
│   └── useFaceMesh.js      # Face detection hook
└── utils/
    └── fileAnalyzer.js     # Analysis logic
```

### Creating a New Component

```jsx
// components/MyComponent.jsx
import React, { useState } from 'react';

export function MyComponent({ data }) {
  const [state, setState] = useState(null);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{data.title}</h2>
      <p className="text-gray-600">{data.description}</p>
    </div>
  );
}

export default MyComponent;
```

### Using Hooks

```jsx
import { useFaceMesh } from '../hooks/useFaceMesh';

function AnalysisComponent() {
  const { landmarks, error, isProcessing } = useFaceMesh(videoElement);
  
  return (
    <div>
      {isProcessing && <p>Processing...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {landmarks && <p>Detected {landmarks.length} faces</p>}
    </div>
  );
}
```

### Styling with Tailwind

```jsx
<div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
  <h1 className="text-3xl font-bold text-white mb-4">
    MAYA Analysis
  </h1>
  <p className="text-blue-100">
    Advanced media authenticity verification
  </p>
</div>
```

## Backend Development

### Project Structure

```
backend/
├── server.js               # Express app
├── package.json            # Dependencies
├── .env                    # Configuration
├── routes/                 # API endpoints
├── models/                 # Database schemas
├── middleware/             # Express middleware
├── services/               # Business logic
└── utils/                  # Helper functions
```

### Creating a New API Endpoint

```javascript
// routes/analysis.js
import express from 'express';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { analysisResults } = req.body;
    
    // Validate input
    if (!analysisResults) {
      return res.status(400).json({ error: 'Missing data' });
    }
    
    // Process
    const result = await analyzeData(analysisResults);
    
    // Return
    res.json({
      success: true,
      result
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Adding Database Model

```javascript
// models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportId: { type: String, unique: true },
  analysisResults: Object,
  compositeScore: Number,
  createdAt: { type: Date, default: Date.now }
});

export const Report = mongoose.model('Report', reportSchema);
```

## Testing

### Frontend Tests

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

**Example test:**

```javascript
// App.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App Component', () => {
  it('renders the title', () => {
    render(<App />);
    expect(screen.getByText(/MAYA/)).toBeInTheDocument();
  });
});
```

### Backend Tests

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

**Example test:**

```javascript
// tests/analysis.test.js
import { describe, it, expect } from 'vitest';
import { analyzeMetadata } from '../services/analysis';

describe('Metadata Analysis', () => {
  it('should detect generative software', () => {
    const result = analyzeMetadata({
      Software: 'Adobe Photoshop 2024 - Generative Fill'
    });
    
    expect(result.score).toBeLessThan(100);
    expect(result.flags).toContain('GENERATIVE_FILL_DETECTED');
  });
});
```

## Code Style & Linting

### ESLint Configuration

```bash
# Run linter
npm run lint

# Fix issues automatically
npm run lint:fix
```

### Code Formatting

```bash
# Format with Prettier
npm run format

# Format check
npm run format:check
```

### Git Hooks

Pre-commit hooks automatically lint and format code:

```bash
# Installed via husky
npx husky install
```

## Debugging

### Frontend Debugging

**Browser DevTools:**

```javascript
// Open DevTools (F12)
// Go to Sources tab
// Set breakpoints
// Step through code
```

**Console Logging:**

```javascript
console.log('Analysis results:', results);
console.warn('Potential issue:', issue);
console.error('Error occurred:', error);
```

**React Developer Tools:**

- Install [React DevTools](https://react.devtools.com/)
- Inspect component tree
- Monitor state changes

### Backend Debugging

**Using Node Inspector:**

```bash
# Start with debugger
node --inspect server.js

# Open chrome://inspect in Chrome
# Click "inspect" next to process
```

**VS Code Debugging:**

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend",
      "program": "${workspaceFolder}/backend/server.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

Then press F5 to start debugging.

## Performance Profiling

### Frontend Performance

```javascript
// Performance API
const start = performance.now();
// ... code to measure ...
const end = performance.now();
console.log(`Execution time: ${end - start}ms`);
```

**Lighthouse Audit:**

1. Open DevTools
2. Go to Lighthouse tab
3. Run audit
4. Review recommendations

### Backend Performance

```bash
# Use clinic.js for profiling
npm install -g clinic

clinic doctor -- node server.js
```

## Git Workflow

### Feature Development

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Code style (no functional change)
refactor: Code refactoring
test:     Test additions/changes
chore:    Maintenance/build
```

**Example:**

```bash
git commit -m "feat: add face warping detection"
git commit -m "fix: correct sync offset calculation"
git commit -m "docs: add deployment guide"
```

## Build Process

### Frontend Build

```bash
# Production build
npm run build

# Preview build locally
npm run preview

# Check build size
npm run build --verbose
```

### Backend Build

```bash
# Check for syntax errors
npm run build

# Production start
npm start
```

## Documentation

### Updating Docs

Docs are in `/docs/docs/` in Markdown format:

```bash
# Navigate to docs
cd docs

# Start dev server
npm run dev

# Edit files in docs/
# Changes appear at http://localhost:5173
```

**Markdown format:**

```markdown
---
title: Page Title
description: Brief description
---

# Heading 1

Content here

## Heading 2

More content

```

## Environment Variables

### Frontend (.env.local)

```bash
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
VITE_ENABLE_FACE_MESH=true
```

### Backend (.env)

```bash
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/maya
```

## Useful Commands

### Frontend

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build
npm run test             # Run tests
npm run lint             # Lint code
npm run format           # Format code
```

### Backend

```bash
npm run dev              # Start with nodemon
npm start                # Production start
npm run test             # Run tests
npm run lint             # Lint code
```

### Docs

```bash
npm run dev              # Start docs server
npm run build            # Build docs
npm run serve            # Serve built docs
```

## Contributing

### Before Submitting PR

1. ✅ Code runs locally without errors
2. ✅ Tests pass (`npm test`)
3. ✅ Linting passes (`npm run lint`)
4. ✅ Documentation updated
5. ✅ Commit messages follow convention

### PR Guidelines

- Clear, descriptive title
- Reference related issues
- Explain changes in body
- Attach screenshots if UI changes
- Request review from maintainers

## Resources

- 📚 [React Docs](https://react.dev)
- 🚀 [Vite Docs](https://vitejs.dev)
- 🎨 [Tailwind Docs](https://tailwindcss.com)
- 🔍 [Express Docs](https://expressjs.com)
- 📦 [Node.js Docs](https://nodejs.org/docs)

## Next Steps

- 🚀 [Deployment Guide](/installation/deployment) - Deploy to production
- ❓ [FAQ](/faq) - Common questions
- 🤝 [Contributors](/contributors) - Meet the team
- 📝 [License](/license) - Legal terms

---

**Ready to contribute? Start with a feature branch!** Continue to [Deployment Guide](/installation/deployment).