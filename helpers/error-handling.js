/**
 * KRDS MCP 서버 통합 오류 처리 시스템
 * 일관된 오류 응답 형식과 로깅을 제공합니다.
 */

import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mcpLogger, ErrorLoggerAdapter } from './mcp-logging.js';

/**
 * 오류 유형 정의
 */
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  SECURITY_ERROR: 'SECURITY_ERROR'
};

/**
 * 오류 심각도 수준
 */
export const ErrorSeverity = {
  LOW: 'LOW', // 사용자 입력 오류 등
  MEDIUM: 'MEDIUM', // 데이터 처리 오류 등
  HIGH: 'HIGH', // 시스템 오류 등
  CRITICAL: 'CRITICAL' // 보안 오류 등
};

/**
 * 오류 로거 클래스
 */
export class ErrorLogger {
  static logs = [];
  static maxLogs = 1000; // 최대 로그 개수

  /**
   * 오류를 로깅합니다.
   * @param {string} type - 오류 유형
   * @param {string} severity - 심각도
   * @param {string} message - 오류 메시지
   * @param {object} context - 추가 컨텍스트
   * @param {Error} originalError - 원본 오류 객체
   */
  static logError(type, severity, message, context = {}, originalError = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      severity,
      message,
      context: {
        ...context,
        stack: originalError?.stack,
        name: originalError?.name
      },
      id: this.generateLogId()
    };

    this.logs.push(logEntry);

    // 최대 로그 수 제한
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // 콘솔 출력 (개발 모드)
    this.outputToConsole(logEntry);

