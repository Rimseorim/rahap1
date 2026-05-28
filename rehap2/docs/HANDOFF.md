# HANDOFF - 2026-05-28 14:00

## 완료
- JSON 데이터 인라인 임베드 → index.html 직접 열기 가능 (서버 불필요) (ed9a793)
- 테스트 결과 버튼 초록/빨강 → 중립 파란색 통일 (aedce73)
- 전체 텍스트 색 #2C2C2C 단일화
- 스크롤 제어 (route/my_records만 허용, 나머지 고정)
- word-break: keep-all 전역 적용
- 운동 카드 간격·폰트 가독성 개선 (스텝 번호 색·간격, cue 동그라미 제거)
- 영상 모달 중앙 재생 아이콘(세모) 추가
- 로그인 오류 메시지 한국어화
- 데모 계정 CORS 에러 제거
- open.bat 삭제
- btn-primary flex-shrink:0 추가 (버튼 크기 눌림 방지)

## 진행중
- 없음

## 대기
- press-vertical.json elbow coming_soon: true 원복 필요 (테스트용 임시 설정, 배포 전 필수)
- 홈 화면 비주얼 개선 (보류 중)
- 실제 운동 영상 URL 데이터 입력 (현재 비어있음)
- 데이터 입력자에게 전달할 JSON 작성 작업

## 결정사항 / 주의
- rehap2는 디자인·프론트엔드 전용 (백엔드·배포 작업 없음)
- 주 색상: 차콜 #2C2C2C + 흰색 + 파란색 #4A7FC1
- 원격 저장소: github.com/Rimseorim/health (push 아직 안 함)
- index.html에 JSON 데이터 인라인 삽입되어 있어 파일 크기 큼 (~300KB)
- 데이터 변경 시 index.html 재생성 필요

## 다음 세션 권장 첫 프롬프트
/resume
