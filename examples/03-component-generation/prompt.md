# 컴포넌트 자동 생성 예제

KRDS MCP를 사용하면 KRDS 표준 컴포넌트를 빠르고 정확하게 생성할 수 있습니다.

## 예제 1: 기본 버튼 생성

### Claude에게 요청

```
KRDS Primary 버튼을 Medium 크기로 만들어줘.
텍스트는 "신청하기"로 하고, HTML과 CSS 모두 필요해.
```

### Claude의 응답 (자동 생성)

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KRDS Button Example</title>
    <style>
      /* KRDS 기본 설정 */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family:
          'Pretendard',
          -apple-system,
          BlinkMacSystemFont,
          sans-serif;
        padding: 40px;
        background-color: #f8f9fa;
      }

      /* KRDS Button Component */
      .krds-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        /* 접근성: 최소 터치 영역 */
        min-width: 44px;
        min-height: 44px;
      }

      /* Medium 크기 */
      .krds-button--medium {
        height: 40px;
        padding: 12px 20px;
        font-size: 16px;
        line-height: 16px;
      }

      /* Primary 스타일 */
      .krds-button--primary {
        background-color: #0091ff; /* KRDS Primary-500 */
        color: #ffffff;
      }

      .krds-button--primary:hover {
        background-color: #0074cc; /* KRDS Primary-600 */
      }

      .krds-button--primary:active {
        background-color: #005799; /* KRDS Primary-700 */
      }

      .krds-button--primary:focus-visible {
        outline: 2px solid #0091ff;
        outline-offset: 2px;
      }

      .krds-button--primary:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    </style>
  </head>
  <body>
    <button type="button" class="krds-button krds-button--medium krds-button--primary" aria-label="민원 신청하기">
      신청하기
    </button>
  </body>
</html>
```

✅ **자동으로 포함된 것들**:

- KRDS Primary-500 색상 (#0091FF)
- Medium 크기 규격 (40px 높이)
- 호버/액티브 상태 (Primary-600, Primary-700)
- 접근성: 최소 44x44px 터치 영역
- 키보드 포커스 스타일
- ARIA 레이블

---

## 예제 2: 입력 필드 생성

### Claude에게 요청

```
KRDS 텍스트 입력 필드를 만들어줘.
레이블은 "이름", 플레이스홀더는 "홍길동", 필수 항목이야.
```

### 자동 생성된 결과

```html
<!-- KRDS Input Field -->
<div class="krds-form-field">
  <label for="name-input" class="krds-label"> 이름 <span class="required" aria-label="필수">*</span> </label>
  <input
    type="text"
    id="name-input"
    name="name"
    class="krds-input"
    placeholder="홍길동"
    required
    aria-required="true"
    aria-describedby="name-help"
  />
  <p id="name-help" class="krds-helper-text">이름을 입력해주세요</p>
</div>

<style>
  .krds-form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }

  .krds-label {
    font-size: 14px;
    font-weight: 600;
    color: #212529; /* KRDS Neutral-900 */
    line-height: 20px;
  }

  .required {
    color: #f03e3e; /* KRDS System-Error */
  }

  .krds-input {
    height: 44px;
    padding: 12px 16px;
    border: 1px solid #ced4da; /* KRDS Neutral-400 */
    border-radius: 8px;
    font-size: 16px;
    line-height: 20px;
    color: #212529;
    background-color: #ffffff;
    transition: all 0.2s ease;
  }

  .krds-input:hover {
    border-color: #868e96; /* KRDS Neutral-600 */
  }

  .krds-input:focus {
    outline: none;
    border-color: #0091ff; /* KRDS Primary-500 */
    box-shadow: 0 0 0 3px rgba(0, 145, 255, 0.1);
  }

  .krds-input::placeholder {
    color: #adb5bd; /* KRDS Neutral-500 */
  }

  .krds-helper-text {
    font-size: 12px;
    color: #868e96; /* KRDS Neutral-600 */
    line-height: 16px;
  }
