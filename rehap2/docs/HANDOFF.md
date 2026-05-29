# HANDOFF - 2026-05-29 22:00

## 완료
- 네이버 OAuth 리다이렉트 시 스플래시 건너뜀 (인라인 스크립트, index.html + rehap1 루트 배포)
- 하단 탭바 추가: 기록·재활·추이 3탭 (rehap2/index.html)
- 기록 탭: 달력 + 일별 로그 + 기록 추가 모달 (러닝/크로스핏)
- 추이 탭: 종목별 무게 SVG 차트 (sportslogs 데이터 연동)
- 운동일기 앱(00.sports) 핵심 기능 rehap2에 이식 (lfXxx 네임스페이스)
- 랜딩 화면 제거 → 로그인 직접 진입
- 데모 로그인 시 샘플 데이터 자동 시딩 (lfStartDemo)
- 로그아웃 → 홈 상단 우측 작은 버튼으로 이동

## 진행중
- 데모 샘플 데이터 확인 중
  - 중단 지점: `rehap2/index.html` lfStartDemo 함수
  - 다음 스텝: file:// 보안 이슈로 `python -m http.server 8080` 로컬서버로 테스트 권장

## 대기
- 카카오·구글 OAuth 백엔드 연동 (현재 "준비 중" 토스트)
- 추이 탭 종목 관리 기능 (삭제·병합 등)
- 기록 탭 수정 기능 (현재 삭제만 가능)
- press-vertical.json elbow coming_soon 원복 여부 확인
- 실제 운동 영상 URL 데이터 입력
- rehap1 → rehap2 동기화 (rehap2 변경사항 배포 여부 결정)

## 결정사항 / 주의
- 앱 이름: LogFit (로그핏) — 운동 전반 타겟
- rehap2: 로컬 전용 디자인/프론트 작업공간 (배포 없음)
- rehap1: GitHub Pages(rimseorim.github.io/rahap1) + Railway 배포 중
- 기록 데이터: localStorage 키 `sportslogs` (운동일기 앱과 동일 스키마)
- 탭 상태: S.tab ('diary'|'rehab'|'weight'), DIARY_VIEW_YEAR/MONTH/SELECTED 전역변수
- file://로 열면 JS 제한 있음 → 로컬서버 필요
- 주 색상: 차콜 #2C2C2C + 흰색 + 파란색 #4A7FC1

## 다음 세션 권장 첫 프롬프트
`/resume`
