# HANDOFF - 2026-05-26 17:00

## 완료
- open.html → open.bat 교체 (file:// 보안 제한으로 meta refresh 차단 문제 해결)
- open.bat: 01.test에서 python http.server 8080 실행 + 브라우저 자동 오픈
- 법적 고지 문구 통합 — 각 화면 인라인 제거, 앱 셸 하단 footer 1곳으로 통합
- test 화면 중복 고지 문구 제거 (868번 라인)
- 로그아웃 — 텍스트 링크 → 테두리 버튼으로 교체
- 완료 체크 아이콘 — 이모지 ✓ → SVG로 교체 (#16A34A)
- CSS 변수 `--navy` → `--dark` 전체 rename (실제 색 #2C2C2C, 이름 불일치 해소)

## 진행중
- 없음

## 대기
- UI 피드백 추가 반영 예정 (사용자가 추가 항목 있으면 말할 예정)
- PostgreSQL 전환 (현재 SQLite ephemeral)
- 네이버 앱 검수 신청
- 커뮤니티 기능
- 복합 원인 케이스
- 재평가 단계 체크박스 인터랙티브화

## 결정사항 / 주의
- **rehap2는 rehap1과 독립 프로젝트** — rehap1 JSON 편집 작업은 rehap1에서 별도 진행
- **로컬 실행**: open.bat 더블클릭 → 01.test에서 http.server 8080 실행됨
- **API URL**: `https://web-production-28002.up.railway.app`
- **네이버 로그인 로컬 불가** — demo 계정: kim@rehab.com / 1234
- CSS 변수: `--dark` #2C2C2C, `--dark-light` #444444, `--accent` #4A7FC1
- 동작 ID: squat, lunge, deadlift, pullup, kipping, press-vertical, press-horizontal, row
- 통증 부위 ID: knee, lower-back, ankle, shoulder, wrist, elbow, hip, chest

## 다음 세션 권장 첫 프롬프트
`/resume` 후 추가 UI 피드백 항목 전달
