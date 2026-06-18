(function(){
const { useState, useMemo } = React;
const { MapPin, Wifi, Building2, Users, TrendingDown, Briefcase, ArrowRight } = window.LucideIcons;

/* ── Spyglass brand tokens · metallic gold accent, forest for "strong", red = hard ── */
const T = {
  bg: "#FFFFFF", ink: "#0A0A0A", ink2: "#525252", ink3: "#A3A3A3", ink4: "#D4D4D4",
  line: "#E7E5E4", lineSoft: "#EDEDEB", paper: "#F5F5F4",
  amber: "#C2A24C", amberD: "#A6862F", amberDd: "#876B1E", amberDdd: "#6B541A",
  amberPale: "#F1E7C9", amberBg: "#FAF6EA",
  forest: "#2F4D3A", forestDeep: "#1F3327",
  green: "#C2A24C", greenD: "#876B1E",
  red: "#DC2626",
  font: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'Geist Mono', ui-monospace, Menlo, monospace",
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  shCard: "0 12px 32px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
};

function PlaceabilityGauge() {
  const [title, setTitle] = useState("Designer");
  const [location, setLocation] = useState("Santa Monica, CA");
  const [basePool, setBasePool] = useState(50);
  const [arrangement, setArrangement] = useState("onsite");
  const [nicheMatch, setNicheMatch] = useState(10);
  const [comp, setComp] = useState("at");
  const [competing, setCompeting] = useState(1);
  const [closeRate, setCloseRate] = useState(25);

  const geoFactor = { onsite: 1, hybrid: 1.5, remote: 15 }[arrangement];
  const compFactor = { below: 0.5, at: 1.0, above: 1.4 }[comp];
  const openToMove = 0.25;

  const calc = useMemo(() => {
    const reachable = basePool * geoFactor;
    const qualified = reachable * (nicheMatch / 100);
    const willing = qualified * openToMove * compFactor;
    const net = willing / (1 + competing);
    const p = closeRate / 100;
    const prob = net > 0 ? Math.min(0.99, 1 - Math.pow(1 - p, net)) : 0;
    return {
      reachable: Math.round(reachable),
      qualified: Math.round(qualified * 10) / 10,
      willing: Math.round(willing * 10) / 10,
      net: Math.round(net * 10) / 10,
      prob: Math.round(prob * 100),
    };
  }, [basePool, geoFactor, nicheMatch, compFactor, competing, closeRate]);

  const verdict =
    calc.prob >= 75 ? { t: "Strong — fillable", c: T.forest }
    : calc.prob >= 45 ? { t: "Workable — push one lever", c: T.amberDd }
    : { t: "Hard search — widen geo or raise comp", c: T.red };

  /* ── shared styles ── */
  const card = {
    background: T.bg, border: `1px solid ${T.line}`, borderRadius: 20,
    boxShadow: T.shCard, padding: 28,
  };
  const monoLabel = {
    fontFamily: T.mono, fontSize: 10, fontWeight: 600, letterSpacing: "0.07em",
    textTransform: "uppercase", color: T.ink3, marginBottom: 10,
    display: "flex", alignItems: "center", gap: 8,
  };
  const input = {
    width: "100%", padding: "10px 12px", border: `1px solid ${T.line}`,
    borderRadius: 8, fontSize: 14, fontFamily: T.font, color: T.ink,
    outline: "none", boxSizing: "border-box", background: T.bg,
  };

  const Seg = ({ value, set, options }) => (
    <div style={{ display: "flex", gap: 8 }}>
      {options.map((o) => {
        const active = value === o.v;
        return (
          <button key={o.v} onClick={() => set(o.v)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 8, cursor: "pointer",
            border: `1px solid ${active ? T.ink : T.line}`,
            background: active ? T.ink : T.bg,
            color: active ? "#fff" : T.ink2, fontWeight: active ? 600 : 500,
            fontSize: 13, fontFamily: T.font, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 5, transition: `all 0.18s ${T.ease}`,
          }}>
            {o.icon}{o.label}
          </button>
        );
      })}
    </div>
  );

  const Row = ({ label, val, dim }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
      <span style={{ fontSize: 13, color: dim ? T.ink2 : T.ink }}>{label}</span>
      <span style={{ fontSize: 15, fontFamily: T.mono, fontWeight: 600, color: dim ? T.ink2 : T.ink }}>{val}</span>
    </div>
  );

  return (
    <div style={{ fontFamily: T.font, background: T.bg, padding: 24, color: T.ink }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* section head — GLVE pattern: Geist 700 title + right-aligned mono meta */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between",
          gap: 24, paddingBottom: 20, marginBottom: 24, borderBottom: `1px solid ${T.line}` }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: "-0.035em", lineHeight: 1.02 }}>
              Placeability. <span style={{ fontWeight: 400, color: T.ink3 }}>Live odds, every lever.</span>
            </div>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, textTransform: "uppercase",
            letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green,
              boxShadow: "0 0 0 3px rgba(194,162,76,0.2)" }} />
            Live
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* INPUTS */}
          <div style={{ ...card, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={monoLabel}><Briefcase size={11} strokeWidth={1.5} />Title</div>
                <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={monoLabel}><MapPin size={11} strokeWidth={1.5} />Location</div>
                <input style={input} value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>

            <div>
              <div style={monoLabel}>Base pool · LinkedIn count</div>
              <input type="number" style={input} value={basePool}
                onChange={(e) => setBasePool(Math.max(0, +e.target.value || 0))} />
            </div>

            <div>
              <div style={monoLabel}>Work arrangement</div>
              <Seg value={arrangement} set={setArrangement} options={[
                { v: "onsite", label: "Onsite", icon: <Building2 size={13} strokeWidth={1.5} /> },
                { v: "hybrid", label: "Hybrid", icon: <MapPin size={13} strokeWidth={1.5} /> },
                { v: "remote", label: "Remote", icon: <Wifi size={13} strokeWidth={1.5} /> },
              ]} />
              <div style={{ fontSize: 12, color: T.ink3, marginTop: 6 }}>
                Remote expands reach ~15× (national pool).
              </div>
            </div>

            <div>
              <div style={monoLabel}>Niche req match — {nicheMatch}%</div>
              <input type="range" min={1} max={100} value={nicheMatch}
                onChange={(e) => setNicheMatch(+e.target.value)}
                style={{ width: "100%", accentColor: T.ink }} />
            </div>

            <div>
              <div style={monoLabel}>Comp vs market</div>
              <Seg value={comp} set={setComp} options={[
                { v: "below", label: "Below" }, { v: "at", label: "At" }, { v: "above", label: "Above" },
              ]} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={monoLabel}>Competing reqs</div>
                <input type="number" style={input} value={competing}
                  onChange={(e) => setCompeting(Math.max(0, +e.target.value || 0))} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={monoLabel}>Close rate %</div>
                <input type="number" style={input} value={closeRate}
                  onChange={(e) => setCloseRate(Math.min(100, Math.max(1, +e.target.value || 1)))} />
              </div>
            </div>
          </div>

          {/* OUTPUT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ ...card, textAlign: "center", paddingTop: 26, paddingBottom: 26 }}>
              <div style={{ ...monoLabel, justifyContent: "center", marginBottom: 14 }}>Placeability</div>
              <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.92, color: verdict.c }}>
                {calc.prob}<span style={{ fontSize: 30, fontWeight: 700 }}>%</span>
              </div>
              <div style={{ marginTop: 16, height: 8, background: T.paper, borderRadius: 100, overflow: "hidden" }}>
                <div style={{ width: `${calc.prob}%`, height: "100%", background: verdict.c,
                  transition: `width 0.25s ${T.ease}, background 0.25s ${T.ease}` }} />
              </div>
              <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: verdict.c }}>
                {verdict.t}
              </div>
            </div>

            <div style={card}>
              <div style={monoLabel}><Users size={11} strokeWidth={1.5} />Funnel</div>
              <Row label="Reachable (geo applied)" val={calc.reachable} />
              <Row label="× qualified (niche)" val={calc.qualified} dim />
              <Row label="× willing (comp + open)" val={calc.willing} dim />
              <Row label={<span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <TrendingDown size={12} strokeWidth={1.5} />÷ competition</span>} val={calc.net} />
              <div style={{ paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Net reachable pool</span>
                <span style={{ fontSize: 18, fontFamily: T.mono, fontWeight: 700, color: T.ink }}>{calc.net}</span>
              </div>
            </div>
          </div>
        </div>

        {/* formula note — GLVE color-note pattern on paper */}
        <div style={{ marginTop: 16, background: T.paper, borderRadius: 16, padding: "20px 24px",
          display: "grid", gridTemplateColumns: "120px 1fr", gap: 20, alignItems: "start" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.08em",
            textTransform: "uppercase", color: T.ink3 }}>[ Formula ]</div>
          <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.55 }}>
            Placeability = 1 − (1 − closeRate)<sup>net&nbsp;pool</sup>. Plug your real LinkedIn result count into
            Base pool, then calibrate close rate and open-to-move off your HubSpot placement history to make it yours.
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10,
              fontFamily: T.mono, fontSize: 11, fontWeight: 600, color: T.ink, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Flip onsite → remote <ArrowRight size={13} strokeWidth={2} /> watch it move
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

window.PlaceabilityGauge = PlaceabilityGauge;
})();
