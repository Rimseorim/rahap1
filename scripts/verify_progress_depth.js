const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const marker = 'const BUNDLED = ';
const start = html.indexOf(marker) + marker.length;
let i = start;
if (html[i] !== '{') throw new Error('unexpected start');
let depth = 0, inStr = false, esc = false;
for (; i < html.length; i++) {
  const c = html[i];
  if (inStr) {
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = false; continue; }
    continue;
  } else {
    if (c === '"') { inStr = true; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
}
const BUNDLED = JSON.parse(html.slice(start, i));

// index.html의 computeMaxDepth와 동일한 알고리즘 (standalone 재구현 — 데이터 자체를 검증하는 목적)
function computeMaxDepthStandalone(painSite, warnings) {
  const questions = painSite.questions || [];
  const tests = painSite.tests || [];
  const findQ = id => questions.find(q => q.id === id);
  const findT = id => tests.find(t => t.id === id);

  function walk(kind, id, visiting) {
    const nodeKey = kind + ':' + id;
    if (visiting.has(nodeKey)) {
      warnings.push(`cycle at ${nodeKey}`);
      return 0;
    }
    visiting.add(nodeKey);
    const node = kind === 'q' ? findQ(id) : findT(id);
    if (!node) { warnings.push(`dangling ref: ${nodeKey} not found`); visiting.delete(nodeKey); return 1; }
    const nexts = kind === 'q'
      ? (node.choices || []).map(c => c.next)
      : [node.pass_next, node.fail_next, node.extra_choice && node.extra_choice.next].filter(Boolean);
    let best = 0;
    for (const next of nexts) {
      if (typeof next !== 'string') continue;
      if (next.startsWith('q:'))    best = Math.max(best, walk('q', next.slice(2), visiting));
      else if (next.startsWith('test:')) best = Math.max(best, walk('test', next.slice(5), visiting));
    }
    visiting.delete(nodeKey);
    return 1 + best;
  }

  return painSite.entry_question ? walk('q', painSite.entry_question, new Set()) : 1;
}

let total = 0, ok = 0;
const depths = [];
for (const m of BUNDLED.manifest) {
  const mdata = BUNDLED[m.id];
  if (!mdata) continue;
  for (const psd of mdata.pain_sites || []) {
    if (!psd || psd.coming_soon) continue;
    total++;
    const warnings = [];
    const d = computeMaxDepthStandalone(psd, warnings);
    depths.push(d);
    if (warnings.length) {
      console.log(`[WARN] ${m.name}/${psd.name || psd.id}: ${warnings.join(', ')}`);
    } else {
      ok++;
    }
  }
}
console.log(`검증 완료: ${ok}/${total} 부위 정상, depth 범위 ${Math.min(...depths)}~${Math.max(...depths)}`);
if (ok !== total) { console.error('경고 발생 — 위 목록 확인 필요'); process.exit(1); }
