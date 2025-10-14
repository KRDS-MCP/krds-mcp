/**
 * KRDS MCP 국제화 (i18n) 지원
 * 한국어와 영어를 지원하는 다국어 시스템
 */

/**
 * 지원되는 언어
 */
export const SUPPORTED_LANGUAGES = {
  KO: 'ko',
  EN: 'en'
};

/**
 * 기본 언어
 */
export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.KO;

/**
 * 언어별 메시지
 */
const MESSAGES = {
  [SUPPORTED_LANGUAGES.KO]: {
    // 일반 메시지
    common: {
      success: '성공',
      error: '오류',
      warning: '경고',
      info: '정보',
      loading: '로딩 중...',
      notFound: '찾을 수 없습니다',
      invalidInput: '잘못된 입력입니다',
      serverError: '서버 오류가 발생했습니다',
      networkError: '네트워크 오류가 발생했습니다',
      timeout: '시간 초과',
      unauthorized: '권한이 없습니다',
      forbidden: '접근이 거부되었습니다'
    },

    // 도구 관련 메시지
    tools: {
      designPrinciples: '디자인 원칙',
      colors: '색상',
      typography: '타이포그래피',
      components: '컴포넌트',
      patterns: '패턴',
      accessibility: '접근성',
      tokens: '디자인 토큰',
      systems: '시스템',
      search: '검색',
      codeGeneration: '코드 생성',
      statistics: '통계'
    },

    // 에러 메시지
    errors: {
      validation: {
        required: '{field}은(는) 필수 입력 항목입니다',
        invalid: '{field}의 값이 올바르지 않습니다',
        minLength: '{field}은(는) 최소 {min}자 이상이어야 합니다',
        maxLength: '{field}은(는) 최대 {max}자까지 입력 가능합니다',
        enum: '{field}의 값이 올바르지 않습니다. 허용되는 값: {values}',
        pattern: '{field}의 형식이 올바르지 않습니다'
      },
      data: {
        notFound: '{type} 데이터를 찾을 수 없습니다',
        unavailable: '{type} 데이터를 사용할 수 없습니다',
        empty: '{type} 데이터가 비어있습니다',
        corrupted: '{type} 데이터가 손상되었습니다'
      },
      performance: {
        slow: '작업이 예상보다 오래 걸립니다',
        timeout: '작업 시간이 초과되었습니다',
        memory: '메모리 사용량이 높습니다',
        cache: '캐시 성능이 저하되었습니다'
      }
    },

    // 성공 메시지
    success: {
      dataRetrieved: '{type} 데이터를 성공적으로 조회했습니다',
      codeGenerated: '코드가 성공적으로 생성되었습니다',
      validationPassed: '검증이 성공적으로 완료되었습니다',
      cacheUpdated: '캐시가 업데이트되었습니다',
      settingsSaved: '설정이 저장되었습니다'
    },

    // 접근성 메시지
    accessibility: {
      validation: {
        passed: '접근성 검증을 통과했습니다',
        failed: '접근성 검증에 실패했습니다',
        issues: '{count}개의 접근성 문제가 발견되었습니다',
        wcagLevel: 'WCAG {level} 수준 준수',
        score: '접근성 점수: {score}/100'
      },
      issues: {
        missingAlt: '이미지에 alt 속성이 없습니다',
        missingLabel: '폼 요소에 label이 없습니다',
        missingHeading: '적절한 제목 구조가 없습니다',
        lowContrast: '색상 대비가 낮습니다',
        keyboardNavigation: '키보드 네비게이션이 불가능합니다'
      }
    },

    // 성능 메시지
    performance: {
      metrics: {
        responseTime: '응답 시간: {time}ms',
        memoryUsage: '메모리 사용량: {usage}MB',
        cacheHitRate: '캐시 히트율: {rate}%',
        errorRate: '에러율: {rate}%',
        throughput: '처리량: {count}/초'
      },
      recommendations: {
        optimizeCache: '캐시 최적화를 권장합니다',
        reduceMemory: '메모리 사용량을 줄이세요',
        improveResponse: '응답 시간을 개선하세요',
        checkErrors: '에러를 확인하고 수정하세요'
      }
    }
  },

  [SUPPORTED_LANGUAGES.EN]: {
    // General messages
    common: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
      loading: 'Loading...',
      notFound: 'Not found',
      invalidInput: 'Invalid input',
      serverError: 'Server error occurred',
      networkError: 'Network error occurred',
      timeout: 'Timeout',
      unauthorized: 'Unauthorized',
      forbidden: 'Access denied'
    },

    // Tool related messages
    tools: {
      designPrinciples: 'Design Principles',
      colors: 'Colors',
      typography: 'Typography',
      components: 'Components',
      patterns: 'Patterns',
      accessibility: 'Accessibility',
      tokens: 'Design Tokens',
      systems: 'Systems',
      search: 'Search',
      codeGeneration: 'Code Generation',
      statistics: 'Statistics'
    },

    // Error messages
    errors: {
      validation: {
        required: '{field} is required',
        invalid: '{field} value is invalid',
        minLength: '{field} must be at least {min} characters',
        maxLength: '{field} must be at most {max} characters',
        enum: '{field} value is invalid. Allowed values: {values}',
        pattern: '{field} format is invalid'
      },
      data: {
        notFound: '{type} data not found',
        unavailable: '{type} data is unavailable',
        empty: '{type} data is empty',
        corrupted: '{type} data is corrupted'
      },
      performance: {
        slow: 'Operation is taking longer than expected',
        timeout: 'Operation timed out',
        memory: 'High memory usage',
        cache: 'Cache performance degraded'
      }
    },

    // Success messages
    success: {
      dataRetrieved: '{type} data retrieved successfully',
      codeGenerated: 'Code generated successfully',
      validationPassed: 'Validation completed successfully',
      cacheUpdated: 'Cache updated',
      settingsSaved: 'Settings saved'
    },

    // Accessibility messages
    accessibility: {
      validation: {
        passed: 'Accessibility validation passed',
        failed: 'Accessibility validation failed',
        issues: '{count} accessibility issues found',
        wcagLevel: 'WCAG {level} compliance',
        score: 'Accessibility score: {score}/100'
      },
      issues: {
        missingAlt: 'Image missing alt attribute',
        missingLabel: 'Form element missing label',
        missingHeading: 'Missing proper heading structure',
        lowContrast: 'Low color contrast',
        keyboardNavigation: 'Keyboard navigation not possible'
      }
    },

    // Performance messages
    performance: {
      metrics: {
        responseTime: 'Response time: {time}ms',
        memoryUsage: 'Memory usage: {usage}MB',
        cacheHitRate: 'Cache hit rate: {rate}%',
        errorRate: 'Error rate: {rate}%',
        throughput: 'Throughput: {count}/sec'
      },
      recommendations: {
        optimizeCache: 'Consider optimizing cache',
        reduceMemory: 'Reduce memory usage',
        improveResponse: 'Improve response time',
        checkErrors: 'Check and fix errors'
      }
    }
  }
};

