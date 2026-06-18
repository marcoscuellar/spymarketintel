/* ============================================================
   Spyglass · Project Matrix — Top bar + Pipeline view
   ============================================================ */

function RoleSwitcher() {
  const { ROLES } = window.SPYGLASS_DATA;
  const { role, switchRole } = React.useContext(window.FlowContext);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <span className="t-mono-xs" style={{ color: 'var(--ink-4)', letterSpacing: '0.12em' }}>VIEW AS</span>
      <div style={{ display: 'inline-flex', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-3)', padding: 3, gap: 2 }}>
        {ROLES.map(r => {
          const on = role === r.key;
          return (
            <button key={r.key} onClick={() => switchRole(r.key)}
              className="t-mono-xs"
              style={{ padding: '7px 12px', borderRadius: 9, cursor: 'pointer', border: 'none', letterSpacing: '0.08em',
                backgroundColor: on ? (r.key === 'client' ? 'var(--navy)' : r.key === 'manager' ? 'var(--amber)' : 'var(--ink)') : 'transparent',
                color: on ? (r.key === 'manager' ? '#1a1206' : '#fff') : 'var(--ink-3)',
                transition: 'color .2s var(--ease)' }}>
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TopBar({ onHome }) {
  const { ROLES } = window.SPYGLASS_DATA;
  const { role } = React.useContext(window.FlowContext);
  const persona = ROLES.find(r => r.key === role);
  const isClient = role === 'client';
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 68, borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,0.86)', backdropFilter: 'saturate(180%) blur(14px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div onClick={isClient ? undefined : onHome} style={{ cursor: isClient ? 'default' : 'pointer' }}>
        <Lockup markSize={30} caption={isClient ? 'CANDIDATE PORTAL' : 'PROJECT MATRIX'} variant={isClient ? 'navy' : 'primary'} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
        <RoleSwitcher />
        <div style={{ width: 1, height: 26, background: 'var(--line)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: persona.accent, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 14 }}>{persona.initials}</div>
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{persona.who}</div>
            <div className="t-mono-xs" style={{ color: 'var(--ink-3)', fontSize: 11 }}>{persona.sub}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StagePill({ stage }) {
  const map = {
    intake:    { tone: 'pipeline', label: 'Intake' },
    matrix:    { tone: 'amber', label: 'Matrix Ready' },
    strategy:  { tone: 'ink', label: 'Strategy' },
    screening: { tone: 'navy', label: 'Screening' },
  }[stage];
  return <Tag tone={map.tone}>{map.label}</Tag>;
}

function Pipeline({ onOpen }) {
  const { ENGAGEMENTS } = window.SPYGLASS_DATA;
  const active = ENGAGEMENTS.filter(e => e.matrixReady).length;
  const intake = ENGAGEMENTS.filter(e => e.stage === 'intake').length;
  const totalCands = ENGAGEMENTS.reduce((s, e) => s + e.candidates, 0);

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 40px 96px' }}>
      {/* Hero */}
      <div style={{ marginBottom: 44 }}>
        <Eyebrow style={{ marginBottom: 22 }}><span style={{ width: 22, height: 1, background: 'var(--ink-3)', display: 'inline-block' }}></span>THE RECRUITING WORKFLOW</Eyebrow>
        <h1 className="t-display-lg" style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', margin: '0 0 18px', maxWidth: 16 + 'ch' }}>
          Every search,<br /><span className="t-light">run on a Matrix.</span>
        </h1>
        <p className="t-body" style={{ color: 'var(--ink-2)', maxWidth: '54ch', fontSize: 18.5 }}>
          From the client meeting to the candidate interview. The intake becomes a strategy; the strategy becomes a screen. Nothing internal ever leaves the building by accident.
        </p>
      </div>

      {/* Stat strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', borderRadius: 'var(--r-5)', overflow: 'hidden', marginBottom: 48 }}>
        {[
          { n: active, l: 'Matrices live' },
          { n: intake, l: 'Awaiting Matrix' },
          { n: totalCands, l: 'Candidates in screen' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg)', padding: '24px 28px' }}>
            <div style={{ fontFamily: "'Geist', sans-serif", fontWeight: 800, fontSize: 42.5, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.n}</div>
            <div className="t-mono-xs" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Engagement list */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 className="t-mono-tag" style={{ color: 'var(--ink-2)' }}>ACTIVE ENGAGEMENTS</h2>
        <Button kind="primary" icon={<span style={{ fontSize: 17.5, lineHeight: 1 }}>+</span>}>New engagement</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ENGAGEMENTS.map(e => (
          <EngagementRow key={e.id} e={e} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function EngagementRow({ e, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const clickable = true;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(e)}
      style={{
        display: 'grid', gridTemplateColumns: '1.7fr 1fr 0.9fr 0.8fr auto', alignItems: 'center', gap: 24,
        padding: '22px 26px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-5)',
        boxShadow: hover ? 'var(--sh-hover)' : 'var(--sh-card)', transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'all .25s var(--ease)', cursor: 'pointer',
      }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: 20.5, letterSpacing: '-0.02em', marginBottom: 4 }}>{e.role}</div>
        <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 15.5, color: 'var(--ink-2)' }}>{e.client}</div>
      </div>
      <div className="t-mono-xs" style={{ color: 'var(--ink-3)' }}>{e.location}<br /><span style={{ color: 'var(--ink-2)' }}>{e.comp}</span></div>
      <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 14.5, color: 'var(--ink-2)' }}>
        <span style={{ color: 'var(--ink-3)' }}>Recruiter</span><br />{e.recruiter}
      </div>
      <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 14.5, color: 'var(--ink-2)' }}>
        <span style={{ color: 'var(--ink-3)' }}>Candidates</span><br />{e.candidates || '—'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifySelf: 'end' }}>
        <StagePill stage={e.stage} />
        <span style={{ color: hover ? 'var(--ink)' : 'var(--ink-3)', transition: 'all .2s', transform: hover ? 'translateX(3px)' : 'none', display: 'inline-flex' }}><Arrow /></span>
      </div>
    </div>
  );
}

Object.assign(window, { TopBar, Pipeline, StagePill });
