/**
 * KRDS MCP 성능 최적화 헬퍼
 * 캐싱, 메모이제이션, 성능 모니터링 등을 제공합니다.
 */

/**
 * 성능 최적화된 캐시 클래스
 */
export class PerformanceCache {
  constructor(maxSize = 1000, ttl = 5 * 60 * 1000) {
    // 5분 TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      return null;
    }

    // Handle invalid timestamp gracefully
    const timestamp = typeof item.timestamp === 'number' ? item.timestamp : 0;
    if (Date.now() - timestamp > this.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Move to end for LRU (delete and re-insert)
    this.cache.delete(key);
    this.cache.set(key, item);

    this.hits++;
    return item.data;
  }

  set(key, data) {
    // Handle zero cache size
    if (this.maxSize === 0) {
      return;
    }

    // LRU eviction when cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // Handle zero TTL - don't store items that expire immediately
    if (this.ttl === 0) {
      return;
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0
    };
  }
}

/**
 * 메모이제이션 데코레이터
 */
export class Memoizer {
  static cache = new PerformanceCache(500, 10 * 60 * 1000); // 10분 TTL

  /**
   * 함수를 메모이제이션합니다
   * @param {Function} fn - 메모이제이션할 함수
   * @param {Function} keyGenerator - 캐시 키 생성 함수
   * @returns {Function} 메모이제이션된 함수
   */
  static memoize(fn, keyGenerator = (...args) => JSON.stringify(args)) {
    return function (...args) {
      const key = `${fn.name}_${keyGenerator(...args)}`;
      const cached = Memoizer.cache.get(key);

      if (cached !== null) {
        return cached;
      }

      const result = fn.apply(this, args);
      Memoizer.cache.set(key, result);
      return result;
    };
  }

  /**
   * 비동기 함수를 메모이제이션합니다
   * @param {Function} asyncFn - 메모이제이션할 비동기 함수
   * @param {Function} keyGenerator - 캐시 키 생성 함수
   * @returns {Function} 메모이제이션된 비동기 함수
   */
  static memoizeAsync(asyncFn, keyGenerator = (...args) => JSON.stringify(args)) {
    const pendingPromises = new Map();

    return async function (...args) {
      const key = `${asyncFn.name}_${keyGenerator(...args)}`;

      // Check cache first
      const cached = Memoizer.cache.get(key);
      if (cached !== null) {
        return cached;
      }

      // Check if promise is already pending
      if (pendingPromises.has(key)) {
        return pendingPromises.get(key);
      }

      // Execute and cache the promise
      const promise = asyncFn.apply(this, args);
      pendingPromises.set(key, promise);

      try {
        const result = await promise;
        Memoizer.cache.set(key, result);
        pendingPromises.delete(key);
        return result;
      } catch (error) {
        pendingPromises.delete(key);
        throw error;
      }
    };
  }

  static clearCache() {
    this.cache.clear();
  }

  static getCacheStats() {
    return this.cache.getStats();
  }
}

/**
 * 성능 모니터링 클래스
 */
export class PerformanceMonitor {
  static metrics = new Map();
  static enabled = process.env.NODE_ENV === 'development';

