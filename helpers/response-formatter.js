/**
 * KRDS MCP 서버 응답 포맷터
 * 일관된 응답 형식을 제공하고 중복 코드를 제거합니다.
 */

/**
 * 응답 포맷터 클래스
 */
export class ResponseFormatter {
  /**
   * 표준 텍스트 응답 생성
   * @param {string} content - 응답 내용
   * @param {object} metadata - 메타데이터
   * @returns {object} MCP 응답 객체
   */
  static createTextResponse(content, metadata = {}) {
    return {
      content: [
        {
          type: 'text',
          text: content
        }
      ],
      ...(Object.keys(metadata).length > 0 && { metadata })
    };
  }

  /**
   * 목록 형태의 응답 생성
   * @param {string} title - 제목
   * @param {Array} items - 항목 배열
   * @param {Function} formatter - 항목 포맷터 함수
   * @param {object} options - 옵션
   * @returns {object} MCP 응답 객체
   */
  static createListResponse(title, items, formatter, options = {}) {
    const {
      emptyMessage = '항목이 없습니다.',
      showCount = true,
      maxItems = null,
      countSuffix = '개'
    } = options;

    if (!items || items.length === 0) {
      return this.createTextResponse(`## ${title}\n\n${emptyMessage}`);
    }

    const displayItems = maxItems ? items.slice(0, maxItems) : items;
    const formattedItems = displayItems.map(formatter).join('\n\n');

    let content = `## ${title}\n\n${formattedItems}`;

    if (showCount) {
      const countText =
        maxItems && items.length > maxItems
          ? `총 ${items.length}${countSuffix} 중 ${maxItems}${countSuffix} 표시`
          : `총 ${items.length}${countSuffix}`;
      content += `\n\n💡 ${countText}`;
    }

    return this.createTextResponse(content);
  }

  /**
   * 컴포넌트 정보 포맷터
   * @param {object} component - 컴포넌트 객체
   * @param {object} options - 포맷 옵션
   * @returns {string} 포맷된 컴포넌트 정보
   */
  static formatComponent(component, options = {}) {
    const { includeCode = false, includeDetails = true } = options;

    let formatted = `### ${component.name || '이름 없음'}`;

    if (component.id) {
      formatted += `\n- **ID**: ${component.id}`;
    }

    if (component.category) {
      formatted += `\n- **카테고리**: ${component.category}`;
    }

    if (component.description) {
      formatted += `\n- **설명**: ${component.description}`;
    }

    if (includeDetails && component.usageGuidelines && component.usageGuidelines.length > 0) {
      formatted += `\n- **사용 가이드라인**:\n${component.usageGuidelines.map(g => `  - ${g}`).join('\n')}`;
    }

    if (includeDetails && component.accessibility) {
      formatted += `\n- **접근성**: ${component.accessibility}`;
    }

    if (includeCode && component.codeExample) {
      formatted += `\n\n**코드 예제:**\n\`\`\`html\n${component.codeExample}\n\`\`\``;
    }

    return formatted;
  }

  /**
   * 색상 정보 포맷터
   * @param {object} color - 색상 객체
   * @param {object} options - 포맷 옵션
   * @returns {string} 포맷된 색상 정보
   */
  static formatColor(color, options = {}) {
    const { includeHex = true, includeRgb = true, includeAccessibility = true } = options;

    const parts = [`### ${color.name || '이름 없음'}`];

    if (includeHex && color.hexCode) {
      parts.push(`- **HEX**: ${color.hexCode}`);
    }

    if (includeRgb && color.rgb) {
      parts.push(`- **RGB**: ${color.rgb}`);
    }

    if (color.usage) {
      parts.push(`- **사용처**: ${color.usage}`);
    }

    if (includeAccessibility && color.accessibilityLevel) {
      parts.push(`- **접근성**: ${color.accessibilityLevel}`);
    }

    if (color.description) {
      parts.push(`- **설명**: ${color.description}`);
    }

    return parts.join('\n');
  }

