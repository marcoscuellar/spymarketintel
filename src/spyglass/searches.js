/* ── Single source of truth for the Procare HR portal ──
   One client (Procare HR). Many searches. Each search owns its candidate
   roster; each candidate owns its full dossier. The drill-down reads from
   here: Client Home lists SEARCHES → a Search Room renders one search →
   a Dossier renders one candidate.

   Delivery-footprint constraint: Spyglass staffs nearshore ONLY from
   Costa Rica, México, and Guatemala (all UTC−6). Every location below
   honors that. */

export const CLIENT = {
  name: "Procare HR",
  // Company-level market-intel facts shown on Client Home.
  facts: [
    { n: "May 2024", l: "Acquired Clarent platform" },
    { n: "36", l: "States served · senior care" },
    { n: "25,000+", l: "Client employees managed" },
    { n: "~62", l: "Internal employees · lean team" },
  ],
};

/* Standard scorecard for the VP of HR search — the criteria the matrix asks
   for, weights summing to 100. Per-candidate scores (v) + meanings vary. */
const vpHrCriteria = (scores, meanings) => [
  { name: "People-function builder", weight: 20, src: "matrix", v: scores[0], meaning: meanings[0] },
  { name: "Compliance depth", weight: 18, src: "matrix", v: scores[1], meaning: meanings[1] },
  { name: "PEO / co-employment", weight: 14, src: "matrix", v: scores[2], meaning: meanings[2] },
  { name: "Data-driven HR", weight: 14, src: "matrix", v: scores[3], meaning: meanings[3] },
  { name: "Executive partnership", weight: 12, src: "live", v: scores[4], meaning: meanings[4] },
  { name: "Mentoring & team leadership", weight: 10, src: "live", v: scores[5], meaning: meanings[5] },
  { name: "Stability", weight: 7, src: "live", v: scores[6], meaning: meanings[6] },
  { name: "Comp alignment", weight: 5, src: "matrix", v: scores[7], meaning: meanings[7] },
];

