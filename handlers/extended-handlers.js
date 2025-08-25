/**
 * KRDS MCP 서버 확장 핸들러 모듈
 * 복잡한 핸들러 로직을 분리하여 관리합니다.
 */

import {
  InputValidator,
  ErrorHandler,
  ErrorLogger,
  ResponseFormatter,
  SpecialValidators
} from '../helpers/index.js';
import { KRDS_DATA } from '../data/index.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * 디자인 토큰 조회 핸들러
 */
export async function handleGetDesignTokens(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(
      args,
      'designTokens',
      '디자인 토큰 조회'
    );
    const { category, tokenName, format = 'json', theme = 'light' } = validatedArgs;

    if (!KRDS_DATA.designTokens) {
      return ErrorHandler.handleDataUnavailable('디자인 토큰', '디자인 토큰 조회');
    }

    let tokens = KRDS_DATA.designTokens.tokens || {};

    if (category) {
      if (!tokens[category]) {
        return ErrorHandler.handleNoResults(category, 'design-tokens', '디자인 토큰 조회');
      }
      tokens = { [category]: tokens[category] };
    }

    if (tokenName) {
      tokens = TokenUtils.filterTokensByName(tokens, tokenName);
    }

    const result = TokenFormatters.formatTokens(tokens, format, theme);
    return ResponseFormatter.createTextResponse(result);
  } catch (error) {
    return ErrorHandler.handleError(error, '디자인 토큰 조회', { args });
  }
}

/**
 * 시스템 정보 조회 핸들러
 */
export async function handleGetSystems(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(args, 'systems', '시스템 정보 조회');
    const { system } = validatedArgs;

    if (!system) {
      return SystemFormatters.formatSystemOverview();
    }

    const systemData = SystemHandlers.getSystemData(system);
    if (!systemData) {
      return ErrorHandler.handleNoResults(system, 'systems', '시스템 정보 조회');
    }

    return ResponseFormatter.createTextResponse(systemData);
  } catch (error) {
    return ErrorHandler.handleError(error, '시스템 정보 조회', { args });
  }
}

/**
 * 통합 검색 핸들러
 */
export async function handleSearch(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(args, 'search', '통합 검색');
    const { query, type = 'all', detailed = false } = validatedArgs;

    const queryValidation = SpecialValidators.validateSearchQuery(query);
    if (!queryValidation.isValid) {
      throw new McpError(ErrorCode.InvalidRequest, queryValidation.error);
    }

    const sanitizedQuery = queryValidation.sanitized;
    const searchResults = SearchEngine.performSearch(sanitizedQuery, type, detailed);

    if (searchResults.results.length === 0) {
      return ErrorHandler.handleNoResults(sanitizedQuery, type, '통합 검색');
    }

    return SearchFormatters.formatSearchResults(searchResults, sanitizedQuery);
  } catch (error) {
    return ErrorHandler.handleError(error, '통합 검색', {
      args: { query: args?.query?.substring(0, 50), type: args?.type }
    });
  }
}

/**
 * 코드 생성 핸들러
 */
export async function handleGenerateCode(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(args, 'generateCode', '코드 생성');
    const { type, id, variant, theme = 'light' } = validatedArgs;

    if (!type || !id) {
      throw new McpError(ErrorCode.InvalidRequest, 'type과 id가 필요합니다.');
    }

    const validTypes = ['component', 'global-pattern', 'service-pattern'];
    if (!validTypes.includes(type)) {
      throw new McpError(ErrorCode.InvalidRequest, `지원하지 않는 타입입니다: ${type}`);
    }

    const targetItem = CodeGenerators.findTargetItem(type, id);
    if (!targetItem) {
      return ErrorHandler.handleNoResults(id, type, '코드 생성');
    }

    const generatedCode = CodeGenerators.generateCode(type, targetItem, { variant, theme });
    if (!generatedCode) {
      return ResponseFormatter.createTextResponse(
        `"${targetItem.name}"에 대한 코드 예제가 없습니다.`
      );
    }

    return ResponseFormatter.createTextResponse(
      CodeFormatters.formatGeneratedCode(targetItem, generatedCode, theme)
    );
  } catch (error) {
    return ErrorHandler.handleError(error, '코드 생성', { args });
  }
}

/**
 * 통계 정보 조회 핸들러
 */