  /**
   * 타이포그래피 정보 포맷터
   * @param {object} typography - 타이포그래피 객체
   * @param {object} options - 포맷 옵션
   * @returns {string} 포맷된 타이포그래피 정보
   */
  static formatTypography(typography, options = {}) {
    const { includeCSS = false } = options;

    const parts = [`### ${typography.name || '이름 없음'}`];

    if (typography.fontSize) {
      parts.push(`- **폰트 크기**: ${typography.fontSize}`);
    }

    if (typography.fontWeight) {
      parts.push(`- **폰트 굵기**: ${typography.fontWeight}`);
    }

    if (typography.lineHeight) {
      parts.push(`- **행간**: ${typography.lineHeight}`);
    }

    if (typography.letterSpacing) {
      parts.push(`- **자간**: ${typography.letterSpacing}`);
    }

    if (typography.usage) {
      parts.push(`- **사용처**: ${typography.usage}`);
    }

    if (includeCSS && typography.cssClass) {
      parts.push(`- **CSS 클래스**: \`${typography.cssClass}\``);
    }

    return parts.join('\n');
  }

  /**
   * 패턴 정보 포맷터
   * @param {object} pattern - 패턴 객체
   * @param {object} options - 포맷 옵션
   * @returns {string} 포맷된 패턴 정보
   */
  static formatPattern(pattern, options = {}) {
    const { includeCode = false, includeFlow = true, includeComponents = true } = options;

    let formatted = `### ${pattern.name || '이름 없음'}`;

    if (pattern.id) {
      formatted += `\n- **ID**: ${pattern.id}`;
    }

    if (pattern.description) {
      formatted += `\n- **설명**: ${pattern.description}`;
    }

    if (pattern.purpose) {
      formatted += `\n- **목적**: ${pattern.purpose}`;
    }

    if (pattern.keyGuideline) {
      formatted += `\n- **핵심 가이드라인**: ${pattern.keyGuideline}`;
    }

    if (includeComponents && pattern.components && pattern.components.length > 0) {
      formatted += `\n- **사용 컴포넌트**: ${pattern.components.join(', ')}`;
    }

    if (includeFlow && pattern.flow && pattern.flow.length > 0) {
      formatted += `\n- **플로우**:\n${pattern.flow.map(f => `  - ${f}`).join('\n')}`;
    }

    if (pattern.usageGuidelines && pattern.usageGuidelines.length > 0) {
      formatted += `\n- **사용 가이드라인**:\n${pattern.usageGuidelines.map(g => `  - ${g}`).join('\n')}`;
    }

    if (pattern.accessibilityNotes) {
      formatted += `\n- **접근성 참고사항**: ${pattern.accessibilityNotes}`;
    }

    if (pattern.examples && pattern.examples.length > 0) {
      formatted += `\n- **예시**: ${pattern.examples.join(', ')}`;
    }

    if (includeCode && pattern.codeExample) {
      formatted += `\n\n**HTML 코드 예제:**\n\`\`\`html\n${pattern.codeExample}\n\`\`\``;
    }

    return formatted;
  }

  /**
   * 검색 결과 포맷터
   * @param {Array} results - 검색 결과 배열
   * @param {string} query - 검색어
   * @param {object} options - 포맷 옵션
   * @returns {string} 포맷된 검색 결과
   */
  static formatSearchResults(results, query, options = {}) {
    const { detailed = false, maxResults = 100 } = options;

    if (!results || results.length === 0) {
      return '검색 결과가 없습니다.';
    }

    const displayResults = results.slice(0, maxResults);

    let formatted;
    if (detailed) {
      formatted = displayResults
        .map(
          result =>
            `### ${result.type}: ${result.name}\n**ID**: ${result.id || '없음'}\n**설명**: ${result.description || '설명 없음'}`
        )
        .join('\n\n');
    } else {
      formatted = displayResults
        .map(result => `### ${result.type}: ${result.name}\n${result.description || '설명 없음'}`)
        .join('\n\n');
    }

    const countInfo =
      results.length > maxResults
        ? `총 ${results.length}개 결과 중 ${maxResults}개 표시`
        : `총 ${results.length}개 결과`;

    return `## 검색 결과: "${query}"\n\n${formatted}\n\n💡 ${countInfo}`;
  }

  /**
   * 오류 메시지 포맷터
   * @param {string} title - 오류 제목
   * @param {string} message - 오류 메시지
   * @param {object} suggestions - 제안사항
   * @returns {string} 포맷된 오류 메시지
   */
  static formatErrorMessage(title, message, suggestions = []) {
    let formatted = `## ${title}\n\n${message}`;

    if (suggestions && suggestions.length > 0) {
      formatted += `\n\n💡 **다음을 시도해보세요:**\n${suggestions.map(s => `- ${s}`).join('\n')}`;
    }

    return formatted;
  }

