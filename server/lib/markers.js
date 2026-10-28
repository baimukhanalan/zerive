// Builds app-shaped biomarker objects from the catalog + a user's results.
const { q } = require('./db');

const num = (v) => (v == null ? null : Number(v));

async function buildMarkers(userId, markerId) {
  const catRows = markerId
    ? await q('select * from biomarker_catalog where id = $1', [markerId])
    : await q('select * from biomarker_catalog', []);
  if (catRows.length === 0) return [];

  const resRows = await q(
    `select r.marker_id, r.value, r.status, to_char(c.drawn_at, 'YYYY-MM') as ym, c.drawn_at
       from biomarker_results r join checkups c on c.id = r.checkup_id
      where c.user_id = $1 ${markerId ? 'and r.marker_id = $2' : ''}
      order by c.drawn_at asc`,
    markerId ? [userId, markerId] : [userId],
  );

  const byMarker = {};
  for (const r of resRows) {
    (byMarker[r.marker_id] ||= []).push({ date: r.ym, value: Number(r.value), status: r.status });
  }

  const out = [];
  for (const c of catRows) {
    const hist = byMarker[c.id] || [];
    if (hist.length === 0) continue; // marker not measured for this user
    const last = hist[hist.length - 1];
    out.push({
      id: c.id,
      system: c.system_key,
      abbr: c.abbr,
      name: c.name,
      unit: c.unit,
      value: last.value,
      status: last.status,
      refLow: num(c.ref_low),
      refHigh: num(c.ref_high),
      optimalLow: num(c.optimal_low),
      optimalHigh: num(c.optimal_high),
      history: hist.map((h) => ({ date: h.date, value: h.value })),
      what: c.what,
      why: c.why,
      related: c.related || [],
      actions: c.actions || [],
    });
  }
  return out;
}

module.exports = { buildMarkers };
