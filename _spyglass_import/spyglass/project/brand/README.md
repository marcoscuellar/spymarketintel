# Handoff: GLVE Identity & Design System

## Overview

This package contains the visual identity and design system for **GLVE — Revenue Workflow** (`glve.it.com`). It covers the logo (mark + wordmark), color and type tokens, signature component patterns (engine cards, handoff pills, dark blocks, etc.), and motion specs.

The product is a six-engine sales workflow (Core Flow: 01–05, Strategic Flex: SA + ST). The brand voice is **operator-first, output-focused, zero hype** — every visual decision in this system reinforces that.

## About the Design Files

The HTML files in this bundle (`design-system.html`, `logo-cufflink-colors.html`) are **design references** — prototypes showing the intended look, behavior, and component anatomy. They are not production code to ship as-is.

Your job is to **recreate these designs in the target codebase's environment** (React, Vue, SvelteKit, etc.) using the codebase's existing patterns, libraries, and conventions. The HTML is structured to be readable — copy values (colors, sizes, radii, easing) from it, but author the components in the framework idiom the team already uses.

If there is no existing codebase yet, pick the best framework for the project (Next.js + Tailwind is a reasonable default for the marketing site given GLVE's current stack) and implement against this spec.

## Fidelity

**High-fidelity.** All colors, type sizes, spacing values, radii, easing curves, and animations are final. The mark (logo) is final pending the user's selection of primary variant — see "Logo system" below. The component patterns shown in `design-system.html` are pixel-locked; recreate them exactly.

---

## What's in this package

```
design_handoff_glve_identity/
├── README.md                       ← this file (the source of truth)
├── design-system.html              ← full visual reference
├── logo-cufflink-colors.html       ← logo variant explorations + lockups
├── tokens.css                      ← all design tokens as CSS custom properties
├── assets/
│   ├── logo-primary.svg            ← Black housing, white band, black cufflink (DEFAULT)
│   ├── logo-amber-cufflink.svg     ← E02 surfaces
│   ├── logo-navy-cufflink.svg      ← Subtle Standalone nod
│   ├── logo-light.svg              ← Paper housing, ink mark (light bg)
│   ├── logo-amber-band.svg         ← Amber accent-led
│   ├── logo-navy-band.svg          ← Navy accent-led
│   ├── logo-cream-band.svg         ← Cream band (warmer than white)
│   ├── logo-tuxedo.svg             ← Split light/dark band (formal)
│   ├── logo-amber-housing.svg      ← Full E02 takeover
│   ├── logo-navy-housing.svg       ← Standalone engine modals
│   ├── logo-cream-housing.svg      ← Editorial / print
│   ├── logo-burgundy.svg           ← Private-club energy
│   ├── logo-forest.svg             ← Deck covers / premium / brand moment
│   ├── logo-sand.svg               ← Leather / Italian tailoring
│   ├── logo-amber-pale.svg         ← Soft E02
│   ├── logo-outline.svg            ← Watermark / faded use
│   ├── favicon.svg                 ← Simplified version for ≤16px
│   ├── glyph-only.svg              ← Cufflink without housing (for custom use)
│   └── founder-marcos.png          ← Founder photo (for About surface)
└── components/
    ├── Logo.jsx                    ← Drop-in React logo component
    └── usage.html                  ← Vanilla HTML examples
```

---

## Brand foundations

### Colors (exact hex)

All tokens live in `tokens.css`. Highlights:

| Token        | Hex       | Use                                                                 |
|--------------|-----------|---------------------------------------------------------------------|
| `--ink`      | `#0a0a0a` | Primary text, logo housing, dark surfaces (~75% dominance)          |
| `--ink-2`    | `#525252` | Secondary text, body copy on light                                  |
| `--ink-3`    | `#a3a3a3` | Tertiary text, mono labels, eyebrows                                |
| `--line`     | `#e7e5e4` | Default hairline border                                             |
| `--paper`    | `#f5f5f4` | Recessed panels, handoff pill background                            |
| `--bg`       | `#ffffff` | Default page background                                             |
| `--amber`    | `#f59e0b` | **Engine 02 (Buying Signals) ONLY** — never as generic warning      |
| `--amber-d`  | `#d97706` | Amber hover / pressed state                                         |
| `--navy`     | `#0A1F3D` | **Standalone engines (SA, ST) ONLY** — never as generic brand blue  |
| `--navy-mid` | `#4B6177` | Navy text / accent in light contexts                                |
| `--green`    | `#10b981` | System-live indicator dot ONLY                                      |
| `--forest`   | `#2F4D3A` | **Premium logo variant + brand-moment surfaces only** (deck covers, About). Not used in product UI. |
| `--cream`    | `#F5EFE0` | Companion to forest. Used as the band color inside the Premium logo housing. |

**Strict assignment rules** (this is non-negotiable for brand integrity):

- Neutrals carry ~80% of any view.
- **Amber** is reserved for Engine 02 surfaces (its card, modal, panels, accents). Never use amber as a generic alert or warning.
- **Navy** is reserved for Standalone engines (Signal Audit, Seasonal Timing) — their cards, modals, and meta. Never use navy as a generic blue.
- **Green** is system-only: the live-status dot, the "Output" capability label. Never as a fill on a card or button.

### Typography

Two families. No more.

| Family        | Use                                                            | Weights used  |
|---------------|----------------------------------------------------------------|---------------|
| **Geist**     | Everything human-facing — headings, body, buttons, labels      | 400, 500, 600, 700, 800, 900 |
| **Geist Mono**| Everything system-facing — tags, eyebrows, timestamps, metadata| 400, 500, 600 |

Load from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Or via npm: `@fontsource/geist-sans` + `@fontsource/geist-mono`.

**Key type tokens** (see `tokens.css` for the full scale):

| Token            | Size | Weight | Tracking | Line | Use                   |
|------------------|------|--------|----------|------|------------------------|
| `display/xl`     | 128px (clamp 64–144) | 800 | −5% | 0.92 | Hero h1               |
| `display/lg`     | 38   | 800    | −4%      | 1.0  | Modal title           |
| `section/lg`     | 36   | 700    | −3.5%    | 1.02 | Section dividers      |
| `card/lg`        | 26   | 700    | −3%      | 1.05 | Engine card titles    |
| `body`           | 15   | 400    | −1%      | 1.5  | Default paragraphs    |
| `mono/btn`       | 12   | 500    | +6%, UPPER | 1.0 | Buttons, flow pills  |
| `mono/tag`       | 11   | 500    | +6%, UPPER | 1.0 | Eyebrows, meta       |
| `mono/xs`        | 10   | 600    | +7%, UPPER | 1.0 | Capability labels    |

**The two-tone display pattern:** every display heading uses two clauses, with the second clause in Geist 400 + `--ink-3`. This is GLVE's signature voice in type. Example: `<h1>Stop guessing. <span class="light">Start closing.</span></h1>`

### Radii

| Token | Px | Use |
|-------|----|----|
| `--r-2` | 8px | Logo mark, small chips |
| `--r-3` | 12px | Buttons, flow pills |
| `--r-4` | 14px | Capability cards |
| `--r-5` | 16px | Selector panels |
| `--r-6` | 20px | Engine cards |
| `--r-7` | 28px | Dark blocks (Strategic Flex section) |
| `--r-8` | 32px | Modals |
| `--r-pill` | 100px | Handoff pills only |

### Motion

| Use | Curve | Duration |
|-----|-------|----------|
| Default | `cubic-bezier(0.16, 1, 0.3, 1)` | 180–250ms |
| Modal open | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 450ms (the only place pop-easing is allowed) |
| Card hover lift | `cubic-bezier(0.16, 1, 0.3, 1)` | 250ms — `translateY(-2px)` + shadow |
| `amberPulse` (E02 cards) | `ease-in-out infinite` | 4s — box-shadow alternates 18px ↔ 30px amber glow |
| `navyPulse` (Standalones) | `ease-in-out infinite` | 4s — mirror of amberPulse with navy rgba |

**Hard rule:** never scale buttons on press. They translate or change background — they do not shrink. The brand reads "steady."

---

## Logo system

The mark is a **cufflink** — a horizontal cuff band with a circular cufflink medallion on the right. White-glove service vocabulary, no anatomy. The wordmark is **GLVE** in Geist 900 at −8% tracking with a custom sharp V chevron.

### The sanctioned variants — all 16

Every variant in this list ships as a production SVG (`assets/logo-<name>.svg`) and as a React variant (`<GlveLogo variant="<name>" />`). The first six are the **primary working set** — what you'll reach for 95% of the time. The remaining 10 are sanctioned but used sparingly, for specific design moments.

#### Primary working set (use these first)

| Variant | File | When to use |
|---|---|---|
| **`primary`** | `logo-primary.svg` | Default everywhere. Nav, favicon, business cards. Black housing, white band, black cufflink. |
| **`amber-cufflink`** | `logo-amber-cufflink.svg` | Engine 02 (Buying Signals) surfaces — modal, panel, marketing tile. |
| **`navy-cufflink`** | `logo-navy-cufflink.svg` | Subtle Standalone (SA, ST) nod where a full navy housing is too much. |
| **`navy-housing`** | `logo-navy-housing.svg` | Standalone engine modals and deeper Standalone marketing surfaces. |
| **`forest`** | `logo-forest.svg` | Deck covers, About / founder section, "premium moment." Forest + cream. |
| **`light`** | `logo-light.svg` | Light-backgrounded surfaces where the dark housing is too heavy. |

#### Accent-led variants (band carries color)

| Variant | File | Use |
|---|---|---|
| `amber-band` | `logo-amber-band.svg` | E02 hero tile, full E02 takeover surfaces. |
| `navy-band` | `logo-navy-band.svg` | Standalone hero tile, both accents present. |
| `cream-band` | `logo-cream-band.svg` | Warmer than pure white — fabric/editorial feel. |
| `tuxedo` | `logo-tuxedo.svg` | Split light/dark band. The dressiest formal cuff — special events, wedding-card energy. |

#### Color housing variants

| Variant | File | Use |
|---|---|---|
| `amber-housing` | `logo-amber-housing.svg` | Full E02 takeover. Used only on E02-only surfaces. |
| `cream-housing` | `logo-cream-housing.svg` | Editorial / print contexts. |
| `burgundy` | `logo-burgundy.svg` | Sommelier / private-club energy. Off-system but compelling. |

#### Brand world (vault — pull out for specific reasons)

| Variant | File | Use |
|---|---|---|
| `sand` | `logo-sand.svg` | Italian-tailoring / leather-goods energy. |
| `amber-pale` | `logo-amber-pale.svg` | Soft E02 surfaces that need to whisper. |
| `outline` | `logo-outline.svg` | Watermark, faded use, large white space. |

**Hard rule:** never invent a new color combination. If the surface needs something not in this set, ask the designer first. The point of having 16 sanctioned variants is exactly so no one ever needs to.

### Sizing

| Context | Mark size | Notes |
|---------|-----------|-------|
| Nav bar | 28×28px | radius 8px |
| Hero / splash | 40–64px | radius scales: 11–18px |
| Deck title slide | 64–88px | radius 18–24px |
| Favicon | 16×16px | use `favicon.svg` — simplified, drops inner ring |

**Clear space:** minimum padding around the mark = ½ × mark width on all sides. Never crop the housing.

### The wordmark

**GLVE** set in Geist 900, letter-spacing `-0.08em`, with the V replaced by a custom sharp chevron path. The chevron has equal stroke width to the letters and identical baseline alignment.

Implementation: use a `<text>` element + a `<path>` for the V, OR pre-convert to paths in your build. Reference markup:

```html
<span class="glve-wordmark">
  <span>GL</span><span class="chev">
    <svg width="0.62em" height="0.85em" viewBox="0 0 62 85">
      <path d="M 4 4 L 31 78 L 58 4" fill="none" stroke="currentColor"
            stroke-width="14" stroke-linecap="square" stroke-linejoin="miter"/>
    </svg>
  </span><span>E</span>
</span>
```

```css
.glve-wordmark {
  font-family: 'Geist', sans-serif;
  font-weight: 900;
  letter-spacing: -0.08em;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  color: var(--ink);
}
.glve-wordmark .chev { display: inline-block; transform: translateY(0.04em); }
```

### Lockup rules (mark + wordmark)

Five sanctioned lockups, all shown in `logo-cufflink-colors.html`:

- **A · Primary horizontal** — Mark + GLVE wordmark, baseline-aligned, 24px gap, wordmark set 1.6–2× the mark height.
- **B · Stacked** — Mark on top, wordmark below, with optional `[ REVENUE WORKFLOW · V1.0 ]` mono caption.
- **C · With tagline** — Mark + GLVE + `Revenue Workflow` mono caption tucked under the wordmark.
- **D · Reverse on ink** — Inverted: white housing, ink mark inside, white wordmark.
- **E · Premium** — Navy housing + amber cufflink + white wordmark with amber V chevron.

**Hard rules:**
- The mark and wordmark never appear inverted relative to each other (e.g. ink mark + amber wordmark is forbidden).
- The colon `:` between GLVE and "Revenue Workflow" in the smaller lockup is preserved (it's load-bearing) — never replace with em-dash, slash, or pipe.
- The wordmark stands alone in some contexts (large hero, brand watermark); the mark stands alone as a favicon or app tile. They do not both shrink to compete at small sizes.

---

## Component patterns

All component specifics are in `design-system.html`. Key patterns:

### Engine card

The signature pattern. Three tones (default, amber-pulse, navy-pulse) shown in section 07 of `design-system.html`.

- **Card:** 1px line border, 20px radius, soft layered shadow, fixed 420px height.
- **Anatomy:** mono number top-left → type tag top-right → 32px icon → Geist 700 title → Ink-2 description → mono "Open Engine →" foot.
- **Tone variants:**
  - Default (Pipeline): static, 1px ink border.
  - **Amber pulse (E02 only):** 2px amber border + 4s `amberPulse` animation.
  - **Navy pulse (Standalones only):** 2px navy border + 4s `navyPulse` animation.

### Capability card (3-up triptych)

Every engine modal renders exactly three capability cards: **What it does · How · Output**. Always three. Never four. Never two.

### Handoff pills

- **Input pill** (top of modal): Paper background, 100px radius, "↓ Input: …"
- **Output pill** (bottom of modal): Ink background by default, 100px radius. Amber when E02 hands off. Green only for terminal Engine 05.

### Dark block (Strategic Flex section)

Ink background, 28px radius, 56–72px padding. Used once per page max. Contains flow-pill row (6% white bg, 12% border) + standalone-row beneath.

### Tags & badges

- 4px radius
- Geist Mono 10/600 uppercase, +6% tracking
- Variants: `pipeline` (paper bg), `amber` (E02 only), `standalone` (solid ink), `live` (green tint), `navy` (Standalones only)

### Buttons

- **Primary pill** — ink bg, 14/600, 12px radius. `translateY(-2px)` + shadow on hover. Arrow icon translates `+3px` on hover.
- **Secondary** — transparent + 1px line border. Border goes ink on hover.
- **Amber pill** — Engine 02 contexts only.
- **Mono system button** — 8px radius, Geist Mono 12/600 uppercase, `[ BRACKETED LABEL ]`.

---

## Interactions & behavior

### Engine card on click
Opens a modal. Modal pop animation: `transform: scale(0.95) → 1` with `cubic-bezier(0.34, 1.56, 0.64, 1)` over 450ms. Backdrop: 55% white at 20px blur, fades over 300ms.

### Card hover
- 250ms transition, default easing.
- Background: card itself unchanged; only the inner "Open Engine" foot arrow translates +4px.
- The pulse-animated cards (amber/navy) continue their pulse uninterrupted on hover.

### System-status dot
Pulses inline: 6×6px circle with `box-shadow: 0 0 0 3px rgba(16,185,129,0.15)`. No animation by default — pulsing is optional and slow (3s) if added.

### Modal vertical selector (E02-specific)
The Engine 02 modal contains a vertical selector. Tabs select a vertical → fades panel out (180ms) → swaps content → fades back in. State key: `state.e2Vert`. Selectable values: `dt`, `agy`, `mt`, `ih`. Disabled (Soon): `tech`, `ai`, `retail`.

---

## State management (per engine modal)

Reference state shape (vanilla JS, adapt to framework):

```js
const state = {
  activeEngine: null,     // 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | null
  modalOpen: false,
  e2Vert: null,           // vertical selected inside Engine 02
};
```

Engine carousel state (3D rotating cards): tracks `activeIndex` in an array of engine IDs. Cards at offset ±2 hide; ±1 rotate Y ±25°; 0 is centered & scaled up.

---

## Assets

- **Logo SVGs** (`assets/logo-*.svg`): Drop directly into HTML or import as components.
- **Favicon** (`assets/favicon.svg`): Use as `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`.
- **Founder photo** (`assets/founder-marcos.png`): Use on the About / founder page (see `design-system.html` section 15). 4:5 aspect, 20px radius, on `--paper` background.
- **Fonts**: Loaded from Google Fonts (see Typography section above) or via `@fontsource` npm packages.

---

## Implementation notes

1. **Don't reimplement the design tokens from scratch** — import `tokens.css` (or port its custom properties into your design-token solution, e.g. Tailwind config, CSS-in-JS theme, etc.).
2. **Respect the amber/navy assignment rules** — they're how the engine system reads correctly. Linting these is worth setting up if the team has the appetite.
3. **The two-tone display pattern is in the type system, not a one-off.** Build it as a primitive: `<H1>` accepts a `<H1.Light>` child.
4. **Keep the cufflink mark as one SVG** — don't break it into separate elements unless you need to recolor the inner medallion (which is rare). The variant SVGs in `assets/` cover the sanctioned color combinations.
5. **The 3D carousel and modal animations** in `design-system.html` are reference behavior. If your framework has its own preferred animation library (Framer Motion, AutoAnimate, etc.), use that — but match the timings and easings stated above.
6. **Pulse animations should respect `prefers-reduced-motion`.** Wrap the keyframes in a media query.

---

## Files in this package

- `design-system.html` — Full visual spec with every component, color, type sample, motion demo, and voice example.
- `logo-cufflink-colors.html` — 16 color variants of the cufflink mark + 5 lockup compositions with the GLVE monogram.
- `tokens.css` — All design tokens as CSS custom properties, ready to drop in.
- `assets/` — SVG logos + founder photo.
- `components/Logo.jsx` — A reference React component implementing the four variants.
- `components/usage.html` — Vanilla HTML examples of mark + wordmark in common contexts.

---

**Questions on anything?** The HTML references are the source of truth — if the README and HTML disagree, the HTML is correct (it's what was design-reviewed). Ping the designer if anything's ambiguous.
