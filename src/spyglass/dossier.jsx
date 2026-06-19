import React, { useState, useMemo, useEffect } from "react";
import { Mic, FileText, DollarSign, MapPin, ShieldCheck, Quote, Calendar, MessageSquareText, XCircle, Send, GraduationCap, Award, Briefcase, Plus, StickyNote, Search, Sparkles } from "lucide-react";
import { matrixToText, MATRIX_LABEL } from "./matrix-data.js";
import { getCandidate, getSearch, firstRoomSearch, CLIENT } from "./searches.js";

/* The live matrix, pre-loaded so adding a candidate is just pasting their résumé. */
const MATRIX_SEED = matrixToText();

/* ── Spyglass brand · white surfaces, ink text, metallic-gold accent, navy structure, red = Pass only ── */
const T = {
  ink: "#0A0A0A", ink2: "#525252", ink3: "#A3A3A3", ink4: "#D4D4D4",
  bg: "#FFFFFF", card: "#FFFFFF", card2: "#F5F5F4", paper: "#F5F5F4",
  line: "#E7E5E4", lineSoft: "#EDEDEB",
  gold: "#C2A24C",        // brand metallic gold — fills, icons, rules, donut
  goldText: "#876B1E",    // deep gold — gold text on light (legible)
  goldBg: "#FAF6EA", goldLine: "#E5D29B",
  navy: "#0A1F3D",
  red: "#DC2626",
  font: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'Geist Mono', ui-monospace, Menlo, monospace",
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  sh: "0 12px 32px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
  r: { card: 20, btn: 12, field: 10, panel: 14, chip: 8 },
};

/* ── Default sample dossier (Mateo Ríos). Generation / edits replace this and persist to localStorage. ── */
const DEFAULT_DATA = {
  candidate: {
    name: "Mateo Ríos",
    current: "Sr. Full-Stack Engineer — ex-Nubank",
    salary: "$85K–$95K target",
    location: "São Paulo, BR · UTC−3",
    pitch: "Owns data-platform builds end to end; HR-tech depth.",
    compliance: "Background + references verified",
  },
  criteria: [
    { name: "Data Platform · Architecture", weight: 20, src: "matrix", v: 96, meaning: "This pod owns the Clarent data platform. Mateo has built a multi-tenant data platform end to end — ingestion, model, and APIs — the closest analog on the slate." },
    { name: "HRIS / Integrations", weight: 16, src: "matrix", v: 92, meaning: "Clarent lives on clean, unified data. Mateo has wired messy third-party systems into a single source of truth — exactly the PCC / Yardi / Aline integration problem." },
    { name: "Full-Stack Delivery", weight: 16, src: "matrix", v: 92, meaning: "Ships end to end in TypeScript, Node, Postgres, and React — no hand-offs needed to move a feature from data layer to UI." },
    { name: "AI / ML Pragmatism", weight: 12, src: "matrix", v: 84, meaning: "Can support the AI scorecard — solid, practical ML — though the heavier model work may want Diego alongside him." },
    { name: "US-Hours Collaboration", weight: 12, src: "live", v: 92, meaning: "Interview-scored. Works from São Paulo (UTC−3) with real daytime overlap for the Procare team — async by default, available when it counts." },
    { name: "Ownership in Ambiguity", weight: 12, src: "live", v: 92, meaning: "Interview-scored. Thrives in lean, founder-led shops — unblocks himself and owns outcomes, not tickets." },
    { name: "English / Communication", weight: 7, src: "live", v: 88, meaning: "Interview-scored. Clear, fluent written and spoken English; comfortable in product and stakeholder conversations." },
    { name: "Comp Alignment", weight: 5, src: "matrix", v: 95, meaning: "The easy part. His ask lands well below the US senior-engineering band — the entire reason nearshore works here." },
  ],
  why: [
    "Mateo is a platform builder. At Nubank he owned a multi-tenant data platform end to end — ingestion, the data model, and the API layer other teams built on — which is the closest analog on this slate to what Clarent needs. You are not hiring a feature contractor; you are hiring someone who can own the platform.",
    "His depth is integrations and data correctness. He has wired messy third-party systems into a single source of truth — exactly the problem Clarent's “data dictionary” is solving across PCC, Yardi, and the rest. For a roadmap that lives or dies on clean, unified HR data, that is the core skill.",
    "He works US hours from São Paulo (UTC−3) and is comfortable in lean, founder-led shops — async by default, with real daytime overlap for the Procare team. He reads as low-ego and ownership-minded, the kind of engineer who unblocks himself.",
    "The honest watch-out is AI depth: he is strong, pragmatic full-stack and data, but the AI-scorecard work may want Diego alongside him. Comp is the easy part — his ask lands well below the US senior-engineering band, the entire reason nearshore works here.",
  ],
  resume: [
    { role: "Sr. Full-Stack Engineer", company: "Nubank · Remote (São Paulo)", dates: "2021 — Present", bullets: ["Owned a multi-tenant data platform — ingestion, modeling, and APIs — used across product teams.", "Built integrations into a dozen third-party systems with strong data-quality guarantees.", "Stack: TypeScript, Node, Postgres, React, AWS."] },
    { role: "Full-Stack Engineer", company: "QuintoAndar · São Paulo, BR", dates: "2017 — 2021", bullets: ["Shipped customer-facing product across web and backend services.", "Led the migration to a unified events / data pipeline."] },
    { role: "Software Engineer", company: "Freelance / early-stage", dates: "2015 — 2017", bullets: ["Full-stack builds for early-stage startups."] },
  ],
  education: "B.S., Computer Science — USP (São Paulo)",
  certifications: ["AWS Solutions Architect — Associate", "Postgres · Kafka · TypeScript"],
  references: [
    { name: "Paula Menezes", role: "Eng Manager, Nubank (current)", status: "Spoke 6/16", quote: "Mateo owned our data platform like a founder would — he cares as much about the integration edge-cases as the architecture." },
    { name: "Rafael Lima", role: "CTO, QuintoAndar (former)", status: "Spoke 6/15", quote: "Give him an ambiguous platform problem and he comes back with something shipped and clean. I'd hire him again tomorrow." },
  ],
};

