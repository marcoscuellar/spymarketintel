import React, { useState, useMemo } from "react";
import { MapPin, Users, Clock, TrendingUp, Briefcase, Search, ArrowRight, Calendar, AlertTriangle } from "lucide-react";
import { useIsMobile } from "./useIsMobile.js";
import { getSearch, firstRoomSearch, CLIENT } from "./searches.js";

/* ── Brand constants (accent + type) ── */
const BRAND = {
  gold: "#C2A24C", goldDeep: "#876B1E", goldLight: "#D8BE6E",
  navy: "#0A1F3D", forest: "#2F4D3A", red: "#E0606A", cream: "#F5EFE0",
  font: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'Geist Mono', ui-monospace, Menlo, monospace",
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
};

/* ── Surface + text palettes per theme ── */
const THEMES = {
  light: {
    bg: "#FFFFFF", card: "#FFFFFF", cardBd: "#E7E5E4", raise: "#F5F5F4", hover: "rgba(0,0,0,0.015)",
    statTile: "#FFFFFF",
    text: "#0A0A0A", text2: "#525252", text3: "#A3A3A3", text4: "#D4D4D4",
    line: "#E7E5E4", lineSoft: "#EDEDEB",
    goldTxt: "#876B1E", goldBg: "#FAF6EA", goldLine: "#E5D29B",
    bandLine: "#0A1F3D", barMuted: "#0A1F3D",
    sh: "0 12px 32px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
    ctaBg: "#0A1F3D", ctaText: "#FFFFFF", ctaBd: "#0A1F3D",
    avatarBg: "#0A1F3D", avatarText: "#FFFFFF",
    riskFill: "rgba(220,38,38,0.08)", riskLine: "#DC2626",
    pgBg: "#FFFFFF", pgText: "#0A0A0A", pgText2: "#525252", pgText3: "#A3A3A3", pgLine: "#E7E5E4", pgGold: "#876B1E", pageDark: false,
    dark: false,
  },
  navy: {
    bg: "#081730", card: "#0C2244", cardBd: "rgba(194,162,76,0.18)", raise: "rgba(255,255,255,0.05)", hover: "rgba(255,255,255,0.03)",
    statTile: "rgba(255,255,255,0.025)",
    text: "#F5EFE0", text2: "rgba(245,239,224,0.72)", text3: "rgba(245,239,224,0.5)", text4: "rgba(245,239,224,0.3)",
    line: "rgba(255,255,255,0.1)", lineSoft: "rgba(255,255,255,0.07)",
    goldTxt: "#D8BE6E", goldBg: "rgba(194,162,76,0.12)", goldLine: "rgba(194,162,76,0.35)",
    bandLine: "#F5EFE0", barMuted: "rgba(245,239,224,0.5)",
    sh: "0 24px 60px -16px rgba(0,0,0,0.55)",
    ctaBg: "rgba(194,162,76,0.09)", ctaText: "#F5EFE0", ctaBd: "rgba(194,162,76,0.32)",
    avatarBg: "#C2A24C", avatarText: "#0A1F3D",
    riskFill: "rgba(224,96,106,0.16)", riskLine: "#E0606A",
    pgBg: "#081730", pgText: "#F5EFE0", pgText2: "rgba(245,239,224,0.72)", pgText3: "rgba(245,239,224,0.5)", pgLine: "rgba(255,255,255,0.1)", pgGold: "#D8BE6E", pageDark: true,
    dark: true,
  },
  blue: {
    bg: "#FFFFFF", card: "#0C2244", cardBd: "#0C2244", raise: "rgba(255,255,255,0.05)", hover: "rgba(255,255,255,0.03)",
    statTile: "rgba(255,255,255,0.025)",
    text: "#F5EFE0", text2: "rgba(245,239,224,0.72)", text3: "rgba(245,239,224,0.5)", text4: "rgba(245,239,224,0.3)",
    line: "rgba(255,255,255,0.1)", lineSoft: "rgba(255,255,255,0.07)",
    goldTxt: "#D8BE6E", goldBg: "rgba(194,162,76,0.12)", goldLine: "rgba(194,162,76,0.35)",
    bandLine: "#F5EFE0", barMuted: "rgba(245,239,224,0.5)",
    sh: "0 18px 44px -14px rgba(10,31,61,0.4)",
    ctaBg: "rgba(194,162,76,0.12)", ctaText: "#F5EFE0", ctaBd: "rgba(194,162,76,0.32)",
    avatarBg: "#C2A24C", avatarText: "#0A1F3D",
    riskFill: "rgba(224,96,106,0.16)", riskLine: "#E0606A",
    pgBg: "#FFFFFF", pgText: "#0A0A0A", pgText2: "#525252", pgText3: "#A3A3A3", pgLine: "#E7E5E4", pgGold: "#876B1E", pageDark: false,
    dark: true,
  },
};

function Mark({ size = 28, dark }) {
  const housing = dark ? "#C2A24C" : "#0A1F3D";
  const band = dark ? "#0A1F3D" : "#ffffff";
  const cuf = dark ? ["#0A1F3D", "#F5EFE0", "#0A1F3D"] : ["#C2A24C", "#0A1F3D", "#C2A24C"];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Spyglass">
      <rect width="100" height="100" rx="28" fill={housing}></rect>
      <rect x="14" y="38" width="72" height="24" rx="3" fill={band}></rect>
      <line x1="20" y1="50" x2="62" y2="50" stroke="#0A1F3D" strokeWidth="1.4" strokeDasharray="3 3"></line>
      <circle cx="72" cy="50" r="9" fill={cuf[0]}></circle>
      <circle cx="72" cy="50" r="5" fill={cuf[1]}></circle>
      <circle cx="72" cy="50" r="2" fill={cuf[2]}></circle>
    </svg>
  );
}