  /**
   * 통계 정보 포맷터
   * @param {object} stats - 통계 객체
   * @param {object} options - 포맷 옵션
   * @returns {string} 포맷된 통계 정보
   */
  static formatStats(stats, options = {}) {
    const { includeDetails = false } = options;

    let formatted = '## KRDS 시스템 통계\n\n### 전체 현황\n';

    if (stats.basic) {
      const basic = stats.basic;
      formatted += `- 컴포넌트: ${basic.totalComponents || 0}개\n`;
      formatted += `- 글로벌 패턴: ${basic.totalGlobalPatterns || 0}개\n`;
      formatted += `- 서비스 패턴: ${basic.totalServicePatterns || 0}개\n`;
      formatted += `- 색상: ${basic.totalColors || 0}개\n`;
      formatted += `- 타이포그래피: ${basic.totalTypography || 0}개\n`;
      formatted += `- 디자인 토큰: ${basic.totalDesignTokens || 0}개\n`;
    }

    if (stats.coverage) {
      formatted += '\n### 준수율 정보\n';
      formatted += `- KRDS 준수율: ${stats.coverage.components || 'N/A'}\n`;
      formatted += `- 글로벌 패턴 완성도: ${stats.coverage.globalPatterns || 'N/A'}\n`;
      formatted += `- 서비스 패턴 완성도: ${stats.coverage.servicePatterns || 'N/A'}\n`;
      formatted += `- 접근성 준수: ${stats.coverage.accessibility || 'N/A'}\n`;
    }

    if (stats.meta) {
      formatted += '\n### 시스템 정보\n';
      formatted += `- 버전: ${stats.meta.version || 'N/A'}\n`;
      formatted += `- 준수 기준: ${stats.meta.compliance || 'N/A'}\n`;
      if (stats.meta.lastUpdated) {
        formatted += `- 최종 업데이트: ${new Date(stats.meta.lastUpdated).toLocaleDateString('ko-KR')}\n`;
      }
    }

    if (includeDetails && stats.detailed) {
      formatted += '\n### 상세 통계\n';

      if (stats.detailed.componentsByCategory) {
        formatted += '\n#### 컴포넌트 카테고리별 분포\n';
        Object.entries(stats.detailed.componentsByCategory).forEach(([category, count]) => {
          formatted += `- ${category}: ${count}개\n`;
        });
      }

      if (stats.detailed.accessibility) {
        formatted += '\n#### 접근성 준수 현황\n';
        formatted += `- AA 이상 준수 색상: ${stats.detailed.accessibility.compliantColors}/${stats.detailed.accessibility.totalColors}개\n`;
        if (stats.detailed.accessibility.percentage) {
          formatted += `- 준수율: ${stats.detailed.accessibility.percentage}%\n`;
        }
      }
    }

    return formatted;
  }

  /**
   * 코드 생성 결과 포맷터
   * @param {object} component - 컴포넌트 정보
   * @param {string} code - 생성된 코드
   * @param {object} options - 포맷 옵션
   * @returns {string} 포맷된 코드 생성 결과
   */
  static formatGeneratedCode(component, code, options = {}) {
    const { theme = 'light', variant = null, includeGuidelines = true } = options;

    let formatted = `## ${component.name} 코드 생성\n\n`;

    if (variant) {
      formatted += `**변형**: ${variant}\n`;
    }

    formatted += `**테마**: ${theme === 'dark' ? '다크 모드' : '라이트 모드'}\n\n`;

    formatted += `### HTML 코드\n\`\`\`html\n${code}\n\`\`\`\n\n`;

    formatted += '### CSS 클래스 안내\n';
    formatted += '- KRDS 표준 CSS 클래스를 사용합니다\n';
    formatted += `- ${theme === 'dark' ? '다크 모드' : '라이트 모드'} 최적화\n`;
    formatted += '- 접근성 속성이 포함되어 있습니다\n\n';

    if (includeGuidelines && component.usageGuidelines) {
      formatted += '### 사용 가이드라인\n';
      formatted += component.usageGuidelines.map(g => `- ${g}`).join('\n');
    } else if (includeGuidelines) {
      formatted += '### 사용 가이드라인\n- 기본 KRDS 가이드라인을 따르세요';
    }

    return formatted;
  }
}