const DOSSIERS_KEY = "spg-dossiers-v2";     // the full candidate list (v2: seeded from searches)
const ACTIVE_KEY = "spg-active-dossier";   // which candidate is open
const MATRIX_KEY = "spg-matrix";           // the matrix, remembered + reused across candidates

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
}
const uid = () => "c" + Math.random().toString(36).slice(2, 9);

/* A dossier object for a candidate from a search (its own id + per-candidate notes). */
function fromCandidate(c) {
  const base = c.dossier || {
    candidate: { name: c.name, current: `${c.role}${c.company ? " — " + c.company : ""}`, salary: "", location: c.location || "", pitch: c.blurb || "", compliance: "" },
    criteria: [], why: (c.why || []).slice(), resume: [], education: "", certifications: [], references: [],
  };
  return { id: c.id, ...base, notes: [] };
}

/* A not-yet-generated candidate. The Generate tab fills it in from the résumé. */
function blankDossier() {
  return { id: uid(), candidate: { name: "New candidate", current: "", salary: "", location: "", pitch: "", compliance: "" },
    criteria: [], why: [], resume: [], education: "", certifications: [], references: [], notes: [] };
}

/* Load the candidate list, seeding from the live search's roster on first run. */
function loadDossiers() {
  const list = load(DOSSIERS_KEY, null);
  if (Array.isArray(list) && list.length) return list.map((d) => ({ ...d, id: d.id || uid(), notes: d.notes || [] }));
  const seed = (firstRoomSearch().candidates || []).map(fromCandidate);
  return seed.length ? seed : [{ ...DEFAULT_DATA, id: uid(), notes: [] }];
}

/* ── The Spyglass mark (cufflink housing) — navy + gold ── */
function Mark({ size = 28 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Spyglass">
      <rect width="100" height="100" rx="28" fill="#0A1F3D"></rect>
      <rect x="14" y="38" width="72" height="24" rx="3" fill="#ffffff"></rect>
      <line x1="20" y1="50" x2="62" y2="50" stroke="#0A1F3D" strokeWidth="1.4" strokeDasharray="3 3"></line>
      <circle cx="72" cy="50" r="9" fill="#C2A24C"></circle>
      <circle cx="72" cy="50" r="5" fill="#0A1F3D"></circle>
      <circle cx="72" cy="50" r="2" fill="#C2A24C"></circle>
    </svg>
  );
}

/* Inline-editable text: plain string when off, contentEditable when editing. */
function Ed({ editing, value, onChange, style, block }) {
  if (!editing) return value;
  return (
    <span contentEditable suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.innerText)}
      style={{ outline: "none", background: T.goldBg, borderRadius: 3, padding: "0 3px", borderBottom: `1px dashed ${T.goldLine}`, cursor: "text", display: block ? "block" : "inline", ...style }}>
      {value}
    </span>
  );
}

