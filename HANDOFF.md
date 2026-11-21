# Kern: project handoff

*Last updated 22 November 2026: moved to React, Tailwind CSS and shadcn/ui on the `react-shadcn` branch. The plain HTML/CSS/JS version is tagged `pre-react` (commit 40d7e29).*

Kern is a free, self-paced course for software teams on understanding AI and using it well at work. It is a React single-page app built with Vite, styled with Tailwind CSS v4 and shadcn/ui, with no server and no accounts. It is meant to be public and hosted on Vercel.

## Current state at a glance

| Area | Status |
|---|---|
| Core course (lessons 1–8) and capstone (45) | Done |
| Role tracks: 12 three-lesson tracks (36 lessons) | Done. All 36 written, sources checked |
| Roles: 33, each using one of the 12 tracks | Done (21 new roles share existing tracks; no specialist lessons yet) |
| Use cases tab | Done. 96 use cases, each with a step-by-step guide |
| Tabs: Lessons, Exercises, Use cases, Glossary, Progress | Done |
| Progress codes (no accounts) | Done. v2/v3 format; old v1 codes still restore |
| React + Tailwind + shadcn | On the `react-shadcn` branch. Every page ported; lesson text, exercises and figures run their original code |
| Vercel deployment | `main` deploys the pre-React site; the branch gets a preview deployment once pushed |

## Rolling back

The last plain HTML/CSS/JS version is the git tag `pre-react`. To go back: redeploy that commit in Vercel, or `git revert` the merge. The React version keeps the same localStorage keys (`gw-*`), progress-code format, `#hash` links and `sw.js` path, so nothing learners saved is lost either way. Its service worker cache is named `kern-v2`; if you roll back, bump the old `sw.js` cache name (to `kern-v3`) so devices drop the React files.

## Running it locally

```bash
npm install
npm run dev        # http://localhost:8766 with hot reload
npm run build      # type-check and build to dist/
npm run preview    # serve dist/ on 8766, the way Vercel will
```

`.claude/launch.json` has two entries for the Claude desktop app's preview: `kern` (dev server) and `kern-build` (the built site, needed to test the service worker).

## Deploying to Vercel

`vercel.json` sets the framework to Vite, the build command to `npm run build` and the output directory to `dist`, plus security headers and `no-cache` on `sw.js`. Routing uses `#` fragments (`#home`, `#how-models-work`, `#usecase/…`), so no rewrites are needed. Built files have content hashes in their names, so they can be cached; `index.html` and `sw.js` revalidate.

### Versioning

Every commit carries a version in the form `<number>.<YYYYMMDD>.<HHMM>`. Before each commit run `./scripts/bump-version.sh` (it rewrites `src/legacy/version.js` and prints the version), and start the commit message with it. The version shows at the bottom of the lesson list.

## Architecture

- **Theme.** `src/index.css` imports Tailwind, then the original stylesheet `src/legacy/legacy.css` inside a CSS layer (`@layer theme, base, legacy, components, utilities`). Tailwind utilities and shadcn components win over it; it still styles lesson text, exercises and figures. shadcn's colour tokens (`background`, `card`, `primary`, `muted`, `border`, `ring` …) are mapped in `@theme inline` onto Kern's own tokens (`--bg`, `--white`, `--ink`, `--tint`, `--line`, `--focus`), so both share one palette in light and dark. Kern extras are `brand` (the green), `brand-tint`, `ink-2`, `warning` and the `ex-*` exercise colours. Geist Mono comes from `@fontsource/geist-mono` (400, 500, 600) and is the only font. Tailwind's text sizes are replaced by Kern's scale (`text-2xs` 11 … `text-2xl` 24, `text-h1`, `text-display`).
- **Dark mode** follows `data-theme` on `<html>` (saved as the plain string `gw-theme`), through a custom `dark` variant. Light is the default.
- **Course data** stays as it was: `src/legacy/course.js`, `content/*.js`, use cases and guides, practice drafts, role examples, figures. `src/legacy/load.ts` imports them in their original order onto `window.GW`.
- **Logic** (`src/lib/kern.ts`) is ported line for line from the old `app.js`: roles and paths, storage keys, progress codes (`CODE_ROLES` and `CODE_LESSONS` are append-only), the exercise and search indexes. `src/lib/store.tsx` holds roles and progress in React state and writes the same keys.
- **Pages** are in `src/pages/`, built from shadcn components (`src/components/ui/`) and lucide icons. `src/App.tsx` is the hash router and keeps the old link formats: `#lesson-id/section-or-ex-N`, `#resume=CODE`, `#team=…`, `#usecase/slug`, `#glossary/term`, `#certificate/track`, `#practice/N`.
- **Lessons** (`src/pages/lesson.tsx`): the overview, plan, contents, footer and glossary popover are React. The lesson HTML is rendered once and then enhanced exactly as before (exercise framing, figures via `GW.figure`, knowledge checks, glossary terms, widgets via `GW.widgets`, citations, copy buttons). That code mutates the DOM, so the app doesn't use React StrictMode.
- **Loading.** `index.html` holds the first-load logo reveal and a skeleton inline, so they paint before the bundle; `src/main.tsx` fades the reveal out.
- **Offline.** `public/sw.js` (same path as before, cache `kern-v2`) precaches the page, bundle, stylesheet and icons it finds in `index.html`, and is network-first after that.

