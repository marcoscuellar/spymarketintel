/* ============================================================
   Spyglass · Project Matrix — Candidate Pipeline + Internal Review
   The recruiter workspace second half: sourcing kanban and the
   manager's approval gate.
   ============================================================ */

// Effective stage accounts for the manager's live approval:
// a candidate in Internal Review who gets approved moves to Client Ready.
function effectiveStage(c, approvals) {
  if (c.stage === 'Internal Review' && approvals[c.id] === 'approved') return 'Client Ready';
  return c.stage;
}

// ---- Small fit chip ------------------------------------------
function FitChip({ fit, size = 'sm' }) {
  if (fit == null) {
    return <span className="t-mono-xs" style={{ color: 'var(--ink-4)', border: '1px solid var(--line)', borderRadius: 99, padding: size === 'sm' ? '3px 8px' : '4px 10px', whiteSpace: 'nowrap' }}>NO FIT YET</span>;
  }
  const color = fit >= 85 ? 'var(--navy)' : fit >= 70 ? 'var(--ink-2)' : 'var(--ink-3)';
  const bg = fit >= 85 ? 'rgba(10,31,61,0.06)' : 'var(--paper)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, padding: size === 'sm' ? '3px 8px' : '4px 10px', borderRadius: 99, background: bg, border: `1px solid ${fit >= 85 ? 'rgba(10,31,61,0.25)' : 'var(--line)'}` }}>
      <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 800, fontSize: size === 'sm' ? 14.5 : 16.5, color, letterSpacing: '-0.02em' }}>{fit}</span>
      <span className="t-mono-xs" style={{ color, fontSize: 10 }}>FIT</span>
    </span>
  );
}

function Avatar({ initials, accent = 'var(--ink)', size = 34 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 99, background: accent, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: size * 0.38, flexShrink: 0 }}>{initials}</div>
  );
}

