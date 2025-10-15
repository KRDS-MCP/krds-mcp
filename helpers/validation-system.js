/**
 * KRDS MCP 서버 통합 입력 검증 시스템
 * 모든 핸들러 함수에서 사용할 공통 검증 로직을 제공합니다.
 */

import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * 입력 스키마 정의
 */
export const ValidationSchemas = {
  designPrinciples: {
    principle: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 100,
      description: '디자인 원칙 이름'
    }
  },

  colors: {
    color: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 50,
      description: '색상 이름 또는 ID'
    },
    category: {
      type: 'string',
      optional: true,
      enum: ['primary', 'system', 'neutral', 'emphasis', 'graphic'],
      description: '색상 카테고리'
    }
  },

  typography: {
    style: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 50,
      description: '타이포그래피 스타일 ID 또는 이름'
    },
    category: {
      type: 'string',
      optional: true,
      enum: ['display', 'heading', 'body', 'interactive', 'utility'],
      description: '타이포그래피 카테고리'
    }
  },

  components: {
    component: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 50,
      description: '컴포넌트 이름 또는 ID'
    },
    category: {
      type: 'string',
      optional: true,
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
      ],
      description: '컴포넌트 카테고리'
    },
    includeCode: {
      type: 'boolean',
      optional: true,
      default: false,
      description: 'HTML 코드 예제 포함 여부'
    }
  },

  globalPatterns: {
    pattern: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 50,
      description: '패턴 이름 또는 ID'
    },
    component: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 50,
      description: '특정 컴포넌트가 사용되는 패턴 찾기'
    },
    includeCode: {
      type: 'boolean',
      optional: true,
      default: false,
      description: 'HTML 코드 예제 포함 여부'
    }
  },

  servicePatterns: {
    pattern: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 50,
      description: '서비스 패턴 이름 또는 ID'
    },
    includeCode: {
      type: 'boolean',
      optional: true,
      default: false,
      description: 'HTML 코드 예제 포함 여부'
    },
    includeMetrics: {
      type: 'boolean',
      optional: true,
      default: false,
      description: '성과 지표 정보 포함 여부'
    }
  },

  shapesIcons: {
    type: {
      type: 'string',
      optional: true,
      enum: ['shapes', 'icons', 'both'],
      default: 'both',
      description: '조회할 타입'
    },
    iconCategory: {
      type: 'string',
      optional: true,
      enum: ['system', 'status', 'action', 'communication', 'file', 'government'],
      description: '아이콘 카테고리'
    },
    iconId: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 50,
      description: '특정 아이콘 ID'
    }
  },

  designTokens: {
    category: {
      type: 'string',
      optional: true,
      enum: ['color', 'typography', 'spacing', 'sizing', 'border', 'shadow', 'motion', 'layout', 'component'],
      description: '토큰 카테고리'
    },
    tokenName: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 100,
      description: '특정 토큰 이름'
    },
    format: {
      type: 'string',
      optional: true,
      enum: ['json', 'css', 'style-dictionary'],
      default: 'json',
      description: '출력 형식'
    },
    theme: {
      type: 'string',
      optional: true,
      enum: ['light', 'dark'],
      default: 'light',
      description: '테마'
    }
  },

  systems: {
    system: {
      type: 'string',
      optional: true,
      enum: ['spacing', 'grid', 'responsive', 'darkmode'],
      description: '조회할 시스템'
    }
  },

  accessibility: {
    htmlCode: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100000,
      description: '검증할 HTML 코드'
    }
  },

  search: {
    query: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100,
      description: '검색할 키워드'
    },
    type: {
      type: 'string',
      optional: true,
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
      ],
      default: 'all',
      description: '검색할 데이터 타입'
    },
    detailed: {
      type: 'boolean',
      optional: true,
      default: false,
      description: '상세 정보 포함 여부'
    }
  },

  generateCode: {
    type: {
      type: 'string',
      required: true,
      enum: ['component', 'global-pattern', 'service-pattern'],
      description: '생성할 코드 타입'
    },
    id: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 50,
      description: '컴포넌트/패턴 ID'
    },
    variant: {
      type: 'string',
      optional: true,
      minLength: 1,
      maxLength: 30,
      description: '컴포넌트 변형'
    },
    theme: {
      type: 'string',
      optional: true,
      enum: ['light', 'dark'],
      default: 'light',
      description: '테마'
    }
  },

  stats: {
    detailed: {
      type: 'boolean',
      optional: true,
      default: false,
      description: '상세 통계 포함 여부'
    }
  }
};

