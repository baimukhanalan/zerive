// GET /api/report → dashboard summary for the user's latest check-up.
const { requireUser, methodGuard } = require('../lib/http');
const { q, one } = require('../lib/db');

const emptyCounts = () => ({ optimal: 0, normal: 0, attention: 0, high: 0 });

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['GET'])) return;
  const u = await requireUser(req, res);
  if (!u) return;

  const latest = await one(
    'select * from checkups where user_id = $1 order by drawn_at desc limit 1', [u.id],
  );
  if (!latest) return res.status(200).json({ hasReport: false });

  const prev = await one(
    'select score from checkups where user_id = $1 order by drawn_at desc offset 1 limit 1', [u.id],
  );

  // status counts + per-system breakdown for the latest check-up
  const rows = await q(
    `select c.system_key, r.status, count(*)::int as n
       from biomarker_results r join biomarker_catalog c on c.id = r.marker_id
      where r.checkup_id = $1 group by c.system_key, r.status`,
    [latest.id],
  );
  const total = emptyCounts();
  const bySystem = {};
  for (const r of rows) {
    total[r.status] = (total[r.status] || 0) + r.n;
    (bySystem[r.system_key] ||= { count: 0, counts: emptyCounts() });
    bySystem[r.system_key].count += r.n;
    bySystem[r.system_key].counts[r.status] += r.n;
  }

  const sys = await q(
    `select ss.system_key, bs.name, ss.score, ss.summary
       from system_scores ss join body_systems bs on bs.key = ss.system_key
      where ss.checkup_id = $1 order by bs.sort`,
    [latest.id],
  );
  const systems = sys.map((s) => ({
    key: s.system_key,
    name: s.name,
    score: s.score,
    summary: s.summary,
    markerCount: bySystem[s.system_key]?.count || 0,
    counts: bySystem[s.system_key]?.counts || emptyCounts(),
  }));

  return res.status(200).json({
    hasReport: true,
    score: latest.score,
    scoreDelta: prev ? latest.score - prev.score : 0,
    bioAge: Number(latest.bio_age),
    realAge: latest.real_age,
    updatedAt: latest.drawn_at,
    counts: total,
    systems,
  });
};
