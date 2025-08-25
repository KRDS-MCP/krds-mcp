/**
 * MCP 2025 Prompts 시스템 구현
 * KRDS 디자인 시스템 관련 프롬프트 템플릿 제공
 */

import { mcpLogger } from './mcp-logging.js';
import { McpPagination } from './mcp-pagination.js';
import { KRDS_DATA } from '../data/index.js';

/**
 * KRDS MCP Prompts 클래스
 */
export class McpPrompts {
  constructor() {
    this.prompts = new Map();
    this.initializePrompts();
  }

  /**
   * 기본 프롬프트들 초기화
   */
  initializePrompts() {
    // 1. 디자인 시스템 분석 프롬프트
    this.addDesignAnalysisPrompts();

    // 2. 코드 리뷰 프롬프트
    this.addCodeReviewPrompts();

    // 3. 접근성 검토 프롬프트
    this.addAccessibilityPrompts();

    // 4. 디자인 가이드 프롬프트
    this.addDesignGuidePrompts();

    // 5. 컴포넌트 개발 프롬프트
    this.addComponentDevelopmentPrompts();

    mcpLogger.info('MCP Prompts initialized', 'prompts', {
      totalPrompts: this.prompts.size
    });
  }

  /**
   * 디자인 시스템 분석 프롬프트 추가
   */
  addDesignAnalysisPrompts() {
    this.prompts.set('krds-design-audit', {
      name: 'krds-design-audit',
      title: 'KRDS 디자인 시스템 감사',
      description: '현재 디자인이 KRDS 가이드라인을 준수하는지 분석합니다',
      arguments: [
        {
          name: 'design_area',
          description: '분석할 디자인 영역 (색상, 타이포그래피, 컴포넌트, 패턴)',
          required: false
        },
        {
          name: 'specific_component',
          description: '특정 컴포넌트명 (선택사항)',
          required: false
        }
      ]
    });

    this.prompts.set('krds-compliance-check', {
      name: 'krds-compliance-check',
      title: 'KRDS 준수성 점검',
      description: '웹페이지나 앱이 KRDS 표준을 얼마나 준수하는지 평가합니다',
      arguments: [
        {
          name: 'page_url',
          description: '점검할 페이지 URL 또는 스크린샷',
          required: false
        },
        {
          name: 'focus_areas',
          description: '중점 점검 영역 (접근성, 디자인 일관성, 사용성)',
          required: false
        }
      ]
    });
  }

  /**
   * 코드 리뷰 프롬프트 추가
   */
  addCodeReviewPrompts() {
    this.prompts.set('krds-code-review', {
      name: 'krds-code-review',
      title: 'KRDS 기반 코드 리뷰',
      description: 'KRDS 가이드라인에 따라 HTML/CSS 코드를 리뷰합니다',
      arguments: [
        {
          name: 'code_snippet',
          description: '리뷰할 HTML/CSS 코드',
          required: true
        },
        {
          name: 'review_focus',
          description: '리뷰 초점 (구조, 스타일링, 접근성, 성능)',
          required: false
        }
      ]
    });

    this.prompts.set('krds-css-optimization', {
      name: 'krds-css-optimization',
      title: 'KRDS CSS 최적화 제안',
      description: 'KRDS 디자인 토큰을 활용한 CSS 최적화 방안을 제안합니다',
      arguments: [
        {
          name: 'css_code',
          description: '최적화할 CSS 코드',
          required: true
        },
        {
          name: 'target_theme',
          description: '대상 테마 (light, dark, both)',
          required: false
        }
      ]
    });
  }

