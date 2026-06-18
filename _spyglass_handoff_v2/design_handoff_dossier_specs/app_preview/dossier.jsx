(function(){
const { useState, useMemo } = React;
const { Mic, FileText, DollarSign, MapPin, ShieldCheck, Quote, Calendar, MessageSquareText, XCircle, Send, GraduationCap, Award, Briefcase, Plus, StickyNote, Search } = window.LucideIcons;

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

const CRITERIA = [
  { id: "platform", name: "Data Platform · Architecture", weight: 20, src: "matrix", v: 96,
    meaning: "This pod owns the Clarent data platform. Mateo has built a multi-tenant data platform end to end — ingestion, model, and APIs — the closest analog on the slate." },
  { id: "integ", name: "HRIS / Integrations", weight: 16, src: "matrix", v: 92,
    meaning: "Clarent lives on clean, unified data. Mateo has wired messy third-party systems into a single source of truth — exactly the PCC / Yardi / Aline integration problem." },
  { id: "fullstack", name: "Full-Stack Delivery", weight: 16, src: "matrix", v: 92,
    meaning: "Ships end to end in TypeScript, Node, Postgres, and React — no hand-offs needed to move a feature from data layer to UI." },
  { id: "ai", name: "AI / ML Pragmatism", weight: 12, src: "matrix", v: 84,
    meaning: "Can support the AI scorecard — solid, practical ML — though the heavier model work may want Diego alongside him." },
  { id: "hours", name: "US-Hours Collaboration", weight: 12, src: "live", v: 92,
    meaning: "Interview-scored. Works from São Paulo (UTC−3) with real daytime overlap for the Procare team — async by default, available when it counts." },
  { id: "ownership", name: "Ownership in Ambiguity", weight: 12, src: "live", v: 92,
    meaning: "Interview-scored. Thrives in lean, founder-led shops — unblocks himself and owns outcomes, not tickets." },
  { id: "english", name: "English / Communication", weight: 7, src: "live", v: 88,
    meaning: "Interview-scored. Clear, fluent written and spoken English; comfortable in product and stakeholder conversations." },
  { id: "comp", name: "Comp Alignment", weight: 5, src: "matrix", v: 95,
    meaning: "The easy part. His ask lands well below the US senior-engineering band — the entire reason nearshore works here." },
];
const overall = Math.round(CRITERIA.reduce((a, c) => a + c.v * c.weight, 0) / 100);
const CAND = {
  name: "Mateo Ríos",
  current: "Sr. Full-Stack Engineer — ex-Nubank",
  salary: "$85K–$95K target",
  location: "São Paulo, BR · UTC−3",
  pitch: "Owns data-platform builds end to end; HR-tech depth.",
  compliance: "Background + references verified",
};

/* SVG donut — gold fill, paper track, height = score */
const CX = 140, CY = 140, R_IN = 70, R_OUT = 128, GAP = 3;
const polar = (r, d) => { const a = (d - 90) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
const arc = (rO, rI, a0, a1) => {
  const L = a1 - a0 > 180 ? 1 : 0;
  const [x1, y1] = polar(rO, a0), [x2, y2] = polar(rO, a1), [x3, y3] = polar(rI, a1), [x4, y4] = polar(rI, a0);
  return `M ${x1} ${y1} A ${rO} ${rO} 0 ${L} 1 ${x2} ${y2} L ${x3} ${y3} A ${rI} ${rI} 0 ${L} 0 ${x4} ${y4} Z`;
};

function CandidateDossier() {
  const [tab, setTab] = useState("overview");
  const [active, setActive] = useState(null);
  const [composer, setComposer] = useState(null);
  const [notes, setNotes] = useState([{ id: 1, ts: "Jun 16, 2:10 PM", text: "Strong Clarent analog — want Paul to meet him before we line up the pod." }]);
  const [draft, setDraft] = useState("");

  const segs = useMemo(() => {
    let cum = 0;
    return CRITERIA.map((c) => {
      const span = (c.weight / 100) * 360, a0 = cum + GAP / 2, a1 = cum + span - GAP / 2;
      cum += span;
      return { ...c, a0, a1, rScore: R_IN + (c.v / 100) * (R_OUT - R_IN) };
    });
  }, []);
  const act = active != null ? segs[active] : null;

  const mono = { fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.ink3 };
  const sectionH = { fontFamily: T.font, fontWeight: 800, fontSize: 22, letterSpacing: "-0.025em", lineHeight: 1.1, color: T.goldText };
  const card = { background: T.card, border: `1px solid ${T.line}`, borderRadius: T.r.card, boxShadow: T.sh, color: T.ink };
  const TABS = [["overview", "Overview"], ["detail", "Detail"], ["notes", "Notes"]];

  return (
    <div style={{ fontFamily: T.font, color: T.ink, background: T.bg, minHeight: "100%", padding: "0 0 40px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(32px, 6vw, 100px)" }}>

        {/* ── HEADER ── */}
        <header>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0 20px", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: T.font, fontWeight: 900, fontSize: 17, letterSpacing: "-0.07em", color: T.ink }}>SPYGLASS PARTNERS</span>
              <span style={{ width: 1, height: 18, background: T.line, margin: "0 4px" }} />
              <button onClick={() => window.dispatchEvent(new CustomEvent("spg-open-room"))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: T.ink3, display: "inline-flex", alignItems: "center", gap: 6 }}>← Search room</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ ...mono, fontSize: 12 }}>Evaluating</span>
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 18px", borderRadius: 14,
                border: `1px solid ${T.line}`, background: T.bg, minWidth: 230 }}>
                <Search size={15} color={T.ink3} />
                <input placeholder="Candidate name…" defaultValue={CAND.name}
                  style={{ border: "none", outline: "none", background: "transparent", color: T.ink, fontFamily: T.font, fontSize: 15, width: "100%" }} />
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: T.line }} />

          <div style={{ padding: "56px 0 48px", paddingLeft: "clamp(0px, 5vw, 90px)" }}>
            <div style={{ fontFamily: T.mono, fontSize: 14, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: T.goldText, marginBottom: 26 }}>
              Nearshore Build · Clarent Platform
            </div>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(46px, 7.5vw, 94px)", lineHeight: 0.95, letterSpacing: "-0.045em", margin: 0, color: T.ink }}>
              Nearshore<br />Engineering Pod
            </h1>
            <p style={{ fontSize: "clamp(18px, 2.1vw, 24px)", lineHeight: 1.5, color: T.ink2, maxWidth: "38ch", marginTop: 28 }}>
              Procare HR — a 62-person senior-care PEO that bought the Clarent data platform and is building an AI workforce scorecard. A <strong style={{ color: T.ink, fontWeight: 700 }}>nearshore engineering pod</strong> to ship that roadmap in US time zones, at a fraction of Minneapolis cost.
            </p>
          </div>
        </header>

        {/* ── BODY ── */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>

          {/* LEFT rail */}
          <aside style={{ ...card, padding: 28, position: "sticky", top: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: "-0.04em", lineHeight: 1 }}>{CAND.name}</div>
            <div style={{ fontSize: 14, color: T.ink2, marginTop: 9, lineHeight: 1.45 }}>{CAND.current}</div>

            <div style={{ display: "inline-flex", alignItems: "baseline", gap: 8, marginTop: 18, padding: "8px 14px",
              borderRadius: T.r.chip, background: T.goldBg, border: `1px solid ${T.goldLine}` }}>
              <span style={{ fontFamily: T.mono, fontWeight: 800, fontSize: 19, color: T.goldText, letterSpacing: "-0.03em" }}>{overall}%</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>match</span>
            </div>

            <div style={{ height: 1, background: T.line, margin: "24px 0" }} />

            {[
              { ic: <DollarSign size={17} strokeWidth={1.7} />, k: "Salary", v: CAND.salary, em: true },
              { ic: <MapPin size={17} strokeWidth={1.7} />, k: "Location", v: CAND.location, em: true },
              { ic: <Quote size={17} strokeWidth={1.7} />, k: "In one line", v: CAND.pitch },
              { ic: <ShieldCheck size={17} strokeWidth={1.7} />, k: "Compliance", v: CAND.compliance },
            ].map((s) => (
              <div key={s.k} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 12, marginBottom: 20 }}>
                <span style={{ color: T.gold, marginTop: 2 }}>{s.ic}</span>
                <span>
                  <span style={{ ...mono, fontSize: 11, display: "block", marginBottom: 4 }}>{s.k}</span>
                  <span style={{ fontSize: 15, color: T.ink, lineHeight: 1.45, fontWeight: s.em ? 600 : 400 }}>{s.v}</span>
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
                    <Calendar size={16} color={T.gold} style={{ flexShrink: 0, marginTop: 1 }} /> Spyglass will coordinate {CAND.name.split(" ")[0]}'s interview with your team — suggested next Tue/Wed AM.
                  </div>
                ) : (
                  <div style={{ background: T.card2, border: `1px solid ${composer === "pass" ? T.red : T.line}`, borderRadius: T.r.panel, padding: 14 }}>
                    <div style={{ ...mono, fontSize: 11, marginBottom: 9, color: composer === "pass" ? T.red : T.goldText }}>{composer === "pass" ? "Pass — tell us why" : "Question for Spyglass"}</div>
                    <textarea rows={3} placeholder={composer === "pass" ? "e.g. want more AI depth / a different time zone…" : "Ask anything about Mateo or the pod…"} style={ta(T)} />
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
                    {segs.map((s) => <path key={"t" + s.id} d={arc(R_OUT, R_IN, s.a0, s.a1)} fill={T.paper} />)}
                    {segs.map((s, i) => (
                      <path key={s.id} d={arc(s.rScore, R_IN, s.a0, s.a1)} fill={T.gold}
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
                          Lead candidate. Mateo has built and scaled a multi-tenant data platform at HR-tech scale — the closest analog on the slate to what Clarent needs. {overall}% match; comp lands well under the US band, in US-overlapping hours.
                        </div>
                        <div style={{ ...mono, fontSize: 12 }}>Hover any wedge for what it means. Full write-up in <span style={{ color: T.goldText }}>Detail</span>.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* DETAIL */}
              {tab === "detail" && (
                <div style={{ fontSize: 17, lineHeight: 1.65, color: T.ink }}>
                  <div style={{ ...sectionH, marginBottom: 16 }}>Why Mateo fits this search</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 30 }}>
                    <p>Mateo is a platform builder. At Nubank he owned a multi-tenant data platform end to end — ingestion, the data model, and the API layer other teams built on — which is the closest analog on this slate to what Clarent needs. You are not hiring a feature contractor; you are hiring someone who can own the platform.</p>
                    <p>His depth is integrations and data correctness. He has wired messy third-party systems into a single source of truth — exactly the problem Clarent's “data dictionary” is solving across PCC, Yardi, and the rest. For a roadmap that lives or dies on clean, unified HR data, that is the core skill.</p>
                    <p>He works US hours from São Paulo (UTC−3) and is comfortable in lean, founder-led shops — async by default, with real daytime overlap for the Procare team. He reads as low-ego and ownership-minded, the kind of engineer who unblocks himself.</p>
                    <p>The honest watch-out is AI depth: he is strong, pragmatic full-stack and data, but the AI-scorecard work may want Diego alongside him. Comp is the easy part — his ask lands well below the US senior-engineering band, the entire reason nearshore works here.</p>
                  </div>

                  <div style={{ height: 1, background: T.line, margin: "0 0 24px" }} />
                  <div style={{ ...sectionH, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}><Briefcase size={19} strokeWidth={1.9} />Résumé</div>
                  {[
                    { r: "Sr. Full-Stack Engineer", co: "Nubank · Remote (São Paulo)", d: "2021 — Present",
                      b: ["Owned a multi-tenant data platform — ingestion, modeling, and APIs — used across product teams.", "Built integrations into a dozen third-party systems with strong data-quality guarantees.", "Stack: TypeScript, Node, Postgres, React, AWS."] },
                    { r: "Full-Stack Engineer", co: "QuintoAndar · São Paulo, BR", d: "2017 — 2021",
                      b: ["Shipped customer-facing product across web and backend services.", "Led the migration to a unified events / data pipeline."] },
                    { r: "Software Engineer", co: "Freelance / early-stage", d: "2015 — 2017",
                      b: ["Full-stack builds for early-stage startups."] },
                  ].map((j) => (
                    <div key={j.r} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${T.lineSoft}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontWeight: 700, fontSize: 17 }}>{j.r}</span>
                        <span style={{ fontFamily: T.mono, fontSize: 12, color: T.ink3, whiteSpace: "nowrap" }}>{j.d}</span>
                      </div>
                      <div style={{ fontSize: 14, color: T.ink2, margin: "3px 0 9px" }}>{j.co}</div>
                      <ul style={{ margin: 0, paddingLeft: 20, color: T.ink2 }}>{j.b.map((x, i) => <li key={i} style={{ marginBottom: 5 }}>{x}</li>)}</ul>
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, margin: "6px 0 30px" }}>
                    <div><div style={{ ...mono, marginBottom: 9, color: T.goldText, display: "flex", alignItems: "center", gap: 7 }}><GraduationCap size={14} strokeWidth={1.7} />Education</div><div>B.S., Computer Science — USP (São Paulo)</div></div>
                    <div><div style={{ ...mono, marginBottom: 9, color: T.goldText, display: "flex", alignItems: "center", gap: 7 }}><Award size={14} strokeWidth={1.7} />Certifications</div><div>AWS Solutions Architect — Associate</div><div style={{ color: T.ink2 }}>Postgres · Kafka · TypeScript</div></div>
                  </div>

                  <div style={{ height: 1, background: T.line, margin: "0 0 24px" }} />
                  <div style={{ ...sectionH, marginBottom: 16 }}>References · verified by Spyglass</div>
                  {[
                    { n: "Paula Menezes", role: "Eng Manager, Nubank (current)", status: "Spoke 6/16", q: "Mateo owned our data platform like a founder would — he cares as much about the integration edge-cases as the architecture." },
                    { n: "Rafael Lima", role: "CTO, QuintoAndar (former)", status: "Spoke 6/15", q: "Give him an ambiguous platform problem and he comes back with something shipped and clean. I'd hire him again tomorrow." },
                  ].map((r) => (
                    <div key={r.n} style={{ background: T.card2, border: `1px solid ${T.line}`, borderRadius: T.r.panel, padding: 18, marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                        <span style={{ fontWeight: 700, fontSize: 16 }}>{r.n}</span>
                        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, fontWeight: 600 }}>{r.status}</span>
                      </div>
                      <div style={{ fontSize: 13, color: T.ink2, marginTop: 3, marginBottom: 11 }}>{r.role}</div>
                      <div style={{ fontSize: 15, lineHeight: 1.55, color: T.ink, fontStyle: "italic", paddingLeft: 16, borderLeft: `2px solid ${T.gold}` }}>"{r.q}"</div>
                    </div>
                  ))}
                </div>
              )}

              {/* NOTES */}
              {tab === "notes" && (
                <div>
                  <div style={{ ...sectionH, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}><StickyNote size={19} strokeWidth={1.9} />Your notes on {CAND.name.split(" ")[0]}</div>
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
window.CandidateDossier = CandidateDossier;
})();
