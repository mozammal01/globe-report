# Roadmap

## Future roadmap

Ordered roughly by expected value, not urgency — none of these are blocking production launch.

1. **Wire up the editorial workflow.** `Role` already models `EDITOR`/`AUTHOR` and `Article.status` already has `IN_REVIEW`, but nothing branches on the non-`ADMIN` roles today — `getCurrentAdmin()` only accepts `ADMIN`. A real newsroom workflow (authors submit, editors review/publish) would extend `ADMIN_ACCESS_ROLES`-style checks per-action rather than an all-or-nothing admin gate.
2. **Wire up `Comment`.** The model, its `status` enum, and `Article.commentCount` all exist; there's no public comment UI or admin moderation screen yet.
3. **Real AdSense integration.** `src/components/ads/ad-slot.tsx` is deliberately placeholder-only — swap in the AdSense loader script + `<ins class="adsbygoogle">` inside the existing reserved slots once an AdSense account is approved. Re-run the AdSense-policy checklist in `docs/CHECKLISTS.md`'s audit history after real ads are live (placement risk assessment changes once slots render real content).
4. **Object storage for media uploads.** `src/lib/media/save-uploaded-file.ts` writes to the local filesystem — fine for a single self-hosted instance, breaks on Vercel's ephemeral filesystem. Swap for S3/R2/Vercel Blob; the function's `(formData, uploadedById) → {id, url}` contract is designed to make this a contained change.
5. **POST-confirmation for newsletter links.** `/newsletter/confirm` and `/newsletter/unsubscribe` currently mutate on a GET render. Low risk today (single-use random token, idempotent outcome) but a confirmation-button UX (GET renders a page with a button, the button POSTs) is the more defensible long-term pattern, especially once real subscriber volume makes scanner/prefetch-triggered mutations more likely to actually happen.
6. **Country-page content completeness.** Pages for countries with no economy/travel/history/facts data currently show a bare "content coming soon" state (and, per the AdSense-policy fix in this pass, no longer show an ad slot there either). Filling in more country profiles is editorial work, not engineering.
7. **Manual accessibility contrast audit.** `text-muted-foreground` at small sizes sits near the WCAG AA boundary — worth running through an actual contrast-checking tool against the final shipped color values (light and dark) rather than relying on a code-read estimate.
8. **Organization logo in JSON-LD.** Add a `logo` field to `organizationJsonLd()` once brand assets exist.

## Scalability suggestions

- **Rate limiting**: the current limiter (`src/lib/rate-limit.ts`) is in-memory and per-instance. It's a real, working mitigation for a single-instance deployment (the default for this project's scale) but won't coordinate across multiple serverless invocations or server instances. If you scale horizontally and see abuse patterns, move to a shared store — Upstash Redis is the standard choice for Vercel deployments and has a drop-in `@upstash/ratelimit` package with a similar API shape.
- **Search**: `src/lib/queries/search.ts` uses `contains`/`insensitive` scans across articles/countries/categories/tags. This is fine at hundreds-to-low-thousands of articles. Beyond that, add a Postgres `tsvector` generated column + GIN index (no new infra required, stays in Postgres) before reaching for an external search service like Meilisearch/Algolia.
- **Media storage**: see Roadmap item 4 above — this is the first thing that needs to change to run more than one server instance or deploy to a serverless/ephemeral-filesystem platform.
- **View/Analytics volume**: the `View` table grows one row per (deduplicated) page view. At high traffic, consider a periodic rollup job (e.g. daily aggregate table) rather than querying the raw log table indefinitely — the schema doesn't need to change for this, it's a query-layer addition when the time comes.
- **Database connection pooling**: already using Neon's pooled connection string pattern (`-pooler` host) — if migrating off Neon, ensure the replacement Postgres provider's pooling story (PgBouncer or equivalent) is in place before scaling instance count.

## Maintenance guide

- **Adding a new environment variable**: add it to both the relevant Zod schema (`src/lib/env/server.ts` or `client.ts`) and `.env.example` in the same change — the app fails fast on boot if they drift, which is intentional (surfaces misconfiguration immediately rather than at first use).
- **Adding a new admin CRUD section**: follow the established four-file pattern — `lib/queries/admin/<domain>.ts` (list + detail queries), `lib/actions/admin/<domain>.ts` (Zod-validated Server Actions, `getCurrentAdmin()` guard first, `ActionState` return shape), `components/admin/<domain>-form.tsx` + `<domain>-table.tsx`, `app/admin/(protected)/<domain>/page.tsx` (+ `new/`, `[id]/edit/` as needed). Reuse `Pagination`, `ConfirmDialog`, `FormField`, `SubmitButton` rather than rebuilding them.
- **Adding a new article status or content type value**: edit `src/lib/constants/article.ts` only — it's the single source of truth consumed by the Zod schema, the admin filter UI, the form, and the status-badge variant map.
- **Running tests**: `npm run test` (or `npm run test:watch` while iterating). New pure-logic modules under `src/lib/` should get a colocated `*.test.ts` — see the existing ones (`slug`, `format`, `hash`, `toc`, `category-cycle`) for the expected shape: no DB/network, dependency-injected where the real implementation needs one (see `category-cycle.ts`'s `ParentLookup` pattern).
- **Before every deploy**: `npm run typecheck && npm run lint && npm run test && npm run build` — see `docs/DEPLOYMENT.md`.
- **Schema changes**: `npm run prisma:migrate` locally (creates + applies a migration), commit the generated migration folder, run `prisma migrate deploy` in production as a release step (never `migrate dev` against production data).
- **Rotating `BETTER_AUTH_SECRET`**: invalidates all active sessions — treat as a breaking, user-visible change, not a routine rotation.
