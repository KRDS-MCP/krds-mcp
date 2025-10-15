# 기본 사용법: KRDS MCP와 첫 대화

이 예제는 KRDS MCP를 처음 사용하는 방법을 보여줍니다.

## 설정 확인

Claude Desktop에서 KRDS MCP가 제대로 설정되었는지 확인하세요.

**Claude에게 물어보기:**
```
KRDS MCP 서버가 연결되어 있나요?
```

**Claude의 응답:**
```
네, KRDS MCP 서버가 정상적으로 연결되어 있습니다.
다음 기능들을 사용할 수 있습니다:

✅ KRDS 디자인 원칙 조회
✅ 색상 시스템 정보
✅ 타이포그래피 가이드
✅ UI 컴포넌트 (37개)
✅ 디자인 패턴
✅ 접근성 검증
✅ 디자인 토큰
```

## 예제 1: 색상 정보 조회

### 질문
```
KRDS Primary 색상 팔레트를 알려줘
```

### Claude의 응답
```
KRDS Primary 색상 팔레트입니다:

🎨 Primary Colors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary-50:   #EEF9FF  (가장 밝은 파란색)
Primary-100:  #D9F1FF
Primary-200:  #B2E3FF
Primary-300:  #80CFFF
Primary-400:  #4DB8FF
Primary-500:  #0091FF  ⭐ 메인 컬러
Primary-600:  #0074CC
Primary-700:  #005799
Primary-800:  #003966
Primary-900:  #00172E  (가장 어두운 파란색)

📌 사용 권장사항:
- 버튼 배경: Primary-500
- 버튼 호버: Primary-600
- 버튼 눌림: Primary-700
- 링크 텍스트: Primary-500
- 비활성 상태: Primary-200

⚡ 접근성:
- Primary-500 + White: 대비율 8.59:1 ✅ (WCAG AAA)
- Primary-600 + White: 대비율 10.74:1 ✅ (WCAG AAA)
```

## 예제 2: 타이포그래피 정보

### 질문
```
KRDS 본문 텍스트에 사용할 타이포그래피 스타일 알려줘
```

### Claude의 응답
```
KRDS 본문 텍스트 타이포그래피 스타일입니다:

📝 Body Text Styles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Body-1 (큰 본문)
- 크기: 18px
- 줄 높이: 28px (1.56)
- 자간: -0.01em
- 용도: 중요한 본문, 인트로 텍스트

Body-2 (일반 본문) ⭐ 가장 많이 사용
- 크기: 16px
- 줄 높이: 24px (1.5)
- 자간: -0.01em
- 용도: 일반 본문, 설명 텍스트

Body-3 (작은 본문)
- 크기: 14px
- 줄 높이: 20px (1.43)
- 자간: -0.01em
- 용도: 보조 설명, 캡션

💡 CSS 예시:
```css
.body-text {
  font-family: 'Pretendard', -apple-system, sans-serif;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.01em;
  font-weight: 400;
}
```

🎯 권장 사항:
- 데스크톱: Body-2 사용
- 모바일: Body-3 사용 (가독성 고려)
- 강조: font-weight: 600 (SemiBold)
```

## 예제 3: 컴포넌트 검색

### 질문
```
KRDS에서 제공하는 버튼 컴포넌트 종류 알려줘
```

### Claude의 응답
```
KRDS 버튼 컴포넌트 정보입니다:

🔘 Button Component
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 크기 (Size)
- Large: 48px 높이, 패딩 16px 24px
- Medium: 40px 높이, 패딩 12px 20px ⭐ 기본
- Small: 32px 높이, 패딩 8px 16px

🎨 스타일 (Style)
1. Primary (메인 액션)
   - 배경: Primary-500
   - 텍스트: White
   - 용도: 가장 중요한 행동 (제출, 저장 등)

2. Secondary (보조 액션)
   - 배경: Transparent
   - 테두리: Primary-500
   - 텍스트: Primary-500
   - 용도: 뒤로가기, 취소 등

3. Tertiary (약한 액션)
   - 배경: Transparent
   - 텍스트: Primary-500
   - 용도: 부가 기능

🔄 상태 (State)
- Default: 기본 상태
- Hover: 배경 Primary-600
- Active: 배경 Primary-700
- Disabled: 불투명도 0.4
- Focus: 외곽선 2px Primary-500

♿ 접근성
- 최소 터치 영역: 44x44px
- 키보드 포커스 가능
- ARIA 레이블 필수
```

## 예제 4: 빠른 컴포넌트 생성

### 질문
```
KRDS Primary 버튼 Medium 크기로 HTML 코드 만들어줘
```

### Claude의 응답
```html
<!-- KRDS Primary Button (Medium) -->
<button
  type="button"
  class="krds-button krds-button--primary krds-button--medium"
  aria-label="버튼 설명"
>
  버튼 텍스트
</button>

<style>
.krds-button {
  /* 기본 스타일 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-family: 'Pretendard', -apple-system, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  /* 접근성 */
  min-width: 44px;
  min-height: 44px;
}

.krds-button--medium {
  height: 40px;
  padding: 12px 20px;
  font-size: 16px;
  line-height: 16px;
}

.krds-button--primary {
  background-color: #0091FF;  /* Primary-500 */
  color: #FFFFFF;
}

.krds-button--primary:hover {
  background-color: #0074CC;  /* Primary-600 */
}

.krds-button--primary:active {
  background-color: #005799;  /* Primary-700 */
}

.krds-button--primary:focus-visible {
  outline: 2px solid #0091FF;
  outline-offset: 2px;
}

.krds-button--primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
```

✅ 이 버튼은:
- KRDS Primary 색상 사용
- 접근성 기준 준수 (44x44px 이상)
- 키보드 포커스 지원
- 호버/액티브 상태 정의
- 디스에이블 상태 처리
```

## 더 복잡한 질문도 가능

### 질문
```
정부 민원 신청 페이지의 헤더를 KRDS 기준으로 만들어줘.
로고, 메뉴, 로그인 버튼이 필요해.
```

### Claude의 응답
완전한 KRDS 준수 헤더 HTML/CSS를 생성합니다:
- GNB 글로벌 패턴 적용
- Primary 색상 사용
- 타이포그래피 규칙 준수
- 접근성 속성 자동 포함
- 반응형 디자인 적용

(전체 코드는 [02-government-website](../02-government-website/) 예제 참조)

## 핵심 포인트

### ✅ 할 수 있는 것
- KRDS 가이드라인 정보 조회
- 컴포넌트 자동 생성
- 접근성 자동 검증
- 디자인 토큰 조회
- HTML/CSS 코드 생성

### ❌ 할 수 없는 것
- JavaScript 로직 실행
- 파일 시스템 접근
- 외부 API 호출
- 이미지 생성

## 다음 단계

- [02. 정부 웹사이트 개발](../02-government-website/) - 실제 페이지 만들기
- [03. 컴포넌트 생성](../03-component-generation/) - 다양한 컴포넌트 예제
- [04. 접근성 검증](../04-accessibility-check/) - 접근성 자동 체크
