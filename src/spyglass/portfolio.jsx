import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "./useIsMobile.js";
import { BRAND, THEMES, monoS, sectionH, cardS, FitRing, Mark, SearchBrief } from "./room.jsx";
import { COMPANY_INTEL } from "./data.js";

const STAGES = ["Intake", "Sourcing", "Screening", "Presented", "Offer", "Placed"];

const SEARCHES = [
  { role: "Sr. Full-Stack Engineer", dept: "Clarent platform", loc: "Nearshore · UTC−3", stageIdx: 3, lead: { name: "Mateo Ríos", fit: 92 }, presented: 5, group: "decide", status: "awaiting", awaiting: 5, room: true },
  { role: "Sr. Data Engineer", dept: "Clarent platform", loc: "Nearshore · UTC−5", stageIdx: 3, lead: { name: "Valentina Cruz", fit: 88 }, presented: 4, group: "decide", status: "awaiting", awaiting: 4 },
  { role: "ML / AI Engineer", dept: "AI scorecard", loc: "Nearshore · UTC−6", stageIdx: 4, lead: { name: "Diego Herrera", fit: 85 }, presented: 2, group: "decide", status: "offer", awaiting: 1 },
  { role: "Full-Stack Engineer", dept: "Product", loc: "Nearshore · UTC−3", stageIdx: 3, lead: { name: "Camila Soto", fit: 82 }, presented: 3, group: "decide", status: "awaiting", awaiting: 3 },
  { role: "DevOps / Platform Engineer", dept: "Infrastructure", loc: "Nearshore · UTC−5", stageIdx: 2, metric: "9 screened", group: "progress", status: "progress" },
  { role: "Integrations Engineer", dept: "Clarent platform", loc: "Nearshore · UTC−4", stageIdx: 2, metric: "7 screened", group: "progress", status: "progress" },
  { role: "QA Automation Engineer", dept: "Quality", loc: "Nearshore · UTC−5", stageIdx: 1, metric: "Sourcing", group: "progress", status: "progress" },
  { role: "Product Designer", dept: "Product", loc: "Nearshore · UTC−3", stageIdx: 1, metric: "Sourcing", group: "progress", status: "progress" },
  { role: "Engineering Manager", dept: "Clarent platform", loc: "Nearshore · UTC−5", stageIdx: 5, lead: { name: "Lucía Fernández", fit: 90 }, presented: 0, group: "closed", status: "placed" },
  { role: "Technical Writer", dept: "Docs", loc: "Nearshore · UTC−6", stageIdx: 1, metric: "Paused by client", group: "closed", status: "hold" },
];

function statusChip(P, s) {
  if (s.status === "awaiting") return { t: `${s.awaiting} awaiting you`, color: P.goldTxt, bg: P.goldBg, bd: P.goldLine };
  if (s.status === "offer") return { t: "Offer out", color: P.forest, bg: "rgba(47,77,58,0.08)", bd: "rgba(47,77,58,0.25)" };
  if (s.status === "placed") return { t: "Placed", color: P.forest, bg: "rgba(47,77,58,0.08)", bd: "rgba(47,77,58,0.25)" };
  if (s.status === "hold") return { t: "On hold", color: P.text3, bg: P.paper, bd: P.line };
  return { t: "In progress", color: P.navy, bg: "rgba(10,31,61,0.06)", bd: "rgba(10,31,61,0.16)" };
}

function StageTrack({ P, idx, mono }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {STAGES.map((s, i) => {
        const done = i < idx, cur = i === idx;
        return (
          <React.Fragment key={i}>
            <span style={{ width: cur ? 10 : 7, height: cur ? 10 : 7, borderRadius: 99, flexShrink: 0,
              background: (done || cur) ? P.gold : P.line, boxShadow: cur ? `0 0 0 3px ${P.goldBg}` : "none" }} />
            {i < STAGES.length - 1 && <span style={{ width: 14, height: 2, background: done ? P.gold : P.line }} />}
          </React.Fragment>
        );
      })}
      <span style={{ ...mono(P, { fontSize: 9.5, color: P.text2 }), marginLeft: 12 }}>{STAGES[idx]}</span>
    </div>
  );
}