const VP_HR_CANDIDATES = [
  {
    id: "lucia-morales", name: "Lucía Morales", initials: "LM",
    role: "Sr. HR Director", company: "ex-Cariloha Health BPO", years: 12,
    location: "San José, CR · UTC−6", askMid: 98, fit: 93, status: "new", lead: true,
    blurb: "Built HR + multi-state compliance for a healthcare BPO end to end.",
    tags: ["PEO", "Multi-state", "Compliance"],
    why: [
      "Stood up the entire people function for a multi-state healthcare BPO — the closest analog on the slate to what Procare needs.",
      "Owns multi-state employment law and wage & hour cold; she ran compliance for operations across 20+ states.",
      "Sat at the leadership table as a strategic partner to the founder — not an HR administrator.",
    ],
    dossier: {
      candidate: {
        name: "Lucía Morales",
        current: "Sr. HR Director — ex-Cariloha Health BPO",
        salary: "$90K–$105K target",
        location: "San José, CR · UTC−6",
        pitch: "Stood up HR + multi-state compliance for a senior-care–adjacent BPO.",
        compliance: "Background + references verified",
      },
      criteria: vpHrCriteria(
        [96, 94, 90, 82, 92, 90, 90, 95],
        [
          "Built a people function from the ground up at a multi-state BPO — hiring, benefits, policy, and compliance — exactly the build Procare needs.",
          "Ran wage & hour and multi-state employment law for operations across 20+ states; the regulatory load of a senior-care PEO is familiar ground.",
          "Led co-employment-style HR for a BPO serving many client sites — close to the PEO model, though not a pure PEO.",
          "Comfortable running HR on metrics; drove retention dashboards, but the AI-scorecard depth is where Rodrigo edges her.",
          "Interview-scored. Operated as a true partner to the founder/CEO on workforce strategy — owns hard people calls.",
          "Interview-scored. Grew a team of HR business partners; concrete examples of promoting from within.",
          "Interview-scored. 6-year tenure at her last role — no flight-risk pattern.",
          "Her ask lands inside the nearshore band — well under a US VP of HR.",
        ]
      ),
      why: [
        "Lucía is a builder. At Cariloha she stood up the people function for a multi-state healthcare BPO — hiring, benefits, policy, and the compliance backbone — which is the closest analog on this slate to what Procare must build as it scales the senior-care book.",
        "Her depth is compliance. She owns multi-state employment law and wage & hour, and ran it for operations spread across 20+ states. For a senior-care PEO carrying that regulatory load on behalf of clients, that is the core skill, not a nice-to-have.",
        "The honest watch-out is data: she is metrics-comfortable but the AI workforce-scorecard work may lean on a more analytics-native partner. She works from San José (UTC−6) with full US-hours overlap, and her ask sits comfortably inside the nearshore band.",
      ],
      resume: [
        { role: "Sr. HR Director", company: "Cariloha Health BPO · San José, CR", dates: "2018 — Present", bullets: ["Built the people function end to end across 20+ states of operations.", "Owned multi-state compliance, wage & hour, and benefits administration.", "Partnered with the founder on workforce strategy and headcount planning."] },
        { role: "HR Manager", company: "Establishment Labs · San José, CR", dates: "2013 — 2018", bullets: ["Scaled HR for a fast-growing medical-device manufacturer.", "Led the move to a unified HRIS and self-service benefits."] },
      ],
      education: "Lic., Psychology (Industrial/Organizational) — Universidad de Costa Rica",
      certifications: ["SHRM-SCP", "Multi-state employment law (HRCI)"],
      references: [
        { name: "Carlos Jiménez", role: "Founder/CEO, Cariloha Health BPO", status: "Spoke 6/17", quote: "Lucía built our HR function from nothing and kept us out of compliance trouble across every state we entered. She thinks like an owner." },
      ],
    },
  },
  {
    id: "daniela-castro", name: "Daniela Castro", initials: "DC",
    role: "Head of People", company: "ex-Solvo PEO", years: 10,
    location: "Guatemala City, GT · UTC−6", askMid: 88, fit: 88, status: "new",
    blurb: "PEO-native — ran co-employment HR and benefits at scale.",
    tags: ["PEO", "Benefits", "Payroll"],
    why: [
      "Pure-play PEO experience: ran co-employment HR, benefits, and payroll for thousands of worksite employees.",
      "Knows the senior-care client base — Solvo served home-care and assisted-living operators.",
      "Operationally excellent on benefits and payroll, the day-to-day of a PEO people function.",
    ],
    dossier: {
      candidate: {
        name: "Daniela Castro",
        current: "Head of People — ex-Solvo PEO",
        salary: "$80K–$95K target",
        location: "Guatemala City, GT · UTC−6",
        pitch: "PEO-native people leader — co-employment, benefits, and payroll at scale.",
        compliance: "Background + references verified",
      },
      criteria: vpHrCriteria(
        [84, 88, 96, 80, 82, 84, 86, 95],
        [
          "Scaled an existing PEO people function rather than founding one — strong operator, slightly less greenfield-builder than Lucía.",
          "Solid multi-state compliance grounding from PEO work; lived the wage & hour and ACA reporting load daily.",
          "The strongest PEO fit on the slate — ran true co-employment HR for thousands of worksite employees.",
          "Ran benefits and retention reporting; pragmatic with data, lighter on predictive/AI analytics.",
          "Interview-scored. Reported to the COO and partnered with client executives — credible at the table.",
          "Interview-scored. Managed a 9-person people team across HR, benefits, and payroll.",
          "Interview-scored. Two roles in 10 years — stable.",
          "Ask sits in the middle of the nearshore band.",
        ]
      ),
      why: [
        "Daniela is the purest PEO fit on the slate. At Solvo she ran co-employment HR, benefits, and payroll for thousands of worksite employees — the exact operating model Procare runs for its senior-care clients.",
        "Her grounding in benefits, payroll, and ACA/wage-and-hour reporting is the day-to-day spine of a PEO people function. She has lived the multi-state compliance load, not just studied it.",
        "The watch-out is that she scaled an existing function more than she built one from scratch, and her analytics are operational rather than predictive. She works from Guatemala City (UTC−6) with full US overlap.",
      ],
      resume: [
        { role: "Head of People", company: "Solvo PEO · Guatemala City, GT", dates: "2017 — Present", bullets: ["Ran co-employment HR, benefits, and payroll for 4,000+ worksite employees.", "Owned ACA reporting, multi-state wage & hour, and benefits renewals.", "Led a 9-person people, benefits, and payroll team."] },
        { role: "HR Business Partner", company: "Tigo Guatemala", dates: "2014 — 2017", bullets: ["Supported HR for a large telecom workforce.", "Drove a manager-training and retention program."] },
      ],
      education: "Lic., Business Administration — Universidad Rafael Landívar",
      certifications: ["SHRM-CP", "ACA / benefits compliance"],
      references: [
        { name: "Ana Beltrán", role: "COO, Solvo PEO", status: "Spoke 6/16", quote: "Daniela ran our worksite HR like clockwork — benefits, payroll, compliance, all of it. Clients trusted her with their people." },
      ],
    },
  },
  {
    id: "rodrigo-salas", name: "Rodrigo Salas", initials: "RS",
    role: "Director, People Analytics", company: "ex-Runa HR", years: 9,
    location: "Guadalajara, MX · UTC−6", askMid: 82, fit: 84, status: "new",
    blurb: "Data-driven HR leader — built workforce analytics at an HR-tech.",
    tags: ["People analytics", "HR tech", "Retention"],
    why: [
      "Built workforce analytics and a retention scorecard at an HR-tech company — the closest fit to Procare's Clarent + AI bet.",
      "Bridges people and product: comfortable working with engineers on the data platform.",
      "Earlier in his leadership arc — would grow into the full VP scope.",
    ],
    dossier: {
      candidate: {
        name: "Rodrigo Salas",
        current: "Director, People Analytics — ex-Runa HR",
        salary: "$74K–$88K target",
        location: "Guadalajara, MX · UTC−6",
        pitch: "Data-driven HR leader — built workforce analytics and a retention scorecard.",
        compliance: "Background + references verified",
      },
      criteria: vpHrCriteria(
        [80, 78, 76, 96, 80, 78, 82, 96],
        [
          "Built people-ops infrastructure and analytics, though more on the data side than full HR generalist operations.",
          "Competent on compliance but it is not his center of gravity — would pair with strong HR-ops support.",
          "Worked alongside PEO/payroll products at Runa; understands co-employment, less hands-on operating it.",
          "The strongest data-driven-HR fit on the slate — built a workforce retention scorecard, exactly the Clarent + AI vision.",
          "Interview-scored. Advised executives with data; growing into owning the people strategy himself.",
          "Interview-scored. Led a small analytics pod; less experience managing a broad HR team.",
          "Interview-scored. Steady tenure; no job-hopping.",
          "Lowest ask on the slate with real upside — strong value.",
        ]
      ),
      why: [
        "Rodrigo is the data-native option. At Runa HR he built workforce analytics and a retention scorecard — the closest thing on this slate to the AI workforce scorecard Procare is building on the Clarent platform.",
        "He bridges people and product: he is comfortable sitting with engineers, defining metrics, and turning HR questions into something the data platform can answer. That is rare in an HR leader and directly relevant here.",
        "The honest watch-out is breadth: he is earlier in his leadership arc and lighter on full HR-generalist operations and compliance, so he would want strong HR-ops support beneath him. He works from Guadalajara (UTC−6) and has the lowest ask on the slate.",
      ],
      resume: [
        { role: "Director, People Analytics", company: "Runa HR · Guadalajara, MX", dates: "2019 — Present", bullets: ["Built the workforce-analytics function and a retention scorecard used by leadership.", "Partnered with engineering on the people-data platform and reporting.", "Defined the metrics behind hiring, retention, and engagement decisions."] },
        { role: "People Operations Lead", company: "Wizeline · Guadalajara, MX", dates: "2015 — 2019", bullets: ["Ran people ops for a fast-scaling software services firm.", "Stood up HRIS reporting and headcount planning."] },
      ],
      education: "B.S., Industrial Engineering — ITESM (Guadalajara)",
      certifications: ["People Analytics (Wharton/Coursera)", "SHRM-CP"],
      references: [
        { name: "Mariana Ruiz", role: "VP People, Runa HR", status: "Spoke 6/15", quote: "Rodrigo turned our people data into decisions leadership actually trusted. He's the rare HR leader who can hold his own with engineers." },
      ],
    },
  },
];

