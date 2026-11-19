# Groundwork: project handoff

*Last updated 19 November 2026 (all lessons and use cases written; UI review pass done).*

Groundwork is a free, self-paced course for software teams on understanding AI and using it well at work. It is a static website (HTML, CSS and plain JavaScript) with no framework, no build step, no server and no accounts. It is meant to be public and hosted on Vercel.

## Current state at a glance

| Area | Status |
|---|---|
| Core course (lessons 1–8) and capstone (45) | Done |
| Role tracks: 3 lessons for each of 12 roles (36 total) | Done. All 36 written, sources checked |
| Use cases tab | Done. 96 use cases, 8 per role |
| Tabs: Lessons, Exercises, Use cases, Glossary, Progress | Done |
| Progress codes (no accounts) | Done. v2 format; old v1 codes still restore |
| Apple-style redesign | Done. Checked at 1280px and 375px |
| Standalone website conversion | Done. `index.html` is a complete page |
| Vercel deployment | Not done yet |
| Old claude.ai artifact | Still live (private, version 7, older content). Retire it once Vercel is live |

## Running it locally

Serve the folder with any static file server:

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765. The `.claude/launch.json` file runs the same server on port 8766 for the Claude desktop app's preview (8765 is often taken by another local server).

## Deploying to Vercel

1. Import the GitHub repository in Vercel.
2. Framework preset: **Other**. No build command. Output directory: the repository root.
3. `vercel.json` already sets basic security headers and a revalidating cache policy. The files have no content hashes in their names, so they must not be cached for long.

Routing uses `#` fragments (`#home`, `#exercises`, `#how-models-work`), so no rewrites are needed.

### Versioning

Every commit carries a version in the form `<number>.<YYYYMMDD>.<HHMM>`, for example `3.20261119.1345`. The number is the commit's position on `main`, and the date and time are UTC+8. Before each commit:

1. Run `./scripts/bump-version.sh`. It rewrites `assets/version.js` and prints the version.
2. Start the commit message with that version, for example `3.20261119.1345: Add version stamp`.

The site shows the version in small text at the bottom of the lesson sidebar. To check which commit is live, open `<site>/assets/version.js` or look at the sidebar, then find that commit with `git log --grep "^<version>"`.

## Design system

The visual rules live in the Groundwork design system (a private Claude artifact owned by the project lead): neutral surfaces, near-black ink, one green accent for progress, Geist and Geist Mono, hairline borders and soft depth, in light and dark themes.

- In code, the system is the last section of `assets/style.css` ("Design system v2"). It re-points every colour token for both themes and restyles components. Change values there, not in the older sections above it.
- The logo is the original artwork in `assets/brand/` (ink and reversed versions, plus the G mark for small spaces). Don't redraw it.
- Lessons use the four-zone layout: top bar, course tree, reading column, and a right panel with "You'll learn" (ticks as you read) and "On this page".
- Simulations use the `sim` widget in `assets/widgets-e.js`, configured in a lesson file through `GW.trackCfg`. Lesson 16 has the first one. Use one only where a process is clearer to watch than to read.

## File structure

```
index.html              Full page: top bar, tabs, rail, <main id="view">, script tags in load order
vercel.json             Headers for Vercel
assets/
  style.css             The whole design system. Hallmark stamp and waivers at the top; tokens on :root
  course.js             Manifest: GW.parts, GW.lessons (45), GW.roles (12), GW.glossary
  app.js                Routing, path logic, progress codes, all pages (landing, picker, tabs, lessons), search
  role-examples.js      GW.roleEx: per-role examples shown in the core lessons
  use-cases.js          GW.useCases: currently empty (the tab is hidden while it's empty)
  widgets*.js           Interactive exercises. widgets-e.js holds "decide" and merges GW.trackCfg into GW.cfg
  favicon.svg           The brand mark
content/
  NN-<id>.js            One lesson each, calling GW.lesson({ id, lede, outcomes, html })
  NN-2-<id>.js, NN-3-<id>.js   The second and third lessons of a role track
PRODUCT.md              Product context: users, purpose, principles, constraints
DESIGN.md               Design system ("Clear Glass, One Pencil"), as YAML front matter plus prose
.impeccable/design.json A copy of DESIGN.md in machine-readable form, used by the Impeccable design tool
.hallmark/              Notes from the Hallmark design tool
```

