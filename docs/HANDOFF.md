# HANDOFF - 2026-05-07 HH:MM

## 완료
- 페르소나 5개(박지수·김태훈·이민지·최동현·Sarah) UX 피드백 분석
- danger 위험 신호 사전 체크 화면 추가 (`red_flag` 스크린 — 부기·열감·야간통증·관절잠김·외상)
- 진행률 역행 버그 수정 — route/complete 단계 기반 동적 계산
- complete 화면에 단계 전환 기간 안내 ("맨몸 단계를 1~2주 반복 후 넘어가세요")
- complete 화면에 "이 단계 운동 다시 보기" 버튼 추가
- 단계 표시 바 클릭으로 이전 단계 이동 가능 (`jumpToStage()`)
- 포인트 컬러 네이비 → 차콜 (#2C2C2C / hover #444444) 변경

## 진행중
- 없음

## 대기
- why 텍스트 단계별 차별화 (Squat University 자료 아직 미확보)
- 전문 용어 괄호 병기 ("배측굴곡(발목 앞으로 구부리기)" 식)
- Firebase 커뮤니티 기능
- 복합 원인 케이스 (발목+둔근 동시)
- 동작 영상/이미지

## 결정사항 / 주의
- 포인트 컬러: --navy #2C2C2C, --navy-light #444444 (차콜)
- 배경/카드는 원래 라이트 테마 유지 (--bg #F5F6FA, --card #FFFFFF)
- danger 화면: red_flag 경유 시 isRedFlagDanger=true → 별도 범용 메시지 표시
- 단계 이동: 완료한 단계만 클릭 가능 (미래 단계 잠금)
- JSON 인라인 수정 시 Python 스크립트로만 처리 (PowerShell 정규식 금지)

## 다음 세션 권장 첫 프롬프트
`/resume` 후 "Squat University 자료 여기 있어요" + 붙여넣기, 또는 전문 용어 괄호 병기 작업 시작
