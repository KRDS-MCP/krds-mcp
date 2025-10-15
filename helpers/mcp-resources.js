/**
 * MCP 2025 Resources 시스템 구현
 * KRDS 디자인 시스템 관련 리소스를 MCP 클라이언트에 제공
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mcpLogger } from './mcp-logging.js';
import { KRDS_DATA } from '../data/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * KRDS MCP Resources 클래스
 */
export class McpResources {
  constructor() {
    this.resources = new Map();
    this.resourceTemplates = new Map();
    this.subscribers = new Set(); // 리소스 변경 구독자

    this.initializeResources();
  }

  /**
   * 기본 리소스들 초기화
   */
  initializeResources() {
    // 1. 문서 리소스
    this.addDocumentResources();

    // 2. 데이터 리소스
    this.addDataResources();

    // 3. 구성 리소스
    this.addConfigResources();

    // 4. 템플릿 리소스
    this.addTemplateResources();

    mcpLogger.info('MCP Resources initialized', 'resources', {
      totalResources: this.resources.size,
      totalTemplates: this.resourceTemplates.size
    });
  }

  /**
   * 문서 리소스 추가
   */
  addDocumentResources() {
    // README.md
    this.resources.set('krds://docs/readme', {
      uri: 'krds://docs/readme',
      name: 'KRDS MCP README',
      title: 'KRDS MCP 서버 문서',
      description: 'KRDS MCP 서버의 메인 문서 및 사용법',
      mimeType: 'text/markdown',
      annotations: {
        audience: ['developers', 'users'],
        priority: 1.0
      }
    });

    // CHANGELOG.md
    this.resources.set('krds://docs/changelog', {
      uri: 'krds://docs/changelog',
      name: 'KRDS MCP Changelog',
      title: 'KRDS MCP 변경 이력',
      description: 'KRDS MCP 서버의 버전별 변경 사항',
      mimeType: 'text/markdown',
      annotations: {
        audience: ['developers'],
        priority: 0.8
      }
    });

    // API 문서 (가상)
    this.resources.set('krds://docs/api', {
      uri: 'krds://docs/api',
      name: 'KRDS MCP API Reference',
      title: 'KRDS MCP API 참조 문서',
      description: '13개 도구의 상세 API 문서',
      mimeType: 'text/markdown',
      annotations: {
        audience: ['developers'],
        priority: 0.9
      }
    });
  }

  /**
   * 데이터 리소스 추가
   */
  addDataResources() {
    // 디자인 원칙
    this.resources.set('krds://data/design-principles', {
      uri: 'krds://data/design-principles',
      name: 'KRDS Design Principles',
      title: 'KRDS 디자인 원칙',
      description: 'KRDS 7대 디자인 원칙 데이터',
      mimeType: 'application/json',
      annotations: {
        audience: ['designers', 'developers'],
        priority: 1.0
      }
    });

    // 색상 시스템
    this.resources.set('krds://data/colors', {
      uri: 'krds://data/colors',
      name: 'KRDS Color System',
      title: 'KRDS 색상 시스템',
      description: 'KRDS 표준 색상 팔레트 및 가이드라인',
      mimeType: 'application/json',
      annotations: {
        audience: ['designers', 'developers'],
        priority: 1.0
      }
    });

    // 타이포그래피
    this.resources.set('krds://data/typography', {
      uri: 'krds://data/typography',
      name: 'KRDS Typography',
      title: 'KRDS 타이포그래피 시스템',
      description: 'KRDS 표준 글꼴 및 타이포그래피 가이드라인',
      mimeType: 'application/json',
      annotations: {
        audience: ['designers', 'developers'],
        priority: 1.0
      }
    });

    // 컴포넌트
    this.resources.set('krds://data/components', {
      uri: 'krds://data/components',
      name: 'KRDS Components',
      title: 'KRDS UI 컴포넌트',
      description: 'KRDS 37개 표준 UI 컴포넌트 라이브러리',
      mimeType: 'application/json',
      annotations: {
        audience: ['developers', 'designers'],
        priority: 1.0
      }
    });
  }

  /**
   * 구성 리소스 추가
   */
  addConfigResources() {
    // package.json
    this.resources.set('krds://config/package', {
      uri: 'krds://config/package',
      name: 'KRDS MCP Package Config',
      title: 'KRDS MCP 패키지 설정',
      description: 'KRDS MCP 서버의 패키지 설정 및 의존성 정보',
      mimeType: 'application/json',
      annotations: {
        audience: ['developers'],
        priority: 0.7
      }
    });

    // Claude Desktop 설정 예제
    this.resources.set('krds://config/claude-desktop', {
      uri: 'krds://config/claude-desktop',
      name: 'Claude Desktop Configuration',
      title: 'Claude Desktop MCP 설정',
      description: 'KRDS MCP 서버를 Claude Desktop에 연동하는 설정 예제',
      mimeType: 'application/json',
      annotations: {
        audience: ['users', 'developers'],
        priority: 0.9
      }
    });
  }

