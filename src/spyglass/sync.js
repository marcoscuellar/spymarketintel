/* Server sync for the portal's saved state.
 *
 * The app already stores everything in localStorage (the dossiers + notes +
 * decisions, the matrix, the intel edits). On its own that only lives in one
 * browser. This module mirrors those keys to /api/state so the data is saved
 * on the server and shows up for anyone you send the link to.
 *
 * How it works, with zero changes to the components:
 *  - hydrate() runs once at boot, BEFORE React renders, and pulls the saved
 *    state from the server into localStorage. So first paint already shows
 *    whatever was last saved (by you or your client).
 *  - We wrap localStorage.setItem so any write to a synced key schedules a
 *    debounced push of the whole workspace back to the server.
 */

const KEYS = ["spg-dossiers-v2", "spg-matrix", "spg-intel-edits", "spg-active-dossier"];

let rawSet = null;     // the original, unwrapped localStorage.setItem
let timer = null;
let configured = false;

function install() {
  if (typeof window === "undefined" || rawSet) return;
  try {
    rawSet = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = (k, v) => {
      rawSet(k, v);
      if (KEYS.includes(k)) pushSoon();
    };
  } catch (e) { /* storage unavailable (private mode) — app still runs */ }
}

export async function hydrate() {
  install();
  try {
    const r = await fetch("/api/state");
    if (!r.ok) return;
    const j = await r.json();
    configured = !!j.configured;
    const data = j.data || {};
    // Use the raw setter so hydration doesn't immediately echo back to the server.
    for (const k of KEYS) {
      if (typeof data[k] === "string" && rawSet) rawSet(k, data[k]);
    }
  } catch (e) { /* offline / not deployed — fall back to local-only */ }
}

function pushSoon() {
  clearTimeout(timer);
  timer = setTimeout(push, 600);
}

async function push() {
  const map = {};
  for (const k of KEYS) {
    try { const v = window.localStorage.getItem(k); if (v != null) map[k] = v; } catch (e) {}
  }
  try {
    await fetch("/api/state", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(map),
    });
  } catch (e) { /* will sync on the next write */ }
}

export function isConfigured() { return configured; }
