import Anthropic from "@anthropic-ai/sdk";

/* JSON shape the dossier UI renders. Structured outputs guarantees the model
   returns exactly this — no brittle parsing. */
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidate: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", description: "Candidate full name" },
        current: { type: "string", description: "Current role — ex-company, e.g. 'Sr. Full-Stack Engineer — ex-Nubank'" },
        salary: { type: "string", description: "Comp target, e.g. '$85K–$95K target'" },
        location: { type: "string", description: "Location and time zone, e.g. 'São Paulo, BR · UTC−3'" },
        pitch: { type: "string", description: "One-line summary of the candidate" },
        compliance: { type: "string", description: "Compliance status, e.g. 'Background + references verified'" },
      },
      required: ["name", "current", "salary", "location", "pitch", "compliance"],
    },
    criteria: {
      type: "array",
      description: "The weighted scorecard. Use the criteria and weights defined in the Matrix; weights should sum to ~100.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          weight: { type: "integer", description: "Weight 0–100; all weights sum to ~100" },
          src: { type: "string", enum: ["matrix", "live"], description: "'matrix' = derived from the strategy/docs; 'live' = interview-scored" },
          v: { type: "integer", description: "Score 0–100 for this candidate on this criterion" },
          meaning: { type: "string", description: "One plain-language sentence: what this score means for this candidate, grounded in the notes/résumé" },
        },
        required: ["name", "weight", "src", "v", "meaning"],
      },
    },
    why: {
      type: "array",
      description: "3–4 paragraphs: the written read on why the candidate fits, including one honest watch-out.",
      items: { type: "string" },
    },
    resume: {
      type: "array",
      description: "Structured résumé, most recent first.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: { type: "string" },
          company: { type: "string", description: "Company · location" },
          dates: { type: "string", description: "e.g. '2021 — Present'" },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["role", "company", "dates", "bullets"],
      },
    },
    education: { type: "string" },
    certifications: { type: "array", items: { type: "string" } },
    references: {
      type: "array",
      description: "Verified references found in the notes; empty array if none.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          role: { type: "string" },
          status: { type: "string", description: "e.g. 'Spoke 6/16'" },
          quote: { type: "string" },
        },
        required: ["name", "role", "status", "quote"],
      },
    },
  },
  required: ["candidate", "criteria", "why", "resume", "education", "certifications", "references"],
};

const SYSTEM = `You are a senior recruiting analyst at Spyglass Partners building a candidate dossier that a client will read and act on.

You are given three inputs: the MATRIX (the search strategy and scorecard — it defines the evaluation criteria and their weights), the candidate NOTES (interview notes, screen context), and the RÉSUMÉ.

Produce a complete, client-ready dossier:
- Score each scorecard criterion 0–100 for this candidate, grounded only in what the inputs support. Use the criteria and weights from the Matrix (weights sum to ~100). Mark each criterion 'matrix' (derived from documents) or 'live' (interview-scored).
- Write the "why they fit" read as 3–4 tight paragraphs, including one honest watch-out — do not oversell.
- Structure the résumé into roles with bullet points, plus education and certifications.
- Include only references actually present in the notes; otherwise return an empty references array.

Be specific and evidence-based. Do not invent facts not supported by the inputs. Keep the voice direct and professional.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on the server. Add it in the environment and redeploy." });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const matrix = (body.matrix || "").trim();
  const notes = (body.notes || "").trim();
  const resume = (body.resume || "").trim();
  if (!matrix && !notes && !resume) {
    res.status(400).json({ error: "Provide at least one of: matrix, notes, résumé." });
    return;
  }

  const userContent = [
    "=== MATRIX (search strategy + scorecard) ===",
    matrix || "(none provided)",
    "",
    "=== CANDIDATE NOTES ===",
    notes || "(none provided)",
    "",
    "=== RÉSUMÉ ===",
    resume || "(none provided)",
  ].join("\n");

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM,
      messages: [{ role: "user", content: userContent }],
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
    });

    if (message.stop_reason === "refusal") {
      res.status(422).json({ error: "The request was declined. Adjust the inputs and try again." });
      return;
    }

    const textBlock = message.content.find((b) => b.type === "text" && b.text);
    if (!textBlock) {
      res.status(502).json({ error: "No content returned from the model." });
      return;
    }
    res.status(200).json(JSON.parse(textBlock.text));
  } catch (e) {
    res.status(500).json({ error: e?.message || "Generation failed." });
  }
}
