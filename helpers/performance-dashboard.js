/**
 * KRDS MCP 성능 모니터링 대시보드
 * 실시간 성능 메트릭을 시각화하고 모니터링합니다.
 */

import { PerformanceMonitor, globalCache, Memoizer } from './performance-helpers.js';
import { mcpLogger } from './mcp-logging.js';

/**
 * 성능 대시보드 클래스
 */
export class PerformanceDashboard {
  constructor(options = {}) {
    const {
      updateInterval = 5000, // 5초마다 업데이트
      enableConsoleOutput = true,
      enableFileLogging = false,
      logFilePath = './performance-logs.json',
      maxHistorySize = 1000
    } = options;

    this.updateInterval = updateInterval;
    this.enableConsoleOutput = enableConsoleOutput;
    this.enableFileLogging = enableFileLogging;
    this.logFilePath = logFilePath;
    this.maxHistorySize = maxHistorySize;

    this.history = [];
    this.isRunning = false;
    this.intervalId = null;

    // 성능 임계값
    this.thresholds = {
      slowOperation: 1000, // 1초
      highMemoryUsage: 100, // 100MB
      lowHitRate: 0.5, // 50%
      highErrorRate: 0.1 // 10%
    };
  }

  /**
   * 대시보드 시작
   */
  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.update();
    }, this.updateInterval);

    mcpLogger.info('Performance dashboard started', 'performance-dashboard', {
      updateInterval: this.updateInterval
    });
  }

  /**
   * 대시보드 중지
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    mcpLogger.info('Performance dashboard stopped', 'performance-dashboard');
  }

  /**
   * 대시보드 업데이트
   */
  update() {
    const snapshot = this.createSnapshot();
    this.history.push(snapshot);

    // 히스토리 크기 제한
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    // 성능 경고 체크
    this.checkPerformanceWarnings(snapshot);

    // 콘솔 출력
    if (this.enableConsoleOutput) {
      this.printToConsole(snapshot);
    }

    // 파일 로깅
    if (this.enableFileLogging) {
      this.logToFile(snapshot);
    }
  }

  /**
   * 성능 스냅샷 생성
   */
  createSnapshot() {
    const timestamp = new Date().toISOString();
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    // 캐시 통계
    const globalCacheStats = globalCache.getStats();
    const memoizerStats = Memoizer.getCacheStats();

    // 성능 메트릭
    const performanceMetrics = PerformanceMonitor.getAllMetrics();

    return {
      timestamp,
      uptime,
      memory: {
        heapUsed: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotal: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
        external: Math.round((memoryUsage.external / 1024 / 1024) * 100) / 100,
        rss: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100
      },
      cache: {
        global: globalCacheStats,
        memoizer: memoizerStats
      },
      performance: performanceMetrics,
      summary: this.calculateSummary(globalCacheStats, memoizerStats, performanceMetrics)
    };
  }

  /**
   * 성능 요약 계산
   */
  calculateSummary(globalCacheStats, memoizerStats, performanceMetrics) {
    const totalOperations = Object.values(performanceMetrics).reduce((sum, metric) => {
      return sum + (metric ? metric.count : 0);
    }, 0);

    const totalErrors = Object.values(performanceMetrics).reduce((sum, metric) => {
      return sum + (metric ? metric.errors : 0);
    }, 0);

    const averageDuration =
      Object.values(performanceMetrics).reduce((sum, metric) => {
        return sum + (metric ? metric.averageDuration : 0);
      }, 0) / Math.max(Object.keys(performanceMetrics).length, 1);

    const errorRate = totalOperations > 0 ? totalErrors / totalOperations : 0;

    return {
      totalOperations,
      totalErrors,
      errorRate,
      averageDuration,
      cacheHitRate: globalCacheStats.hitRate,
      memoryUsageMB: process.memoryUsage().heapUsed / 1024 / 1024
    };
  }

  /**
   * 성능 경고 체크
   */
  checkPerformanceWarnings(snapshot) {
    const warnings = [];

    // 느린 작업 체크
    if (snapshot.summary.averageDuration > this.thresholds.slowOperation) {
      warnings.push({
        type: 'SLOW_OPERATION',
        message: `평균 작업 시간이 ${this.thresholds.slowOperation}ms를 초과합니다: ${snapshot.summary.averageDuration.toFixed(2)}ms`,
        severity: 'warning'
      });
    }

    // 높은 메모리 사용량 체크
    if (snapshot.summary.memoryUsageMB > this.thresholds.highMemoryUsage) {
      warnings.push({
        type: 'HIGH_MEMORY_USAGE',
        message: `메모리 사용량이 ${this.thresholds.highMemoryUsage}MB를 초과합니다: ${snapshot.summary.memoryUsageMB.toFixed(2)}MB`,
        severity: 'warning'
      });
    }

    // 낮은 캐시 히트율 체크
    if (snapshot.summary.cacheHitRate < this.thresholds.lowHitRate) {
      warnings.push({
        type: 'LOW_CACHE_HIT_RATE',
        message: `캐시 히트율이 ${(this.thresholds.lowHitRate * 100).toFixed(0)}% 미만입니다: ${(snapshot.summary.cacheHitRate * 100).toFixed(1)}%`,
        severity: 'info'
      });
    }

    // 높은 에러율 체크
    if (snapshot.summary.errorRate > this.thresholds.highErrorRate) {
      warnings.push({
        type: 'HIGH_ERROR_RATE',
        message: `에러율이 ${(this.thresholds.highErrorRate * 100).toFixed(0)}%를 초과합니다: ${(snapshot.summary.errorRate * 100).toFixed(1)}%`,
        severity: 'error'
      });
    }

    // 경고 로깅
    warnings.forEach(warning => {
      mcpLogger[warning.severity](warning.message, 'performance-dashboard', {
        type: warning.type,
        timestamp: snapshot.timestamp
      });
    });

    return warnings;
  }

  /**
   * 콘솔에 출력
   */
  printToConsole(snapshot) {
    const { summary, memory, cache } = snapshot;

    console.log('\n📊 KRDS MCP Performance Dashboard');
    console.log('=====================================');
    console.log(`⏰ 시간: ${new Date(snapshot.timestamp).toLocaleString('ko-KR')}`);
    console.log(`🔄 업타임: ${Math.round(snapshot.uptime)}초`);
    console.log('');

    // 메모리 정보
    console.log('💾 메모리 사용량:');
    console.log(`   힙 사용: ${memory.heapUsed}MB / ${memory.heapTotal}MB`);
    console.log(`   RSS: ${memory.rss}MB`);
    console.log(`   External: ${memory.external}MB`);
    console.log('');

    // 캐시 정보
    console.log('🗄️ 캐시 상태:');
    console.log(
      `   전역 캐시: ${cache.global.size}/${cache.global.maxSize} (${(cache.global.hitRate * 100).toFixed(1)}% 히트율)`
    );
    console.log(
      `   메모이제이션: ${cache.memoizer.size}/${cache.memoizer.maxSize} (${(cache.memoizer.hitRate * 100).toFixed(1)}% 히트율)`
    );
    console.log('');

    // 성능 요약
    console.log('⚡ 성능 요약:');
    console.log(`   총 작업: ${summary.totalOperations}`);
    console.log(`   에러율: ${(summary.errorRate * 100).toFixed(1)}%`);
    console.log(`   평균 지속시간: ${summary.averageDuration.toFixed(2)}ms`);
    console.log('=====================================\n');
  }

  /**
   * 파일에 로깅
   */
  async logToFile(snapshot) {
    try {
      const fs = await import('fs/promises');
      const logEntry = {
        ...snapshot,
        logType: 'performance_snapshot'
      };

      await fs.appendFile(this.logFilePath, `${JSON.stringify(logEntry)}\n`);
    } catch (error) {
      mcpLogger.error('Failed to log performance data to file', 'performance-dashboard', {
        error: error.message,
        filePath: this.logFilePath
      });
    }
  }

  /**
   * 성능 리포트 생성
   */
  generateReport(timeRange = '1h') {
    const now = Date.now();
    const rangeMs = this.parseTimeRange(timeRange);
    const startTime = now - rangeMs;

    const relevantHistory = this.history.filter(snapshot => {
      return new Date(snapshot.timestamp).getTime() >= startTime;
    });

    if (relevantHistory.length === 0) {
      return {
        error: '해당 시간 범위에 데이터가 없습니다.'
      };
    }

    // 통계 계산
    const memoryUsage = relevantHistory.map(h => h.memory.heapUsed);
    const cacheHitRates = relevantHistory.map(h => h.summary.cacheHitRate);
    const errorRates = relevantHistory.map(h => h.summary.errorRate);
    const operationCounts = relevantHistory.map(h => h.summary.totalOperations);

    return {
      timeRange,
      dataPoints: relevantHistory.length,
      period: {
        start: relevantHistory[0].timestamp,
        end: relevantHistory[relevantHistory.length - 1].timestamp
      },
      memory: {
        average: this.calculateAverage(memoryUsage),
        min: Math.min(...memoryUsage),
        max: Math.max(...memoryUsage),
        trend: this.calculateTrend(memoryUsage)
      },
      cache: {
        averageHitRate: this.calculateAverage(cacheHitRates),
        minHitRate: Math.min(...cacheHitRates),
        maxHitRate: Math.max(...cacheHitRates)
      },
      performance: {
        totalOperations: operationCounts.reduce((a, b) => a + b, 0),
        averageErrorRate: this.calculateAverage(errorRates),
        peakErrorRate: Math.max(...errorRates)
      },
      recommendations: this.generateRecommendations(relevantHistory)
    };
  }

  /**
   * 시간 범위 파싱
   */
  parseTimeRange(timeRange) {
    const unit = timeRange.slice(-1);
    const value = parseInt(timeRange.slice(0, -1));

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 60 * 60 * 1000; // 기본 1시간
    }
  }

  /**
   * 평균 계산
   */
  calculateAverage(array) {
    return array.reduce((a, b) => a + b, 0) / array.length;
  }

  /**
   * 트렌드 계산 (양수: 증가, 음수: 감소)
   */
  calculateTrend(array) {
    if (array.length < 2) {
      return 0;
    }

    const firstHalf = array.slice(0, Math.floor(array.length / 2));
    const secondHalf = array.slice(Math.floor(array.length / 2));

    const firstAvg = this.calculateAverage(firstHalf);
    const secondAvg = this.calculateAverage(secondHalf);

    return secondAvg - firstAvg;
  }

  /**
   * 권장사항 생성
   */
  generateRecommendations(history) {
    const recommendations = [];
    const lastSnapshot = history[history.length - 1];

    // 메모리 사용량 권장사항
    if (lastSnapshot.summary.memoryUsageMB > 80) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        message: '메모리 사용량이 높습니다. 캐시 크기를 줄이거나 가비지 컬렉션을 고려하세요.',
        action: '캐시 크기 조정 또는 메모리 최적화'
      });
    }

    // 캐시 히트율 권장사항
    if (lastSnapshot.summary.cacheHitRate < 0.3) {
      recommendations.push({
        type: 'cache',
        priority: 'medium',
        message: '캐시 히트율이 낮습니다. 캐시 키 전략을 검토하거나 TTL을 늘려보세요.',
        action: '캐시 키 전략 개선 또는 TTL 조정'
      });
    }

    // 에러율 권장사항
    if (lastSnapshot.summary.errorRate > 0.05) {
      recommendations.push({
        type: 'error',
        priority: 'high',
        message: '에러율이 높습니다. 에러 로그를 확인하고 예외 처리를 개선하세요.',
        action: '에러 로그 분석 및 예외 처리 개선'
      });
    }

    return recommendations;
  }

  /**
   * 대시보드 상태 조회
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      updateInterval: this.updateInterval,
      historySize: this.history.length,
      maxHistorySize: this.maxHistorySize,
      lastUpdate: this.history.length > 0 ? this.history[this.history.length - 1].timestamp : null
    };
  }

  /**
   * 히스토리 정리
   */
  clearHistory() {
    this.history = [];
    mcpLogger.info('Performance dashboard history cleared', 'performance-dashboard');
  }
}

/**
 * 전역 성능 대시보드 인스턴스
 */
export const performanceDashboard = new PerformanceDashboard({
  updateInterval: 10000, // 10초마다 업데이트
  enableConsoleOutput: process.env.NODE_ENV === 'development',
  enableFileLogging: false,
  maxHistorySize: 500
});

/**
 * 대시보드 자동 시작 (개발 모드에서만)
 */
if (process.env.NODE_ENV === 'development' || process.env.ENABLE_PERFORMANCE_DASHBOARD === 'true') {
  performanceDashboard.start();

  // 프로세스 종료 시 대시보드 중지
  process.on('exit', () => {
    performanceDashboard.stop();
  });
}
