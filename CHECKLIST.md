# SnapID UI 업데이트 완료 체크리스트

## ✅ 작업 완료 항목

### 공통 컴포넌트
- [x] IOSNavBar.tsx 생성
  - [x] props: title, leftLabel, onBack, rightElement
  - [x] 파란색 chevron + 라벨
  - [x] 중앙 타이틀 정렬
- [x] IOSGroupedList.tsx 생성
  - [x] 흰색 카드 배경
  - [x] 0.5px 구분선 (hairlineWidth)
  - [x] 체크마크 원 / chevron 조건부 렌더링

### OnboardingScreen
- [x] 슬라이드 텍스트 변경 ("AI 증명사진", "정확한 규격", "합리적 가격")
- [x] 설명 텍스트 Lovable 버전으로 변경
- [x] 도트 인디케이터 pill shape (w=22, h=7)
- [x] 버튼 iOS 스타일 (h=50, r=12)
- [x] 미니멀한 디자인 적용

### CameraScreen
- [x] iOS 네비게이션 바 추가 ("취소" + "증명사진")
- [x] 힌트 텍스트 2줄 변경
- [x] 뷰파인더 타원형 (borderRadius 50%)
- [x] 반투명 오버레이 (rgba(0,0,0,0.6))
- [x] 하단 컨트롤 버튼 스타일 변경
  - [x] 갤러리: 사각 라운드 (44x44, r=10)
  - [x] 셔터: 흰색 원 (68x68, 테두리)
  - [x] 전환: 원형 (44x44, r=22)
- [x] 배경 검정 (#000)
- [x] 버튼 배경 반투명 (rgba(255,255,255,0.15))

### FormatSelectScreen
- [x] IOSNavBar 사용 ("< 뒤로")
- [x] 큰 타이틀 (34px, bold)
- [x] 사진 미리보기 (88x114, 그림자)
- [x] iOS grouped list 스타일
  - [x] 체크마크 원 (22x22)
  - [x] chevron (›)
  - [x] 얇은 구분선 (0.5px)
- [x] 규격 데이터 (여권, 이력서, 비자, 커스텀)
- [x] 하단 "다음" 버튼

### ResultScreen
- [x] IOSNavBar 사용 ("결과")
- [x] 규격 정보 표시 (작은 텍스트)
- [x] 사진 미리보기 (220x286, rounded-xl)
- [x] 로딩 상태 (2초, ActivityIndicator)
- [x] 배경색 선택 pill 버튼 3개
  - [x] 작은 색상 원 (12x12)
  - [x] 선택 시 primary 배경
- [x] 액션 버튼 2개 (다운로드 + 공유)
- [x] 프리미엄 유도 텍스트 + 링크

### PaymentScreen
- [x] IOSNavBar 사용 ("프리미엄")
- [x] 서브타이틀
- [x] 플랜 카드 라디오 버튼 스타일
  - [x] 라디오 원형 (22x22)
  - [x] 선택 시 배경색 + 보더
  - [x] "인기" 뱃지
  - [x] 가격 오른쪽 정렬
- [x] 포함 사항 iOS grouped list
  - [x] 초록 체크 원 (#22C55E)
  - [x] 4개 항목
- [x] "결제 시스템 준비 중" 텍스트
- [x] disabled 버튼
- [x] "구독 취소 가능" 텍스트

## ✅ 기술 요구사항

### 변환 작업
- [x] Tailwind CSS → React Native StyleSheet
- [x] boxShadow → shadowColor/shadowOffset/shadowOpacity/shadowRadius
- [x] borderRadius 50% → 절대 픽셀 값
- [x] lucide-react → emoji/Text

### 타입 안전성
- [x] TypeScript 에러 없음 (npx tsc --noEmit 통과)
- [x] PhotoFormat 타입 정의 준수
- [x] 모든 props 타입 정의

### 기능 유지
- [x] 카메라 권한 요청
- [x] 사진 촬영 기능
- [x] 갤러리 선택 기능
- [x] 카메라 전환 기능
- [x] 네비게이션 동작 (뒤로가기)

## ✅ 디자인 시스템

### 색상
- [x] Primary: #2563EB
- [x] Background: #F8FAFC
- [x] Text: #1E293B
- [x] TextSecondary: #64748B

### 타이포그래피
- [x] 큰 타이틀: 34px, bold
- [x] 일반 텍스트: 17px
- [x] 보조 텍스트: 13px
- [x] 작은 텍스트: 11px

### 컴포넌트
- [x] 버튼: height 50px, borderRadius 12px
- [x] 카드: borderRadius 10-12px
- [x] 구분선: hairlineWidth, #E5E7EB
- [x] 그림자: opacity 0.08-0.1, radius 12-24

## ✅ 문서화
- [x] UI_UPDATE_SUMMARY.md 작성
- [x] CHANGES.md 작성
- [x] CHECKLIST.md 작성

## ⏭️ 향후 개선 사항 (선택)

### 애니메이션
- [ ] page-enter 전환 효과
- [ ] 배경색 변경 fade
- [ ] 로딩 스피너 회전

### 접근성
- [ ] accessibilityLabel 추가
- [ ] accessibilityRole 명시
- [ ] VoiceOver 지원

### 다크 모드
- [ ] useColorScheme hook
- [ ] 색상 동적 변환

### 국제화
- [ ] i18n 라이브러리
- [ ] 텍스트 외부화

---

**모든 필수 항목 완료**: ✅  
**TypeScript 검증 통과**: ✅  
**프로덕션 준비 상태**: ✅

**최종 업데이트**: 2026-03-21
