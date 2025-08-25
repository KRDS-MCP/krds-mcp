/**
 * KRDS MCP 서버 핸들러 모듈 통합 인덱스
 * 모든 핸들러 함수들을 모듈화하여 관리합니다.
 */

import {
  InputValidator,
  ErrorHandler,
  ResponseFormatter,
  DataService,
  SpecialValidators,
  AccessibilityValidator
} from '../helpers/index.js';
import { KRDS_DATA } from '../data/index.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * 디자인 원칙 조회 핸들러
 */
export async function handleGetDesignPrinciples(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(
      args,
      'designPrinciples',
      '디자인 원칙 조회'
    );

    const { principle } = validatedArgs;

    if (!DataService.isDataAvailable(KRDS_DATA.designPrinciples, '디자인 원칙')) {
      return ErrorHandler.handleDataUnavailable('디자인 원칙', '디자인 원칙 조회');
    }

    if (principle) {
      const result = DataService.queryData(KRDS_DATA.designPrinciples, {
        search: principle,
        searchFields: ['name', 'description']
      });

      if (result.items.length === 0) {
        return ErrorHandler.handleNoResults(principle, 'principles', '디자인 원칙 조회');
      }

      const found = result.items[0];
      const content = `## ${found.name}\n\n${found.description}\n\n### 가이드라인\n${found.guidelines?.map(g => `- ${g}`).join('\n') || '가이드라인 정보 없음'}\n\n### 예시\n${found.examples?.map(e => `- ${e}`).join('\n') || '예시 정보 없음'}`;

      return ResponseFormatter.createTextResponse(content);
    }

    // 전체 디자인 원칙 반환
    const principlesText = KRDS_DATA.designPrinciples
      .map(p => `### ${p.name}\n${p.description || '설명 없음'}`)
      .join('\n\n');

    return ResponseFormatter.createTextResponse(`## KRDS 디자인 원칙\n\n${principlesText}`);
  } catch (error) {
    return ErrorHandler.handleError(error, '디자인 원칙 조회', { args });
  }
}

/**
 * 색상 체계 조회 핸들러
 */
export async function handleGetColors(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(args, 'colors', '색상 체계 조회');

    const { color, category } = validatedArgs;

    if (!DataService.isDataAvailable(KRDS_DATA.colors, '색상 체계')) {
      return ErrorHandler.handleDataUnavailable('색상 체계', '색상 체계 조회');
    }

    const query = {
      filters: {},
      searchFields: ['name', 'id']
    };

    if (color) {
      query.search = color;
    }

    if (category) {
      query.filters.usage = category;
      query.filters.category = category;
    }

    const result = DataService.queryData(KRDS_DATA.colors, query);

    if (result.items.length === 0) {
      const searchTerm = color || category || '지정된 조건';
      return ErrorHandler.handleNoResults(searchTerm, 'colors', '색상 체계 조회');
    }

    return ResponseFormatter.createListResponse(
      'KRDS 색상 체계',
      result.items,
      colorItem => ResponseFormatter.formatColor(colorItem),
      { showCount: true, countSuffix: '개' }
    );
  } catch (error) {
    return ErrorHandler.handleError(error, '색상 체계 조회', { args });
  }
}

/**
 * 타이포그래피 조회 핸들러
 */
export async function handleGetTypography(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(
      args,
      'typography',
      '타이포그래피 조회'
    );

    const { style, category } = validatedArgs;

    if (!DataService.isDataAvailable(KRDS_DATA.typography, '타이포그래피')) {
      return ErrorHandler.handleDataUnavailable('타이포그래피', '타이포그래피 조회');
    }

    const searchFilters = {};
    if (style) {
      searchFilters.name = style;
    }
    if (category) {
      searchFilters.category = category;
    }

    const result = DataService.queryData(KRDS_DATA.typography, {
      filters: searchFilters,
      searchFields: ['name', 'usage', 'description']
    });

    if (result.items.length === 0) {
      const searchTerm = style || category || '지정된 조건';
      return ErrorHandler.handleNoResults(searchTerm, 'typography', '타이포그래피 조회');
    }

    return ResponseFormatter.createListResponse(
      'KRDS 타이포그래피',
      result.items,
      typography => ResponseFormatter.formatTypography(typography, { includeCSS: true }),
      { showCount: true, countSuffix: '개' }
    );
  } catch (error) {
    return ErrorHandler.handleError(error, '타이포그래피 조회', { args });
  }
}

/**
 * 컴포넌트 조회 핸들러
 */
