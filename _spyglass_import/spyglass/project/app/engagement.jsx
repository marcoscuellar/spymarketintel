/* ============================================================
   Spyglass · Project Matrix — Engagement workspace
   Intake · Matrix (with Recruiter/Candidate toggle) · Screening
   ============================================================ */

function Stepper({ stage }) {
  const { STAGES } = window.SPYGLASS_DATA;
  const built = STAGES.filter(s => !s.upcoming);
  const upcoming = STAGES.filter(s => s.upcoming);
  const idx = built.findIndex(s => s.key === stage);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'nowrap', minWidth: 'max-content' }}>
      {built.map((s, i) => {
        const done = i < idx, current = i === idx;
        return (
          <React.Fragment key={s.key}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 21, height: 21, borderRadius: 99, display: 'grid', placeItems: 'center', fontFamily: "'Geist Mono', monospace", fontSize: 12.5, fontWeight: 600,
                background: current || done ? 'var(--ink)' : 'var(--paper)',
                color: current || done ? '#fff' : 'var(--ink-3)', border: current || done ? 'none' : '1px solid var(--line)' }}>
                {done ? '✓' : i + 1}
              </span>
              <span className="t-mono-xs" style={{ color: current ? 'var(--ink)' : 'var(--ink-3)' }}>{s.label}</span>
            </div>
            <span style={{ width: 26, height: 1, background: 'var(--line)', margin: '0 11px' }}></span>
          </React.Fragment>
        );
      })}
      {/* Upcoming — the flow continues from here */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 2, opacity: 0.5 }} title="Continuation of the flow">
        {upcoming.map((s, i) => (
          <span key={s.key} style={{ width: 8, height: 8, borderRadius: 99, border: '1.5px dashed var(--ink-4)' }} title={s.label}></span>
        ))}
        <span className="t-mono-xs" style={{ color: 'var(--ink-4)', marginLeft: 2, whiteSpace: 'nowrap' }}>+{upcoming.length} TO COME</span>
      </div>
    </div>
  );
}

// ============================================================
// Workspace shell
// ============================================================
function Workspace({ engagement, onBack }) {
  const { MATRIX } = window.SPYGLASS_DATA;
  const { role } = React.useContext(window.FlowContext);
  const detailed = engagement.detailed;
  const [tab, setTab] = React.useState(detailed ? (role === 'manager' ? 'review' : 'matrix') : 'intake');
  const [matrixRun, setMatrixRun] = React.useState(engagement.matrixReady);
  const [dossierId, setDossierId] = React.useState(null); // open dossier overlay

  const tabs = detailed ? [
    { key: 'intake', label: 'Intake' },
    { key: 'matrix', label: 'The Matrix' },
    { key: 'pipeline', label: 'Candidate Pipeline' },
    { key: 'review', label: 'Internal Review' },
  ] : [
    { key: 'intake', label: 'Intake' },
    { key: 'matrix', label: 'The Matrix' },
    { key: 'pipeline', label: 'Candidate Pipeline' },
  ];

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 40px 110px' }}>
      {/* Back + breadcrumb */}
      <button onClick={onBack} className="t-mono-xs" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 26, padding: 0 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Arrow s={12} /></span> ALL ENGAGEMENTS
      </button>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <h1 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 800, fontSize: 40.5, letterSpacing: '-0.035em', margin: 0 }}>{engagement.role}</h1>
          <StagePill stage={engagement.stage} />
        </div>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', fontFamily: "'Geist', sans-serif", fontSize: 15.5, color: 'var(--ink-2)' }}>
          <span><span style={{ color: 'var(--ink-3)' }}>Client</span>&nbsp;&nbsp;{engagement.client}</span>
          <span><span style={{ color: 'var(--ink-3)' }}>Location</span>&nbsp;&nbsp;{engagement.location}</span>
          <span><span style={{ color: 'var(--ink-3)' }}>Comp</span>&nbsp;&nbsp;{engagement.comp}</span>
          <span><span style={{ color: 'var(--ink-3)' }}>AM</span>&nbsp;&nbsp;{engagement.am}</span>
          <span><span style={{ color: 'var(--ink-3)' }}>Recruiter</span>&nbsp;&nbsp;{engagement.recruiter}</span>
        </div>
      </div>

      {/* Flow spine */}
      <div style={{ padding: '16px 22px', background: 'var(--paper)', borderRadius: 'var(--r-4)', marginBottom: 30, overflowX: 'auto' }}>
        <Stepper stage={engagement.stage} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', marginBottom: 36 }}>
        {tabs.map(t => {
          const on = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', position: 'relative',
                fontFamily: "'Geist', sans-serif", fontSize: 16.5, fontWeight: on ? 600 : 500, color: on ? 'var(--ink)' : 'var(--ink-3)', transition: 'color .18s' }}>
              {t.label}
              {on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'var(--ink)' }}></span>}
            </button>
          );
        })}
      </div>

      {/* Body */}
      {tab === 'intake' && <IntakeTab detailed={detailed} />}
      {tab === 'matrix' && (detailed
        ? <MatrixTab run={matrixRun} onRun={() => setMatrixRun(true)} />
        : <EmptyTab label="The Matrix for this role hasn't been generated in this demo. Open Meridian — Senior Tax Manager to see a full Matrix." />)}
      {tab === 'pipeline' && (detailed
        ? <CandidatePipeline onOpen={setDossierId} />
        : <EmptyTab label="The candidate pipeline opens once the Matrix is run and sourcing begins. Open Meridian — Senior Tax Manager to see a worked pipeline." />)}
      {tab === 'review' && <InternalReview onOpen={setDossierId} />}

      {/* Dossier overlay */}
      {dossierId && <DossierOverlay candId={dossierId} onClose={() => setDossierId(null)} />}
    </div>
  );
}

