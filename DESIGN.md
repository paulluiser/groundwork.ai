---
name: Loona
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
  sans: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  mono: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  scale: { display: "clamp(40px, 5.4vw, 64px)/1.02 600 -0.04em", h1: "34px/1.12 600 -0.03em", h2: "22px 600 -0.018em", h3: "17-18px 600", lede: "18px/1.6", body: "16px/1.6", small: "14px", caption: "12-13px" }
radius: { sm: "6px", md: "10px", lg: "14px", full: "999px" }
depth: "Borders. Shadows only on layers that float: dialogs, pop-ups, the hero card."
---

# Loona design

The live reference is the design system artifact (made when the course was called Loona). In code, the system is the "Design system v2" section at the end of `assets/style.css`, followed by the "Design engineering pass". Change values there.

## Design read

A self-paced course (explain and practise) for software teams, with an established brand (the original logo and design system v2), leaning toward a quiet technical tool, because the audience works in developer tools all day and the page's main job is focused reading.

Dials, from the design-engineering suite:

- DESIGN_VARIANCE 4: one asymmetric split (the landing hero), predictable course screens.
- MOTION_INTENSITY 4: state transitions everywhere, one signature moment per page (the landing moon; the lesson simulation). The worked example changes only when a role is picked.
- VISUAL_DENSITY 5: lessons breathe; course lists and the tree are compact.

## Type

- Geist Mono for everything: display, body, labels, numbers and code (changed 21 November 2026 at the project lead's request; Geist sans is no longer loaded). Reason: the course is for software teams, and a monospace face makes it read like the tools they already use. Hierarchy comes from size, weight (400 to 600) and colour. Mono is wide, so the phone tab bar labels drop to 10px with tight tracking to fit five.
- Sentence case for every heading, tab, badge and button. No tracked capitals.
- Three weights: 400, 500 and 600. Hierarchy comes from size and colour, not from bold. No negative letter spacing under 16px.
- Headings, captions, buttons and short status lines end without a period; only multi-sentence paragraphs keep them.

## Colour

- Light is the default theme for everyone, whatever the system setting; dark is used only after someone picks it with the theme button (saved as `gw-theme`).
- The landing page uses the dark theme's tokens in both themes (bg #0B0B0A, ink #F4F3F0, ink-2 #CFCCC6, muted #9A968F, accent #4CC38A); the moon scene uses info blue for its faint halo and warning gold for the marker pings.
- One accent, green, for progress and position only: current step, done checks, progress bars, the section being read, correct answers.
- Status tints (info, idea, warning, danger) appear only where they carry meaning, always with a word or an icon too.
- Text pairs hold at least 4.5:1 and control edges and focus at least 3:1 in both themes.

## Layout

- Course screens use four zones: top bar, course tree, reading column (at most 68 characters), right panel with "You'll learn" and "On this page".
- Landing: built from the GetLayers "Ascend" template prompt. The whole landing page floats over a fixed WebGL moon (`assets/landing-fx.js`, three r0.143 from unpkg). The moon is NASA's textured model (`assets/moon/moon.glb`, from solarsystem.nasa.gov, public domain, credited in the footer). Its coarse mesh is split 16 ways per triangle and pushed out to the interpolated radius, so the outline is smooth and the authored texture mapping and relief are kept; the 2048x1536 texture is copied to a 2048x2048 canvas so WebGL1 keeps every pixel. The shader adds gentle relief from the texture and fine 3D-noise roughness, and shades with Lommel-Seeliger reflectance under a fixed sun: evenly bright to the limb, a crisp terminator, faint earthshine. If the model can't load, a moon painted in code (separate albedo and height maps) takes its place. No atmosphere, so no rim glow; a faint halo, stars, motes and gold marker pings remain. It enters huge and low behind the hero, rises once on load, then zooms out and swings left and right as you scroll. Dark-theme tokens with the green accent, Geist Mono, glass sections, a staggered fade-up reveal and Lenis smooth scroll. Sections: hero (display headline at weight 600 in ink, one line in ink-2, an ink primary button (off-white with near-black text, as on other arrival pages) and a hairline secondary; no accent in the hero, then the role tracks as a quiet caption on a soft shadow), what you learn (six cards), the worked example with real course figures, and a closing call to action with a footer. The tokens are `--lx-*` and everything is scoped to `.lx` and `body.on-landing`, so course pages keep this design system. Under reduced motion the reveal shows at once and Lenis and the rise are skipped.
- One primary action per viewport; top-bar links on bare pages are secondary.

## Components and states

- Every control has rest, hover, pressed, focus-visible and disabled states; busy labels end with an ellipsis ("Saving…").
- Touch targets are at least 44 by 44 on touch screens.
- Quotes and ellipses are typographic in rendered copy (a typesetting pass runs on every render).

- Moon phases show progress: a disc that fills from new to full in the progress green as lessons are done, on the course tree, path stages, tracks, team board and practice. It's the brand's signature, so it's used for progress and nowhere else.
- Verdict marks (stamps and fit labels) share one shape, 6px corners, and keep the shape code: solid confirmed, outlined check it, dashed uncertain. They are the product's signature and appear only where something is being judged.

## Logo

The name is Loona (renamed from Groundwork). The mark is the broken halo: a full moon inside a halo with a gap, and a small moon that has slipped out through it. Three shapes share one centre: a disc (r 5.6), a 2.4-unit halo arc with round ends, and a small disc (r 2). It sits beside the name in Geist Mono 600, everything in currentColor so it follows the theme; below 760px only the mark shows. The favicon (`assets/brand/loona-mark.svg`, halo stroke 2.8 so it holds at 16px) and the home-screen icon are the mark in off-white on near-black.

## Verification

Audit with the unslop skill (by Damir Sokolovsky, @heydamir, CC BY 4.0) and the design-engineering suite: anti-slop rules, the interface linter, and the six-width responsive check (320, 375, 425, 768, 1024, 1440) in both themes.
