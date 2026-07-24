---
title: Contributors
description: Meet the MAYA team and our community
---

# Contributors

MAYA is built by a passionate team of developers, researchers, and open-source enthusiasts.

## Core Team

### Founders & Lead Developers

**MAYA was built for BrainWave 2026 Hackathon**

The core team consists of experienced software engineers specializing in:
- Machine learning and computer vision
- Privacy-first architecture
- Open-source development
- Digital forensics

### Key Roles

| Role | Focus | Expertise |
|------|-------|-----------|
| **Architecture** | System design, scalability | Full-stack engineering |
| **Forensics** | Detection algorithms | ML, signal processing |
| **Frontend** | UI/UX, interactivity | React, WebGL |
| **Backend** | API, infrastructure | Node.js, databases |
| **Research** | Deepfake patterns | AI, computer vision |
| **Documentation** | Guides, technical writing | Documentation |

## Contributing to MAYA

### How to Contribute

We welcome contributions in all forms:

#### 1. Code Contributions

```bash
# Fork the repository
git clone https://github.com/YOUR-USERNAME/maya.git

# Create feature branch
git checkout -b feature/your-feature

# Make changes
# ... write code ...

# Test
npm run test

# Lint
npm run lint

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature/your-feature

# Create Pull Request on GitHub
```

**Requirements:**
- ✅ Tests passing
- ✅ Linting passes
- ✅ Documentation updated
- ✅ Descriptive PR title

#### 2. Documentation

Help improve MAYA's documentation:

- Fix typos and clarifications
- Improve explanations
- Add examples
- Create guides
- Translate content

```bash
cd docs
npm run dev
# Edit .md files in docs/docs/
# Changes appear immediately
```

#### 3. Bug Reports

Found a bug? Help us fix it!

**Create an issue:**
1. Clear title
2. Step-by-step reproduction
3. Expected behavior
4. Actual behavior
5. Browser/OS info
6. Relevant logs/screenshots

**Bug bounty:** First reporter of valid security vulnerability gets recognition + potential compensation.

#### 4. Feature Suggestions

Have an idea?

**Suggest a feature:**
1. Check existing issues first
2. Clear description of use case
3. Why it's needed
4. Implementation ideas (optional)
5. Priority level

#### 5. Research & Papers

Contribute deepfake detection research:

- Publish findings using MAYA
- Share datasets
- Collaborate on research
- Peer review

#### 6. Community Support

Help other users:

- Answer questions in issues
- Provide examples
- Share your experience
- Review PRs

### Development Setup

```bash
# Clone repository
git clone https://github.com/brainwave2026/maya.git
cd maya

# Install all dependencies
npm install --workspaces

# Start development servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend/maya-demo && npm run dev

# Terminal 3: Docs
cd docs && npm run dev
```

### Code Style

**Follow conventions:**

```bash
# Format code
npm run format

# Lint check
npm run lint

# Run tests
npm run test
```

**Commit messages:**

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: formatting changes
refactor: code reorganization
test: add/update tests
chore: maintenance tasks
```

### PR Guidelines

1. **Before submitting:**
   - Tests passing: `npm run test`
   - Linting: `npm run lint`
   - Build succeeds: `npm run build`
   - Documentation updated

2. **PR description:**
   - Clear title
   - Why this change
   - What it does
   - Screenshots (if UI changes)
   - Reference issues: `Fixes #123`

3. **Review process:**
   - Automated checks run
   - Code review by maintainers
   - Address feedback
   - Approval and merge

## Recognition

### Contributors Hall of Fame

We recognize all contributors:

**Top Contributors (2026):**
- 🥇 [Contributor profiles will appear here]
- 🥈 [As project grows]
- 🥉 [Community builds]

**How to get recognized:**
- Make valuable contributions
- Help community
- Improve documentation
- Report bugs effectively

### Credits

**Special thanks to:**

- **Google MediaPipe** - Face mesh detection
- **Mozilla** - Web Audio API development
- **W3C** - Web standards
- **Open Source Community** - Dependencies and support
- **BrainWave 2026** - Hackathon sponsorship

## Communication

### Community Channels

**GitHub Issues:**
- Bug reports
- Feature requests
- Questions
- Discussions

**GitHub Discussions:**
- General questions
- Ideas
- Announcements
- Show & tell

**Email:**
- security@maya.example.com (Security issues)
- contact@maya.example.com (General inquiries)