  /**
   * 접근성 검토 프롬프트 추가
   */
  addAccessibilityPrompts() {
    this.prompts.set('krds-accessibility-audit', {
      name: 'krds-accessibility-audit',
      title: 'KRDS 접근성 감사',
      description: 'WCAG 2.1 AA 기준과 KRDS 접근성 가이드라인에 따라 감사합니다',
      arguments: [
        {
          name: 'html_content',
          description: '검토할 HTML 콘텐츠',
          required: true
        },
        {
          name: 'audit_level',
          description: '감사 수준 (basic, comprehensive, expert)',
          required: false
        }
      ]
    });

    this.prompts.set('krds-color-contrast-check', {
      name: 'krds-color-contrast-check',
      title: 'KRDS 색상 대비 검사',
      description: 'KRDS 색상 팔레트의 대비율을 검사하고 개선안을 제시합니다',
      arguments: [
        {
          name: 'foreground_color',
          description: '전경 색상 (hex, rgb)',
          required: true
        },
        {
          name: 'background_color',
          description: '배경 색상 (hex, rgb)',
          required: true
        },
        {
          name: 'content_type',
          description: '콘텐츠 유형 (text, large-text, graphic)',
          required: false
        }
      ]
    });
  }

  /**
   * 디자인 가이드 프롬프트 추가
   */
  addDesignGuidePrompts() {
    this.prompts.set('krds-design-recommendation', {
      name: 'krds-design-recommendation',
      title: 'KRDS 디자인 추천',
      description: '사용자 요구사항에 맞는 KRDS 디자인 솔루션을 추천합니다',
      arguments: [
        {
          name: 'use_case',
          description: '사용 사례 또는 요구사항',
          required: true
        },
        {
          name: 'user_type',
          description: '대상 사용자 (일반 시민, 공무원, 전문가)',
          required: false
        },
        {
          name: 'device_type',
          description: '대상 디바이스 (desktop, mobile, tablet)',
          required: false
        }
      ]
    });

    this.prompts.set('krds-pattern-selection', {
      name: 'krds-pattern-selection',
      title: 'KRDS 패턴 선택 가이드',
      description: '특정 상황에 적합한 KRDS 디자인 패턴을 선택하는 가이드를 제공합니다',
      arguments: [
        {
          name: 'service_type',
          description: '서비스 유형 (민원, 정보제공, 신청/접수, 결제)',
          required: true
        },
        {
          name: 'complexity_level',
          description: '복잡도 수준 (simple, moderate, complex)',
          required: false
        }
      ]
    });
  }

  /**
   * 컴포넌트 개발 프롬프트 추가
   */
  addComponentDevelopmentPrompts() {
    this.prompts.set('krds-component-generator', {
      name: 'krds-component-generator',
      title: 'KRDS 컴포넌트 생성기',
      description: 'KRDS 가이드라인을 따르는 컴포넌트 코드를 생성합니다',
      arguments: [
        {
          name: 'component_type',
          description: '컴포넌트 유형',
          required: true
        },
        {
          name: 'framework',
          description: '프레임워크 (html, react, vue, angular)',
          required: false
        },
        {
          name: 'variant',
          description: '변형 (primary, secondary, outline, ghost)',
          required: false
        }
      ]
    });

    this.prompts.set('krds-component-migration', {
      name: 'krds-component-migration',
      title: 'KRDS 컴포넌트 마이그레이션',
      description: '기존 컴포넌트를 KRDS 표준으로 마이그레이션하는 방법을 안내합니다',
      arguments: [
        {
          name: 'current_code',
          description: '현재 컴포넌트 코드',
          required: true
        },
        {
          name: 'target_component',
          description: '대상 KRDS 컴포넌트명',
          required: false
        }
      ]
    });

    this.prompts.set('krds-responsive-design', {
      name: 'krds-responsive-design',
      title: 'KRDS 반응형 디자인 가이드',
      description: 'KRDS 브레이크포인트를 활용한 반응형 디자인 구현 가이드',
      arguments: [
        {
          name: 'layout_type',
          description: '레이아웃 유형 (grid, flexbox, custom)',
          required: false
        },
        {
          name: 'content_priority',
          description: '콘텐츠 우선순위 (high, medium, low)',
          required: false
        }
      ]
    });
  }

