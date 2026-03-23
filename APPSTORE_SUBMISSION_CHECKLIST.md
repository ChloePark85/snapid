# SnapID 앱스토어 제출 체크리스트

## ✅ 완료된 항목

### 1. EAS Build 설정
- ✅ `eas.json` 생성 완료
- ✅ iOS production 빌드 설정 완료
- ✅ Apple Developer 계정 정보 입력됨 (ubik.collective.real@gmail.com)
- ⚠️ `ascAppId`와 `appleTeamId`는 EAS 빌드 시 자동으로 채워짐

### 2. 개인정보 처리방침
- ✅ `privacy-policy.html` 생성 완료 (한국어 + 영어)
- ✅ GitHub Pages 활성화 완료
- ✅ URL: https://chloepark85.github.io/snapid/privacy-policy.html
- ✅ 내용: 수집 정보, 사용 방법, 제3자 서비스, 데이터 보안, 보관 정책 포함

### 3. GitHub 리포지토리
- ✅ 리포지토리 생성: https://github.com/ChloePark85/snapid
- ✅ 코드 푸시 완료 (main 브랜치)
- ✅ Public repo로 설정 (GitHub Pages 사용 위해)
- ✅ 커밋 메시지: "feat: SnapID v1.0.0 - AI ID photo generator"

### 4. app.json 설정
- ✅ name: "SnapID"
- ✅ slug: "snapid"
- ✅ version: "1.0.0"
- ✅ icon: "./assets/icon.png"
- ✅ splash: "./assets/splash-icon.png"
- ✅ ios.bundleIdentifier: "com.snapid.app"
- ✅ ios.buildNumber: "1"
- ✅ 모든 권한 description 한국어로 설정됨
  - NSCameraUsageDescription: "증명사진 촬영을 위해 카메라 접근이 필요합니다."
  - NSPhotoLibraryUsageDescription: "사진을 선택하기 위해 갤러리 접근이 필요합니다."
  - NSPhotoLibraryAddUsageDescription: "생성된 증명사진을 저장하기 위해 갤러리 접근이 필요합니다."

### 5. 앱스토어 메타데이터
- ✅ `store-metadata.md` 생성 완료
- ✅ 앱 이름, 부제, 카테고리, 설명, 키워드 작성됨
- ✅ 개인정보 처리방침 URL 포함
- ✅ 프로모션 텍스트, What's New, 스크린샷 가이드 포함

### 6. TypeScript 빌드 확인
- ✅ `npx tsc --noEmit` 에러 없음
- ✅ `npx expo export --platform ios` 성공 (3.7MB 번들)

---

## 📋 다음 단계 (수동 작업 필요)

### 1. Apple Developer 계정 준비
- [ ] https://developer.apple.com 로그인
- [ ] Bundle ID 등록: `com.snapid.app`
- [ ] App ID 생성
- [ ] Team ID 확인
- [ ] App Store Connect에서 앱 생성

### 2. EAS 빌드 실행
```bash
# EAS CLI 로그인
npx eas-cli login

# iOS 프로덕션 빌드
npx eas-cli build --platform ios --profile production

# 빌드 완료 후 다운로드 링크 확인
```

### 3. 앱스토어 제출 준비
- [ ] 스크린샷 촬영 (iPhone 6.7" 디스플레이: 1290 x 2796 픽셀)
  - 메인 화면
  - 규격 선택 화면
  - 사진 촬영/선택 화면
  - AI 처리 중 화면
  - 완성된 증명사진 미리보기 화면
- [ ] 앱 아이콘 최종 확인 (1024x1024 픽셀)
- [ ] App Store Connect에 메타데이터 입력
  - 앱 이름, 부제, 설명 (`store-metadata.md` 참고)
  - 스크린샷 업로드
  - 개인정보 처리방침 URL: https://chloepark85.github.io/snapid/privacy-policy.html
  - 지원 URL: ubik.collective.real@gmail.com
  - 연령 등급: 4+
  - 카테고리: 사진 및 비디오

### 4. 테스트 계정 생성
- [ ] Supabase에서 테스트 계정 생성
  - Email: test@snapid.app
  - Password: TestUser123!
- [ ] App Review Notes에 테스트 계정 정보 제공

### 5. 결제 설정 (RevenueCat)
- [ ] RevenueCat 프로젝트 설정
- [ ] App Store Connect에서 인앱 결제 항목 생성:
  - 1장: ₩2,900
  - 3장 패키지: ₩5,900
  - 월정액: ₩9,900
- [ ] RevenueCat에서 Offering 설정

### 6. 제출 전 최종 체크
- [ ] 모든 링크 동작 확인
- [ ] 개인정보 처리방침 페이지 접근 가능 확인
- [ ] 앱 아이콘 및 스플래시 화면 확인
- [ ] 권한 요청 메시지 확인
- [ ] 테스트 계정으로 전체 플로우 테스트

---

## 📝 참고 자료

- **GitHub 리포지토리**: https://github.com/ChloePark85/snapid
- **개인정보 처리방침**: https://chloepark85.github.io/snapid/privacy-policy.html
- **앱스토어 메타데이터**: `/Users/autochloe/ubik-collective/projects/snapid/app/store-metadata.md`
- **EAS 설정**: `/Users/autochloe/ubik-collective/projects/snapid/app/eas.json`

---

## 🚨 중요 사항

1. **Bundle ID 변경 불가**: `com.snapid.app`로 이미 설정됨. Apple Developer에서 동일하게 등록해야 함.
2. **버전 관리**: 앱 업데이트 시 `app.json`의 `version`과 `buildNumber` 증가 필요.
3. **GitHub Pages**: 현재 public repo로 설정됨. 코드 공개가 문제되면 별도 호스팅 고려.
4. **테스트 계정**: App Review용 테스트 계정 반드시 생성 후 Review Notes에 제공.
5. **스크린샷**: 한국어 스크린샷 우선, 영어 선택사항.

---

## ✨ 작업 완료 일시
2026-03-23 20:59 KST