## File structure

```
index.html              Shell: meta, logo reveal and skeleton (inline), #root
package.json            Scripts and dependencies (React 18, Vite 6, Tailwind 4, shadcn on Radix)
components.json         shadcn settings (new-york style, lucide icons)
vite.config.ts          @ alias, relative base, single bundle
vercel.json             Vite build settings and headers
public/                 sw.js, manifest.webmanifest, brand/ icons (copied as-is)
src/
  main.tsx              Mounts the app, fades the logo reveal, registers the service worker
  App.tsx               Hash router, header, search, shortcuts, redirects
  index.css             Tailwind, layers, theme tokens, type scale, base resets for lesson text
  lib/kern.ts           Course logic and progress codes (same keys and formats as before)
  lib/store.tsx         Roles, progress, theme and hash state
  components/ui/        shadcn components (button, card, badge, tabs, dialog, command, sheet, popover …)
  components/shell.tsx  Header, phone tab bar, lesson list, search dialog, shortcuts dialog
  components/brand.tsx  The Kern mark and the five-slash progress meter
  pages/                landing, role-picker, home, lesson, exercises, use-cases, glossary, progress,
                        practice, review, team, certificate
  legacy/               The original course data and interactive pieces: course.js, content/, widgets*.js,
                        figures*.js, use-cases.js, use-case-guides*.js, practice.js, role-examples.js,
                        icons.js, version.js, legacy.css, print.css, load.ts
```

## How it works

### Flow and screens
- **Order of screens:** landing (`#welcome`) → **Start the course**, which says "Continue the course" when roles are already saved → role picker (`#role`) → course (`#home`).
- **Arrival pages** (`#welcome`, `#role`, and `#progress` before any roles are chosen) use the "bare" layout: a white glass bar with no tabs.
- **Course tabs:** Lessons (`#home`), Exercises (`#exercises`), Use cases (`#usecases`), Glossary (`#glossary`) and Progress (`#progress`).
  - On desktop the tabs are a segmented control in the top bar. Below 760px they become a bottom tab bar.
- **The lesson sidebar** appears only on lesson pages (`body.norail` hides it everywhere else).
- **`paintTopbar(mode, tab)`** in `app.js` controls all of this. `mode` is `"bare"`, `"tabs"` or `"lesson"`.

### Roles and paths
- **33 roles in six families** (`GW.roles` and `GW.families` in `course.js`), based on published job-demand data: BLS computer and IT occupations, CompTIA job-postings reports (via Lightcast), LinkedIn Jobs on the Rise 2026 and Robert Half's in-demand roles, plus three team roles (technical writer, delivery lead, project manager).
- **Tracks:** there are 12 three-lesson tracks (`GW.tracks`). Each role names its track in `track` (its own id when omitted), so several roles can share one, for example frontend developer, mobile developer, AI engineer, ML engineer and solutions architect all use the Engineering track. A specialist lesson for a role can be added later as a fourth lesson; until then the role card and home page name the track it uses. `trackIdOf()` and `trackName()` in `app.js` resolve this; use cases, role examples and practice drafts are filed by track id.
- **Role ids are stored in browsers and progress codes:** never rename or remove one. The original twelve kept their ids with new display names (Engineering is now "Software engineer", Operations "DevOps engineer", Customer support "Technical support specialist", and so on).
- **Role picker:** compact. One row of role chips per family (the track shows on hover), a filter box, and a short sticky "Your path" panel beside them with the chosen roles in order, a lesson count per track, the total and the Save button. On phones the panel sits below the chips and a sticky bar carries Save.
- **Choosing roles:** up to 3. The first pick is the **main role**. **General** can't be combined with other roles.
- **`routeFor(roles)`** builds the path:
  - **General or nothing:** core lessons 1–8, then the capstone.
  - **One role:** core, the role's full 3-lesson track, the first lesson of its neighbouring track (`also` in `GW.roles`, a track id), then the capstone.
  - **Several roles:** core, the main role's full track, the first lesson of each other role's track (shared tracks are not repeated), then the capstone.
