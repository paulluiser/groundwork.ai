---
name: Groundwork
description: AI for software teams. A calm, Apple-style course in white, near-black and one proofing blue.
colors:
  proof-cobalt: "#2F4BFF"
  cobalt-deep: "#1F38E0"
  cobalt-wash: "#EDF0FF"
  cobalt-rule: "#AEB9FF"
  paper: "#FFFFFF"
  ink: "#1D1D1F"
  ink-hover: "#3A3A3C"
  graphite: "#424245"
  secondary-grey: "#6E6E73"
  field-grey: "#8A8A8A"
  mute-grey: "#9A9A9A"
  rule-grey: "#D2D2D7"
  separator: "#E5E5EA"
  tint: "#F5F5F7"
  tint-deep: "#E8E8ED"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(56px, 7.6vw, 108px)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.028em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.022em"
  subtitle:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.016em"
  lede:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Segoe UI, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.53
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  code:
    fontFamily: "ui-monospace, SF Mono, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  stamp: "4px"
  row: "10px"
  control: "12px"
  panel: "14px"
  card: "18px"
  sheet: "24px"
  pill: "99px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  xxl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.proof-cobalt}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "9px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-deep}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 20px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.tint}"
  button-pill-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "9px 24px"
    height: "44px"
  button-pill-dark-hover:
    backgroundColor: "{colors.ink-hover}"
  button-pill-soft:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 24px"
    height: "44px"
  segmented-control:
    backgroundColor: "{colors.tint-deep}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.pill}"
    padding: "3px"
  segmented-selected:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  stamp-confirmed:
    backgroundColor: "{colors.proof-cobalt}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.stamp}"
    padding: "2px 9px"
  stamp-wrong:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.stamp}"
    padding: "2px 9px"
  grouped-list:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "14px 18px"
  exercise-card:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "18px 20px"
  activity:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "18px 22px"
  topbar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "52px"
---

# Design System: Groundwork

## Overview

**Creative North Star: "Clear Glass, One Pencil"**

Groundwork should feel like a well-made Apple app: quiet, exact and obvious. The reading page is white. The chrome is a thin pane of frosted glass that content scrolls under. Everything you can touch is a soft rounded shape that answers the moment you press it. One blue pencil, Proof Cobalt, marks what is confirmed, correct or ready to act on. The course teaches people to check AI work before trusting it, so the interface stays out of the way and keeps every verdict plain.

The app has two kinds of page. Arrival pages (landing, roles, progress code without roles) have a white glass bar and no tabs. Course pages share four tabs: Lessons, Exercises, Glossary and Progress. On desktop the tabs are a segmented control in the top bar. On phones they become a bottom tab bar with icons. Lessons add a light sidebar listing the path. Every other tab page is full width and centred.

Status never depends on colour alone. Confirmed is solid, check-it is outlined, uncertain is dashed, and wrong is solid near-black. A reader who can't tell blue from black still reads every verdict.

**Key Characteristics:**
- White pages, #F5F5F7 grouped surfaces, near-black type, one cobalt accent.
- The platform system font (SF Pro on Apple devices), with tracking that tightens as size grows.
- Translucent top bar and phone tab bar, both solid white under reduced transparency.
- Rounded grouped lists, pill buttons and a press response of scale(.97) on everything you can tap.
- A single light theme.

## Colors

White and near-black, with soft greys for grouping and one proofing blue for what is confirmed or actionable.

