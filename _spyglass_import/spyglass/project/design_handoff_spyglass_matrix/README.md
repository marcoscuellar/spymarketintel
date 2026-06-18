# Handoff: Spyglass Matrix — Builder → Matrix → Client flow

## Overview
**Spyglass Matrix** is an internal tool for a recruiting/staffing firm. A recruiter submits a job description + their raw client-meeting notes; an AI generates a structured hiring **Matrix** (search strategy + role-specific screening questions), which is then **forked** into two views — a full internal *Recruiter* copy and a sanitized *Candidate-safe* copy. The recruiter submits the shortlist to a **Client Portal** where the client opens candidate dossiers, sends a decision, and closes the search.

This package documents a single connected prototype that covers three product surfaces:
1. **Matrix Builder** (the intake screen — the true internal landing page)
2. **The Matrix** (the generated, forked strategy document) + the *Submit to client* bridge
3. **Client Portal** (shortlist → dossier + feedback → placement)

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** — prototypes showing intended look and behavior, **not production code to ship directly**. The task is to **recreate these designs in the target codebase's environment** using its established patterns and component library (the prototype uses React 18 through an in-browser Babel transform, which is a prototyping convenience, not a production setup). If no front-end environment exists yet, pick an appropriate framework (React/Next recommended) and implement there.

The AI generation in the prototype calls a host-injected helper `window.claude.complete(prompt)`. **In production this must be replaced with a real server-side LLM call** (the JD + notes are confidential — keep keys server-side). The prototype gracefully falls back to a static sample Matrix when `window.claude` is absent.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions are intended as-is. Recreate the UI pixel-faithfully using the codebase's libraries. Exact tokens are listed below and in `brand/tokens.css`.

---

## Screens / Views

### 1. Matrix Builder (internal landing page)
**Purpose:** Recruiter submits the brief; AI auto-fills the engagement fields and (on submit) generates the Matrix.