- **Track lessons** carry `rid` (track id) and `step` (1–3) in `GW.lessons`. The first lesson of each track has the same id as its role.
- **Lesson numbers are fixed** in `course.js`. Any lesson whose content file isn't loaded is filtered out at startup, and the gaps in numbering are deliberate. Lesson text refers to other lessons by number, so **never renumber casually**. If the order changes, update every "lesson N" reference.

| # | Lesson id | # | Lesson id | # | Lesson id |
|---|---|---|---|---|---|
| 1–8 | core | 21 | security | 33 | project-management |
| 9 | product | 22 | security-threat-models | 34 | pm-planning |
| 10 | product-discovery | 23 | security-detection | 35 | pm-vendors |
| 11 | product-ai-features | 24 | data-analytics | 36 | engineering-management |
| 12 | design | 25 | data-analysis | 37 | em-measuring |
| 13 | design-research | 26 | data-quality | 38 | em-people |
| 14 | design-ai-ux | 27 | technical-writing | 39 | operations |
| 15 | engineering | 28 | docs-for-ai | 40 | ops-iac |
| 16 | engineering-agents | 29 | docs-maintenance | 41 | ops-llm |
| 17 | engineering-review | 30 | delivery | 42 | customer-support |
| 18 | qa | 31 | delivery-flow | 43 | support-knowledge |
| 19 | qa-automation | 32 | delivery-rituals | 44 | support-assistant |
| 20 | qa-ai-features | | | 45 | team-adoption (capstone) |


### Storage and progress codes
- **Storage:** everything lives in `localStorage`, with no accounts and no server.
  - `gw-roles` holds the chosen roles, `gw-progress` the completed lessons, `gw-pick` the role picker's draft, and `gw-still` the motion setting.
  - Added 20 November: `gw-practice` (practice calls and notes), `gw-review` (term boxes and due days), `gw-revscope`, `gw-team` (plan, pasted codes, your name), `gw-name` (certificate name), `gw-read` (where you stopped in each lesson) and `gw-ucfit`. None of these travel in a progress code.
  - `gw-role` and `gw-session` are retired keys that the app clears.
- **Progress code v2:** 75 bits, written as 15 characters in Crockford base32 and shown as `KN-XXXXX-XXXXX-XXXXX`.
  - Layout: version (4 bits), three role slots (4 bits each, 0 = empty), 51 lesson slots (1 bit each), then a CRC-8 check (polynomial 0x07).
  - Still produced whenever every chosen role is one of the original twelve, so existing learners keep short codes.
- **Progress code v3:** 120 bits, 24 characters, shown as `KN-XXXXXX-XXXXXX-XXXXXX-XXXXXX`. Used when a path includes one of the 21 newer roles.
  - Layout: version (4 bits), three role slots (6 bits each), 90 lesson slots, then the same CRC-8.
- **v1 codes** (9 characters, shown as `KN-XXX-XXX-XXX`) still restore. They cover the first 21 lessons.
- **`CODE_LESSONS` and `CODE_ROLES` in `app.js` are append-only.**
  - Never reorder or remove an entry, or every existing code decodes wrongly.
  - Version 2 holds lesson slots 1–51 and roles 1–13 of `CODE_ROLES`; version 3 holds 90 lesson slots and 63 roles. New specialist lessons go at the end of `CODE_LESSONS`.