/**
 * 국제화 클래스
 */
export class I18n {
  constructor(language = DEFAULT_LANGUAGE) {
    this.language = this.validateLanguage(language);
    this.fallbackLanguage = DEFAULT_LANGUAGE;
  }

  /**
   * 언어 유효성 검사
   */
  validateLanguage(language) {
    return Object.values(SUPPORTED_LANGUAGES).includes(language) ? language : DEFAULT_LANGUAGE;
  }

  /**
   * 언어 설정
   */
  setLanguage(language) {
    this.language = this.validateLanguage(language);
  }

  /**
   * 현재 언어 조회
   */
  getLanguage() {
    return this.language;
  }

  /**
   * 지원되는 언어 목록 조회
   */
  getSupportedLanguages() {
    return Object.values(SUPPORTED_LANGUAGES);
  }

  /**
   * 메시지 조회
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let message = this.getMessage(keys);

    if (!message) {
      // 폴백 언어로 시도
      message = this.getMessage(keys, this.fallbackLanguage);
    }

    if (!message) {
      return key; // 메시지를 찾을 수 없으면 키 반환
    }

    // 매개변수 치환
    return this.interpolate(message, params);
  }

  /**
   * 메시지 조회 (내부 메서드)
   */
  getMessage(keys, language = this.language) {
    let current = MESSAGES[language];
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    
    return typeof current === 'string' ? current : null;
  }

