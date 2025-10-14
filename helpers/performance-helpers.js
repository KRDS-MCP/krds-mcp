/**
 * KRDS MCP 성능 최적화 헬퍼
 * 캐싱, 메모이제이션, 성능 모니터링 등을 제공합니다.
 */

/**
 * 향상된 성능 최적화 캐시 클래스
 */
export class EnhancedPerformanceCache {
  constructor(options = {}) {
    const {
      maxSize = 1000,
      ttl = 5 * 60 * 1000, // 5분 TTL
      enableCompression = false,
      enableStats = true,
      evictionPolicy = 'LRU', // LRU, LFU, FIFO
      compressionThreshold = 1024 // 1KB 이상일 때 압축
    } = options;

    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.enableCompression = enableCompression;
    this.enableStats = enableStats;
    this.evictionPolicy = evictionPolicy;
    this.compressionThreshold = compressionThreshold;
    
    // 통계
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.compressedItems = 0;
    
    // LFU를 위한 접근 카운터
    this.accessCount = new Map();
    
    // 압축된 아이템 추적
    this.compressedKeys = new Set();
  }

  /**
   * 데이터 압축
   */
  _compress(data) {
    if (!this.enableCompression || typeof data !== 'string') {
      return data;
    }
    
    if (data.length < this.compressionThreshold) {
      return data;
    }
    
    try {
      // 간단한 압축 (실제로는 더 정교한 압축 알고리즘 사용 가능)
      const compressed = Buffer.from(data).toString('base64');
      this.compressedItems++;
      return compressed;
    } catch (error) {
      return data; // 압축 실패 시 원본 반환
    }
  }

  /**
   * 데이터 압축 해제
   */
  _decompress(data) {
    if (!this.enableCompression || !this.compressedKeys.has(data)) {
      return data;
    }
    
    try {
      return Buffer.from(data, 'base64').toString();
    } catch (error) {
      return data; // 압축 해제 실패 시 원본 반환
    }
  }

  /**
   * 캐시에서 아이템 제거 (LRU/LFU/FIFO)
   */
  _evictItem() {
    let keyToEvict = null;
    
    switch (this.evictionPolicy) {
      case 'LRU':
        // 가장 오래된 아이템 제거
        keyToEvict = this.cache.keys().next().value;
        break;
        
      case 'LFU':
        // 가장 적게 사용된 아이템 제거
        let minCount = Infinity;
        for (const [key, count] of this.accessCount) {
          if (count < minCount) {
            minCount = count;
            keyToEvict = key;
          }
        }
        break;
        
      case 'FIFO':
        // 먼저 들어온 아이템 제거
        keyToEvict = this.cache.keys().next().value;
        break;
        
      default:
        keyToEvict = this.cache.keys().next().value;
    }
    
    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      this.accessCount.delete(keyToEvict);
      this.compressedKeys.delete(keyToEvict);
      this.evictions++;
    }
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      return null;
    }

    // TTL 검사
    const timestamp = typeof item.timestamp === 'number' ? item.timestamp : 0;
    if (Date.now() - timestamp > this.ttl) {
      this.cache.delete(key);
      this.accessCount.delete(key);
      this.compressedKeys.delete(key);
      this.misses++;
      return null;
    }

    // 압축 해제
    const decompressedData = this._decompress(item.data);

    // 접근 카운터 업데이트 (LFU)
    if (this.evictionPolicy === 'LFU') {
      const currentCount = this.accessCount.get(key) || 0;
      this.accessCount.set(key, currentCount + 1);
    }

    // LRU를 위한 재삽입
    if (this.evictionPolicy === 'LRU') {
      this.cache.delete(key);
      this.cache.set(key, item);
    }

    this.hits++;
    return decompressedData;
  }

  set(key, data) {
    if (this.maxSize === 0 || this.ttl === 0) {
      return;
    }

    // 캐시가 가득 찬 경우 아이템 제거
    if (this.cache.size >= this.maxSize) {
      this._evictItem();
    }

    // 데이터 압축
    const compressedData = this._compress(data);
    if (compressedData !== data) {
      this.compressedKeys.add(key);
    }

    this.cache.set(key, {
      data: compressedData,
      timestamp: Date.now()
    });

    // LFU 접근 카운터 초기화
    if (this.evictionPolicy === 'LFU') {
      this.accessCount.set(key, 0);
    }
  }

  /**
   * 특정 키 삭제
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.accessCount.delete(key);
      this.compressedKeys.delete(key);
    }
    return deleted;
  }

  /**
   * 만료된 아이템 정리
   */
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      const timestamp = typeof item.timestamp === 'number' ? item.timestamp : 0;
      if (now - timestamp > this.ttl) {
        this.cache.delete(key);
        this.accessCount.delete(key);
        this.compressedKeys.delete(key);
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  }

  clear() {
    this.cache.clear();
    this.accessCount.clear();
    this.compressedKeys.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.compressedItems = 0;
  }

  getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? this.hits / totalRequests : 0;
    const compressionRatio = this.compressedItems > 0 ? 
      (this.compressedItems / this.cache.size) : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRate,
      compressionRatio,
      compressedItems: this.compressedItems,
      evictionPolicy: this.evictionPolicy,
      enableCompression: this.enableCompression
    };
  }

  /**
   * 메모리 사용량 추정
   */
  getMemoryUsage() {
    let totalSize = 0;
    for (const [key, item] of this.cache.entries()) {
      totalSize += key.length;
      totalSize += JSON.stringify(item).length;
    }
    
    return {
      estimatedBytes: totalSize,
      estimatedMB: Math.round((totalSize / 1024 / 1024) * 100) / 100
    };
  }
}