- **Resume link:** `#resume=<code>` restores the code and opens `#home`. An invalid code opens `#progress` with the code filled in and an error shown.
- **What restoring does:** it switches to the roles in the code and keeps the union of completed lessons from both browsers.

### Exercises (widgets)
Each lesson contains `<div class="activity">` blocks with a `data-w` widget and a `data-cfg` key:
- `claims`: flag the sentences in an AI draft that have a problem. Each verdict `v` is one of `ok`, `bad`, `partial`, `none` or `judg`.
- `sort`: put items into buckets. Uses `buckets`, plus `items` with a correct-answer index `a`.
- `decide`: a run of situations with one choice each. Uses `steps`, each with `title`, `sit`, `opts: [[choice, feedback]]` and correct index `a`. Feedback for the correct option starts with "Right."
- Others such as `tokens`, `sampler`, `rerank`, `matrix` and `scenario` are specific to their lessons.

**Exercise theme:** inside a lesson every `.activity` is framed as its own block, never as lesson text: a dark band labelled "Exercise N of M" (amber `--ex-hue`) plus the widget kind, a dotted "workbench" body (`--ex-bg`, `--ex-dot`), and an "End of exercise" footer. The `--ex-*` tokens sit at the top of the lesson-overview block in `style.css`.

**Exercises tab:** the app finds every `.activity` block itself. It opens on a dashboard (progress for the current scope, an "Up next" card in the exercise theme, and kind filters grouped into four families by `EX_FAM`), then a list in the style of a problem set with To do / Done filters. An exercise counts as done when its lesson is complete. Rows link to `#lesson` with `data-scroll="ex-N"`.

### Loading states (assets/loading.js, inline CSS in index.html)
- **Logo reveal:** on the first load of a browser session (`sessionStorage` `kn-boot`), a full-screen overlay draws the two slashes in turn, then the wordmark. It fades once the app has painted and fonts are in, held for at least about 1.15s. If the app isn't ready by 1.3s the mark switches to the loader loop. A CSS fail-safe hides the overlay after 6s regardless.
- **Loader:** `GW.loader(label, "lg")`, the two slashes drawing and clearing in a loop. It's used for the QR code and the certificate canvas.
- **Skeletons:** `GW.skeleton()` or `GW.skeleton("square")`. Shimmering blocks fill `#view` in `index.html` until the first route renders; the QR panel uses the square one.
- The CSS sits inline in `<head>` so it paints before `style.css`. Reduced motion swaps the drawing for a static mark and a gentle pulse, with no shimmer.

### Icons (assets/icons.js)
- `GW.icon(name, cls)` returns one line set drawn like the topbar icons: 24px grid, 1.7 stroke, round caps, `currentColor`. They're decorative (`aria-hidden`); the text next to them carries the meaning.
- **Where they're used:** lesson fact chips and plan kinds; the exercise band; figure tags (one per figure kind); Exercises dashboard cards, kind families and rows; use case fit badges, guide links and guide sections. Add new icons to the `P` map in `icons.js`; don't paste one-off SVGs.

### Lesson overview and figures
- **Overview (compact):** a two-column landing that fits one screen. The left column holds the lesson number badge and part, the title, a row of fact chips with icons (minutes, sections, exercises, quiz questions, path step, completed), the lede, Start / Go to the exercises, then "You'll learn" (two columns, ticks as you read). The right column holds the **Lesson plan** (`planLesson()` in `app.js`): 36px rows, each tagged with an icon and a kind (Reading, Example, Exercise, Quiz or Task) plus minutes, the lesson's time split by word count and exercise time. Layout breakpoints use container queries on `.lesson`, so it stacks when the lesson column is narrow, not just on small screens.
- **Interactive figures** (`assets/figures.js` engine, `assets/figures-data.js` specs): one per lesson, inserted after the first paragraph of the section named in `at`. There are nine kinds chosen to fit the topic: flow, cycle, timeline, spectrum, matrix, zones, stack, compare and hotspots. Figures are part of the reading and styled as white cards, not like exercises. Matrix quadrants `q` are ordered top-left, top-right, bottom-left, bottom-right. Numbers in figures are illustrative and labelled as such.

