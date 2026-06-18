/* ============================================================
   Spyglass · Project Matrix — app root
   Role switcher · FlowContext (shared state across personas) ·
   routing between the recruiter app and the client portal.
   ============================================================ */

const FlowContext = React.createContext(null);
window.FlowContext = FlowContext;

function App() {
  const { ENGAGEMENTS, CANDS } = window.SPYGLASS_DATA;
  const meridian = ENGAGEMENTS.find(e => e.id === 'mer-stm');

  const [role, setRole] = React.useState('recruiter');

  // Recruiter / manager navigation
  const [view, setView] = React.useState({ name: 'pipeline', engagement: null });
  // Client navigation
  const [clientView, setClientView] = React.useState({ name: 'portal', candId: null });

  // ---- Shared, cross-persona state ----------------------------
  // Approvals: candidate id -> 'approved' | 'pending'. Marguerite starts pending.
  const [approvals, setApprovals] = React.useState(
    () => Object.fromEntries(CANDS.filter(c => c.approval).map(c => [c.id, c.approval]))
  );
  // Client feedback: candidate id -> { decision: 'advance'|'pass'|'hold', note }
  const [feedback, setFeedback] = React.useState({});
  // Placement: candidate id that received an offer / was placed
  const [placed, setPlaced] = React.useState(null);

  const approve = (id) => setApprovals(a => ({ ...a, [id]: 'approved' }));
  const giveFeedback = (id, decision, note) => setFeedback(f => ({ ...f, [id]: { decision, note } }));
  const place = (id) => setPlaced(id);

  const open = (e) => { setView({ name: 'engagement', engagement: e }); window.scrollTo(0, 0); };
  const home = () => { setView({ name: 'pipeline', engagement: null }); window.scrollTo(0, 0); };

  const switchRole = (r) => {
    setRole(r);
    if (r === 'client') { setClientView({ name: 'portal', candId: null }); }
    else if (r === 'manager') { setView({ name: 'engagement', engagement: meridian }); }
    else { setView({ name: 'pipeline', engagement: null }); }
    window.scrollTo(0, 0);
  };

  const ctx = {
    role, switchRole, meridian,
    approvals, approve,
    feedback, giveFeedback,
    placed, place,
    clientView, setClientView,
    openEngagement: open, goHome: home,
  };

  return (
    <FlowContext.Provider value={ctx}>
      <div style={{ minHeight: '100vh', background: role === 'client' ? 'var(--paper)' : 'var(--bg)', transition: 'background .3s var(--ease)' }}>
        <TopBar onHome={home} />
        {role === 'client'
          ? <ClientApp />
          : (view.name === 'pipeline'
              ? <Pipeline onOpen={open} />
              : <Workspace engagement={view.engagement} onBack={home} />)}
      </div>
    </FlowContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
