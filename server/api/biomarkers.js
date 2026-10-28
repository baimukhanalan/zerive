// GET /api/biomarkers → all of the user's biomarkers (with history).
const { requireUser, methodGuard } = require('../lib/http');
const { buildMarkers } = require('../lib/markers');

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['GET'])) return;
  const u = await requireUser(req, res);
  if (!u) return;
  const markers = await buildMarkers(u.id);
  return res.status(200).json({ markers });
};
