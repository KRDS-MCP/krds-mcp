#!/usr/bin/env node

/**
 * KRDS (Korea Design System) Node.js MCP 서버
 *
 * 한국 정부 디지털 서비스의 표준 디자인 시스템인 KRDS의
 * 가이드라인을 기반으로 코딩에 디자인 지침을 제공하는 MCP 서버입니다.
 *
 * 이 파일은 모듈화된 구조를 사용합니다.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

// 분할된 모듈들 import
import { ErrorLogger, DataService } from './helpers/index.js';
import {
  handleGetDesignPrinciples,
  handleGetColors,
  handleGetTypography,
  handleGetComponents,
  handleGetGlobalPatterns,
  handleGetServicePatterns,
  handleGetShapesIcons,
  handleValidateAccessibility
} from './handlers/index.js';

// Import additional handlers for better organization
import {
  handleGetDesignTokens,
  handleGetSystems,
  handleSearch,
  handleGenerateCode,
  handleGetStats
} from './handlers/extended-handlers.js';

// MCP 서버 생성
const server = new Server(
  {
    name: 'krds-mcp-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// 도구 목록 조회 핸들러
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'krds_get_design_principles',
        description: 'KRDS 디자인 원칙 조회',
        inputSchema: {
          type: 'object',
          properties: {
            principle: {
              type: 'string',
              description: '찾을 디자인 원칙 이름 (선택사항)'
            }
          }
        }
      },
      {
        name: 'krds_get_colors',
        description: 'KRDS 색상 체계 조회 (완전한 색상 시스템)',
        inputSchema: {
          type: 'object',
          properties: {
            color: {
              type: 'string',
              description: '찾을 색상 이름 또는 ID (선택사항)'
            },
            category: {
              type: 'string',
              description: '색상 카테고리 (primary, system, neutral, emphasis, graphic)',
              enum: ['primary', 'system', 'neutral', 'emphasis', 'graphic']
            }
          }
        }
      },
      {
        name: 'krds_get_typography',
        description: 'KRDS 타이포그래피 체계 조회 (완전한 타이포그래피 시스템)',
        inputSchema: {
          type: 'object',
          properties: {
            style: {
              type: 'string',
              description: '찾을 타이포그래피 스타일 ID 또는 이름 (선택사항)'
            },
            category: {
              type: 'string',
              description: '타이포그래피 카테고리 (display, heading, body, interactive, utility)',
              enum: ['display', 'heading', 'body', 'interactive', 'utility']
            }
          }
        }
      },
      {
        name: 'krds_get_components',
        description: 'KRDS 컴포넌트 정보 조회 (37개 전체 컴포넌트)',
        inputSchema: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              description: '찾을 컴포넌트 이름 또는 ID (선택사항)'
            },
            category: {
              type: 'string',
              description: '컴포넌트 카테고리',
              enum: [
                'identity',
                'navigation',
                'layout-expression',
                'action',
                'selection',
                'feedback',
                'help',
                'input',
                'settings',
                'content'
              ]
            },
            includeCode: {
              type: 'boolean',
              description: 'HTML 코드 예제 포함 여부',
              default: false
            }
          }
        }
      },
      {
        name: 'krds_get_global_patterns',
        description: 'KRDS 글로벌 패턴 조회 (11개 기본 패턴)',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
              description: '찾을 패턴 이름 또는 ID (선택사항)'
            },
            component: {
              type: 'string',
              description: '특정 컴포넌트가 사용되는 패턴 찾기 (선택사항)'
            },
            includeCode: {
              type: 'boolean',
              description: 'HTML 코드 예제 포함 여부',
              default: false
            }
          }
        }
      },
      {
        name: 'krds_get_service_patterns',
        description: 'KRDS 서비스 패턴 조회 (5개 서비스별 패턴)',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
              description: '찾을 서비스 패턴 이름 또는 ID (선택사항)'
            },
            includeCode: {
              type: 'boolean',
              description: 'HTML 코드 예제 포함 여부',
              default: false
            },
            includeMetrics: {
              type: 'boolean',
              description: '성과 지표 정보 포함 여부',
              default: false
            }
          }
        }
      },
      {
        name: 'krds_get_shapes_icons',
        description: 'KRDS Shape 및 Icons 정보 조회',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: '조회할 타입',
              enum: ['shapes', 'icons', 'both']
            },
            iconCategory: {
              type: 'string',
              description: '아이콘 카테고리 (icons 타입 선택 시)',
              enum: ['system', 'status', 'action', 'communication', 'file', 'government']
            },
            iconId: {
              type: 'string',
              description: '특정 아이콘 ID (선택사항)'
            }
          }
        }
      },
      {
        name: 'krds_get_design_tokens',
        description: 'KRDS 디자인 토큰 조회 (완전한 토큰 시스템)',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: '토큰 카테고리',
              enum: [
                'color',
                'typography',
                'spacing',
                'sizing',
                'border',
                'shadow',
                'motion',
                'layout',
                'component'
              ]
            },
            tokenName: {
              type: 'string',
              description: '특정 토큰 이름 (선택사항)'
            },
            format: {
              type: 'string',
              description: '출력 형식',
              enum: ['json', 'css', 'style-dictionary'],
              default: 'json'
            },
            theme: {
              type: 'string',
              description: '테마',
              enum: ['light', 'dark'],
              default: 'light'
            }
          }
        }
      },
      {
        name: 'krds_get_systems',
        description: 'KRDS 기본 시스템 정보 조회 (스페이싱, 그리드, 반응형)',
        inputSchema: {
          type: 'object',
          properties: {
            system: {
              type: 'string',
              description: '조회할 시스템 (spacing, grid, responsive, darkmode)',
              enum: ['spacing', 'grid', 'responsive', 'darkmode']
            }
          }
        }
      },
      {
        name: 'krds_validate_accessibility',
        description: 'HTML 코드의 접근성 검증 (WCAG 2.1 AA 기준)',
        inputSchema: {
          type: 'object',
          properties: {
            htmlCode: {
              type: 'string',
              description: '검증할 HTML 코드'
            }
          },
          required: ['htmlCode']
        }
      },
      {
        name: 'krds_search',
        description: 'KRDS 전체 데이터에서 통합 검색',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '검색할 키워드'
            },
            type: {
              type: 'string',
              description: '검색할 데이터 타입',
              enum: [
                'all',
                'principles',
                'colors',
                'typography',
                'components',
                'global-patterns',
                'service-patterns',
                'icons',
                'tokens'
              ]
            },
            detailed: {
              type: 'boolean',
              description: '상세 정보 포함 여부',
              default: false
            }
          },
          required: ['query']
        }
      },
      {
        name: 'krds_generate_code',
        description: 'KRDS 컴포넌트/패턴의 HTML/CSS 코드 생성',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: '생성할 코드 타입',
              enum: ['component', 'global-pattern', 'service-pattern']
            },
            id: {
              type: 'string',
              description: '컴포넌트/패턴 ID'
            },
            variant: {
              type: 'string',
              description: '컴포넌트 변형 (선택사항)'
            },
            theme: {
              type: 'string',
              description: '테마',
              enum: ['light', 'dark'],
              default: 'light'
            }
          },
          required: ['type', 'id']
        }
      },
      {
        name: 'krds_get_stats',
        description: 'KRDS 시스템 통계 및 준수율 정보',
        inputSchema: {
          type: 'object',
          properties: {
            detailed: {
              type: 'boolean',
              description: '상세 통계 포함 여부',
              default: false
            }
          }
        }
      }
    ]
  };
});

// 도구 실행 핸들러
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'krds_get_design_principles':
        return await handleGetDesignPrinciples(args);

      case 'krds_get_colors':
        return await handleGetColors(args);

      case 'krds_get_typography':
        return await handleGetTypography(args);

      case 'krds_get_components':
        return await handleGetComponents(args);

      case 'krds_get_global_patterns':
        return await handleGetGlobalPatterns(args);

      case 'krds_get_service_patterns':
        return await handleGetServicePatterns(args);

      case 'krds_get_shapes_icons':
        return await handleGetShapesIcons(args);

      case 'krds_get_design_tokens':
        return await handleGetDesignTokens(args);

      case 'krds_get_systems':
        return await handleGetSystems(args);

      case 'krds_validate_accessibility':
        return await handleValidateAccessibility(args);

      case 'krds_search':
        return await handleSearch(args);

      case 'krds_generate_code':
        return await handleGenerateCode(args);

      case 'krds_get_stats':
        return await handleGetStats(args);

      default:
        throw new McpError(ErrorCode.MethodNotFound, `알 수 없는 도구: ${name}`);
    }
  } catch (error) {
    throw new McpError(ErrorCode.InternalError, `도구 실행 중 오류 발생: ${error.message}`);
  }
});

// Legacy function - functionality moved to extended-handlers.js

// Moved to extended-handlers.js for better organization

// Code generation utilities moved to extended-handlers.js

// Moved to extended-handlers.js

// Statistics handler moved to extended-handlers.js

// Search utilities moved to extended-handlers.js

// Data search functions moved to extended-handlers.js

// Search handler moved to extended-handlers.js

// All helper functions and handlers moved to extended-handlers.js for better organization

// 오류 처리 시스템 초기화
process.on('uncaughtException', error => {
  ErrorLogger.logError('UNCAUGHT_EXCEPTION', 'CRITICAL', `처리되지 않은 예외: ${error.message}`, {
    stack: error.stack
  });
  console.error('치명적 오류:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  ErrorLogger.logError('UNHANDLED_REJECTION', 'HIGH', `처리되지 않은 Promise 거부: ${reason}`, {
    promise
  });
  console.error('처리되지 않은 Promise 거부:', reason);
});

// 주기적으로 캐시 정리
setInterval(
  () => {
    DataService.clearExpiredCache();
  },
  10 * 60 * 1000
); // 10분마다

// 서버 시작
const transport = new StdioServerTransport();
server.connect(transport);

console.error('KRDS MCP 서버가 시작되었습니다.');
console.error('입력 검증 및 오류 처리 시스템이 활성화되었습니다.');
