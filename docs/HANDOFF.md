# HANDOFF - 2026-05-24 02:30

## 완료
- red_flag 화면 제거, cause 화면에 경고문구 2개 유지 (d020977)
- triggerRedFlagDanger 죽은 코드 제거 (bfd457d)
- 재활 루트 3단계 구조 개편: 기초 재활 · 재평가 · 운동 복귀 (7a30a05)
- 1단계 명칭 "준비" → "기초 재활" 변경 (5597ec9)
- why 1~2문장 단문화 + 부정문 → 긍정문 변환 전체 적용 (8f563f8)

## 진행중
- JSON 콘텐츠 개편 — 명칭(전문용어) · 설명(쉬운 말) 재작성
  - 중단 지점: why 단문화·긍정문 변환까지 완료. 명칭/설명 재작성은 미완.
  - 다음 스텝: squat.json부터 파일 하나씩 causes[].name, causes[].tag, causes[].description, tests[].name, tests[].purpose, exercises[].name 재작성

## 대기
- 고관절 콘텐츠 (런지·데드리프트·풀업·키핑·로우에 고관절 없음)
- PostgreSQL 전환 (현재 SQLite ephemeral)
- 네이버 앱 검수 신청
- 커뮤니티 기능
- 복합 원인 케이스
- 재평가 단계 체크박스 인터랙티브화 (현재 정적 텍스트)

## 결정사항 / 주의
- API URL: `https://web-production-28002.up.railway.app`
- 네이버 콜백 URL: `https://web-production-28002.up.railway.app/auth/naver/callback`
- 로컬(localhost:8080)에서는 네이버 로그인 불가 — demo 계정으로 테스트 (kim@rehab.com / 1234)
- JSON 수정은 Python 스크립트로만 (PowerShell 인코딩 깨짐)
- 포인트 컬러: --navy #2C2C2C, --accent #4A7FC1
- 동작 ID: squat, lunge, deadlift, pullup, kipping, press-vertical, press-horizontal, row
- 통증 부위 ID: knee, lower-back, ankle, shoulder, wrist, elbow, hip, chest
- 에이전트(서브에이전트) 백그라운드 실행 시 Bash 권한 차단 + 세션 한도 문제 반복 발생 → 큰 콘텐츠 작업은 메인 대화에서 직접 처리할 것
- 재활 루트 3단계: 기초 재활(exercises) · 재평가(type:reassessment, checklist) · 운동 복귀(type:tips, tips[])

## 다음 세션 권장 첫 프롬프트
`/resume` 후 "squat.json cause 명칭·설명 재작성 시작해줘"