  /**
   * 템플릿 리소스 추가
   */
  addTemplateResources() {
    // 동적 컴포넌트 리소스 템플릿
    this.resourceTemplates.set('krds://template/component/{component_id}', {
      uriTemplate: 'krds://template/component/{component_id}',
      name: 'KRDS Component Template',
      title: 'KRDS 컴포넌트 상세 정보',
      description: '특정 KRDS 컴포넌트의 상세 정보 및 코드 예제',
      mimeType: 'application/json',
      annotations: {
        audience: ['developers'],
        priority: 0.8
      }
    });

    // 동적 색상 리소스 템플릿
    this.resourceTemplates.set('krds://template/color/{color_id}', {
      uriTemplate: 'krds://template/color/{color_id}',
      name: 'KRDS Color Template',
      title: 'KRDS 색상 상세 정보',
      description: '특정 KRDS 색상의 상세 정보 및 사용법',
      mimeType: 'application/json',
      annotations: {
        audience: ['designers', 'developers'],
        priority: 0.8
      }
    });
  }

  /**
   * 리소스 목록 조회 (페이지네이션 지원)
   * @param {string} cursor - 페이지네이션 커서
   * @param {number} limit - 한 페이지당 결과 수
   * @returns {object} 리소스 목록 응답
   */
  async listResources(cursor = null, limit = 50) {
    try {
      const allResources = Array.from(this.resources.values());

      // 커서 기반 페이지네이션
      let startIndex = 0;
      if (cursor) {
        try {
          const decodedCursor = JSON.parse(Buffer.from(cursor, 'base64').toString());
          startIndex = decodedCursor.index || 0;
        } catch (error) {
          mcpLogger.warning('Invalid pagination cursor', 'resources', { cursor });
          throw new Error('Invalid pagination cursor');
        }
      }

      const endIndex = Math.min(startIndex + limit, allResources.length);
      const pageResources = allResources.slice(startIndex, endIndex);

      const result = {
        resources: pageResources
      };

      // 다음 페이지가 있으면 nextCursor 추가
      if (endIndex < allResources.length) {
        const nextCursor = Buffer.from(JSON.stringify({ index: endIndex })).toString('base64');
        result.nextCursor = nextCursor;
      }

      mcpLogger.info('Resources listed', 'resources', {
        totalResources: allResources.length,
        pageSize: pageResources.length,
        startIndex,
        endIndex,
        hasNextPage: !!result.nextCursor
      });

      return result;
    } catch (error) {
      mcpLogger.error('Failed to list resources', 'resources', { error: error.message });
      throw error;
    }
  }

  /**
   * 리소스 템플릿 목록 조회
   * @param {string} cursor - 페이지네이션 커서
   * @param {number} limit - 한 페이지당 결과 수
   * @returns {object} 리소스 템플릿 목록 응답
   */
  async listResourceTemplates(cursor = null, limit = 50) {
    try {
      const allTemplates = Array.from(this.resourceTemplates.values());

      let startIndex = 0;
      if (cursor) {
        try {
          const decodedCursor = JSON.parse(Buffer.from(cursor, 'base64').toString());
          startIndex = decodedCursor.index || 0;
        } catch (error) {
          throw new Error('Invalid pagination cursor');
        }
      }

      const endIndex = Math.min(startIndex + limit, allTemplates.length);
      const pageTemplates = allTemplates.slice(startIndex, endIndex);

      const result = {
        resourceTemplates: pageTemplates
      };

      if (endIndex < allTemplates.length) {
        const nextCursor = Buffer.from(JSON.stringify({ index: endIndex })).toString('base64');
        result.nextCursor = nextCursor;
      }

      return result;
    } catch (error) {
      mcpLogger.error('Failed to list resource templates', 'resources', { error: error.message });
      throw error;
    }
  }

  /**
   * 리소스 내용 읽기
   * @param {string} uri - 리소스 URI
   * @returns {object} 리소스 내용 응답
   */
  async readResource(uri) {
    try {
      mcpLogger.debug('Reading resource', 'resources', { uri });

      // 정적 리소스 확인
      if (this.resources.has(uri)) {
        return await this.readStaticResource(uri);
      }

      // 템플릿 리소스 확인
      const templateMatch = this.matchResourceTemplate(uri);
      if (templateMatch) {
        return await this.readTemplateResource(uri, templateMatch);
      }

      throw new Error(`Resource not found: ${uri}`);
    } catch (error) {
      mcpLogger.error('Failed to read resource', 'resources', { uri, error: error.message });
      throw error;
    }
  }

