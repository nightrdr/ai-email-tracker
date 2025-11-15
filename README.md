# AI Email Tracker

Monorepo for the AI-powered email tracking and campaign manager platform.

## Tech Stack

- **Language:** TypeScript
- **Package Manager:** pnpm workspaces
- **Backend:** Node.js (packages/api)
- **Web App:** React/Next.js (packages/web)
- **Chrome Extension:** Manifest v3 (packages/extension)
- **Shared:** Utilities and types (packages/shared)

## Prerequisites

- Node.js 18+
- pnpm 8+

## Getting Started

```bash
pnpm install
pnpm dev
```

### Useful Commands

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
pnpm format
```

## Project Structure

```
ai-email-tracker/
├── packages/
│   ├── api/
│   ├── web/
│   ├── extension/
│   └── shared/
├── .github/workflows/ci.yml
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

## Environment Variables

See `.env.example` for required variables.

## Contributing

1. Create a feature branch from `main` or `develop`.
2. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` before opening a PR.
3. Push your changes and ensure the CI workflow is green before requesting review.