// ============================================================
// CANDIDATE PIPELINE — kanban
// ============================================================
function CandidatePipeline({ onOpen }) {
  const { CANDS, PIPELINE_STAGES, ROLES } = window.SPYGLASS_DATA;
  const { approvals, feedback } = React.useContext(window.FlowContext);

  const byStage = {};
  PIPELINE_STAGES.forEach(s => { byStage[s] = []; });
  CANDS.forEach(c => { byStage[effectiveStage(c, approvals)].push(c); });

  const clientReady = byStage['Client Ready'].length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <p className="t-body" style={{ color: 'var(--ink-2)', margin: 0, maxWidth: '58ch' }}>
          Every candidate sourced against the Matrix, moving left to right. Fit is scored on the look-fors and qualifying questions — not just the résumé. Cards with a dossier are clickable.
        </p>
        <span className="t-mono-xs" style={{ color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{CANDS.length} SOURCED · {clientReady} CLIENT-READY</span>
      </div>

      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 14, margin: '0 -4px', padding: '4px' }}>
        {PIPELINE_STAGES.map(stage => {
          const isReady = stage === 'Client Ready';
          const isReview = stage === 'Internal Review';
          const accent = isReady ? 'var(--navy)' : isReview ? 'var(--amber-dd)' : 'var(--ink-3)';
          return (
            <div key={stage} style={{ width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                <span className="t-mono-xs" style={{ color: accent, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: accent }}></span>{stage}
                </span>
                <span className="t-mono-xs" style={{ color: 'var(--ink-4)' }}>{byStage[stage].length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 80, padding: 10, borderRadius: 'var(--r-5)', background: isReady ? 'rgba(10,31,61,0.03)' : isReview ? 'var(--amber-bg)' : 'var(--paper)', border: `1px solid ${isReady ? 'rgba(10,31,61,0.12)' : isReview ? '#fde68a' : 'var(--line)'}` }}>
                {byStage[stage].length === 0 && (
                  <div className="t-mono-xs" style={{ color: 'var(--ink-4)', textAlign: 'center', padding: '20px 0' }}>EMPTY</div>
                )}
                {byStage[stage].map(c => (
                  <PipelineCard key={c.id} c={c} onOpen={onOpen} approvals={approvals} feedback={feedback} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipelineCard({ c, onOpen, approvals, feedback }) {
  const [hover, setHover] = React.useState(false);
  const hasDossier = !!c.dossier;
  const fb = feedback[c.id];
  const fbMeta = { advance: { t: 'Client advanced', tone: 'live' }, hold: { t: 'Client holding', tone: 'amber' }, pass: { t: 'Client passed', tone: 'pipeline' } }[fb && fb.decision];
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={hasDossier ? () => onOpen(c.id) : undefined}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-4)', padding: 13,
        boxShadow: hover && hasDossier ? 'var(--sh-hover)' : '0 1px 2px rgba(0,0,0,0.04)',
        transform: hover && hasDossier ? 'translateY(-2px)' : 'none', transition: 'all .2s var(--ease)',
        cursor: hasDossier ? 'pointer' : 'default' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <Avatar initials={c.initials} size={32} accent={c.fit != null && c.fit >= 85 ? 'var(--navy)' : 'var(--ink)'} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: 16.5, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{c.name}</div>
          <div className="t-body" style={{ color: 'var(--ink-3)', fontSize: 13.5, marginTop: 2 }}>{c.role} · {c.years} yrs</div>
        </div>
      </div>
      <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: 'var(--ink-2)', marginBottom: 10, lineHeight: 1.4 }}>{c.company}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <FitChip fit={c.fit} />
        {c.stage === 'Internal Review' && approvals[c.id] !== 'approved' && (
          <span className="t-mono-xs" style={{ color: 'var(--amber-dd)' }}>⏳ AWAITING SIGN-OFF</span>
        )}
        {fbMeta ? <Tag tone={fbMeta.tone}>{fbMeta.t}</Tag>
          : hasDossier && <span className="t-mono-xs" style={{ color: hover ? 'var(--ink)' : 'var(--ink-4)', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color .2s' }}>DOSSIER <Arrow s={11} /></span>}
      </div>
    </div>
  );
}

// ============================================================
// INTERNAL REVIEW — the manager's approval gate
// ============================================================
function InternalReview({ onOpen }) {
  const { CANDS, ROLES } = window.SPYGLASS_DATA;
  const { approvals, role } = React.useContext(window.FlowContext);
  const isManager = role === 'manager';

  // Anyone with a dossier sits in the review/released set.
  const reviewable = CANDS.filter(c => c.dossier && (c.stage === 'Internal Review' || c.stage === 'Client Ready'));
  const pending = reviewable.filter(c => approvals[c.id] !== 'approved');
  const released = reviewable.filter(c => approvals[c.id] === 'approved');

  return (
    <div>
      {/* Manager banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', borderRadius: 'var(--r-5)', background: isManager ? 'rgba(10,31,61,0.05)' : 'var(--paper)', border: `1px solid ${isManager ? 'rgba(10,31,61,0.18)' : 'var(--line)'}`, marginBottom: 26 }}>
        <Mark variant={isManager ? 'amber' : 'primary'} size={30} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: 17.5 }}>{isManager ? 'Your sign-off gate' : 'Manager sign-off gate'}</div>
          <div className="t-body" style={{ color: 'var(--ink-2)', fontSize: 15 }}>
            Nothing reaches the client until a manager approves the dossier. {isManager ? 'Review the pending dossier below and release it to Meridian.' : 'Switch to the Manager view to approve pending dossiers.'}
          </div>
        </div>
        {!isManager && <span className="t-mono-xs" style={{ color: 'var(--ink-3)' }}>VIEW AS · MANAGER →</span>}
      </div>

      {/* Pending */}
      <div className="t-mono-xs" style={{ color: 'var(--amber-dd)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--navy)' }}></span>AWAITING APPROVAL · {pending.length}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
        {pending.length === 0 && <EmptyTab label="No dossiers awaiting sign-off. Every candidate has been released to the client." />}
        {pending.map(c => <ReviewRow key={c.id} c={c} onOpen={onOpen} isManager={isManager} />)}
      </div>

      {/* Released */}
      {released.length > 0 && (
        <>
          <div className="t-mono-xs" style={{ color: 'var(--green-d)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--green)' }}></span>RELEASED TO CLIENT · {released.length}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {released.map(c => <ReviewRow key={c.id} c={c} onOpen={onOpen} isManager={isManager} released />)}
          </div>
        </>
      )}
    </div>
  );
}

function ReviewRow({ c, onOpen, isManager, released }) {
  const { approve } = React.useContext(window.FlowContext);
  const [hover, setHover] = React.useState(false);
  const strongSignals = c.dossier.signals.filter(s => s.score === 'strong').length;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 20, padding: '20px 24px',
      background: 'var(--bg-card)', border: `1px solid ${released ? 'rgba(10,31,61,0.3)' : 'var(--line)'}`, borderRadius: 'var(--r-5)', boxShadow: 'var(--sh-card)' }}>
      <Avatar initials={c.initials} size={46} accent={released ? 'var(--navy)' : 'var(--ink)'} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: 19.5, letterSpacing: '-0.02em' }}>{c.name}</span>
          <FitChip fit={c.fit} />
        </div>
        <div className="t-body" style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 8 }}>{c.dossier.headline}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="t-mono-xs" style={{ color: 'var(--ink-3)' }}>{strongSignals}/4 SIGNALS STRONG</span>
          <span style={{ color: 'var(--ink-4)' }}>·</span>
          <span className="t-mono-xs" style={{ color: 'var(--ink-3)' }}>{c.company}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <MonoButton onClick={() => onOpen(c.id)}>Review dossier</MonoButton>
        {released ? (
          <span className="t-mono-xs" style={{ color: 'var(--green-d)', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px' }}>✓ RELEASED</span>
        ) : isManager ? (
          <Button kind="amber" onClick={() => approve(c.id)}>Approve & release</Button>
        ) : (
          <Button kind="secondary" disabled>Manager only</Button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { CandidatePipeline, PipelineCard, InternalReview, ReviewRow, FitChip, Avatar, effectiveStage });
