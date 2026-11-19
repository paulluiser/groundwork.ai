# Groundwork: project handoff

*Last updated 19 November 2026.*

Groundwork is a free, self-paced course for software teams on understanding AI and using it well at work. It is a static website (HTML, CSS and plain JavaScript) with no framework, no build step, no server and no accounts. It is meant to be public and hosted on Vercel.

## Current state at a glance

| Area | Status |
|---|---|
| Core course (lessons 1–8) and capstone (45) | Done |
| Role tracks: 3 lessons for each of 12 roles (36 total) | 17 of 36 written. 19 still to write (see [Tasks left](#tasks-left)) |
| Use cases tab | Code done. Content not written, so the tab hides itself |
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

Then open http://localhost:8765. The `.claude/launch.json` file runs the same command for the Claude desktop app's preview.

## Deploying to Vercel

1. Import the GitHub repository in Vercel.
2. Framework preset: **Other**. No build command. Output directory: the repository root.
3. `vercel.json` already sets basic security headers and a revalidating cache policy. The files have no content hashes in their names, so they must not be cached for long.

Routing uses `#` fragments (`#home`, `#exercises`, `#how-models-work`), so no rewrites are needed.

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
| 9 | product | 22 | security-threat-models ✗ | 34 | pm-planning ✗ |
| 10 | product-discovery | 23 | security-detection ✗ | 35 | pm-vendors ✗ |
| 11 | product-ai-features | 24 | data-analytics | 36 | engineering-management |
| 12 | design | 25 | data-analysis ✗ | 37 | em-measuring ✗ |
| 13 | design-research | 26 | data-quality ✗ | 38 | em-people ✗ |
| 14 | design-ai-ux | 27 | technical-writing | 39 | operations |
| 15 | engineering | 28 | docs-for-ai ✗ | 40 | ops-iac ✗ |
| 16 | engineering-agents | 29 | docs-maintenance ✗ | 41 | ops-llm ✗ |
| 17 | engineering-review ✗ | 30 | delivery | 42 | customer-support |
| 18 | qa | 31 | delivery-flow ✗ | 43 | support-knowledge ✗ |
| 19 | qa-automation ✗ | 32 | delivery-rituals ✗ | 44 | support-assistant ✗ |
| 20 | qa-ai-features ✗ | | | 45 | team-adoption (capstone) |

✗ = not written yet.

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

### 1. Write the 19 remaining role-track lessons
The titles, summaries and minutes are already in `assets/course.js`. Each file's name and planned exercise:

| File | Exercise plan |
|---|---|
| `10-3-engineering-review.js` | claims: an AI code-review summary (missed authorization check, invented package, weakened test). Sources: Pearce et al. 2021 (*Asleep at the Keyboard?*), Perry et al. 2022, Spracklen et al. 2024 (package hallucination) |
| `11-2-qa-automation.js` | claims: a generated test suite's description (tests that assert nothing, flaky waits). Sources: Google Testing Blog on flaky tests (2016), Meta TestGen-LLM (Alshahwan et al. 2024), mutation testing |
| `11-3-qa-ai-features.js` | sort: eval set, regression check or production monitoring. Sources: Hamel Husain on evals, Zheng et al. 2023 (LLM-as-judge), Ganguli et al. 2022 (red teaming) |
| `11b-2-security-threat-models.js` | sort: match risks to the OWASP Top 10 for LLM applications (2025). Sources: OWASP GenAI, MITRE ATLAS, Greshake et al. 2023, the "lethal trifecta" |
| `11b-3-security-detection.js` | claims: an AI incident summary. Sources: UK NCSC report on AI's near-term effect on the cyber threat (2024), MITRE ATLAS |
| `11c-2-data-analysis.js` | claims: an AI analysis write-up (Simpson's paradox, multiple comparisons). Sources: Bickel et al. 1975, Anscombe 1973, ASA statement on p-values (2016) |
| `11c-3-data-quality.js` | sort. Sources: dbt data tests docs, GDPR Article 4 definitions, Spider 2.0 |
| `11d-2-docs-for-ai.js` | sort. Sources: llms.txt, Diátaxis, Anthropic's "contextual retrieval" post |
| `11d-3-docs-maintenance.js` | claims: AI-drafted release notes. Sources: Vale, Keep a Changelog, Write the Docs on docs as code |
| `12-2-delivery-flow.js` | claims: an AI flow-metrics analysis. Sources: DORA metrics guide, DORA 2024 report |
| `12-3-delivery-rituals.js` | decide: recording consent, retro synthesis, safety. Sources: the Retrospective Prime Directive, Atlassian's retrospective play |
| `12b-2-pm-planning.js` | claims: an AI-drafted schedule. Sources: Buehler et al. 1994 (planning fallacy), Flyvbjerg on megaprojects |
| `12b-3-pm-vendors.js` | sort: are an AI vendor's answers acceptable? Sources: UK Guidelines for AI procurement, NIST AI RMF |
| `12c-2-em-measuring.js` | claims: an "AI productivity report". Sources: METR 2025, Peng et al. 2023, DORA 2024, SPACE (Forsgren et al. 2021) |
| `12c-3-em-people.js` | decide: interviews, onboarding, junior growth. Sources: EU AI Act Annex III, NYC Local Law 144, Reuters 2018 on Amazon's recruiting tool |
| `13-2-ops-iac.js` | claims: a summary of generated Terraform or Kubernetes config. Sources: Terraform `plan` docs, Open Policy Agent |
| `13-3-ops-llm.js` | decide: provider outage, cost spike, model change. Sources: Google SRE book on cascading failures, NIST AI RMF |
| `13b-2-support-knowledge.js` | sort. Sources: KCS (Consortium for Service Innovation) |
| `13b-3-support-assistant.js` | decide: launch, handoff, monitoring. Sources: The Markup 2024 on NYC's MyCity chatbot, Moffatt v. Air Canada, Brynjolfsson et al. 2023 |

All the sources above were chosen as real, well-known works. Still open each link and confirm what it says before citing it.

### 2. Write the use cases
Add about 8 per role (around 96 in total) to `assets/use-cases.js`.
- Mix the fit ratings.
- Give each one a concrete check.
- Link each to the most relevant lesson in that role's track.

### 3. Verify, lint and update docs
- **Browser checks** at 1280px and 375px:
  - The path for one role and for several.
  - Each new exercise.
  - The Exercises and Use cases tabs, including the five-item phone tab bar.
  - No horizontal overflow and no console errors.
- **Linters:**
  - `node <hallmark skill>/scripts/sloplint.mjs assets/style.css --genre editorial` (currently 0 FAIL, 0 WARN).
  - `<impeccable skill>/scripts/impeccable detect --json assets/style.css assets/app.js` (currently advisories only).
- **Docs:**
  - Add the Use cases tab and the "decide" exercise to DESIGN.md, and regenerate `.impeccable/design.json`.
  - Update PRODUCT.md to describe the 3-lesson tracks.

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