export async function handleGetStats(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(args, 'stats', '통계 정보 조회');
    const { detailed = false } = validatedArgs;

    const statsData = StatsCalculators.calculateStats(detailed);
    return ResponseFormatter.createTextResponse(StatsFormatters.formatStats(statsData, detailed));
  } catch (error) {
    return ErrorHandler.handleError(error, '통계 정보 조회', { args });
  }
}

/**
 * 토큰 관련 유틸리티
 */
export const TokenUtils = {
  filterTokensByName: (tokens, tokenName) => {
    const foundTokens = {};
    Object.keys(tokens).forEach(cat => {
      const categoryTokens = tokens[cat];
      Object.keys(categoryTokens).forEach(name => {
        if (name.toLowerCase().includes(tokenName.toLowerCase())) {
          if (!foundTokens[cat]) {
            foundTokens[cat] = {};
          }
          foundTokens[cat][name] = categoryTokens[name];
        }
      });
    });
    return foundTokens;
  }
};

/**
 * 토큰 포맷터
 */
export const TokenFormatters = {
  formatTokens: (tokens, format, theme) => {
    switch (format) {
      case 'css':
        return TokenFormatters.generateCSSVariables(tokens, theme);
      case 'style-dictionary':
        return TokenFormatters.generateStyleDictionary(tokens, theme);
      case 'json':
      default:
        return `## KRDS 디자인 토큰 (${theme} 테마)\n\n\`\`\`json\n${JSON.stringify(tokens, null, 2)}\n\`\`\``;
    }
  },

  generateCSSVariables: (tokens, theme) => {
    let css = `/* KRDS 디자인 토큰 - ${theme} 테마 */\n:root {\n`;

    Object.keys(tokens).forEach(category => {
      css += `\n  /* ${category} tokens */\n`;
      Object.keys(tokens[category]).forEach(tokenName => {
        const value = tokens[category][tokenName];
        const cssVar = `--krds-${category}-${tokenName.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        css += `  ${cssVar}: ${typeof value === 'object' ? value.value || JSON.stringify(value) : value};\n`;
      });
    });

    css += '}\n';

    if (theme === 'dark') {
      css += '\n/* 다크 모드 오버라이드 */\n[data-theme="dark"] {\n';
      css += '  /* 다크 모드 토큰 값들 */\n';
      css += '}\n';
    }

    return `## KRDS CSS 변수\n\n\`\`\`css\n${css}\`\`\``;
  },

  generateStyleDictionary: (tokens, theme) => {
    const styleDictionary = {
      source: [`tokens/${theme}/**/*.json`],
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: `build/css/${theme}/`,
          files: [
            {
              destination: 'variables.css',
              format: 'css/variables'
            }
          ]
        },
        js: {
          transformGroup: 'js',
          buildPath: `build/js/${theme}/`,
          files: [
            {
              destination: 'tokens.js',
              format: 'javascript/es6'
            }
          ]
        }
      },
      tokens
    };

    return `## Style Dictionary 설정\n\n\`\`\`json\n${JSON.stringify(styleDictionary, null, 2)}\n\`\`\``;
  }
};

/**
 * 시스템 핸들러
 */
export const SystemHandlers = {
  getSystemData: system => {
    switch (system) {
      case 'spacing':
        return SystemFormatters.formatSpacingSystem();
      case 'grid':
        return SystemFormatters.formatGridSystem();
      case 'responsive':
        return SystemFormatters.formatResponsiveSystem();
      case 'darkmode':
        return SystemFormatters.formatDarkModeSystem();
      default:
        return null;
    }
  }
};

/**
 * 시스템 포맷터
 */
export const SystemFormatters = {
  formatSystemOverview: () => {
    return ResponseFormatter.createTextResponse(
      '## KRDS 시스템 정보\n\n사용 가능한 시스템:\n- spacing: 스페이싱 시스템\n- grid: 그리드 시스템\n- responsive: 반응형 가이드라인\n- darkmode: 다크모드 지원\n\n특정 시스템 정보를 조회하려면 system 매개변수를 지정하세요.'
    );
  },

  formatSpacingSystem: () => {
    return `## KRDS 스페이싱 시스템\n\n${Object.entries(KRDS_DATA.spacingSystem)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}`;
  },

  formatGridSystem: () => {
    return `## KRDS 그리드 시스템\n\n- 컨테이너 최대 너비:\n${Object.entries(
      KRDS_DATA.gridSystem.container.maxWidth
    )
      .map(([key, value]) => `  - ${key}: ${value}`)
      .join(
        '\n'
      )}\n\n- 컬럼 수: ${KRDS_DATA.gridSystem.columns}\n- 브레이크포인트:\n${Object.entries(
      KRDS_DATA.gridSystem.breakpoints
    )
      .map(([key, value]) => `  - ${key}: ${value}`)
      .join('\n')}`;
  },

  formatResponsiveSystem: () => {
    return `## KRDS 반응형 가이드라인\n\n### 원칙\n${KRDS_DATA.responsiveGuidelines.principles.map(p => `- ${p}`).join('\n')}\n\n### 브레이크포인트별 전략\n${Object.entries(
      KRDS_DATA.responsiveGuidelines.breakpointStrategy
    )
      .map(
        ([key, value]) =>
          `#### ${key} (${value.range})\n${value.guidelines.map(g => `- ${g}`).join('\n')}`
      )
      .join('\n\n')}`;
  },

  formatDarkModeSystem: () => {
    return `## KRDS 다크모드 지원\n\n### 가이드라인\n${KRDS_DATA.darkModeSupport.guidelines.map(g => `- ${g}`).join('\n')}\n\n### 구현 방법\n- CSS 변수: ${Object.entries(
      KRDS_DATA.darkModeSupport.implementation.cssVariables
    )
      .map(([key, value]) => `${key}: ${value}`)
      .join(
        ', '
      )}\n- 미디어 쿼리: ${KRDS_DATA.darkModeSupport.implementation.mediaQuery}\n- 저장 키: ${KRDS_DATA.darkModeSupport.implementation.storageKey}`;
  }
};

/**
 * 검색 엔진
 */
export const SearchEngine = {
  performSearch: (sanitizedQuery, type, _detailed) => {
    const results = [];
    const searchActions = SearchEngine.getSearchActions(sanitizedQuery);

    if (type === 'all') {
      Object.values(searchActions).forEach(action => {
        results.push(...action());
      });
    } else if (searchActions[type]) {
      results.push(...searchActions[type]());
    }

    const limitedResults = results.slice(0, 100);
    if (results.length > 100) {
      ErrorLogger.logError(
        'SEARCH_LIMIT',
        'LOW',
        `검색 결과가 100개로 제한됨 (전체: ${results.length}개)`,
        { query: sanitizedQuery, type }
      );
    }

    return {
      results: limitedResults,
      totalCount: results.length,
      limited: results.length > 100
    };
  },

  getSearchActions: sanitizedQuery => ({
    principles: () => SearchDataSources.searchPrinciples(sanitizedQuery),
    colors: () => SearchDataSources.searchColors(sanitizedQuery),
    typography: () => SearchDataSources.searchTypography(sanitizedQuery),
    components: () => SearchDataSources.searchComponents(sanitizedQuery),
    'global-patterns': () => SearchDataSources.searchGlobalPatterns(sanitizedQuery),
    'service-patterns': () => SearchDataSources.searchServicePatterns(sanitizedQuery),
    icons: () => SearchDataSources.searchIcons(sanitizedQuery),
    tokens: () => SearchDataSources.searchTokens(sanitizedQuery)
  })
};

/**
 * 검색 데이터 소스
 */
export const SearchDataSources = {
  searchPrinciples: query => {
    return SearchUtils.safeSearch(
      KRDS_DATA.designPrinciples,
      'principles',
      p => ({
        type: '디자인 원칙',
        name: p.name,
        description: p.description || '',
        id: p.id || p.name
      }),
      query
    );
  },

  searchColors: query => {
    return SearchUtils.safeSearch(
      KRDS_DATA.colors,
      'colors',
      c => ({
        type: '색상',
        name: c.name,
        description: c.usage || c.description || '',
        id: c.id || c.name
      }),
      query
    );
  },

  searchTypography: query => {
    return SearchUtils.safeSearch(
      KRDS_DATA.typography,
      'typography',
      t => ({
        type: '타이포그래피',
        name: t.name,
        description: t.usage || t.description || '',
        id: t.id || t.name
      }),
      query
    );
  },

  searchComponents: query => {
    return SearchUtils.safeSearch(
      KRDS_DATA.components,
      'components',
      c => ({ type: '컴포넌트', name: c.name, description: c.description || '', id: c.id }),
      query
    );
  },

  searchGlobalPatterns: query => {
    return SearchUtils.safeSearch(
      KRDS_DATA.globalPatterns,
      'global-patterns',
      p => ({ type: '글로벌 패턴', name: p.name, description: p.description || '', id: p.id }),
      query
    );
  },

  searchServicePatterns: query => {
    return SearchUtils.safeSearch(
      KRDS_DATA.servicePatterns,
      'service-patterns',
      p => ({ type: '서비스 패턴', name: p.name, description: p.description || '', id: p.id }),
      query
    );
  },

  searchIcons: query => {
    if (!KRDS_DATA.icons) {
      return [];
    }
    return SearchUtils.safeSearch(
      KRDS_DATA.icons,
      'icons',
      i => ({
        type: '아이콘',
        name: i.name,
        description: i.description || i.usage || '',
        id: i.id
      }),
      query
    );
  },

  searchTokens: query => {
    if (!KRDS_DATA.designTokens?.tokens) {
      return [];
    }
    try {
      return SearchUtils.searchTokens(KRDS_DATA.designTokens.tokens, query);
    } catch (error) {
      ErrorLogger.logError('TOKEN_SEARCH_ERROR', 'MEDIUM', `토큰 검색 오류: ${error.message}`, {
        query
      });
      return [];
    }
  }
};

/**
 * 검색 유틸리티
 */
export const SearchUtils = {
  safeSearch: (data, dataType, mapFunction, sanitizedQuery) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    try {
      const found = data.filter(
        item =>
          item.name?.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
          item.id?.toLowerCase().includes(sanitizedQuery.toLowerCase())
      );
      return found.map(mapFunction).filter(Boolean);
    } catch (error) {
      ErrorLogger.logError('SEARCH_ERROR', 'MEDIUM', `검색 오류 in ${dataType}: ${error.message}`, {
        dataType,
        query: sanitizedQuery
      });
      return [];
    }
  },

  searchTokens: (tokens, sanitizedQuery) => {
    const tokenResults = [];
    Object.entries(tokens).forEach(([category, categoryTokens]) => {
      if (categoryTokens && typeof categoryTokens === 'object') {
        Object.entries(categoryTokens).forEach(([tokenName, tokenValue]) => {
          if (
            tokenName.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
            category.toLowerCase().includes(sanitizedQuery.toLowerCase())
          ) {
            tokenResults.push({
              type: '디자인 토큰',
              name: `${category}.${tokenName}`,
              description:
                typeof tokenValue === 'object'
                  ? tokenValue.description || JSON.stringify(tokenValue)
                  : String(tokenValue),
              id: `${category}-${tokenName}`
            });
          }
        });
      }
    });
    return tokenResults;
  }
};

/**
 * 검색 결과 포맷터
 */
export const SearchFormatters = {
  formatSearchResults: (searchResults, sanitizedQuery) => {
    const { results, totalCount, limited } = searchResults;

    const formattedResults = SearchFormatters.formatResults(results, false);
    const resultSummary = limited
      ? `총 ${totalCount}개의 결과를 찾았습니다 (처음 100개만 표시).`
      : `총 ${totalCount}개의 결과를 찾았습니다.`;

    return ResponseFormatter.createTextResponse(
      `## 검색 결과: "${sanitizedQuery}"\n\n${formattedResults}\n\n💡 ${resultSummary}`
    );
  },

  formatResults: (results, detailed) => {
    if (detailed) {
      return results
        .map(
          result =>
            `### ${result.type}: ${result.name}\n**ID**: ${result.id}\n**설명**: ${result.description || '설명 없음'}`
        )
        .join('\n\n');
    }
    return results
      .map(result => `### ${result.type}: ${result.name}\n${result.description || '설명 없음'}`)
      .join('\n\n');
  }
};

