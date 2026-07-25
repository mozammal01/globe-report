# Globe Report

Global News & Knowledge Portal — production foundation.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Prisma 7 + PostgreSQL (via `@prisma/adapter-pg`)
- ESLint + Prettier + Husky + lint-staged + Commitlint

## Getting Started

1. Copy the environment template and fill in real values:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Point `DATABASE_URL` at a running PostgreSQL instance, then generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Script                    | Description                      |
| ------------------------- | -------------------------------- |
| `npm run dev`             | Start the dev server             |
| `npm run build`           | Production build                 |
| `npm run start`           | Serve the production build       |
| `npm run lint`            | Lint with ESLint                 |
| `npm run lint:fix`        | Lint and auto-fix                |
| `npm run format`          | Format with Prettier             |
| `npm run format:check`    | Check formatting without writing |
| `npm run typecheck`       | TypeScript type checking         |
| `npm run prisma:generate` | Regenerate the Prisma client     |

## Project Structure

```
src/
  app/            Routes, layouts, metadata, robots/sitemap
  components/
    ui/           shadcn/ui primitives
    layout/       Navbar, Footer, theme toggle, mobile nav
    providers/    App-wide providers (theme)
  config/         Site configuration
  lib/            Shared utilities, env validation, Prisma client
  generated/      Generated Prisma client (gitignored)
prisma/
  schema.prisma   Database schema
```

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) — enforced by Commitlint on `commit-msg`. Pre-commit runs lint-staged (ESLint + Prettier) on staged files.
