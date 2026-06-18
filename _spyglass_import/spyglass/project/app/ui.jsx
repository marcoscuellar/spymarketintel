/* ============================================================
   Spyglass · Project Matrix — shared UI primitives
   Built on the adopted GLVE design language.
   ============================================================ */

// ---- The mark: the cufflink housing, recolored per-variant ----
function Mark({ variant = 'primary', size = 28 }) {
  const V = {
    primary: { housing: '#0A1F3D', band: '#ffffff', stitch: '#0A1F3D', cuf: ['#C2A24C', '#0A1F3D', '#C2A24C'] },
    amber:   { housing: '#0a0a0a', band: '#ffffff', stitch: '#0a0a0a', cuf: ['#C2A24C', '#ffffff', '#C2A24C'] },
    navy:    { housing: '#0A1F3D', band: '#ffffff', stitch: '#0A1F3D', cuf: ['#C2A24C', '#0A1F3D', '#C2A24C'] },
    forest:  { housing: '#C2A24C', band: '#ffffff', stitch: '#C2A24C', cuf: ['#0A1F3D', '#ffffff', '#0A1F3D'] },
    light:   { housing: '#f5f5f4', housingStroke: '#e7e5e4', band: '#0a0a0a', stitch: '#ffffff', stitchOpacity: 0.55, cuf: ['#ffffff', '#0a0a0a', '#ffffff'] },
  }[variant] || {};
  const stitchVisible = size > 20;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Spyglass">
      <rect width="100" height="100" rx="28" fill={V.housing} stroke={V.housingStroke || 'none'} strokeWidth={V.housingStroke ? 1 : 0}></rect>
      <rect x="14" y="38" width="72" height="24" rx="3" fill={V.band}></rect>
      {stitchVisible && (
        <line x1="20" y1="50" x2="62" y2="50" stroke={V.stitch} strokeWidth="1.4" strokeDasharray="3 3" opacity={V.stitchOpacity ?? 1}></line>
      )}
      <circle cx="72" cy="50" r="9" fill={V.cuf[0]}></circle>
      <circle cx="72" cy="50" r="5" fill={V.cuf[1]}></circle>
      <circle cx="72" cy="50" r="2" fill={V.cuf[2]}></circle>
    </svg>
  );
}

// ---- The wordmark: SPYGLASS in Geist 900 ----
function Wordmark({ size = 20, color = 'var(--ink)' }) {
  return (
    <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 900, fontSize: size, letterSpacing: '-0.07em', lineHeight: 1, color, whiteSpace: 'nowrap' }} aria-label="SPYGLASS">
      SPYGLASS
    </span>
  );
}

// ---- Full lockup with mono caption ----
function Lockup({ markSize = 28, caption = 'PROJECT MATRIX', variant = 'primary', color = 'var(--ink)' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(markSize * 0.45) }}>
      <Mark variant={variant} size={markSize} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Wordmark size={Math.round(markSize * 0.62)} color={color} />
        {caption && (
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: Math.max(9, Math.round(markSize * 0.32)), letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 500 }}>
            {caption}
          </span>
        )}
      </span>
    </span>
  );
}