function EmptyTab({ label }) {
  return (
    <div style={{ padding: '70px 40px', textAlign: 'center', background: 'var(--paper)', borderRadius: 'var(--r-6)', border: '1px solid var(--line)' }}>
      <p className="t-body" style={{ color: 'var(--ink-2)', maxWidth: '46ch', margin: '0 auto' }}>{label}</p>
    </div>
  );
}

// ============================================================
// INTAKE TAB — what the AM captured in the client meeting
// ============================================================
function IntakeTab({ detailed }) {
  const { MATRIX } = window.SPYGLASS_DATA;
  const k = MATRIX.intake;
  if (!detailed) return <EmptyTab label="Intake notes for this engagement aren't part of the demo dataset." />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 26, alignItems: 'start' }}>
      {/* Left: the need + soft skills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Card style={{ padding: 30 }}>
          <Eyebrow style={{ marginBottom: 16 }}>CLIENT MEETING · {k.meetingDate}</Eyebrow>
          <h3 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: 22.5, letterSpacing: '-0.02em', margin: '0 0 12px' }}>The stated need</h3>
          <p className="t-body" style={{ color: 'var(--ink-2)', fontSize: 17.5, margin: 0 }}>{k.statedNeed}</p>
          <div style={{ marginTop: 22, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
            <div className="t-mono-xs" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>IN THE ROOM</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {k.attendees.map((a, i) => <Tag key={i} tone="pipeline">{a}</Tag>)}
            </div>
          </div>
        </Card>

        <Card style={{ padding: 30 }}>
          <Eyebrow style={{ marginBottom: 6 }}>ABOVE THE JOB DESCRIPTION</Eyebrow>
          <h3 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: 22.5, letterSpacing: '-0.02em', margin: '8px 0 4px' }}>The soft skills they actually want</h3>
          <p className="t-body" style={{ color: 'var(--ink-3)', margin: '0 0 20px' }}>This is the part the Matrix turns into strategy.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {k.softSkills.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13.5, color: 'var(--ink-3)', paddingTop: 3 }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 17.5, marginBottom: 3 }}>{s.label}</div>
                  <div className="t-body" style={{ color: 'var(--ink-2)' }}>{s.note}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right: internal notes — confidential */}
      <Card tone="navy" style={{ padding: 28, position: 'sticky', top: 92, background: 'var(--navy)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
          <LockIcon />
          <span className="t-mono-xs" style={{ color: 'var(--navy-fade)', letterSpacing: '0.1em' }}>INTERNAL ONLY · NEVER LEAVES SPYGLASS</span>
        </div>
        <h3 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: 20.5, letterSpacing: '-0.02em', margin: '0 0 18px', color: '#fff' }}>Client notes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {k.internalNotes.map((n, i) => (
            <div key={i} style={{ paddingBottom: 16, borderBottom: i < k.internalNotes.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <span className="t-mono-xs" style={{ color: 'var(--amber)', display: 'inline-block', marginBottom: 7 }}>{n.tag}</span>
              <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,0.82)', margin: 0 }}>{n.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const LockIcon = ({ c = 'var(--navy-fade)' }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><path d="M5 7V5a3 3 0 016 0v2" stroke={c} strokeWidth="1.4"/></svg>
);

Object.assign(window, { Workspace, Stepper, IntakeTab, EmptyTab, LockIcon });
