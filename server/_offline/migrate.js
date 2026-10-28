// POST /api/admin/migrate?key=…  → runs schema.sql then seed.sql (idempotent).
// Uses the direct (unpooled) connection for multi-statement DDL. Protected by a
// one-off key; this endpoint is removed after the DB is set up.
const { Client } = require('pg');
const { schema, seed } = require('../../lib/sql');

const KEY = 'zrv_migrate_7fK92mQ1x';

module.exports = async (req, res) => {
  if (req.query.key !== KEY) return res.status(403).json({ error: 'forbidden' });

  const connectionString =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL;

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(schema);
    await client.query(seed);
    const { rows } = await client.query(
      `select
         (select count(*) from body_systems) as systems,
         (select count(*) from biomarker_catalog) as catalog,
         (select count(*) from checkups) as checkups,
         (select count(*) from biomarker_results) as results,
         (select count(*) from plan_priorities) as priorities,
         (select count(*) from documents) as documents`,
    );
    return res.status(200).json({ ok: true, counts: rows[0] });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e.message || e) });
  } finally {
    await client.end().catch(() => {});
  }
};