  /**
   * 프롬프트 목록 조회 (페이지네이션 지원)
   * @param {string} cursor - 페이지네이션 커서
   * @param {number} limit - 한 페이지당 결과 수
   * @returns {object} 프롬프트 목록 응답
   */
  async listPrompts(cursor = null, limit = 20) {
    try {
      const allPrompts = Array.from(this.prompts.values());

      const paginationResult = McpPagination.paginateArray(
        allPrompts,
        cursor,
        limit,
        'name', // 이름순 정렬
        'asc'
      );

      const result = {
        prompts: paginationResult.items
      };

      if (paginationResult.nextCursor) {
        result.nextCursor = paginationResult.nextCursor;
      }

      mcpLogger.info('Prompts listed', 'prompts', {
        totalPrompts: allPrompts.length,
        pageSize: paginationResult.items.length,
        hasNextPage: !!result.nextCursor
      });

      return result;
    } catch (error) {
      mcpLogger.error('Failed to list prompts', 'prompts', { error: error.message });
      throw error;
    }
  }

  /**
   * 특정 프롬프트 조회
   * @param {string} name - 프롬프트 이름
   * @param {object} args - 프롬프트 인자
   * @returns {object} 프롬프트 응답
   */
  async getPrompt(name, args = {}) {
    try {
      const prompt = this.prompts.get(name);

      if (!prompt) {
        return null;
      }

      // 인자 검증
      this.validatePromptArguments(prompt, args);

      // 프롬프트 메시지 생성
      const messages = await this.generatePromptMessages(prompt, args);

      mcpLogger.info('Prompt retrieved', 'prompts', {
        name,
        argumentsProvided: Object.keys(args).length,
        messagesGenerated: messages.length
      });

      return {
        description: prompt.description,
        messages
      };
    } catch (error) {
      mcpLogger.error('Failed to get prompt', 'prompts', { name, error: error.message });
      throw error;
    }
  }

  /**
   * 프롬프트 인자 검증
   * @param {object} prompt - 프롬프트 정의
   * @param {object} args - 제공된 인자
   */
  validatePromptArguments(prompt, args) {
    const requiredArgs = prompt.arguments?.filter(arg => arg.required) || [];

    for (const requiredArg of requiredArgs) {
      if (!(requiredArg.name in args) || !args[requiredArg.name]) {
        throw new Error(`Required argument missing: ${requiredArg.name}`);
      }
    }
  }

  /**
   * 프롬프트 메시지 생성
   * @param {object} prompt - 프롬프트 정의
   * @param {object} args - 프롬프트 인자
   * @returns {Array} 메시지 배열
   */
  async generatePromptMessages(prompt, args) {
    const messages = [];

    // 시스템 메시지 (KRDS 컨텍스트)
    messages.push({
      role: 'system',
      content: {
        type: 'text',
        text: await this.generateSystemMessage(prompt, args)
      }
    });

    // 사용자 메시지 (구체적인 요청)
    messages.push({
      role: 'user',
      content: {
        type: 'text',
        text: await this.generateUserMessage(prompt, args)
      }
    });

    // 참고 자료 추가 (필요한 경우)
    const referenceContent = await this.generateReferenceContent(prompt, args);
    if (referenceContent) {
      messages.push({
        role: 'assistant',
        content: {
          type: 'text',
          text: referenceContent
        }
      });
    }

    return messages;
  }

