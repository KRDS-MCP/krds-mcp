/**
 * KRDS 접근성 검증 헬퍼
 * HTML 코드의 접근성 수준을 검증하고 개선 방안을 제시
 */

export class AccessibilityValidator {
  /**
   * HTML 코드의 접근성을 검증
   * @param {string} htmlCode - 검증할 HTML 코드
   * @returns {object} 접근성 검증 결과
   */
  static validateAccessibility(htmlCode) {
    const issues = [];
    const recommendations = [];
    const warnings = [];
    let score = 100;

    // 이미지 alt 속성 검증
    if (/<img[^>]*(?!.*alt\s*=)[^>]*>/i.test(htmlCode)) {
      issues.push('이미지에 alt 속성이 누락되었습니다.');
      recommendations.push('모든 이미지에 의미있는 alt 텍스트를 추가하세요.');
      score -= 15;
    }

    // 장식용 이미지 확인
    if (/<img[^>]*alt\s*=\s*["'][\s]*["'][^>]*>/i.test(htmlCode)) {
      recommendations.push("장식용 이미지는 alt='' 또는 role='presentation'을 사용하세요.");
    }

    // 버튼 레이블 검증
    if (/<button[^>]*>[\s]*<\/button>/i.test(htmlCode)) {
      issues.push('버튼에 텍스트 레이블이 없습니다.');
      recommendations.push('버튼에 명확한 텍스트 레이블 또는 aria-label을 제공하세요.');
      score -= 15;
    }

    // 아이콘 버튼 검증
    if (
      /<button[^>]*>[\s]*<[^>]*class[^>]*icon[^>]*>[\s]*<\/button>/i.test(htmlCode) &&
      !/<button[^>]*aria-label/i.test(htmlCode)
    ) {
      warnings.push('아이콘 버튼에 aria-label이 권장됩니다.');
      score -= 5;
    }

    // 폼 레이블 검증
    if (
      /<input[^>]*>/i.test(htmlCode) &&
      !/<label[^>]*for\s*=/i.test(htmlCode) &&
      !/aria-labelledby|aria-label/i.test(htmlCode)
    ) {
      issues.push('입력 필드에 연결된 레이블이 없습니다.');
      recommendations.push(
        '모든 입력 필드에 label, aria-label, 또는 aria-labelledby를 제공하세요.'
      );
      score -= 15;
    }

    // 필수 입력 필드 검증
    if (
      /<input[^>]*required[^>]*>/i.test(htmlCode) &&
      !/<span[^>]*required[^>]*>/i.test(htmlCode) &&
      !/aria-required/i.test(htmlCode)
    ) {
      warnings.push('필수 입력 필드에 시각적/의미적 표시를 추가하세요.');
      score -= 5;
    }

    // 링크 텍스트 검증
    if (/<a[^>]*href[^>]*>[\s]*<\/a>/i.test(htmlCode)) {
      issues.push('링크에 텍스트가 없습니다.');
      recommendations.push('모든 링크에 의미있는 텍스트 또는 aria-label을 제공하세요.');
      score -= 15;
    }

    // 같은 텍스트 링크 검증
    const linkMatches = htmlCode.match(/<a[^>]*href[^>]*>([^<]+)<\/a>/gi);
    if (linkMatches && linkMatches.length > 1) {
      const linkTexts = linkMatches.map(link => link.match(/>([^<]+)</)[1]);
      const duplicates = linkTexts.filter((text, index) => linkTexts.indexOf(text) !== index);
      if (duplicates.length > 0) {
        warnings.push(
          '같은 텍스트의 링크가 다른 곳으로 연결될 수 있습니다. 구체적인 텍스트를 사용하세요.'
        );
        score -= 5;
      }
    }

    // 제목 구조 검증
    const headingMatches = htmlCode.match(/<h([1-6])[^>]*>/gi);
    if (headingMatches && headingMatches.length > 1) {
      const levels = headingMatches.map(h => parseInt(h.match(/<h([1-6])/i)[1]));
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) {
          issues.push('제목 레벨을 순차적으로 사용하세요 (h1 다음 h3 사용 금지).');
          score -= 10;
          break;
        }
      }
    }

    // 색상 대비 검증 (기본적인)
    if (/color\s*:\s*#[a-f0-9]{6}/i.test(htmlCode) && !/background-color/i.test(htmlCode)) {
      recommendations.push('텍스트 색상 사용 시 배경색과의 충분한 대비(4.5:1 이상)를 확인하세요.');
      score -= 5;
    }

