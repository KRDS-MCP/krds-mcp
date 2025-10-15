/**
 * MCP 2025 표준 로깅 시스템
 * RFC 5424 Syslog 심각도 레벨을 따르는 MCP 호환 로깅 구현
 */

/**
 * MCP 2025 표준 로그 레벨 (RFC 5424 기준)
 */
export const McpLogLevel = {
  EMERGENCY: 'emergency', // 0 - 시스템이 사용 불가능
  ALERT: 'alert', // 1 - 즉시 조치 필요
  CRITICAL: 'critical', // 2 - 치명적 상태
  ERROR: 'error', // 3 - 오류 조건
  WARNING: 'warning', // 4 - 경고 조건
  NOTICE: 'notice', // 5 - 정상이지만 중요한 조건
  INFO: 'info', // 6 - 정보성 메시지
  DEBUG: 'debug' // 7 - 디버그 메시지
};

/**
 * 로그 레벨 우선순위 (낮은 숫자가 높은 우선순위)
 */
export const LogLevelPriority = {
  [McpLogLevel.EMERGENCY]: 0,
  [McpLogLevel.ALERT]: 1,
  [McpLogLevel.CRITICAL]: 2,
  [McpLogLevel.ERROR]: 3,
  [McpLogLevel.WARNING]: 4,
  [McpLogLevel.NOTICE]: 5,
  [McpLogLevel.INFO]: 6,
  [McpLogLevel.DEBUG]: 7
};

/**
 * MCP 2025 표준 로깅 클래스
 */
export class McpLogger {
  constructor(server = null) {
    this.server = server;
    this.minLogLevel = McpLogLevel.INFO; // 기본 최소 로그 레벨
    this.loggers = new Map(); // 로거별 설정
    this.logBuffer = []; // 로그 버퍼 (서버가 없을 때)
    this.maxBufferSize = 1000;

    // 기본 로거 설정
    this.setupDefaultLoggers();
  }

  /**
   * 기본 로거들 설정
   */
  setupDefaultLoggers() {
    const defaultLoggers = ['krds-mcp', 'data-service', 'handlers', 'validation', 'performance', 'security', 'system'];

    defaultLoggers.forEach(loggerName => {
      this.loggers.set(loggerName, {
        name: loggerName,
        enabled: true,
        minLevel: this.minLogLevel
      });
    });
  }

  /**
   * MCP 서버 참조 설정
   * @param {Server} server - MCP 서버 인스턴스
   */
  setServer(server) {
    this.server = server;

    // 버퍼된 로그 전송
    if (this.logBuffer.length > 0) {
      this.logBuffer.forEach(log => this.sendLogToClient(log));
      this.logBuffer = [];
    }
  }

  /**
   * 최소 로그 레벨 설정
   * @param {string} level - 최소 로그 레벨
   */
  setMinimumLogLevel(level) {
    if (!Object.values(McpLogLevel).includes(level)) {
      throw new Error(`Invalid log level: ${level}`);
    }

    this.minLogLevel = level;

    // 모든 로거에 새로운 최소 레벨 적용
    this.loggers.forEach((config, name) => {
      config.minLevel = level;
    });
  }

  /**
   * 특정 로거의 최소 레벨 설정
   * @param {string} loggerName - 로거 이름
   * @param {string} level - 최소 로그 레벨
   */
  setLoggerLevel(loggerName, level) {
    if (!this.loggers.has(loggerName)) {
      this.loggers.set(loggerName, {
        name: loggerName,
        enabled: true,
        minLevel: level
      });
    } else {
      this.loggers.get(loggerName).minLevel = level;
    }
  }

  /**
   * 로그 레벨이 출력 가능한지 확인
   * @param {string} level - 확인할 로그 레벨
   * @param {string} loggerName - 로거 이름
   * @returns {boolean} 출력 가능 여부
   */
  shouldLog(level, loggerName = 'krds-mcp') {
    const logger = this.loggers.get(loggerName);
    if (!logger || !logger.enabled) {
      return false;
    }

    const currentPriority = LogLevelPriority[level];
    const minPriority = LogLevelPriority[logger.minLevel];

    return currentPriority <= minPriority;
  }

