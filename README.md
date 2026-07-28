# Globe Report

Global News & Knowledge Portal — a public news/content site with an admin dashboard, user accounts, and a newsletter.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Prisma 7 + PostgreSQL (via `@prisma/adapter-pg`)
- Better Auth (admin + public user accounts)
- Resend (transactional email)
- Vitest (unit tests)
- ESLint + Prettier + Husky + lint-staged + Commitlint

## Getting Started

1. Copy the environment template and fill in real values (see `docs/DEPLOYMENT.md` for what each variable does):

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Point `DATABASE_URL` at a running PostgreSQL instance, then generate the Prisma client and apply migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app, or [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin dashboard (credentials from `ADMIN_EMAIL`/`ADMIN_PASSWORD`, seeded by step 3).

## Scripts

| Script                    | Description                           |
| ------------------------- | ------------------------------------- |
| `npm run dev`             | Start the dev server                  |
| `npm run build`           | Production build                      |
| `npm run start`           | Serve the production build            |
| `npm run lint`            | Lint with ESLint                      |
| `npm run lint:fix`        | Lint and auto-fix                     |
| `npm run format`          | Format with Prettier                  |
| `npm run format:check`    | Check formatting without writing      |
| `npm run typecheck`       | TypeScript type checking              |
| `npm run test`            | Run the Vitest suite once             |
| `npm run test:watch`      | Run Vitest in watch mode              |
| `npm run prisma:generate` | Regenerate the Prisma client          |
| `npm run prisma:migrate`  | Create + apply a migration (dev)      |
| `npm run prisma:seed`     | Seed roles, admin user, and demo data |

## Project Structure

```
src/
  app/
    (site)/         Public site: home, news, articles, countries, account area, auth, legal pages
    admin/          Admin dashboard (protected route group + separate admin login)
    api/            Better Auth handler, search, bookmark-status
    feed.xml/       RSS route handler
  components/
    ui/             Design-system primitives
    layout/         Navbar, Footer, mobile nav, user menu
    home/ article/ country/ news/ search/   Public-site feature components
    admin/ account/                          Admin & account CRUD components
    auth/ contact/ legal/ seo/ ads/ shared/  Cross-cutting components
    providers/      App-wide providers (theme)
  lib/
    actions/        Server Actions (public + admin/)
    queries/        Read queries (public + admin/)
    auth/ email/ media/ env/ constants/   Supporting infrastructure
  generated/        Generated Prisma client (gitignored)
prisma/
  schema.prisma     Database schema
  migrations/
  seed.ts
docs/               Architecture, database, deployment, checklists, and roadmap docs
```

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) — enforced by Commitlint on `commit-msg`. Pre-commit runs lint-staged (ESLint + Prettier) on staged files.

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — folder tree, app/API route maps, component tree, key decisions
- [`docs/DATABASE.md`](./docs/DATABASE.md) — schema overview, ER diagram, migration workflow
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — required env vars, Vercel + self-hosted deployment guides
- [`docs/CHECKLISTS.md`](./docs/CHECKLISTS.md) — SEO, accessibility, performance, security, responsive-design audit
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — future roadmap, scalability suggestions, maintenance guide
