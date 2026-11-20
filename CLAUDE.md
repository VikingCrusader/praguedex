# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. It is the index: detail lives in `docs/`, and each pointer below says when a doc must be read first.

## Docs to read before working on…

| Topic | Doc |
|---|---|
| Adding/editing/deleting Location cards, labels, scope rules, description cleanup | `docs/locations.md` |
| Rarity, XP, expedition and secret cards, card materials/frames/motion | `docs/rarity-and-cards.md` |
| Writing History Timeline events, background/overview cards, markup, quotes | `docs/history-writing.md` |
| Era status, structural decisions, write-back reminders | `docs/history-era-notes.md` |
| `/history` frontend (book view, paged view, axis, progress, performance) | `docs/history-frontend.md` |
| Illustration prompts (template, frame, style rules, character designs) | `docs/illustrations.md` |
| Achievements (design, tiers, stories, implementation) | `docs/achievements.md`, icons `docs/achievement-icons.md` |
| Card packs | `docs/card-packs.md` |
| Area guides | `docs/area-guides.md`, missing places `docs/missing-landmarks.md` |
| Treasure Hunt | `docs/treasure-hunt.md` |
| Guide pictures | `docs/guide-illustrations.md` |
| Frontend pages and components (Explore, Map, Guide, profile, showcase, detail windows, page turns, fonts, covers, PWA, consent) | `docs/frontend-ui.md` |
| Story locking, admin-only edits, DB round trips, the card catalog | `docs/backend-notes.md` |

## Commands

```bash
# Backend (run from server/)
npm run dev          # nodemon on port 5000
npm run start        # production start
npm test              # Jest unit + controller integration tests (mongodb-memory-server)

# Frontend (run from client/)
npm run dev          # Vite dev server on port 5173
npm run build        # production build
npm test              # Jest unit/component tests
npm run test:e2e      # Playwright e2e (client/e2e/), mocks the backend via page.route

# Data scripts (run from server/)
node src/data/seedLocations.js    # upsert seeded location cards (idempotent)
node src/data/seedHistoryEvents.js # upsert History Timeline events (idempotent, $setOnInsert — edits to seeded slugs need a manual DB sync)
npm run export:locations          # export DB → static seed files
npm run sync:covers               # sync Cloudinary cover images to local
npm run sync:expedition           # recompute rarity/XP of live cards (outside → expedition); --dry to preview

# Data scripts (run from client/)
npm run generate:covers           # rescan public/pixel-art/ → rebuild src/utils/coverManifest.json (+ thumbs)
```

There is no linter configured.

### Testing

- Server tests live in `server/__tests__/`. `rarityMap.test.js` and `gamification.test.js` are pure-function unit tests; the controller tests (`auth`, `location`, `checkin`, `user`, `history`) spin up an in-memory MongoDB (`mongodb-memory-server`) and drive the real Express app via `supertest`, exercising real Mongoose behavior rather than mocking models.
- `server/src/app.js` exports the Express app with no `listen()`; `server/src/index.js` connects to Mongo and listens. Tests import `app.js` directly.
- External calls (Cloudinary upload, Gemini description generation) are mocked via `jest.unstable_mockModule`.
- On the macOS 12 dev machine, run server tests with `MONGOMS_VERSION=7.0.14 npm test` (mongod 8.2 needs a newer libc++).
- Client tests: `client/src/__tests__/` (Jest + RTL), `client/e2e/` (Playwright, backend mocked via `page.route`).
- **Chrome version gotcha:** the user's Chrome is 124, older than Playwright's Chromium; `zoom` and `<button>` content stretching behave differently there (see `docs/frontend-ui.md`).

## Architecture

MERN monorepo (`client/` + `server/`), no shared package between them.

### Backend (`server/src/`)

Express with ES modules. Route groups:

- `/api/auth` — register, login, `GET /me`
- `/api/locations` — CRUD + cover upload; GET routes use `optionalAuth`, write routes `protect` (edit/cover/delete are admin-only: `utils/admin.js`, `adminOnly`)
- `/api/checkins` — check-in, history (no undo — check-ins are permanent)
- `/api/user` — XP progress, achievements, history progress, consent, treasures
- `/api/history` — History Timeline events, read-only (`optionalAuth`; content is hand-curated via a seed script)

