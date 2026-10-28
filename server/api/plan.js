// GET /api/plan → the user's action plan (priorities + steps + done state).
const { requireUser, methodGuard } = require('../lib/http');
const { q } = require('../lib/db');

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['GET'])) return;
  const u = await requireUser(req, res);
  if (!u) return;

  const priorities = await q(
    'select * from plan_priorities where user_id = $1 order by rank', [u.id],
  );
  if (priorities.length === 0) return res.status(200).json({ plan: [] });

  const steps = await q(
    `select ps.id, ps.priority_id, ps.kind, ps.title, ps.detail, ps.sort,
            coalesce(pp.done, false) as done
       from plan_steps ps
       left join plan_progress pp on pp.step_id = ps.id and pp.user_id = $1
      where ps.priority_id = any($2)
      order by ps.sort asc`,
    [u.id, priorities.map((p) => p.id)],
  );

  const plan = priorities.map((p) => ({
    id: p.id,
    rank: p.rank,
    marker: p.marker_id,
    retestWeeks: p.retest_weeks,
    title: p.title,
    goal: p.goal,
    why: p.why,
    steps: steps
      .filter((s) => s.priority_id === p.id)
      .map((s) => ({ id: s.id, kind: s.kind, title: s.title, detail: s.detail, done: s.done })),
  }));

  return res.status(200).json({ plan });
};
