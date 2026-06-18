# Handoff: Spyglass — Client Portal

## Overview
**Spyglass** is a recruiting/staffing product. This bundle covers the **three client-portal screens** (one surface, one audience: the client). *(A fourth screen — the internal Placeability Gauge — is **archived / not part of this delivery**; its source is kept in `archive/placeability.jsx`.)* Read the surface map first.

> ⚠️ **Surface map — which screen goes where (read this first)**
>
> | # | Screen | Component / file | Surface | Who sees it |
> |---|--------|------------------|---------|-------------|
> | 1 | **Client Home** | `PortfolioView` · `app_preview/portfolio.jsx` | **Client Portal** | The **client** (e.g. Procare HR) |
> | 2 | **Search Room** | `RoleView` · `app_preview/role-view.jsx` | **Client Portal** | The **client** |
> | 3 | **Candidate Dossier** | `CandidateDossier` · `app_preview/dossier.jsx` | **Client Portal** | The **client** |
> | — | *Market Intel* (deep-dive) | `Spyglass - Market Intel.html` (uses `role-view.jsx`) | **Client Portal** (linked page, opens in new tab) | The **client** |
>
> All three screens (plus the Market Intel page) are the **client-facing Portal** and belong together behind the client's login. *(The internal Placeability Gauge has been archived — not part of this delivery.)*

The three are stitched into one prototype only for review convenience: `Spyglass - Dossier Specs (Preview).html` has a top segmented switcher (`Client Home · Search Room · Candidate Dossier`). **That switcher is a prototype harness, not product navigation** — see the navigation model below for how these actually connect.

## About the Design Files
The files in this bundle are **design references created in HTML + React-via-Babel** — prototypes showing intended look and behavior, **not production code to ship directly**. The React 18 + in-browser Babel transform and the `lucide → React` shim are prototyping conveniences. The task is to **recreate these designs in the target codebase's environment** using its established component library and patterns (React/Next recommended if greenfield). Rebuild the screens with real routing, real data, and real auth boundaries — do not lift the inline-style objects wholesale.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions are intended as-is. Recreate the UI pixel-faithfully using the codebase's libraries. Exact tokens are in `brand/tokens.css` and inlined per screen below.

---

## Navigation model (how the screens connect in product)

**Client Portal** (one client, logged in):
- **Client Home** is the portal landing — the client's whole engagement: hero (client name + POC + talent partner), a **Market intel** snapshot, and a **Breakdown of the roles** list grouped into *Needs your decision* / *In progress* / *Closed & on hold*.
- Clicking a search row that has an **"Open room"** badge → **Search Room** for that role.
- Inside a Search Room, the shortlist roster + **"Open full dossier"** → **Candidate Dossier**.
- Back links climb the same ladder: Dossier → *Search room*; Search Room → *All searches* (Client Home).
- **Market Intel** (`Spyglass - Market Intel.html`) is a full-page deep-dive opened in a **new tab** from the "Open the full market brief" / intel cards on Client Home and Search Room.

In the prototype these transitions are faked with `window` CustomEvents dispatched between the harness and the views:
`spg-open-room`, `spg-open-dossier`, `spg-open-portfolio`. **In production, replace these with real routes** (e.g. `/portal`, `/portal/search/:id`, `/portal/search/:id/candidate/:id`). The dossier currently always loads the same hard-coded candidate (Mateo Ríos) regardless of which row was clicked — wire it to the selected candidate id.

**Archived (out of scope):** the internal **Placeability Gauge** is not part of this delivery. Its source is preserved in `archive/placeability.jsx` for a later phase.

---

## Screens / Views

### 1. Client Home — `PortfolioView` (Client Portal)
**Purpose:** The client's portal landing. See every open search at a glance, what needs their decision, and a market-intel snapshot.