**Key patterns:**
- Location slugs are the canonical identifier throughout (not `_id`). All routes are `:slug`-based.
- `GET /api/locations` excludes `description`. `GET /api/locations/:slug` includes it and lazily generates missing languages with Gemini (saves and returns in the same request).
- **Stories are only for those who collected the card:** for anyone who hasn't checked in there (and didn't add it), the server cuts `description` to a teaser and sets `storyLocked: true`. Details in `docs/backend-notes.md`.
- **Database round trips:** start independent queries together (`Promise.all`), reuse loaded lists, use `batchSize(BIG_BATCH)` on big finds. Cards come from the in-memory catalog (`services/locationCatalog.js`, `withLocations` instead of `populate('location')`); its objects are shared between requests, never mutate them. Details in `docs/backend-notes.md`.
- GPS distance validation is in the checkin controller; skipped in `NODE_ENV=development`.
- **Treasure Hunt (寻宝)** on `/treasure-hunt`: **read `docs/treasure-hunt.md` before changing anything about the hunt** (the rules' clue table and `utils/huntRules.js` must mirror the server constants; don't tune it toward quick or easy).
- Rarity and XP are coupled: `RARITY_XP` in `data/rarityMap.js` is the single source of truth; `resolveRarity` (a `pre('validate')` hook on `Location`, also applied by `seedLocations.js`) keeps `rarity`/`xpReward` in step. Every `outside` card is `expedition` (XP by distance, `EXPEDITION_XP_STEPS` / `EXPEDITION_XP_OVERRIDES`), cards in `SECRET_SLUGS` are `secret`; run `npm run sync:expedition` after changing any of these. **Read `docs/rarity-and-cards.md` first.**

**Models:**
- `Location` — `name` (EN display), `slug`, `localizedNames: { cz, zh }`, `labels[]`, `coordinates: { lat, lng }`, `description: { en, cz, zh }`, `rarity`, `xpReward`, `wikipediaUrl`, `coverImage`, `pixelArtKey`, `addedBy` (`null` = preset), `district`, `quarter`
- `CheckIn` — `user`, `location` (ObjectId ref), `createdAt`
- `User` — `username`, `email`, `passwordHash`, `xp`, `achievements[]`, `packs`, `historyProgress`, `locationConsent`
- `HistoryEvent` — see `docs/history-writing.md` (trilingual `title`/`hookLine`/`summary`/`year`, `quotes`, `relatedLandmarks`, `images`/`imageCaptions`, `cardType`, inline `[[link:slug]]…[[/link]]`, `[[b]]…[[/b]]` and `[[quote:N]]` markup)

**Gamification** (`services/gamification.js`): `LEVELS` (100) and `ACHIEVEMENTS` are authoritative. Achievements pay XP (`ACHIEVEMENT_XP`: easy 25, medium 150, hard 400, extreme 800; shown as Bronze/Silver/Gold/Diamond). **Read `docs/achievements.md` before adding, renaming or rebalancing an achievement** (design, stories, icons, unlock flow, check-in reward, frontend). A new historical/cultural achievement needs a story (`data/achievementStories.js`) and an icon (`client/public/achievements/<id>.webp`).

**Card packs** (卡包): cards of one connected, walkable area; config `server/src/data/packs.js`, texts `data/packDescriptions.js`. **Read `docs/card-packs.md` before adding, changing or retiring a pack.**

### Location content — hard rules (full rules in `docs/locations.md`)