### Use case guides
- Every use case has a guide in `assets/use-case-guides*.js`, keyed by its title in `use-cases.js`: `s` steps, `y` do, `n` don't, `t` tip, `k` limits, `p` an optional starter prompt. A use case's title is its key, so rename both together.
- Cards link to `#usecase/<slug of title>`. The page is registered in `GW.pages` (extras.js) and rendered by `renderUseCase()` in `app.js`, with steps, a copyable prompt, "Before you rely on it", Do / Don't / Tip / Limits in a sticky side column, and next or previous within the same track.

### Practice, review, teams and certificates (extras.js)
- **Pages:** `extras.js` registers routes in `GW.pages` (`#practice`, `#practice/N`, `#review`, `#team`, `#team=<link data>`, `#certificate/<track>`). `route()` in `app.js` checks `GW.pages` before its own pages. Each entry has `render(arg)`, `title(arg)`, the tab to highlight, and `open: true` if it works without roles (only the team page).
- **You decide (`#practice`):** the learner picks Ship it / Ship after edits / Don't ship and writes a note (12 characters minimum) before the reviewer's answer opens. Drafts live in `assets/practice.js`, written for practice with no real people or figures. To add one, append to the list and never reorder it: results are stored by position.
- **Review (`#review`):** Leitner boxes over the glossary. By default only terms whose lesson is completed. Up to 15 due cards plus 5 new ones a visit. Box intervals are 1, 2, 4, 8 and 16 days.
- **Team plans (`#team`):** a lead picks lesson groups (core, any role track, capstone) and shares a link. The link carries only the team name and lesson slots from `CODE_LESSONS`, base64url-encoded. The board is built from progress codes pasted as `Name: LN-…` lines and is stored only in that browser.
- **Certificates:** offered on the Progress page for the core lessons, each of your role tracks and your whole path once complete. Drawn on a canvas and downloaded as a PNG. They say plainly that they are self-reported.
- **QR code:** the Progress page loads `qrcode-generator@1.4.4` from jsDelivr when the QR panel is opened, and encodes the resume link.

### Lesson helpers
- Copy buttons on `pre.code` and `.draft.prompt` blocks.
- Every section heading gets a link button. Section links look like `#<lesson-id>/<heading-id>` and open the lesson at that section.
- "Continue from …" appears under the lesson meta when the reader left an unfinished lesson part-way (`gw-read` keeps the furthest section).
- Glossary terms open on hover for mouse users, after 350ms. Click and keyboard work as before.
- Keyboard: `/` or ⌘K search, `j` and `k` next and previous lesson on your path, `?` lists the shortcuts.

### Offline (sw.js)
- On install, the service worker reads `index.html` and caches every `assets/` and `content/` file it references, so new lesson files are picked up without editing `sw.js`.
- Pages and files come from the network first (always revalidated), with the cache as the fallback offline. Fonts and CDN libraries are served from the cache and refreshed in the background.
- It registers only on HTTPS or localhost. To force every visitor onto a clean cache, change `CACHE` in `sw.js`.

### Use cases
- **Finder:** filter by role scope, fit level and free text. Search also finds use cases and opens the card.
- **Data:** `GW.useCases` holds entries of the form `{ r: roleId, t: title, fit: "good" | "care" | "human", d: whatAIDoes, c: whatToCheck, l: lessonId }`.
- **Where it shows:** `renderUseCases()` groups them by role, with your roles first, and offers a choice between "Your roles" and "All roles".
- **Tab visibility:** the tab is hidden until the array has content.

## Writing a new lesson

Use `content/08-2-product-discovery.js` as the template. Each lesson has:
- A **lede** and **4 outcomes**.
- A **fit table** using `fit good`, `fit care` and `fit human`.
- A worked example with **one activity**, followed by a `.steps` breakdown.
- One `.key` idea.
- A pitfalls list.
- A "Try it this week" `.aside`.
- **Three checks**, each `<div class="check" data-a="N">` with `data-fb` feedback on every option.
- Numbered **sources**.

Rules:
- **Sources must be real.** Use links you have checked. Never invent a study, a statistic or a quotation.
- **Watch apostrophes in single-quoted JS strings.** For example, `source:` fields use single quotes, so escape the apostrophe (`I\'d`). Run `node --check` on every new file.
- **Refer to lessons by their fixed number,** for example "(lesson 7)". Glossary terms use `<a class="term" data-t="key">`.
- **Keep the house style:** sentence case, plain English, no middle-dot lists, no tracked capitals.
- **When a new file is ready,** add its `<script>` tag to `index.html` right after the role's first lesson (as in `08-product.js` → `08-2-…` → `08-3-…`). The lesson then appears automatically.