  /**
   * 로그 메시지 생성 및 전송
   * @param {string} level - 로그 레벨
   * @param {string} message - 메시지
   * @param {string} loggerName - 로거 이름
   * @param {object} data - 추가 데이터
   */
  log(level, message, loggerName = 'krds-mcp', data = {}) {
    if (!this.shouldLog(level, loggerName)) {
      return;
    }

    const logMessage = {
      level,
      logger: loggerName,
      data: {
        message,
        timestamp: new Date().toISOString(),
        ...this.sanitizeData(data)
      }
    };

    // 콘솔에도 출력
    this.outputToConsole(logMessage);

    // MCP 클라이언트에 전송 또는 버퍼에 저장
    if (this.server) {
      this.sendLogToClient(logMessage);
    } else {
      this.addToBuffer(logMessage);
    }
  }

  /**
   * 데이터 정제 (보안 정보 제거)
   * @param {object} data - 원본 데이터
   * @returns {object} 정제된 데이터
   */
  sanitizeData(data) {
    const sensitive = ['password', 'token', 'key', 'secret', 'credential'];
    const sanitized = { ...data };

    const sanitizeValue = obj => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(sanitizeValue);
      }

      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitive.some(s => lowerKey.includes(s))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          result[key] = sanitizeValue(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };

    return sanitizeValue(sanitized);
  }

  /**
   * MCP 클라이언트에 로그 전송
   * @param {object} logMessage - 로그 메시지
   */
  async sendLogToClient(logMessage) {
    if (!this.server) {
      return;
    }

    try {
      await this.server.notification({
        method: 'notifications/message',
        params: logMessage
      });
    } catch (error) {
      // 로그 전송 실패 시 콘솔에만 출력
      console.error('[MCP Logger] Failed to send log to client:', error.message);
      this.addToBuffer(logMessage);
    }
  }

  /**
   * 버퍼에 로그 추가
   * @param {object} logMessage - 로그 메시지
   */
  addToBuffer(logMessage) {
    this.logBuffer.push(logMessage);

    // 버퍼 크기 제한
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }
  }

  /**
   * 콘솔에 로그 출력
   * @param {object} logMessage - 로그 메시지
   */
  outputToConsole(logMessage) {
    const { level, logger, data } = logMessage;
    const timestamp = new Date(data.timestamp).toLocaleString('ko-KR');
    const prefix = `[${logger.toUpperCase()} ${level.toUpperCase()}]`;

    switch (level) {
      case McpLogLevel.EMERGENCY:
      case McpLogLevel.ALERT:
      case McpLogLevel.CRITICAL:
      case McpLogLevel.ERROR:
        console.error(`${prefix} ${timestamp} - ${data.message}`);
        if (data.stack) {
          console.error(data.stack);
        }
        break;

      case McpLogLevel.WARNING:
        console.warn(`${prefix} ${timestamp} - ${data.message}`);
        break;

      case McpLogLevel.NOTICE:
      case McpLogLevel.INFO:
        console.info(`${prefix} ${timestamp} - ${data.message}`);
        break;

      case McpLogLevel.DEBUG:
        if (process.env.NODE_ENV === 'development') {
          console.log(`${prefix} ${timestamp} - ${data.message}`);
        }
        break;
    }
  }

  // 편의 메서드들
  emergency(message, logger, data) {
    this.log(McpLogLevel.EMERGENCY, message, logger, data);
  }

  alert(message, logger, data) {
    this.log(McpLogLevel.ALERT, message, logger, data);
  }

  critical(message, logger, data) {
    this.log(McpLogLevel.CRITICAL, message, logger, data);
  }

  error(message, logger, data) {
    this.log(McpLogLevel.ERROR, message, logger, data);
  }

  warning(message, logger, data) {
    this.log(McpLogLevel.WARNING, message, logger, data);
  }

  notice(message, logger, data) {
    this.log(McpLogLevel.NOTICE, message, logger, data);
  }

  info(message, logger, data) {
    this.log(McpLogLevel.INFO, message, logger, data);
  }

  debug(message, logger, data) {
    this.log(McpLogLevel.DEBUG, message, logger, data);
  }

  /**
   * 로그 통계 정보 조회
   * @returns {object} 로그 통계
   */
  getLogStats() {
    const stats = {
      totalBuffered: this.logBuffer.length,
      loggers: Array.from(this.loggers.keys()),
      minLogLevel: this.minLogLevel,
      serverConnected: !!this.server
    };

    // 버퍼된 로그의 레벨별 통계
    const levelStats = {};
    this.logBuffer.forEach(log => {
      levelStats[log.level] = (levelStats[log.level] || 0) + 1;
    });
    stats.levelDistribution = levelStats;

    return stats;
  }

  /**
   * 로거 목록 조회
   * @returns {Array} 로거 목록
   */
  getLoggers() {
    return Array.from(this.loggers.entries()).map(([name, config]) => ({
      name,
      enabled: config.enabled,
      minLevel: config.minLevel
    }));
  }

  /**
   * 로거 활성화/비활성화
   * @param {string} loggerName - 로거 이름
   * @param {boolean} enabled - 활성화 여부
   */
  setLoggerEnabled(loggerName, enabled) {
    if (!this.loggers.has(loggerName)) {
      this.loggers.set(loggerName, {
        name: loggerName,
        enabled,
        minLevel: this.minLogLevel
      });
    } else {
      this.loggers.get(loggerName).enabled = enabled;
    }
  }

  /**
   * 버퍼 클리어
   */
  clearBuffer() {
    this.logBuffer = [];
  }
}