**Script order matters.** `course.js` loads first, then the content files, then `role-examples.js` and `use-cases.js`, then `widgets.js` through `widgets-e.js`, and `app.js` last. Content files run before the widgets, which is why the role-track lessons register their exercise configs in `GW.trackCfg`. `widgets-e.js` copies those into `GW.cfg`.

## How it works

### Flow and screens
- **Order of screens:** landing (`#welcome`) → **Start the course**, which says "Continue the course" when roles are already saved → role picker (`#role`) → course (`#home`).
- **Arrival pages** (`#welcome`, `#role`, and `#progress` before any roles are chosen) use the "bare" layout: a white glass bar with no tabs.
- **Course tabs:** Lessons (`#home`), Exercises (`#exercises`), Use cases (`#usecases`), Glossary (`#glossary`) and Progress (`#progress`).
  - On desktop the tabs are a segmented control in the top bar. Below 760px they become a bottom tab bar.
- **The lesson sidebar** appears only on lesson pages (`body.norail` hides it everywhere else).
- **`paintTopbar(mode, tab)`** in `app.js` controls all of this. `mode` is `"bare"`, `"tabs"` or `"lesson"`.

### Roles and paths
- **Choosing roles:** up to 3. The first pick is the **main role**. **General** can't be combined with other roles.
- **`routeFor(roles)`** builds the path:
  - **General or nothing:** core lessons 1–8, then the capstone.
  - **One role:** core, the role's full 3-lesson track, the neighbouring role's first lesson (`also` in `GW.roles`), then the capstone.
  - **Several roles:** core, the main role's full track, the first lesson of each other role, then the capstone.
- **Track lessons** carry `rid` (role id) and `step` (1–3) in `GW.lessons`. The first lesson of each track has the same id as its role.
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
  - `gw-role` and `gw-session` are retired keys that the app clears.
- **Progress code v2:** 75 bits, written as 15 characters in Crockford base32 and shown as `GW-XXXXX-XXXXX-XXXXX`.
  - Layout: version (4 bits), three role slots (4 bits each, 0 = empty), 51 lesson slots (1 bit each), then a CRC-8 check (polynomial 0x07).
- **v1 codes** (9 characters, shown as `GW-XXX-XXX-XXX`) still restore. They cover the first 21 lessons.
- **`CODE_LESSONS` and `CODE_ROLES` in `app.js` are append-only.**
  - Never reorder or remove an entry, or every existing code decodes wrongly.
  - Lesson slots 46–51 are free. Going beyond 51 lessons needs a v3 format.
- **Resume link:** `#resume=<code>` restores the code and opens `#home`. An invalid code opens `#progress` with the code filled in and an error shown.
- **What restoring does:** it switches to the roles in the code and keeps the union of completed lessons from both browsers.

### Exercises (widgets)
Each lesson contains `<div class="activity">` blocks with a `data-w` widget and a `data-cfg` key:
- `claims`: flag the sentences in an AI draft that have a problem. Each verdict `v` is one of `ok`, `bad`, `partial`, `none` or `judg`.
- `sort`: put items into buckets. Uses `buckets`, plus `items` with a correct-answer index `a`.
- `decide`: a run of situations with one choice each. Uses `steps`, each with `title`, `sit`, `opts: [[choice, feedback]]` and correct index `a`. Feedback for the correct option starts with "Right."
- Others such as `tokens`, `sampler`, `rerank`, `matrix` and `scenario` are specific to their lessons.

**Exercises tab:** the app finds every `.activity` block itself. The tab shows each exercise's tag, title and widget type, and links to `#lesson` with `data-scroll="ex-N"`.

### Use cases
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
- **Copy buttons:** the progress page falls back to a "copy it yourself" message when the clipboard API is unavailable. That happens in sandboxed frames, such as the old artifact. On the real website it should work, but **test it once after deploying**.
- **Resume links** use `location.origin + location.pathname`. They're correct on the website and unreliable inside the artifact.
- **Decided: no accounts and no database.** Progress codes carry progress between devices. Adding Google sign-in would need a backend, which was deliberately left out.
- **Design system:** "Clear Glass, One Pencil", an Apple-style system.
  - System font, near-black type and one cobalt accent (#2F4BFF).
  - Glass only on the top bar and the phone tab bar, with fallbacks for reduced transparency and higher contrast.
  - Press feedback of `scale(.97)`, switched off for reduced motion.
  - DESIGN.md is the source of truth.
- **Content principles** are in PRODUCT.md: status is shown by shape as well as colour, there are no invented metrics or testimonials, and every claim is traceable.