const ROLE = {
  title: "Nearshore Engineering Pod",
  client: "Procare HR",
  eyebrow: "Nearshore Build · Clarent Platform",
  context: "Procare HR is a ~62-person, founder-led PEO that runs the entire people function for senior-care operators across 36 states — 25,000+ client employees under management. In May 2024 it acquired the Clarent analytics platform and is building an AI workforce “daily scorecard,” betting its growth on becoming a data + software company. That roadmap needs engineering a lean Minneapolis team can't hire onshore affordably. A nearshore pod ships the Clarent + AI build faster, at a fraction of US cost — and there's no incumbent vendor in the way.",
  lookingFor: "Senior, product-minded engineers who can own the Clarent data platform and AI-scorecard build end to end — data pipelines, HRIS integrations, and ML — in US time zones, at nearshore cost. Builders comfortable in a lean, founder-led shop.",
  unlocks: [
    "Clarent acquisition (May 2024) created an integration + scaling mandate they're under-resourced to execute.",
    "The AI “daily scorecard” for frontline burnout is a live roadmap — sustained dev demand a lean team can't cover onshore.",
    "A senior-living M&A spike and chronic care-staffing shortages push more volume through their platform every quarter.",
  ],
  impact: [
    { n: "May 2024", l: "Acquired Clarent platform" },
    { n: "36", l: "States served · senior care" },
    { n: "~62", l: "Internal employees · lean team" },
    { n: "25,000+", l: "Client employees managed" },
  ],
  growth: {
    capacity: 55, capacityLabel: "In-house engineering capacity",
    points: [ { m: "Pre-Clarent", h: 35 }, { m: "Clarent · May '24", h: 95 }, { m: "AI scorecard", h: 150 }, { m: "Now", h: 195 } ],
    seatIdx: 1, seatLabel: "Clarent acquired",
  },
  // nearshore vs US engineering compensation ($K)
  band: [60, 95], marketIQR: [150, 195], marketMedian: 175, axis: [40, 210],
  funnel: [ { l: "Sourced", n: 40 }, { l: "Screened in depth", n: 9 }, { l: "Presented to you", n: 5 } ],
};

const CANDS = [
  { id: "mateo", name: "Mateo Ríos", initials: "MR", role: "Sr. Full-Stack Engineer", company: "ex-Nubank", years: 9,
    location: "São Paulo, BR · UTC−3", askMid: 90, fit: 92, status: "new", lead: true,
    blurb: "Owns data-platform builds end to end; HR-tech integration depth.",
    tags: ["TypeScript", "Data pipelines", "HRIS"],
    why: ["Built and scaled a multi-tenant data platform at HR-tech scale — the closest analog to Clarent on the slate.", "Fluent across the stack: TypeScript, Node, Postgres, and the integration layer Procare needs.", "Has worked US hours with lean, founder-led teams — comfortable owning ambiguity."] },
  { id: "valentina", name: "Valentina Cruz", initials: "VC", role: "Sr. Data Engineer", company: "ex-Rappi", years: 8,
    location: "Bogotá, CO · UTC−5", askMid: 82, fit: 88, status: "new",
    blurb: "ETL + analytics; integrations to PCC / Yardi-style systems.",
    tags: ["Python", "ETL", "Integrations"],
    why: ["Built the ETL and analytics backbone for a 20M-user app — directly relevant to Clarent's data dictionary.", "Has wired integrations into messy third-party systems like the senior-living platforms Procare touches.", "Strong on the 'single source of truth' problem Clarent is solving."] },
  { id: "diego", name: "Diego Herrera", initials: "DH", role: "ML / AI Engineer", company: "ex-Mercado Libre", years: 7,
    location: "Mexico City, MX · UTC−6", askMid: 90, fit: 85, status: "new",
    blurb: "Production scoring + alerting models; the AI-scorecard fit.",
    tags: ["ML", "Python", "LLMs"],
    why: ["Shipped scoring and alerting models in production — exactly the AI 'daily scorecard' build.", "Pragmatic about ML in a small shop: ships useful, not academic.", "Ask sits at the top of the nearshore band — still well under US cost."] },
  { id: "camila", name: "Camila Soto", initials: "CS", role: "Full-Stack Engineer", company: "ex-Globant", years: 6,
    location: "Buenos Aires, AR · UTC−3", askMid: 72, fit: 82, status: "new",
    blurb: "High product velocity; React + Node across SaaS.",
    tags: ["React", "Node", "SaaS"],
    why: ["Fast, product-minded full-stack engineer who ships features weekly.", "Lowest comp ask on the slate with strong fundamentals.", "Earlier-career — would grow under the lead engineer."] },
  { id: "andres", name: "Andrés Vega", initials: "AV", role: "DevOps / Platform Engineer", company: "ex-Cornershop", years: 10,
    location: "Medellín, CO · UTC−5", askMid: 84, fit: 79, status: "hold",
    blurb: "Cloud + CI/CD to stand the platform up cleanly.",
    tags: ["AWS", "CI/CD", "Infra"],
    why: ["Can stand up the cloud, CI/CD, and observability Clarent's platform needs.", "Senior infra operator — the pod may only need part-time platform work at first.", "On hold pending Procare's confirmed engineering stack."] },
];