function SearchRow({ P, s, mono, FitRing, last }) {
  const [hover, setHover] = useState(false);
  const mobile = useIsMobile();
  const chip = statusChip(P, s);
  const onClick = () => { if (s.room) window.dispatchEvent(new CustomEvent("spg-open-room")); };
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "grid", gridTemplateColumns: mobile ? "1fr auto" : "minmax(0,1.5fr) minmax(0,1.3fr) 168px 168px", gap: mobile ? 12 : 20, alignItems: "center", width: "100%", textAlign: "left",
        padding: "20px 22px", border: "none", borderBottom: last ? "none" : `1px solid ${P.lineSoft}`,
        background: hover && s.room ? P.hover : "transparent", cursor: s.room ? "pointer" : "default", transition: `background .15s ${P.ease}`,
        opacity: s.status === "hold" ? 0.72 : 1 }}>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontFamily: P.font, fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: P.text }}>{s.role}</span>
          {s.room && <span style={{ ...mono(P, { fontSize: 8.5, color: P.goldTxt }), background: P.goldBg, border: `1px solid ${P.goldLine}`, padding: "2px 6px", borderRadius: 5 }}>Open room</span>}
        </span>
        <span style={{ display: "block", ...mono(P, { fontSize: 10 }), marginTop: 7 }}>{s.dept} · {s.loc}</span>
        {mobile && s.lead && <span style={{ display: "block", ...mono(P, { fontSize: 9.5, color: P.text2 }), marginTop: 7 }}>{s.lead.name} · {s.status === "placed" ? "Placed" : `${s.presented} presented`}</span>}
      </span>
      {!mobile && <StageTrack P={P} idx={s.stageIdx} mono={mono} />}
      {!mobile && (
        <span>
          {s.lead ? (
            <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <FitRing P={P} value={s.lead.fit} size={40} stroke={4} />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: P.font, fontWeight: 600, fontSize: 14, color: P.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.lead.name}</span>
                <span style={{ ...mono(P, { fontSize: 9 }) }}>{s.status === "placed" ? "Placed" : `${s.presented} presented`}</span>
              </span>
            </span>
          ) : (
            <span style={{ ...mono(P, { fontSize: 10, color: P.text2 }) }}>{s.metric}</span>
          )}
        </span>
      )}
      <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14 }}>
        <span style={{ ...mono(P, { fontSize: 9.5, color: chip.color }), background: chip.bg, border: `1px solid ${chip.bd}`, padding: "5px 9px", borderRadius: 6, whiteSpace: "nowrap" }}>{chip.t}</span>
        <span style={{ color: s.room ? (hover ? P.goldTxt : P.text3) : P.text4, display: "inline-flex", transition: "color .15s" }}><ArrowRight size={15} strokeWidth={2} /></span>
      </span>
    </button>
  );
}

function PortfolioView() {
  const mobile = useIsMobile();
  const P = { ...BRAND, ...THEMES.light };
  const mono = monoS;

  const groups = [
    { key: "decide", title: "Needs your decision" },
    { key: "progress", title: "In progress" },
    { key: "closed", title: "Closed & on hold" },
  ];

  return (
    <div style={{ fontFamily: P.font, color: P.pgText, background: P.pgBg, minHeight: "100vh", padding: "0 0 64px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: mobile ? "0 18px" : "0 32px" }}>
        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0 20px", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Mark size={28} dark={false} />
            <span style={{ fontFamily: P.font, fontWeight: 900, fontSize: 17, letterSpacing: "-0.07em", color: P.pgText }}>SPYGLASS</span>
            <span style={{ width: 1, height: 18, background: P.pgLine, margin: "0 4px" }} />
            <span style={{ ...mono(P, { fontSize: 11, color: P.pgText3 }) }}>Client home</span>
          </div>
          <span style={{ ...mono(P, { fontSize: 11, color: P.pgText3 }) }}>Procare · Confidential</span>
        </div>
        <div style={{ height: 1, background: P.pgLine }} />

        {/* hero — matches the search room / dossier */}
        <div style={{ padding: "56px 0 44px", paddingLeft: "clamp(0px, 5vw, 90px)", animation: "spgRise .6s both", animationDelay: "0.02s" }}>
          <div style={{ fontFamily: P.mono, fontSize: 14, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.pgGold, marginBottom: 26 }}>
            Active engagement
          </div>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(46px, 7.5vw, 94px)", lineHeight: 0.95, letterSpacing: "-0.045em", margin: 0, color: P.pgText }}>
            Procare HR
          </h1>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap", marginTop: 36 }}>
            {[["Client", "Procare HR"], ["Client POC", "Matt Strange, COO"], ["Talent partner", "Marcos Cuellar"]].map(([l, v]) => (
              <div key={l}>
                <div style={{ ...mono(P, { fontSize: 10, color: P.pgGold }), marginBottom: 9 }}>{l}</div>
                <div style={{ fontFamily: P.font, fontWeight: 700, fontSize: 19, letterSpacing: "-0.01em", color: P.pgText }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MARKET INTEL — full brief */}
        <div style={{ marginBottom: 50, animation: "spgRise .6s both", animationDelay: "0.12s" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
            <span style={{ ...sectionH(P, { fontSize: 19 }) }}>Market intel</span>
            <span style={{ ...mono(P, { fontSize: 10 }) }}>Across your open roles</span>
          </div>
          <SearchBrief P={P} hideIntro impact={COMPANY_INTEL} />
        </div>

        {/* BREAKDOWN OF THE ROLES */}
        <div style={{ ...sectionH(P, { fontSize: 19, marginBottom: 16 }) }}>Breakdown of the roles</div>
        {groups.map((g, gi) => {
          const items = SEARCHES.filter((s) => s.group === g.key);
          if (!items.length) return null;
          return (
            <div key={g.key} style={{ marginBottom: 30, animation: "spgRise .6s both", animationDelay: `${0.22 + gi * 0.08}s` }}>
              <div style={{ ...mono(P, { fontSize: 10, color: P.text3 }), marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                {g.title} <span style={{ color: P.text4 }}>·</span> {items.length}
              </div>
              <div style={{ ...cardS(P), overflow: "hidden" }}>
                {items.map((s, i) => <SearchRow key={s.role} P={P} s={s} mono={mono} FitRing={FitRing} last={i === items.length - 1} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { PortfolioView };
