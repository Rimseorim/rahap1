# HANDOFF - 2026-05-31 17:00

## 완료
- 원인 화면 진입 시 재활 기록 자동 저장 (fc65073, 6598ab0)
- 비로그인(데모) 포함 sportslogs localStorage 저장 (6f73676)
- 기록 탭에 재활 타입 카드 렌더링 (초록 배지·달력 점·범례)
- 기록 카드 탭 시 원인 화면으로 복귀 (a705057)
- 홈 카드: 원인 화면 이탈 시 "원인 확정 단계"로 머무름 (55ee786)
- "기초 재활" 단계 완료 후 직접 테스트 재평가 버튼 분기 (44f6d0f)
- 5단계(바벨 등) 전부 완료 후에도 재평가 버튼 노출
- GitHub Pages 루트 index.html 동기화 구조 확립 (rehap2 → rehap1/index.html + 루트 index.html 동시 복사 → push)

## 진행중
- 없음

## 대기
- 카카오·구글 OAuth 백엔드 연동 (현재 "준비 중" 토스트)
- 추이 탭 종목 관리 기능 (삭제·병합 등)
- 기록 탭 수정 기능 (현재 삭제만 가능)
- press-vertical.json elbow coming_soon 원복 여부 확인
- 실제 운동 영상 URL 데이터 입력
- "테스트 없이 다음 단계" 버튼 노출 여부 재검토 (현재 기초재활 완료 시 노출)

## 결정사항 / 주의
- 배포 구조: rehap2(로컬 작업) → Copy-Item → rehap1/index.html + 루트 index.html → git add 두 파일 → push
  - `git -C rehap1 add "../index.html" "index.html"` 로 두 파일 동시 스테이징
- 기록 저장 트리거: `render()` 에서 `S.screen === 'cause'` 체크 (USER 체크보다 앞)
- sportslogs 스키마: `{id, type:'rehab', date, movement, painSite, cause, causeId, movementId, painSiteId}`
- "기초 재활" stage name 하드코딩으로 retest 분기 — 다른 이름 쓰면 미작동
- LAST_RECORD._atCause: true → 홈 카드 onclick이 원인 화면으로 분기
- 앱 이름: LogFit (로그핏)
- 주 색상: 차콜 #2C2C2C + 흰색 + 파란색 #4A7FC1

## 다음 세션 권장 첫 프롬프트
`/resume`
