# Spyglass — Client Portal

A Vite + React implementation of the **Spyglass client-facing portal**, built from
the `design_handoff_dossier_specs` handoff (the three client-portal screens).

## Surfaces

Three client-facing screens, reached through in-context navigation (no internal
toolbar):

- **Client Home** (`PortfolioView`) — the portal landing: client hero, a
  company-level **Market intel** block (company write-up + Growth-signal callout,
  four fact cards, **Competitor landscape** + **Industry signals**), and a
  **Breakdown of the roles** list grouped into *Needs your decision / In progress /
  Closed & on hold*. An **Edit** toggle makes the intel inline-editable.
- **Search Room** (`RoleView`) — one search in depth: hero + the shortlist roster
  with an inline candidate preview.
- **Candidate Dossier** (`CandidateDossier`) — the full record: weighted scorecard
  donut, written read, résumé, verified references, and private notes.

Navigation: clicking a role row with an "Open room" badge → Search Room; "Open
full dossier" → Candidate Dossier; back-links climb the ladder (Dossier → Search
room → All searches). The prototype's `window` CustomEvents drive this; swap for
real routes in production.

> **Out of scope:** the internal *Placeability Gauge* (archived in the handoff) and
> the *Market Intel* deep-dive page are not built yet.

## Editing the intel

Client Home has an **Edit / Done editing** toggle (gold when active; also
reachable via `?edit=1`). In edit mode the four facts, the competitor names/shares,
and the industry-signal headlines become inline-editable; edits persist to
`localStorage` (`spg-intel-edits`). This is the spot a real save-to-backend hook
lands.

## Notable deltas from the raw prototype

- Internal spec-preview toolbar removed (it's a review harness, not product nav).
- Search Room **theme switcher** dropped — production is the single **Light** theme,
  per the handoff.
- The four Client Home fact cards are individual **drop-shadow cards**.
- Subtle staggered entrance animation on Client Home (honors `prefers-reduced-motion`).

## Stack

- **Vite** + **React 18**
- **lucide-react** for icons (replaces the prototype's in-browser lucide shim)
- **Geist** / **Geist Mono** (Google Fonts)

The handoff's inline-style theme objects are kept intact for pixel fidelity; the
changes are production plumbing (ES module imports/exports, bundled build).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Layout

```
index.html              # app shell + font links
src/
  main.jsx              # React entry
  App.jsx               # view switching + cross-view navigation (no toolbar)
  index.css             # reset, keyframes, reduced-motion guard
  spyglass/
    useIsMobile.js      # shared viewport hook
    room.jsx            # shared brand/theme module + Search Room (RoleView)
    portfolio.jsx       # Client Home (PortfolioView)
    dossier.jsx         # Candidate Dossier (CandidateDossier)
_spyglass_import/        # original (v1) design handoff bundle (reference)
_spyglass_handoff_v2/    # current handoff — design_handoff_dossier_specs (reference)
```