function statusStyle(P, k) {
  if (k === "hold") return { t: "On hold", color: P.goldTxt, bg: P.goldBg, bd: P.goldLine };
  if (k === "advanced") return { t: "Advanced", color: P.dark ? "#A7C6B2" : P.forest, bg: P.dark ? "rgba(47,77,58,0.3)" : "rgba(47,77,58,0.08)", bd: P.dark ? "rgba(167,198,178,0.4)" : "rgba(47,77,58,0.25)" };
  return { t: "New", color: P.dark ? P.text : P.navy, bg: P.dark ? "rgba(255,255,255,0.08)" : "rgba(10,31,61,0.06)", bd: P.dark ? "rgba(255,255,255,0.2)" : "rgba(10,31,61,0.18)" };
}
const monoS = (P, o = {}) => ({ fontFamily: P.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: P.text3, ...o });
const sectionH = (P, o = {}) => ({ fontFamily: P.font, fontWeight: 800, fontSize: 22, letterSpacing: "-0.025em", lineHeight: 1.1, color: P.goldTxt, ...o });
const cardS = (P, o = {}) => ({ background: P.card, border: `1px solid ${P.cardBd}`, borderRadius: 20, boxShadow: P.sh, ...o });

function FitRing({ P, value, size = 44, stroke = 4 }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - value / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={P.dark ? "rgba(255,255,255,0.12)" : "#F5F5F4"} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={P.gold} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: `stroke-dashoffset .5s ${P.ease}` }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: P.font, fontWeight: 800, fontSize: size*0.3, letterSpacing: "-0.04em", fill: P.goldTxt }}>{value}</text>
    </svg>
  );
}

function Legend({ P, swatch, label }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>{swatch}<span style={{ ...monoS(P, { fontSize: 10, color: P.text2 }) }}>{label}</span></span>;
}

/* ── Headcount-vs-coverage growth gap chart ── */
function GrowthGapChart({ P }) {
  const W = 600, H = 210, x0 = 44, x1 = 560, yTop = 30, yBase = 158, maxH = 210;
  const g = ROLE.growth, pts = g.points;
  const X = (i) => x0 + i / (pts.length - 1) * (x1 - x0);
  const Y = (h) => yBase - (h / maxH) * (yBase - yTop);
  const yCap = Y(g.capacity);
  const line = pts.map((p, i) => `${i ? "L" : "M"} ${X(i)} ${Y(p.h)}`).join(" ");
  const gap = `M ${X(0)} ${Y(pts[0].h)} ` + pts.map((p, i) => `L ${X(i)} ${Y(p.h)}`).join(" ") + ` L ${X(pts.length-1)} ${yCap} L ${X(0)} ${yCap} Z`;
  const seatX = X(g.seatIdx);
  return (
    <div style={{ ...cardS(P), padding: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
        <div style={{ fontFamily: P.font, fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: P.text }}>The build has outgrown the bench</div>
        <div style={{ ...monoS(P, { fontSize: 10 }) }}>Build scope · index</div>
      </div>
      <div style={{ fontSize: 14, color: P.text2, lineHeight: 1.5, marginBottom: 12, maxWidth: "62ch" }}>
        Procare's product scope jumped with the Clarent acquisition and the AI scorecard, while in-house engineering capacity stayed flat. The shaded gap is roadmap they can't ship onshore fast enough.
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
        <path d={gap} fill={P.riskFill} />
        <line x1={x0} y1={yCap} x2={x1} y2={yCap} stroke={P.bandLine} strokeWidth={1.4} strokeDasharray="5 4" opacity={0.7} />
        <text x={x1} y={yCap - 7} textAnchor="end" style={{ fontFamily: P.mono, fontSize: 9.5, fontWeight: 600, fill: P.text3 }}>IN-HOUSE CAPACITY ≈ {g.capacity}</text>
        <path d={line} fill="none" stroke={P.gold} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {/* seat-open marker */}
        <line x1={seatX} y1={yTop - 6} x2={seatX} y2={yBase} stroke={P.riskLine} strokeWidth={1.2} strokeDasharray="3 3" opacity={0.8} />
        <text x={seatX + 6} y={yTop + 2} style={{ fontFamily: P.mono, fontSize: 9.5, fontWeight: 600, fill: P.riskLine }}>{g.seatLabel.toUpperCase()}</text>
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={X(i)} cy={Y(p.h)} r={4.5} fill={P.gold} stroke={P.card} strokeWidth={1.5} />
            <text x={X(i)} y={Y(p.h) - 11} textAnchor="middle" style={{ fontFamily: P.font, fontWeight: 800, fontSize: 13, letterSpacing: "-0.03em", fill: P.text }}>{p.h}</text>
            <text x={X(i)} y={yBase + 16} textAnchor="middle" style={{ fontFamily: P.mono, fontSize: 9, fill: P.text3 }}>{p.m}</text>
          </g>
        ))}
        <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke={P.line} strokeWidth={1} />
      </svg>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 8 }}>
        <Legend P={P} swatch={<span style={{ width: 12, height: 2.5, background: P.gold, display: "inline-block" }} />} label="Build scope" />
        <Legend P={P} swatch={<span style={{ width: 12, height: 0, borderTop: `2px dashed ${P.bandLine}`, display: "inline-block" }} />} label="In-house eng capacity" />
        <Legend P={P} swatch={<span style={{ width: 12, height: 10, background: P.riskFill, border: `1px solid ${P.riskLine}`, display: "inline-block" }} />} label="Roadmap gap" />
      </div>
    </div>
  );
}