/**
 * Redis 캐시 어댑터 (선택적)
 */
export class RedisCacheAdapter {
  constructor(redisClient = null) {
    this.redis = redisClient;
    this.enabled = !!redisClient;
  }

  async get(key) {
    if (!this.enabled) {
      return null;
    }
    
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Redis get error:', error.message);
      return null;
    }
  }

  async set(key, data, ttl = 300) {
    if (!this.enabled) {
      return false;
    }
    
    try {
      await this.redis.setex(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn('Redis set error:', error.message);
      return false;
    }
  }

  async delete(key) {
    if (!this.enabled) {
      return false;
    }
    
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.warn('Redis delete error:', error.message);
      return false;
    }
  }
}

/**
 * 하이브리드 캐시 (메모리 + Redis)
 */
export class HybridCache {
  constructor(options = {}) {
    const {
      memoryCache = new EnhancedPerformanceCache(),
      redisCache = null,
      useRedis = false
    } = options;

    this.memoryCache = memoryCache;
    this.redisCache = redisCache;
    this.useRedis = useRedis && redisCache;
  }

  async get(key) {
    // 먼저 메모리 캐시에서 확인
    let data = this.memoryCache.get(key);
    
    if (data !== null) {
      return data;
    }

    // Redis에서 확인
    if (this.useRedis) {
      data = await this.redisCache.get(key);
      if (data !== null) {
        // 메모리 캐시에 저장
        this.memoryCache.set(key, data);
        return data;
      }
    }

    return null;
  }

  async set(key, data, ttl = 300) {
    // 메모리 캐시에 저장
    this.memoryCache.set(key, data);

    // Redis에도 저장
    if (this.useRedis) {
      await this.redisCache.set(key, data, ttl);
    }
  }

  async delete(key) {
    // 메모리 캐시에서 삭제
    this.memoryCache.delete(key);

    // Redis에서도 삭제
    if (this.useRedis) {
      await this.redisCache.delete(key);
    }
  }

  getStats() {
    const memoryStats = this.memoryCache.getStats();
    return {
      memory: memoryStats,
      redis: this.useRedis ? 'enabled' : 'disabled',
      type: 'hybrid'
    };
  }
}

