# HANDOFF - 2026-05-29 15:30

## 완료
- 로그인 화면 소셜 전환: 이메일/비밀번호 제거 → 카카오·네이버·구글 버튼만 (479a38b)
- 로그인 타이틀 가운데 정렬 + "간편 로그인" 서브텍스트 추가
- 로그인 하단 이용약관 동의 문구 추가
- 앱 하단 면책 문구("재활 보조 도구") 제거
- 스플래시 스크린 추가: LogFit/로그핏 + 로딩바 애니메이션 1.5s (479a38b)
- rehap2 → rehap1 coming_soon 전부 제거 후 덮어쓰기
- 앱 이름 LogFit(로그핏)으로 결정

## 진행중
- 없음

## 대기
- 하단 탭바 (기록·재활·추이) — 한 번 작업했다가 롤백, 재설계 필요
- 홈화면 설계 — 탭바 방향 정해진 후 진행
- 카카오·구글 OAuth 백엔드 연동 (현재 "준비 중" 토스트)
- press-vertical.json elbow coming_soon 원복 여부 확인 (rehap2 데이터)
- 실제 운동 영상 URL 데이터 입력

## 결정사항 / 주의
- 앱 이름: LogFit (로그핏) — 크로스핏 한정 아닌 운동 전반 타겟
- rehap2: 디자인·프론트엔드 전용 (로컬 파일, 배포 없음)
- rehap1: GitHub Pages(rimseorim.github.io/rehap1) + Railway 배포 중
- 네이버 OAuth FRONTEND_URL = https://rimseorim.github.io/rehap1
- 하단 탭바는 사진 레퍼런스 기반으로 재설계 예정 (기록·재활·추이)
- 주 색상: 차콜 #2C2C2C + 흰색 + 파란색 #4A7FC1

## 다음 세션 권장 첫 프롬프트
`/resume`
