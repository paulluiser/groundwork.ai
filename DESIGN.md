---
name: Kern
description: A free course for software teams on understanding AI and its use cases. Quiet, exact, tool-like. Warm paper surfaces, near-black ink, one green.
colors:
  bg: { light: "#F5F3EE", dark: "#0B0B0A" }
  surface: { light: "#FBFAF7", dark: "#141413" }
  subtle: { light: "#ECE9E2", dark: "#1C1C1A" }
  line: { light: "#E2DED5", dark: "#272725" }
  line-strong: { light: "#8E8A83", dark: "#76726B" }
  ink: { light: "#111110", dark: "#F4F3F0" }
  ink-2: { light: "#3D3B37", dark: "#CFCCC6" }
  muted: { light: "#67645E", dark: "#9A968F" }
  accent: { light: "#17734D", dark: "#4CC38A" }
  accent-soft: { light: "#E7F3EC", dark: "#10291D" }
  focus: { light: "#1F5FA6", dark: "#80B4F0" }
  info: { light: "#1F5FA6", dark: "#80B4F0" }
  idea: { light: "#6A3DBF", dark: "#B9A0F3" }
  warning: { light: "#8A5300", dark: "#E2B25C" }
  danger: { light: "#B42318", dark: "#F2877C" }
typography:
  sans: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  mono: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  scale: { display: "clamp(36px, 5.4vw, 64px) 600 -0.02em", h1: "clamp(28px, 3.2vw, 40px) 600 -0.02em", h2: "24px 600 -0.01em", h3: "20px 600", lede: "18px", base: "16px", sm: "14px", caption: "13px", xs: "12px", micro: "11px" }
  leading: { tight: 1.1, snug: 1.3, text: 1.5, body: 1.6 }
radius: { sm: "6px", md: "10px", lg: "14px", full: "999px" }
depth: "Borders. Shadows only on layers that float: dialogs, pop-ups, the hero card."
---

# Kern design

The live reference is the design system artifact (made when the course was called Groundwork). In code, Kern's tokens live in `src/legacy/legacy.css` ("Design system v2"), and `src/index.css` maps them onto Tailwind and shadcn tokens. New UI uses shadcn components and Tailwind utilities on those tokens; never hard-code a colour or a px font size.

## Design read

A self-paced course (explain and practise) for software teams, with an established brand (the original logo and design system v2), leaning toward a quiet technical tool, because the audience works in developer tools all day and the page's main job is focused reading.

Dials, from the design-engineering suite:

- DESIGN_VARIANCE 3: a centred landing hero, predictable course screens.
- MOTION_INTENSITY 4: state transitions everywhere, one signature moment per page (the landing headline retyping its role; the lesson simulation). The worked example changes only when a role is picked.
- VISUAL_DENSITY 5: lessons breathe; course lists and the tree are compact.

## Type

- Geist Mono for everything: display, body, labels, numbers and code (changed 21 November 2026 at the project lead's request; Geist sans is no longer loaded). Reason: the course is for software teams, and a monospace face makes it read like the tools they already use. Hierarchy comes from size, weight (400 to 600) and colour. Mono is wide, so the phone tab bar labels drop to 10px with tight tracking to fit five.
- Sentence case for every heading, tab, badge and button. No tracked capitals.
- **One scale, defined once** (`--t-micro` 11, `--t-xs` 12, `--t-caption` 13, `--t-sm` 14, `--t-base` 16, `--t-lede` 18, `--t-h3` 20, `--t-h2` 24, `--t-h1` and `--t-display` fluid) in the Design system v2 `:root`. Every `font-size` in `style.css` uses a token; never write a px size. Leading uses `--lh-tight`, `--lh-snug`, `--lh-text` and `--lh-body`. On phones lede, h3 and h2 step down one notch. The two deliberate exceptions are the landing headline (its height is tuned to its line-height) and the 10px phone tab labels.
- **Three weights: 400, 500 and 600.** Geist Mono is loaded at exactly these, so 700 would be a browser-faked bold; `b`, `strong`, `th` and `dt` are set to 600. 400 is for text, 500 for UI and labels, 600 for headings and emphasis.
- **Tracking:** h1 and display -0.02em, h2 -0.01em, everything else 0. Monospace shouldn't be tightened at text sizes. Inline code is the text size (everything is already mono); code blocks use `--t-caption`.
- Headings, captions, buttons and short status lines end without a period; only multi-sentence paragraphs keep them.

## Colour

- Light is the default theme for everyone, whatever the system setting; dark is used only after someone picks it with the theme button (saved as `gw-theme`).
- Light surfaces are warm paper, not white: page #F5F3EE, raised surfaces #FBFAF7, tints #ECE9E2 and #E3DFD6, lines #E2DED5. Text on ink or green buttons is #FBFAF7 too. No pure white anywhere. Dark theme tokens are unchanged.
- The landing page uses the same tokens as the course, so it follows the theme.
- One green. It is the second slash of the logo and the rotating role in the landing headline; everywhere else it marks progress and position only: current step, done checks, progress bars, the section being read, correct answers.
- Status tints (info, idea, warning, danger) appear only where they carry meaning, always with a word or an icon too.
- Text pairs hold at least 4.5:1 and control edges and focus at least 3:1 in both themes.

## Layout

- Course screens use four zones: top bar, course tree, reading column (at most 68 characters), right panel with "You'll learn" and "On this page".
- Landing: a centred hero on the page background. The headline reads "Learn the basics of AI and its use cases for" and ends, on its own line, with a role in green (engineers, designers, product managers and so on, twelve in all) followed by a blinking block cursor. Every 2.4 seconds the role is deleted and the next one typed, like editing in a terminal. The headline keeps a fixed height so nothing below it moves; screen readers get one steady sentence, and under reduced motion the role swaps without typing. Below it: one line in ink-2, an ink primary button and a hairline secondary, and a quiet figures line. Then what you learn (six cards), the worked example with real course figures, and a closing call to action with a footer, all on course tokens. Everything is scoped to `.lx`.
- One primary action per viewport; top-bar links on bare pages are secondary.

## Components and states

- Every control has rest, hover, pressed, focus-visible and disabled states; busy labels end with an ellipsis ("Saving…").
- Touch targets are at least 44 by 44 on touch screens.
- Quotes and ellipses are typographic in rendered copy (a typesetting pass runs on every render).

- The progress meter is five small backslashes that turn green as lessons are done, echoing the logo. It appears on the course tree, path stages, tracks, the team board and practice, and nowhere else.
- Verdict marks (stamps and fit labels) share one shape, 6px corners, and keep the shape code: solid confirmed, outlined check it, dashed uncertain. They are the product's signature and appear only where something is being judged.

## Logo

The name is Kern (renamed from Loona, which was renamed from Groundwork). The mark is two backslashes, as a backslash is escaped in code: an ink slash and a green slash, equal length, round ends, stroke 4.4 on a 32-unit box. The ink slash uses currentColor and the green uses the accent, so both follow the theme. It sits beside the name in Geist Mono 600; below 760px only the mark shows. The favicon (`assets/brand/kern-mark.svg`) switches to light ink and light green in dark mode. The app and home-screen icons are the mark in paper and light green (#4CC38A) on an ink tile.

## Verification

Audit with the unslop skill (by Damir Sokolovsky, @heydamir, CC BY 4.0) and the design-engineering suite: anti-slop rules, the interface linter, and the six-width responsive check (320, 375, 425, 768, 1024, 1440) in both themes.
