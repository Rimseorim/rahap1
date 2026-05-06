# HANDOFF - 2026-05-06 16:30

## 완료
- Python 설치 및 PATH 설정 (앱 실행 별칭 해제)
- ~/.claude/settings.json hook 경로 수정 (`김서림` → `tjfla`) — Stop/SessionStart/UserPromptSubmit 3개

## 진행중
- why 재작성 준비 중 — 레퍼런스 탐색 단계에서 중단
  - 중단 지점: `index.html` 내 "why" 필드 (328번 줄~)
  - 다음 스텝: Squat University 자료 찾아서 붙여주면 원인 유형 3개(발목가동성·둔근활성화·과부하) why 일괄 재작성

## 대기
- Firebase 커뮤니티 기능
- 복합 원인 케이스 (발목+둔근 동시)
- 동작 영상/이미지

## 결정사항 / 주의
- Barbell Rehab 운영자는 Michael Mash (유료), Jordan Shallow는 별개 인물
- why 재작성 레퍼런스: Squat University (Aaron Horschig) 우선 — 무료, 크로스핏 특화
- JSON 인라인 수정 시 Python 스크립트로만 처리 (PowerShell 정규식 금지)
- hook 파일 위치: `C:/Users/tjfla/.claude/hooks/` (3개 py 파일 존재 확인)

## 다음 세션 권장 첫 프롬프트
`/resume` 후 "Squat University 자료 여기 있어요" + 붙여넣기