  /**
   * 시스템 메시지 생성
   * @param {object} prompt - 프롬프트 정의
   * @param {object} args - 프롬프트 인자
   * @returns {string} 시스템 메시지
   */
  async generateSystemMessage(prompt, args) {
    const baseContext = `당신은 KRDS (Korea Government Design System) 전문가입니다. 
KRDS는 한국 정부 디지털 서비스의 표준 디자인 시스템으로, 사용자 중심의 일관되고 접근 가능한 디지털 경험을 제공합니다.

주요 원칙:
- 사용자 중심: 시민의 편의와 이해를 최우선으로 고려
- 포용성: 모든 사용자가 접근할 수 있도록 설계
- 간결성: 불필요한 요소 제거, 핵심에 집중
- 일관성: 모든 서비스에서 동일한 경험 제공
- 신뢰성: 정확하고 안정적인 서비스 제공
- 효율성: 빠르고 효과적인 업무 처리
- 혁신성: 최신 기술과 방법론 적용

당신의 역할: ${prompt.description}`;

    // 특정 프롬프트별 추가 컨텍스트
    switch (prompt.name) {
      case 'krds-accessibility-audit':
        return `${baseContext}\n\n추가 컨텍스트:
- WCAG 2.1 AA 수준 준수 필수
- 한국어 웹 접근성 가이드라인 고려
- 정부 웹사이트 접근성 품질 마크 기준 적용`;

      case 'krds-design-audit':
        return `${baseContext}\n\n추가 컨텍스트:
- KRDS 색상 팔레트: ${this.getColorSummary()}
- KRDS 타이포그래피: ${this.getTypographySummary()}
- KRDS 컴포넌트: ${this.getComponentSummary()}`;

      case 'krds-component-generator':
        return `${baseContext}\n\n추가 컨텍스트:
- HTML5 시맨틱 마크업 필수
- CSS3 모던 기법 활용
- 반응형 디자인 기본 적용
- 접근성 속성(aria-*) 포함`;

      default:
        return baseContext;
    }
  }

  /**
   * 사용자 메시지 생성
   * @param {object} prompt - 프롬프트 정의
   * @param {object} args - 프롬프트 인자
   * @returns {string} 사용자 메시지
   */
  async generateUserMessage(prompt, args) {
    let message = `${prompt.title}을 수행해주세요.\n\n`;

    // 제공된 인자들을 메시지에 포함
    if (Object.keys(args).length > 0) {
      message += '제공된 정보:\n';
      for (const [key, value] of Object.entries(args)) {
        const argDef = prompt.arguments?.find(arg => arg.name === key);
        const argDescription = argDef ? argDef.description : key;
        message += `- ${argDescription}: ${value}\n`;
      }
      message += '\n';
    }

    // 프롬프트별 특화 요청사항 추가
    switch (prompt.name) {
      case 'krds-code-review':
        message +=
          '다음 관점에서 코드를 검토해주세요:\n1. KRDS 가이드라인 준수 여부\n2. 접근성 개선점\n3. 코드 품질 및 최적화\n4. 구체적인 수정 제안';
        break;

      case 'krds-accessibility-audit':
        message +=
          '다음 항목을 중점적으로 검토해주세요:\n1. 키보드 내비게이션\n2. 스크린 리더 호환성\n3. 색상 대비\n4. 대체 텍스트\n5. 폼 레이블링\n6. ARIA 속성';
        break;

      case 'krds-design-recommendation':
        message +=
          '다음을 고려하여 추천해주세요:\n1. 적합한 KRDS 컴포넌트\n2. 권장 디자인 패턴\n3. 사용성 고려사항\n4. 구현 우선순위';
        break;

      case 'krds-component-generator':
        message +=
          '다음을 포함하여 코드를 생성해주세요:\n1. HTML 구조\n2. CSS 스타일\n3. JavaScript (필요시)\n4. 접근성 속성\n5. 반응형 고려사항\n6. 사용 예제';
        break;
    }

    return message;
  }

  /**
   * 참고 자료 생성
   * @param {object} prompt - 프롬프트 정의
   * @param {object} args - 프롬프트 인자
   * @returns {string|null} 참고 자료
   */
  async generateReferenceContent(prompt, args) {
    switch (prompt.name) {
      case 'krds-design-audit':
        return this.getDesignAuditReferences(args);

      case 'krds-component-generator':
        return this.getComponentReferences(args);

      case 'krds-accessibility-audit':
        return this.getAccessibilityReferences();

      default:
        return null;
    }
  }

  /**
   * 색상 요약 정보
   * @returns {string} 색상 요약
   */
  getColorSummary() {
    const colors = KRDS_DATA.colors || [];
    return colors
      .slice(0, 5)
      .map(c => `${c.name}(${c.hex})`)
      .join(', ');
  }

