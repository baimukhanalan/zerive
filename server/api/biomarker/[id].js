// GET /api/biomarker/:id → one biomarker with history.
const { requireUser, methodGuard } = require('../../lib/http');
const { buildMarkers } = require('../../lib/markers');

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['GET'])) return;
  const u = await requireUser(req, res);
  if (!u) return;
  const id = req.query.id;
  const markers = await buildMarkers(u.id, id);
  if (markers.length === 0) return res.status(404).json({ error: 'not found' });
  return res.status(200).json({ marker: markers[0] });
};
