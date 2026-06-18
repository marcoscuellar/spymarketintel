/* ============================================================
   Spyglass · Project Matrix — sample data
   Staffing / recruiting workflow content.
   ============================================================ */

// Pipeline of active engagements. Stages: intake | matrix | strategy | screening
const ENGAGEMENTS = [
  {
    id: 'mer-stm',
    client: 'Meridian Wealth Advisors',
    role: 'Senior Tax Manager',
    location: 'Boston, MA · Hybrid',
    comp: '$160–185k',
    am: 'Dana Holt',
    recruiter: 'Priya Raman',
    stage: 'matrix',            // matrix is generated, ready to work
    matrixReady: true,
    opened: 'Jun 6',
    candidates: 4,
    detailed: true,
  },
  {
    id: 'apx-ctl',
    client: 'Apex Industrial Group',
    role: 'Corporate Controller',
    location: 'Cleveland, OH · Onsite',
    comp: '$150–170k',
    am: 'Dana Holt',
    recruiter: 'Marcus Webb',
    stage: 'screening',
    matrixReady: true,
    opened: 'Jun 2',
    candidates: 7,
    detailed: false,
  },
  {
    id: 'nov-lit',
    client: 'Novара Legal',
    role: 'Litigation Paralegal',
    location: 'New York, NY · Hybrid',
    comp: '$85–105k',
    am: 'Theo Marsh',
    recruiter: 'Priya Raman',
    stage: 'strategy',
    matrixReady: true,
    opened: 'Jun 8',
    candidates: 2,
    detailed: false,
  },
  {
    id: 'hel-vpo',
    client: 'Helios Renewables',
    role: 'VP of Operations',
    location: 'Austin, TX · Onsite',
    comp: '$210–240k',
    am: 'Theo Marsh',
    recruiter: 'Marcus Webb',
    stage: 'intake',           // meeting captured, matrix not yet run
    matrixReady: false,
    opened: 'Jun 9',
    candidates: 0,
    detailed: false,
  },
  {
    id: 'cdr-rn',
    client: 'Cedar Park Health',
    role: 'Director of Nursing',
    location: 'Denver, CO · Onsite',
    comp: '$135–155k',
    am: 'Dana Holt',
    recruiter: 'Unassigned',
    stage: 'intake',
    matrixReady: false,
    opened: 'Jun 9',
    candidates: 0,
    detailed: false,
  },
];