/**
 * 코드 생성기
 */
export const CodeGenerators = {
  findTargetItem: (type, id) => {
    const searchMethods = {
      component: () =>
        KRDS_DATA.components.find(
          c => c.id === id || c.name.toLowerCase().includes(id.toLowerCase())
        ),
      'global-pattern': () =>
        KRDS_DATA.globalPatterns.find(
          p => p.id === id || p.name.toLowerCase().includes(id.toLowerCase())
        ),
      'service-pattern': () =>
        KRDS_DATA.servicePatterns.find(
          p => p.id === id || p.name.toLowerCase().includes(id.toLowerCase())
        )
    };

    return searchMethods[type] ? searchMethods[type]() : null;
  },

  generateCode: (type, targetItem, options) => {
    const { variant, theme } = options;

    switch (type) {
      case 'component':
        return CodeGenerators.generateComponentCode(targetItem, { variant, theme });
      case 'global-pattern':
      case 'service-pattern':
        return targetItem.codeExample
          ? CodeUtils.adaptCodeForTheme(targetItem.codeExample, theme)
          : '';
      default:
        return '';
    }
  },

  generateComponentCode: (component, options = {}) => {
    const { variant, theme } = options;

    // 기본 컴포넌트 HTML 구조 생성
    let html = `<!-- ${component.name} -->\n<div class="krds-${component.id}`;

    if (variant) {
      html += ` krds-${component.id}--${variant}`;
    }

    if (theme === 'dark') {
      html += ' krds-dark-mode';
    }

    html += '">\n';

    // 컴포넌트 타입별 기본 구조
    html += CodeGenerators.generateComponentStructure(component);
    html += '</div>';

    return html;
  },

  generateComponentStructure: component => {
    switch (component.category) {
      case 'action':
        if (component.id.includes('button')) {
          return `  <button type="button" class="krds-button">${component.name}</button>\n`;
        }
        return `  <a href="#" class="krds-link">${component.name}</a>\n`;

      case 'input':
        return `  <label for="${component.id}-input">${component.name}</label>\n  <input type="text" id="${component.id}-input" class="krds-input">\n`;

      case 'feedback':
        return `  <div class="krds-alert" role="alert">\n    <span class="krds-alert__text">${
          component.name
        } 메시지</span>\n  </div>\n`;

      case 'navigation':
        return `  <nav aria-label="${component.name}">\n    <ul class="krds-nav">\n      <li><a href="#">메뉴 1</a></li>\n      <li><a href="#">메뉴 2</a></li>\n    </ul>\n  </nav>\n`;

      default:
        return `  <span class="krds-component">${component.name} 컴포넌트</span>\n`;
    }
  }
};

