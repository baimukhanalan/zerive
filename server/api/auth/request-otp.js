// POST /api/auth/request-otp  { phone } → { ok }
// Demo: no SMS provider wired yet, so we accept any 4-digit code at verify.
const { body, methodGuard } = require('../../lib/http');

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['POST'])) return;
  const { phone } = body(req);
  if (!phone || String(phone).replace(/\D/g, '').length < 9) {
    return res.status(400).json({ error: 'invalid phone' });
  }
  return res.status(200).json({ ok: true, demo: true });
};