    // MCP 2025 표준 로깅으로도 전송
    ErrorLoggerAdapter.logError(type, severity, message, context, originalError);
  }

  /**
   * 로그 ID 생성
   * @returns {string} 고유 로그 ID
   */
  static generateLogId() {
    return `krds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 콘솔에 오류 출력
   * @param {object} logEntry - 로그 엔트리
   */
  static outputToConsole(logEntry) {
    const prefix = `[KRDS-MCP ${logEntry.severity}]`;
    const timestamp = new Date(logEntry.timestamp).toLocaleString('ko-KR');

    switch (logEntry.severity) {
      case ErrorSeverity.LOW:
        console.info(`${prefix} ${timestamp} - ${logEntry.message}`);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(`${prefix} ${timestamp} - ${logEntry.message}`);
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        console.error(`${prefix} ${timestamp} - ${logEntry.message}`);
        if (logEntry.context.stack) {
          console.error(logEntry.context.stack);
        }
        break;
    }
  }

  /**
   * 최근 로그 조회
   * @param {number} count - 조회할 로그 수
   * @param {string} severity - 필터링할 심각도
   * @returns {Array} 로그 배열
   */
  static getRecentLogs(count = 50, severity = null) {
    let filteredLogs = this.logs;

    if (severity) {
      filteredLogs = this.logs.filter(log => log.severity === severity);
    }

    return filteredLogs.slice(-count);
  }

  /**
   * 로그 통계
   * @returns {object} 로그 통계 정보
   */
  static getLogStats() {
    const stats = {
      total: this.logs.length,
      bySeverity: {},
      byType: {},
      lastHour: 0,
      last24Hours: 0
    };

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    this.logs.forEach(log => {
      // 심각도별 통계
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;

      // 유형별 통계
      stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;

      // 시간별 통계
      const logTime = new Date(log.timestamp);
      if (logTime > oneHourAgo) {
        stats.lastHour++;
      }
      if (logTime > oneDayAgo) {
        stats.last24Hours++;
      }
    });

    return stats;
  }
}

/**
 * 사용자 친화적 오류 메시지 생성기
 */
export class UserFriendlyMessages {
  static messages = {
    [ErrorTypes.VALIDATION_ERROR]: {
      title: '입력값 오류',
      suggestion: '입력값을 확인하고 다시 시도해주세요.'
    },
    [ErrorTypes.DATA_NOT_FOUND]: {
      title: '데이터를 찾을 수 없음',
      suggestion: '검색 조건을 확인하거나 다른 키워드로 시도해보세요.'
    },
    [ErrorTypes.PROCESSING_ERROR]: {
      title: '처리 중 오류 발생',
      suggestion: '잠시 후 다시 시도해주세요.'
    },
    [ErrorTypes.SYSTEM_ERROR]: {
      title: '시스템 오류',
      suggestion: '문제가 지속되면 관리자에게 문의하세요.'
    },
    [ErrorTypes.SECURITY_ERROR]: {
      title: '보안 오류',
      suggestion: '허용되지 않는 요청입니다.'
    }
  };

  /**
   * 사용자 친화적 오류 메시지 생성
   * @param {string} errorType - 오류 유형
   * @param {string} details - 상세 오류 내용
   * @returns {string} 사용자 친화적 메시지
   */
  static generateMessage(errorType, details) {
    const template = this.messages[errorType] || this.messages[ErrorTypes.SYSTEM_ERROR];

    return `${template.title}: ${details}\n\n💡 ${template.suggestion}`;
  }

  /**
   * 검색 결과 없음 메시지 생성
   * @param {string} query - 검색어
   * @param {string} type - 검색 타입
   * @returns {string} 친화적 메시지
   */
  static generateNoResultsMessage(query, type = 'all') {
    const typeNames = {
      all: '전체',
      principles: '디자인 원칙',
      colors: '색상',
      typography: '타이포그래피',
      components: '컴포넌트',
      'global-patterns': '글로벌 패턴',
      'service-patterns': '서비스 패턴',
      icons: '아이콘',
      tokens: '디자인 토큰'
    };

    const typeName = typeNames[type] || type;

    return `"${query}"에 대한 ${typeName} 검색 결과를 찾을 수 없습니다.\n\n💡 다음을 확인해보세요:\n• 검색어의 철자가 정확한지 확인\n• 더 간단한 키워드로 시도\n• 유사한 의미의 다른 단어 사용\n• 전체 검색(type: "all")으로 시도`;
  }

  /**
   * 데이터 부족 안내 메시지 생성
   * @param {string} dataType - 데이터 유형
   * @returns {string} 안내 메시지
   */
  static generateDataUnavailableMessage(dataType) {
    return `${dataType} 데이터를 현재 사용할 수 없습니다.\n\n💡 이는 일시적인 문제일 수 있습니다. 잠시 후 다시 시도하거나 다른 기능을 이용해보세요.`;
  }
}

/**
 * 통합 오류 처리기
 */
export class ErrorHandler {
  /**
   * 오류를 처리하고 적절한 MCP 응답을 반환합니다.
   * @param {Error} error - 처리할 오류
   * @param {string} context - 오류 발생 컨텍스트
   * @param {object} additionalInfo - 추가 정보
   * @returns {object} MCP 응답 객체
   */
  static handleError(error, context = '알 수 없는 작업', additionalInfo = {}) {
    let errorType = ErrorTypes.SYSTEM_ERROR;
    let severity = ErrorSeverity.MEDIUM;
    let userMessage = '';
    let mcpErrorCode = ErrorCode.InternalError;

    // 오류 유형 판별
    if (error.name === 'ValidationError' || error.message.includes('입력 검증')) {
      errorType = ErrorTypes.VALIDATION_ERROR;
      severity = ErrorSeverity.LOW;
      mcpErrorCode = ErrorCode.InvalidRequest;
      userMessage = UserFriendlyMessages.generateMessage(errorType, error.message);
    } else if (error.message.includes('찾을 수 없습니다') || error.message.includes('없습니다')) {
      errorType = ErrorTypes.DATA_NOT_FOUND;
      severity = ErrorSeverity.LOW;
      mcpErrorCode = ErrorCode.InvalidRequest;
      userMessage = error.message;
    } else if (error.message.includes('보안') || error.message.includes('허용되지 않는')) {
      errorType = ErrorTypes.SECURITY_ERROR;
      severity = ErrorSeverity.CRITICAL;
      mcpErrorCode = ErrorCode.InvalidRequest;
      userMessage = UserFriendlyMessages.generateMessage(errorType, '허용되지 않는 요청입니다');
    } else if (error instanceof McpError) {
      // 이미 MCP 오류인 경우
      severity = ErrorSeverity.LOW;
      userMessage = error.message;
      mcpErrorCode = error.code;
    } else {
      // 일반적인 시스템 오류
      errorType = ErrorTypes.PROCESSING_ERROR;
      severity = ErrorSeverity.HIGH;
      userMessage = UserFriendlyMessages.generateMessage(
        errorType,
        '처리 중 예상치 못한 오류가 발생했습니다'
      );
    }

    // 오류 로깅
    ErrorLogger.logError(
      errorType,
      severity,
      error.message,
      {
        context,
        ...additionalInfo
      },
      error
    );

    // MCP 오류 반환
    throw new McpError(mcpErrorCode, userMessage);
  }

  /**
   * 데이터 검색 결과 없음 처리
   * @param {string} query - 검색어
   * @param {string} dataType - 데이터 타입
   * @param {string} context - 컨텍스트
   * @returns {object} 빈 결과 응답
   */
  static handleNoResults(query, dataType, context) {
    const message = UserFriendlyMessages.generateNoResultsMessage(query, dataType);

    // 로깅 (낮은 심각도)
    ErrorLogger.logError(
      ErrorTypes.DATA_NOT_FOUND,
      ErrorSeverity.LOW,
      `검색 결과 없음: ${query} (${dataType})`,
      { context }
    );

    return {
      content: [
        {
          type: 'text',
          text: message
        }
      ]
    };
  }

  /**
   * 데이터 사용 불가 처리
   * @param {string} dataType - 데이터 타입
   * @param {string} context - 컨텍스트
   * @returns {object} 사용 불가 응답
   */
  static handleDataUnavailable(dataType, context) {
    const message = UserFriendlyMessages.generateDataUnavailableMessage(dataType);

    ErrorLogger.logError(
      ErrorTypes.PROCESSING_ERROR,
      ErrorSeverity.MEDIUM,
      `데이터 사용 불가: ${dataType}`,
      { context }
    );

    return {
      content: [
        {
          type: 'text',
          text: message
        }
      ]
    };
  }

  /**
   * 성공 응답 래퍼
   * @param {object} content - 응답 내용
   * @param {string} context - 컨텍스트
   * @param {object} metadata - 메타데이터
   * @returns {object} 성공 응답
   */
  static handleSuccess(content, context, metadata = {}) {
    // 성공 로깅 (디버그 레벨)
    if (process.env.NODE_ENV === 'development') {
      ErrorLogger.logError('SUCCESS', ErrorSeverity.LOW, `성공적으로 처리됨: ${context}`, metadata);
    }

    return {
      content: Array.isArray(content)
        ? content
        : [
            {
              type: 'text',
              text: content
            }
          ]
    };
  }
}

/**
 * 오류 처리 데코레이터 (함수 래퍼)
 */
export function withErrorHandling(handlerName) {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      try {
        const result = await originalMethod.apply(this, args);
        return ErrorHandler.handleSuccess(result, handlerName);
      } catch (error) {
        return ErrorHandler.handleError(error, handlerName, {
          arguments: args,
          handlerName
        });
      }
    };

    return descriptor;
  };
}

/**
 * 간단한 오류 처리 래퍼 함수
 * @param {Function} handler - 원본 핸들러 함수
 * @param {string} handlerName - 핸들러 이름
 * @returns {Function} 래핑된 핸들러 함수
 */
export function wrapHandler(handler, handlerName) {
  return async function (args) {
    try {
      const result = await handler(args);
      return result;
    } catch (error) {
      ErrorHandler.handleError(error, handlerName, { arguments: args });
      return ErrorHandler.createErrorResponse(error);
    }
  };
}

/**
 * 성능 모니터링과 함께하는 오류 처리
 * @param {Function} handler - 원본 핸들러
 * @param {string} handlerName - 핸들러 이름
 * @returns {Function} 래핑된 핸들러
 */
export function wrapHandlerWithMetrics(handler, handlerName) {
  return async function (args) {
    const startTime = Date.now();

    try {
      const result = await handler(args);
      const duration = Date.now() - startTime;

      // 성능 로깅
      if (duration > 1000) {
        // 1초 이상 걸린 경우
        ErrorLogger.logError(
          'PERFORMANCE',
          ErrorSeverity.LOW,
          `느린 응답: ${handlerName} (${duration}ms)`,
          {
            duration,
            handlerName,
            arguments: args
          }
        );
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      ErrorHandler.handleError(error, handlerName, {
        duration,
        arguments: args
      });
      return ErrorHandler.createErrorResponse(error);
    }
  };
}
