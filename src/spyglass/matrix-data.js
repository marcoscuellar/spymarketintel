/* The live Spyglass matrix — Senior Tax Manager · Meridian Wealth Advisors.
   Mirrors the structured matrix authored in the project data, serialized to the
   text the dossier's Generate flow scores a candidate against.

   NOTE: the confidential intake notes (comp hold-backs, the unannounced
   manager departure) are deliberately excluded — generation output is
   client-facing, so only the JD, the look-for signals, and the qualifying
   questions are fed in. */
export const MATRIX = {
  role: "Senior Tax Manager",
  client: "Meridian Wealth Advisors",
  statedNeed:
    "Lead the private-client tax practice — own complex returns for the firm's ultra-high-net-worth households and mentor a small associate team.",
  softSkills: [
    { label: "Client-facing polish", note: "Sits across from UHNW families. Must read a room, not just a return." },
    { label: "Mentor, not just doer", note: "Three junior associates need shaping. The hire grows the bench." },
    { label: "Calm in busy season", note: "April is brutal here. They want steady, not heroics." },
  ],
  jd: {
    summary:
      "Meridian Wealth Advisors is seeking a Senior Tax Manager to lead tax strategy and compliance for our private-client practice. You will own the most complex engagements, review the work of junior staff, and partner directly with clients and advisors.",
    summary2:
      "This is a senior, client-facing seat on a tight-knit private-client team. You will set the standard for technical quality, carry the firm's most sensitive ultra-high-net-worth households, and build the bench beneath you as the practice grows through busy season and beyond.",
    mustHave: [
      "CPA required; 8+ years in public accounting or private client tax.",
      "Deep experience with HNW / UHNW individual and trust taxation.",
      "Demonstrated team leadership or mentoring experience.",
      "Multi-state return experience.",
    ],
    niceToHave: [
      "Exposure to family-office or estate-planning structures.",
      "Experience with partnership K-1s and pass-through entities.",
      "Background in a fee-based wealth advisory environment.",
      "Active in a professional network (AICPA, state society).",
    ],
  },
  // The scorecard: each look-for is a weighted evaluation criterion.
  lookFor: [
    { signal: "Owned complexity", detail: "Personally owned UHNW / multi-state returns — not just supervised." },
    { signal: "Real mentoring", detail: "Concrete examples of growing junior staff, not just \"managed a team.\"" },
    { signal: "Stability", detail: "No pattern of < 2-year stints. Their retention problem makes this non-negotiable." },
    { signal: "Composure", detail: "Evidence of staying measured under deadline pressure and difficult clients." },
  ],
  questions: [
    { q: "Walk me through the most complex return you have personally owned end-to-end.", surfaces: "Depth of hands-on complexity" },
    { q: "Tell me about a junior associate you developed. Where are they now?", surfaces: "Genuine mentoring vs. delegation" },
    { q: "Describe a busy season that went sideways. What did you do?", surfaces: "Composure under pressure" },
    { q: "A client disputes your tax position in a meeting. Walk me through it.", surfaces: "Client-facing judgment" },
    { q: "What does your ideal next role look like for the next five years?", surfaces: "Stability & intent" },
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
