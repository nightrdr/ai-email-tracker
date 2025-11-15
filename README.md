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

## Database Setup

- Copy or create a `.env` file that sets both `DATABASE_URL=postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev` and `TEST_DATABASE_URL=postgresql://aitracker:devpassword@localhost:5433/ai_tracker_test` (adjust creds as needed).
- Add auth secrets alongside your DB settings: e.g. `JWT_SECRET=dev-secret`, `JWT_EXPIRES_IN=7d`, `BCRYPT_ROUNDS=10`.
- Start the paired local databases (dev on `5432`, test on `5433`) with `pnpm db:start`. Tail logs with `pnpm db:logs` and stop everything with `pnpm db:stop`.
- Compile the TypeScript migrations and apply them to the dev DB via `pnpm --filter @ai-email-tracker/api migrate:up`. Use `migrate:down`/`migrate:redo` for rollback cycles, or `migrate:up:test` to hydrate the dedicated test database.
- Create new migrations with `pnpm --filter @ai-email-tracker/api migrate:create -- migration-name` (files are authored in TypeScript and compiled automatically before execution).
- Run the integration test suite—which seeds the test database automatically—with `pnpm --filter @ai-email-tracker/api test`.
- Verify connectivity via the health utility: `pnpm --filter @ai-email-tracker/api ts-node src/index.ts`.

### Schema Overview

```
users
  └─ email_accounts
       └─ tracked_emails
            └─ tracking_events
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
