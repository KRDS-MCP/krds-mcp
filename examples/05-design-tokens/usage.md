# 디자인 토큰 활용 예제

KRDS 디자인 토큰을 사용하면 일관된 디자인 시스템을 쉽게 구축할 수 있습니다.

## 디자인 토큰이란?

디자인 토큰은 **디자인 결정을 코드로 표현한 변수**입니다.
색상, 타이포그래피, 간격 등을 토큰으로 정의하면:

✅ **일관성**: 모든 페이지에서 동일한 스타일
✅ **유지보수**: 한 곳만 수정하면 전체 적용
✅ **확장성**: 다크모드, 테마 쉽게 추가
✅ **자동화**: 디자인 변경사항 자동 반영

---

## 예제 1: CSS 변수로 토큰 생성

### Claude에게 요청

```
KRDS 디자인 토큰을 CSS 변수로 만들어줘.
색상, 타이포그래피, 간격 모두 포함해줘.
```

### 자동 생성된 결과

```css
:root {
  /* ============================================
     KRDS Design Tokens - Color System
     ============================================ */

  /* Primary Colors */
  --color-primary-50: #eef9ff;
  --color-primary-100: #d9f1ff;
  --color-primary-200: #b2e3ff;
  --color-primary-300: #80cfff;
  --color-primary-400: #4db8ff;
  --color-primary-500: #0091ff; /* Main */
  --color-primary-600: #0074cc;
  --color-primary-700: #005799;
  --color-primary-800: #003966;
  --color-primary-900: #00172e;

  /* System Colors */
  --color-success: #15b371;
  --color-success-light: #d4f5e9;
  --color-warning: #f59f00;
  --color-warning-light: #fff3d4;
  --color-error: #f03e3e;
  --color-error-light: #ffe3e3;
  --color-info: #0091ff;
  --color-info-light: #eef9ff;

  /* Neutral Colors */
  --color-neutral-50: #f8f9fa;
  --color-neutral-100: #f1f3f5;
  --color-neutral-200: #e9ecef;
  --color-neutral-300: #dee2e6;
  --color-neutral-400: #ced4da;
  --color-neutral-500: #adb5bd;
  --color-neutral-600: #868e96;
  --color-neutral-700: #495057;
  --color-neutral-800: #343a40;
  --color-neutral-900: #212529;

  /* ============================================
     Typography Tokens
     ============================================ */

  /* Font Families */
  --font-family-base: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: 'Pretendard', 'SF Mono', Consolas, monospace;

  /* Font Sizes */
  --font-size-display-1: 64px;
  --font-size-display-2: 56px;
  --font-size-heading-1: 48px;
  --font-size-heading-2: 40px;
  --font-size-heading-3: 32px;
  --font-size-heading-4: 28px;
  --font-size-heading-5: 24px;
  --font-size-heading-6: 20px;
  --font-size-body-1: 18px;
  --font-size-body-2: 16px;
  --font-size-body-3: 14px;
  --font-size-caption: 12px;

  /* Line Heights */
  --line-height-display: 1.2;
  --line-height-heading: 1.3;
  --line-height-body: 1.5;
  --line-height-tight: 1.25;

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ============================================
     Spacing Tokens
     ============================================ */

  --spacing-0: 0px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;

  /* ============================================
     Sizing Tokens
     ============================================ */

  --size-button-small: 32px;
  --size-button-medium: 40px;
  --size-button-large: 48px;
  --size-input: 44px;
  --size-icon-small: 16px;
  --size-icon-medium: 24px;
  --size-icon-large: 32px;

  /* ============================================
     Border Tokens
     ============================================ */

  --border-radius-small: 4px;
  --border-radius-medium: 8px;
  --border-radius-large: 12px;
  --border-radius-xlarge: 16px;
  --border-radius-full: 9999px;

  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;

  /* ============================================
     Shadow Tokens
     ============================================ */

  --shadow-small: 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.12);
  --shadow-large: 0 8px 16px rgba(0, 0, 0, 0.16);
  --shadow-xlarge: 0 12px 24px rgba(0, 0, 0, 0.2);
  --shadow-focus: 0 0 0 3px rgba(0, 145, 255, 0.1);

  /* ============================================
     Motion Tokens
     ============================================ */

  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;

  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 예제 2: 토큰을 사용한 컴포넌트

### 토큰 활용 전

```css
/* ❌ 하드코딩된 값 */
.button {
  background: #0091ff;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.button:hover {
  background: #0074cc;
}
```

### 토큰 활용 후

```css
/* ✅ 토큰 사용 */
.button {
  background: var(--color-primary-500);
  padding: var(--spacing-3) var(--spacing-5);
  border-radius: var(--border-radius-medium);
  font-size: var(--font-size-body-2);
  transition: all var(--duration-fast) var(--easing-default);
}

