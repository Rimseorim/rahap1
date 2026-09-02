# 진단 구간 진행률 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `index.html`의 진단 구간(pain_site~cause) 진행률 바를 화면 종류별 고정 퍼센트 대신, 실제로 밟은 질문/테스트 단계 수 기반으로 계산하도록 바꾼다. danger 화면 역행, test→cause 점프폭 불일치를 해소한다.

**Architecture:** 부위(pain_site)별 "원인까지 최장 경로 길이"(`maxDepth`)를 정적 데이터에서 DFS로 계산해 캐시하고, 사용자가 실제로 밟은 단계 수(`S.stepDepth`)와의 비율로 30~82% 구간을 보간한다. danger 화면도 같은 공식을 공유한다. 전역 "진행률은 절대 감소하지 않는다" 가드를 최종 안전판으로 둔다.

**Tech Stack:** 바닐라 JS (단일 `index.html`), Node.js(문법 검증/데이터 검증 스크립트), Playwright(UI 스모크 테스트) — 기존 `scripts/analyze_retest.js`, `docs/superpowers/plans/2026-08-17-danger-card-sfma2-signals.md`의 검증 패턴을 그대로 따름.

**참고 스펙:** `docs/superpowers/specs/2026-09-02-progress-bar-redesign-design.md`

---

### Task 1: `S.questionDepth` → `S.stepDepth` 이름 변경 + 테스트 선택 시에도 증가 + `S.maxPctReached` 추가

**Files:**
- Modify: `index.html:432-450` (상태 초기값), `:1858-1868` (`selectPainSite`), `:1882-1894` (`selectMovement`), `:1897-1931` (`selectChoice`), `:1958-1979` (`selectTestResult`), `:2033-2041` (`reset`)

- [ ] **Step 1: 전역 rename — `questionDepth` → `stepDepth`**

`index.html` 안의 `questionDepth` 식별자(변수 참조 `S.questionDepth`, 객체 리터럴 키 `questionDepth:`)를 전부 `stepDepth`로 바꾼다. 발생 위치 5곳:

1. `:443` — `questionDepth: 0,` (상태 초기값)
2. `:1864` — `S.questionDepth = 0;` (`selectPainSite` 안)
3. `:1890` — `S.questionDepth = 0;` (`selectMovement` 안)
4. `:1908` — `S.questionDepth++;` (`selectChoice` 안)
5. `:2037` — `questionDepth: 0,` (`reset` 안 `Object.assign`)

Edit 도구로 `old_string: "questionDepth"`, `new_string: "stepDepth"`, `replace_all: true` 사용.

- [ ] **Step 2: `selectTestResult`에서도 `S.stepDepth` 증가**

현재 `selectTestResult`(`:1958`)는 depth를 증가시키지 않는다 — 테스트 결과 선택도 "밟은 단계"이므로 추가해야 한다.

```javascript
function selectTestResult(next, outcome) {
  S.stepDepth++;
  if (next.startsWith('cause:')) {
```

(`function selectTestResult(next, outcome) {` 바로 다음 줄에 `S.stepDepth++;` 삽입)

- [ ] **Step 3: `S.maxPctReached` 상태 추가 + 리셋 지점 추가**

상태 초기값(`:432` 블록, `stepDepth: 0,` 바로 아래)에 추가:
```javascript
  maxPctReached: 0,
```

`selectPainSite`(`:1858`, 새 진단 시작 지점) 안, `S.stepDepth = 0;` 다음 줄에 추가:
```javascript
  S.maxPctReached = 0;
```

`reset()`(`:2033` `Object.assign` 안) 의 `stepDepth: 0,` 옆에 추가:
```javascript
    stepDepth: 0, maxPctReached: 0, isRedFlagDanger: false, retestMode: false
```

- [ ] **Step 4: Node로 구문 오류 여부 확인**

Run:
```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<script>') + '<script>'.length;
const end = html.lastIndexOf('</script>');
fs.writeFileSync('/tmp/_extract.js', html.slice(start, end));
"
node --check /tmp/_extract.js
```
Expected: 에러 없이 종료 (구문 오류 있으면 `SyntaxError`와 줄 번호 출력됨).

- [ ] **Step 5: 커밋**

```bash
git add index.html
git commit -m "refactor: questionDepth를 stepDepth로 확장 (질문+테스트 공통 진행 깊이 카운터)"
```

---

