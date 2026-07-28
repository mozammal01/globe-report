# Architecture

## Project folder tree

```
src/
  app/
    (site)/                 Public site route group (shares layout.tsx: Navbar/Footer/JSON-LD)
      page.tsx               Homepage (hero, latest, trending, popular, featured countries, editor's picks)
      news/                  Filterable article listing
      articles/[slug]/       Article detail (public)
      countries/             Country index
      countries/[slug]/      Country profile detail
      account/               Signed-in user area (layout.tsx guards the whole subtree)
        profile/ bookmarks/ history/ settings/
      login/ signup/         Public auth pages
      newsletter/confirm/    Double opt-in confirmation (GET, mutates on render)
      newsletter/unsubscribe/
      about/ contact/ privacy/ terms/ disclaimer/ cookies/   Legal & static pages
      error.tsx               (none — see root-level src/app/error.tsx, covers this route group too)
    admin/
      login/                 Admin-only login (separate from public /login)
      (protected)/           Guarded by getCurrentAdmin() in layout.tsx
        page.tsx               Dashboard (stat cards, recently updated)
        articles/ categories/ countries/ tags/   CRUD sections
        analytics/              Read-only reporting
        newsletter/ contact/    Subscriber / inbox management
    api/
      auth/[...all]/          Better Auth's catch-all handler
      search/                 Global search (rate-limited)
      bookmarks/[articleId]/  Bookmark status check (used by BookmarkButton)
    feed.xml/                 RSS route handler
    layout.tsx, error.tsx, global-error.tsx, not-found.tsx, robots.ts, sitemap.ts,
    opengraph-image.tsx, twitter-image.tsx    Root-level app shell & SEO file conventions
  components/
    ui/          Design-system primitives (button, card, dialog, table, pagination, ...)
    layout/      Navbar, Footer, MobileNav, ThemeToggle, UserNav/UserMenu
    home/        Homepage sections (ArticleSection and its Suspense-wrapped async variants)
    article/     ArticleView, ArticleBody, GuideToc, BookmarkButton, ShareButtons, ViewTracker
    country/     Country detail sections
    news/        News-listing filters
    search/      GlobalSearch command palette
    admin/       Admin forms, tables, sidebar, shared admin widgets (MediaUploader, ConfirmDialog, ...)
    account/     Account area nav & forms
    auth/        Login/signup forms, sign-out button
    contact/     Contact form
    legal/       Shared LegalPage layout for the 6 static pages
    seo/         JsonLd renderer
    ads/         AdSlot (reserved ad space, see below)
    shared/      Cross-cutting reusable pieces (NewsletterForm)
    providers/   ThemeProvider
  lib/
    actions/           Public-facing Server Actions (newsletter, contact, bookmarks, article-views, account)
    actions/admin/     Admin-only Server Actions (one file per CRUD domain + types.ts + media.ts)
    queries/           Public read queries (one file per domain)
    queries/admin/     Admin-only read queries (unfiltered by publish status)
    auth/              Better Auth config, client, session helpers (getCurrentAdmin/getCurrentUser)
    email/             Resend client + HTML templates
    media/             Filesystem upload helper (not a Server Action — see security note in DEPLOYMENT.md)
    env/               Zod-validated server/client environment
    constants/         Shared enums-as-constants (article status, content type)
    seo.ts, prose.ts, toc.ts, slug.ts, hash.ts, rate-limit.ts, category-cycle.ts, format.ts, utils.ts
      Small, mostly pure, mostly unit-tested utility modules
  generated/prisma/    Generated Prisma client (gitignored)
  hooks/               use-debounced-value
prisma/
  schema.prisma        Database schema (see docs/DATABASE.md)
  migrations/
  seed.ts
docs/                  This documentation set
```

## App route map

