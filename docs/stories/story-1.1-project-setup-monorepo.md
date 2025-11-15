# Story 1.1: Project Setup & Monorepo Infrastructure

**Story ID:** STORY-1.1  
**Epic:** Epic 1 - Foundation & Core Tracking Infrastructure  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** developer  
**I want** the monorepo configured with all necessary projects and tooling  
**So that** I can develop across frontend, backend, and extension with consistent standards

---

## Business Value

This story establishes the technical foundation for the entire project. Without proper monorepo setup, development will be slow, inconsistent, and error-prone. This enables:
- Fast onboarding of new developers
- Consistent code quality across all packages
- Shared code and types between frontend/backend/extension
- Automated quality checks via CI/CD

---

## Acceptance Criteria

### ✅ AC1: Monorepo Structure Created
- [ ] Monorepo initialized with pnpm workspaces
- [ ] Directory structure includes: `packages/api`, `packages/web`, `packages/extension`, `packages/shared`
- [ ] Root package.json configured with workspace declarations
- [ ] Each package has its own package.json with proper name and dependencies

### ✅ AC2: TypeScript Configuration
- [ ] Root tsconfig.json created with strict mode enabled
- [ ] Each package extends root tsconfig with package-specific overrides
- [ ] Shared types package configured for cross-package type sharing
- [ ] TypeScript compiles successfully across all packages

### ✅ AC3: Code Quality Tools
- [ ] ESLint configured with consistent rules across all packages
- [ ] Prettier configured with formatting rules
- [ ] Both tools work from root and individual packages
- [ ] Pre-commit hooks optional but recommended for MVP

### ✅ AC4: Workspace Scripts
- [ ] `pnpm dev` starts all packages in development mode
- [ ] `pnpm build` builds all packages
- [ ] `pnpm test` runs tests across all packages
- [ ] `pnpm lint` lints all packages

### ✅ AC5: Version Control Setup
- [ ] Git repository initialized
- [ ] .gitignore excludes node_modules, dist, .env, build artifacts
- [ ] Initial commit with project structure

### ✅ AC6: CI/CD Pipeline
- [ ] GitHub Actions workflow file created (.github/workflows/ci.yml)
- [ ] Workflow runs on push to main and pull requests
- [ ] Workflow steps: checkout, install deps, lint, typecheck
- [ ] Workflow passes on sample code

### ✅ AC7: Documentation
- [ ] README.md created with project overview
- [ ] Setup instructions documented (prerequisites, installation, running)
- [ ] Project structure explained
- [ ] Contribution guidelines included

### ✅ AC8: Environment Configuration
- [ ] .env.example file created with required variables
- [ ] Environment variables documented in README
- [ ] Each package can access env vars appropriately

---

## Requirements Traceability

**PRD Coverage:**
- **Foundational Story:** Enables all functional requirements by establishing development infrastructure
- **NFR1:** Supports <5 minute time-to-first-tracked-email through efficient development workflow
- **Technical Foundation:** Required for all Epic 1-10 implementation

**Architecture References:**
- Tech Stack: TypeScript, Node.js, React, Next.js (monorepo structure)
- Development Standards: Consistent tooling, linting, formatting across all packages
- CI/CD Strategy: GitHub Actions for quality checks

---

## Testing Strategy

**Test Approach:**
- **Setup Testing:** Verification that monorepo structure is correct and functional
- **Integration Testing:** Ensure all packages can communicate and share code
- **CI/CD Testing:** Verify automated quality checks run successfully

**Success Metrics:**
- Fresh clone to running project: < 5 minutes
- All quality checks pass: lint, typecheck, build
- CI pipeline executes successfully on first push

**Testing Tools:**
- ESLint for code quality verification
- TypeScript compiler for type checking
- GitHub Actions for CI automation

---

## Developer Implementation Checklist

### Phase 1: Initialize Monorepo (30 min)

- [ ] **Step 1.1:** Create project root directory
  ```bash
  mkdir ai-email-tracker
  cd ai-email-tracker
  ```

- [ ] **Step 1.2:** Initialize pnpm workspace
  ```bash
  pnpm init
  ```

