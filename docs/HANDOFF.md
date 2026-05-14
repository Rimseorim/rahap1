# HANDOFF - 2026-05-14 18:00

## 완료
- 어깨 재활 가이드 → 3개 종목 shoulder pain_site 전면 교체 (DP/DN 분기, Case 1~4)
- rehab.json → 종목별 JSON 분리 + manifest.json fetch 방식 전환 (index.html 6007줄 → 707줄)
- FastAPI 백엔드 구축 (SQLite, JWT, /auth/signup, /auth/login, /records/save, /records/mine, /records/delete)
- 로그인/회원가입/랜딩/홈 화면 구현 및 UI 개편
- 홈 화면: 마지막 재활 기록 카드, 이어보기 기능
- 게스트 모드 추가 (로그인 없이 둘러보기)
- 프론트엔드 데모 계정 5개 하드코딩 (백엔드 없이 로그인 가능)
- GitHub Pages 배포 (https://rimseorim.github.io/health/)
- start.bat 추가 (서버 2개 한번에 실행)

## 진행중
- 데모 계정 로그인이 GitHub Pages에서 안 된다는 이슈
  - 중단 지점: `index.html` DEMO_ACCOUNTS + doLogin 함수
  - 다음 스텝: Ctrl+Shift+R 강력 새로고침 또는 배포 완료 확인 후 재테스트. 안 되면 브라우저 콘솔 에러 확인.

## 대기
- Railway 백엔드 배포 (현재 로컬에서만 돌아감)
- 재활 기록 stage_index 업데이트 연결
- 홈 화면 하단 빈 공간 채울 콘텐츠 결정 (최근 기록 미리보기 / 통계 / 빠른 시작 등)
- 커뮤니티 기능
- 종목 추가 (데드리프트, 클린 등) + category 필드
- why 텍스트 단계별 차별화
- 복합 원인 케이스

## 결정사항 / 주의
- 포인트 컬러: --navy #2C2C2C, --navy-light #444444
- 배경/카드 라이트 테마 유지
- pain_site id 기준: shoulder, wrist, knee, lower-back, ankle
- JSON 인라인 수정 시 Python 스크립트로만 처리 (PowerShell 정규식 금지)
- 데모 계정 비밀번호: 1234 (kim/lee/park/choi/jung @rehab.com)
- 백엔드는 localhost:8000, 프론트는 localhost:8080 — start.bat으로 한번에 실행
- GitHub Pages는 프론트만 배포됨. 백엔드 기능(기록 저장)은 로컬에서만 작동
- 재활 루트 진입 시점에 기록 저장 (원인 확정 시점 아님)
- 랜딩 → 로그인/회원가입 → 홈 구조. 비로그인은 게스트 모드로 감별만 가능

## 다음 세션 권장 첫 프롬프트
`/resume` 후 "데모 계정 로그인 GitHub Pages에서 확인" 또는 "Railway 백엔드 배포 시작"