  /**
   * 정적 리소스 읽기
   * @param {string} uri - 리소스 URI
   * @returns {object} 리소스 내용
   */
  async readStaticResource(uri) {
    const resource = this.resources.get(uri);
    let content = '';

    switch (uri) {
      case 'krds://docs/readme':
        content = await this.readFileContent('README.md');
        break;

      case 'krds://docs/changelog':
        content = await this.readFileContent('CHANGELOG.md');
        break;

      case 'krds://docs/api':
        content = this.generateApiDocumentation();
        break;

      case 'krds://data/design-principles':
        content = JSON.stringify(KRDS_DATA.designPrinciples, null, 2);
        break;

      case 'krds://data/colors':
        content = JSON.stringify(KRDS_DATA.colors, null, 2);
        break;

      case 'krds://data/typography':
        content = JSON.stringify(KRDS_DATA.typography, null, 2);
        break;

      case 'krds://data/components':
        content = JSON.stringify(KRDS_DATA.components, null, 2);
        break;

      case 'krds://config/package':
        content = await this.readFileContent('package.json');
        break;

      case 'krds://config/claude-desktop':
        content = this.generateClaudeDesktopConfig();
        break;

      default:
        throw new Error(`Unknown static resource: ${uri}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: resource.mimeType,
          text: content
        }
      ]
    };
  }

  /**
   * 템플릿 리소스 매칭
   * @param {string} uri - 요청 URI
   * @returns {object|null} 매칭 결과
   */
  matchResourceTemplate(uri) {
    for (const [templateUri, template] of this.resourceTemplates.entries()) {
      const pattern = templateUri.replace(/\{([^}]+)\}/g, '(?<$1>[^/]+)');
      const regex = new RegExp(`^${pattern}$`);
      const match = uri.match(regex);

      if (match) {
        return {
          template,
          params: match.groups || {}
        };
      }
    }
    return null;
  }

  /**
   * 템플릿 리소스 읽기
   * @param {string} uri - 리소스 URI
   * @param {object} templateMatch - 템플릿 매칭 결과
   * @returns {object} 리소스 내용
   */
  async readTemplateResource(uri, templateMatch) {
    const { template, params } = templateMatch;
    let content = '';

    if (uri.startsWith('krds://template/component/')) {
      const componentId = params.component_id;
      const component = KRDS_DATA.components.find(c => c.id === componentId || c.name === componentId);

      if (!component) {
        throw new Error(`Component not found: ${componentId}`);
      }

      content = JSON.stringify(
        {
          component,
          usage: this.generateComponentUsage(component),
          examples: this.generateComponentExamples(component)
        },
        null,
        2
      );
    } else if (uri.startsWith('krds://template/color/')) {
      const colorId = params.color_id;
      const color = KRDS_DATA.colors.find(c => c.id === colorId || c.name === colorId);

      if (!color) {
        throw new Error(`Color not found: ${colorId}`);
      }

      content = JSON.stringify(
        {
          color,
          variations: this.generateColorVariations(color),
          usage: this.generateColorUsage(color)
        },
        null,
        2
      );
    }

    return {
      contents: [
        {
          uri,
          mimeType: template.mimeType,
          text: content
        }
      ]
    };
  }

  /**
   * 파일 내용 읽기 헬퍼
   * @param {string} filename - 파일명
   * @returns {string} 파일 내용
   */
  async readFileContent(filename) {
    try {
      const filePath = join(dirname(__dirname), filename);
      return await readFile(filePath, 'utf8');
    } catch (error) {
      mcpLogger.warning(`Failed to read file: ${filename}`, 'resources', { error: error.message });
      return `# ${filename}\n\n파일을 읽을 수 없습니다: ${error.message}`;
    }
  }

  /**
   * API 문서 생성
   * @returns {string} API 문서 내용
   */
  generateApiDocumentation() {
    return `# KRDS MCP API Reference

## 개요
KRDS MCP 서버는 총 13개의 도구를 제공합니다.

## 도구 목록

### 1. krds_get_design_principles
- **설명**: KRDS 디자인 원칙 조회
- **매개변수**: \`principle\` (선택사항)

### 2. krds_get_colors
- **설명**: KRDS 색상 체계 조회
- **매개변수**: \`color\`, \`category\`

### 3. krds_get_typography
- **설명**: KRDS 타이포그래피 체계 조회
- **매개변수**: \`style\`, \`category\`

### 4. krds_get_components
- **설명**: KRDS 컴포넌트 정보 조회
- **매개변수**: \`component\`, \`category\`, \`includeCode\`

### 5. krds_get_global_patterns
- **설명**: KRDS 글로벌 패턴 조회
- **매개변수**: \`pattern\`, \`component\`, \`includeCode\`

### 6. krds_get_service_patterns
- **설명**: KRDS 서비스 패턴 조회
- **매개변수**: \`pattern\`, \`includeCode\`, \`includeMetrics\`

### 7. krds_get_shapes_icons
- **설명**: KRDS 도형 및 아이콘 조회
- **매개변수**: \`type\`, \`iconCategory\`, \`iconId\`

### 8. krds_get_design_tokens
- **설명**: KRDS 디자인 토큰 조회
- **매개변수**: \`category\`, \`tokenName\`, \`format\`, \`theme\`

### 9. krds_get_systems
- **설명**: KRDS 시스템 정보 조회
- **매개변수**: \`system\`

### 10. krds_validate_accessibility
- **설명**: HTML 접근성 검증
- **매개변수**: \`htmlCode\` (필수)

### 11. krds_search
- **설명**: KRDS 통합 검색
- **매개변수**: \`query\` (필수), \`type\`, \`detailed\`

### 12. krds_generate_code
- **설명**: KRDS 코드 생성
- **매개변수**: \`type\` (필수), \`id\` (필수), \`variant\`, \`theme\`

### 13. krds_get_stats
- **설명**: KRDS 통계 정보
- **매개변수**: \`detailed\`

## 사용법
각 도구는 MCP 프로토콜을 통해 호출할 수 있으며, JSON 스키마 검증을 거칩니다.
`;
  }

  /**
   * Claude Desktop 설정 생성
   * @returns {string} 설정 JSON
   */
  generateClaudeDesktopConfig() {
    return JSON.stringify(
      {
        mcpServers: {
          'krds-mcp': {
            command: 'npx',
            args: ['@krds-mcp/krds-mcp'],
            env: {}
          }
        }
      },
      null,
      2
    );
  }

  /**
   * 컴포넌트 사용법 생성
   * @param {object} component - 컴포넌트 데이터
   * @returns {object} 사용법 정보
   */
  generateComponentUsage(component) {
    return {
      when: `${component.name} 컴포넌트는 ${component.description}할 때 사용합니다.`,
      where: `${component.category} 카테고리의 UI에서 활용됩니다.`,
      guidelines: component.guidelines || []
    };
  }

  /**
   * 컴포넌트 예제 생성
   * @param {object} component - 컴포넌트 데이터
   * @returns {object} 예제 정보
   */
  generateComponentExamples(component) {
    return {
      basic: `<!-- ${component.name} 기본 사용 예제 -->`,
      advanced: `<!-- ${component.name} 고급 사용 예제 -->`,
      accessibility: `<!-- ${component.name} 접근성 고려 사항 -->`
    };
  }

  /**
   * 색상 변형 생성
   * @param {object} color - 색상 데이터
   * @returns {object} 색상 변형 정보
   */
  generateColorVariations(color) {
    return {
      light: color.light || color.hex,
      dark: color.dark || color.hex,
      hover: color.hover || color.hex,
      active: color.active || color.hex
    };
  }

  /**
   * 색상 사용법 생성
   * @param {object} color - 색상 데이터
   * @returns {object} 색상 사용법
   */
  generateColorUsage(color) {
    return {
      primary: `${color.name}은 ${color.usage || '다양한 UI 요소'}에 사용됩니다.`,
      contrast: color.contrast || 'WCAG AA 기준을 준수합니다.',
      combinations: color.combinations || []
    };
  }

  /**
   * 리소스 변경 알림 구독
   * @param {Function} callback - 콜백 함수
   */
  subscribe(callback) {
    this.subscribers.add(callback);
  }

  /**
   * 리소스 변경 알림 구독 해제
   * @param {Function} callback - 콜백 함수
   */
  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  /**
   * 리소스 변경 알림 발송
   * @param {string} uri - 변경된 리소스 URI
   * @param {string} type - 변경 타입 (created, updated, deleted)
   */
  notifyResourceChange(uri, type) {
    this.subscribers.forEach(callback => {
      try {
        callback({ uri, type, timestamp: new Date().toISOString() });
      } catch (error) {
        mcpLogger.error('Failed to notify resource change', 'resources', {
          uri,
          type,
          error: error.message
        });
      }
    });
  }

  /**
   * 리소스 통계
   * @returns {object} 통계 정보
   */
  getResourceStats() {
    return {
      totalResources: this.resources.size,
      totalTemplates: this.resourceTemplates.size,
      subscribers: this.subscribers.size,
      categories: {
        docs: Array.from(this.resources.keys()).filter(uri => uri.startsWith('krds://docs/')).length,
        data: Array.from(this.resources.keys()).filter(uri => uri.startsWith('krds://data/')).length,
        config: Array.from(this.resources.keys()).filter(uri => uri.startsWith('krds://config/')).length,
        templates: this.resourceTemplates.size
      }
    };
  }
}

/**
 * 글로벌 MCP 리소스 인스턴스
 */
export const mcpResources = new McpResources();

export default mcpResources;