| Route                                                                 | Access          | Notes                                                                                                  |
| --------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| `/`                                                                   | Public          | ISR (`revalidate = 60`), Suspense-streamed below-the-fold sections                                     |
| `/news`                                                               | Public          | Dynamic (reads `searchParams`); category/country/tag filters                                           |
| `/articles/[slug]`                                                    | Public          | ISR (`revalidate = 60`); JSON-LD, Recommended + Related rails, Guide TOC when applicable               |
| `/countries`, `/countries/[slug]`                                     | Public          | ISR (`revalidate = 60`)                                                                                |
| `/login`, `/signup`                                                   | Public, noindex | Same-origin `redirectTo` validated against open-redirect                                               |
| `/account/*`                                                          | Signed-in user  | Layout-level guard via `getCurrentUser()`, redirects to `/login`                                       |
| `/newsletter/confirm`, `/newsletter/unsubscribe`                      | Public, noindex | GET pages that mutate on render — see Security Checklist                                               |
| `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/cookies` | Public          | Static content, no ad slots                                                                            |
| `/admin/login`                                                        | Public, noindex | Separate from the public login                                                                         |
| `/admin` and `/admin/*`                                               | Admin only      | `middleware.ts` does a cheap cookie check; `getCurrentAdmin()` enforces real authorization per-request |
| `/sitemap.xml`, `/robots.txt`, `/feed.xml`                            | Public          | Generated, not hand-maintained                                                                         |
| `/opengraph-image`, `/twitter-image`                                  | Public          | Static generated OG image                                                                              |

## API route map

| Route                        | Method  | Auth                                                  | Purpose                                                                                               |
| ---------------------------- | ------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `/api/auth/[...all]`         | Various | Better Auth internal                                  | Sign-in/sign-up/session/sign-out, handled entirely by Better Auth                                     |
| `/api/search`                | GET     | Public, rate-limited (30/min/IP)                      | Backs `GlobalSearch`'s command palette                                                                |
| `/api/bookmarks/[articleId]` | GET     | Public (returns `signedIn: false` if unauthenticated) | Initial bookmark state for `BookmarkButton`, fetched client-side so the ISR article page stays static |

Most mutations go through **Server Actions**, not API routes (`src/lib/actions/**`) — this is the dominant pattern in the app; API routes exist only where a client component needs a plain `fetch`-able GET (search-as-you-type, bookmark status check) or where a third-party library owns the route (Better Auth).

## Component tree (by directory)

See the folder tree above for the full breakdown — the short version: `components/ui` is the design-system layer (no app knowledge), `components/{home,article,country,news,search}` are public-site feature components, `components/admin` is the admin CRUD layer (forms/tables/sidebar), `components/account` mirrors it for the smaller user-facing account area, and `components/{auth,contact,legal,seo,ads,shared}` are small cross-cutting pieces used by more than one route group.

## Database summary

Full detail, ER diagram, and migration workflow: [`docs/DATABASE.md`](./DATABASE.md). In one line: `User`/`Role` (auth) → `Article` (content, with `Category`/`Country`/`Tag`/`Media` taxonomy) → `Bookmark`/`View`/`Comment`/`Newsletter`/`ContactMessage` (engagement).

## Key architectural decisions

- **Content types share one model.** `Article.contentType` (`ARTICLE`/`GUIDE`) toggles rendering, not a parallel schema/admin surface — see `docs/DATABASE.md`.
- **Scheduling is query-time computed**, not a stored state — see `publishedWhere()` in `src/lib/queries/articles.ts`.
- **Server Actions over API routes** for mutations; API routes are reserved for client-`fetch`-driven reads and third-party library routes.
- **Two independent auth surfaces**: `getCurrentAdmin()` (role-gated) and `getCurrentUser()` (any active account) in `src/lib/auth/session.ts`, sharing the same session-lookup shape but different authorization rules.
- **In-memory rate limiting** (`src/lib/rate-limit.ts`) is a deliberate "good enough for one instance" choice, documented as a scaling limitation rather than solved with a new external dependency at this stage.
