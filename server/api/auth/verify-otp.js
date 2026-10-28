// POST /api/auth/verify-otp  { phone, code, name? }
//   → { token, user, onboarded, hasReport }
// Demo: any 4-digit code is accepted. Upserts the user by phone and mints a
// session token. Signing in with the seeded demo phone returns Alan's data.
const { body, methodGuard, newToken } = require('../../lib/http');
const { one } = require('../../lib/db');

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['POST'])) return;
  const { phone, code, name } = body(req);
  const digits = String(code || '').replace(/\D/g, '');
  if (!phone) return res.status(400).json({ error: 'phone required' });
  if (digits.length !== 4) return res.status(400).json({ error: 'invalid code' });

  const user = await one(
    `insert into users (phone, name) values ($1, $2)
       on conflict (phone) do update set name = coalesce(excluded.name, users.name)
     returning id, phone, name`,
    [String(phone).trim(), name || null],
  );

  const token = await newToken(user.id);
  const onboarded = !!(await one('select 1 from profiles where user_id = $1', [user.id]));
  const hasReport = !!(await one('select 1 from checkups where user_id = $1 limit 1', [user.id]));

  return res.status(200).json({ token, user, onboarded, hasReport });
};