  /**
   * 타이포그래피 요약 정보
   * @returns {string} 타이포그래피 요약
   */
  getTypographySummary() {
    const typography = KRDS_DATA.typography || [];
    return typography
      .slice(0, 3)
      .map(t => `${t.name}(${t.fontSize})`)
      .join(', ');
  }

  /**
   * 컴포넌트 요약 정보
   * @returns {string} 컴포넌트 요약
   */
  getComponentSummary() {
    const components = KRDS_DATA.components || [];
    const categories = [...new Set(components.map(c => c.category))];
    return `${components.length}개 컴포넌트 (${categories.join(', ')})`;
  }

  /**
   * 디자인 감사 참고 자료
   * @param {object} args - 인자
   * @returns {string} 참고 자료
   */
  getDesignAuditReferences(args) {
    return `## KRDS 참고 자료

### 디자인 원칙
${
  KRDS_DATA.designPrinciples
    ?.slice(0, 3)
    .map(p => `- ${p.name}: ${p.description}`)
    .join('\n') || '디자인 원칙 정보 없음'
}

### 주요 색상
${
  KRDS_DATA.colors
    ?.slice(0, 5)
    .map(c => `- ${c.name}: ${c.hex} (${c.usage || '사용법 정보 없음'})`)
    .join('\n') || '색상 정보 없음'
}`;
  }

  /**
   * 컴포넌트 참고 자료
   * @param {object} args - 인자
   * @returns {string} 참고 자료
   */
  getComponentReferences(args) {
    const componentType = args.component_type;
    const matchingComponents =
      KRDS_DATA.components?.filter(
        c =>
          c.name.toLowerCase().includes(componentType?.toLowerCase() || '') ||
          c.category?.toLowerCase().includes(componentType?.toLowerCase() || '')
      ) || [];

    return `## KRDS 컴포넌트 참고

### 관련 컴포넌트
${
  matchingComponents
    .slice(0, 3)
    .map(c => `- ${c.name}: ${c.description || '설명 없음'}`)
    .join('\n') || '관련 컴포넌트 없음'
}

### 디자인 토큰
- 색상: KRDS 표준 색상 팔레트 사용
- 간격: 4px 기준 스페이싱 시스템
- 폰트: 정부 표준 웹폰트 적용`;
  }

  /**
   * 접근성 참고 자료
   * @returns {string} 참고 자료
   */
  getAccessibilityReferences() {
    return `## 접근성 참고 사항

### WCAG 2.1 AA 주요 기준
- 색상 대비: 4.5:1 이상 (일반 텍스트), 3:1 이상 (대형 텍스트)
- 키보드 접근: 모든 기능이 키보드로 조작 가능
- 초점 표시: 명확한 포커스 인디케이터
- 대체 텍스트: 의미있는 이미지에 alt 텍스트 제공

### 한국 웹 접근성 가이드라인
- 한국어 스크린 리더 호환성
- 정부 웹사이트 접근성 품질 마크 기준
- 장애인차별금지법 준수`;
  }

  /**
   * 프롬프트 통계
   * @returns {object} 통계 정보
   */
  getPromptStats() {
    const categories = {};
    const argumentStats = {};

    for (const prompt of this.prompts.values()) {
      // 카테고리별 분류 (프롬프트 이름 기반)
      const category = prompt.name.split('-')[1] || 'other';
      categories[category] = (categories[category] || 0) + 1;

      // 인자 통계
      const argCount = prompt.arguments?.length || 0;
      argumentStats[argCount] = (argumentStats[argCount] || 0) + 1;
    }

    return {
      total: this.prompts.size,
      categories,
      argumentStats,
      averageArguments:
        Array.from(this.prompts.values()).reduce((sum, p) => sum + (p.arguments?.length || 0), 0) /
        this.prompts.size
    };
  }
}

/**
 * 글로벌 MCP 프롬프트 인스턴스
 */
export const mcpPrompts = new McpPrompts();

export default mcpPrompts;