### Primary
- **Proof Cobalt** (#2F4BFF): primary actions, links, progress, the selected sidebar row, "correct" and "confirmed" states, the current tab on phones and the main-role badge. It stays near 10% of any screen.
- **Cobalt Deep** (#1F38E0): the hover state of primary buttons only.
- **Cobalt Wash** (#EDF0FF) with **Cobalt Rule** (#AEB9FF): exercise tags, the key-idea panel, correct-answer feedback, notices and selected role cards.

### Neutral
- **Paper** (#FFFFFF): pages, cards, activities and the selected segment.
- **Ink** (#1D1D1F): text, dark pill buttons, selected chips, code blocks and "wrong" stamps. **Ink Hover** (#3A3A3C) is its hover.
- **Graphite** (#424245): ledes, descriptions and secondary controls.
- **Secondary Grey** (#6E6E73): meta text, numbers, captions and unselected phone tabs.
- **Field Grey** (#8A8A8A) and **Mute Grey** (#9A9A9A): input borders, hover borders and placeholders.
- **Rule Grey** (#D2D2D7) and **Separator** (#E5E5EA): hairlines, inset row separators and card borders.
- **Tint** (#F5F5F7) and **Tint Deep** (#E8E8ED): grouped lists, exercise cards, the sidebar, asides and hover fills.

### Named Rules
**The Blue Pencil Rule.** Cobalt marks only something confirmed, correct, current or actionable. It is never decoration, never a heading colour, and never more than about a tenth of the screen.

**The Glass Chrome Rule.** Only chrome is translucent: the top bar and the phone tab bar. Never stack glass on glass, never put glass inside content, and always fall back to solid white when the device asks for reduced transparency.

## Typography

**Display, Body and Label Font:** the system font stack (-apple-system, BlinkMacSystemFont, SF Pro, Segoe UI, system-ui)
**Mono Font:** ui-monospace (SF Mono, Menlo), for code, prompts, logs and progress codes only

**Character:** one family, tuned by size. Large type is bold and tightly tracked. Reading text is regular, untracked and given room.

### Hierarchy
- **Display** (700, clamp(56px, 7.6vw, 108px), 0.94, -0.035em): the landing hero headline only.
- **Headline** (700, 48px, 1.05, -0.028em): page titles. Course home scales up to 56px. Tab page titles clamp from 36px to 48px.
- **Title** (700, 32px, 1.12, -0.022em): lesson sections, under a hairline rule. Section heads on tab pages are 22–28px.
- **Subtitle** (700, 24px, 1.2, -0.016em): subsections. Card and row titles use 17–21px at 600–700 with -0.012em to -0.016em.
- **Lede** (400, 21px, 1.45, -0.01em): the opening paragraph of a page, in Graphite.
- **Body** (400, 17px, 1.53): interface text. Lesson prose uses a 1.6 line height and a 38em measure, about 72 characters.
- **Label** (600, 13px): tags, meta and small headings, in sentence case and untracked. Phone tab labels are 11px.

### Named Rules
**The Tracking Follows Size Rule.** Letter spacing tightens as type grows and stays at zero for reading and labels. Never use one tracking value for every size, and never use uppercase with letter spacing.

**The Mono Is Material Rule.** Mono appears only where the content is code, a prompt, a log or a progress code. It is never used for a label.

## Layout

- **Top bar:** 52px of frosted glass with a hairline below. It holds the wordmark, the course tabs, the current path and search.
- **Tab pages** (Lessons, Exercises, Glossary, Progress): no sidebar. Content is centred at 1000px, and Progress at 760px.
- **Lesson pages:** a 280px Tint sidebar sits beside the reading page. The lesson column is 46em wide for exercises and figures, with prose capped at 38em, and a 176px "On this page" margin on the right.
- **Below 1220px:** the margin becomes a collapsible "On this page" box.
- **Below 960px:** the sidebar becomes a slide-in drawer opened from the menu button, which appears on lesson pages only.
- **Below 760px:** the tabs leave the top bar and become a four-item bottom tab bar with icons, clear of the home indicator. Pages gain bottom padding so nothing hides behind it.
- **Spacing:** steps of 4, 8 and 16px inside components. Sections are separated by 40–96px.

## Elevation & Depth

Depth comes from material, not lines: glass chrome over content, grey groups on white, and two soft shadows.

### Shadow Vocabulary
- **Raised** (`box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 0 0 .5px rgba(0,0,0,.04)`): the selected segment, activities, the progress-code card and the sidebar path card.
- **Lift** (`box-shadow: 0 2px 8px rgba(0,0,0,.06), 0 16px 40px rgba(0,0,0,.08)`): things that float over the page, such as the glossary popover, the search sheet, the sticky Continue bar, the hero fan and the drawer.

### Named Rules
**The Material Rule.** Content in the reading flow is flat or Raised. Only floating things get Lift, and only chrome gets glass.

## Shapes

- **Radii:** corners grow with the size of the object.
  - 4px: stamps and inline code.
  - 10px: sidebar rows.
  - 12px: inputs, panels and the base radius.
  - 14px: notices and the sidebar path card.
  - 18px: grouped lists, exercise cards, activities and role cards.
  - 24–28px: sheets and full-width bands.
  - Pills: every button, segment, tab, chip and tag.
- **Borders:** hairlines are 1px Rule Grey and turn Mute Grey on hover. There are no black rules.
- **Dashed borders:** they always mean "uncertain" or "check this". Never use them for decoration.

## Components

### Buttons
Pill-shaped, at least 44px tall, weight 600. They scale to .97 on press.
- **Primary:** Proof Cobalt with white text. Use it for the main action inside the course, such as Continue or Mark complete.
- **Ghost:** white with a Rule Grey outline. Use it for secondary actions such as Change roles.
- **Pill dark / pill soft:** use these on arrival pages and for progress codes. Ink is the main action ("Start the course", "Copy code"), and tint is the secondary one.
- **Done:** Cobalt Wash with cobalt text.
- **Focus:** a 3px Proof Cobalt outline, offset by 2px, on every interactive element.

### Segmented Control
The course tabs on desktop and the Exercises filter ("Your path" / "All lessons"). The track is a grey fill with 3px of padding. The selected segment is white with Raised, its state set through `aria-current` or `aria-pressed`.

### Tab Bar (phones)
Four equal items: Lessons, Exercises, Glossary and Progress. Each has a 24px line icon over an 11px label. The current item is cobalt. The bar is frosted glass with a hairline on top.

### Grouped Lists
Lesson lists sit in an 18px Tint group. Rows are separated by inset hairlines that start after the number column. Hover deepens the row to Tint Deep.

### Exercise Cards
On the Exercises tab, each card is an 18px Tint card holding a cobalt tag (Try it, Practice, Build it, Capstone), the exercise title, its kind and the lesson length. A ✓ marks a completed lesson. Each card opens its lesson at that exercise.

### Activities
Inside lessons, each activity is a white 18px card with a Rule Grey border and Raised. The header carries a cobalt-wash tag and a 21px title. There is no black bar.

### Stamps (signature)
Small verdicts with 4px corners in 13px text: confirmed is solid cobalt, wrong is solid ink, check-it is a dashed outline, and info is a cobalt outline.

### Inputs / Fields
White, with a 1px Field Grey border and 12px corners. The progress-code field is mono at 18px and uppercase. When the field is invalid, its border and a 1px outline turn ink, and the error sits right below it.

### Navigation
- **Top bar:** frosted glass, holding the wordmark, the tabs and, on the right, the path button ("Path: Engineering & Security") and search.
- **Sidebar** (lessons only): Tint, with lessons grouped by part. The current lesson is a cobalt row with white text, and done lessons get a filled cobalt ring.

## Do's and Don'ts

### Do:
- **Do** keep cobalt to confirmed, correct, current or actionable things, at about 10% of a screen.
- **Do** code every status by shape as well as colour: solid, outlined, dashed or ink.
- **Do** give everything you can tap a hover, a 3px cobalt focus ring, a press scale of .97 and a 44px minimum height.
- **Do** keep glass to the top bar and the phone tab bar, with solid fallbacks for reduced transparency and higher contrast.
- **Do** make the content visible without scripts and with reduced motion. Press scaling turns off under reduced motion.

### Don't:
- **Don't** add a dark theme, gradients, or a second accent colour.
- **Don't** use web fonts. The system font is the brand face.
- **Don't** use uppercase tracked labels, eyebrows, middle-dot meta strings or decorative status dots.
- **Don't** use black rules or heavy borders. Use hairlines and grey groups.
- **Don't** animate width, height, top or left. Animate transform and opacity only.
- **Don't** use a dashed border for anything except "uncertain".
