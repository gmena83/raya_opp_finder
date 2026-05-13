## Overview

Raya Power's marketing canvas is a stark, high-contrast surface — `{colors.canvas}` is #000100, a near-pure black with a faint green tint that grounds the footer and dark sections. The primary background is a clean white (`{colors.background}` #ffffff), creating a bright, accessible foundation for solar energy products. On top sits a surface ladder for cards, panels, and lifted tiles, moving from light gray (`{colors.surface-1}` #f5f5f5) to warm cream tints (`{colors.surface-compare}` #fff7db). Dark text (`{colors.ink}` #000000 or #111111) carries the body and headlines, while subtle grays (`{colors.ink-muted}` #4b5563) support secondary information.

The defining chromatic accent is **Raya Amber/Yellow** `{colors.primary}` (#f5b419) — used on the brand mark, focus rings, text highlights (like "everyone" and "Different"), and the primary CTA button. A slightly deeper hover state (`{colors.primary-hover}` #f4b400) extends the same hue. The brand also utilizes a semantic green (`{colors.semantic-success}` #2e870d) for status indicators.

Display type runs Raya's custom stack led by **Work Sans** at weight 600 with tight letter-spacing scaling to -0.01em. The body family also uses Work Sans at weight 400. For subtitles and eyebrows, a distinct **Roboto Mono** is reserved, styled in uppercase with generous positive tracking (0.08em). Button and card typography is handled by the highly legible **Inter** font family.

The page rhythm balances **clean product photography** and **lifestyle imagery** — Raya's marketing leads with high-fidelity captures of people using the product and the solar pods themselves, framed in `{colors.surface-1}` panels with rounded corners (`{rounded.xl}` 16px).

**Key Characteristics:**
- **High-contrast dual-canvas system** — `{colors.background}` (#ffffff) for primary content, and `{colors.canvas}` (#000100) for dark sections and footer.
- **Amber/Yellow brand accent** (`{colors.primary}` #f5b419) — used confidently on the brand mark, text highlights, and the primary pill-shaped CTA.
- Surface ladder uses subtle off-whites and light grays (canvas → surface-1 → surface-compare) to carry hierarchy.
- Display tracking pulls slightly negative (-0.01em); subtitles use wide positive tracking (+0.08em) in monospace.
- Cards use `{rounded.xl}` 16px corners, while buttons utilize `{rounded.pill}` 50px/9999px corners.
- **Lifestyle and product photography** dominate the page, emphasizing accessibility and human connection.

## Colors

> Source pages: rayapower.com (home).

### Brand & Accent
- **Raya Amber** ({colors.primary}): The signature Raya accent — primary CTA, brand mark, text highlights (#f5b419).
- **Amber Hover** ({colors.primary-hover}): Deeper amber (#f4b400) — hovered state of the primary CTA.
- **Success Green** ({colors.semantic-success}): Status pills, success indicators (#2e870d).

### Surface
- **Background** ({colors.background}): Default page background — #ffffff, pure white.
- **Canvas** ({colors.canvas}): Dark footer and section background — #000100, near-pure black.
- **Background Secondary** ({colors.background-secondary}): Dark charcoal surface — #181818.
- **Surface 1 (Card Bg)** ({colors.surface-1}): Light gray for standard cards — #f5f5f5.
- **Surface Compare** ({colors.surface-compare}): Warm cream tint for comparison toggles — #fff7db.
- **Surface Raya** ({colors.surface-raya}): Warm off-white for highlighted columns — #fffaf0.
- **Surface Launch** ({colors.surface-launch}): Subtle off-white for launch sections — #fbfbfb.
- **Overlay** ({colors.semantic-overlay}): Pure black overlay scrim for modals (rgba 0,0,0, 0.72).

### Text
- **Ink** ({colors.ink}): All primary headlines and emphasized body type — black #000000 or near-black #111111.
- **Ink Inverse** ({colors.ink-inverse}): White text on dark canvases — #ffffff.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #4b5563.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #6b7280.
- **Ink Quaternary** ({colors.ink-quaternary}): Disabled, footnotes at #94a3b8.

## Typography

### Font Family

- **Work Sans (Heading)** — Raya's primary display sans; fallback `sans-serif`. Carries display-xl through subhead. Weight 600.
- **Work Sans (Body)** — Raya's primary text sans; fallback `sans-serif`. Carries body sizes. Weight 400.
- **Roboto Mono (Subtitle)** — Raya's custom mono; fallback `monospace`. Used for eyebrows, subtitles, and taxonomy. Weight 500, uppercase.
- **Inter (Cards & Buttons)** — Raya's secondary UI sans; fallback `sans-serif`. Used for feature cards, button labels. Weights 400/500.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Font Family |
|---|---|---|---|---|---|
| `{typography.display-xl}` | Scale 1.6 | 600 | 1.10 | -0.01em | Work Sans |
| `{typography.display-lg}` | Scale 1.35 | 600 | 1.10 | -0.01em | Work Sans |
| `{typography.display-md}` | Scale 1.2 | 600 | 1.10 | -0.01em | Work Sans |
| `{typography.headline}` | Scale 1.1 | 600 | 1.10 | -0.01em | Work Sans |
| `{typography.card-title}` | Scale 1.0 | 500 | 1.25 | Normal | Inter |
| `{typography.body-lg}` | Scale 1.15 | 400 | 1.40 | 0.0em | Work Sans |
| `{typography.body}` | Base | 400 | 1.40 | 0.0em | Work Sans |
| `{typography.button}` | Scale 1.6 | 500 | 1.20 | -0.03em | Work Sans / Inter |
| `{typography.eyebrow}` | Scale 1.42 | 500 | 1.30 | 0.08em | Roboto Mono (Uppercase) |

### Principles

- **Slight negative tracking on display** (-0.01em).
- **Eyebrow uses wide positive tracking** (+0.08em) — contrast against the standard tracking marks the eyebrow as taxonomy.
- **Monospace used for taxonomy and structure.** Roboto Mono lives in subtitles and section eyebrows.

## Layout

### Spacing System

- **Base unit**: 4px.
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px (5rem).
- Card interior padding: `{spacing.lg}` 24px on feature/pricing cards.

### Grid & Container

- Max content width sits around 1280px.
- Card grids are 4-up or 3-up at desktop, 2-up at tablet, 1-up at mobile.
- Product panels span full content width or sit in 50/50 split layouts with text.

### Whitespace Philosophy

The white canvas IS the whitespace. Sections separate by generous `{spacing.section}` 5rem gaps.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer |
| 1 (subtle lift) | `{colors.surface-1}` background | Default feature cards |
| 2 (highlight lift) | `{colors.surface-compare}` background | Highlighted comparison columns |

Raya's depth is carried primarily by subtle background color shifts rather than heavy drop shadows.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.md}` | 8px | Form inputs, small elements |
| `{rounded.lg}` | 10px | Form inputs (`--border-radius-input`) |
| `{rounded.xl}` | 16px | Product screenshot panels, feature blocks (`--border-radius-block`) |
| `{rounded.pill}` | 50px | All primary buttons (`--border-radius-button`) |

### Photography & Illustration Geometry

- Product UI and lifestyle photos sit in `{rounded.xl}` 16px tiles or full-bleed sections.
- Customer logo tiles render at small sizes on `{colors.background}` with no border.

## Components

### Buttons

**`button-primary`** — Amber CTA. The default primary CTA across all pages.
- Background `{colors.primary}` (#f5b419), text `{colors.ink}` (#000000), type `{typography.button}`, rounded `{rounded.pill}` (50px).
- Hover state lives in `button-primary-hover` (background shifts to `{colors.primary-hover}` #f4b400).

**`button-secondary`** — Transparent/Outline button.
- Background transparent, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.pill}`.

**`button-inverse`** — Dark button on light backgrounds.
- Background `#242424`, text `{colors.ink-inverse}`, type `{typography.button}`, rounded `{rounded.pill}`.

### Cards & Containers

**`feature-card`** — Generic feature highlight tile (e.g., "High Costs", "Long Timelines").
- Background `{colors.surface-1}` (#f5f5f5), text `{colors.ink}`, type `{typography.card-title}`, rounded `{rounded.xl}` (16px), padding 24px.

**`compare-column`** — Highlighted column in comparison tables.
- Background `{colors.surface-raya}` (#fffaf0) or `{colors.surface-compare}` (#fff7db).

### Logos

**`brand-logo-dark`** — Primary logo for light backgrounds.
- `https://rayapower.com/cdn/shop/files/Raya_Power_Horizontal_Lockup_7462482f-67e9-46bc-8f30-ce90c35e005b.svg`

**`brand-logo-light`** — Inverse logo for dark backgrounds.
- `https://rayapower.com/cdn/shop/files/Raya_Power_Horizontal_Lockup_Light_mode.svg`

**`brand-logo-stacked`** — Stacked orange variant.
- `https://cdn.shopify.com/s/files/1/0883/6051/7932/files/raya_power_-_stacked_-_orange.png`

## Do's and Don'ts

### Do
- Reserve `{colors.canvas}` (#000100) for the footer and specific dark immersive sections.
- Use `{colors.primary}` (#f5b419) amber for: brand mark, primary CTA, and specific text highlights in headings.
- Pair Work Sans (Heading/Body) with Inter (Cards/Buttons) and Roboto Mono (Eyebrows).
- Use pill-shaped `{rounded.pill}` 50px corners for all primary CTAs.
- Use 16px `{rounded.xl}` corners for content blocks and image panels.

### Don't
- Don't use a dark mode for the entire site; Raya is primarily a light-mode experience.
- Don't use heavy drop shadows; rely on background color shifts (#f5f5f5, #fffaf0).
- Don't use sharp corners for buttons.
- Don't use negative tracking on eyebrows/subtitles; they require wide positive tracking.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop | 1280px | Card grid 4-up maintained |
| Tablet | 1024px | Card grid 4-up → 2-up |
| Mobile | 768px | Single-column layout; navigation collapses to hamburger |

### Touch Targets
- CTAs hold generous padding within their 50px pill shape.
- Form inputs hold ≥44px tap target on touch.
