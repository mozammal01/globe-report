# Deployment

globe-report is a standard Next.js 15 App Router app with a Postgres database (developed against [Neon](https://neon.tech), serverless Postgres) and Resend for transactional email. These instructions are Vercel-first since that pairs naturally with Neon and Next.js, with a self-hosted Node fallback for anyone deploying elsewhere.

## Required environment variables

Validated eagerly at boot by `src/lib/env/{server,client}.ts` — the app throws immediately on startup if any are missing or malformed, rather than failing confusingly later.

| Variable                                        | Required  | Notes                                                                                                                                                                   |
| ----------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                  | Yes       | Postgres connection string. For Neon, use the pooled connection string (`-pooler` host) for the app; migrations can use either.                                         |
| `NEXT_PUBLIC_SITE_URL`                          | Yes       | Full canonical site URL (`https://yourdomain.com`, no trailing slash) — drives canonical tags, JSON-LD, sitemap/RSS URLs, and Better Auth's `baseURL`/`trustedOrigins`. |
| `BETTER_AUTH_SECRET`                            | Yes       | ≥32 characters. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. Rotating this invalidates all sessions.                    |
| `RESEND_API_KEY`                                | Yes       | From [resend.com/api-keys](https://resend.com/api-keys). Used for newsletter confirmation and contact-form notification emails.                                         |
| `CONTACT_EMAIL`                                 | Yes       | Inbox that receives contact-form notifications.                                                                                                                         |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed-only | Read by `prisma/seed.ts` to bootstrap the first admin account — not read by the running app itself.                                                                     |

## Vercel

1. Import the repo into Vercel; framework preset auto-detects Next.js.
2. Set all required env vars above in Project Settings → Environment Variables (Production + Preview).
3. **Resend domain verification**: add and verify your sending domain in the Resend dashboard, then update the hardcoded `from:` addresses in `src/lib/actions/{newsletter,contact}.ts` (currently `onboarding@resend.dev`, Resend's shared sandbox sender) to an address on your verified domain — the sandbox sender works for testing but has deliverability limits.
4. **Run migrations as a release step**, not from the build: add a Vercel deploy hook or run `npx prisma migrate deploy` manually against production `DATABASE_URL` before/immediately after each deploy that includes a schema change. (Running `migrate deploy` inside `next build` is possible via a custom build command but couples DB migration timing to build timing, which is usually not what you want for a table with live traffic.)
5. Local media uploads (`public/uploads/`, from the Admin Dashboard's file upload) are written to the **local filesystem** — this does not persist on Vercel's ephemeral serverless filesystem. This is a known dev-only limitation (documented at build time); before going to production with real editorial content, swap `src/lib/media/save-uploaded-file.ts` for an object-storage backend (S3, Cloudflare R2, Vercel Blob) — the function's signature (`formData, uploadedById → {id, url}`) is intentionally the only thing that would need to change.

## Self-hosted Node

For a VPS or any environment you control directly:

```bash
npm ci
npm run prisma:generate
npx prisma migrate deploy
npm run build
npm run start   # serves on :3000 by default; set PORT to override
```

Run `npm run start` under a process manager (`pm2`, `systemd`) so it restarts on crash/reboot, and put it behind a reverse proxy (nginx, Caddy) for TLS termination. Unlike Vercel, the local-filesystem media upload path (`public/uploads/`) works correctly here as long as the process has a persistent disk — no object-storage migration is required for a single-instance self-hosted deployment.

## Production hygiene already in place

- `next.config.ts` sets `poweredByHeader: false` and `experimental.optimizePackageImports` for `lucide-react`/`radix-ui`/`cmdk`.
- Environment validation fails fast on boot (see table above) rather than surfacing as a runtime 500 on first request.
- The in-memory rate limiter (`src/lib/rate-limit.ts`) protecting newsletter/contact/search/bookmark/view endpoints is **per-instance** — it does not coordinate across multiple server instances or serverless function invocations. This is an acceptable blunt mitigation for casual abuse at small scale; if you scale to multiple instances and see abuse, upgrade to a shared store (Upstash Redis is the common Vercel-compatible choice) — see `docs/ROADMAP.md`.

## Verifying a deployment

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

All four should pass before deploying. After deploying, spot-check: `/sitemap.xml` and `/feed.xml` return valid XML, `/robots.txt` disallows `/admin`/`/account`/`/api`, `/admin/login` is reachable and rejects an unauthenticated session, and a real newsletter signup delivers a confirmation email end-to-end (confirms `RESEND_API_KEY` and domain verification are both correctly configured).
