# Remi Frogo

Portfolio and tattoo-booking website for **Remi Frogo**, a fine and tattoo artist based in Los Angeles. The site showcases paintings, a tattoo gallery, an about page, a tattoo-booking flow, and a password-protected admin panel for managing artwork.

Live at [remifrogo.art](https://remifrogo.art).

## Stack

- **[Astro](https://astro.build)** in `output: "server"` (SSR) mode
- **[Cloudflare](https://developers.cloudflare.com)** adapter (`@astrojs/cloudflare`) — deployed to Cloudflare Pages
- **[Astro DB](https://astro.build/db)** (`@astrojs/db`) backed by **Cloudflare D1** — `User`, `Appointment`, `Painting`, `Tattoo` tables
- **Cloudflare R2** — image storage for paintings and tattoos
- **Cloudflare KV** — stores editable "about" page copy
- **SendGrid** — transactional email for booking confirmations
- **TypeScript** (strict)

## Project layout

```
src/
├── pages/
│   ├── index.astro              # Landing page (logo + nav)
│   ├── about.astro              # Artist bio; copy stored in KV
│   ├── art/
│   │   ├── index.astro          # Painting list (prerendered from DB)
│   │   └── [...piece].astro     # Individual painting page (prerendered)
│   ├── tattoos/[view].astro     # Tattoo "bookings" / "gallery" views
│   ├── appointments.astro
│   ├── success/[appointmentId].astro
│   ├── admin/
│   │   ├── [...view].astro       # Admin: manage paintings & tattoos (HMAC-cookie gated)
│   │   └── login.astro           # Admin login
│   ├── img/[...name].ts          # Serves R2 objects by key
│   └── info/index.ts             # Misc endpoint
├── components/                   # Astro components (Header, Footer, art/tattoo/admin views, SVGs)
├── layouts/Layout.astro          # Shared HTML shell, SEO meta, per-route theming
└── lib/
    ├── db.ts                     # Astro DB query helpers (appointments, users, paintings, tattoos)
    ├── email.ts                  # SendGrid client
    ├── config.ts                 # Static config (email, Instagram links)
    ├── mockdb.ts                 # Local-dev painting fixtures
    ├── utils.ts                  # UUID + Cloudflare image-resize URL helpers
    └── types.ts

db/
├── config.ts                     # Astro DB table schema
├── seed.ts                       # Seeds Painting table from R2 metadata (local dev)
└── r2-sync.ts

public/images/                    # Static assets (logos, faces, icons, SEO images)
```

## Data model

Defined in `db/config.ts`:

- **User** — `id`, `name`, `email`, `instagram`, `phoneNumber`
- **Appointment** — `id` (UUID), `userId` → User, tattoo request details (`tattooDescription`, `tattooPlacement`, `tattooSize`, `availability`, `miscellaneous`), `imageSrc`, `createdAt`
- **Painting** — `key` (R2 object key, primary), `title`, `material`, `dimensions`, `rank`, `year`, `updatedAt`
- **Tattoo** — `key` (R2 object key, primary), `name`

Image binaries live in R2; the DB rows store the R2 key plus metadata. Painting/tattoo images are served either through the `/img/[...name]` route (R2 binding) or directly from `https://storage.remifrogo.art/<key>`.

## How key flows work

**Art gallery** (`/art`) — Prerendered (`export const prerender = true`). At build time it reads all paintings from the DB (falling back to `lib/mockdb.ts` fixtures in dev) and renders them sorted by `rank`. Each painting also gets its own prerendered page at `/art/<key>`.

**Tattoo booking** (`/tattoos/bookings`) — A form that creates a `User` (if new) and an `Appointment`, then sends confirmation emails to the client and to the artist via SendGrid, and redirects to `/success/<appointmentId>`. **Currently disabled** — the POST handler throws early, directing visitors to book via Instagram instead.

**Admin** (`/admin/...`) — Login at `/admin/login`. Auth is an HMAC-SHA256 signature of the credentials stored in an `auth` cookie and re-verified on each admin page load. From the admin panel, the artist uploads/edits paintings and tattoos: the image goes to R2, metadata goes to the DB, and (for paintings) a Cloudflare Pages **deploy hook** is fired to rebuild the prerendered gallery.

**About** (`/about`) — Bio copy is read from KV (`about` key) and can be updated via a POST on the same page.

## Bindings

Configured in `wrangler.toml`:

- `DB` — D1 database (Astro DB)
- `R2` — R2 bucket (`remi`)
- `KV` — KV namespace

## Environment variables

- `SENDGRID_API_KEY` — SendGrid API key (booking emails)
- `EMAIL_SENDER_ADDRESS` — verified SendGrid sender address
- `ASTRO_STUDIO_APP_TOKEN` — used by the GitHub Action for DB pushes

Local dev vars go in `.dev.vars`; CI secrets are set in GitHub Actions (`.github/workflows/_studio.yml`).

## Commands

| Command              | Action                                                       |
| :------------------- | :----------------------------------------------------------- |
| `npm install`        | Install dependencies                                         |
| `npm run dev`        | Dev server with local D1/R2/KV via Cloudflare platform proxy |
| `npm run dev:remote` | Dev server against the remote (Studio) database              |
| `npm run build`      | Type-check (`astro check`) then build with `--remote` DB     |
| `npm run preview`    | Preview the production build locally                         |

## Notes / gotchas

- The art gallery is **prerendered**, so adding or editing a painting requires a rebuild — the admin panel triggers this automatically via the Cloudflare deploy hook.
- Admin credentials and the HMAC secret are currently hardcoded in `src/pages/admin/login.astro` and `src/pages/admin/[...view].astro`. Treat the admin panel as low-security and avoid storing anything sensitive behind it.
- Tattoo booking is disabled in code (see the early `throw` in `src/pages/tattoos/[view].astro`); re-enabling it requires SendGrid env vars to be set.
- In development the app uses `lib/mockdb.ts` fixtures and skips R2 HTTP-metadata headers; production reads from D1/R2.
