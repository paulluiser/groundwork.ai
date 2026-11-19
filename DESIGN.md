---
name: Groundwork
description: A free course for software teams on checking AI's work. Quiet, exact, tool-like. Neutral surfaces, near-black ink, one green accent.
colors:
  bg: { light: "#FAFAF9", dark: "#0B0B0A" }
  surface: { light: "#FFFFFF", dark: "#141413" }
  subtle: { light: "#F3F3F1", dark: "#1C1C1A" }
  line: { light: "#E6E5E2", dark: "#272725" }
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
  sans: "Geist, ui-sans-serif, system-ui, sans-serif"
  mono: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  scale: { display: "clamp(40px, 5.4vw, 64px)/1.02 600 -0.04em", h1: "34px/1.12 600 -0.03em", h2: "22px 600 -0.018em", h3: "17-18px 600", lede: "18px/1.6", body: "16px/1.6", small: "14px", caption: "12-13px" }
radius: { sm: "6px", md: "10px", lg: "14px", full: "999px" }
depth: "Borders. Shadows only on layers that float: dialogs, pop-ups, the hero card."
---

# Groundwork design

The live reference is the Groundwork design system artifact. In code, the system is the "Design system v2" section at the end of `assets/style.css`, followed by the "Design engineering pass". Change values there.

## Design read

A self-paced course (explain and practise) for software teams, with an established brand (the original logo and design system v2), leaning toward a quiet technical tool, because the audience works in developer tools all day and the page's main job is focused reading.

Dials, from the design-engineering suite:

- DESIGN_VARIANCE 4: one asymmetric split (the landing hero), predictable course screens.
- MOTION_INTENSITY 4: state transitions everywhere, one signature moment per page (the hero check card, which changes only when a role is picked; the lesson simulation). Nothing loops or plays on a timer.
- VISUAL_DENSITY 5: lessons breathe; course lists and the tree are compact.

## Type

- Geist for display and body, Geist Mono for numbers, lesson numbers, keyboard hints and code. Reason: Geist was drawn for developer tools, so the course reads like the tools its audience already uses; one family keeps a reading product calm, and the mono carries the technical voice in figures.
- Sentence case for every heading, tab, badge and button. No tracked capitals.
- Three weights: 400, 500 and 600. Hierarchy comes from size and colour, not from bold. No negative letter spacing under 16px.
- Headings, captions, buttons and short status lines end without a period; only multi-sentence paragraphs keep them.

## Colour

- One accent, green, for progress and position only: current step, done checks, progress bars, the section being read, correct answers.
- Status tints (info, idea, warning, danger) appear only where they carry meaning, always with a word or an icon too.
- Text pairs hold at least 4.5:1 and control edges and focus at least 3:1 in both themes.

## Layout

- Course screens use four zones: top bar, course tree, reading column (at most 68 characters), right panel with "You'll learn" and "On this page".
- Landing: split hero (headline, one line, one primary action, the check card on a plain tint panel), role choice, a proof band of real figures, a closing band. No two consecutive sections share a layout.
- One primary action per viewport; top-bar links on bare pages are secondary.

## Components and states

- Every control has rest, hover, pressed, focus-visible and disabled states; busy labels end with an ellipsis ("Saving…").
- Touch targets are at least 44 by 44 on touch screens.
- Quotes and ellipses are typographic in rendered copy (a typesetting pass runs on every render).

- Verdict marks (stamps and fit labels) share one shape, 6px corners, and keep the shape code: solid confirmed, outlined check it, dashed uncertain. They are the product's signature and appear only where something is being judged.

## Logo

The original artwork in `assets/brand/`: ink on light, reversed on dark, and the G mark alone below 120px of width. Never redraw it.

## Verification

Audit with the unslop skill (by Damir Sokolovsky, @heydamir, CC BY 4.0) and the design-engineering suite: anti-slop rules, the interface linter, and the six-width responsive check (320, 375, 425, 768, 1024, 1440) in both themes.
