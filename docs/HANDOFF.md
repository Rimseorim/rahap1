# HANDOFF - 2026-05-12 HH:MM

## 완료
- 전문 용어 괄호 병기 — `data/rehab.json` name/description/cue 전체 (배측굴곡, 흉추, 요추, 고관절, 둔근·내전근, 비복근·가자미근)
- "어디가 아픈가요?" 화면 어깨 중복 제거 — `shoulder-wrist` id를 `shoulder`/`wrist` 두 pain_site로 분리 (index.html + rehab.json 동기화)
- 프론트스쿼트 어깨 pain_site 재구성 — cause-a(흉추·어깨), cause-b(팔꿈치 굴곡근), test-fsw-elbow → cause-a
- 프론트스쿼트 손목 pain_site 신규 추가 — cause-a(손목 신전 제한), test-fsw-wrist → cause-a
- 용어사전 추가 — `C:\Users\tjfla\.claude\glossary\glossary.json` (id, 라우팅, JSON, pain_site, 인라인 데이터, fetch)

## 진행중
- 없음

## 대기
- why 텍스트 단계별 차별화 (Squat University 자료 미확보)
- Firebase 커뮤니티 기능
- 복합 원인 케이스 (발목+둔근 동시)
- 동작 영상/이미지
- rehab.json ↔ index.html fetch 방식 전환 (현재 인라인)

## 결정사항 / 주의
- 포인트 컬러: --navy #2C2C2C, --navy-light #444444 (차콜)
- 배경/카드는 라이트 테마 유지 (--bg #F5F6FA, --card #FFFFFF)
- pain_site id 기준: shoulder, wrist, knee, lower-back, ankle (front-squat에 wrist 추가됨)
- index.html이 단독 실행 파일 (rehab.json fetch 안 함 — 인라인 데이터 사용)
- JSON 인라인 수정 시 Python 스크립트로만 처리 (PowerShell 정규식 금지)
- cause id는 pain_site 스코프 내에서만 유효 (다른 pain_site의 cause-a와 충돌 없음)

## 다음 세션 권장 첫 프롬프트
`/resume` 후 "Squat University 자료 여기 있어요" + 붙여넣기, 또는 fetch 방식 전환 작업 시작