function CompChart({ P }) {
  const W = 600, H = 168, x0 = 44, x1 = 560, axisY = 116;
  const [lo, hi] = ROLE.axis;
  const X = (k) => x0 + (k - lo) / (hi - lo) * (x1 - x0);
  const ticks = []; for (let k = lo; k <= hi; k += 20) ticks.push(k);
  return (
    <div style={{ ...cardS(P), padding: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
        <div style={{ fontFamily: P.font, fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: P.text }}>Compensation landscape</div>
        <div style={{ ...monoS(P, { fontSize: 10 }) }}>$K base · annual</div>
      </div>
      <div style={{ fontSize: 14, color: P.text2, lineHeight: 1.5, marginBottom: 14, maxWidth: "62ch" }}>
        Twin Cities senior-engineering comp makes scaling the Clarent roadmap expensive. A nearshore pod lands well below the US market band — comparable seniority at roughly half the loaded cost.
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
        <rect x={X(ROLE.marketIQR[0])} y={axisY - 26} width={X(ROLE.marketIQR[1]) - X(ROLE.marketIQR[0])} height={26} fill={P.goldBg} stroke={P.goldLine} />
        <line x1={X(ROLE.marketMedian)} y1={axisY - 34} x2={X(ROLE.marketMedian)} y2={axisY} stroke={P.gold} strokeWidth={2} />
        <text x={X(ROLE.marketMedian)} y={axisY - 40} textAnchor="middle" style={{ fontFamily: P.mono, fontSize: 10, fontWeight: 600, fill: P.goldTxt }}>MEDIAN ${ROLE.marketMedian}K</text>
        <line x1={X(ROLE.band[0])} y1={axisY + 14} x2={X(ROLE.band[1])} y2={axisY + 14} stroke={P.bandLine} strokeWidth={2.5} />
        <line x1={X(ROLE.band[0])} y1={axisY + 9} x2={X(ROLE.band[0])} y2={axisY + 19} stroke={P.bandLine} strokeWidth={2.5} />
        <line x1={X(ROLE.band[1])} y1={axisY + 9} x2={X(ROLE.band[1])} y2={axisY + 19} stroke={P.bandLine} strokeWidth={2.5} />
        <text x={(X(ROLE.band[0]) + X(ROLE.band[1])) / 2} y={axisY + 34} textAnchor="middle" style={{ fontFamily: P.mono, fontSize: 10, fontWeight: 600, fill: P.bandLine }}>YOUR BAND ${ROLE.band[0]}–{ROLE.band[1]}K</text>
        <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke={P.line} strokeWidth={1} />
        {ticks.map((k) => <line key={k} x1={X(k)} y1={axisY} x2={X(k)} y2={axisY + 4} stroke={P.text4} />)}
        {CANDS.map((c, i) => {
          const above = c.askMid > ROLE.band[1];
          const y = axisY - 56 - (i % 2) * 16;
          return (
            <g key={c.id}>
              <line x1={X(c.askMid)} y1={y + 6} x2={X(c.askMid)} y2={axisY - 27} stroke={P.lineSoft} strokeWidth={1} />
              <circle cx={X(c.askMid)} cy={y} r={5.5} fill={above ? P.card : P.gold} stroke={above ? P.red : P.gold} strokeWidth={above ? 1.6 : 0} />
              <text x={X(c.askMid)} y={y - 9} textAnchor="middle" style={{ fontFamily: P.mono, fontSize: 9.5, fontWeight: 600, fill: above ? P.red : P.goldTxt }}>{c.initials}</text>
            </g>
          );
        })}
        {ticks.map((k) => <text key={"l"+k} x={X(k)} y={axisY + 1} dy={11} textAnchor="middle" style={{ fontFamily: P.mono, fontSize: 9, fill: P.text3 }}>${k}</text>)}
      </svg>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 6 }}>
        <Legend P={P} swatch={<span style={{ width: 12, height: 12, background: P.goldBg, border: `1px solid ${P.goldLine}`, display: "inline-block" }} />} label="US market 25–75%" />
        <Legend P={P} swatch={<span style={{ width: 12, height: 2, background: P.gold, display: "inline-block" }} />} label="US median" />
        <Legend P={P} swatch={<span style={{ width: 12, height: 2, background: P.bandLine, display: "inline-block" }} />} label="Nearshore band" />
        <Legend P={P} swatch={<span style={{ width: 10, height: 10, borderRadius: 99, background: P.gold, display: "inline-block" }} />} label="In-band ask" />
        <Legend P={P} swatch={<span style={{ width: 10, height: 10, borderRadius: 99, background: P.card, border: `1.6px solid ${P.red}`, display: "inline-block" }} />} label="Above band" />
      </div>
    </div>
  );
}

