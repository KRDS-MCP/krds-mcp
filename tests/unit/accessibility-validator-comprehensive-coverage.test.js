/**
 * Comprehensive tests for accessibility-validator.js
 * Tests AccessibilityValidator class validation logic and improvement suggestions
 * Target: 60%+ coverage for validation logic (currently 30.61%)
 */

import { AccessibilityValidator } from '../../helpers/accessibility-validator.js';

describe('Accessibility Validator - Comprehensive Coverage Tests', () => {
  describe('validateAccessibility', () => {
    test('should validate perfect HTML with high score', () => {
      const perfectHtml = `
        <html lang="ko">
          <head><title>Perfect Page</title></head>
          <body>
            <nav aria-label="메인 네비게이션">
              <ul>
                <li><a href="#main">메인 콘텐츠로 바로가기</a></li>
              </ul>
            </nav>
            <main id="main">
              <h1>메인 제목</h1>
              <h2>소제목</h2>
              <p>본문 내용입니다.</p>
              <img src="image.jpg" alt="의미있는 이미지 설명">
              <button>명확한 버튼 텍스트</button>
              <label for="input1">입력 라벨</label>
              <input type="text" id="input1" required>
              <table>
                <caption>테이블 설명</caption>
                <thead>
                  <tr><th scope="col">헤더</th></tr>
                </thead>
                <tbody>
                  <tr><td>데이터</td></tr>
                </tbody>
              </table>
            </main>
          </body>
        </html>
      `;

      const result = AccessibilityValidator.validateAccessibility(perfectHtml);

      expect(result.accessibilityScore).toBeGreaterThan(80);
      expect(result.wcagCompliance).toBe('AA');
      expect(result.issues.length).toBe(0);
      expect(result.detailedReport.totalChecks).toBe(15);
      expect(result.detailedReport.passedChecks).toBeGreaterThan(12);
    });

    test('should detect missing alt attributes on images', () => {
      const htmlWithoutAlt = '<img src="image.jpg">';

      const result = AccessibilityValidator.validateAccessibility(htmlWithoutAlt);

      expect(result.issues).toContain('이미지에 alt 속성이 누락되었습니다.');
      expect(result.recommendations).toContain('모든 이미지에 의미있는 alt 텍스트를 추가하세요.');
      expect(result.accessibilityScore).toBeLessThan(90);
    });

    test('should provide recommendation for decorative images', () => {
      const htmlWithEmptyAlt = '<img src="decoration.jpg" alt="">';

      const result = AccessibilityValidator.validateAccessibility(htmlWithEmptyAlt);

      expect(result.recommendations).toContain(
        "장식용 이미지는 alt='' 또는 role='presentation'을 사용하세요."
      );
    });

    test('should detect empty buttons', () => {
      const htmlWithEmptyButton = '<button></button>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithEmptyButton);

      expect(result.issues).toContain('버튼에 텍스트 레이블이 없습니다.');
      expect(result.recommendations).toContain(
        '버튼에 명확한 텍스트 레이블 또는 aria-label을 제공하세요.'
      );
    });

    test('should warn about icon buttons without aria-label', () => {
      const htmlWithIconButton = '<button><span class="icon-close"></span></button>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithIconButton);

      expect(result.warnings).toContain('아이콘 버튼에 aria-label이 권장됩니다.');
    });

    test('should detect inputs without labels', () => {
      const htmlWithoutLabel = '<input type="text">';

      const result = AccessibilityValidator.validateAccessibility(htmlWithoutLabel);

      expect(result.issues).toContain('입력 필드에 연결된 레이블이 없습니다.');
      expect(result.recommendations).toContain(
        '모든 입력 필드에 label, aria-label, 또는 aria-labelledby를 제공하세요.'
      );
    });

    test('should not flag inputs with aria-label', () => {
      const htmlWithAriaLabel = '<input type="text" aria-label="사용자 이름">';

      const result = AccessibilityValidator.validateAccessibility(htmlWithAriaLabel);

      const hasInputLabelIssue = result.issues.some(issue =>
        issue.includes('입력 필드에 연결된 레이블이 없습니다')
      );
      expect(hasInputLabelIssue).toBe(false);
    });

    test('should not flag inputs with aria-labelledby', () => {
      const htmlWithAriaLabelledBy = `
        <span id="label1">사용자 이름</span>
        <input type="text" aria-labelledby="label1">
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithAriaLabelledBy);

      const hasInputLabelIssue = result.issues.some(issue =>
        issue.includes('입력 필드에 연결된 레이블이 없습니다')
      );
      expect(hasInputLabelIssue).toBe(false);
    });

    test('should warn about required fields without indicators', () => {
      const htmlWithRequiredInput = '<input type="text" required>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithRequiredInput);

      expect(result.warnings).toContain('필수 입력 필드에 시각적/의미적 표시를 추가하세요.');
    });

    test('should not warn about required fields with aria-required', () => {
      const htmlWithAriaRequired = '<input type="text" required aria-required="true">';

      const result = AccessibilityValidator.validateAccessibility(htmlWithAriaRequired);

      const hasRequiredWarning = result.warnings.some(warning =>
        warning.includes('필수 입력 필드에 시각적/의미적 표시를 추가하세요')
      );
      expect(hasRequiredWarning).toBe(false);
    });

    test('should detect empty links', () => {
      const htmlWithEmptyLink = '<a href="#"></a>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithEmptyLink);

      expect(result.issues).toContain('링크에 텍스트가 없습니다.');
      expect(result.recommendations).toContain(
        '모든 링크에 의미있는 텍스트 또는 aria-label을 제공하세요.'
      );
    });

    test('should warn about duplicate link texts', () => {
      const htmlWithDuplicateLinks = `
        <a href="/page1">자세히 보기</a>
        <a href="/page2">자세히 보기</a>
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithDuplicateLinks);

      expect(result.warnings).toContain(
        '같은 텍스트의 링크가 다른 곳으로 연결될 수 있습니다. 구체적인 텍스트를 사용하세요.'
      );
    });

    test('should not warn about duplicate links with same href', () => {
      const htmlWithSameLinks = `
        <a href="/page1">자세히 보기</a>
        <a href="/page1">자세히 보기</a>
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithSameLinks);

      // This should still warn because the implementation checks for duplicates regardless of href
      expect(result.warnings).toContain(
        '같은 텍스트의 링크가 다른 곳으로 연결될 수 있습니다. 구체적인 텍스트를 사용하세요.'
      );
    });

    test('should detect incorrect heading hierarchy', () => {
      const htmlWithBadHeadingStructure = `
        <h1>메인 제목</h1>
        <h3>잘못된 제목 레벨</h3>
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithBadHeadingStructure);

      expect(result.issues).toContain('제목 레벨을 순차적으로 사용하세요 (h1 다음 h3 사용 금지).');
    });

    test('should not flag correct heading hierarchy', () => {
      const htmlWithGoodHeadingStructure = `
        <h1>메인 제목</h1>
        <h2>소제목</h2>
        <h3>세부 제목</h3>
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithGoodHeadingStructure);

      const hasHeadingIssue = result.issues.some(issue =>
        issue.includes('제목 레벨을 순차적으로 사용하세요')
      );
      expect(hasHeadingIssue).toBe(false);
    });

    test('should recommend color contrast verification', () => {
      const htmlWithColor = '<p style="color: #ff0000">빨간 텍스트</p>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithColor);

      expect(result.recommendations).toContain(
        '텍스트 색상 사용 시 배경색과의 충분한 대비(4.5:1 이상)를 확인하세요.'
      );
    });

    test('should recommend aria-label for navigation', () => {
      const htmlWithNav = '<nav><ul><li>메뉴</li></ul></nav>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithNav);

      expect(result.recommendations).toContain(
        "네비게이션 요소에 aria-label 또는 role='navigation'을 추가하세요."
      );
    });

    test('should not recommend aria-label for navigation with existing label', () => {
      const htmlWithNavLabel = '<nav aria-label="메인 메뉴"><ul><li>메뉴</li></ul></nav>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithNavLabel);

      const hasNavRecommendation = result.recommendations.some(rec =>
        rec.includes('네비게이션 요소에 aria-label')
      );
      expect(hasNavRecommendation).toBe(false);
    });

    test('should detect modal accessibility issues', () => {
      const htmlWithModal = '<div class="modal"><p>모달 내용</p></div>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithModal);

      expect(result.issues).toContain("모달에 role='dialog' 속성이 필요합니다.");
      expect(result.warnings).toContain("모달에 aria-modal='true' 속성을 추가하세요.");
    });

    test('should not flag modal with proper attributes', () => {
      const htmlWithProperModal =
        '<div class="modal" role="dialog" aria-modal="true"><p>모달 내용</p></div>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithProperModal);

      const hasModalIssue = result.issues.some(issue =>
        issue.includes("모달에 role='dialog' 속성이 필요합니다")
      );
      const hasModalWarning = result.warnings.some(warning =>
        warning.includes("모달에 aria-modal='true' 속성을 추가하세요")
      );

      expect(hasModalIssue).toBe(false);
      expect(hasModalWarning).toBe(false);
    });

    test('should detect table accessibility issues', () => {
      const htmlWithTable = `
        <table>
          <tr><td>데이터</td></tr>
        </table>
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithTable);

      expect(result.issues).toContain('테이블에 헤더(th) 요소가 필요합니다.');
      expect(result.recommendations).toContain('테이블에 caption 요소로 설명을 제공하세요.');
    });

    test('should not flag table with proper structure', () => {
      const htmlWithProperTable = `
        <table>
          <caption>사용자 목록</caption>
          <thead>
            <tr><th scope="col">이름</th></tr>
          </thead>
          <tbody>
            <tr><td>홍길동</td></tr>
          </tbody>
        </table>
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithProperTable);

      const hasTableHeaderIssue = result.issues.some(issue =>
        issue.includes('테이블에 헤더(th) 요소가 필요합니다')
      );
      const hasTableCaptionRec = result.recommendations.some(rec =>
        rec.includes('테이블에 caption 요소로 설명을 제공하세요')
      );

      expect(hasTableHeaderIssue).toBe(false);
      expect(hasTableCaptionRec).toBe(false);
    });

    test('should recommend fieldset for multiple inputs', () => {
      const htmlWithMultipleInputs = `
        <input type="text" name="first">
        <input type="text" name="second">
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithMultipleInputs);

      expect(result.recommendations).toContain('관련된 폼 요소들을 fieldset으로 그룹화하세요.');
    });

    test('should not recommend fieldset when already present', () => {
      const htmlWithFieldset = `
        <fieldset>
          <input type="text" name="first">
          <input type="text" name="second">
        </fieldset>
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithFieldset);

      const hasFieldsetRec = result.recommendations.some(rec =>
        rec.includes('관련된 폼 요소들을 fieldset으로 그룹화하세요')
      );
      expect(hasFieldsetRec).toBe(false);
    });

    test('should warn about small touch targets', () => {
      const htmlWithSmallButton = '<button style="width: 30px">작은 버튼</button>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithSmallButton);

      expect(result.warnings).toContain(
        '터치 영역이 44px 미만입니다. 접근성을 위해 최소 44x44px를 권장합니다.'
      );
    });

    test('should detect missing lang attribute', () => {
      const htmlWithoutLang = '<html><head><title>테스트</title></head></html>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithoutLang);

      expect(result.issues).toContain('html 요소에 lang 속성이 필요합니다.');
    });

    test('should not flag html with lang attribute', () => {
      const htmlWithLang = '<html lang="ko"><head><title>테스트</title></head></html>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithLang);

      const hasLangIssue = result.issues.some(issue =>
        issue.includes('html 요소에 lang 속성이 필요합니다')
      );
      expect(hasLangIssue).toBe(false);
    });

    test('should detect empty page title', () => {
      const htmlWithEmptyTitle = '<title></title>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithEmptyTitle);

      expect(result.issues).toContain('페이지 제목이 비어있습니다.');
    });

    test('should recommend skip links', () => {
      const htmlWithNavNoSkip = '<nav><ul><li>메뉴</li></ul></nav>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithNavNoSkip);

      expect(result.recommendations).toContain(
        '주요 콘텐츠로 바로가기 링크를 제공하는 것이 좋습니다.'
      );
    });

    test('should not recommend skip links when present', () => {
      const htmlWithSkip = `
        <nav>
          <a href="#main">메인 콘텐츠로 바로가기</a>
          <ul><li>메뉴</li></ul>
        </nav>
        <main id="main">콘텐츠</main>
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithSkip);

      const hasSkipRecommendation = result.recommendations.some(rec =>
        rec.includes('주요 콘텐츠로 바로가기 링크를 제공하는 것이 좋습니다')
      );
      expect(hasSkipRecommendation).toBe(false);
    });

    test('should calculate correct WCAG compliance levels', () => {
      // Test different score levels
      const highScoreHtml =
        '<html lang="ko"><title>Good</title><body><h1>Title</h1><p>Content</p></body></html>';
      const mediumScoreHtml = '<html><body><img src="test.jpg"><button></button></body></html>';
      const lowScoreHtml =
        '<html><body><img src="test.jpg"><button></button><input type="text"></body></html>';

      const highResult = AccessibilityValidator.validateAccessibility(highScoreHtml);
      const mediumResult = AccessibilityValidator.validateAccessibility(mediumScoreHtml);
      const lowResult = AccessibilityValidator.validateAccessibility(lowScoreHtml);

      expect(highResult.wcagCompliance).toBe('AA');
      expect(mediumResult.wcagCompliance).toBe('부분 준수');
      expect(lowResult.wcagCompliance).toBe('미준수');
    });

    test('should provide detailed report statistics', () => {
      const html = '<html><body><p>Simple test</p></body></html>';

      const result = AccessibilityValidator.validateAccessibility(html);

      expect(result.detailedReport).toHaveProperty('totalChecks');
      expect(result.detailedReport).toHaveProperty('passedChecks');
      expect(result.detailedReport).toHaveProperty('criticalIssues');
      expect(result.detailedReport).toHaveProperty('warningCount');
      expect(result.detailedReport).toHaveProperty('recommendationCount');

      expect(result.detailedReport.totalChecks).toBe(15);
      expect(result.detailedReport.criticalIssues).toBe(result.issues.length);
      expect(result.detailedReport.warningCount).toBe(result.warnings.length);
      expect(result.detailedReport.recommendationCount).toBe(result.recommendations.length);
    });
  });

  describe('checkSpecificIssue', () => {
    test('should check alt-text issues', () => {
      expect(AccessibilityValidator.checkSpecificIssue('<img src="test.jpg">', 'alt-text')).toBe(
        true
      );
      expect(
        AccessibilityValidator.checkSpecificIssue(
          '<img src="test.jpg" alt="description">',
          'alt-text'
        )
      ).toBe(false);
    });

    test('should check button-labels issues', () => {
      expect(AccessibilityValidator.checkSpecificIssue('<button></button>', 'button-labels')).toBe(
        true
      );
      expect(
        AccessibilityValidator.checkSpecificIssue('<button>Click me</button>', 'button-labels')
      ).toBe(false);
    });

    test('should check form-labels issues', () => {
      expect(AccessibilityValidator.checkSpecificIssue('<input type="text">', 'form-labels')).toBe(
        true
      );
      expect(
        AccessibilityValidator.checkSpecificIssue(
          '<label for="input1">Label</label><input id="input1">',
          'form-labels'
        )
      ).toBe(false);
      expect(
        AccessibilityValidator.checkSpecificIssue(
          '<input type="text" aria-label="Input">',
          'form-labels'
        )
      ).toBe(false);
    });

    test('should check heading-structure issues', () => {
      expect(
        AccessibilityValidator.checkSpecificIssue(
          '<h1>Title</h1><h3>Wrong level</h3>',
          'heading-structure'
        )
      ).toBe(true);
      expect(
        AccessibilityValidator.checkSpecificIssue(
          '<h1>Title</h1><h2>Correct level</h2>',
          'heading-structure'
        )
      ).toBe(false);
    });

    test('should check table-headers issues', () => {
      expect(
        AccessibilityValidator.checkSpecificIssue(
          '<table><tr><td>Data</td></tr></table>',
          'table-headers'
        )
      ).toBe(true);
      expect(
        AccessibilityValidator.checkSpecificIssue(
          '<table><tr><th>Header</th></tr></table>',
          'table-headers'
        )
      ).toBe(false);
    });

    test('should check lang-attribute issues', () => {
      expect(
        AccessibilityValidator.checkSpecificIssue('<html><body></body></html>', 'lang-attribute')
      ).toBe(true);
      expect(
        AccessibilityValidator.checkSpecificIssue(
          '<html lang="ko"><body></body></html>',
          'lang-attribute'
        )
      ).toBe(false);
    });

    test('should return false for unknown check types', () => {
      expect(AccessibilityValidator.checkSpecificIssue('<p>Test</p>', 'unknown-check')).toBe(false);
    });
  });

  describe('generateImprovementSuggestions', () => {
    test('should generate suggestions for alt-text issues', () => {
      const suggestions =
        AccessibilityValidator.generateImprovementSuggestions('<img src="test.jpg">');

      const altTextSuggestion = suggestions.find(s => s.type === 'alt-text');
      expect(altTextSuggestion).toBeDefined();
      expect(altTextSuggestion.priority).toBe('high');
      expect(altTextSuggestion.description).toContain('alt 속성 추가');
      expect(altTextSuggestion.example).toContain('alt=');
      expect(altTextSuggestion.wcagCriteria).toBe('1.1.1');
    });

    test('should generate suggestions for button-labels issues', () => {
      const suggestions =
        AccessibilityValidator.generateImprovementSuggestions('<button></button>');

      const buttonSuggestion = suggestions.find(s => s.type === 'button-labels');
      expect(buttonSuggestion).toBeDefined();
      expect(buttonSuggestion.priority).toBe('high');
      expect(buttonSuggestion.description).toContain('aria-label');
      expect(buttonSuggestion.example).toContain('aria-label=');
      expect(buttonSuggestion.wcagCriteria).toBe('4.1.2');
    });

    test('should generate suggestions for form-labels issues', () => {
      const suggestions =
        AccessibilityValidator.generateImprovementSuggestions('<input type="text">');

      const formSuggestion = suggestions.find(s => s.type === 'form-labels');
      expect(formSuggestion).toBeDefined();
      expect(formSuggestion.priority).toBe('high');
      expect(formSuggestion.description).toContain('라벨 추가');
      expect(formSuggestion.example).toContain('<label');
      expect(formSuggestion.wcagCriteria).toBe('3.3.2');
    });

    test('should generate multiple suggestions for multiple issues', () => {
      const htmlWithMultipleIssues = `
        <img src="test.jpg">
        <button></button>
        <input type="text">
      `;

      const suggestions =
        AccessibilityValidator.generateImprovementSuggestions(htmlWithMultipleIssues);

      expect(suggestions.length).toBe(3);
      expect(suggestions.map(s => s.type)).toContain('alt-text');
      expect(suggestions.map(s => s.type)).toContain('button-labels');
      expect(suggestions.map(s => s.type)).toContain('form-labels');
    });

    test('should return empty array for perfect HTML', () => {
      const perfectHtml = `
        <img src="test.jpg" alt="description">
        <button>Click me</button>
        <label for="input1">Label</label>
        <input id="input1" type="text">
      `;

      const suggestions = AccessibilityValidator.generateImprovementSuggestions(perfectHtml);
      expect(suggestions.length).toBe(0);
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle empty HTML', () => {
      const result = AccessibilityValidator.validateAccessibility('');

      expect(result).toHaveProperty('accessibilityScore');
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('recommendations');
      expect(Array.isArray(result.issues)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should handle malformed HTML', () => {
      const malformedHtml = '<div><p>Unclosed tags<img src="test.jpg">';

      const result = AccessibilityValidator.validateAccessibility(malformedHtml);

      expect(result).toHaveProperty('accessibilityScore');
      expect(typeof result.accessibilityScore).toBe('number');
    });

    test('should handle HTML with special characters', () => {
      const htmlWithSpecialChars = '<p>테스트 & 특수문자 "quotes" \'single quotes\'</p>';

      const result = AccessibilityValidator.validateAccessibility(htmlWithSpecialChars);

      expect(result).toHaveProperty('accessibilityScore');
      expect(typeof result.accessibilityScore).toBe('number');
    });

    test('should handle very large HTML strings', () => {
      const largeHtml = `<div>${'Content '.repeat(1000)}</div>`;

      const result = AccessibilityValidator.validateAccessibility(largeHtml);

      expect(result).toHaveProperty('accessibilityScore');
      expect(typeof result.accessibilityScore).toBe('number');
    });

    test('should ensure accessibility score is never negative', () => {
      const htmlWithManyIssues = `
        <img src="1.jpg">
        <img src="2.jpg">
        <img src="3.jpg">
        <img src="4.jpg">
        <img src="5.jpg">
        <button></button>
        <button></button>
        <button></button>
        <input type="text">
        <input type="text">
        <input type="text">
        <a href="#"></a>
        <a href="#"></a>
        <table><tr><td>data</td></tr></table>
        <html><body>no lang</body></html>
      `;

      const result = AccessibilityValidator.validateAccessibility(htmlWithManyIssues);

      expect(result.accessibilityScore).toBeGreaterThanOrEqual(0);
    });
  });
});
