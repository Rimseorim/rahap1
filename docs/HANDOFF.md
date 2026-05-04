# HANDOFF - 2026-05-04 23:59

## 완료
- 챕터1(감별 질문) → 챕터2(직접 테스트) → 원인 → 재활 루트 플로우 구현
- 12개 동작×부위 조합 전부 챕터2 테스트 추가 (physio-pedia 지식 기반, 맨몸 위주)
- 203개 운동 전부 how(어떻게) 필드 추가 — 단계별 텍스트 설명
- 203개 운동 why(왜) 전면 교체 — "통증 원인 + 하면 뭐가 좋아지나" 형식으로
- 진행 상태 저장 (localStorage) — "이어서 하기" 버튼
- 면책 문구 — 홈·원인·테스트·danger 화면
- 단계별 예상 기간 (약 1~2주 등) 표시
- 테스트 화면 "의료 진단이 아닙니다" 안내
- danger 화면 복귀 안내 추가
- 뒤로 가기 버튼 → 진행 바 우측 상단 원형 버튼으로 통합
- index.html 더블클릭으로 바로 열리게 JSON 인라인 처리
- NaN% 버그 수정 (S.maxDepth 미정의 제거)

## 진행중
- 없음 (이번 세션 작업 모두 완료)

## 대기
- Firebase 커뮤니티 기능 — 사용자가 고민 중, 결정 후 진행
- 동작 영상/이미지 — 저작권 문제로 보류
- 영어 지원 — 콘텐츠 더 쌓인 후 진행
- 복합 원인 대응 (발목+둔근 동시 등) — 미구현

## 결정사항 / 주의
- JSON을 index.html에 인라인 처리 중 — rehab.json 수정 시 반드시 아래 명령으로 재인라인 후 node 검증 필요:
  ```python
  init_pos = html.find('function init() {')
  data_pos = html.find('  DATA = ', init_pos)
  end_pos  = html.find(';\n  render();\n}', data_pos) + len(';\n  render();\n}')
  html = html[:data_pos] + f'  DATA = {json_str};\n  render();\n}}' + html[end_pos:]
  ```
- PowerShell 정규식으로 인라인 금지 — 함수 날아가는 버그 있었음
- 페르소나 피드백 받음 — 영상/이미지, 진행저장, 면책문구, 복합원인, 회복기간 → 영상/이미지 제외 전부 적용 완료

## 다음 세션 권장 첫 프롬프트
`/resume` 후 "Firebase 커뮤니티 기능 연동할게요" 또는 "복합 원인 케이스 추가하자"