.button:hover {
  background: var(--color-primary-600);
}
```

**장점**:

- 🎨 색상 변경 시 한 곳만 수정
- 📏 일관된 간격 유지
- ⚡ 일관된 애니메이션
- 🔄 다크모드 쉽게 추가

---

## 예제 3: 다크모드 토큰

### Claude에게 요청

```
위의 디자인 토큰에 다크모드 지원을 추가해줘
```

### 자동 생성된 결과

```css
:root {
  /* Light Mode (기본) */
  --color-background: var(--color-neutral-50);
  --color-surface: #ffffff;
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-700);
  --color-border: var(--color-neutral-300);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #121212;
    --color-surface: #1e1e1e;
    --color-text-primary: #ffffff;
    --color-text-secondary: var(--color-neutral-400);
    --color-border: var(--color-neutral-700);

    /* Primary colors adjusted for dark mode */
    --color-primary-500: #4db8ff;
    --color-primary-600: #80cfff;
  }
}

/* 또는 수동 토글 */
[data-theme='dark'] {
  --color-background: #121212;
  --color-surface: #1e1e1e;
  --color-text-primary: #ffffff;
  --color-text-secondary: var(--color-neutral-400);
  --color-border: var(--color-neutral-700);
  --color-primary-500: #4db8ff;
}
```

### 사용 예제

```css
/* 자동으로 테마에 맞춰 변경됨 */
body {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.button-primary {
  background: var(--color-primary-500);
}
```

---

## 예제 4: JavaScript에서 토큰 사용

### Claude에게 요청

```
CSS 토큰을 JavaScript에서도 사용할 수 있게 JSON으로 변환해줘
```

### 자동 생성된 결과

```json
{
  "colors": {
    "primary": {
      "50": "#EEF9FF",
      "500": "#0091FF",
      "600": "#0074CC",
      "900": "#00172E"
    },
    "neutral": {
      "50": "#F8F9FA",
      "500": "#ADB5BD",
      "900": "#212529"
    }
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    "4": "16px",
    "6": "24px"
  },
  "typography": {
    "fontSize": {
      "body1": "18px",
      "body2": "16px",
      "body3": "14px"
    },
    "fontWeight": {
      "regular": 400,
      "semibold": 600
    }
  }
}
```

### JavaScript에서 사용

```javascript
import tokens from './tokens.json';

// 동적 스타일 적용
element.style.backgroundColor = tokens.colors.primary[500];
element.style.padding = tokens.spacing[4];
element.style.fontSize = tokens.typography.fontSize.body2;

// 또는 CSS 변수로 접근
const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500');
```

---

## 예제 5: 실전 - 전체 페이지에 토큰 적용

### output.css 참조

완성된 CSS 파일은 [output.css](./output.css)를 확인하세요.

```css
/* 토큰 기반 컴포넌트 */
.page-header {
  background: var(--color-surface);
  padding: var(--spacing-6) var(--spacing-4);
  border-bottom: var(--border-width-thin) solid var(--color-border);
  box-shadow: var(--shadow-small);
}

.page-title {
  font-size: var(--font-size-heading-2);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.button {
  height: var(--size-button-medium);
  padding: 0 var(--spacing-5);
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--border-radius-medium);
  font-size: var(--font-size-body-2);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background var(--duration-fast) var(--easing-default);
}

.button:hover {
  background: var(--color-primary-600);
}

.button:active {
  background: var(--color-primary-700);
}

.input {
  height: var(--size-input);
  padding: 0 var(--spacing-4);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-medium);
  font-size: var(--font-size-body-2);
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: border-color var(--duration-fast) var(--easing-default);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus);
}

.card {
  background: var(--color-surface);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-medium);
}
```

---

## 토큰 사용의 장점

### 🎨 테마 변경이 쉬움

```css
/* Primary 색상을 파란색에서 녹색으로 변경 */
:root {
  --color-primary-500: #15b371; /* 한 줄만 수정 */
  --color-primary-600: #12a065;
}
/* 모든 버튼, 링크, 아이콘이 자동 변경됨 */
```

### 📱 반응형 디자인

```css
/* 모바일에서 간격 조정 */
@media (max-width: 768px) {
  :root {
    --spacing-6: 16px; /* 24px → 16px */
    --font-size-heading-2: 32px; /* 40px → 32px */
  }
}
/* 모든 요소가 자동으로 조정됨 */
```

### 🌓 다크모드 자동 지원

```css
/* 라이트/다크 토큰만 바꾸면 끝 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #121212;
    --color-text-primary: #ffffff;
  }
}
```

### 🔧 유지보수 용이

```css
/* ❌ 하드코딩: 100군데 수정 필요 */
.button {
  font-size: 16px;
}
.input {
  font-size: 16px;
}
.text {
  font-size: 16px;
}
/* ...100 more... */

/* ✅ 토큰: 1군데만 수정 */
:root {
  --font-size-body-2: 18px; /* 16px → 18px */
}
```

---

## 다음 단계

### 💡 토큰을 더 활용하려면

1. **Style Dictionary 사용**
   - CSS, JSON, iOS, Android 등 다양한 포맷으로 export

2. **Figma 연동**
   - 디자인 토큰을 Figma에서 자동 가져오기

3. **자동화**
   - CI/CD 파이프라인에 토큰 빌드 추가

### 🎯 Claude에게 물어보세요

```
"KRDS 토큰으로 다크모드 토글 버튼 만들어줘"
"토큰을 Sass 변수로 변환해줘"
"React styled-components에서 토큰 사용하는 방법 알려줘"
```
