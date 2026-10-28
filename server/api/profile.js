// PUT /api/profile  { sex, age, city, goals[], sleep, activity, smoking, alcohol, realAge }
//   → { ok } — saves the onboarding intake.
const { body, requireUser, methodGuard } = require('../lib/http');
const { one } = require('../lib/db');

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['PUT', 'POST'])) return;
  const u = await requireUser(req, res);
  if (!u) return;
  const b = body(req);
  await one(
    `insert into profiles (user_id, sex, age_range, city, goals, sleep, activity, smoking, alcohol, real_age, updated_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, now())
     on conflict (user_id) do update set
       sex=excluded.sex, age_range=excluded.age_range, city=excluded.city, goals=excluded.goals,
       sleep=excluded.sleep, activity=excluded.activity, smoking=excluded.smoking, alcohol=excluded.alcohol,
       real_age=excluded.real_age, updated_at=now()
     returning user_id`,
    [
      u.id, b.sex || null, b.age || null, b.city || null, JSON.stringify(b.goals || []),
      b.sleep || null, b.activity || null, b.smoking || null, b.alcohol || null, b.realAge || null,
    ],
  );
  return res.status(200).json({ ok: true });
};
