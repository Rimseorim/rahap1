# HANDOFF - 2026-05-20 19:00

## 완료

### 동작/콘텐츠
- 스쿼트 3종 → 스쿼트 단일화
- 런지·데드리프트·풀업·키핑·로우 추가
- 프레스 → 수직 프레스 / 수평 프레스 분리
- 전 동작 허리·어깨·무릎·고관절·발목·손목·팔꿈치 재활 콘텐츠 완성
- 수평 프레스 흉근 콘텐츠 완성 (대흉근 건병증·소흉근 과긴장·과사용)
- 스쿼트 무릎 한발스쿼트 테스트 → 트렌델렌버그 테스트 교체
- demo 계정 백엔드 401 수정 (get_current_user demo 예외 처리)
- 네이버 로그인 팝업 시도 → 인앱 차단 확인 → 리다이렉트 방식 복원
- 네이버 테스터 아이디 등록 확인 (localhost는 등록 불가, GitHub Pages에서만 가능)

### UI 개선
- 홈 화면: 시간대별 인사, movementNames 전체 추가, 진행 카드 개선
- 랜딩: 히어로 "부상→원인→재활루틴" 칩 + "박스에서 5분 안에 시작하세요"
- 랜딩: 2×2 카드 → Tabler Icons 리스트 스타일 (ti-bandage, ti-help-circle, ti-list-check)
- 맥락 바 추가: 동작선택·질문·테스트·원인·루트 화면 상단에 "무릎 › 스쿼트" 칩
- 재활 루트 아코디언: 첫 번째 운동만 기본 열림, 화살표 애니메이션
- 버튼: 높이 56px→46px, 간격 10px→6px, 테두리 1.5px→1px
- 동작 선택 영어 서브텍스트 제거 (버튼 높이 통일)
- 아이콘: 이모지 → Tabler Icons 시도 → 이모지로 복원 (휑한 느낌에 아이콘 제거)
- 네이버 로그인 버튼 크기 강조 (height 60px)
- red flag 화면: 증상 목록 읽기용으로 변경 + 해당있어요/없어요 2버튼

## 진행중
- UI 개선 계속 중
  - 중단 지점: red flag 화면 개선 완료 상태
  - 다음 스텝: 홈 화면 개선 (기록 없을 때 휑함) 또는 기타 UI 항목

## 대기
- 런지·데드리프트·풀업·키핑·로우 고관절 콘텐츠 (해당 동작에 고관절 없음)
- PostgreSQL 전환 (현재 SQLite ephemeral — 서버 재시작 시 초기화)
- 네이버 앱 검수 신청 (현재 개발 중 — 등록된 테스터만 로그인 가능)
- 커뮤니티 기능
- 복합 원인 케이스
- why 텍스트 단계별 차별화

## 결정사항 / 주의
- API URL: `https://web-production-28002.up.railway.app`
- 네이버 콜백 URL: `https://web-production-28002.up.railway.app/auth/naver/callback`
- 네이버 서비스 URL: `https://rimseorim.github.io`
- 로컬(localhost:8080)에서는 네이버 로그인 불가 — demo 계정으로 테스트
- demo 계정: kim@rehab.com / 1234 (백엔드 demo 예외 처리 완료)
- JSON 수정은 Python 스크립트로만 (PowerShell 인코딩 깨짐)
- 포인트 컬러: --navy #2C2C2C, --accent #4A7FC1
- 동작 ID: squat, lunge, deadlift, pullup, kipping, press-vertical, press-horizontal, row
- 통증 부위 ID: knee, lower-back, ankle, shoulder, wrist, elbow, hip, chest
- 수평 프레스에만 흉근(chest) 통증 부위 포함

## 다음 세션 권장 첫 프롬프트
`/resume` 후 "홈 화면 개선" 또는 "UI 개선 계속"