    // ARIA 속성 권장사항
    if (
      /<nav[^>]*>/i.test(htmlCode) &&
      !/aria-label|role\s*=\s*["']navigation["']/i.test(htmlCode)
    ) {
      recommendations.push("네비게이션 요소에 aria-label 또는 role='navigation'을 추가하세요.");
      score -= 5;
    }

    // 모달 접근성 검증
    if (/<div[^>]*modal[^>]*>/i.test(htmlCode)) {
      if (!/role\s*=\s*["']dialog["']/i.test(htmlCode)) {
        issues.push("모달에 role='dialog' 속성이 필요합니다.");
        score -= 10;
      }
      if (!/aria-modal\s*=\s*["']true["']/i.test(htmlCode)) {
        warnings.push("모달에 aria-modal='true' 속성을 추가하세요.");
        score -= 5;
      }
    }

    // 테이블 접근성 검증
    if (/<table[^>]*>/i.test(htmlCode)) {
      if (!/<th[^>]*>/i.test(htmlCode)) {
        issues.push('테이블에 헤더(th) 요소가 필요합니다.');
        score -= 10;
      }
      if (!/<caption[^>]*>/i.test(htmlCode)) {
        recommendations.push('테이블에 caption 요소로 설명을 제공하세요.');
        score -= 5;
      }
    }

    // 폼 그룹화 검증
    if (
      /<input[^>]*>/i.test(htmlCode) &&
      /<input[^>]*>/i.test(htmlCode.replace(/<input[^>]*>/, ''))
    ) {
      if (!/<fieldset[^>]*>/i.test(htmlCode)) {
        recommendations.push('관련된 폼 요소들을 fieldset으로 그룹화하세요.');
        score -= 3;
      }
    }

    // 터치 영역 크기 (기본적인 검증)
    if (/<button[^>]*style[^>]*width\s*:\s*(\d+)px[^>]*>/i.test(htmlCode)) {
      const match = htmlCode.match(/width\s*:\s*(\d+)px/i);
      if (match && parseInt(match[1]) < 44) {
        warnings.push('터치 영역이 44px 미만입니다. 접근성을 위해 최소 44x44px를 권장합니다.');
        score -= 5;
      }
    }

    // 언어 속성 검증
    if (/<html[^>]*>/i.test(htmlCode) && !/lang\s*=/i.test(htmlCode)) {
      issues.push('html 요소에 lang 속성이 필요합니다.');
      score -= 10;
    }

    // 페이지 제목 검증
    if (/<title[^>]*>[\s]*<\/title>/i.test(htmlCode)) {
      issues.push('페이지 제목이 비어있습니다.');
      score -= 10;
    }

    // 스킵 링크 권장사항
    if (/<nav[^>]*>/i.test(htmlCode) && !/skip|main/i.test(htmlCode)) {
      recommendations.push('주요 콘텐츠로 바로가기 링크를 제공하는 것이 좋습니다.');
    }

    return {
      accessibilityScore: Math.max(0, score),
      issues,
      warnings,
      recommendations,
      wcagCompliance: score >= 80 ? 'AA' : score >= 60 ? '부분 준수' : '미준수',
      detailedReport: {
        totalChecks: 15,
        passedChecks: Math.round((score / 100) * 15),
        criticalIssues: issues.length,
        warningCount: warnings.length,
        recommendationCount: recommendations.length
      }
    };
  }

  /**
   * 특정 접근성 이슈를 검사
   * @param {string} htmlCode - 검사할 HTML 코드
   * @param {string} checkType - 검사 유형
   * @returns {boolean} 검사 결과
   */
  static checkSpecificIssue(htmlCode, checkType) {
    const checks = {
      'alt-text': /<img[^>]*(?!.*alt\s*=)[^>]*>/i.test(htmlCode),
      'button-labels': /<button[^>]*>[\s]*<\/button>/i.test(htmlCode),
      'form-labels':
        /<input[^>]*>/i.test(htmlCode) &&
        !/<label[^>]*for\s*=/i.test(htmlCode) &&
        !/aria-labelledby|aria-label/i.test(htmlCode),
      'heading-structure': (() => {
        const headingMatches = htmlCode.match(/<h([1-6])[^>]*>/gi);
        if (headingMatches && headingMatches.length > 1) {
          const levels = headingMatches.map(h => parseInt(h.match(/<h([1-6])/i)[1]));
          for (let i = 1; i < levels.length; i++) {
            if (levels[i] - levels[i - 1] > 1) {
              return true;
            }
          }
        }
        return false;
      })(),
      'table-headers': /<table[^>]*>/i.test(htmlCode) && !/<th[^>]*>/i.test(htmlCode),
      'lang-attribute': /<html[^>]*>/i.test(htmlCode) && !/lang\s*=/i.test(htmlCode)
    };

    return checks[checkType] || false;
  }

  /**
   * 접근성 개선 제안 생성
   * @param {string} htmlCode - 개선할 HTML 코드
   * @returns {object} 개선 제안
   */
  static generateImprovementSuggestions(htmlCode) {
    const suggestions = [];

    // 이미지 alt 속성 개선
    if (this.checkSpecificIssue(htmlCode, 'alt-text')) {
      suggestions.push({
        type: 'alt-text',
        priority: 'high',
        description: '모든 이미지에 의미있는 alt 속성 추가',
        example: '<img src="logo.png" alt="회사 로고" />',
        wcagCriteria: '1.1.1'
      });
    }

    // 버튼 라벨 개선
    if (this.checkSpecificIssue(htmlCode, 'button-labels')) {
      suggestions.push({
        type: 'button-labels',
        priority: 'high',
        description: '빈 버튼에 aria-label 또는 텍스트 추가',
        example: '<button aria-label="닫기">×</button>',
        wcagCriteria: '4.1.2'
      });
    }

    // 폼 라벨 개선
    if (this.checkSpecificIssue(htmlCode, 'form-labels')) {
      suggestions.push({
        type: 'form-labels',
        priority: 'high',
        description: '입력 필드에 연결된 라벨 추가',
        example: '<label for="username">사용자명</label><input id="username" />',
        wcagCriteria: '3.3.2'
      });
    }

    return suggestions;
  }
}
