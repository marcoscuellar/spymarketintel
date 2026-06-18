# Spyglass — Dossier Specs (Client Portal)

A Vite + React implementation of the Spyglass client-facing portal, recreated
from the `Spyglass - Dossier Specs (Preview).html` design handoff.

## Surfaces

A sticky toolbar toggles between the three client-facing views:

- **Client Home** — engagement overview: market intel brief + breakdown of open roles.
- **Search Room** — the role brief (market intel, comp landscape, growth-gap chart) with a candidate shortlist; selecting a candidate opens their preview.
- **Candidate Dossier** — the full dossier: Matrix scorecard donut, résumé, verified references, and notes.

> The Placeability Gauge view from the original preview is intentionally not included.

The views navigate between each other (e.g. "Open full dossier", "← Search room",
"All searches"), preserving the prototype's flow.

## Stack

- **Vite** + **React 18**
- **lucide-react** for icons
- **Geist** / **Geist Mono** (Google Fonts)

The prototype's inline-style theme objects are kept intact for pixel fidelity;
the only changes from the handoff are production plumbing (real ES module
imports/exports, bundled build, `lucide-react` instead of the in-browser shim).

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
  App.jsx               # toolbar + view switching + cross-view navigation
  index.css             # reset, keyframes, toolbar styles
  spyglass/
    useIsMobile.js      # shared viewport hook
    room.jsx            # shared brand/theme module + Search Room view
    portfolio.jsx       # Client Home view
    dossier.jsx         # Candidate Dossier view
_spyglass_import/        # original design handoff bundle (source reference)
```