export async function handleGetComponents(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(args, 'components', '컴포넌트 조회');

    const { component, category, includeCode } = validatedArgs;

    if (!DataService.isDataAvailable(KRDS_DATA.components, '컴포넌트')) {
      return ErrorHandler.handleDataUnavailable('컴포넌트', '컴포넌트 조회');
    }

    const query = {
      filters: {},
      searchFields: ['name', 'description', 'id']
    };

    if (component) {
      query.search = component;
    }

    if (category) {
      query.filters.category = category;
    }

    const result = DataService.queryData(KRDS_DATA.components, query);

    if (result.items.length === 0) {
      const searchTerm = component || category || '지정된 조건';
      return ErrorHandler.handleNoResults(searchTerm, 'components', '컴포넌트 조회');
    }

    return ResponseFormatter.createListResponse(
      'KRDS 컴포넌트',
      result.items,
      comp =>
        ResponseFormatter.formatComponent(comp, {
          includeCode,
          includeDetails: true
        }),
      {
        showCount: true,
        countSuffix: '개',
        maxItems: 50
      }
    );
  } catch (error) {
    return ErrorHandler.handleError(error, '컴포넌트 조회', { args });
  }
}

/**
 * 글로벌 패턴 조회 핸들러
 */
export async function handleGetGlobalPatterns(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(
      args,
      'globalPatterns',
      '글로벌 패턴 조회'
    );

    const { pattern, component, includeCode } = validatedArgs;

    if (!DataService.isDataAvailable(KRDS_DATA.globalPatterns, '글로벌 패턴')) {
      return ErrorHandler.handleDataUnavailable('글로벌 패턴', '글로벌 패턴 조회');
    }

    const query = {
      filters: {},
      searchFields: ['name', 'id', 'description']
    };

    if (pattern) {
      query.search = pattern;
    }

    if (component) {
      query.filters.components = component;
    }

    const result = DataService.queryData(KRDS_DATA.globalPatterns, query);

    if (result.items.length === 0) {
      const searchTerm = pattern || component || '지정된 조건';
      return ErrorHandler.handleNoResults(searchTerm, 'global-patterns', '글로벌 패턴 조회');
    }

    return ResponseFormatter.createListResponse(
      'KRDS 글로벌 패턴',
      result.items,
      pat =>
        ResponseFormatter.formatPattern(pat, {
          includeCode,
          includeFlow: true,
          includeComponents: true
        }),
      { showCount: true, countSuffix: '개' }
    );
  } catch (error) {
    return ErrorHandler.handleError(error, '글로벌 패턴 조회', { args });
  }
}

/**
 * 서비스 패턴 조회 핸들러
 */
export async function handleGetServicePatterns(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(
      args,
      'servicePatterns',
      '서비스 패턴 조회'
    );

    const { pattern, includeCode, includeMetrics } = validatedArgs;

    if (!DataService.isDataAvailable(KRDS_DATA.servicePatterns, '서비스 패턴')) {
      return ErrorHandler.handleDataUnavailable('서비스 패턴', '서비스 패턴 조회');
    }

    const query = {
      searchFields: ['name', 'id', 'description']
    };

    if (pattern) {
      query.search = pattern;
    }

    const result = DataService.queryData(KRDS_DATA.servicePatterns, query);

    if (result.items.length === 0) {
      const searchTerm = pattern || '지정된 조건';
      return ErrorHandler.handleNoResults(searchTerm, 'service-patterns', '서비스 패턴 조회');
    }

    // 메트릭 정보 추가 포맷팅
    const formatServicePattern = pat => {
      let formatted = ResponseFormatter.formatPattern(pat, {
        includeCode,
        includeFlow: true,
        includeComponents: true
      });

      if (includeMetrics && pat.metrics) {
        formatted += `\n- **성과 지표**:\n${Object.entries(pat.metrics)
          .map(([key, value]) => `  - ${key}: ${value}`)
          .join('\n')}`;
      }

      if (pat.implementationSteps && pat.implementationSteps.length > 0) {
        formatted += `\n- **구현 단계**:\n${pat.implementationSteps.map(s => `  - ${s}`).join('\n')}`;
      }

      return formatted;
    };

    return ResponseFormatter.createListResponse(
      'KRDS 서비스 패턴',
      result.items,
      formatServicePattern,
      { showCount: true, countSuffix: '개' }
    );
  } catch (error) {
    return ErrorHandler.handleError(error, '서비스 패턴 조회', { args });
  }
}

/**
 * Shapes & Icons 조회 핸들러
 */