### Task 2: `computeMaxDepth()` — 부위별 원인까지 최장 경로 계산

**Files:**
- Modify: `index.html` — `getTest()` 함수(`:807`) 바로 다음에 새 함수 블록 추가

- [ ] **Step 1: `computeMaxDepth` 함수 작성**

`function getTest()      { return find(getPainSite().tests, S.testId); }` (`:807`) 다음 줄에 삽입:

```javascript

const _maxDepthCache = new Map();
function computeMaxDepth(painSite) {
  const cacheKey = S.movementId + '|' + S.painSiteId;
  if (_maxDepthCache.has(cacheKey)) return _maxDepthCache.get(cacheKey);

  const questions = painSite.questions || [];
  const tests = painSite.tests || [];
  const findQ = id => questions.find(q => q.id === id);
  const findT = id => tests.find(t => t.id === id);

  function walk(kind, id, visiting) {
    const nodeKey = kind + ':' + id;
    if (visiting.has(nodeKey)) {
      console.warn('[progress] cycle detected at', nodeKey, '— treating as leaf, maxDepth may be underestimated');
      return 0;
    }
    visiting.add(nodeKey);
    const node = kind === 'q' ? findQ(id) : findT(id);
    if (!node) { visiting.delete(nodeKey); return 1; }
    const nexts = kind === 'q'
      ? (node.choices || []).map(c => c.next)
      : [node.pass_next, node.fail_next, node.extra_choice && node.extra_choice.next].filter(Boolean);
    let best = 0;
    for (const next of nexts) {
      if (typeof next !== 'string') continue;
      if (next.startsWith('q:'))    best = Math.max(best, walk('q', next.slice(2), visiting));
      else if (next.startsWith('test:')) best = Math.max(best, walk('test', next.slice(5), visiting));
      // 'cause:'/'danger'는 추가 단계 없음(현재 노드에서 바로 종료)
    }
    visiting.delete(nodeKey);
    return 1 + best;
  }

  const depth = painSite.entry_question ? walk('q', painSite.entry_question, new Set()) : 1;
  _maxDepthCache.set(cacheKey, depth);
  return depth;
}
```

**동작 설명:** `entry_question`부터 DFS로 모든 분기를 따라가며, `cause:`/`danger`에 도달하기까지 몇 개의 질문/테스트 화면을 거치는지(=몇 번 답을 선택하는지) 최장 경로를 구한다. 같은 노드를 현재 경로에서 재방문하면(순환) 그 지점에서 끊고 경고만 남긴다(무한루프 방지). `movementId+painSiteId` 키로 캐시해 같은 세션에서 재계산하지 않는다.

- [ ] **Step 2: Node로 구문 오류 여부 확인**

Task 1 Step 4와 동일한 명령 재실행:
```bash
node --check /tmp/_extract.js
```
(먼저 `node -e "..."` 추출 스크립트로 최신 `index.html` 내용을 다시 `/tmp/_extract.js`에 반영한 뒤 체크)
Expected: 에러 없이 종료.

- [ ] **Step 3: 커밋**

```bash
git add index.html
git commit -m "feat: 부위별 원인까지 최장 경로(computeMaxDepth) 계산 함수 추가"
```

---

### Task 3: `updateProgress()` 재작성 — 깊이 기반 보간 + 회귀 방지 가드

**Files:**
- Modify: `index.html:826-859` (`PROGRESS`/`LABEL` 상수, `updateProgress` 함수)

- [ ] **Step 1: `PROGRESS` 상수에서 `question`/`test`/`danger` 제거**

기존(`:826-829`):
```javascript
const PROGRESS = {
  home: 0, pain_site: 10, movement: 30,
  question: 55, test: 70, cause: 82, route: 92, session_feedback: 95, complete: 100, danger: 50, coming_soon: 35
};
```

변경 후:
```javascript
const PROGRESS = {
  home: 0, pain_site: 10, movement: 30,
  cause: 82, route: 92, session_feedback: 95, complete: 100, coming_soon: 35
};
```

`LABEL` 상수(`:830-834`)는 그대로 둔다 (`danger: '주의'`가 이미 포함돼 있음).

- [ ] **Step 2: `updateProgress` 함수 본문 교체**

