/* Shared workspace store for the Spyglass portal.
 *
 * Everything the portal "remembers" (the dossiers + per-candidate notes and
 * decisions, the matrix, and the intel edits) is kept here on the server as a
 * single JSON document, so it survives refreshes AND is visible to anyone you
 * send the link to — instead of living only in one browser.
 *
 * Backed by Vercel KV (Upstash Redis) over its REST API. No SDK needed — we
 * just call the REST endpoint with the env vars Vercel injects when you connect
 * a KV store to the project:
 *   KV_REST_API_URL, KV_REST_API_TOKEN
 *
 * If KV isn't connected yet, the route stays healthy and simply reports
 * configured:false — the app keeps working locally (browser-only) until you
 * connect a store and redeploy, at which point saving turns on automatically.
 */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const WORKSPACE_KEY = "spg:workspace:procare";

const configured = () => !!(KV_URL && KV_TOKEN);

// Run a single Redis command via the Upstash REST API, e.g. ["GET", key].
async function kv(command) {
  const r = await fetch(KV_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!r.ok) throw new Error(`KV ${r.status}`);
  return (await r.json()).result;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (!configured()) {
      res.status(200).json({ configured: false, data: {} });
      return;
    }
    try {
      const raw = await kv(["GET", WORKSPACE_KEY]);
      res.status(200).json({ configured: true, data: raw ? JSON.parse(raw) : {} });
    } catch (e) {
      // Never hard-fail a read — fall back to "nothing saved yet".
      res.status(200).json({ configured: false, data: {}, error: e?.message });
    }
    return;
  }

  if (req.method === "POST") {
    if (!configured()) {
      res.status(200).json({ ok: false, configured: false });
      return;
    }
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const map = body && typeof body === "object" ? body : {};
      await kv(["SET", WORKSPACE_KEY, JSON.stringify(map)]);
      res.status(200).json({ ok: true, configured: true });
    } catch (e) {
      res.status(500).json({ ok: false, error: e?.message || "Save failed." });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