/**
 * 검증 오류 클래스
 */
export class ValidationError extends Error {
  constructor(field, message, value) {
    super(`입력 검증 실패 - ${field}: ${message}`);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.validationMessage = message;
  }
}

/**
 * 통합 입력 검증 클래스
 */
export class InputValidator {
  /**
   * 값의 타입을 검증합니다.
   * @param {any} value - 검증할 값
   * @param {string} expectedType - 예상 타입
   * @returns {boolean} 타입 일치 여부
   */
  static validateType(value, expectedType) {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * 문자열 길이를 검증합니다.
   * @param {string} value - 검증할 값
   * @param {number} minLength - 최소 길이
   * @param {number} maxLength - 최대 길이
   * @returns {boolean} 길이 유효성
   */
  static validateStringLength(value, minLength = 0, maxLength = Infinity) {
    if (typeof value !== 'string') {
      return false;
    }
    return value.length >= minLength && value.length <= maxLength;
  }

  /**
   * 열거형 값을 검증합니다.
   * @param {any} value - 검증할 값
   * @param {Array} enumValues - 허용되는 값들
   * @returns {boolean} 열거형 유효성
   */
  static validateEnum(value, enumValues) {
    return enumValues.includes(value);
  }

  /**
   * 단일 필드를 검증합니다.
   * @param {string} fieldName - 필드명
   * @param {any} value - 검증할 값
   * @param {object} schema - 검증 스키마
   * @returns {object} 검증 결과 { isValid: boolean, error?: string }
   */
  static validateField(fieldName, value, schema) {
    // 필수 필드 검사
    if (schema.required && (value === undefined || value === null || value === '')) {
      return {
        isValid: false,
        error: `${fieldName}은(는) 필수 입력 항목입니다.`
      };
    }

    // 선택적 필드이고 값이 없는 경우
    if (schema.optional && (value === undefined || value === null || value === '')) {
      return { isValid: true };
    }

    // 타입 검증
    if (schema.type && !this.validateType(value, schema.type)) {
      return {
        isValid: false,
        error: `${fieldName}의 타입이 올바르지 않습니다. 예상 타입: ${schema.type}`
      };
    }

    // 문자열 길이 검증
    if (schema.type === 'string' && typeof value === 'string') {
      if (!this.validateStringLength(value, schema.minLength, schema.maxLength)) {
        const lengthInfo = [];
        if (schema.minLength > 0) {
          lengthInfo.push(`최소 ${schema.minLength}자`);
        }
        if (schema.maxLength < Infinity) {
          lengthInfo.push(`최대 ${schema.maxLength}자`);
        }
        return {
          isValid: false,
          error: `${fieldName}의 길이가 올바르지 않습니다. (${lengthInfo.join(', ')})`
        };
      }
    }

    // 열거형 값 검증
    if (schema.enum && !this.validateEnum(value, schema.enum)) {
      return {
        isValid: false,
        error: `${fieldName}의 값이 올바르지 않습니다. 허용되는 값: ${schema.enum.join(', ')}`
      };
    }

    // 숫자 범위 검증
    if (schema.type === 'number' && typeof value === 'number') {
      if (schema.min !== undefined && value < schema.min) {
        return {
          isValid: false,
          error: `${fieldName}의 값이 너무 작습니다. 최솟값: ${schema.min}`
        };
      }
      if (schema.max !== undefined && value > schema.max) {
        return {
          isValid: false,
          error: `${fieldName}의 값이 너무 큽니다. 최댓값: ${schema.max}`
        };
      }
    }

    return { isValid: true };
  }

  /**
   * 전체 입력 객체를 검증합니다.
   * @param {object} input - 검증할 입력 객체
   * @param {string} schemaName - 사용할 스키마 이름
   * @returns {object} 검증 결과 { isValid: boolean, errors: Array, sanitized: object }
   */
  static validateInput(input, schemaName) {
    const schema = ValidationSchemas[schemaName];

    if (!schema) {
      throw new ValidationError('schema', `알 수 없는 스키마: ${schemaName}`, schemaName);
    }

    const errors = [];
    const sanitized = {};

    // 스키마에 정의된 모든 필드 검증
    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const value = input[fieldName];
      const validation = this.validateField(fieldName, value, fieldSchema);

      if (!validation.isValid) {
        errors.push({
          field: fieldName,
          message: validation.error,
          value
        });
      } else {
        // 기본값 적용
        if (value !== undefined && value !== null && value !== '') {
          sanitized[fieldName] = value;
        } else if (fieldSchema.default !== undefined) {
          sanitized[fieldName] = fieldSchema.default;
        }
      }
    }

    // 스키마에 정의되지 않은 필드 체크
    for (const fieldName of Object.keys(input)) {
      if (!schema[fieldName]) {
        errors.push({
          field: fieldName,
          message: '알 수 없는 필드입니다.',
          value: input[fieldName]
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    };
  }

  /**
   * 검증 오류를 MCP 오류로 변환합니다.
   * @param {Array} validationErrors - 검증 오류 배열
   * @param {string} context - 오류 컨텍스트
   * @returns {McpError} MCP 오류 객체
   */
  static toMcpError(validationErrors, context = '입력 검증') {
    const errorMessages = validationErrors.map(error => `${error.field}: ${error.message}`).join('\n');

    return new McpError(ErrorCode.InvalidRequest, `${context} 실패:\n${errorMessages}`);
  }

  /**
   * 빠른 검증 (단일 함수 호출로 검증 및 오류 처리)
   * @param {object} input - 검증할 입력
   * @param {string} schemaName - 스키마 이름
   * @param {string} context - 오류 컨텍스트
   * @returns {object} 정제된 입력 객체
   * @throws {McpError} 검증 실패 시
   */
  static validateAndSanitize(input, schemaName, context) {
    const validation = this.validateInput(input || {}, schemaName);

    if (!validation.isValid) {
      throw this.toMcpError(validation.errors, context);
    }

    return validation.sanitized;
  }
}

/**
 * 특수 검증 함수들
 */
export class SpecialValidators {
  /**
   * HTML 코드 검증 (기본적인 구조 검사)
   * @param {string} htmlCode - 검증할 HTML 코드
   * @returns {object} 검증 결과
   */
  static validateHtmlCode(htmlCode) {
    if (!htmlCode || typeof htmlCode !== 'string') {
      return {
        isValid: false,
        error: 'HTML 코드가 필요합니다.'
      };
    }

    // 기본적인 HTML 구조 검사
    const trimmed = htmlCode.trim();

    // 너무 긴 코드 체크
    if (trimmed.length > 100000) {
      return {
        isValid: false,
        error: 'HTML 코드가 너무 깁니다. (최대 100,000자)'
      };
    }

    // 기본적인 HTML 태그 유효성 검사
    const tagPattern = /<[^>]+>/g;
    const tags = trimmed.match(tagPattern) || [];

    // 스크립트 태그 차단 (보안)
    const dangerousTags = ['<script', '</script', '<iframe', '</iframe', '<object', '</object'];
    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (dangerousTags.some(dangerous => lowerTag.includes(dangerous))) {
        return {
          isValid: false,
          error: '보안상 위험한 HTML 태그가 포함되어 있습니다.'
        };
      }
    }

    return { isValid: true };
  }

  /**
   * 검색 쿼리 검증
   * @param {string} query - 검색 쿼리
   * @returns {object} 검증 결과
   */
  static validateSearchQuery(query) {
    if (!query || typeof query !== 'string') {
      return {
        isValid: false,
        error: '검색어가 필요합니다.'
      };
    }

    const trimmed = query.trim();

    if (trimmed.length < 1) {
      return {
        isValid: false,
        error: '검색어는 최소 1자 이상이어야 합니다.'
      };
    }

    if (trimmed.length > 100) {
      return {
        isValid: false,
        error: '검색어는 최대 100자까지 입력할 수 있습니다.'
      };
    }

    // 특수 문자 제한 (SQL 인젝션 등 방지)
    const dangerousChars = ['<', '>', '"', "'", ';', '--', '/*', '*/'];
    if (dangerousChars.some(char => trimmed.includes(char))) {
      return {
        isValid: false,
        error: '검색어에 허용되지 않는 특수 문자가 포함되어 있습니다.'
      };
    }

    return { isValid: true, sanitized: trimmed };
  }
}