// ---- Mono eyebrow ----
function Eyebrow({ children, color = 'var(--ink-3)', style }) {
  return (
    <span className="t-mono-tag" style={{ color, display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}>
      {children}
    </span>
  );
}

// ---- Tag / badge ----
function Tag({ children, tone = 'pipeline' }) {
  const tones = {
    pipeline:   { background: 'var(--paper)', color: 'var(--ink-2)', border: '1px solid var(--line)' },
    ink:        { background: 'var(--ink)', color: '#fff', border: '1px solid var(--ink)' },
    amber:      { background: 'var(--amber-bg)', color: 'var(--amber-dd)', border: '1px solid var(--gold-line)' },
    navy:       { background: 'rgba(10,31,61,0.06)', color: 'var(--navy)', border: '1px solid rgba(10,31,61,0.16)' },
    live:       { background: 'rgba(10,31,61,0.06)', color: 'var(--navy)', border: '1px solid rgba(10,31,61,0.2)' },
    forest:     { background: 'rgba(10,31,61,0.06)', color: 'var(--navy)', border: '1px solid rgba(10,31,61,0.2)' },
  };
  return (
    <span className="t-mono-xs" style={{ padding: '4px 8px', borderRadius: 'var(--r-1)', whiteSpace: 'nowrap', ...tones[tone] }}>
      {children}
    </span>
  );
}

// ---- Live dot ----
function Dot({ color = 'var(--green)' }) {
  return <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 99, background: color, boxShadow: `0 0 0 3px ${color === 'var(--green)' ? 'rgba(194,162,76,0.2)' : 'rgba(194,162,76,0.18)'}` }}></span>;
}

// ---- Buttons ----
function Button({ children, onClick, kind = 'primary', icon, style, disabled }) {
  const base = {
    fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 15.5, letterSpacing: '-0.01em',
    padding: '11px 18px', borderRadius: 'var(--r-3)', cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 9, transition: 'all .22s var(--ease)',
    border: '1px solid transparent', opacity: disabled ? 0.4 : 1, userSelect: 'none',
  };
  const kinds = {
    primary:   { background: 'var(--navy)', color: '#fff', borderColor: 'var(--navy)' },
    secondary: { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--line)' },
    amber:     { background: 'var(--amber)', color: '#2a2008', borderColor: 'var(--amber)' },
    navy:      { background: 'var(--navy)', color: '#fff', borderColor: 'var(--navy)' },
    ghost:     { background: 'transparent', color: 'var(--ink-2)', borderColor: 'transparent' },
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? (
    kind === 'secondary' ? { borderColor: 'var(--ink)', transform: 'translateY(-2px)' }
    : kind === 'ghost' ? { color: 'var(--ink)', background: 'var(--paper)' }
    : { transform: 'translateY(-2px)', boxShadow: 'var(--sh-hover)' }
  ) : {};
  return (
    <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...kinds[kind], ...hoverStyle, ...style }}>
      {children}
      {icon && <span style={{ transition: 'transform .22s var(--ease)', transform: hover && !disabled ? 'translateX(3px)' : 'none', display: 'inline-flex' }}>{icon}</span>}
    </button>
  );
}

// ---- Mono system button [ BRACKETED ] ----
function MonoButton({ children, onClick, active, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className="t-mono-btn"
      style={{
        padding: '8px 13px', borderRadius: 'var(--r-2)', cursor: 'pointer',
        background: active ? 'var(--ink)' : (hover ? 'var(--paper)' : 'transparent'),
        color: active ? '#fff' : 'var(--ink-2)',
        border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
        transition: 'all .18s var(--ease)', display: 'inline-flex', alignItems: 'center', gap: 7, ...style,
      }}>
      {children}
    </button>
  );
}

// ---- Arrow glyph ----
const Arrow = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// ---- Card shell ----
function Card({ children, style, onClick, hover: enableHover, tone }) {
  const [hover, setHover] = React.useState(false);
  const toneBorder = tone === 'amber' ? '2px solid var(--amber)' : tone === 'navy' ? '2px solid var(--navy)' : '1px solid var(--line)';
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--bg-card)', border: toneBorder, borderRadius: 'var(--r-6)',
        boxShadow: enableHover && hover ? 'var(--sh-hover)' : 'var(--sh-card)',
        transform: enableHover && hover ? 'translateY(-2px)' : 'none',
        transition: 'all .25s var(--ease)', cursor: onClick ? 'pointer' : 'default', ...style,
      }}>
      {children}
    </div>
  );
}

Object.assign(window, { Mark, Wordmark, Lockup, Eyebrow, Tag, Dot, Button, MonoButton, Arrow, Card });
