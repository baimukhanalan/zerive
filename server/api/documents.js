// GET /api/documents → the user's Health Vault records.
const { requireUser, methodGuard } = require('../lib/http');
const { q } = require('../lib/db');

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['GET'])) return;
  const u = await requireUser(req, res);
  if (!u) return;
  const rows = await q(
    `select id, title, to_char(doc_date, 'YYYY-MM-DD') as date, source, lab, marker_count
       from documents where user_id = $1 order by doc_date desc`,
    [u.id],
  );
  return res.status(200).json({
    documents: rows.map((r) => ({
      id: r.id, title: r.title, date: r.date, source: r.source, lab: r.lab, markerCount: r.marker_count,
    })),
  });
};
