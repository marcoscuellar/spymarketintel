/* Shared scoring — one source of truth for how a candidate's match reads.
 *
 * The raw weighted rubric (weight × score) can land stingy, so `lift` gently
 * warms each score toward a higher range without ever passing 100 and without
 * changing their order. `overall` is the weighted, lifted match used as the
 * headline %. Used by the dossier donut AND the search-room / client-home fit
 * rings so every screen shows the same number for the same candidate. */

export const GENEROSITY = 0.62; // 1 = raw rubric; lower = more generous
export const lift = (v) => Math.round(100 * Math.pow(Math.min(100, Math.max(0, +v || 0)) / 100, GENEROSITY));

export function overall(criteria) {
  const list = Array.isArray(criteria) ? criteria : [];
  const totalW = list.reduce((a, c) => a + (+c.weight || 0), 0);
  if (!totalW) return 0;
  return Math.round(list.reduce((a, c) => a + lift(c.v) * (+c.weight || 0), 0) / totalW);
}