// ============================================================
// The fully-detailed engagement: Meridian — Senior Tax Manager
// This is what the Matrix produced from the client meeting.
// ============================================================
const MATRIX = {
  id: 'mer-stm',

  // ---- What the Account Manager captured in the client meeting ----
  intake: {
    meetingDate: 'Jun 6, 2026',
    attendees: ['Dana Holt (Spyglass, AM)', 'Karen Liu (Meridian, Partner)', 'Rob Vance (Meridian, Tax Director)'],
    statedNeed:
      'Lead the private-client tax practice — own complex returns for the firm\u2019s ultra-high-net-worth households and mentor a small associate team.',
    // The soft-skills / above-the-JD layer — the real want
    softSkills: [
      { label: 'Client-facing polish', note: 'Sits across from UHNW families. Must read a room, not just a return.' },
      { label: 'Mentor, not just doer', note: 'Three junior associates need shaping. The hire grows the bench.' },
      { label: 'Calm in busy season', note: 'April is brutal here. They want steady, not heroics.' },
    ],
    // Internal notes — candidates are NOT privy to these
    internalNotes: [
      { tag: 'Confidential', note: 'Current manager is exiting in Q3 — not yet announced internally. Do not reference.' },
      { tag: 'Comp', note: 'Client floated $160k but will move to $185k for the right profile. Hold this back.' },
      { tag: 'Risk', note: 'Lost two hires in 18 months. Culture runs intense. Screen hard for resilience + stability.' },
    ],
  },

  // ---- The Job Description — kept mostly intact, candidate-safe ----
  jd: {
    title: 'Senior Tax Manager',
    summary:
      'Meridian Wealth Advisors is seeking a Senior Tax Manager to lead tax strategy and compliance for our private-client practice. You will own the most complex engagements, review the work of junior staff, and partner directly with clients and advisors.',
    summary2:
      'This is a senior, client-facing seat on a tight-knit private-client team. You will set the standard for technical quality, carry the firm\u2019s most sensitive ultra-high-net-worth households, and build the bench beneath you as the practice grows through busy season and beyond.',
    mustHave: [
      'CPA required; 8+ years in public accounting or private client tax.',
      'Deep experience with HNW / UHNW individual and trust taxation.',
      'Demonstrated team leadership or mentoring experience.',
      'Multi-state return experience.',
    ],
    niceToHave: [
      'Exposure to family-office or estate-planning structures.',
      'Experience with partnership K-1s and pass-through entities.',
      'Background in a fee-based wealth advisory environment.',
      'Active in a professional network (AICPA, state society).',
    ],
  },

  // ---- The Matrix: recruiter strategy ----
  // Each "look-for" is a signal. Each question maps a candidate-safe prompt
  // to an internal "why we ask / what good looks like" note.
  lookFor: [
    { signal: 'Owned complexity', detail: 'Personally owned UHNW / multi-state returns — not just supervised.' },
    { signal: 'Real mentoring', detail: 'Concrete examples of growing junior staff, not just "managed a team."' },
    { signal: 'Stability', detail: 'No pattern of < 2-year stints. Their retention problem makes this non-negotiable.' },
    { signal: 'Composure', detail: 'Evidence of staying measured under deadline pressure and difficult clients.' },
  ],

  questions: [
    {
      q: 'Walk me through the most complex return you have personally owned end-to-end.',
      surfaces: 'Depth of hands-on complexity',
      internal: 'Probe for UHNW + multi-state specifically. If they pivot to "my team handled it," that is a flag.',
    },
    {
      q: 'Tell me about a junior associate you developed. Where are they now?',
      surfaces: 'Genuine mentoring vs. delegation',
      internal: 'Client is buying a bench-builder. Vague answers here = wrong profile.',
    },
    {
      q: 'Describe a busy season that went sideways. What did you do?',
      surfaces: 'Composure under pressure',
      internal: 'Listen for steadiness over heroics. They are tired of burnout culture.',
    },
    {
      q: 'A client disputes your tax position in a meeting. Walk me through it.',
      surfaces: 'Client-facing judgment',
      internal: 'These are UHNW families. Bedside manner matters as much as being right.',
    },
    {
      q: 'What does your ideal next role look like for the next five years?',
      surfaces: 'Stability & intent',
      internal: 'Screening for flight risk. Two failed hires already — we cannot whiff again.',
    },
  ],
};

// ---- Candidates being screened against the Matrix (Screening tab) ----
const CANDIDATES = [
  { name: 'Eleanor Pace',  fit: 91, status: 'Client review', tags: ['UHNW', 'CPA', '11 yrs'], note: 'Strong on complexity + mentoring. Stability checks out.' },
  { name: 'Daniel Okafor', fit: 78, status: 'Screened',      tags: ['Multi-state', 'CPA', '9 yrs'], note: 'Excellent technical. Probing composure in round two.' },
  { name: 'Sara Whitman',  fit: 64, status: 'Screened',      tags: ['Trust tax', '7 yrs'],        note: 'Good but two short stints — flagged for stability.' },
  { name: 'James Reilly',  fit: 0,  status: 'Sourced',       tags: ['CPA', '8 yrs'],              note: 'Outreach sent. Not yet screened.' },
];

// Stages 1–4 are built. 5+ are scaffolded for the continuation of the flow.
const STAGES = [
  { key: 'intake',    label: 'Intake' },
  { key: 'matrix',    label: 'Matrix' },
  { key: 'strategy',  label: 'Strategy' },
  { key: 'screening', label: 'Screening' },
  { key: 'submit',    label: 'Client Submit', upcoming: true },
  { key: 'interview', label: 'Interview', upcoming: true },
  { key: 'offer',     label: 'Offer', upcoming: true },
  { key: 'placed',    label: 'Placed', upcoming: true },
];

window.SPYGLASS_DATA = { ENGAGEMENTS, MATRIX, CANDIDATES, STAGES };
