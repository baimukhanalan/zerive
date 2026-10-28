// POST /api/plan/toggle  { stepId } → { done }
const { body, requireUser, methodGuard } = require('../../lib/http');
const { one } = require('../../lib/db');

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['POST'])) return;
  const u = await requireUser(req, res);
  if (!u) return;
  const { stepId } = body(req);
  if (!stepId) return res.status(400).json({ error: 'stepId required' });

  const row = await one(
    `insert into plan_progress (user_id, step_id, done, updated_at)
       values ($1, $2, true, now())
       on conflict (user_id, step_id)
       do update set done = not plan_progress.done, updated_at = now()
     returning done`,
    [u.id, stepId],
  );
  return res.status(200).json({ done: row.done });
};