기존(`:836-859`):
```javascript
function updateProgress(screen) {
  const bar = el('progress-bar');
  if (['landing', 'home', 'login', 'my_records'].includes(screen)) { bar.style.display = 'none'; return; }
  bar.style.display = 'block';
  let pct, label;
  if ((screen === 'route' || screen === 'complete' || screen === 'session_feedback' || screen === 'recovery_test' || screen === 'recovery_complete') && S.causeId) {
    // 고정 4단계: 1기초재활 2회복테스트 3재평가 4운동복귀
    const base = PROGRESS['cause'] || 82;
    const stageToStep = { 0: 0, 1: 2, 2: 3 }; // stageIndex → 0-based step
    let stepIdx;
    if (screen === 'recovery_test') stepIdx = 1;
    else if (screen === 'recovery_complete') stepIdx = 2;
    else if (screen === 'complete' || screen === 'session_feedback') stepIdx = (stageToStep[S.stageIndex] ?? 0) + 1;
    else stepIdx = stageToStep[S.stageIndex] ?? 0;
    pct   = Math.round(base + (stepIdx / 4) * (100 - base));
    label = '재활 루트';
  } else {
    pct   = PROGRESS[screen] || 50;
    label = LABEL[screen] || '';
  }
  el('pb-label').textContent = label;
  el('pb-pct').textContent = pct + '%';
  el('pb-fill').style.width = pct + '%';
}
```

변경 후:
```javascript
function updateProgress(screen) {
  const bar = el('progress-bar');
  if (['landing', 'home', 'login', 'my_records'].includes(screen)) { bar.style.display = 'none'; return; }
  bar.style.display = 'block';
  let pct, label;
  if ((screen === 'route' || screen === 'complete' || screen === 'session_feedback' || screen === 'recovery_test' || screen === 'recovery_complete') && S.causeId) {
    // 고정 4단계: 1기초재활 2회복테스트 3재평가 4운동복귀
    const base = PROGRESS['cause'] || 82;
    const stageToStep = { 0: 0, 1: 2, 2: 3 }; // stageIndex → 0-based step
    let stepIdx;
    if (screen === 'recovery_test') stepIdx = 1;
    else if (screen === 'recovery_complete') stepIdx = 2;
    else if (screen === 'complete' || screen === 'session_feedback') stepIdx = (stageToStep[S.stageIndex] ?? 0) + 1;
    else stepIdx = stageToStep[S.stageIndex] ?? 0;
    pct   = Math.round(base + (stepIdx / 4) * (100 - base));
    label = '재활 루트';
  } else if (screen === 'question' || screen === 'test' || screen === 'danger') {
    // 질문/테스트/위험신호 공통: 실제로 밟은 단계 수 기반 보간 (30%~82%)
    const painSite = getPainSite();
    const maxDepth = painSite ? computeMaxDepth(painSite) : 1;
    pct   = Math.min(81, Math.round(30 + (S.stepDepth / maxDepth) * (82 - 30)));
    label = LABEL[screen] || '';
  } else {
    pct   = PROGRESS[screen] || 50;
    label = LABEL[screen] || '';
  }
  // 회귀 방지: 한번 도달한 퍼센트보다 낮게 표시되지 않도록 함
  pct = Math.max(pct, S.maxPctReached || 0);
  S.maxPctReached = pct;
  el('pb-label').textContent = label;
  el('pb-pct').textContent = pct + '%';
  el('pb-fill').style.width = pct + '%';
}
```

- [ ] **Step 3: Node로 구문 오류 여부 확인**

Task 1 Step 4와 동일한 추출+체크 명령 재실행. Expected: 에러 없이 종료.

- [ ] **Step 4: 커밋**

```bash
git add index.html
git commit -m "feat: 진단 구간 진행률을 화면 고정값 대신 실제 단계 수 기반으로 계산"
```

---

### Task 4: 데이터 검증 스크립트 — 8동작×전체부위 순회로 순환/깊이 이상 탐지

**Files:**
- Create: `scripts/verify_progress_depth.js`

- [ ] **Step 1: 검증 스크립트 작성**

`scripts/analyze_retest.js`의 BUNDLED 추출 패턴을 재사용한다.

```javascript
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const marker = 'const BUNDLED=';
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
```

- [ ] **Step 2: 실행 및 결과 확인**

Run:
```bash
node scripts/verify_progress_depth.js
```
Expected: `검증 완료: N/N 부위 정상, depth 범위 X~Y` (N은 coming_soon이 아닌 전체 부위 수, X~Y는 대략 1~6 사이 예상). `[WARN]` 줄이 하나라도 나오면 해당 부위 데이터의 순환/누락 참조를 먼저 고쳐야 한다 — Task 5로 넘어가지 말고 원인 확인.

