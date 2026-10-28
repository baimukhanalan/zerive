// Generates a plausible, per-user biomarker panel so every account gets its own
// distinct data (deterministic from the user id → stable across regenerations).

const crypto = require('crypto');
const num = (x) => (x == null ? null : Number(x));

/** Deterministic 0..1 RNG seeded from a string. */
function rng(seed) {
  let h = crypto.createHash('sha256').update(String(seed)).digest();
  let i = 0;
  return () => {
    if (i > h.length - 4) { h = crypto.createHash('sha256').update(h).digest(); i = 0; }
    const v = h.readUInt32BE(i) / 0xffffffff;
    i += 4;
    return v;
  };
}

function statusOf(v, rl, rh, ol, oh) {
  rl = num(rl); rh = num(rh); ol = num(ol); oh = num(oh);
  if (rh != null && v > rh) return v > rh * 1.3 ? 'high' : 'attention';
  if (rl != null && v < rl) return v < rl * 0.7 ? 'high' : 'attention';
  const hasOpt = ol != null || oh != null;
  const inOpt = (ol == null || v >= ol) && (oh == null || v <= oh);
  return hasOpt && inOpt ? 'optimal' : 'normal';
}

function decimals(v) { return v < 3 ? 2 : v < 50 ? 1 : 0; }

/** A plausible current value for a catalog marker. */
function genValue(cat, rand) {
  const rl = num(cat.ref_low), rh = num(cat.ref_high), val = num(cat.value_hint);
  let lo, hi;
  if (rl != null && rh != null) { const s = rh - rl; lo = rl - s * 0.12; hi = rh + s * 0.18; }
  else if (rh != null) { lo = rh * 0.35; hi = rh * 1.25; }
  else if (rl != null) { lo = rl * 0.9; hi = rl * 1.7; }
  else if (val != null) { lo = val * 0.75; hi = val * 1.25; }
  else { lo = 0.7; hi = 1.3; }
  const v = lo + rand() * (hi - lo);
  return Number(v.toFixed(decimals(v)));
}

/** Weighted 0–100 health score from status counts. */
function scoreFromCounts(c) {
  const total = c.optimal + c.normal + c.attention + c.high || 1;
  const raw = (c.optimal * 1 + c.normal * 0.72 + c.attention * 0.3) / total;
  return Math.max(45, Math.min(96, Math.round(40 + raw * 60)));
}

/**
 * Build a full panel for a user: `n` check-ups (dated back in time so the first
 * purchase already shows a trend), each with per-marker values + statuses, plus
 * per-system scores. Returns plain data for the endpoint to insert.
 */
function buildPanel({ catalog, systems, userId, realAge = 34, checkups = 3, now }) {
  const rand = rng(userId);
  const nowMs = now; // ms epoch passed in (Date.now unavailable at import for some runtimes)
  const day = 86400000;
  const dates = checkups === 1 ? [0] : [180, 90, 0].slice(-checkups); // days ago

  // one "current" value per marker, then drift earlier check-ups off it
  const current = {};
  for (const cat of catalog) current[cat.id] = genValue(cat, rand);

  const out = [];
  dates.forEach((daysAgo, idx) => {
    const drift = idx === dates.length - 1 ? 1 : 1 + (rand() - 0.5) * 0.22; // ±11%
    const results = [];
    const counts = { optimal: 0, normal: 0, attention: 0, high: 0 };
    const sysAgg = {};
    for (const cat of catalog) {
      let v = Number((current[cat.id] * drift).toFixed(decimals(current[cat.id] * drift)));
      const st = statusOf(v, cat.ref_low, cat.ref_high, cat.optimal_low, cat.optimal_high);
      counts[st]++;
      (sysAgg[cat.system_key] ||= { optimal: 0, normal: 0, attention: 0, high: 0 })[st]++;
      results.push({ marker_id: cat.id, value: v, status: st });
    }
    const score = scoreFromCounts(counts);
    const bioAge = Math.max(20, Math.round((realAge - (score - 75) / 6) * 10) / 10);
    const systemScores = systems.map((s) => ({
      system_key: s.key,
      score: sysAgg[s.key] ? scoreFromCounts(sysAgg[s.key]) : 80,
      summary: null,
    }));
    out.push({
      drawn_at: new Date(nowMs - daysAgo * day).toISOString().slice(0, 10),
      score, bioAge, realAge, results, systemScores,
    });
  });
  return out; // ordered oldest → newest
}

module.exports = { buildPanel, statusOf, scoreFromCounts };
