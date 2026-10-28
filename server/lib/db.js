// DB access via node-postgres against Neon's pooled endpoint. A module-level
// pool is reused across warm serverless invocations.

const { Pool } = require('pg');

let _pool;
function pool() {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10000,
    });
  }
  return _pool;
}

/** Parameterized query → array of row objects. */
async function q(text, params = []) {
  const r = await pool().query(text, params);
  return r.rows;
}

/** First row (or null). */
async function one(text, params = []) {
  const rows = await q(text, params);
  return rows[0] || null;
}

module.exports = { q, one };
