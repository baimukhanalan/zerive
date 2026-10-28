// POST /api/ai  { q, lang } → { answer }
// A grounded, rule-based assistant: answers from the user's OWN biomarker values
// (no external LLM). Leans on the catalog's trilingual what/why/actions copy plus
// the user's real numbers, status and trend.
const { requireUser, methodGuard, body } = require('../lib/http');
const { buildMarkers } = require('../lib/markers');

const T = {
  ru: {
    st: { optimal: 'оптимально', normal: 'норма', attention: 'внимание', high: 'приоритет' },
    opt: 'оптимум', norm: 'норма', below: 'ниже', above: 'выше',
    trend: (a, b, p) => `Динамика: ${a} → ${b} (${p > 0 ? '+' : ''}${p}%).`,
    todo: 'Что делать', changed: 'С прошлого теста заметнее всего изменились:',
    top: 'Сейчас в фокусе:', allGood: 'Все ключевые показатели в норме — так держать.',
    fatigue: 'На усталость чаще всего влияют ферритин, витамин D и B12. По твоим данным:',
    none: 'Пока нет результатов — оформи ZERIVE Check, и я отвечу по твоим цифрам.',
    fallback: 'Спроси про конкретный показатель (например, «витамин D» или «ApoB») — разберу по твоим числам. Сейчас в фокусе:',
  },
  kk: {
    st: { optimal: 'оңтайлы', normal: 'қалыпты', attention: 'назар', high: 'басымдық' },
    opt: 'оптимум', norm: 'қалыпты', below: 'төмен', above: 'жоғары',
    trend: (a, b, p) => `Динамика: ${a} → ${b} (${p > 0 ? '+' : ''}${p}%).`,
    todo: 'Не істеу керек', changed: 'Өткен тестен бері ең көп өзгергені:',
    top: 'Қазір назарда:', allGood: 'Негізгі көрсеткіштер қалыпты — осылай ұста.',
    fatigue: 'Шаршауға көбіне ферритин, D дәрумені және B12 әсер етеді. Сенің деректерің:',
    none: 'Әзірге нәтиже жоқ — ZERIVE Check рәсімде, сонда сандарыңмен жауап беремін.',
    fallback: 'Нақты көрсеткіш туралы сұра (мысалы, «D дәрумені» немесе «ApoB») — сандарыңмен талдаймын. Қазір назарда:',
  },
  en: {
    st: { optimal: 'optimal', normal: 'normal', attention: 'attention', high: 'priority' },
    opt: 'optimal', norm: 'reference', below: 'below', above: 'above',
    trend: (a, b, p) => `Trend: ${a} → ${b} (${p > 0 ? '+' : ''}${p}%).`,
    todo: 'What to do', changed: 'The biggest movers since your last test:',
    top: 'In focus right now:', allGood: 'Your key markers are all in range — keep it up.',
    fatigue: 'Fatigue most often ties to ferritin, vitamin D and B12. From your data:',
    none: 'No results yet — get a ZERIVE Check and I’ll answer with your numbers.',
    fallback: 'Ask about a specific marker (e.g. “vitamin D” or “ApoB”) and I’ll break it down from your numbers. In focus right now:',
  },
};

const pick = (l10n, lang) => (l10n ? (l10n[lang] || l10n.ru) : '');
const nm = (m, lang) => pick(m.name, lang);

function markerAnswer(m, lang) {
  const t = T[lang];
  const parts = [`${nm(m, lang)}: ${m.value} ${m.unit} — ${t.st[m.status]}.`];
  if (m.optimalLow != null || m.optimalHigh != null) {
    const r = m.optimalLow != null && m.optimalHigh != null ? `${m.optimalLow}–${m.optimalHigh}`
      : m.optimalHigh != null ? `< ${m.optimalHigh}` : `> ${m.optimalLow}`;
    parts.push(`${t.opt} ${r} ${m.unit}.`);
  }
  if (m.history && m.history.length >= 2) {
    const a = m.history[0].value, b = m.history[m.history.length - 1].value;
    if (a) parts.push(t.trend(a, b, Math.round(((b - a) / Math.abs(a)) * 100)));
  }
  const why = pick(m.why, lang);
  if (why) parts.push(why);
  const act = m.actions && m.actions[0] ? pick(m.actions[0], lang) : '';
  if (act) parts.push(`${t.todo}: ${act}`);
  return parts.join(' ');
}

function findMarker(markers, q, lang) {
  const ql = q.toLowerCase();
  let best = null, bestScore = 0;
  for (const m of markers) {
    let score = 0;
    if (m.abbr && ql.includes(m.abbr.toLowerCase())) score += 3;
    for (const w of nm(m, lang).toLowerCase().split(/[\s,()]+/)) {
      if (w.length >= 4 && ql.includes(w)) score += 2;
    }
    if (m.id && ql.includes(m.id.replace(/_/g, ' '))) score += 1;
    if (score > bestScore) { best = m; bestScore = score; }
  }
  return bestScore >= 2 ? best : null;
}

const priorities = (markers) => markers
  .filter((m) => m.status === 'attention' || m.status === 'high')
  .sort((a, b) => (a.status === 'high' ? 0 : 1) - (b.status === 'high' ? 0 : 1));

module.exports = async (req, res) => {
  if (!methodGuard(req, res, ['POST'])) return;
  const u = await requireUser(req, res);
  if (!u) return;
  const { q = '', lang = 'ru' } = body(req);
  const L = T[lang] ? lang : 'ru';
  const t = T[L];
  const markers = await buildMarkers(u.id);

  if (markers.length === 0) return res.status(200).json({ answer: t.none });

  const ql = String(q).toLowerCase();
  const listTop = (n) => priorities(markers).slice(0, n).map((m) => `${nm(m, L)} — ${m.value} ${m.unit} (${t.st[m.status]})`).join('; ');

  // 1) specific marker mentioned
  const hit = findMarker(markers, q, L);
  if (hit) return res.status(200).json({ answer: markerAnswer(hit, L) });

  // 2) "what changed since last test"
  if (/измен|change|өзгер/.test(ql)) {
    const movers = markers
      .filter((m) => m.history && m.history.length >= 2 && m.history[0].value)
      .map((m) => ({ m, pct: Math.round(((m.value - m.history[0].value) / Math.abs(m.history[0].value)) * 100) }))
      .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
      .slice(0, 3);
    const line = movers.map(({ m, pct }) => `${nm(m, L)} ${m.history[0].value} → ${m.value} (${pct > 0 ? '+' : ''}${pct}%)`).join('; ');
    return res.status(200).json({ answer: `${t.changed} ${line || '—'}.` });
  }

  // 3) fatigue / energy
  if (/устал|энерг|fatigue|energy|шаршау|қуат/.test(ql)) {
    const ids = ['ferritin', 'vitamin_d', 'vitamin_b12'];
    const rel = markers.filter((m) => ids.includes(m.id));
    const line = rel.map((m) => `${nm(m, L)} ${m.value} ${m.unit} (${t.st[m.status]})`).join('; ');
    return res.status(200).json({ answer: `${t.fatigue} ${line || '—'}.` });
  }

  // 4) where to start / priorities / general
  const top = listTop(3);
  if (/начать|start|баста|приорит|важн|focus/.test(ql)) {
    return res.status(200).json({ answer: `${t.top} ${top || t.allGood}` });
  }
  return res.status(200).json({ answer: `${t.fallback} ${top || t.allGood}` });
};