export const SEARCHES = [
  {
    id: "vp-hr",
    role: "VP of Human Resources", dept: "People & Compliance", loc: "Nearshore · UTC−6",
    stageIdx: 3, group: "decide", status: "awaiting", awaiting: 3, room: true,
    lead: { name: "Lucía Morales", fit: 93 }, presented: 3,
    eyebrow: "Executive Search · People Function",
    h1: ["VP of Human", "Resources"],
    lede: "Procare HR — a senior-care PEO scaling across 36 states. A nearshore VP of HR to own the people function, multi-state compliance, and the rollout of the workforce scorecard.",
    context: "Procare HR runs the entire people function — payroll, benefits, HR, and compliance — for senior-care operators across 36 states, 25,000+ employees under management. As it scales and builds the Clarent + AI workforce scorecard, it needs a VP of HR to own people strategy and the regulatory load, partner with the founder, and build the bench. The nearshore band lands well under a US VP of HR while giving full US-hours overlap.",
    facts: [
      { n: "36", l: "States · compliance load" },
      { n: "25,000+", l: "Employees under management" },
      { n: "3", l: "Presented to you" },
      { n: "UTC−6", l: "Full US-hours overlap" },
    ],
    candidates: VP_HR_CANDIDATES,
  },
  // Other open searches for the same client — summary rows on Client Home.
  { id: "people-ops-mgr", role: "People Operations Manager", dept: "People & Compliance", loc: "Nearshore · UTC−6", stageIdx: 2, group: "progress", status: "progress", metric: "7 screened", room: false, candidates: [] },
  { id: "benefits-lead", role: "Benefits & Payroll Lead", dept: "People & Compliance", loc: "Nearshore · UTC−6", stageIdx: 1, group: "progress", status: "progress", metric: "Sourcing", room: false, candidates: [] },
  { id: "data-eng", role: "Sr. Data Engineer", dept: "Clarent platform", loc: "Nearshore · UTC−6", stageIdx: 4, group: "progress", status: "offer", awaiting: 1, metric: "Offer out", room: false, candidates: [] },
  { id: "hris-analyst", role: "HRIS Analyst", dept: "Clarent platform", loc: "Nearshore · UTC−6", stageIdx: 5, group: "closed", status: "placed", metric: "Placed", room: false, candidates: [] },
  { id: "recruiter", role: "Technical Recruiter", dept: "People & Compliance", loc: "Nearshore · UTC−6", stageIdx: 1, group: "closed", status: "hold", metric: "Paused by client", room: false, candidates: [] },
];

export function getSearch(id) {
  return SEARCHES.find((s) => s.id === id) || null;
}
export function firstRoomSearch() {
  return SEARCHES.find((s) => s.room) || SEARCHES[0];
}
export function getCandidate(searchId, candidateId) {
  const s = getSearch(searchId);
  if (!s) return null;
  return (s.candidates || []).find((c) => c.id === candidateId) || null;
}