**Layout (max-width 860px, centered, on a #f5f5f4 page; browser-frame chrome is prototype-only and must NOT be reproduced):**
- **App bar** (row, space-between, bottom hairline): left = Spyglass mark (26px) + wordmark `SPYGLASS MATRIX` (Geist 900, 16px, letter-spacing -0.06em) + breadcrumb `Builder` (15px, ink-3, left-border divider). Right = today's date (mono, 10px, uppercase, ink-3).
- **Heading block:** two-line editorial headline — line 1 `Ready. Set.` / line 2 `Create a ` + *Spyglass Matrix* (the product name is the accent). Base = Geist; accent span `.ed` = **Newsreader italic, gold (#C2A24C)**. Heading weight + accent color/font are tweakable (defaults: weight Bold/700, accent gold, accent font Serif). Below: sub paragraph (Geist 16px, ink-2, max 52ch).
- **Card** (white `--bg-card`, 1px `--line` border, radius 28px `--r-7`, padding 30×32, **drop shadow** `0 24px 60px -18px rgba(10,31,61,0.20), 0 4px 14px rgba(0,0,0,0.05)`), containing two labeled sections separated by a hairline:
  - **Section header pattern:** mono uppercase 11px label (`.bld-sec`) preceded by a 14×2px **gold tick** (`::before`, background `--amber`). A small mono "action" link sits at the right of the header row.
  - **THE BRIEF** (first): header action = `Load a sample brief`. Then label `Job description`, then a **2-col grid (12px gap)**: left = **upload dropzone** (min-height 152px, 1.5px dashed `rgba(10,31,61,0.32)`, radius 14px, centered: 44px white icon tile, `Upload here` 15.5px bold, `PDF · DOCX · TXT` mono caption); right = **paste textarea** (`…or paste the job description text.`). Below: `Your meeting notes` field with a `Dictate` ghost button (mic icon; toggles a pulsing "Listening…" indicator) and a tall textarea.
  - **THE ENGAGEMENT** (second): header action = `✨ Auto-fill from brief` (disabled until brief has content; shows `Reading the brief…` while working). Three 2-col rows: **Role** | **Client**; **Date opened** (`<input type=date>`) | **Engagement type** (select); **Salary / hourly rate** | **Location** (select).
  - **Build bar** (footer, top hairline, space-between): left = lock icon + note `Your notes shape the strategy — the candidate copy never shows them.`; right = primary CTA **`Build the Spyglass Matrix`** (gold/`--amber` button, dark text, arrow icon; disabled until JD text + notes are present).

**Inputs:** filled style, paper (`--paper`) background, 1px `--line` border, radius 12px (`--r-3`), Geist 15.5px 500; focus border = `--navy`. Selects use a custom navy chevron (inline SVG data-URI), `appearance:none`, placeholder option `Select…`.

**Dropdown options:**
- Engagement type: `Full time — Direct hire`, `Full time — Contract`, `Temp`, `Payrolling`
- Location: `Remote`, `Onsite`, `Hybrid`

**Card theme tweak:** `Light` (default — white card, paper inputs) or `Navy` (card background `--navy`, white inputs, cream text, deeper shadow). Toggled by adding/removing `theme-navy` on `<html>`.

### 2. The Matrix (generated, forked document)
**Purpose:** Show the AI-built strategy; toggle between Recruiter (full) and Candidate (sanitized) copies; print.

- **Doc toolbar:** segmented toggle `Recruiter view` ⇄ `Candidate view`; right = `↻ Re-run` and `Print` (`window.print()`), plus a `← New engagement` back link above it.
- **Document card** with header band (mark + `RECRUITER STRATEGY · THE MATRIX` / `CANDIDATE PACKET`, title `Role · Client · EngagementType`, tag `Generated <date>`), then a **meta strip** (cells: `Engagement` · `Location` · `Compensation` [recruiter-only] · `Opened`), then a 2-col body: sticky left rail nav + sections:
  - **01 Job description** — the FULL submitted JD verbatim, in a paper panel (`white-space: pre-wrap`).
  - **02 What to look for** (internal) — navy signal cards; **redacted** in candidate view.
  - **03 Qualifying questions** — each question + a candidate-safe "surfaces" tag; recruiter view adds a navy "WHY WE ASK · INTERNAL" note (removed from DOM in candidate view).
  - **04 Search & watch-outs** (internal) — target titles, boolean search code block, watch-out cards; **redacted** in candidate view.

### 3. Submit transition
Full-area overlay: spinning mark + stepped checklist (`Sealing internal strategy notes…` → `Packaging candidate-safe dossiers…` → `Encrypting the shortlist…` → `Sending to Meridian Wealth Advisors…`), ~2s, then routes to the Client Portal.

### 4. Client Portal / Dossier / Placement
- **Portal:** editorial masthead (`PREPARED BY SPYGLASS` / `FOR <CLIENT> · CONFIDENTIAL`, big headline `Your shortlist for <role>`, meta stats), then a **2-col card grid** of approved candidates (avatar, name, role·years, headline, tags, fit chip, `OPEN DOSSIER`).
- **Expanded dossier (client view):** header (avatar, name, fit chip, role·company), meta strip, then an **AI candidate brief** (header `SPYGLASS AI · CANDIDATE BRIEF` + `Re-draft`; intro paragraph; `WHY <NAME> FITS THE BRIEF` = 3 check bullets; a navy CTA block with a gold `Make your decision` button that scrolls to the decision panel), then the signal map. **Feedback panel** (`#decision-panel`, navy): choose `Advance to interview` / `Hold for now` / `Pass`, optional note, `Send to Spyglass`. On Advance → `Extend an offer` → **Placement** screen (navy brand moment + journey recap).

---

## Interactions & Behavior
- **Auto-fill:** uploading a readable text file (or clicking *Auto-fill from brief*) calls the LLM to extract `role, client, date, empType, salary, location` and fills any empty fields. Binary files (PDF/DOCX) can't be parsed client-side in the prototype — production should parse server-side.
- **Build:** validates JD text + notes present → shows BuildOverlay → LLM returns the Matrix JSON → renders the forked document. Min ~2s overlay.
- **Recruiter/Candidate toggle:** internal sections are *removed from the DOM* (not just hidden) in the candidate copy.
- **Print:** `@media print` hides app chrome/toolbars and prints only the Matrix document (preserves colors via `print-color-adjust: exact`).
- **Transitions:** ease `cubic-bezier(0.16,1,0.3,1)`; hovers lift cards via translateY + shadow. Respect `prefers-reduced-motion`.

## State Management
Top-level flow `stage`: `builder → building → matrix → submitting → client`. Builder local state: `role, client, date, empType, salary, location, jd, notes, file, extracting`. Generated matrix object held at flow level (`genMatrix`). Client flow context: `approvals, feedback, placed, clientView` (portal | dossier | placement). Tweaks (persisted): `headingWeight, accent, accentFont, cardTheme`.

## AI / Data contract
- **Generate Matrix** — input: role, client, date, empType, salary, location, JD text, notes. Output JSON: `{ jd:{title,summary,summary2,mustHave[],niceToHave[]}, lookFor:[{signal,detail}]×3, questions:[{q,surfaces,internal}]×4, targetTitles[3], boolean, watchOuts:[{flag,note}]×2 }`. `lookFor`, each `internal`, and `watchOuts` derive from the **private notes**, not the JD. The full raw JD is preserved and displayed verbatim.
- **Extract fields** — input: brief text. Output JSON: `{role,client,date(YYYY-MM-DD),empType,salary,location}`.
- The candidate **fit score + per-signal grades are currently static sample data** — NOT computed from the generated Matrix. (Owner intends a real scoring formula; wire a second AI/scoring step later.)

## Design Tokens (see `brand/tokens.css`)
- **Navy** `--navy #0A1F3D` (primary brand / internal accent) · **Gold** `--amber #C2A24C` (jewel accent, CTAs, success) · **Ink** `--ink #0a0a0a`, `--ink-2 #525252`, `--ink-3 #a3a3a3`, `--ink-4 #d4d4d4` · **Surfaces** `--bg/-bg-card #ffffff`, `--paper #f5f5f4` · `--line #e7e5e4` · **Cream** `--cream #F5EFE0` (text on navy).
- **Type:** `--font 'Geist'` (UI), `--mono 'Geist Mono'` (labels/eyebrows, uppercase, tracked), **Newsreader italic** for the editorial accent word only.
- **Radii:** r-2 8 · r-3 12 · r-4 14 · r-5 16 · r-6 20 · r-7 28 · r-8 32.
- **Shadow (card):** `0 24px 60px -18px rgba(10,31,61,0.20), 0 4px 14px rgba(0,0,0,0.05)`.
- **Ease:** `cubic-bezier(0.16,1,0.3,1)`.

## Assets
- **Logo mark** = inline SVG ("cufflink housing": rounded square housing + band + 3-ring cuff), recolored per variant — no external file. Wordmark is Geist 900 text.
- **Icons** = inline SVGs (upload, mic, file, spark, lock, check, arrow, printer, eye, flag).
- **Fonts:** Geist + Geist Mono + Newsreader via Google Fonts.
- No raster/brand image assets.

## Files (design references in this bundle)
- `Spyglass - Phases 2 & 4 (Designed).html` — the entry file; wires all stages, the flow, tweaks, prompts, and the print stylesheet.
- `app/data.jsx`, `app/flow-data.jsx` — sample data (engagements, MATRIX, candidates/dossiers, score meta).
- `app/ui.jsx` — primitives (Mark, Wordmark, Tag, Button, MonoButton, Card, Arrow, Eyebrow).
- `app/matrix.jsx` — the Matrix document + forked Recruiter/Candidate rendering + Print.
- `app/dossier.jsx` — dossier body, meta, AI candidate brief, overlay.
- `app/client.jsx` — client portal, expanded dossier + feedback, placement.
- `app/sourcing.jsx`, `app/engagement.jsx`, `app/pipeline.jsx` — supporting components/primitives.
- `brand/tokens.css` — the full token set.
- `tweaks-panel.jsx` — prototype-only tweak controls (not production).