/**
 * 코드 유틸리티
 */
export const CodeUtils = {
  adaptCodeForTheme: (code, theme) => {
    if (theme === 'dark') {
      // 다크 모드용 클래스 추가
      return code.replace(/class="([^"]*?)"/g, (match, classes) => {
        return `class="${classes} krds-dark-mode"`;
      });
    }

    return code;
  }
};

/**
 * 코드 포맷터
 */
export const CodeFormatters = {
  formatGeneratedCode: (targetItem, generatedCode, theme) => {
    const themeText = theme === 'dark' ? '다크 모드' : '라이트 모드';
    const guidelines = targetItem.usageGuidelines
      ? targetItem.usageGuidelines.map(g => `- ${g}`).join('\n')
      : '기본 KRDS 가이드라인을 따르세요';

    return `## ${targetItem.name} 코드 생성

### HTML 코드
\`\`\`html
${generatedCode}
\`\`\`

### CSS 클래스 안내
- KRDS 표준 CSS 클래스를 사용합니다
- ${themeText} 최적화
- 접근성 속성이 포함되어 있습니다

### 사용 가이드라인
${guidelines}`;
  }
};

/**
 * 통계 계산기
 */
export const StatsCalculators = {
  calculateStats: detailed => {
    const basicStats = {
      totalComponents: KRDS_DATA.stats.componentsTotal,
      totalGlobalPatterns: KRDS_DATA.stats.globalPatternsTotal,
      totalServicePatterns: KRDS_DATA.stats.servicePatternsTotal,
      totalColors: KRDS_DATA.stats.colorsTotal,
      totalTypography: KRDS_DATA.stats.typographyTotal,
      totalDesignTokens: KRDS_DATA.stats.designTokensTotal
    };

    if (!detailed) {
      return { basic: basicStats };
    }

    // 상세 통계 계산
    const componentsByCategory = {};
    KRDS_DATA.components.forEach(c => {
      componentsByCategory[c.category] = (componentsByCategory[c.category] || 0) + 1;
    });

    const avgComponentsInPatterns = StatsCalculators.calculateAverageComponents();
    const avgStepsInServicePatterns = StatsCalculators.calculateAverageSteps();
    const accessibilityCompliance = StatsCalculators.calculateAccessibilityCompliance();

    return {
      basic: basicStats,
      detailed: {
        componentsByCategory,
        avgComponentsInPatterns,
        avgStepsInServicePatterns,
        accessibilityCompliance
      }
    };
  },

  calculateAverageComponents: () => {
    if (KRDS_DATA.globalPatterns.length === 0) {
      return 0;
    }

    return Math.round(
      KRDS_DATA.globalPatterns.reduce(
        (sum, p) => sum + (p.components ? p.components.length : 0),
        0
      ) / KRDS_DATA.globalPatterns.length
    );
  },

  calculateAverageSteps: () => {
    if (KRDS_DATA.servicePatterns.length === 0) {
      return 0;
    }

    return Math.round(
      KRDS_DATA.servicePatterns.reduce((sum, p) => sum + (p.flow ? p.flow.length : 0), 0) /
        KRDS_DATA.servicePatterns.length
    );
  },

  calculateAccessibilityCompliance: () => {
    const accessibilityCompliantColors = KRDS_DATA.colors.filter(
      c => c.accessibilityLevel && (c.accessibilityLevel === 'AA' || c.accessibilityLevel === 'AAA')
    ).length;

    const totalColors = KRDS_DATA.colors.length;
    const compliancePercentage =
      totalColors > 0 ? Math.round((accessibilityCompliantColors / totalColors) * 100) : 0;

    return {
      compliantColors: accessibilityCompliantColors,
      totalColors,
      percentage: compliancePercentage
    };
  }
};

