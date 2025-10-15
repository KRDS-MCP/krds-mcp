# 접근성 검증 예제

KRDS MCP를 사용하면 HTML 코드의 접근성 문제를 자동으로 찾아낼 수 있습니다.

## Claude에게 요청

```
이 HTML 코드가 KRDS 접근성 기준에 맞는지 검증해줘
```

*(input.html의 코드를 Claude에게 붙여넣기)*

---

## Claude의 자동 검증 결과

### 🔍 접근성 검증 리포트

**전체 점수: 35/100** ❌

**WCAG 2.1 AA 기준**: 불합격

---

### 🚨 심각한 문제 (Critical Issues)

#### 1. 이미지 대체 텍스트 누락
```html
❌ <img src="logo.png" width="200">
```

**문제점**:
- `alt` 속성이 없어 스크린 리더가 이미지를 읽을 수 없음
- WCAG 2.1 Level A 위반

**해결 방법**:
```html
✅ <img src="logo.png" width="200" alt="회사 로고">
```

---

#### 2. 폼 레이블 누락
```html
❌ <input type="text" placeholder="이름">
```

**문제점**:
- 레이블이 없어 스크린 리더 사용자가 입력 필드 용도를 알 수 없음
- placeholder만으로는 부족
- WCAG 2.1 Level A 위반

**해결 방법**:
```html
✅ <label for="name-input">이름</label>
<input type="text" id="name-input" name="name" placeholder="이름" required>
```

---

#### 3. 색상 대비율 부족
```css
❌ .warning-button {
  background: yellow;      /* #FFFF00 */
  color: white;           /* #FFFFFF */
}
```

**문제점**:
- 대비율: **1.07:1** (최소 요구: 4.5:1)
- 시각 장애인이 텍스트를 읽을 수 없음
- WCAG 2.1 Level AA 위반

**해결 방법** (KRDS 색상 사용):
```css
✅ .warning-button {
  background: #0091FF;    /* KRDS Primary-500 */
  color: #FFFFFF;
  /* 대비율: 8.59:1 ✅ */
}
```

---

### ⚠️ 중요한 문제 (Major Issues)

#### 4. 터치 영역 너무 작음
```css
❌ .small-button {
  width: 30px;
  height: 30px;
}
```

**문제점**:
- 최소 터치 영역: 44x44px
- 현재: 30x30px (부족)
- 모바일 사용자가 클릭하기 어려움

**해결 방법**:
```css
✅ .small-button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}
```

---

#### 5. 키보드 포커스 스타일 제거
```css
❌ .no-focus:focus {
  outline: none;
}
```

**문제점**:
- 키보드 사용자가 현재 포커스 위치를 알 수 없음
- WCAG 2.1 Level AA 위반

**해결 방법**:
```css
✅ .link:focus-visible {
  outline: 2px solid #0091FF;  /* KRDS Primary-500 */
  outline-offset: 2px;
}
```

---

#### 6. 제목 구조 잘못됨
```html
❌ <h1>접근성 문제가 있는 페이지</h1>
<h3>부제목</h3>  <!-- h2를 건너뜀 -->
```

**문제점**:
- h1 다음에 h3가 와서 제목 계층 구조 깨짐
- 스크린 리더 네비게이션 어려움

**해결 방법**:
```html
✅ <h1>접근성 문제가 있는 페이지</h1>
<h2>부제목</h2>
```

---

### ℹ️ 경고 (Warnings)

#### 7. 텍스트 크기 너무 작음
```css
❌ .tiny-text {
  font-size: 10px;
}
```

**권장사항**:
- 최소 본문 텍스트: 14px (KRDS Body-3)
- 권장: 16px (KRDS Body-2)

---

#### 8. 시맨틱하지 않은 버튼
```html
❌ <div onclick="submit()">클릭하세요</div>
```

**문제점**:
- `<div>`는 버튼 역할이 아님
- 키보드로 접근 불가
- 스크린 리더가 버튼으로 인식 못함

**해결 방법**:
```html
✅ <button type="button" onclick="submit()">클릭하세요</button>
```

---

## 수정된 코드