export async function handleGetShapesIcons(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(
      args,
      'shapesIcons',
      'Shapes & Icons 조회'
    );

    const { type = 'both', iconCategory, iconId } = validatedArgs;

    let result = '';

    if (type === 'shapes' || type === 'both') {
      if (DataService.isDataAvailable(KRDS_DATA.shapes, 'Shapes') && Array.isArray(KRDS_DATA.shapes)) {
        const shapesContent = KRDS_DATA.shapes
          .map(
            shape =>
              `### ${shape.name}\n- **ID**: ${shape.id}\n- **설명**: ${shape.description}\n- **사용처**: ${shape.usage || '범용'}`
          )
          .join('\n\n');
        result += `## KRDS Shapes\n\n${shapesContent}`;
      } else {
        result += '## KRDS Shapes\n\nShape 데이터를 사용할 수 없습니다.';
      }
    }

    if (type === 'icons' || type === 'both') {
      if (DataService.isDataAvailable(KRDS_DATA.icons, 'Icons')) {
        const query = {
          filters: {},
          searchFields: ['name', 'id']
        };

        if (iconCategory) {
          query.filters.category = iconCategory;
        }

        if (iconId) {
          query.search = iconId;
        }

        const iconResult = DataService.queryData(KRDS_DATA.icons, query);

        if (iconResult.items.length > 0) {
          const iconsContent = iconResult.items
            .map(
              icon =>
                `### ${icon.name}\n- **ID**: ${icon.id}\n- **카테고리**: ${icon.category}\n- **설명**: ${icon.description || '설명 없음'}\n- **사용처**: ${icon.usage || '범용'}`
            )
            .join('\n\n');

          result += `${result ? '\n\n' : ''}## KRDS Icons\n\n${iconsContent}\n\n💡 총 ${iconResult.items.length}개의 아이콘을 찾았습니다.`;
        } else {
          result += `${result ? '\n\n' : ''}## KRDS Icons\n\n조건에 맞는 아이콘을 찾을 수 없습니다.`;
        }
      } else {
        result += `${result ? '\n\n' : ''}## KRDS Icons\n\n아이콘 데이터를 사용할 수 없습니다.`;
      }
    }

    return ResponseFormatter.createTextResponse(
      result || 'Shape 및 Icon 데이터를 찾을 수 없습니다.'
    );
  } catch (error) {
    return ErrorHandler.handleError(error, 'Shapes & Icons 조회', { args });
  }
}

/**
 * 접근성 검증 핸들러
 */
export async function handleValidateAccessibility(args) {
  try {
    const validatedArgs = InputValidator.validateAndSanitize(args, 'accessibility', '접근성 검증');

    const { htmlCode } = validatedArgs;

    const htmlValidation = SpecialValidators.validateHtmlCode(htmlCode);
    if (!htmlValidation.isValid) {
      throw new McpError(ErrorCode.InvalidRequest, htmlValidation.error);
    }

    const result = AccessibilityValidator.validateAccessibility(htmlCode);

    if (!result) {
      return ErrorHandler.handleDataUnavailable('접근성 검증 시스템', '접근성 검증');
    }

    let report = '## 접근성 검증 결과\n\n';
    report += `**접근성 점수: ${result.accessibilityScore || 0}/100**\n`;
    report += `**WCAG 준수 수준: ${result.wcagCompliance || '알 수 없음'}**\n\n`;

    if (result.issues && result.issues.length > 0) {
      report += `### 🚨 주요 이슈 (${result.issues.length}개)\n${result.issues.map(issue => `- ${issue}`).join('\n')}\n\n`;
    }

    if (result.warnings && result.warnings.length > 0) {
      report += `### ⚠️ 경고사항 (${result.warnings.length}개)\n${result.warnings.map(warning => `- ${warning}`).join('\n')}\n\n`;
    }

    if (result.recommendations && result.recommendations.length > 0) {
      report += `### 💡 개선 제안 (${result.recommendations.length}개)\n${result.recommendations.map(rec => `- ${rec}`).join('\n')}\n\n`;
    }

    if (result.detailedReport) {
      const details = result.detailedReport;
      report += '### 📊 상세 보고서\n';
      report += `- 총 검사 항목: ${details.totalChecks || 0}\n`;
      report += `- 통과한 검사: ${details.passedChecks || 0}\n`;
      report += `- 주요 이슈: ${details.criticalIssues || 0}\n`;
      report += `- 경고: ${details.warningCount || 0}\n`;
      report += `- 제안사항: ${details.recommendationCount || 0}\n\n`;

      if (details.totalChecks > 0) {
        const successRate = Math.round((details.passedChecks / details.totalChecks) * 100);
        report += `**검사 통과율: ${successRate}%**`;
      }
    }

    return ResponseFormatter.createTextResponse(report);
  } catch (error) {
    return ErrorHandler.handleError(error, '접근성 검증', {
      args: { htmlCodeLength: args?.htmlCode?.length || 0 }
    });
  }
}