/* SVG donut — gold fill, paper track, height = score */
const CX = 140, CY = 140, R_IN = 70, R_OUT = 128, GAP = 3;
const polar = (r, d) => { const a = (d - 90) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
const arc = (rO, rI, a0, a1) => {
  const L = a1 - a0 > 180 ? 1 : 0;
  const [x1, y1] = polar(rO, a0), [x2, y2] = polar(rO, a1), [x3, y3] = polar(rI, a1), [x4, y4] = polar(rI, a0);
  return `M ${x1} ${y1} A ${rO} ${rO} 0 ${L} 1 ${x2} ${y2} L ${x3} ${y3} A ${rI} ${rI} 0 ${L} 0 ${x4} ${y4} Z`;
};

function CandidateDossier({ searchId, candidateId }) {
  const [tab, setTab] = useState("overview");
  const [active, setActive] = useState(null);
  const [composer, setComposer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [dossiers, setDossiers] = useState(loadDossiers);
  const [activeId, setActiveId] = useState(() => candidateId || load(ACTIVE_KEY, null));
  const [draft, setDraft] = useState("");

  // Which search this dossier belongs to (drives the hero).
  const search = getSearch(searchId) || firstRoomSearch();

  // Bridge: when a candidate is opened from a Search Room, make sure it's in
  // the list and select it (without losing edits to one already present).
  useEffect(() => {
    if (!candidateId) return;
    setDossiers((list) => {
      if (list.some((d) => d.id === candidateId)) return list;
      const c = getCandidate(searchId, candidateId);
      return c ? [...list, fromCandidate(c)] : list;
    });
    setActiveId(candidateId);
    setActive(null); setComposer(null); setTab("overview");
  }, [searchId, candidateId]);

  // Generate-from-Matrix inputs + status. The matrix is shared across candidates
  // and remembered, so adding a candidate is just pasting their résumé.
  const [gMatrix, setGMatrix] = useState(() => {
    const s = load(MATRIX_KEY, "");
    // Use the live matrix if nothing is saved, or if the saved copy is a retired search.
    if (!s || !s.trim() || /Meridian Wealth Advisors|Senior Tax Manager/.test(s)) return MATRIX_SEED;
    return s;
  });
  const [gNotes, setGNotes] = useState("");
  const [gResume, setGResume] = useState("");
  const [gLoading, setGLoading] = useState(false);
  const [gError, setGError] = useState(null);

  // Resolve the active candidate, falling back to the first.
  const activeIdx = Math.max(0, dossiers.findIndex((d) => d.id === activeId));
  const data = dossiers[activeIdx] || dossiers[0];
  const setData = (updater) => setDossiers((list) => list.map((d) =>
    d.id === data.id ? (typeof updater === "function" ? updater(d) : { ...updater, id: d.id, notes: d.notes }) : d));

  useEffect(() => { try { localStorage.setItem(DOSSIERS_KEY, JSON.stringify(dossiers)); } catch (e) {} }, [dossiers]);
  useEffect(() => { if (data) try { localStorage.setItem(ACTIVE_KEY, JSON.stringify(data.id)); } catch (e) {} }, [data]);
  useEffect(() => { try { localStorage.setItem(MATRIX_KEY, JSON.stringify(gMatrix)); } catch (e) {} }, [gMatrix]);

  const notes = data.notes || [];
  const setNotes = (updater) => setData((d) => ({ ...d, notes: typeof updater === "function" ? updater(d.notes || []) : updater }));

  // Add a fresh candidate and jump to Generate (matrix stays filled, résumé/notes clear).
  const addCandidate = () => {
    const nd = blankDossier();
    setDossiers((list) => [...list, nd]);
    setActiveId(nd.id);
    setGNotes(""); setGResume(""); setGError(null);
    setActive(null); setEditing(false); setTab("generate");
  };
  const removeCandidate = (id) => {
    if (dossiers.length <= 1) return;
    if (!window.confirm("Remove this candidate from the dossier?")) return;
    const rest = dossiers.filter((d) => d.id !== id);
    setDossiers(rest);
    if (id === data.id) setActiveId(rest[0]?.id || null);
    setActive(null); setTab("overview");
  };
  const selectCandidate = (id) => { setActiveId(id); setActive(null); setComposer(null); setTab("overview"); };

  const cand = data.candidate;
  const first = (cand.name || "the candidate").split(" ")[0];
  const totalW = data.criteria.reduce((a, c) => a + (+c.weight || 0), 0) || 1;
  const overall = Math.round(data.criteria.reduce((a, c) => a + (+c.v || 0) * (+c.weight || 0), 0) / totalW);

  const segs = useMemo(() => {
    let cum = 0;
    return data.criteria.map((c) => {
      const span = ((+c.weight || 0) / totalW) * 360, a0 = cum + GAP / 2, a1 = cum + span - GAP / 2;
      cum += span;
      return { ...c, a0, a1, rScore: R_IN + ((+c.v || 0) / 100) * (R_OUT - R_IN) };
    });
  }, [data, totalW]);
  const act = active != null ? segs[active] : null;

  // updaters
  const updCand = (k, v) => setData((d) => ({ ...d, candidate: { ...d.candidate, [k]: v } }));
  const updWhy = (i, v) => setData((d) => ({ ...d, why: d.why.map((p, x) => (x === i ? v : p)) }));
  const updField = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const updCert = (i, v) => setData((d) => ({ ...d, certifications: d.certifications.map((c, x) => (x === i ? v : c)) }));
  const updResume = (i, k, v) => setData((d) => ({ ...d, resume: d.resume.map((j, x) => (x === i ? { ...j, [k]: v } : j)) }));
  const updBullet = (i, bi, v) => setData((d) => ({ ...d, resume: d.resume.map((j, x) => (x === i ? { ...j, bullets: j.bullets.map((b, y) => (y === bi ? v : b)) } : j)) }));
  const updRef = (i, k, v) => setData((d) => ({ ...d, references: d.references.map((r, x) => (x === i ? { ...r, [k]: v } : r)) }));

  async function generate() {
    setGLoading(true); setGError(null);
    try {
      const r = await fetch("/api/generate-dossier", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ matrix: gMatrix, notes: gNotes, resume: gResume }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Generation failed.");
      setData({
        candidate: j.candidate || DEFAULT_DATA.candidate,
        criteria: Array.isArray(j.criteria) && j.criteria.length ? j.criteria : DEFAULT_DATA.criteria,
        why: Array.isArray(j.why) ? j.why : [],
        resume: Array.isArray(j.resume) ? j.resume : [],
        education: j.education || "",
        certifications: Array.isArray(j.certifications) ? j.certifications : [],
        references: Array.isArray(j.references) ? j.references : [],
      });
      setActive(null); setTab("overview");
    } catch (e) {
      setGError(e.message || "Generation failed.");
    } finally {
      setGLoading(false);
    }
  }

  const mono = { fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.ink3 };
  const sectionH = { fontFamily: T.font, fontWeight: 800, fontSize: 22, letterSpacing: "-0.025em", lineHeight: 1.1, color: T.goldText };
  const card = { background: T.card, border: `1px solid ${T.line}`, borderRadius: T.r.card, boxShadow: T.sh, color: T.ink };
  const TABS = [["overview", "Overview"], ["detail", "Detail"], ["notes", "Notes"], ["generate", "✨ Generate"]];
  const fieldLabel = { ...mono, fontSize: 10, marginBottom: 7, display: "block" };

  return (
    <div style={{ fontFamily: T.font, color: T.ink, background: T.bg, minHeight: "100%", padding: "0 0 40px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(32px, 6vw, 100px)" }}>

        {/* ── HEADER ── */}
        <header>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0 20px", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: T.font, fontWeight: 900, fontSize: 17, letterSpacing: "-0.07em", color: T.ink }}>SPYGLASS PARTNERS</span>
              <span style={{ width: 1, height: 18, background: T.line, margin: "0 4px" }} />
              <button onClick={() => window.dispatchEvent(new CustomEvent("spg-open-room", { detail: { searchId: search.id } }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: T.ink3, display: "inline-flex", alignItems: "center", gap: 6 }}>← Search room</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => setEditing((e) => !e)}
                style={{ ...mono, fontSize: 10, color: editing ? "#241a05" : T.ink3, cursor: "pointer", border: `1px solid ${editing ? T.gold : T.line}`, background: editing ? T.gold : "transparent", padding: "7px 13px", borderRadius: 8 }}>
                {editing ? "Done editing" : "Edit"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 18px", borderRadius: 14, border: `1px solid ${T.line}`, background: T.bg, minWidth: 230 }}>
                <Search size={15} color={T.ink3} />
                <input placeholder="Candidate name…" value={cand.name} onChange={(e) => updCand("name", e.target.value)}
                  style={{ border: "none", outline: "none", background: "transparent", color: T.ink, fontFamily: T.font, fontSize: 15, width: "100%" }} />
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: T.line }} />

          <div style={{ padding: "56px 0 48px", paddingLeft: "clamp(0px, 5vw, 90px)" }}>
            <div style={{ fontFamily: T.mono, fontSize: 14, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: T.goldText, marginBottom: 26 }}>
              {CLIENT.name} · {search.eyebrow}
            </div>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(46px, 7.5vw, 94px)", lineHeight: 0.95, letterSpacing: "-0.045em", margin: 0, color: T.ink }}>
              {search.h1[0]}<br />{search.h1[1]}
            </h1>
            <p style={{ fontSize: "clamp(18px, 2.1vw, 24px)", lineHeight: 1.5, color: T.ink2, maxWidth: "38ch", marginTop: 28 }}>
              {search.lede}
            </p>
          </div>
        </header>

        {/* ── CANDIDATE SWITCHER ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "24px 0 18px" }}>
          <span style={{ ...mono, fontSize: 11, marginRight: 4 }}>Candidates</span>
          {dossiers.map((d) => {
            const on = d.id === data.id;
            return (
              <span key={d.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 6px 8px 14px",
                borderRadius: 999, border: `1px solid ${on ? T.gold : T.line}`, background: on ? T.goldBg : T.bg, transition: `all .18s ${T.ease}` }}>
                <button onClick={() => selectCandidate(d.id)} style={{ border: "none", background: "none", cursor: "pointer", padding: 0,
                  fontFamily: T.font, fontSize: 14, fontWeight: on ? 700 : 500, color: on ? T.goldText : T.ink2 }}>
                  {d.candidate?.name || "New candidate"}
                </button>
                {dossiers.length > 1 && (
                  <button onClick={() => removeCandidate(d.id)} title="Remove candidate" aria-label="Remove candidate"
                    style={{ border: "none", background: "none", cursor: "pointer", padding: "0 5px", lineHeight: 1, fontSize: 16, color: on ? T.goldText : T.ink3 }}>×</button>
                )}
              </span>
            );
          })}
          <button onClick={addCandidate} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 15px",
            borderRadius: 999, border: `1px dashed ${T.gold}`, background: T.bg, cursor: "pointer",
            fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.goldText }}>
            <Plus size={15} strokeWidth={2} /> Add candidate
          </button>
        </div>

        {/* ── BODY ── */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>

          {/* LEFT rail */}
          <aside style={{ ...card, padding: 28, position: "sticky", top: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: "-0.04em", lineHeight: 1 }}><Ed editing={editing} value={cand.name} onChange={(v) => updCand("name", v)} /></div>
            <div style={{ fontSize: 14, color: T.ink2, marginTop: 9, lineHeight: 1.45 }}><Ed editing={editing} value={cand.current} onChange={(v) => updCand("current", v)} /></div>

            <div style={{ display: "inline-flex", alignItems: "baseline", gap: 8, marginTop: 18, padding: "8px 14px",
              borderRadius: T.r.chip, background: T.goldBg, border: `1px solid ${T.goldLine}` }}>
              <span style={{ fontFamily: T.mono, fontWeight: 800, fontSize: 19, color: T.goldText, letterSpacing: "-0.03em" }}>{overall}%</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>match</span>
            </div>

            <div style={{ height: 1, background: T.line, margin: "24px 0" }} />

            {[
              { ic: <DollarSign size={17} strokeWidth={1.7} />, k: "Salary", f: "salary", em: true },
              { ic: <MapPin size={17} strokeWidth={1.7} />, k: "Location", f: "location", em: true },
              { ic: <Quote size={17} strokeWidth={1.7} />, k: "In one line", f: "pitch" },
              { ic: <ShieldCheck size={17} strokeWidth={1.7} />, k: "Compliance", f: "compliance" },
            ].map((s) => (
              <div key={s.k} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 12, marginBottom: 20 }}>
                <span style={{ color: T.gold, marginTop: 2 }}>{s.ic}</span>
                <span>
                  <span style={{ ...mono, fontSize: 11, display: "block", marginBottom: 4 }}>{s.k}</span>
                  <span style={{ fontSize: 15, color: T.ink, lineHeight: 1.45, fontWeight: s.em ? 600 : 400 }}><Ed editing={editing} value={cand[s.f]} onChange={(v) => updCand(s.f, v)} /></span>
                </span>
              </div>
            ))}

            <div style={{ height: 1, background: T.line, margin: "6px 0 18px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <button onClick={() => setComposer(composer === "q" ? null : "q")} style={btn(T, "ghost")}><MessageSquareText size={16} strokeWidth={1.8} />Questions for Spyglass</button>
              <button onClick={() => setComposer(composer === "book" ? null : "book")} style={btn(T, "primary")}><Calendar size={16} strokeWidth={1.8} />Book Interview</button>
              <button onClick={() => setComposer(composer === "pass" ? null : "pass")} style={btn(T, "danger")}><XCircle size={16} strokeWidth={1.8} />Pass &amp; Why</button>
            </div>

            {composer && (
              <div style={{ marginTop: 14 }}>
                {composer === "book" ? (
                  <div style={{ fontSize: 13.5, color: T.ink, background: T.card2, border: `1px solid ${T.line}`, borderRadius: T.r.panel, padding: 14, display: "flex", gap: 10, alignItems: "flex-start", lineHeight: 1.45 }}>
                    <Calendar size={16} color={T.gold} style={{ flexShrink: 0, marginTop: 1 }} /> Spyglass will coordinate {first}'s interview with your team — suggested next Tue/Wed AM.
                  </div>
                ) : (
                  <div style={{ background: T.card2, border: `1px solid ${composer === "pass" ? T.red : T.line}`, borderRadius: T.r.panel, padding: 14 }}>
                    <div style={{ ...mono, fontSize: 11, marginBottom: 9, color: composer === "pass" ? T.red : T.goldText }}>{composer === "pass" ? "Pass — tell us why" : "Question for Spyglass"}</div>
                    <textarea rows={3} placeholder={composer === "pass" ? "e.g. want more AI depth / a different time zone…" : `Ask anything about ${first} or the pod…`} style={ta(T)} />
                    <button style={{ ...btn(T, "primary"), marginTop: 9, padding: "10px 12px" }}><Send size={15} strokeWidth={1.8} />Send</button>
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* RIGHT main */}
          <main style={{ ...card, overflow: "hidden", minHeight: 540 }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${T.line}`, padding: "0 10px" }}>
              {TABS.map(([id, label]) => {
                const on = tab === id;
                return (
                  <button key={id} onClick={() => { setTab(id); setActive(null); }}
                    style={{ border: "none", background: "none", cursor: "pointer", fontFamily: T.font, fontSize: 16,
                      fontWeight: on ? 700 : 500, color: on ? T.goldText : T.ink3, padding: "20px 20px 16px",
                      borderBottom: `2px solid ${on ? T.gold : "transparent"}`, marginBottom: -1, transition: `all .18s ${T.ease}` }}>
                    {label}
                  </button>
                );
              })}
            </div>

            <div style={{ padding: 30 }}>
              {/* OVERVIEW */}
              {tab === "overview" && (
                <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 30, alignItems: "center" }}>
                  <svg viewBox="0 0 280 280" style={{ width: "100%", maxWidth: 280 }}>
                    {segs.map((s, i) => <path key={"t" + i} d={arc(R_OUT, R_IN, s.a0, s.a1)} fill={T.paper} />)}
                    {segs.map((s, i) => (
                      <path key={i} d={arc(s.rScore, R_IN, s.a0, s.a1)} fill={T.gold}
                        onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
                        onClick={() => setActive(active === i ? null : i)}
                        style={{ cursor: "pointer", opacity: active == null ? 1 : active === i ? 1 : 0.3, transition: `opacity .2s ${T.ease}` }} />
                    ))}
                    <circle cx={CX} cy={CY} r={R_IN - 2} fill={T.card} />
                    <text x={CX} y={CY - 4} textAnchor="middle" style={{ fontFamily: T.font, fontWeight: 800, fontSize: 54, letterSpacing: "-0.05em", fill: T.goldText }}>{act ? act.v : overall}</text>
                    <text x={CX} y={CY + 22} textAnchor="middle" style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fill: T.ink2 }}>{act ? act.name.split(" ")[0] : "Overall match"}</text>
                  </svg>
                  <div>
                    {act ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                          {act.src === "live" ? <Mic size={15} strokeWidth={1.8} color={T.gold} /> : <FileText size={15} strokeWidth={1.8} color={T.ink3} />}
                          <span style={{ ...mono, color: T.goldText }}>{act.name} · {act.v} · wt {act.weight}%</span>
                        </div>
                        <div style={{ fontSize: 17, lineHeight: 1.6, color: T.ink }}>{act.meaning}</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ ...sectionH, marginBottom: 12 }}>The quick read</div>
                        <div style={{ fontSize: 19, lineHeight: 1.55, color: T.ink, marginBottom: 16 }}>
                          {cand.pitch} {overall}% overall match — hover any wedge to see how each criterion scored.
                        </div>
                        <div style={{ ...mono, fontSize: 12 }}>Full write-up in <span style={{ color: T.goldText }}>Detail</span>.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* DETAIL */}
              {tab === "detail" && (
                <div style={{ fontSize: 17, lineHeight: 1.65, color: T.ink }}>
                  <div style={{ ...sectionH, marginBottom: 16 }}>Why {first} fits this search</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 30 }}>
                    {data.why.map((p, i) => <p key={i} style={{ margin: 0 }}><Ed editing={editing} value={p} onChange={(v) => updWhy(i, v)} block /></p>)}
                  </div>

                  <div style={{ height: 1, background: T.line, margin: "0 0 24px" }} />
                  <div style={{ ...sectionH, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}><Briefcase size={19} strokeWidth={1.9} />Résumé</div>
                  {data.resume.map((j, i) => (
                    <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${T.lineSoft}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontWeight: 700, fontSize: 17 }}><Ed editing={editing} value={j.role} onChange={(v) => updResume(i, "role", v)} /></span>
                        <span style={{ fontFamily: T.mono, fontSize: 12, color: T.ink3, whiteSpace: "nowrap" }}><Ed editing={editing} value={j.dates} onChange={(v) => updResume(i, "dates", v)} /></span>
                      </div>
                      <div style={{ fontSize: 14, color: T.ink2, margin: "3px 0 9px" }}><Ed editing={editing} value={j.company} onChange={(v) => updResume(i, "company", v)} /></div>
                      <ul style={{ margin: 0, paddingLeft: 20, color: T.ink2 }}>{j.bullets.map((x, bi) => <li key={bi} style={{ marginBottom: 5 }}><Ed editing={editing} value={x} onChange={(v) => updBullet(i, bi, v)} /></li>)}</ul>
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, margin: "6px 0 30px" }}>
                    <div><div style={{ ...mono, marginBottom: 9, color: T.goldText, display: "flex", alignItems: "center", gap: 7 }}><GraduationCap size={14} strokeWidth={1.7} />Education</div><div><Ed editing={editing} value={data.education} onChange={(v) => updField("education", v)} /></div></div>
                    <div><div style={{ ...mono, marginBottom: 9, color: T.goldText, display: "flex", alignItems: "center", gap: 7 }}><Award size={14} strokeWidth={1.7} />Certifications</div>{data.certifications.map((c, i) => <div key={i} style={{ color: i ? T.ink2 : T.ink }}><Ed editing={editing} value={c} onChange={(v) => updCert(i, v)} /></div>)}</div>
                  </div>

                  <div style={{ height: 1, background: T.line, margin: "0 0 24px" }} />
                  <div style={{ ...sectionH, marginBottom: 16 }}>References · verified by Spyglass</div>
                  {data.references.length === 0 ? (
                    <div style={{ ...mono }}>No references captured yet.</div>
                  ) : data.references.map((r, i) => (
                    <div key={i} style={{ background: T.card2, border: `1px solid ${T.line}`, borderRadius: T.r.panel, padding: 18, marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                        <span style={{ fontWeight: 700, fontSize: 16 }}><Ed editing={editing} value={r.name} onChange={(v) => updRef(i, "name", v)} /></span>
                        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, fontWeight: 600 }}><Ed editing={editing} value={r.status} onChange={(v) => updRef(i, "status", v)} /></span>
                      </div>
                      <div style={{ fontSize: 13, color: T.ink2, marginTop: 3, marginBottom: 11 }}><Ed editing={editing} value={r.role} onChange={(v) => updRef(i, "role", v)} /></div>
                      <div style={{ fontSize: 15, lineHeight: 1.55, color: T.ink, fontStyle: "italic", paddingLeft: 16, borderLeft: `2px solid ${T.gold}` }}>"<Ed editing={editing} value={r.quote} onChange={(v) => updRef(i, "quote", v)} />"</div>
                    </div>
                  ))}
                </div>
              )}

              {/* NOTES */}
              {tab === "notes" && (
                <div>
                  <div style={{ ...sectionH, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}><StickyNote size={19} strokeWidth={1.9} />Your notes on {first}</div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 22, alignItems: "flex-start" }}>
                    <textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a note for your team…" style={{ ...ta(T), flex: 1, fontSize: 15 }} />
                    <button onClick={() => { if (!draft.trim()) return;
                        setNotes((n) => [{ id: Date.now(), ts: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }), text: draft.trim() }, ...n]);
                        setDraft(""); }}
                      style={{ ...btn(T, "primary"), width: "auto", padding: "13px 20px" }}><Plus size={16} strokeWidth={2} />Add</button>
                  </div>
                  {notes.length === 0 ? (
                    <div style={{ ...mono }}>No notes yet — they stay private to your team.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                      {notes.map((n) => (
                        <div key={n.id} style={{ background: T.card2, border: `1px solid ${T.line}`, borderRadius: T.r.panel, padding: 16 }}>
                          <div style={{ ...mono, fontSize: 11, marginBottom: 7 }}>{n.ts}</div>
                          <div style={{ fontSize: 16, lineHeight: 1.5, color: T.ink }}>{n.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* GENERATE */}
              {tab === "generate" && (
                <div>
                  <div style={{ ...sectionH, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}><Sparkles size={19} strokeWidth={1.9} />Draft the dossier with AI</div>
                  <p style={{ fontSize: 14.5, color: T.ink2, lineHeight: 1.55, marginBottom: 22, maxWidth: "70ch" }}>
                    Fills <strong style={{ color: T.ink }}>{data.candidate?.name || "this candidate"}</strong> from the <strong>Matrix</strong> (scorecard + strategy), your <strong>candidate notes</strong>, and the <strong>résumé</strong>. The matrix is remembered between candidates — to add another, hit <strong>Add candidate</strong> and just paste their résumé. You review and edit before sending.
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18, padding: "10px 14px", borderRadius: T.r.panel, background: T.goldBg, border: `1px solid ${T.goldLine}` }}>
                    <span style={{ fontSize: 13.5, color: T.ink }}>
                      <span style={{ ...mono, fontSize: 10, color: T.goldText, marginRight: 8 }}>Matrix on file</span>
                      <strong style={{ fontWeight: 700 }}>{MATRIX_LABEL}</strong>
                    </span>
                    <button onClick={() => setGMatrix(MATRIX_SEED)}
                      style={{ ...mono, fontSize: 10, color: T.goldText, cursor: "pointer", border: `1px solid ${T.goldLine}`, background: T.bg, padding: "6px 11px", borderRadius: 8 }}>
                      ↻ Reset to live matrix
                    </button>
                  </div>
                  {[
                    { label: "Matrix — scorecard + search strategy · saved & reused", value: gMatrix, set: setGMatrix, ph: "Paste the Matrix once: the evaluation criteria, their weights, and the search strategy. It's remembered for every candidate you add…" },
                    { label: "Candidate notes", value: gNotes, set: setGNotes, ph: "Interview notes, screen context, references mentioned…" },
                    { label: "Résumé", value: gResume, set: setGResume, ph: "Paste the candidate's résumé text…" },
                  ].map((f) => (
                    <div key={f.label} style={{ marginBottom: 16 }}>
                      <label style={fieldLabel}>{f.label}</label>
                      <textarea rows={5} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} style={{ ...ta(T), fontSize: 14 }} />
                    </div>
                  ))}
                  {gError && (
                    <div style={{ fontSize: 13.5, color: T.red, background: "rgba(220,38,38,0.06)", border: `1px solid rgba(220,38,38,0.3)`, borderRadius: T.r.panel, padding: "11px 14px", marginBottom: 14 }}>{gError}</div>
                  )}
                  <button onClick={generate} disabled={gLoading || (!gMatrix.trim() && !gNotes.trim() && !gResume.trim())}
                    style={{ ...btn(T, "primary"), width: "auto", padding: "13px 22px", background: T.gold, borderColor: T.gold, color: "#241a05", opacity: gLoading ? 0.7 : 1, cursor: gLoading ? "default" : "pointer" }}>
                    <Sparkles size={16} strokeWidth={2} />{gLoading ? "Generating…" : (data.criteria?.length ? "Regenerate dossier" : "Generate dossier")}
                  </button>
                  <div style={{ ...mono, fontSize: 10, marginTop: 14, color: T.ink3 }}>Runs Claude (Opus 4.8) server-side · requires ANTHROPIC_API_KEY in the deploy environment</div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function btn(T, kind) {
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "13px 16px",
    borderRadius: T.r.btn, fontFamily: T.font, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all .18s",
    border: "1px solid", width: "100%" };
  if (kind === "primary") return { ...base, background: T.navy, color: "#FFFFFF", borderColor: T.navy };
  if (kind === "danger") return { ...base, background: T.bg, color: T.red, borderColor: "rgba(220,38,38,0.45)" };
  return { ...base, background: T.bg, color: T.ink, borderColor: T.line };
}
function ta(T) {
  return { width: "100%", boxSizing: "border-box", border: `1px solid ${T.line}`, borderRadius: T.r.field, padding: 12,
    fontFamily: T.font, fontSize: 14, resize: "vertical", outline: "none", background: T.bg, color: T.ink };
}
export { CandidateDossier };