**Layout** (max-width **1080px**, centered, page padding 32px desktop / 18px mobile ≤760px; page bg white `#FFFFFF`):
- **Top bar** (flex, space-between, 26px/20px padding, bottom hairline `--line`): left = wordmark `SPYGLASS PARTNERS` (Geist 900, 17px, letter-spacing **−0.07em**; the cufflink logo mark was removed) + 1px divider + breadcrumb `Client home` (mono 11px, `--ink-3`). Right = `Procare · Confidential` (mono 11px) + an **Edit ⇄ Done editing** toggle (gold when active) that turns the intel into inline-editable fields — see **Editing the intel** under Interactions. Side gutters are responsive: `clamp(32px, 6vw, 100px)`.
- **Hero** (padding 56px top / 44px bottom, left-indented `clamp(0px,5vw,90px)`): mono gold eyebrow `Active engagement`; H1 client name `Procare HR` (Geist 800, `clamp(46px,7.5vw,94px)`); then a **lede paragraph** (`clamp(18px,2.1vw,24px)`, line-height 1.5, `--ink-2`, max 42ch, with a bolded **Spyglass Partners**) — same hero treatment as the Search Room / Dossier. *(The earlier Client POC / Client / Talent-partner meta tiles were removed.)*
- **Market intel** section — **company-level**: `sectionH` header `Market intel` (no caption, no collapse toggle). Then the **Procare HR write-up** (a paragraph: founder-led senior-care PEO across 36 states, 25,000+ employees, 2024 Clarent acquisition + AI scorecard) and a gold **Growth signal** callout (`TrendingUp` icon). Then the shared **`SearchBrief`** block rendered `hideIntro companyLevel`, which shows, in order: a full-width row of **4 company facts**, then a 2-up equal-height row of **Competitor landscape** (left) + **Industry signals** (right). `companyLevel` suppresses the per-search FunnelChart so this view stays company-scoped. See §2 for each piece.
- **Breakdown of the roles**: `sectionH` heading, then three groups (`Needs your decision`, `In progress`, `Closed & on hold`). Each group = a mono count label + a bordered card (radius 20, `--sh-card`) containing **SearchRow**s.

**SearchRow** (grid `minmax(0,1.5fr) minmax(0,1.3fr) 168px 168px`, 20px gap; collapses to `1fr auto` on mobile; 20×22 padding, hairline `--line-soft` divider; hover bg `--hover` only when the row opens a room):
- Col 1: role (Geist 700, 17px) + optional gold **"Open room"** pill (mono 8.5px, `--amber-bg`/`--gold-line`); sub-line `dept · loc` (mono 10px).
- Col 2: **StageTrack** — 6 stages `Intake · Sourcing · Screening · Presented · Offer · Placed` as a dot/segment rail; done+current dots gold, current dot 10px with `0 0 0 3px goldBg` ring; trailing mono stage label.
- Col 3: lead candidate **FitRing** (40px) + name + `N presented` / `Placed`; or a plain mono metric (e.g. `9 screened`) when no lead.
- Col 4: right-aligned **status chip** + arrow. Chip variants: `N awaiting you` (gold), `Offer out` / `Placed` (forest `#2F4D3A`), `On hold` (neutral), `In progress` (navy tint). On-hold rows render at 0.72 opacity.

**Intel layout note:** the four company facts run full-width above; **Competitor landscape** and **Industry signals** share an equal-height 2-up row below.

### 2. Search Room — `RoleView` (Client Portal)
**Purpose:** One search in depth — why it matters, the market read, and the presented shortlist with an inline candidate preview.

**Layout** (max-width **1240px**):
- **Top bar:** wordmark `SPYGLASS PARTNERS` (logo mark removed) + **`← All searches`** back button (dispatches `spg-open-portfolio`). Right = `For Procare HR · Confidential` + a **theme switcher** `Light · Blue · Navy`.
  - ⚠️ **The theme switcher is a prototype affordance for showing palette options — it is not a product feature.** Pick ONE theme for production (the designs default to **Light**) and drop the switcher. The `blue`/`navy` THEME objects in `role-view.jsx` exist only to preview a dark treatment.
