/* The live Spyglass matrix — VP of Human Resources · Procare HR.
   Mirrors the structured matrix authored for the search, serialized to the text
   the dossier's Generate flow scores a candidate against.

   This is a working draft of the criteria — edit it in the Generate tab's
   matrix field (it's saved and reused for every candidate you add). Any
   confidential intake notes are deliberately kept out: generation output is
   client-facing, so only the JD, the look-for signals, and the qualifying
   questions are fed in. */
export const MATRIX = {
  role: "VP of Human Resources",
  client: "Procare HR",
  statedNeed:
    "Build and lead the people function for a fast-growing senior-care PEO — own HR strategy and multi-state compliance, and partner with leadership to roll out a data-driven workforce scorecard across client accounts.",
  softSkills: [
    { label: "Executive presence", note: "A seat at the leadership table — partners with the founder/CEO on workforce strategy, not just HR admin." },
    { label: "Builder, not caretaker", note: "Procare is scaling. They need someone who stands up HR infrastructure, not someone who maintains a finished one." },
    { label: "Calm under compliance pressure", note: "Senior-care is heavily regulated and multi-state. They want steady judgment, not firefighting." },
  ],
  jd: {
    summary:
      "Procare HR is hiring a VP of Human Resources to lead the people function for a growing senior-care PEO. You will own HR strategy, multi-state compliance, and benefits and payroll operations, and partner directly with leadership.",
    summary2:
      "This is a senior, founder-facing seat. You will set the standard for how Procare hires, pays, and retains caregivers across client accounts — and help roll out a data-driven workforce scorecard on the Clarent platform as the business scales.",
    mustHave: [
      "10+ years in HR, with 3+ at Director or VP level.",
      "PEO, staffing, or multi-employer / co-employment experience.",
      "Deep multi-state employment law and compliance knowledge.",
      "Track record building or scaling an HR function.",
    ],
    niceToHave: [
      "Senior-care, healthcare, or home-care industry background.",
      "Experience with HRIS / people-analytics platforms (Clarent-style data).",
      "SHRM-SCP or SPHR certification.",
      "Benefits and payroll operations at scale.",
    ],
  },
  // The scorecard: each look-for is a weighted evaluation criterion.
  lookFor: [
    { signal: "People-function builder", detail: "Stood up or scaled HR infrastructure end to end — not just administered an existing one." },
    { signal: "Compliance depth", detail: "Owns multi-state employment law, wage & hour, and the regulatory load of a senior-care PEO." },
    { signal: "Data-driven HR", detail: "Runs the people function on metrics — fits the Clarent platform and the AI workforce scorecard." },
    { signal: "Executive partnership", detail: "Operates as a strategic peer to the founder/CEO, owning hard people calls — not an HR administrator." },
  ],
  questions: [
    { q: "Walk me through an HR function you built or scaled from the ground up.", surfaces: "Builder vs. caretaker" },
    { q: "How have you managed multi-state compliance in a highly regulated industry?", surfaces: "Compliance depth" },
    { q: "Tell me about a workforce decision you drove with data.", surfaces: "Data-driven HR" },
    { q: "Describe partnering with a founder or CEO on a hard people call.", surfaces: "Executive partnership" },
    { q: "How do you keep teams steady through rapid growth and change?", surfaces: "Stability under pressure" },
  ],
};

export const MATRIX_LABEL = `${MATRIX.role} · ${MATRIX.client}`;

/* Flatten the structured matrix into the plain text the Generate endpoint reads. */
export function matrixToText(M = MATRIX) {
  const L = [];
  L.push(`ROLE: ${M.role}`);
  L.push(`CLIENT: ${M.client}`);
  L.push("", `STATED NEED: ${M.statedNeed}`, "");
  L.push("WHAT THE CLIENT REALLY WANTS (soft-skill signals):");
  M.softSkills.forEach((s) => L.push(`- ${s.label}: ${s.note}`));
  L.push("", "JOB DESCRIPTION:", M.jd.summary, M.jd.summary2, "");
  L.push("MUST HAVE:");
  M.jd.mustHave.forEach((x) => L.push(`- ${x}`));
  L.push("", "NICE TO HAVE:");
  M.jd.niceToHave.forEach((x) => L.push(`- ${x}`));
  L.push("", "SCORECARD — what to look for (use these as the weighted evaluation criteria, weights summing to ~100):");
  M.lookFor.forEach((l) => L.push(`- ${l.signal}: ${l.detail}`));
  L.push("", "QUALIFYING QUESTIONS (and what each surfaces):");
  M.questions.forEach((q, i) => L.push(`Q${i + 1}. ${q.q}  [surfaces: ${q.surfaces}]`));
  return L.join("\n");
}