function FunnelChart({ P }) {
  const f = ROLE.funnel;
  const max = f[0].n;
  return (
    <div style={{ ...cardS(P), padding: 24, marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
        <div style={{ fontFamily: P.font, fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: P.text }}>From market to your shortlist</div>
        <div style={{ ...monoS(P, { fontSize: 10 }) }}>Sourcing funnel</div>
      </div>
      <div style={{ fontSize: 14, color: P.text2, lineHeight: 1.5, marginBottom: 18, maxWidth: "62ch" }}>
        How the in-market pool narrows to the people in front of you — every stage is a hands-on Spyglass screen, not a job-board filter.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {f.map((s, i) => {
          const last = i === f.length - 1;
          const pct = Math.round((s.n / max) * 100);
          const conv = i === 0 ? null : Math.round((s.n / f[i - 1].n) * 100);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 44px", gap: 14, alignItems: "center" }}>
              <span style={{ ...monoS(P, { fontSize: 10, color: last ? P.goldTxt : P.text2 }) }}>{s.l}</span>
              <div style={{ position: "relative", height: 28, background: P.goldBg, borderRadius: 6, overflow: "hidden", border: `1px solid ${P.line}` }}>
                <div style={{ width: `${pct}%`, height: "100%", background: last ? P.gold : P.goldLine, transition: `width .4s ${P.ease}` }} />
                {conv != null && <span style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", ...monoS(P, { fontSize: 9, color: P.text3 }) }}>{conv}% advanced</span>}
              </div>
              <span style={{ fontFamily: P.font, fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em", color: last ? P.goldTxt : P.text, textAlign: "right" }}>{s.n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditStat({ P, defaultValue, label, editable }) {
  const selectAll = (e) => {
    const r = document.createRange(); r.selectNodeContents(e.currentTarget);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  };
  return (
    <div style={{ background: P.statTile, padding: "18px 18px" }}>
      <span contentEditable={!!editable} suppressContentEditableWarning spellCheck={false} onFocus={editable ? selectAll : undefined}
        style={{ display: "inline-block", fontFamily: P.font, fontWeight: 800, fontSize: 34, letterSpacing: "-0.04em", lineHeight: 1, color: P.goldTxt, outline: "none", cursor: editable ? "text" : "default", borderRadius: 4, padding: editable ? "1px 5px" : 0, background: editable ? P.goldBg : "transparent", borderBottom: editable ? `1.5px dashed ${P.goldLine}` : "none" }}>{defaultValue}</span>
      <span contentEditable={!!editable} suppressContentEditableWarning spellCheck={false}
        style={{ display: "block", ...monoS(P, { fontSize: 9.5, marginTop: 11, lineHeight: 1.4 }), outline: "none", cursor: editable ? "text" : "default" }}>{label}</span>
    </div>
  );
}

const NEWS = [
  { src: "Skilled Nursing News", t: "2h ago", h: "CMS finalizes staffing-minimum rule for nursing facilities", s: "New federal minimums raise the workforce-data burden PEOs like Procare absorb." },
  { src: "HR Dive", t: "5h ago", h: "Demand for AI workforce analytics climbs across mid-market HR", s: "Buyers want burnout and retention scorecards \u2014 Procare's exact Clarent bet." },
  { src: "McKnight's Senior Living", t: "Yesterday", h: "Senior-living M&A pace accelerates into Q3", s: "More operators consolidating pushes more employees onto managed platforms." },
  { src: "TechCrunch", t: "Yesterday", h: "Nearshore LatAm engineering hiring up 28% YoY", s: "US-hours talent at lower cost \u2014 the supply side of Procare's pod strategy." },
];
function readEdits() { try { return JSON.parse(localStorage.getItem("spg-intel-edits") || "{}"); } catch (e) { return {}; } }
function writeEdit(id, val) { const m = readEdits(); m[id] = val; try { localStorage.setItem("spg-intel-edits", JSON.stringify(m)); } catch (e) {} }
function getEdit(id, fallback) { const m = readEdits(); return m[id] != null ? m[id] : fallback; }
function EditableText({ P, id, fallback, editable, onEdit, style }) {
  return (
    <span contentEditable={!!editable} suppressContentEditableWarning spellCheck={false}
      onBlur={(e) => { writeEdit(id, e.currentTarget.innerText.trim()); onEdit && onEdit(); }}
      style={{ outline: "none", cursor: editable ? "text" : "inherit", borderBottom: editable ? `1px dashed ${P.goldLine}` : "none", borderRadius: editable ? 2 : 0, ...style }}>{getEdit(id, fallback)}</span>
  );
}
const COMPETITORS = [
  { name: "ADP TotalSource", share: 22 },
  { name: "Insperity", share: 15 },
  { name: "TriNet", share: 13 },
  { name: "Paychex PEO", share: 11 },
  { name: "Justworks", share: 7 },
  { name: "Procare HR", share: 3, you: true },
];
function CompetitorLandscape({ P, editable, onEdit }) {
  const data = COMPETITORS.map((c, i) => ({ you: c.you, name: getEdit(`comp-${i}-name`, c.name), share: parseFloat(getEdit(`comp-${i}-share`, c.share)) || 0 }));
  const max = Math.max(...data.map(c => c.share), 1);
  return (
    <div style={{ ...cardS(P), padding: 24, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
        <div style={{ fontFamily: P.font, fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: P.text }}>Competitor landscape</div>
        <div style={{ ...monoS(P, { fontSize: 10 }) }}>Est. PEO market share</div>
      </div>
      <div style={{ fontSize: 14, color: P.text2, lineHeight: 1.5, marginBottom: 16, maxWidth: "60ch" }}>The PEO field Procare plays in. National incumbents lead on scale — Procare is the senior-care–native challenger.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, justifyContent: "center" }}>
        {data.map((c, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr 48px", gap: 12, alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: P.font, fontWeight: c.you ? 700 : 600, fontSize: 14, color: c.you ? P.goldTxt : P.text, minWidth: 0 }}>
              <EditableText P={P} id={`comp-${i}-name`} fallback={c.name} editable={editable} onEdit={onEdit} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} />
              {c.you && <span style={{ ...monoS(P, { fontSize: 8, color: P.goldTxt }), background: P.goldBg, border: `1px solid ${P.goldLine}`, padding: "1px 5px", borderRadius: 4, flexShrink: 0 }}>YOU</span>}
            </span>
            <div style={{ height: 22, background: P.goldBg, borderRadius: 6, overflow: "hidden", border: `1px solid ${P.line}` }}>
              <div style={{ width: `${(c.share / max) * 100}%`, height: "100%", background: c.you ? P.gold : P.goldLine }} />
            </div>
            <span style={{ fontFamily: P.font, fontWeight: 800, fontSize: 15, letterSpacing: "-0.03em", color: c.you ? P.goldTxt : P.text, textAlign: "right", whiteSpace: "nowrap" }}>
              <EditableText P={P} id={`comp-${i}-share`} fallback={String(c.share)} editable={editable} onEdit={onEdit} />%
            </span>
          </div>
        ))}
      </div>
      <div style={{ ...monoS(P, { fontSize: 10, color: P.text3 }), marginTop: 18, paddingTop: 14, borderTop: `1px solid ${P.lineSoft}` }}>Fragmented market · top 5 hold ~68%</div>
    </div>
  );
}
function NewsIntel({ P, editable, onEdit }) {
  return (
    <div style={{ ...cardS(P), padding: 24 }}>
      <style>{"@keyframes spgPulse{0%,100%{opacity:1}50%{opacity:.3}}"}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
        <div style={{ fontFamily: P.font, fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: P.text }}>Industry signals</div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, ...monoS(P, { fontSize: 9.5, color: P.goldTxt }) }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: P.gold, boxShadow: `0 0 0 3px ${P.goldBg}`, animation: "spgPulse 1.6s ease-in-out infinite" }} /> Live
        </span>
      </div>
      <div style={{ fontSize: 14, color: P.text2, lineHeight: 1.5, marginBottom: 14, maxWidth: "62ch" }}>Real-time headlines moving Procare's market — senior care, PEO, and workforce tech.</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {NEWS.slice(0, 2).map((n, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, padding: "14px 0", borderTop: i ? `1px solid ${P.lineSoft}` : "none" }}>
            <div>
              <span style={{ display: "inline-block", ...monoS(P, { fontSize: 9, color: P.goldTxt }), background: P.goldBg, border: `1px solid ${P.goldLine}`, padding: "2px 6px", borderRadius: 5, marginBottom: 7 }}><EditableText P={P} id={`news-${i}-src`} fallback={n.src} editable={editable} onEdit={onEdit} /></span>
              <div style={{ fontFamily: P.font, fontWeight: 600, fontSize: 15.5, letterSpacing: "-0.01em", color: P.text, lineHeight: 1.35 }}><EditableText P={P} id={`news-${i}-h`} fallback={n.h} editable={editable} onEdit={onEdit} /></div>
              <div style={{ fontSize: 13.5, color: P.text2, lineHeight: 1.45, marginTop: 5 }}><EditableText P={P} id={`news-${i}-s`} fallback={n.s} editable={editable} onEdit={onEdit} /></div>
            </div>
            <span style={{ ...monoS(P, { fontSize: 9, color: P.text3 }), whiteSpace: "nowrap" }}><EditableText P={P} id={`news-${i}-t`} fallback={n.t} editable={editable} onEdit={onEdit} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchBrief({ P, hideIntro, companyLevel, editable, facts = ROLE.impact, context = ROLE.context }) {
  const mobile = useIsMobile();
  const [, forceTick] = useState(0);
  const onEdit = () => forceTick(t => t + 1);
  const Pd = { ...BRAND, ...THEMES.navy, card: "#06152E", statTile: "rgba(255,255,255,0.04)", cardBd: "rgba(194,162,76,0.24)" };
  return (
    <div>
      {/* Why this search matters */}
      {!hideIntro && (
        <React.Fragment>
          <div style={{ ...sectionH(P, { marginBottom: 14, fontSize: 26 }) }}>Why this search matters now</div>
          <p style={{ fontSize: 18, color: P.text, lineHeight: 1.6, maxWidth: "60ch", margin: "0 0 22px", fontWeight: 400 }}>{context}</p>
        </React.Fragment>
      )}

      {/* four facts — full-width row (elevated cards on Client Home) */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: companyLevel ? 14 : 1, ...(companyLevel ? {} : { background: P.line, border: `1px solid ${P.cardBd}`, borderRadius: 14, overflow: "hidden" }), marginBottom: 32 }}>
        {facts.map((s, i) => (
          <div key={i} style={companyLevel
            ? { background: P.card, border: `1px solid ${P.cardBd}`, borderRadius: 14, boxShadow: P.sh, padding: "20px 18px" }
            : { background: P.statTile, padding: "18px 16px" }}>
            <div style={{ fontFamily: P.font, fontWeight: 800, fontSize: 30, letterSpacing: "-0.04em", lineHeight: 1, color: i === facts.length - 1 ? P.goldTxt : P.text }}>{companyLevel ? <EditableText P={P} id={`fact-${i}-n`} fallback={s.n} editable={editable} onEdit={onEdit} /> : s.n}</div>
            <div style={{ ...monoS(P, { fontSize: 9.5, marginTop: 9, lineHeight: 1.4 }) }}>{companyLevel ? <EditableText P={P} id={`fact-${i}-l`} fallback={s.l} editable={editable} onEdit={onEdit} /> : s.l}</div>
          </div>
        ))}
      </div>
      {companyLevel && (
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "stretch", marginBottom: 44 }}>
          <CompetitorLandscape P={Pd} editable={editable} onEdit={onEdit} />
          <NewsIntel P={Pd} editable={editable} onEdit={onEdit} />
        </div>
      )}

    </div>
  );
}

function CandidatePreview({ P, c }) {
  const mobile = useIsMobile();
  const openDossier = () => window.dispatchEvent(new CustomEvent("spg-open-dossier", { detail: { id: c.id } }));
  const st = statusStyle(P, c.status);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, paddingBottom: 22, marginBottom: 24, borderBottom: `1px solid ${P.line}` }}>
        <div style={{ width: 58, height: 58, borderRadius: 14, background: P.avatarBg, color: P.avatarText, display: "grid", placeItems: "center", fontFamily: P.font, fontWeight: 800, fontSize: 21, letterSpacing: "-0.02em", flexShrink: 0 }}>{c.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontFamily: P.font, fontWeight: 800, fontSize: 30, letterSpacing: "-0.035em", lineHeight: 1, color: P.text }}>{c.name}</span>
            {c.lead && <span style={{ ...monoS(P, { fontSize: 10, color: P.goldTxt }), background: P.goldBg, border: `1px solid ${P.goldLine}`, padding: "4px 8px", borderRadius: 6 }}>Lead candidate</span>}
          </div>
          <div style={{ fontSize: 15.5, color: P.text2, marginTop: 7 }}>{c.role} · {c.company} · {c.years} yrs</div>
        </div>
        <FitRing P={P} value={c.fit} size={56} stroke={5} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 1, background: P.line, border: `1px solid ${P.cardBd}`, borderRadius: 12, overflow: "hidden", marginBottom: 26 }}>
        {[{ l: "Location", v: c.location }, { l: "Comp ask", v: `$${c.askMid - 10}–${c.askMid + 10}K` }, { l: "Status", v: st.t, tone: st.color }].map((m, i) => (
          <div key={i} style={{ background: P.statTile, padding: "13px 16px" }}>
            <div style={{ ...monoS(P, { fontSize: 10, marginBottom: 5 }) }}>{m.l}</div>
            <div style={{ fontFamily: P.font, fontSize: 14.5, fontWeight: 600, color: m.tone || P.text }}>{m.v}</div>
          </div>
        ))}
      </div>
      <div style={{ ...sectionH(P, { marginBottom: 16 }) }}>Why {c.name.split(" ")[0]} fits this search</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 30 }}>
        {c.why.map((w, i) => (
          <div key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
            <span style={{ width: 22, height: 22, borderRadius: 99, background: P.goldBg, border: `1px solid ${P.goldLine}`, color: P.goldTxt, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 2, fontFamily: P.mono, fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
            <span style={{ fontSize: 16.5, lineHeight: 1.5, color: P.text }}>{w}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 30 }}>
        {c.tags.map((t, i) => <span key={i} style={{ ...monoS(P, { fontSize: 10, color: P.dark ? P.cream : P.navy }), background: P.dark ? "rgba(255,255,255,0.06)" : "rgba(10,31,61,0.06)", border: `1px solid ${P.dark ? "rgba(255,255,255,0.16)" : "rgba(10,31,61,0.16)"}`, padding: "5px 9px", borderRadius: 6 }}>{t}</span>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap", padding: "20px 24px", borderRadius: 16, background: P.ctaBg, border: `1px solid ${P.ctaBd}` }}>
        <div style={{ color: P.ctaText, fontFamily: P.font, fontWeight: 600, fontSize: 16.5, letterSpacing: "-0.01em", maxWidth: "40ch", lineHeight: 1.4 }}>
          The full dossier has the Matrix scorecard, résumé, and verified references.
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 12, border: `1px solid ${P.dark ? "rgba(245,239,224,0.3)" : "rgba(255,255,255,0.25)"}`, background: "transparent", color: P.ctaText, fontFamily: P.font, fontWeight: 600, fontSize: 15, cursor: "pointer" }}><Calendar size={16} strokeWidth={1.8} />Book</button>
          <button onClick={openDossier} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 12, border: `1px solid ${P.gold}`, background: P.gold, color: "#241a05", fontFamily: P.font, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Open full dossier <ArrowRight size={16} strokeWidth={2} /></button>
        </div>
      </div>
    </div>
  );
}

function RosterRow({ P, c, rank, selected, onSelect }) {
  const [hover, setHover] = useState(false);
  const st = statusStyle(P, c.status);
  return (
    <button onClick={onSelect} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 14, alignItems: "center", width: "100%", textAlign: "left",
        padding: "16px 16px 16px 14px", border: "none", borderLeft: `3px solid ${selected ? P.gold : "transparent"}`,
        background: selected ? P.raise : (hover ? P.hover : "transparent"), cursor: "pointer",
        borderBottom: `1px solid ${P.lineSoft}`, transition: `background .15s ${P.ease}` }}>
      <span style={{ fontFamily: P.mono, fontSize: 11, fontWeight: 600, color: P.text4 }}>{String(rank).padStart(2, "0")}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontFamily: P.font, fontWeight: 700, fontSize: 16.5, letterSpacing: "-0.02em", color: P.text }}>{c.name}</span>
          {c.lead && <span style={{ width: 6, height: 6, borderRadius: 99, background: P.gold }} title="Lead candidate" />}
        </span>
        <span style={{ display: "block", fontSize: 13.5, color: P.text3, margin: "2px 0 7px" }}>{c.role} · {c.years}y</span>
        <span style={{ display: "block", fontSize: 13.5, color: P.text2, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.blurb}</span>
        <span style={{ display: "inline-flex", marginTop: 9, ...monoS(P, { fontSize: 9.5, color: st.color }), background: st.bg, border: `1px solid ${st.bd}`, padding: "3px 7px", borderRadius: 5 }}>{st.t}</span>
      </span>
      <FitRing P={P} value={c.fit} size={42} stroke={4} />
    </button>
  );
}