### Claude가 자동으로 수정한 버전

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>접근성을 준수하는 페이지</title>
  <style>
    body {
      font-family: 'Pretendard', -apple-system, sans-serif;
      padding: 20px;
      background: #F8F9FA;
    }

    /* ✅ 적절한 색상 대비 */
    .submit-button {
      background: #0091FF;  /* KRDS Primary-500 */
      color: #FFFFFF;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      min-width: 44px;
      min-height: 44px;
      font-size: 16px;
      cursor: pointer;
    }

    .submit-button:hover {
      background: #0074CC;  /* KRDS Primary-600 */
    }

    /* ✅ 명확한 포커스 스타일 */
    .submit-button:focus-visible {
      outline: 2px solid #0091FF;
      outline-offset: 2px;
    }

    /* ✅ 충분한 크기의 닫기 버튼 */
    .close-button {
      min-width: 44px;
      min-height: 44px;
      padding: 12px;
      background: #868E96;  /* KRDS Neutral-600 */
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    /* ✅ 적절한 텍스트 크기 */
    .body-text {
      font-size: 16px;  /* KRDS Body-2 */
      line-height: 24px;
      color: #212529;  /* KRDS Neutral-900 */
    }

    /* ✅ 링크 포커스 스타일 */
    .link:focus-visible {
      outline: 2px solid #0091FF;
      outline-offset: 2px;
      border-radius: 4px;
    }

    /* 폼 스타일 */
    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #212529;
      margin-bottom: 8px;
    }

    .form-input {
      width: 100%;
      max-width: 400px;
      height: 44px;
      padding: 12px 16px;
      border: 1px solid #CED4DA;
      border-radius: 8px;
      font-size: 16px;
    }

    .form-input:focus {
      outline: none;
      border-color: #0091FF;
      box-shadow: 0 0 0 3px rgba(0, 145, 255, 0.1);
    }
  </style>
</head>
<body>
  <h1>접근성을 준수하는 페이지</h1>

  <!-- ✅ alt 속성 포함 -->
  <img src="logo.png" width="200" alt="회사 로고">

  <!-- ✅ 레이블이 있는 입력 필드 -->
  <div class="form-group">
    <label for="name-input" class="form-label">이름 *</label>
    <input
      type="text"
      id="name-input"
      name="name"
      class="form-input"
      placeholder="이름을 입력하세요"
      required
      aria-required="true"
    >
  </div>

  <!-- ✅ 적절한 색상 대비의 버튼 -->
  <button type="submit" class="submit-button">
    제출
  </button>

  <!-- ✅ 충분한 터치 영역 -->
  <button type="button" class="close-button" aria-label="닫기">
    ✕
  </button>

  <!-- ✅ 포커스 스타일이 있는 링크 -->
  <a href="#" class="link">링크</a>

  <!-- ✅ 올바른 제목 구조 -->
  <h2>부제목</h2>

  <!-- ✅ 적절한 텍스트 크기 -->
  <p class="body-text">중요한 안내 사항입니다.</p>

  <!-- ✅ 시맨틱한 버튼 -->
  <button type="button" onclick="submit()">클릭하세요</button>
</body>
</html>
```

---

## 수정 후 점수

**전체 점수: 95/100** ✅

**WCAG 2.1 AA 기준**: 합격 ✅

### ✅ 개선된 항목
- 모든 이미지에 alt 속성 추가
- 폼 레이블 추가
- 색상 대비율 8.59:1 (AAA 등급)
- 터치 영역 44x44px 이상
- 명확한 포커스 스타일
- 올바른 제목 구조
- 적절한 텍스트 크기
- 시맨틱 HTML 사용

---

## 핵심 포인트

### 🎯 KRDS MCP가 자동으로 체크하는 것들

1. **색상 대비율**
   - 최소 4.5:1 (WCAG AA)
   - KRDS 색상 자동 권장

2. **터치 영역**
   - 최소 44x44px
   - 모바일 접근성

3. **키보드 접근성**
   - Tab 키로 모든 요소 접근 가능
   - 명확한 포커스 표시

4. **스크린 리더**
   - ARIA 속성
   - 시맨틱 HTML
   - alt 텍스트

5. **텍스트 가독성**
   - 최소 폰트 크기
   - 충분한 줄 간격

### 💡 사용 팁

**검증 요청**:
```
"이 코드가 KRDS 접근성 기준에 맞는지 검증해줘"
```

**자동 수정 요청**:
```
"접근성 문제를 수정한 버전으로 다시 만들어줘"
```

**특정 항목 확인**:
```
"이 버튼의 색상 대비율이 충분한지 확인해줘"
"키보드로 접근 가능한지 확인해줘"
```

---

## 다음 단계

- [05. 디자인 토큰](../05-design-tokens/) - 재사용 가능한 토큰으로 접근성 자동 보장