/**
 * 통계 포맷터
 */
export const StatsFormatters = {
  formatStats: (statsData, detailed) => {
    const { basic } = statsData;

    let statsInfo = `## KRDS 시스템 통계\n\n### 전체 현황\n- 컴포넌트: ${basic.totalComponents}개\n- 글로벌 패턴: ${basic.totalGlobalPatterns}개\n- 서비스 패턴: ${basic.totalServicePatterns}개\n- 색상: ${basic.totalColors}개\n- 타이포그래피: ${basic.totalTypography}개\n- 디자인 토큰: ${basic.totalDesignTokens}개\n\n### 준수율 정보\n- KRDS 준수율: ${KRDS_DATA.meta.coverage.components}\n- 글로벌 패턴 완성도: ${KRDS_DATA.meta.coverage.globalPatterns}\n- 서비스 패턴 완성도: ${KRDS_DATA.meta.coverage.servicePatterns}\n- 접근성 준수: ${KRDS_DATA.meta.coverage.accessibility}\n\n### 시스템 정보\n- 버전: ${KRDS_DATA.meta.version}\n- 준수 기준: ${KRDS_DATA.meta.compliance}\n- 최종 업데이트: ${new Date(KRDS_DATA.meta.lastUpdated).toLocaleDateString('ko-KR')}`;

    if (detailed && statsData.detailed) {
      const { detailed: detailedStats } = statsData;

      statsInfo += `\n\n### 상세 통계\n\n#### 컴포넌트 카테고리별 분포\n${Object.entries(
        detailedStats.componentsByCategory
      )
        .map(([category, count]) => `- ${category}: ${count}개`)
        .join('\n')}`;

      if (detailedStats.avgComponentsInPatterns > 0) {
        statsInfo += `\n\n#### 글로벌 패턴 분석\n- 패턴당 평균 컴포넌트 수: ${detailedStats.avgComponentsInPatterns}개`;
      }

      if (detailedStats.avgStepsInServicePatterns > 0) {
        statsInfo += `\n\n#### 서비스 패턴 분석\n- 패턴당 평균 플로우 단계: ${detailedStats.avgStepsInServicePatterns}단계`;
      }

      const { accessibilityCompliance } = detailedStats;
      statsInfo += `\n\n#### 접근성 준수 현황\n- AA 이상 준수 색상: ${accessibilityCompliance.compliantColors}/${accessibilityCompliance.totalColors}개 (${accessibilityCompliance.percentage}%)`;
    }

    return statsInfo;
  }
};