function RoomIntelSummary({ P }) {
  const mobile = useIsMobile();
  return (
    <div>
      <div style={{ ...sectionH(P, { marginBottom: 14, fontSize: 26 }) }}>Market intel for this search</div>
      <p style={{ fontSize: 17.5, color: P.text, lineHeight: 1.6, maxWidth: "60ch", margin: "0 0 26px", fontWeight: 400 }}>{ROLE.context}</p>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(2, 1fr)", gap: 1, background: P.line, border: `1px solid ${P.cardBd}`, borderRadius: 14, overflow: "hidden", marginBottom: 28 }}>
        {ROLE.impact.map((s, i) => (
          <div key={i} style={{ background: P.statTile, padding: "18px 18px" }}>
            <div style={{ fontFamily: P.font, fontWeight: 800, fontSize: 30, letterSpacing: "-0.04em", lineHeight: 1, color: i === ROLE.impact.length - 1 ? P.goldTxt : P.text }}>{s.n}</div>
            <div style={{ ...monoS(P, { fontSize: 9.5, marginTop: 9, lineHeight: 1.4 }) }}>{s.l}</div>
          </div>
        ))}
      </div>

      <a href="Spyglass%20-%20Market%20Intel.html" target="_blank" rel="noopener"
        style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "13px 20px", borderRadius: 12, background: P.gold, color: "#241a05", fontFamily: P.font, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
        Open the full market brief <ArrowRight size={16} strokeWidth={2} />
      </a>
      <div style={{ ...monoS(P, { fontSize: 10, marginTop: 16 }) }}>Headcount-gap chart, comp landscape &amp; full read → on the brief</div>
    </div>
  );
}