## Tasks left

### 1–3. Lessons, use cases, checks and docs: done (19 November 2026)
- All 19 remaining role-track lessons are written and wired into `index.html`. Every source was opened and checked.
- `assets/use-cases.js` has 96 entries, 8 per role.
- Browser checks passed at 1280px and 375px: single- and multi-role paths, every new exercise, the Exercises and Use cases tabs, the five-item phone tab bar, no overflow, no console errors.
- Linters: sloplint 0 FAIL, 0 WARN; impeccable detect advisories only.
- DESIGN.md, PRODUCT.md and `.impeccable/design.json` describe the Use cases tab, the decide exercise and the 3-lesson tracks.

### UI review pass: done (19 November 2026)
All 31 findings from the UI review are resolved:
- **Landing:** one worked example (an AI draft and its human check) with role buttons to swap it. No blur, marquees or load animations. "Lesson 1 takes 20 minutes" sits beside Start, and the closing panel is compact on phones.
- **Role picker:** short, parallel role lines that stay visible on phones. General has its own row. The sticky bar shows the chosen roles, lesson count and a "Review your path" button.
- **Lessons tab:** a progress bar, an Up next card, and Your path / Full library views. Path rows are grouped by stage and numbered by position.
- **Lesson reader:** the meta line shows position and duration only. "On this page" sits under the title on smaller screens. Completion and next-lesson controls come before Sources, and the sidebar's active row is softer.
- **Exercises:** compact rows grouped by lesson, with completion shown at the group heading. The code test shows input and result first. The sampler tally is aligned rows. The risk matrix choices follow the 2×2 layout. Next has its own row in the scenario and decide exercises.
- **Search, glossary and progress:** search shows a best match first, then Lessons, Sections and Terms. The glossary has a count, a Clear button and a no-match message. On the progress page, Continue learning is the primary action, followed by "Copy resume link".
- Checked at 1024px, 768px and 375px. Linters: sloplint 0 FAIL and 0 WARN, impeccable advisories only.

### 4. Deploy and retire the artifact
- Deploy to Vercel (see above).
- Then delete or leave alone the private claude.ai artifact (https://claude.ai/artifact/XNbkFYixzMsetoSspNJ58z, version 7), so there's only one live copy.
- Progress saved there doesn't carry over to the website. Learners can move it with a progress code.

### 5. Nice to have
- A share image (`og:image`) for link previews.
- A short About or privacy note saying that progress stays in the browser.
- Optional analytics without cookies, if the team wants usage numbers.

## Known issues and decisions
- **Renamed to Kern** (from Loona, earlier Groundwork). New progress codes start with KN-; codes that start with LN- or GW- still restore. The `GW` JavaScript namespace and the `gw-` browser-storage keys keep their old names on purpose: they are invisible, and renaming the storage keys would wipe everyone's saved progress. The repository and the project folder still use the first name.
- **Landing page:** plain HTML and CSS with no libraries. The rotating role in the headline is `HERO_ROLES` and `startRoles()` in `assets/app.js`; `route()` stops the timer when you leave the page. The moon scene, three.js, Lenis and NASA's model were removed in the Kern rebrand.
- **Copy buttons:** the progress page falls back to a "copy it yourself" message when the clipboard API is unavailable. That happens in sandboxed frames, such as the old artifact. On the real website it should work, but **test it once after deploying**.
- **Resume links** use `location.origin + location.pathname`. They're correct on the website and unreliable inside the artifact.
- **Decided: no accounts and no database.** Progress codes carry progress between devices. Adding Google sign-in would need a backend, which was deliberately left out.
- **Design system:** "Clear Glass, One Pencil", an Apple-style system.
  - System font, near-black type and one cobalt accent (#2F4BFF).
  - Glass only on the top bar and the phone tab bar, with fallbacks for reduced transparency and higher contrast.
  - Press feedback of `scale(.97)`, switched off for reduced motion.
  - DESIGN.md is the source of truth.
- **Content principles** are in PRODUCT.md: status is shown by shape as well as colour, there are no invented metrics or testimonials, and every claim is traceable.