  /**
   * 함수 실행 시간을 측정합니다
   * @param {Function} fn - 측정할 함수
   * @param {string} label - 메트릭 라벨
   * @returns {*} 함수 실행 결과
   */
  static async measure(fn, label = 'Operation') {
    if (!this.enabled) {
      return await fn();
    }

    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;

    try {
      const result = await fn();
      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;

      const duration = endTime - startTime;
      const memoryDelta = endMemory - startMemory;

      this._recordMetric(label, {
        duration,
        memoryDelta,
        timestamp: Date.now()
      });

      // Log slow operations
      if (duration > 100) {
        console.warn(`[KRDS Performance] ${label}: ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this._recordMetric(label, {
        duration,
        error: error.message,
        timestamp: Date.now()
      });

      throw error;
    }
  }

  /**
   * 메트릭을 기록합니다
   * @private
   */
  static _recordMetric(label, metric) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }

    const metrics = this.metrics.get(label);
    metrics.push(metric);

    // Keep only last 100 metrics per label
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  /**
   * 성능 통계를 반환합니다
   * @param {string} label - 라벨 (선택사항)
   * @returns {object} 성능 통계
   */
  static getStats(label) {
    if (label) {
      const metrics = this.metrics.get(label) || [];
      return this._calculateStats(metrics, label);
    }

    const allStats = {};
    for (const [metricLabel, metrics] of this.metrics.entries()) {
      allStats[metricLabel] = this._calculateStats(metrics, metricLabel);
    }

    return allStats;
  }

  /**
   * 통계를 계산합니다
   * @private
   */
  static _calculateStats(metrics, label) {
    if (metrics.length === 0) {
      return { label, count: 0 };
    }

    const durations = metrics
      .filter(m => !m.error)
      .map(m => m.duration)
      .sort((a, b) => a - b);

    const errorCount = metrics.filter(m => m.error).length;

    return {
      label,
      count: metrics.length,
      errorCount,
      duration: {
        min: Math.min(...durations),
        max: Math.max(...durations),
        avg: durations.reduce((a, b) => a + b, 0) / durations.length,
        p50: durations[Math.floor(durations.length * 0.5)],
        p95: durations[Math.floor(durations.length * 0.95)],
        p99: durations[Math.floor(durations.length * 0.99)]
      },
      lastRun: Math.max(...metrics.map(m => m.timestamp))
    };
  }

  static enable() {
    this.enabled = true;
  }

  static disable() {
    this.enabled = false;
  }

  static clear() {
    this.metrics.clear();
  }
}

/**
 * 데이터 최적화 유틸리티
 */
export class DataOptimizer {
  /**
   * 대용량 배열을 청크 단위로 처리합니다
   * @param {Array} array - 처리할 배열
   * @param {Function} processor - 각 청크를 처리할 함수
   * @param {number} chunkSize - 청크 크기
   * @returns {Array} 처리 결과 배열
   */
  static async processInChunks(array, processor, chunkSize = 100) {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      const chunkResult = await processor(chunk);
      results.push(...chunkResult);

      // Allow other tasks to run
      await new Promise(resolve => setImmediate(resolve));
    }
    return results;
  }

  /**
   * 객체를 최적화합니다 (불필요한 속성 제거)
   * @param {object} obj - 최적화할 객체
   * @param {Array} keepFields - 유지할 필드들
   * @returns {object} 최적화된 객체
   */
  static optimizeObject(obj, keepFields) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.optimizeObject(item, keepFields));
    }

    const optimized = {};
    for (const field of keepFields) {
      if (Object.prototype.hasOwnProperty.call(obj, field)) {
        optimized[field] = obj[field];
      }
    }

    return optimized;
  }

  /**
   * 중복 제거된 배열을 반환합니다
   * @param {Array} array - 중복을 제거할 배열
   * @param {string|Function} keyFn - 중복 판별 키 함수
   * @returns {Array} 중복이 제거된 배열
   */
  static deduplicateArray(array, keyFn = item => item) {
    const seen = new Set();
    const keyFunction = typeof keyFn === 'string' ? item => item[keyFn] : keyFn;

    return array.filter(item => {
      const key = keyFunction(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * 배열을 특정 조건으로 그룹화합니다
   * @param {Array} array - 그룹화할 배열
   * @param {string|Function} keyFn - 그룹 키 함수
   * @returns {Map} 그룹화된 결과
   */
  static groupBy(array, keyFn) {
    const keyFunction = typeof keyFn === 'string' ? item => item[keyFn] : keyFn;
    const groups = new Map();

    for (const item of array) {
      const key = keyFunction(item);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(item);
    }

    return groups;
  }
}

/**
 * 지연 로딩 유틸리티
 */
export class LazyLoader {
  static loadedModules = new Map();

  /**
   * 모듈을 지연 로딩합니다
   * @param {string} modulePath - 모듈 경로
   * @param {string} exportName - export 이름 (선택사항)
   * @returns {Promise} 로딩된 모듈
   */
  static async loadModule(modulePath, exportName = null) {
    const cacheKey = `${modulePath}#${exportName || 'default'}`;

    if (this.loadedModules.has(cacheKey)) {
      return this.loadedModules.get(cacheKey);
    }

    try {
      const module = await import(modulePath);
      const result = exportName ? module[exportName] : module;

      this.loadedModules.set(cacheKey, result);
      return result;
    } catch (error) {
      throw new Error(`Failed to load module ${modulePath}: ${error.message}`);
    }
  }

  /**
   * 조건부로 모듈을 로딩합니다
   * @param {Function} condition - 로딩 조건
   * @param {string} modulePath - 모듈 경로
   * @param {string} exportName - export 이름 (선택사항)
   * @returns {Promise|null} 조건이 맞으면 모듈, 아니면 null
   */
  static async conditionalLoad(condition, modulePath, exportName = null) {
    if (await condition()) {
      return this.loadModule(modulePath, exportName);
    }
    return null;
  }
}

/**
 * 메모리 최적화 유틸리티
 */
export class MemoryOptimizer {
  /**
   * WeakMap을 사용한 메모리 친화적 캐시
   */
  static createWeakCache() {
    const cache = new WeakMap();

    return {
      get(key) {
        return cache.get(key) || null;
      },

      set(key, value) {
        cache.set(key, value);
      },

      has(key) {
        return cache.has(key);
      },

      delete(key) {
        return cache.delete(key);
      }
    };
  }

  /**
   * 가비지 컬렉션을 제안합니다 (Node.js에서만)
   */
  static suggestGC() {
    if (global.gc && typeof global.gc === 'function') {
      global.gc();
      return true;
    }
    return false;
  }

  /**
   * 메모리 사용량을 반환합니다
   */
  static getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024) // MB
    };
  }
}

// Export utility functions
export const memoize = Memoizer.memoize;
export const memoizeAsync = Memoizer.memoizeAsync;
export const measure = PerformanceMonitor.measure;