</style>
```

✅ **자동으로 포함된 것들**:

- 필수 표시 asterisk (\*)
- ARIA 속성 (aria-required, aria-describedby)
- 44px 최소 높이 (접근성)
- 포커스 상태 스타일
- Helper text 영역

---

## 예제 3: 카드 컴포넌트

### Claude에게 요청

```
KRDS 카드 컴포넌트를 만들어줘.
아이콘, 제목, 설명, 그리고 "자세히 보기" 버튼이 필요해.
```

### 자동 생성된 결과

```html
<!-- KRDS Card Component -->
<article class="krds-card">
  <div class="krds-card__icon">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#E7F5FF" />
      <path d="M20 12L20 28M12 20L28 20" stroke="#0091FF" stroke-width="2" stroke-linecap="round" />
    </svg>
  </div>

  <div class="krds-card__content">
    <h3 class="krds-card__title">서비스 제목</h3>
    <p class="krds-card__description">
      서비스에 대한 간단한 설명이 들어갑니다. 사용자가 이해하기 쉽도록 명확하게 작성합니다.
    </p>
  </div>

  <a href="#" class="krds-card__link" aria-label="서비스 제목 자세히 보기">
    자세히 보기
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  </a>
</article>

<style>
  .krds-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    background: #ffffff;
    border: 1px solid #dee2e6; /* KRDS Neutral-300 */
    border-radius: 12px;
    transition: all 0.2s ease;
  }

  .krds-card:hover {
    border-color: #0091ff; /* KRDS Primary-500 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .krds-card__icon {
    width: 40px;
    height: 40px;
  }

  .krds-card__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .krds-card__title {
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
    color: #212529; /* KRDS Neutral-900 */
    margin: 0;
  }

  .krds-card__description {
    font-size: 14px;
    line-height: 20px;
    color: #495057; /* KRDS Neutral-700 */
    margin: 0;
  }

  .krds-card__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #0091ff; /* KRDS Primary-500 */
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .krds-card__link:hover {
    color: #0074cc; /* KRDS Primary-600 */
  }

  .krds-card__link svg {
    transition: transform 0.2s ease;
  }

  .krds-card__link:hover svg {
    transform: translateX(2px);
  }
</style>
```

✅ **자동으로 포함된 것들**:

- 호버 애니메이션 (2px 상승, 그림자)
- 적절한 색상 및 타이포그래피
- ARIA 레이블
- 아이콘 호버 효과

---

## 예제 4: 다크모드 지원 버튼

### Claude에게 요청

```
KRDS 버튼을 만들되, 다크모드를 지원하도록 해줘.
```

### 자동 생성된 결과

```html
<!-- KRDS Button with Dark Mode Support -->
<button type="button" class="krds-button krds-button--primary krds-button--medium">신청하기</button>

<style>
  :root {
    /* Light Mode Colors */
    --primary-500: #0091ff;
    --primary-600: #0074cc;
    --primary-700: #005799;
    --text-on-primary: #ffffff;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      /* Dark Mode Colors */
      --primary-500: #4db8ff;
      --primary-600: #80cfff;
      --primary-700: #b2e3ff;
      --text-on-primary: #001f3f;
    }
  }

  .krds-button--primary {
    background-color: var(--primary-500);
    color: var(--text-on-primary);
  }

  .krds-button--primary:hover {
    background-color: var(--primary-600);
  }

  .krds-button--primary:active {
    background-color: var(--primary-700);
  }
</style>

<script>
  // 다크모드 토글 (선택사항)
  function toggleDarkMode() {
    document.documentElement.setAttribute(
      'data-theme',
      document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
  }
</script>
```

✅ **자동으로 포함된 것들**:

- CSS 변수로 테마 관리
- prefers-color-scheme 미디어 쿼리
- 다크모드 색상 자동 적용
- 접근성 유지 (대비율 준수)

---

## 빠른 팁

### 💡 더 구체적으로 요청하면 더 좋은 결과

**좋은 예**:

```
"KRDS Primary 버튼, Large 크기, 비활성 상태 포함,
아이콘(왼쪽)과 텍스트 조합으로 만들어줘"
```

**나쁜 예**:

```
"버튼 만들어줘"
```

### ⚡ 한 번에 여러 컴포넌트 요청 가능

```
"민원 신청 폼에 필요한 컴포넌트를 만들어줘:
- 이름 입력 필드 (필수)
- 이메일 입력 필드 (필수)
- 전화번호 입력 필드
- 신청 버튼 (Primary)
- 취소 버튼 (Secondary)"
```

### 🎨 변형 요청도 가능

```
"위에서 만든 버튼을 Secondary 스타일로 바꿔줘"
"입력 필드에 에러 상태를 추가해줘"
"카드를 가로 레이아웃으로 변경해줘"
```

---

## 다음 단계

- [04. 접근성 검증](../04-accessibility-check/) - 생성한 컴포넌트 검증하기
- [05. 디자인 토큰](../05-design-tokens/) - 재사용 가능한 토큰 활용하기