/**
 * 글로벌 MCP 로거 인스턴스
 */
export const mcpLogger = new McpLogger();

/**
 * 기존 ErrorLogger를 MCP 표준으로 업그레이드하는 어댑터
 */
export class ErrorLoggerAdapter {
  /**
   * 기존 심각도를 MCP 로그 레벨로 변환
   * @param {string} severity - 기존 심각도
   * @returns {string} MCP 로그 레벨
   */
  static convertSeverityToLogLevel(severity) {
    const mapping = {
      CRITICAL: McpLogLevel.CRITICAL,
      HIGH: McpLogLevel.ERROR,
      MEDIUM: McpLogLevel.WARNING,
      LOW: McpLogLevel.INFO
    };

    return mapping[severity] || McpLogLevel.INFO;
  }

  /**
   * 기존 오류 타입을 로거 이름으로 변환
   * @param {string} errorType - 오류 타입
   * @returns {string} 로거 이름
   */
  static convertErrorTypeToLogger(errorType) {
    const mapping = {
      VALIDATION_ERROR: 'validation',
      DATA_NOT_FOUND: 'data-service',
      PROCESSING_ERROR: 'handlers',
      SYSTEM_ERROR: 'system',
      SECURITY_ERROR: 'security'
    };

    return mapping[errorType] || 'krds-mcp';
  }

  /**
   * 기존 ErrorLogger.logError와 호환되는 메서드
   * @param {string} type - 오류 유형
   * @param {string} severity - 심각도
   * @param {string} message - 메시지
   * @param {object} context - 컨텍스트
   * @param {Error} originalError - 원본 오류
   */
  static logError(type, severity, message, context = {}, originalError = null) {
    const logLevel = this.convertSeverityToLogLevel(severity);
    const logger = this.convertErrorTypeToLogger(type);

    const data = {
      type,
      context,
      ...(originalError && {
        stack: originalError.stack,
        name: originalError.name
      })
    };

    mcpLogger.log(logLevel, message, logger, data);
  }
}

export default mcpLogger;
