# 진단 구간 진행률(progress bar) 재설계

## 배경 / 문제

`index.html`의 `PROGRESS` 객체(826행)는 화면 종류별 고정 퍼센트를 쓴다:

```js
const PROGRESS = {
  home: 0, pain_site: 10, movement: 30,
  question: 55, test: 70, cause: 82, route: 92, session_feedback: 95, complete: 100, danger: 50, coming_soon: 35
};
```

이 방식은 pain_site~cause 구간이 **가변 분기 트리**라는 사실과 안 맞아서 세 가지 증상이 나타난다.

1. **danger 역행**: `question`(55%)에서 위험신호 답변을 고르면 `danger`(50%)로 이동 — 진행률이 눈에 띄게 줄어듦.
2. **test→cause 점프 불일치**: 질문에서 바로 `cause:`로 가는 분기(테스트 생략, 예: `cause-c`, `cause-case1`)는 55%→82%로 27%p 점프하고, 테스트를 거치는 분기는 70%→82%로 12%p만 점프한다. 같은 "원인 확정" 화면인데 직전 경로 길이에 따라 체감 점프폭이 다르다.
3. **챕터 내부 정체**: 질문 챕터(`q1→q2→q3→q4`)가 여러 화면을 거쳐도 55%에 고정 — 실제로 진행 중인데 숫자가 안 움직인다.

## 조사 결과 (설계 근거)

- 질문 체인 깊이는 부위/동작마다 다름 — `q1`만으로 끝나는 경우부터 `q1→q2→q3→q4`까지 확인됨.
- 테스트 체인(`pass_next`/`fail_next`가 `test:`로 이어지는 경우)은 데이터 전체에서 0건 — 테스트는 항상 1단계로 끝남.
- 질문→테스트 직접 전환(`next:"test:..."`)도 0건.
- **예외 1건**: 발목 균형 테스트의 `fail_next`가 `"q:q4"`로, 테스트(챕터2)에서 질문(챕터1)으로 역행하는 유일한 케이스가 존재함. 재설계 시 이 케이스에서도 숫자가 줄어들지 않아야 함.
- `S.questionDepth`가 이미 `selectChoice`(1908행)에서 증가하고 있고, `selectPainSite`/`selectMovement`에서 정상적으로 0으로 리셋됨. 다만 `selectTestResult`(테스트 결과 선택)에서는 증가하지 않음 — 확장 필요.
- 트리는 정적 데이터(런타임에 안 바뀜)이므로 부위별 "원인까지 최장 경로 길이"를 미리 계산해둘 수 있음.

## 설계

### 구간 앵커 (유지)

```
home:0 → pain_site:10 → movement:30 → [보간 구간] → cause:82(고정) → route~complete: 기존 stepIdx 로직 유지
```

`pain_site`, `movement` 전환은 항상 1클릭 고정이라 변동 요소가 없으므로 그대로 둔다. `route` 이후(재활 루트 4단계)는 이미 `stepIdx / 4` 방식으로 깊이 기반 계산이라 손대지 않는다.

### 보간 구간 (30% ~ 82%)

**통합 깊이 카운터**: `S.questionDepth`를 질문 선택뿐 아니라 테스트 결과 선택(`selectTestResult`)에서도 증가시킨다. 이름은 의미가 넓어지므로 `S.stepDepth`로 변경.

**최장 경로 계산 (`maxDepth`)**: 부위(pain_site)의 `entry_question`에서 출발해 `questions[].choices[].next`와 `tests[].pass_next`/`fail_next`를 따라가며 도달 가능한 모든 `cause:`까지의 최장 경로 길이를 DFS로 계산한다.

- 계산 시점: `selectMovement`에서 `DATA` 로드 직후, 부위별로 1회.
- 캐시: `movementId + painSiteId` 키로 메모이즈 (같은 세션 내 재방문 시 재계산 안 함).
- 순환 가드: DFS 중 이미 방문한 노드를 다시 만나면 그 경로를 depth 0으로 끊고 `console.warn('[progress] cycle detected: ...')` 출력. 무한루프 방지 + 데이터 QA 신호.
- `danger`는 종료 노드로 취급(더 진행 안 함, depth 기여 없음).

**퍼센트 계산**:
```js
pct = 30 + (S.stepDepth / maxDepth) * (82 - 30)
pct = Math.min(pct, 81) // cause 화면 도달 전까지 82 미만 유지
```

`question`, `test`, `danger` 세 화면 모두 이 공식을 공유한다 (기존처럼 화면 종류별 고정값 룩업이 아니라, 화면 종류와 무관하게 "지금까지 밟은 단계 수"로 계산).

### danger 처리

기존 `PROGRESS.danger = 50` 고정값 제거. danger 화면도 위 공식을 그대로 사용 — "위험신호가 어느 시점에 나왔든 그 시점까지의 실제 진행률"을 표시한다. question보다 낮아지는 구조적 문제가 사라진다.

### 전역 회귀 방지 가드 (안전장치)

`updateProgress()` 안에서 마지막 방어선으로:
```js
pct = Math.max(pct, S.maxPctReached || 0);
S.maxPctReached = pct;
```
`S.maxPctReached`는 `selectPainSite`(새 진단 시작)에서만 0으로 리셋. 테스트→`q4` 역행처럼 계산상 depth/maxDepth 비율이 일시적으로 낮아지는 예외 케이스가 있어도, 화면에 보이는 숫자는 절대 줄어들지 않는다. 트리 계산 로직에 놓친 엣지케이스가 있어도 사용자에게 노출되는 마지막 안전판.

### 변경 요약

| 항목 | 기존 | 변경 |
|---|---|---|
| `S.questionDepth` | 질문 선택 시만 증가 | `S.stepDepth`로 이름 변경, 질문+테스트 결과 선택 시 증가 |
| `PROGRESS.question/test/danger` | 고정값(55/70/50) | 제거 — 공식으로 대체 |
| `PROGRESS.pain_site/movement/cause` | 고정값(10/30/82) | 유지 |
| `updateProgress()` | 화면별 룩업 | 화면 종류 분기 + depth 공식 + 회귀 방지 가드 |
| 신규: `computeMaxDepth(painSite)` | 없음 | DFS 기반 최장 경로 계산 + 순환 가드 + 캐시 |

## 에러 처리

- `maxDepth`가 0 또는 계산 실패 시 (데이터 이상): 기존 고정값(55) 폴백 — 크래시 대신 저하된 정확도로 동작.
- 순환 감지 시 콘솔 경고만, 사용자에게는 노출 안 함(진행은 계속됨).

## 테스트 / 검증

배포 전 1회성 콘솔 스크립트로: 8개 동작 × 35개 부위 전체 조합에서
1. `computeMaxDepth`가 무한루프 없이 종료되는지
2. 모든 실제 도달 가능 경로에서 `stepsTaken ≤ maxDepth`인지 (역전되면 82% 이전에 82%를 넘는 버그)

두 가지를 자동 순회 검증한다.

## 범위 밖 (Out of scope)

- `route`~`complete` 구간(재활 루트 4단계) 로직 — 이미 깊이 기반이라 변경 없음.
- `pain_site`/`movement` 앵커값 자체 조정 — 변동 요소 없어 그대로 유지.
