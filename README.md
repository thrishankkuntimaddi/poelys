# Poelys

The website of Poelys, a product studio: **poelys.com**. Software today, hardware tomorrow, one trunk with many branches.

React 19 + TypeScript + Vite. **poelys.com is served from AWS Lightsail** (`lvn-prod`, Mumbai); deploy with `deploy/aws/deploy.sh`. A private **Console** at `/studio` controls the live site and shows its analytics, backed by Firebase project `poelys-67d9b`.

## What's on the site

| Area | Where |
|---|---|
| Home: hero, live status board, featured products running in place, the tree, branches, hardware, open source/API, journal | `src/pages/Home.tsx` |
| Products index (filter by branch, status, text; grid or list) | `src/pages/Products.tsx` |
| Product pages (coded preview, *Try it here*, film, highlights, platforms, resources, notify-me) | `src/pages/ProductPage.tsx` |
| The tree, About, Careers, Partners, Journal, Open source, Poelys API (coming soon), Pricing, Status, Contact | `src/pages/Simple.tsx` |
| Privacy, Terms, Cookies, Security | `src/data/site.ts` → `LEGAL` |
| Mega-menu nav, ⌘K / `/` search, footer with *Follow Poelys*, version bar and theme switch | `src/components/` |
| Coded product scenes (not screenshots) | `src/previews/Scenes.tsx` |
| Console | `src/console/` |

## Adding or changing a product

Everything about a product lives in **`src/data/products.ts`**. Copy an entry, give it a new `id` and `branch`, and push. The Console can change any of it later without code.

**YouTube film:** put the video id on the product's `youtube` line, for example `youtube: 'dQw4w9WgXcQ',`, or paste the link in Console → Products → *Film & preview*. A *Watch* tab appears on the product page. It loads from youtube-nocookie.com only when the visitor presses play.

**Try it here:** `embed: 'https://…'` runs the product inside the page in a sandboxed frame. It only works for sites that allow framing. Today those are Parla, Meditation, ClearMyMind, Slate's site and the Expense Tracker product page. Oruinwan, YorMenu, the Expense Tracker app, LearnViaNotes and WillAI send `X-Frame-Options: DENY`/`SAMEORIGIN`, so they show their coded scene only.

**Status:** `live`, `beta`, `soon` (Coming soon), `maintenance` (Under maintenance), `concept`, `hidden`.

**Icons:** `public/images/<id>-icon.png` (256 px). Products without one get a monogram tile in their colour.

## The Console (`/studio`)

Sign in with Google as **poelysproducts@gmail.com**. No other account can get in, and the database rules enforce this on the server.

- **Overview:** views, visitors, returning share, product opens, downloads, films, in-page previews, source clicks, searches, referrers, time zones, devices, latest activity.
- **Site & banner:** announcement banner, site-wide maintenance mode, per-page *coming soon* / *under maintenance*, the home headline.
- **Products:** status, featured, order, copy, links, YouTube film, *Try it here* URL, scene, platforms, highlights. Add new products.
- **Branches**, **Journal / Careers / Partners**, **Social links** (empty = greyed out "coming soon").
- **Inbox:** contact, partnering, careers, API waitlist and *notify me* messages.
- **Security & versions:** sign out everywhere, every published version kept and restorable.

Edits are a draft until you press **Publish**. Visitors' open pages pick up changes within two minutes.

### One-time Firebase setup

1. Firebase console → **Authentication → Sign-in method** → enable **Google**.
2. Authentication → Settings → **Authorized domains** → add `poelys.com` (and `localhost` for local work).
3. Deploy the rules: `firebase deploy --only firestore:rules`, signed in to the CLI as poelysproducts@gmail.com (`.firebaserc` points at `poelys-67d9b`). Done on 24 Nov 2026.

Until the rules are deployed, Firestore refuses every request: the site falls back to the built-in data, and analytics and messages are dropped.

## Security

- HTTPS only. A Content Security Policy (added to production builds in `vite.config.ts`) only allows scripts from this site and Google's Firebase.
- Text from the database is rendered as text, never HTML. Links must be `https:`, `mailto:` or a site path.
- `firestore.rules`: public read of the published config only. Visitor writes are create-only and fixed-shape, and they are **rate limited per visitor** (1 s for visit records, 30 s for messages). Owner writes need a Google sign-in from the last 30 days. *Sign out everywhere* revokes every session.
- Respects Do Not Track and Global Privacy Control: nothing is recorded.
- `public/.well-known/security.txt` for vulnerability reports.

Test the rules locally (needs JDK 21): `firebase emulators:start --only firestore`.

## Deploy to AWS

The live site runs on the Lightsail server **`lvn-prod`** (`16.4.70.135`, Mumbai), shared with LearnViaNotes production. Caddy (container `lvn-caddy-1`, config `/opt/lvn/Caddyfile`) serves `/home/deploy/poelys-site`.

```sh
aws login                        # the AWS account that owns lvn-prod
./deploy/aws/deploy.sh           # build, back up the live site, upload, switch over
./deploy/aws/deploy.sh rollback  # put the last backup back
```

SSH uses a short-lived certificate from Lightsail, so no key files are needed. The script never reloads Caddy, so LearnViaNotes is never interrupted. `deploy/aws/Caddyfile.poelys` is the poelys.com block of the server's Caddyfile (security headers, caching, routing); the file explains how to change it.

Content changes (banner, statuses, films, posts) never need a deploy: they come from the Console.

## Develop

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck, build, then write a page per route + sitemap.xml (scripts/routes.mjs)
npm run preview
```

`scripts/routes.mjs` copies `index.html` to every known route (so Caddy answers deep links with a 200) and to `404.html`.

The version in the footer comes from `package.json`. Raise it when you ship.