- **Hero:** mono gold eyebrow (`Nearshore Build · Clarent Platform`), big two-line H1 (`Nearshore / Engineering Pod`, same display scale as Client Home), and a `clamp(18px,2.1vw,24px)` lede paragraph (max 38ch) with a bolded phrase.
- **Body** — two columns `366px / 1fr`, 22px gap, `align-items:start`:
  - **Left rail** (`aside`, sticky `top:16`, card): a top **"Search intel · The brief"** selector row (gold left-border when active), then `Shortlist · N presented` label, then a **RosterRow** per candidate sorted by fit desc.
    - **RosterRow** (grid `20px 1fr auto`): zero-padded rank (mono), name (Geist 700, 16.5px) + gold lead dot, `role · Ny`, one-line blurb (truncated), a status chip (`New` navy / `On hold` gold / `Advanced` forest), and a 42px **FitRing**. Selected row = gold 3px left border + raised bg.
  - **Right main** (card, padding 30, min-height 620): shows **`SearchBrief`** (the full brief) when nothing is selected, or **`CandidatePreview`** for the selected candidate. Content animates in with `spgPop` (scale/translate, `cubic-bezier(0.34,1.56,0.64,1)`).
    - **SearchBrief** — the market read. In the **Search Room** (search-level) it renders **only the 4 facts** row (1px-gap grid on `--line`): `May 2024 · acquired Clarent` / `36 states` / `~62 employees` / `25,000+ managed` (company context; `ROLE.impact`). The **Competitor landscape**, **Industry signals**, and the **sourcing FunnelChart** are gated to `companyLevel` and render **only on Client Home** — the Search Room stays focused on the search itself (brief + shortlist). *(Removed during design and no longer rendered anywhere: the editable stat band, `GrowthGapChart`, the "Why now · the signals" card, and `CompChart`. The `FunnelChart`/`GrowthGapChart`/`CompChart` functions may remain defined-but-unused in the file.)*
    - **CompetitorLandscape** — deep-navy card, "Est. PEO market share": ranked horizontal bars of PEO competitors (`COMPETITORS`: ADP TotalSource 22, Insperity 15, TriNet 13, Paychex PEO 11, Justworks 7, **Procare HR 3** with a gold **YOU** tag + bright-gold bar; competitors render muted-gold). Footer: "Fragmented market · top 5 hold ~68%". **Illustrative shares — wire to real market data.**
    - **NewsIntel — "Industry signals" (⚠️ placeholder data):** deep-navy card, pulsing gold **Live** dot, showing the first **2** items of a hardcoded `NEWS` array of `{ src, t, h, s }` (source tag, relative time, headline, summary), hairline-separated. **It is not actually live** — timestamps are static strings and nothing fetches. **Production:** wire to a real news API or web-capable LLM filtered to the client's industry (senior care / PEO / HR tech), returning the same `{ src, t, h, s }` shape on a refresh interval.
    - **CandidatePreview** = avatar tile + name (Geist 800, 30px) + optional gold **"Lead candidate"** pill + `role · company · Ny` + 56px FitRing; a 3-cell meta strip (`Location`, `Comp ask`, `Status`); a `Why <First> fits this search` numbered list; tag chips; and a CTA block (`Book` ghost + **`Open full dossier →`** gold, dispatches `spg-open-dossier`).

### 3. Candidate Dossier — `CandidateDossier` (Client Portal)
**Purpose:** The full candidate record the client acts on — weighted scorecard, written read, résumé, verified references, private notes, and the decision actions.