- [ ] **Step 1.3:** Create pnpm-workspace.yaml
  ```yaml
  packages:
    - 'packages/*'
  ```

- [ ] **Step 1.4:** Create package directories
  ```bash
  mkdir -p packages/api packages/web packages/extension packages/shared
  ```

- [ ] **Step 1.5:** Initialize each package
  ```bash
  cd packages/api && pnpm init
  cd ../web && pnpm init
  cd ../extension && pnpm init
  cd ../shared && pnpm init
  ```

### Phase 2: Configure TypeScript (45 min)

- [ ] **Step 2.1:** Install TypeScript at root
  ```bash
  pnpm add -D -w typescript @types/node
  ```

- [ ] **Step 2.2:** Create root tsconfig.json
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "ESNext",
      "lib": ["ES2020"],
      "moduleResolution": "node",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "resolveJsonModule": true,
      "declaration": true,
      "declarationMap": true,
      "sourceMap": true
    }
  }
  ```

- [ ] **Step 2.3:** Create tsconfig.json for packages/api
  ```json
  {
    "extends": "../../tsconfig.json",
    "compilerOptions": {
      "outDir": "./dist",
      "rootDir": "./src",
      "module": "CommonJS"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
  }
  ```

- [ ] **Step 2.4:** Create tsconfig.json for packages/web
  ```json
  {
    "extends": "../../tsconfig.json",
    "compilerOptions": {
      "jsx": "preserve",
      "lib": ["DOM", "DOM.Iterable", "ES2020"],
      "module": "ESNext",
      "outDir": "./dist",
      "rootDir": "./src"
    },
    "include": ["src/**/*", "next-env.d.ts"],
    "exclude": ["node_modules", ".next", "dist"]
  }
  ```

- [ ] **Step 2.5:** Create tsconfig.json for packages/extension
  ```json
  {
    "extends": "../../tsconfig.json",
    "compilerOptions": {
      "jsx": "react",
      "lib": ["DOM", "ES2020"],
      "outDir": "./dist",
      "rootDir": "./src"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
  }
  ```

- [ ] **Step 2.6:** Create tsconfig.json for packages/shared
  ```json
  {
    "extends": "../../tsconfig.json",
    "compilerOptions": {
      "outDir": "./dist",
      "rootDir": "./src",
      "declaration": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
  }
  ```

- [ ] **Step 2.7:** Test TypeScript compilation
  ```bash
  pnpm exec tsc --noEmit
  ```

### Phase 3: Configure Linting & Formatting (30 min)

- [ ] **Step 3.1:** Install ESLint and Prettier at root
  ```bash
  pnpm add -D -w eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
  ```

- [ ] **Step 3.2:** Create .eslintrc.json
  ```json
  {
    "parser": "@typescript-eslint/parser",
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier"
    ],
    "plugins": ["@typescript-eslint"],
    "env": {
      "node": true,
      "es6": true
    },
    "rules": {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off"
    }
  }
  ```

- [ ] **Step 3.3:** Create .prettierrc.json
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2
  }
  ```

- [ ] **Step 3.4:** Create .prettierignore
  ```
  node_modules
  dist
  .next
  build
  coverage
  ```

- [ ] **Step 3.5:** Test linting
  ```bash
  pnpm exec eslint . --ext .ts,.tsx
  ```

### Phase 4: Configure Workspace Scripts (20 min)

- [ ] **Step 4.1:** Update root package.json with scripts
  ```json
  {
    "scripts": {
      "dev": "pnpm -r --parallel dev",
      "build": "pnpm -r build",
      "test": "pnpm -r test",
      "lint": "eslint . --ext .ts,.tsx",
      "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
      "typecheck": "tsc --noEmit"
    }
  }
  ```

- [ ] **Step 4.2:** Add placeholder scripts to each package
  - packages/api/package.json: `"dev": "echo 'API dev mode'"`
  - packages/web/package.json: `"dev": "echo 'Web dev mode'"`
  - packages/extension/package.json: `"dev": "echo 'Extension dev mode'"`

- [ ] **Step 4.3:** Test workspace scripts
  ```bash
  pnpm lint
  pnpm typecheck
  pnpm dev
  ```

### Phase 5: Version Control Setup (15 min)

- [ ] **Step 5.1:** Initialize Git
  ```bash
  git init
  ```

- [ ] **Step 5.2:** Create .gitignore
  ```
  # Dependencies
  node_modules/
  .pnpm-store/

  # Build outputs
  dist/
  build/
  .next/
  out/

  # Environment
  .env
  .env.local
  .env.*.local

  # IDE
  .vscode/
  .idea/
  *.swp
  *.swo
  *~

  # OS
  .DS_Store
  Thumbs.db

  # Logs
  *.log
  npm-debug.log*

  # Testing
  coverage/
  .nyc_output/
  ```

- [ ] **Step 5.3:** Initial commit
  ```bash
  git add .
  git commit -m "chore: initial project setup with monorepo structure"
  ```

### Phase 6: CI/CD Pipeline Setup (45 min)

- [ ] **Step 6.1:** Create .github/workflows directory
  ```bash
  mkdir -p .github/workflows
  ```

- [ ] **Step 6.2:** Create .github/workflows/ci.yml
  ```yaml
  name: CI

  on:
    push:
      branches: [main, develop]
    pull_request:
      branches: [main, develop]

  jobs:
    quality:
      name: Code Quality Checks
      runs-on: ubuntu-latest
      
      steps:
        - name: Checkout code
          uses: actions/checkout@v3
        
        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18'
        
        - name: Setup pnpm
          uses: pnpm/action-setup@v2
          with:
            version: 8
        
        - name: Get pnpm store directory
          id: pnpm-cache
          shell: bash
          run: |
            echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
        
        - name: Setup pnpm cache
          uses: actions/cache@v3
          with:
            path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
            key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
            restore-keys: |
              ${{ runner.os }}-pnpm-store-
        
        - name: Install dependencies
          run: pnpm install --frozen-lockfile
        
        - name: Lint
          run: pnpm lint
        
        - name: Type check
          run: pnpm typecheck
        
        - name: Build
          run: pnpm build
  ```

- [ ] **Step 6.3:** Test CI workflow locally (if possible with act)
  ```bash
  # Optional: Install act and test locally
  act -j quality
  ```

- [ ] **Step 6.4:** Commit CI configuration
  ```bash
  git add .github/workflows/ci.yml
  git commit -m "ci: add GitHub Actions workflow for quality checks"
  ```

### Phase 7: Documentation (30 min)

- [ ] **Step 7.1:** Create comprehensive README.md
  ```markdown
  # AI Email Tracker - Email Tracking & Campaign Manager
  
  ## Project Overview
  Email tracking platform with Chrome extension, web dashboard, and AI-powered features.
  
  ## Tech Stack
  - **Monorepo:** pnpm workspaces
  - **Language:** TypeScript
  - **Backend:** Node.js (packages/api)
  - **Frontend:** Next.js React (packages/web)
  - **Extension:** Chrome Extension (packages/extension)
  - **Shared:** Common types and utilities (packages/shared)
  
  ## Prerequisites
  - Node.js 18.x or higher
  - pnpm 8.x or higher
  
  ## Installation
  ```bash
  # Clone repository
  git clone <repo-url>
  cd ai-email-tracker
  
  # Install dependencies
  pnpm install
  ```
  
  ## Development
  ```bash
  # Start all packages in dev mode
  pnpm dev
  
  # Start specific package
  pnpm --filter @ai-tracker/api dev
  pnpm --filter @ai-tracker/web dev
  ```
  
  ## Building
  ```bash
  # Build all packages
  pnpm build
  
  # Build specific package
  pnpm --filter @ai-tracker/api build
  ```
  
  ## Code Quality
  ```bash
  # Lint all code
  pnpm lint
  
  # Format all code
  pnpm format
  
  # Type check
  pnpm typecheck
  ```
  
  ## Project Structure
  ```
  ai-email-tracker/
  ├── packages/
  │   ├── api/          # Backend API (Express/Fastify)
  │   ├── web/          # Web dashboard (Next.js)
  │   ├── extension/    # Chrome extension
  │   └── shared/       # Shared types and utilities
  ├── .github/
  │   └── workflows/    # CI/CD workflows
  ├── pnpm-workspace.yaml
  ├── tsconfig.json
  └── package.json
  ```
  
  ## Environment Variables
  See `.env.example` for required configuration.
  
  ## Contributing
  1. Create feature branch from `develop`
  2. Make changes with proper commit messages
  3. Ensure `pnpm lint` and `pnpm typecheck` pass
  4. Submit pull request
  ```

- [ ] **Step 7.2:** Create .env.example
  ```bash
  # API Configuration
  API_PORT=3001
  API_URL=http://localhost:3001
  
  # Web Configuration
  NEXT_PUBLIC_API_URL=http://localhost:3001
  
  # Database (will be configured in Story 1.2)
  # DATABASE_URL=
  
  # OAuth (will be configured in Epic 2)
  # GOOGLE_CLIENT_ID=
  # GOOGLE_CLIENT_SECRET=
  # MICROSOFT_CLIENT_ID=
  # MICROSOFT_CLIENT_SECRET=
  ```

- [ ] **Step 7.3:** Commit documentation
  ```bash
  git add README.md .env.example
  git commit -m "docs: add project documentation and env example"
  ```

### Phase 8: Verification (15 min)

- [ ] **Step 8.1:** Fresh clone test
  - Clone repo in new directory
  - Run `pnpm install`
  - Verify no errors

- [ ] **Step 8.2:** Verify all scripts work
  ```bash
  pnpm lint          # Should pass
  pnpm typecheck     # Should pass
  pnpm build         # Should complete
  pnpm dev           # Should start (even if just echoes)
  ```

- [ ] **Step 8.3:** Verify CI passes
  - Push to GitHub
  - Check GitHub Actions tab
  - Verify workflow completes successfully

---

## QA Verification Checklist

### ✅ Setup Verification

- [ ] **QA-1.1:** Clone repository from scratch
  - Repository clones without errors
  - All files present in correct structure

- [ ] **QA-1.2:** Install dependencies
  ```bash
  pnpm install
  ```
  - Installation completes without errors
  - node_modules created in root and packages
  - pnpm-lock.yaml generated

- [ ] **QA-1.3:** Verify directory structure
  ```
  ✓ packages/api exists
  ✓ packages/web exists
  ✓ packages/extension exists
  ✓ packages/shared exists
  ✓ Each has package.json
  ✓ Each has tsconfig.json
  ```

### ✅ TypeScript Verification

- [ ] **QA-2.1:** Run type checking
  ```bash
  pnpm typecheck
  ```
  - Command completes without TypeScript errors
  - All packages type-check successfully

- [ ] **QA-2.2:** Verify strict mode enabled
  - Check root tsconfig.json contains `"strict": true`
  - Each package tsconfig extends root config

- [ ] **QA-2.3:** Create test TypeScript file
  ```typescript
  // packages/shared/src/test.ts
  export const test = (x: string): number => {
    return x; // Should error
  };
  ```
  - Run `pnpm typecheck`
  - Verify TypeScript catches the error (string returned instead of number)
  - Delete test file after verification

### ✅ Linting & Formatting Verification

- [ ] **QA-3.1:** Run linting
  ```bash
  pnpm lint
  ```
  - Command completes
  - No linting errors (warnings OK for now)

- [ ] **QA-3.2:** Test lint catches errors
  - Create file with intentional error (unused variable)
  ```typescript
  // packages/api/src/test.ts
  const unusedVar = 'test';
  ```
  - Run `pnpm lint`
  - Verify lint catches unused variable
  - Delete test file

- [ ] **QA-3.3:** Run formatting
  ```bash
  pnpm format
  ```
  - Command completes without errors
  - Code formatted consistently

### ✅ Workspace Scripts Verification

- [ ] **QA-4.1:** Test individual scripts
  ```bash
  pnpm lint       # Should pass
  pnpm typecheck  # Should pass
  pnpm build      # Should complete
  pnpm format     # Should format files
  pnpm dev        # Should start (even as echo)
  ```

- [ ] **QA-4.2:** Verify parallel execution
  ```bash
  pnpm dev
  ```
  - All package dev scripts should run (even if just echo for now)
  - No errors during execution

### ✅ Git & Version Control Verification

- [ ] **QA-5.1:** Verify .gitignore works
  ```bash
  git status
  ```
  - node_modules/ not tracked
  - dist/ not tracked
  - .env not tracked
  - Only source files tracked

- [ ] **QA-5.2:** Verify commit history
  ```bash
  git log
  ```
  - Initial commit exists
  - Commit messages are clear

### ✅ CI/CD Verification

- [ ] **QA-6.1:** Verify workflow file exists
  - `.github/workflows/ci.yml` file present
  - Workflow includes: checkout, install, lint, typecheck, build

- [ ] **QA-6.2:** Trigger CI pipeline
  - Push changes to GitHub
  - Navigate to Actions tab
  - Verify workflow runs automatically

- [ ] **QA-6.3:** Verify CI passes
  - Workflow completes without errors
  - All steps (install, lint, typecheck, build) pass
  - Green checkmark on commit

- [ ] **QA-6.4:** Test CI failure detection
  - Create branch with linting error
  - Push to GitHub
  - Verify CI fails and shows error
  - Delete test branch

### ✅ Documentation Verification

- [ ] **QA-7.1:** Verify README completeness
  - Project overview present
  - Tech stack documented
  - Prerequisites listed
  - Installation instructions clear
  - Development commands documented
  - Project structure explained

- [ ] **QA-7.2:** Follow README instructions
  - Start from fresh clone
  - Follow README step-by-step
  - Verify all commands work as documented

- [ ] **QA-7.3:** Verify .env.example
  - File exists
  - Contains all required variables
  - Comments explain each variable

### ✅ Cross-Platform Verification

- [ ] **QA-8.1:** Test on Windows (if applicable)
  - Clone and install works
  - All scripts run correctly
  - Paths work correctly

- [ ] **QA-8.2:** Test on macOS (if applicable)
  - Clone and install works
  - All scripts run correctly

- [ ] **QA-8.3:** Test on Linux (if applicable)
  - Clone and install works
  - All scripts run correctly

### ✅ New Developer Onboarding Test

- [ ] **QA-9.1:** Simulate new developer
  - Have someone unfamiliar with project clone it
  - They follow README only
  - They can get project running
  - Document any confusion or missing steps

---

## Technical Notes

### Monorepo Strategy
- pnpm workspaces chosen for efficient disk usage and fast installs
- Workspaces enable shared dependencies and cross-package references
- Each package can be developed/built independently

### TypeScript Configuration
- Strict mode catches more errors at compile time
- Shared base config ensures consistency
- Per-package overrides allow flexibility (e.g., JSX for web, CommonJS for API)

### CI/CD Strategy
- GitHub Actions chosen for seamless GitHub integration
- Caching pnpm store speeds up workflow runs
- Quality checks run on every push/PR to catch issues early

### Performance Considerations
- pnpm uses symlinks for efficient storage
- Workspaces share dependencies where possible
- Parallel script execution speeds up development

---

## Dependencies

**Prerequisites:**
- None (this is the foundational story)

**Blocks (Stories Waiting on This):**
- [Story 1.2 - Database Schema](./story-1.2-database-schema-migrations.md)
- [Story 1.3 - User Authentication](./story-1.3-user-authentication-registration.md)
- All Epic 1-10 stories require this foundation

**Related Stories:**
- All development work depends on this monorepo setup

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All developer implementation steps completed
- [ ] All QA verification steps pass
- [ ] CI/CD pipeline passes
- [ ] Documentation complete and accurate
- [ ] Code reviewed (if team review process exists)
- [ ] Another developer can clone and run project following README
- [ ] Story marked as complete in project management tool

---

## Rollback Plan

If issues arise:
1. Revert Git commits related to this story
2. Delete generated files (node_modules, dist)
3. Start fresh following checklist again

---

## Future Improvements (Post-MVP)

- [ ] Add pre-commit hooks with husky
- [ ] Add commit message linting (commitlint)
- [ ] Add automated dependency updates (renovate/dependabot)
- [ ] Add test coverage reporting
- [ ] Add bundle size analysis
- [ ] Add automated releases