- Every entry needs `description: { en, cz, zh }`: ~50-word humorous opening, one or two main paragraphs, a `🎁 Bonus:` / `🎁 彩蛋：` closer. No Czech-name glosses in EN/ZH.
- A Location card never references the History Timeline as a shared narrative.
- Coordinates are always supplied by the user; never look them up.
- No `landmark` label on new entries; `legend` only for genuinely monumental buildings.
- Outside Prague: label `outside` (last); inside: `district` + `quarter` from ČÚZK RÚIAN.
- Expedition cards must be worth a trip on their own; a non-Prague city gets one card (Kutná Hora / Olomouc-style exceptions are the user's call); nothing outside the Czech Republic; no ticket-only spots. Check History links before deleting a card.
- After writing entries, run `node src/data/seedLocations.js` (from `server/`) without asking.
- Query the live DB, not just the seed file — many cards exist only in the DB, and the DB can drift from the seed.

### History Timeline — hard rules (full rules in `docs/history-writing.md`)

- Three languages for every field; wry deadpan voice for pre-modern eras, restrained for the 20th century, solemn for atrocities.
- Few em-dashes; short paragraphs with the same breaks in EN/CZ/ZH; no "this timeline" self-reference; vary forward-hook closers; ZH cards ≤ ~1000 characters.
- Search for a primary-source quote for every card (`quotes[]` + `[[quote:N]]` on its own paragraph); proactively suggest background cards, territory maps, film/artwork references.
- Background cards never get `relatedLandmarks`; give a new one an entry in `server/src/data/backgroundHosts.js` when needed.
- `hookLine` never carries `[[link]]`/`[[b]]`; links stay short and outside bold spans.
- `relatedLandmarks` slugs must exist in the live DB (unresolved ones are silently dropped).
- Run `node src/data/seedHistoryEvents.js` after writing; it's `$setOnInsert`, so sync edits to seeded events manually (`{ w: 'majority', j: true }`, re-verify from a fresh connection). Run `node --check` after every large edit to the seed file.
- **Read `docs/history-era-notes.md` before writing or editing a card, or splitting or renaming an era**, and `docs/illustrations.md` before writing any illustration prompt.

### Frontend (`client/src/`)

React 18 + Vite SPA on Vercel (`vercel.json` lives in `client/`). **Per-feature design decisions and gotchas are in `docs/frontend-ui.md` (Explore, Map, Guide, profile, card showcase, detail windows, page turns, fonts, covers, PWA, consent) and `docs/history-frontend.md`; read the relevant section before changing a page.**

- **Routing** (`App.jsx`): all routes use `<ProtectedRoute guestOk>`, which auto-enters guest mode instead of redirecting to `/login`.
- **State:** `AuthContext` (`user`, `guest`, `loading`); `LanguageContext` (`lang` en/cz/zh, `zhVariant` cn/tw, `useT(key)`, `useConvert()` via opencc-js).
- **API layer** (`services/api.js`): one axios instance (`localhost:5000` in dev, `prague-stories-api.onrender.com` in prod), JWT from `localStorage`; its response interceptor dispatches achievement unlocks and check-in rewards.
- **i18n:** all UI strings are in the `T` object in `LanguageContext.jsx`. `name` IS the English display field (generic terms translated, proper names stay Czech); always set `localizedNames.cz`/`.zh` with any name change.
- **Labels:** names/emoji/colours in `LABEL_DEFINITIONS` / `LABEL_COLORS`, groups in `LABEL_GROUPS` (`utils/pixelArtMap.js`; every label must be in a group). Tagging rules in `docs/locations.md`.
- **Pixel art / covers:** local-first from `client/public/pixel-art/` via `coverManifest.json`, Cloudinary as fallback; local wins only if not older than the Cloudinary upload. Name manually added art `<slug>-v<Date.now()>.webp`, run `npm run generate:covers`, and commit `thumbs/` with it. Never copy an existing WebP as a placeholder.
- **Location consent (GDPR):** never ask the browser for a position before consent (`utils/locationConsent.js`); raise `LOCATION_CONSENT_VERSION` when the dialog or notice changes what it says about location. Remind the user to add a controller name in `PrivacyPage.jsx` before public launch.
- **Windows and pages:** a new window uses `useWindowEntrance(onClose)` and closes through `close`; a new heavy page waits with `useAfterTurn()`; pages cache per player in `utils/pageCache.js`.
- **Card motion:** only animate `transform`/`opacity` on cards (see `docs/rarity-and-cards.md`).
- **CSS gotchas:** don't truncate-and-rewrite CSS files while the dev server runs (Vite may serve an empty stylesheet); `.guide-page`'s `overflow-y: auto` breaks `position: sticky` (see `docs/history-frontend.md`); measure inside zoomed containers with `viewportRect` (`utils/fitPage.js`).
- **Name:** the app is **Praguedex** (`appName`); Explore is "the Dex" in the UI. Infrastructure (Render API, Cloudinary folder, Mongo DB name, local folder) keeps the old "prague-stories" name on purpose.

## Deployment

- Frontend → Vercel (root set to `client/`); the user views the live site, so new covers show only after commit + push + deploy
- Backend → Render (`prague-stories-api.onrender.com`)
- Images → Cloudinary (`prague-stories/covers/<slug>`)
- DB → MongoDB Atlas, AWS Frankfurt (eu-central-1), next to Render. Moved from N. Virginia on 2026-11-13 with `server/src/data/copyDatabase.js`; the old cluster is `OLD_MONGO_URI` in `server/.env` until it gets deleted.