function RoleView({ searchId }) {
  const theme = "light"; // production: single Light theme (prototype theme switcher dropped)
  const mobile = useIsMobile();
  const P = useMemo(() => ({ ...BRAND, ...THEMES[theme] }), [theme]);
  const search = useMemo(() => getSearch(searchId) || firstRoomSearch(), [searchId]);
  const roster = (search.candidates && search.candidates.length) ? search.candidates : CANDS;
  const sorted = useMemo(() => [...roster].sort((a, b) => b.fit - a.fit), [roster]);
  // Clicking a candidate drills straight to their dossier (no inline preview).
  const openCandidate = (c) => window.dispatchEvent(new CustomEvent("spg-open-dossier", { detail: { searchId: search.id, candidateId: c.id } }));

  return (
    <div style={{ fontFamily: P.font, color: P.pgText, background: P.pgBg, minHeight: "100vh", padding: "0 0 56px", transition: "background .3s" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: mobile ? "0 20px" : "0 clamp(32px, 6vw, 100px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0 20px", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: P.font, fontWeight: 900, fontSize: 17, letterSpacing: "-0.07em", color: P.pgText }}>SPYGLASS PARTNERS</span>
            <span style={{ width: 1, height: 18, background: P.pgLine, margin: "0 4px" }} />
            <button onClick={() => window.dispatchEvent(new CustomEvent("spg-open-portfolio"))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 6, ...monoS(P, { fontSize: 11, color: P.pgText3 }) }}>
              <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><ArrowRight size={12} strokeWidth={2} /></span> All searches
            </button>
          </div>
          <span style={{ ...monoS(P, { fontSize: 11, color: P.pgText3 }) }}>For {CLIENT.name} · Confidential</span>
        </div>
        <div style={{ height: 1, background: P.pgLine }} />

        <div style={{ padding: mobile ? "40px 0 32px" : "56px 0 48px", paddingLeft: mobile ? 0 : "clamp(0px, 5vw, 90px)" }}>
          <div style={{ fontFamily: P.mono, fontSize: 14, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.pgGold, marginBottom: 26 }}>
            {CLIENT.name} · {search.eyebrow}
          </div>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(46px, 7.5vw, 94px)", lineHeight: 0.95, letterSpacing: "-0.045em", margin: 0, color: P.pgText }}>
            {search.h1[0]}<br />{search.h1[1]}
          </h1>
          <p style={{ fontSize: "clamp(18px, 2.1vw, 24px)", lineHeight: 1.5, color: P.pgText2, maxWidth: "38ch", marginTop: 28 }}>
            {search.lede}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "366px 1fr", gap: 22, alignItems: "start" }}>
          <aside style={{ ...cardS(P), overflow: "hidden", position: mobile ? "static" : "sticky", top: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                padding: "16px 16px 16px 14px", borderLeft: `3px solid ${P.gold}`, background: P.raise, borderBottom: `1px solid ${P.line}` }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <TrendingUp size={17} strokeWidth={1.8} color={P.goldTxt} />
                <span style={{ fontFamily: P.font, fontWeight: 700, fontSize: 15.5, color: P.text }}>Search intel</span>
              </span>
              <span style={{ ...monoS(P, { fontSize: 9.5 }) }}>The brief</span>
            </div>
            <div style={{ ...monoS(P, { fontSize: 10, padding: "14px 16px 8px" }) }}>Shortlist · {sorted.length} presented</div>
            {sorted.map((c, i) => <RosterRow key={c.id} P={P} c={c} rank={i + 1} selected={false} onSelect={() => openCandidate(c)} />)}
          </aside>
          <main style={{ ...cardS(P), padding: 30, minHeight: 620, overflow: "hidden" }}>
            <div style={{ animation: "spgPop .42s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <SearchBrief P={P} context={search.context} facts={search.facts} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export { BRAND, THEMES, ROLE, CANDS, SearchBrief, GrowthGapChart, CompChart, Mark, monoS, sectionH, cardS, FitRing, statusStyle, RoleView };