**Layout** (max-width **1180px**; always Light theme):
- **Header:** Mark + `SPYGLASS` + **`← Search room`** back button (dispatches `spg-open-room`). Right = `Evaluating` label + a search-style candidate-name input (prototype affordance; defaults to `Mateo Ríos`).
- **Hero:** identical eyebrow + two-line H1 + lede as the Search Room (this dossier belongs to that search).
- **Body** — two columns `320px / 1fr`, 20px gap, `align-items:start`:
  - **Left rail** (`aside`, sticky, card padding 28): candidate name (Geist 800, 34px); `current role — ex-company`; a gold **match pill** (`{overall}% match`, computed weighted score — currently **84%**); hairline; four icon meta rows (`Salary`, `Location`, `In one line`, `Compliance` — gold icons); hairline; then three stacked action buttons — **`Questions for Spyglass`** (ghost), **`Book Interview`** (navy primary), **`Pass & Why`** (red-outline danger). Clicking any toggles an inline composer panel (textarea + Send; Book shows a coordination note instead).
  - **Right main** (card, min-height 540): a 3-tab bar **`Overview · Detail · Notes`** (active tab = gold text + 2px gold underline), then:
    - **Overview:** a weighted **SVG donut** (280px) — one gold wedge per criterion, wedge **angular width = weight**, wedge **radius = score**, on a paper track; center shows overall score (or the hovered wedge's score + short name). Hovering/clicking a wedge dims the rest (opacity 0.3) and shows that criterion's name · score · weight (with a `Mic` icon for interview-scored `live` criteria, `FileText` for `matrix`-sourced) + its plain-language meaning. Default state = "The quick read" summary.
    - **Detail:** `Why Mateo fits this search` prose (4 paragraphs incl. an honest watch-out), then **Résumé** (3 roles with bullet lists + Education/Certifications), then **References · verified by Spyglass** (cards with name, role, "Spoke 6/16" status, and a gold-left-border italic quote).
    - **Notes:** a textarea + **Add** button prepending timestamped private notes (seeded with one). Mono empty-state copy: notes stay private to the client's team.

**Scorecard criteria** (8, weights sum to 100): Data Platform·Architecture 20, HRIS/Integrations 16, Full-Stack Delivery 16, AI/ML Pragmatism 12, US-Hours Collaboration 12 *(live)*, Ownership in Ambiguity 12 *(live)*, English/Communication 7 *(live)*, Comp Alignment 5. `src: "matrix"` = derived from the strategy matrix; `src: "live"` = interview-scored. **Currently static sample data** — production should compute these from real evaluation inputs.

## Interactions & Behavior
- **Navigation:** prototype uses `window` CustomEvents (`spg-open-room`, `spg-open-dossier`, `spg-open-portfolio`) + the harness segmented switcher. Replace with real routes; pass the selected candidate/search id through (the dossier is hard-wired to one candidate today).
- **Dossier scorecard:** hover/click a donut wedge → isolates it (others to 0.3 opacity) and swaps the center + side panel to that criterion. Tabs reset `active` wedge on switch.
- **Dossier actions:** the three rail buttons toggle an inline composer (textarea + Send), Pass turns the panel border red; Book shows a scheduling note. None submit anywhere in the prototype.
- **Notes tab:** Add prepends a timestamped note to local React state (not persisted).
- **Search Room theme switch & candidate-name input:** prototype-only — remove for production.
- **Responsive:** `useIsMobile()` at **760px** collapses the two-column layouts to single column and simplifies SearchRow/CandidatePreview grids.
- **Motion:** ease `cubic-bezier(0.16,1,0.3,1)`; entrance pop `cubic-bezier(0.34,1.56,0.64,1)` (`spgPop`). `prefers-reduced-motion: reduce` is honored via `tokens.css`.

## State Management
- **Harness:** `view` ∈ `portfolio | role | dossier | gauge`.
- **RoleView:** `theme` (drop in prod), `selected` candidate id (Esc clears).
- **CandidateDossier:** `tab` (overview|detail|notes), `active` wedge index, `composer` (q|book|pass|null), `notes[]`, `draft`.
- No global store, no persistence beyond the intel edits, no data fetching otherwise. Production needs: client auth scope for the Portal, real candidate/search APIs, and persistence for notes + decisions.

## Data the screens need (currently sample data)
- **Searches list** (Client Home `SEARCHES`): role, dept, location, stage index (0–5), lead {name, fit}, presented count, group, status, awaiting count, `room` flag.
- **Role/search brief** (`ROLE` in `role-view.jsx`): title, client, eyebrow, context, lookingFor, unlocks[], impact tiles[], growth chart points + capacity, comp band/IQR/median/axis, **funnel[]** (`{l,n}` per stage — feeds FunnelChart).
- **Editable title stats** (Search Room / Client Home intel): `Candidates in this title`, `Companies with similar jobs` — currently `contentEditable` defaults (240, 18), not bound to data. Wire to real per-title counts + persist edits.
- **Industry news** (`NEWS` in `role-view.jsx`): `{ src, t, h, s }[]` — **hardcoded sample headlines**, not a live feed. Replace with a real news API / web-capable LLM scoped to the client's industry.
- **Candidates** (`CANDS`): id, name, initials, role, company, years, location, askMid, fit, status, lead, blurb, tags[], why[].
- **Dossier** (`CRITERIA`, `CAND` in `dossier.jsx`): 8 weighted criteria with score + source + meaning; candidate header fields; résumé jobs; references; notes.
- **All numbers are illustrative.** Fit scores, the dossier `%`, and per-criterion grades are **not** computed from anything yet — wire to real scoring.

## Design Tokens (see `brand/tokens.css`)
- **Surfaces:** `--bg / --bg-card #ffffff`, `--paper #f5f5f4`. **Ink:** `--ink #0a0a0a`, `--ink-2 #525252`, `--ink-3 #a3a3a3`, `--ink-4 #d4d4d4`, `--line #e7e5e4`, `--line-soft #ededeb`.
- **Gold (accent / fills / CTAs):** `--amber #C2A24C`; **deep gold for text on light** `--amber-dd #876B1E`; faint surface `--amber-bg #FAF6EA`; hairline `--gold-line #E5D29B`.
- **Navy (structure / primary buttons):** `--navy #0A1F3D`. **Forest (positive/placed):** `#2F4D3A`. **Red (Pass / above-band / "hard" only):** `#DC2626`. **Cream (text on navy):** `#F5EFE0`.
- **Type:** `--font 'Geist'` (UI), `--mono 'Geist Mono'` (labels/eyebrows, uppercase, tracked). Section headers follow the project standing rule: **Geist 800, ~22px, letter-spacing −0.025em, deep-gold `#876B1E`** (`sectionH` helper) — not small mono eyebrows.
- **Radii:** card 20 · button/field 8–12 · panel 14. **Shadow (card):** `0 12px 32px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)`. **Ease:** `cubic-bezier(0.16,1,0.3,1)`; pop `cubic-bezier(0.34,1.56,0.64,1)`.
- Per-screen files also inline their own token objects (`BRAND`/`THEMES` in `role-view.jsx`, `T` in `dossier.jsx`) — values match `tokens.css`; consolidate to one source in production.

## Assets
- **Logo mark** = inline SVG ("cufflink housing": rounded-square housing + band + 3-ring cuff), navy + gold; recolored for dark surfaces (`Mark` component). No external file.
- **Icons** = [lucide](https://lucide.dev) (`lucide@0.460.0`), consumed in the prototype through a small `lucide → React` shim (`window.LucideIcons`). In production use the framework-native lucide package (`lucide-react`, etc.) and delete the shim.
- **Fonts:** Geist + Geist Mono via Google Fonts.
- **Charts** = hand-built inline SVG (donut, growth-gap, comp-landscape, mini-vizzes) — no chart library. Re-implement with SVG or your charting lib of choice.
- No raster/brand image assets.

## Files in this bundle
- `Spyglass - Dossier Specs (Preview).html` — the review harness (segmented switcher + React/Babel + lucide shim). Loads the four `app_preview/*.jsx` views.
- `app_preview/portfolio.jsx` — **Client Home** (`PortfolioView`); depends on `window.SpyglassRoom` from `role-view.jsx`.
- `app_preview/role-view.jsx` — **Search Room** (`RoleView`) + the shared `SpyglassRoom` exports (BRAND, THEMES, ROLE, CANDS, SearchBrief, charts, Mark, style helpers, FitRing).
- `app_preview/dossier.jsx` — **Candidate Dossier** (`CandidateDossier`), self-contained.
- `Spyglass - Market Intel.html` — the client-facing **Market Intel** deep-dive page (depends on `role-view.jsx`); opens in a new tab from Client Home / Search Room.
- `brand/tokens.css` — the full token set.

> **Load order matters:** `role-view.jsx` must run before `portfolio.jsx` and before the Market Intel page's inline script, because both read `window.SpyglassRoom`. The harness already orders them correctly.
