// POST /api/checkout/complete  { lab?, city? } → creates the user's own check-up
// panel (first purchase seeds a short history so trends show), a personal plan
// from their weakest markers, and a Health Vault document. Makes each account a
// real, separate user with distinct data.
const { requireUser, methodGuard, body } = require('../../lib/http');
const { q, one } = require('../../lib/db');
const { buildPanel } = require('../../lib/generate');

// generic trilingual plan-step copy
const STEP_DIET = {
  title: { ru: 'Питание и образ жизни', kk: 'Тамақтану және өмір салты', en: 'Nutrition & lifestyle' },
  detail: { ru: 'Скорректируйте рацион, сон и активность под этот показатель.', kk: 'Рацион, ұйқы және белсенділікті осы көрсеткішке бейімдеңіз.', en: 'Adjust diet, sleep and activity for this marker.' },
};
const STEP_RETEST = {
  title: { ru: 'Пересдать через 3 месяца', kk: '3 айдан кейін қайта тапсыру', en: 'Retest in 3 months' },
  detail: { ru: 'Проверить динамику показателя.', kk: 'Көрсеткіш динамикасын тексеру.', en: 'Check the marker’s trend.' },
};
const STEP_DISCUSS = {
  title: { ru: 'Обсудить с врачом', kk: 'Дәрігермен талқылау', en: 'Discuss with a doctor' },
  detail: { ru: 'Если показатель остаётся вне нормы.', kk: 'Көрсеткіш нормадан тыс қалса.', en: 'If it stays out of range.' },
};
const GOAL = { ru: 'Вернуть показатель в оптимальный диапазон', kk: 'Көрсеткішті оңтайлы диапазонға қайтару', en: 'Bring the marker back to the optimal range' };

// bulk multi-row INSERT helper
async function bulk(table, cols, rows) {
  if (rows.length === 0) return;
  const params = [];
  const tuples = rows.map((r) => {
    const ph = cols.map((c) => { params.push(r[c]); return `$${params.length}`; });
    return `(${ph.join(',')})`;
  });
  await q(`insert into ${table} (${cols.join(',')}) values ${tuples.join(',')}`, params);
}

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['POST'])) return;
  const u = await requireUser(req, res);
  if (!u) return;
  const b = body(req);

  const catalog = await q('select * from biomarker_catalog', []);
  const systems = await q('select * from body_systems order by sort', []);
  const prof = await one('select real_age from profiles where user_id = $1', [u.id]);
  const existing = await one('select count(*)::int as n from checkups where user_id = $1', [u.id]);

  const panel = buildPanel({
    catalog, systems, userId: u.id,
    realAge: prof?.real_age || 34,
    checkups: existing.n === 0 ? 3 : 1,
    now: Date.now(),
  });

  let latestCheckupId = null;
  let latestResults = null;
  for (const cp of panel) {
    const ck = await one(
      `insert into checkups (user_id, drawn_at, lab, city, status, score, bio_age, real_age)
       values ($1,$2,$3,$4,'ready',$5,$6,$7) returning id`,
      [u.id, cp.drawn_at, b.lab || 'INVIVO', b.city || 'Алматы', cp.score, cp.bioAge, cp.realAge],
    );
    await bulk('biomarker_results', ['checkup_id', 'marker_id', 'value', 'status'],
      cp.results.map((r) => ({ checkup_id: ck.id, marker_id: r.marker_id, value: r.value, status: r.status })));
    await bulk('system_scores', ['checkup_id', 'system_key', 'score', 'summary'],
      cp.systemScores.map((s) => ({ checkup_id: ck.id, system_key: s.system_key, score: s.score, summary: null })));
    latestCheckupId = ck.id;
    latestResults = cp.results;
  }

  // personal plan from the 3 weakest markers of the latest check-up
  const catById = Object.fromEntries(catalog.map((c) => [c.id, c]));
  const weak = latestResults
    .filter((r) => r.status === 'attention' || r.status === 'high')
    .sort((a, b2) => (a.status === 'high' ? -1 : 1) - (b2.status === 'high' ? -1 : 1))
    .slice(0, 3);

  await q('delete from plan_priorities where user_id = $1', [u.id]); // fresh plan per checkup
  let rank = 1;
  for (const w of weak) {
    const cat = catById[w.marker_id];
    if (!cat) continue;
    const pr = await one(
      `insert into plan_priorities (user_id, rank, marker_id, title, goal, why, retest_weeks)
       values ($1,$2,$3,$4,$5,$6,12) returning id`,
      [u.id, rank++, cat.id, JSON.stringify(cat.name), JSON.stringify(GOAL), JSON.stringify(cat.why)],
    );
    const steps = [STEP_DIET, STEP_RETEST];
    if (w.status === 'high') steps.push(STEP_DISCUSS);
    await bulk('plan_steps', ['priority_id', 'kind', 'title', 'detail', 'sort'],
      steps.map((s, i) => ({
        priority_id: pr.id,
        kind: s === STEP_DIET ? 'diet' : s === STEP_RETEST ? 'retest' : 'discuss',
        title: JSON.stringify(s.title), detail: JSON.stringify(s.detail), sort: i,
      })));
  }

  // Health Vault document for this check-up
  await one(
    `insert into documents (user_id, title, doc_date, source, lab, marker_count)
     values ($1, 'ZERIVE Complete', $2, 'zerive', $3, $4) returning id`,
    [u.id, panel[panel.length - 1].drawn_at, b.lab || 'INVIVO', catalog.length],
  );

  return res.status(200).json({ ok: true, checkups: panel.length, score: panel[panel.length - 1].score });
};