  /**
   * 매개변수 치환
   */
  interpolate(message, params) {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * 다국어 메시지 생성
   */
  createMultilingualMessage(key, params = {}) {
    const result = {};
    
    for (const lang of this.getSupportedLanguages()) {
      const tempI18n = new I18n(lang);
      result[lang] = tempI18n.t(key, params);
    }
    
    return result;
  }

  /**
   * 언어 감지
   */
  detectLanguage(acceptLanguage) {
    if (!acceptLanguage) {
      return DEFAULT_LANGUAGE;
    }

    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase());

    for (const lang of languages) {
      if (lang.startsWith('ko')) {
        return SUPPORTED_LANGUAGES.KO;
      }
      if (lang.startsWith('en')) {
        return SUPPORTED_LANGUAGES.EN;
      }
    }

    return DEFAULT_LANGUAGE;
  }

  /**
   * 날짜 포맷팅
   */
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    const locale = this.language === SUPPORTED_LANGUAGES.KO ? 'ko-KR' : 'en-US';
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
  }

  /**
   * 숫자 포맷팅
   */
  formatNumber(number, options = {}) {
    const locale = this.language === SUPPORTED_LANGUAGES.KO ? 'ko-KR' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(number);
  }

  /**
   * 통화 포맷팅
   */
  formatCurrency(amount, currency = 'KRW', options = {}) {
    const locale = this.language === SUPPORTED_LANGUAGES.KO ? 'ko-KR' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...options
    }).format(amount);
  }

  /**
   * 복수형 처리
   */
  pluralize(singular, plural, count) {
    const forms = this.language === SUPPORTED_LANGUAGES.KO ? [singular, plural] : [singular, plural];
    return count === 1 ? forms[0] : forms[1];
  }

  /**
   * 언어별 텍스트 방향
   */
  getTextDirection() {
    return this.language === SUPPORTED_LANGUAGES.KO ? 'ltr' : 'ltr';
  }

  /**
   * 언어별 로케일
   */
  getLocale() {
    return this.language === SUPPORTED_LANGUAGES.KO ? 'ko-KR' : 'en-US';
  }
}

/**
 * 전역 i18n 인스턴스
 */
export const i18n = new I18n();

/**
 * 편의 함수들
 */
export const t = (key, params) => i18n.t(key, params);
export const setLanguage = (language) => i18n.setLanguage(language);
export const getLanguage = () => i18n.getLanguage();
export const formatDate = (date, options) => i18n.formatDate(date, options);
export const formatNumber = (number, options) => i18n.formatNumber(number, options);
export const formatCurrency = (amount, currency, options) => i18n.formatCurrency(amount, currency, options);

/**
 * 언어별 에러 메시지 생성기
 */
export class LocalizedErrorMessages {
  static createValidationError(field, type, params = {}) {
    const key = `errors.validation.${type}`;
    return t(key, { field, ...params });
  }

  static createDataError(type, dataType, params = {}) {
    const key = `errors.data.${type}`;
    return t(key, { type: dataType, ...params });
  }

  static createPerformanceError(type, params = {}) {
    const key = `errors.performance.${type}`;
    return t(key, params);
  }

  static createSuccessMessage(type, dataType, params = {}) {
    const key = `success.${type}`;
    return t(key, { type: dataType, ...params });
  }

  static createAccessibilityMessage(type, params = {}) {
    const key = `accessibility.validation.${type}`;
    return t(key, params);
  }

  static createPerformanceMessage(type, params = {}) {
    const key = `performance.metrics.${type}`;
    return t(key, params);
  }
}

/**
 * 언어별 응답 포맷터
 */
export class LocalizedResponseFormatter {
  static formatError(error, context = {}) {
    const { language = getLanguage() } = context;
    const tempI18n = new I18n(language);

    return {
      success: false,
      error: {
        message: tempI18n.t('common.error'),
        details: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        context
      },
      timestamp: new Date().toISOString(),
      language
    };
  }

  static formatSuccess(data, messageKey, params = {}, context = {}) {
    const { language = getLanguage() } = context;
    const tempI18n = new I18n(language);

    return {
      success: true,
      data,
      message: tempI18n.t(messageKey, params),
      timestamp: new Date().toISOString(),
      language
    };
  }

  static formatValidationError(field, type, params = {}, context = {}) {
    const { language = getLanguage() } = context;
    const tempI18n = new I18n(language);

    return {
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        field,
        message: tempI18n.t(`errors.validation.${type}`, { field, ...params }),
        details: params
      },
      timestamp: new Date().toISOString(),
      language
    };
  }
}
