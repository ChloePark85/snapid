# SnapID - AI 증명사진 생성기

## 프로젝트 구조

```
app/
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.tsx    # 3슬라이드 온보딩
│   │   ├── CameraScreen.tsx        # 카메라/갤러리 업로드
│   │   ├── FormatSelectScreen.tsx  # 규격 선택 (여권/이력서/비자)
│   │   ├── ResultScreen.tsx        # AI 처리 결과 미리보기
│   │   └── PaymentScreen.tsx       # 결제 화면 (placeholder)
│   ├── components/
│   │   ├── FaceGuide.tsx           # 얼굴 가이드 오버레이
│   │   └── FormatCard.tsx          # 규격 카드 컴포넌트
│   ├── navigation/
│   │   └── AppNavigator.tsx        # React Navigation 설정
│   ├── lib/
│   │   └── supabase.ts            # Supabase 클라이언트
│   ├── constants/
│   │   ├── colors.ts              # 컬러 상수
│   │   └── formats.ts             # 증명사진 규격 데이터
│   └── types/
│       └── index.ts               # TypeScript 타입
├── App.tsx                         # 엔트리포인트
└── app.json                        # Expo 설정
```

## 실행 방법

### 개발 서버 시작
```bash
npx expo start
```

### iOS 시뮬레이터에서 실행
```bash
npx expo start --ios
```

### Android 에뮬레이터에서 실행
```bash
npx expo start --android
```

### 웹에서 실행
```bash
npx expo start --web
```

## 주요 기능 (Phase 1 - MVP)

✅ **완료된 항목:**
- [x] Expo 프로젝트 초기화
- [x] 3슬라이드 온보딩 화면
- [x] 카메라/갤러리 업로드 기능
- [x] 규격 선택 UI (여권/이력서/비자/커스텀)
- [x] 결과 미리보기 화면 (배경색 선택)
- [x] 결제 화면 (placeholder)
- [x] React Navigation 설정
- [x] TypeScript 타입 정의
- [x] 컬러 및 포맷 상수
- [x] 카메라/갤러리 권한 요청

📝 **Phase 2 예정:**
- [ ] Supabase Auth 연동
- [ ] AI 배경 제거 Edge Function
- [ ] RevenueCat 인앱결제
- [ ] 실제 이미지 처리 및 저장
- [ ] TestFlight / 앱스토어 제출

## 디자인 시스템

- **Primary**: #2563EB (파란색)
- **Background**: #F8FAFC (밝은 배경)
- **Accent**: #10B981 (초록)
- **Text**: #1E293B
- **Button Height**: 56px
- **Border Radius**: 16px (카드), 28px (버튼)

## 패키지

- `expo-camera` - 카메라 촬영
- `expo-image-picker` - 갤러리 선택
- `expo-file-system` - 파일 저장
- `@react-navigation/native` - 네비게이션
- `@react-navigation/native-stack` - 네이티브 스택 네비게이터
- `react-native-screens` - 네이티브 화면
- `react-native-safe-area-context` - Safe Area
- `expo-linear-gradient` - 그라디언트
- `@supabase/supabase-js` - Supabase 클라이언트

## 환경 변수 설정 (Phase 2)

`.env` 파일 생성:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 문제 해결

### TypeScript 에러 확인
```bash
npx tsc --noEmit
```

### 캐시 삭제 후 재시작
```bash
npx expo start --clear
```

### 패키지 재설치
```bash
rm -rf node_modules package-lock.json
npm install
```
