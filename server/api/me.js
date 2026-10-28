// GET /api/me → { user, profile, onboarded, hasReport }
const { requireUser, methodGuard } = require('../lib/http');
const { one } = require('../lib/db');

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['GET'])) return;
  const u = await requireUser(req, res);
  if (!u) return;
  const profile = await one('select * from profiles where user_id = $1', [u.id]);
  const hasReport = !!(await one('select 1 from checkups where user_id = $1 limit 1', [u.id]));
  return res.status(200).json({ user: u, profile: profile || null, onboarded: !!profile, hasReport });
};
