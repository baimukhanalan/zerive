// Small helpers shared by the serverless functions.

const crypto = require('crypto');
const { one } = require('./db');

function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

const sha = (t) => crypto.createHash('sha256').update(String(t)).digest('hex');

async function newToken(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  await one(
    "insert into sessions (token_hash, user_id, expires_at) values ($1,$2, now() + interval '90 days') returning token_hash",
    [sha(token), userId],
  );
  return token;
}

/** Resolve the authenticated user from the Bearer token, or null. */
async function auth(req) {
  const h = req.headers.authorization || req.headers.Authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return null;
  return await one(
    `select u.id, u.phone, u.name
       from sessions s join users u on u.id = s.user_id
      where s.token_hash = $1 and s.expires_at > now()`,
    [sha(token)],
  );
}

/** Guard: returns the user or writes 401 and returns null. */
async function requireUser(req, res) {
  const u = await auth(req);
  if (!u) { res.status(401).json({ error: 'unauthorized' }); return null; }
  return u;
}

function methodGuard(req, res, allowed) {
  if (!allowed.includes(req.method)) {
    res.status(405).json({ error: 'method not allowed' });
    return false;
  }
  return true;
}

module.exports = { body, sha, newToken, auth, requireUser, methodGuard };