- [ ] **Step 3: 커밋**

```bash
git add scripts/verify_progress_depth.js
git commit -m "test: 부위별 진행률 깊이 계산 데이터 검증 스크립트 추가"
```

---

### Task 5: Playwright 스모크 테스트 — 실제 화면에서 진행률 동작 확인

**사전 조건:** 로컬 정적 서버로 `index.html`을 서빙해야 Playwright가 로드할 수 있다. Playwright는 `package.json`에 이미 의존성으로 등록돼 있다.

**Files:**
- Create (임시, 실행 후 삭제): `_smoke_progress.js`

- [ ] **Step 1: 정적 서버 백그라운드 실행**

```bash
python -m http.server 8756 &
```

- [ ] **Step 2: 스모크 스크립트 작성**

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const readings = [];

  page.on('console', () => {}); // cycle 경고 등은 별도 무시

  await page.goto('http://localhost:8756/index.html');

  // 로그인 스킵 가능한 경로가 있으면 그대로 진행, 없으면 로그인 화면에서 막힘 여부만 확인
  const pctOf = async () => {
    const txt = await page.locator('#pb-pct').textContent().catch(() => null);
    return txt ? parseInt(txt) : null;
  };

  // 통증부위 → 동작 → 질문 체인을 끝까지 따라가며 pb-pct가 감소하지 않는지 기록
  async function clickFirstChoice() {
    const btn = page.locator('.choice-btn').first();
    if (await btn.count() === 0) return false;
    await btn.click();
    await page.waitForTimeout(150);
    return true;
  }

  for (let i = 0; i < 15; i++) {
    const pct = await pctOf();
    if (pct !== null) readings.push(pct);
    const moved = await clickFirstChoice();
    if (!moved) break;
  }

  let monotonic = true;
  for (let i = 1; i < readings.length; i++) {
    if (readings[i] < readings[i - 1]) monotonic = false;
  }

  console.log('[check] pct readings:', readings);
  console.log('[check] 진행률 비감소(monotonic):', monotonic);

  await browser.close();
  process.exit(monotonic ? 0 : 1);
})();
```

- [ ] **Step 3: 실행 및 결과 확인**

Run:
```bash
node _smoke_progress.js
```
Expected 출력: `[check] 진행률 비감소(monotonic): true`. `false`가 나오면 어느 구간에서 역행했는지 `readings` 배열로 확인 후 `updateProgress`/`computeMaxDepth` 로직 재점검.

- [ ] **Step 4: 임시 스크립트 및 서버 종료**

```bash
rm _smoke_progress.js
kill %1
```

---

### Task 6: HANDOFF 갱신 및 최종 확인

**Files:**
- Modify: `docs/HANDOFF.md` (필요 시)

- [ ] **Step 1: `git log --oneline -n 10`으로 이번 작업 커밋 확인**

Run: `git log --oneline -n 10`
Expected: Task 1~4의 커밋 4개가 순서대로 보임.

- [ ] **Step 2: 실기기/브라우저에서 수동으로 한 번 더 확인 (선택)**

`rimseorim.github.io/rehap/`(배포 후) 또는 로컬에서 통증부위 선택 → 동작 선택 → 질문 2~3개 답변 → (테스트가 있으면 테스트까지) → 원인 확정까지 진행하며 진행률 바가 부드럽게 올라가고 82%에서 원인 화면이 뜨는지 눈으로 확인.

---

## Self-Review 메모

- **스펙 커버리지**: danger 통합(Task 3), test→cause 점프 완화(Task 2+3), 챕터 내부 정체 해소(Task 1+3), 회귀 방지 가드(Task 3), 순환 가드+캐시(Task 2), 데이터 검증(Task 4) — 스펙의 모든 섹션에 대응하는 Task 있음.
- **플레이스홀더 스캔**: 없음 — 모든 스텝에 실제 코드/명령 포함.
- **타입/시그니처 일관성**: `computeMaxDepth(painSite)` 시그니처가 Task 2 정의와 Task 3 호출(`computeMaxDepth(painSite)`)에서 동일. `S.stepDepth`/`S.maxPctReached` 명명이 Task 1~3에서 일관됨.