### Conduct & Values

MAYA embraces:

✅ **Inclusivity**
- Welcome all backgrounds
- No discrimination
- Diverse perspectives valued
- Safe space

✅ **Transparency**
- Open communication
- Clear decisions
- Public roadmap
- Community input

✅ **Excellence**
- High code quality
- Thorough testing
- Rigorous review
- Continuous improvement

✅ **Ethics**
- Privacy-first
- Responsible AI
- Legal compliance
- Transparency

### Code of Conduct

**In interactions with other contributors:**

✅ **DO:**
- Be respectful
- Listen actively
- Give constructive feedback
- Welcome newcomers
- Attribute credit
- Assume good intent

❌ **DON'T:**
- Harass or discriminate
- Use demeaning language
- Make personal attacks
- Spam or spam-like behavior
- Violate others' privacy
- Flamewars or trolling

**Violations:** Report to conduct@maya.example.com

## Getting Started as Contributor

### Step 1: Pick a Task

Look for issues labeled:

- `good-first-issue` - Easy entry points
- `help-wanted` - Need assistance
- `documentation` - Docs improvements
- `bug` - Bug fixes
- `feature` - New features

### Step 2: Fork & Setup

```bash
# Fork on GitHub UI

# Clone your fork
git clone https://github.com/YOUR-USERNAME/maya.git
cd maya

# Add upstream
git remote add upstream https://github.com/brainwave2026/maya.git

# Install & setup
npm install --workspaces
```

### Step 3: Create Branch

```bash
# Update from upstream
git fetch upstream
git rebase upstream/main

# Create feature branch
git checkout -b fix/issue-description
```

### Step 4: Make Changes

```bash
# Edit files
# Add tests
# Update docs

# Test locally
npm run test
npm run lint
```

### Step 5: Commit & Push

```bash
# Commit with conventional message
git commit -m "fix: correct sync offset calculation"

# Push to your fork
git push origin fix/issue-description
```

### Step 6: Create PR

1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in description
5. Reference any issues
6. Submit

### Step 7: Respond to Review

- Check feedback
- Update code if needed
- Push updates
- Comment with progress

## Contributor Rewards

### Recognition

- Listed in CONTRIBUTORS file
- GitHub contributor badge
- Mention in release notes
- Featured in documentation

### Community

- Direct access to maintainers
- Private Slack channel (coming soon)
- Exclusive events
- First access to features

### Bounties

- Security vulnerability bounties
- Major feature bounties
- Research grants
- Speaking opportunities

## Resources for Contributors

### Getting Help

- 📖 [Documentation](/guide/introduction)
- 🏗️ [Architecture Guide](/architecture/overview)
- 🛠️ [Development Guide](/installation/development)
- ❓ [FAQ](/faq)

### Learning Resources

- [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [React Documentation](https://react.dev)
- [Node.js Guide](https://nodejs.org/docs)
- [Git Guide](https://git-scm.com/docs)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

### Tools

- **Editor:** [VS Code](https://code.visualstudio.com)
- **Git:** [GitHub Desktop](https://desktop.github.com)
- **Testing:** [Vitest](https://vitest.dev)
- **Linting:** [ESLint](https://eslint.org)
- **Formatting:** [Prettier](https://prettier.io)

## Project Stats

```
Lines of Code: ~15,000+
Languages: JavaScript, React, Node.js
Test Coverage: 80%+
Dependencies: Carefully curated
Community: Growing!
```

## Vision

MAYA strives to:

🎯 **Democratize forensics** - Make detection accessible to all

🎯 **Empower users** - Understand why media is suspicious

🎯 **Protect privacy** - Keep your data private

🎯 **Enable research** - Open source for academic study

🎯 **Combat misinformation** - Verify media authenticity

🎯 **Stay ethical** - Responsible AI development

## Next Steps

**Ready to contribute?**

1. Read [Contributing Guide](https://github.com/brainwave2026/maya/blob/main/CONTRIBUTING.md)
2. Browse [Good First Issues](https://github.com/brainwave2026/maya/issues?q=label:%22good%20first%20issue%22)
3. Setup development environment
4. Create PR!

## Questions?

- 💬 [GitHub Discussions](https://github.com/brainwave2026/maya/discussions)
- 📧 [Email us](mailto:contact@maya.example.com)
- 🐛 [Report issues](https://github.com/brainwave2026/maya/issues)

---

**Thank you for making MAYA better!** 🙏