/**
 * 성능 최적화된 캐시 클래스 (기존 호환성)
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
  static cache = new EnhancedPerformanceCache({
    maxSize: 500,
    ttl: 10 * 60 * 1000, // 10분 TTL
    enableCompression: true,
    evictionPolicy: 'LRU'
  });

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
   * 캐시 통계 조회
   */
  static getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * 비동기 함수를 메모이제이션합니다 (호환성을 위해 유지)
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
    this.metrics.get(label).push(metric);

    // 최대 100개 메트릭만 유지
    if (this.metrics.get(label).length > 100) {
      this.metrics.get(label).shift();
    }
  }

  /**
   * 메트릭 통계를 계산합니다
   */
  static getMetrics(label) {
    const metrics = this.metrics.get(label) || [];
    if (metrics.length === 0) {
      return null;
    }

    const durations = metrics.map(m => m.duration).filter(d => !isNaN(d));
    const memoryDeltas = metrics.map(m => m.memoryDelta).filter(d => !isNaN(d));

    return {
      count: metrics.length,
      durations: durations,
      averageDuration: durations.length > 0 ? 
        durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      minDuration: durations.length > 0 ? Math.min(...durations) : 0,
      maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
      averageMemoryDelta: memoryDeltas.length > 0 ? 
        memoryDeltas.reduce((a, b) => a + b, 0) / memoryDeltas.length : 0,
      errors: metrics.filter(m => m.error).length
    };
  }

  /**
   * 모든 메트릭을 조회합니다
   */
  static getAllMetrics() {
    const result = {};
    for (const [label] of this.metrics) {
      result[label] = this.getMetrics(label);
    }
    return result;
  }

  /**
   * 메트릭을 초기화합니다
   */
  static clearMetrics() {
    this.metrics.clear();
  }

  /**
   * 모든 메트릭을 초기화합니다 (호환성을 위해 유지)
   */
  static clear() {
    this.metrics.clear();
  }

  /**
   * 성능 모니터링을 활성화합니다
   */
  static enable() {
    this.enabled = true;
  }

  /**
   * 성능 모니터링을 비활성화합니다
   */
  static disable() {
    this.enabled = false;
  }

  /**
   * 성능 통계를 반환합니다 (호환성을 위해 유지)
   */
  static getStats(label) {
    if (label) {
      const metrics = this.getMetrics(label);
      if (!metrics) {
        return {
          label,
          count: 0,
          errorCount: 0,
          duration: {
            min: 0,
            max: 0,
            avg: 0,
            p50: 0,
            p95: 0,
            p99: 0
          },
          lastRun: 0
        };
      }
      
      const durations = metrics.durations || [];
      const sortedDurations = durations.sort((a, b) => a - b);
      
      return {
        label,
        count: metrics.count,
        errorCount: metrics.errors,
        duration: {
          min: sortedDurations.length > 0 ? Math.min(...sortedDurations) : 0,
          max: sortedDurations.length > 0 ? Math.max(...sortedDurations) : 0,
          avg: metrics.averageDuration,
          p50: sortedDurations.length > 0 ? sortedDurations[Math.floor(sortedDurations.length * 0.5)] : 0,
          p95: sortedDurations.length > 0 ? sortedDurations[Math.floor(sortedDurations.length * 0.95)] : 0,
          p99: sortedDurations.length > 0 ? sortedDurations[Math.floor(sortedDurations.length * 0.99)] : 0
        },
        lastRun: Math.max(...(this.metrics.get(label) || []).map(m => m.timestamp || 0))
      };
    }
    return this.getAllMetrics();
  }
}

/**
 * 성능 측정 함수
 */
export const measure = PerformanceMonitor.measure.bind(PerformanceMonitor);

/**
 * 전역 캐시 인스턴스
 */
export const globalCache = new EnhancedPerformanceCache({
  maxSize: 2000,
  ttl: 15 * 60 * 1000, // 15분 TTL
  enableCompression: true,
  evictionPolicy: 'LRU'
});

/**
 * 정기적인 캐시 정리
 */
setInterval(() => {
  globalCache.cleanup();
  Memoizer.cache.cleanup();
}, 5 * 60 * 1000); // 5분마다

// 기존 코드와의 호환성을 위한 export
export const memoize = Memoizer.memoize;
export const memoizeAsync = Memoizer.memoizeAsync || (() => {
  console.warn('memoizeAsync is deprecated, use memoize instead');
  return Memoizer.memoize;
});

// 기존 클래스들 (호환성을 위해 유지)
export class DataOptimizer {
  static async processInChunks(array, processor, chunkSize = 100) {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      const chunkResult = await processor(chunk);
      results.push(...chunkResult);
      await new Promise(resolve => setImmediate(resolve));
    }
    return results;
  }

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

export class LazyLoader {
  static loadedModules = new Map();

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

  static async conditionalLoad(condition, modulePath, exportName = null) {
    if (await condition()) {
      return this.loadModule(modulePath, exportName);
    }
    return null;
  }
}

export class MemoryOptimizer {
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

  static suggestGC() {
    if (global.gc && typeof global.gc === 'function') {
      global.gc();
      return true;
    }
    return false;
  }

  static getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      rss: Math.round(usage.rss / 1024 / 1024),
      external: Math.round(usage.external / 1024 / 1024)
    };
  }
}
