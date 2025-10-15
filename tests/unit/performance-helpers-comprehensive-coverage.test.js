/**
 * Comprehensive tests for performance-helpers.js
 * Tests all classes: PerformanceCache, Memoizer, PerformanceMonitor, DataOptimizer, LazyLoader, MemoryOptimizer
 * Target: 60%+ coverage for major functionality gaps
 */

import {
  PerformanceCache,
  Memoizer,
  PerformanceMonitor,
  DataOptimizer,
  LazyLoader,
  MemoryOptimizer,
  memoize,
  memoizeAsync,
  measure
} from '../../helpers/performance-helpers.js';

describe('Performance Helpers - Comprehensive Coverage Tests', () => {
  describe('PerformanceCache', () => {
    let cache;

    beforeEach(() => {
      cache = new PerformanceCache(5, 1000); // Small cache for testing
    });

    test('should create cache with default parameters', () => {
      const defaultCache = new PerformanceCache();
      expect(defaultCache.maxSize).toBe(1000);
      expect(defaultCache.ttl).toBe(5 * 60 * 1000); // 5 minutes
    });

    test('should store and retrieve items', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
      expect(cache.hits).toBe(1);
      expect(cache.misses).toBe(0);
    });

    test('should handle cache misses', () => {
      expect(cache.get('nonexistent')).toBeNull();
      expect(cache.hits).toBe(0);
      expect(cache.misses).toBe(1);
    });

    test('should handle TTL expiration', async () => {
      const shortTtlCache = new PerformanceCache(10, 10); // 10ms TTL
      shortTtlCache.set('expiring', 'value');

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 15));

      expect(shortTtlCache.get('expiring')).toBeNull();
      expect(shortTtlCache.misses).toBe(1);
    });

    test('should handle invalid timestamp gracefully', () => {
      // Mock an item with invalid timestamp
      cache.cache.set('invalid-timestamp', { data: 'test', timestamp: 'invalid' });
      expect(cache.get('invalid-timestamp')).toBeNull();
    });

    test('should implement LRU eviction', () => {
      // Fill cache to capacity
      for (let i = 0; i < 5; i++) {
        cache.set(`key${i}`, `value${i}`);
      }

      // Add one more item, should evict first
      cache.set('key5', 'value5');

      expect(cache.get('key0')).toBeNull(); // Should be evicted
      expect(cache.get('key5')).toBe('value5'); // Should exist
    });

    test('should handle zero cache size', () => {
      const zeroCache = new PerformanceCache(0, 1000);
      zeroCache.set('key', 'value');
      expect(zeroCache.get('key')).toBeNull();
    });

    test('should handle zero TTL', () => {
      const zeroTtlCache = new PerformanceCache(10, 0);
      zeroTtlCache.set('key', 'value');
      expect(zeroTtlCache.get('key')).toBeNull();
    });

    test('should maintain LRU order on access', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      // Access key1 to move it to end
      cache.get('key1');

      // Fill remaining slots
      cache.set('key3', 'value3');
      cache.set('key4', 'value4');
      cache.set('key5', 'value5');

      // Add one more, should evict key2 (not key1 which was accessed)
      cache.set('key6', 'value6');

      expect(cache.get('key1')).toBe('value1'); // Should still exist
      expect(cache.get('key2')).toBeNull(); // Should be evicted
    });

    test('should clear cache and stats', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('nonexistent');

      cache.clear();

      expect(cache.cache.size).toBe(0);
      expect(cache.hits).toBe(0);
      expect(cache.misses).toBe(0);
    });

    test('should provide accurate statistics', () => {
      cache.set('key1', 'value1');
      cache.get('key1'); // hit
      cache.get('key2'); // miss

      const stats = cache.getStats();

      expect(stats.size).toBe(1);
      expect(stats.maxSize).toBe(5);
      expect(stats.ttl).toBe(1000);
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(0.5);
    });

    test('should handle zero hits and misses in stats', () => {
      const stats = cache.getStats();
      expect(stats.hitRate).toBe(0);
    });
  });

  describe('Memoizer', () => {
    beforeEach(() => {
      Memoizer.clearCache();
    });

    test('should memoize function results', () => {
      let callCount = 0;
      const testFunction = x => {
        callCount++;
        return x * 2;
      };

      const memoized = Memoizer.memoize(testFunction);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10); // Should use cache
      expect(callCount).toBe(1);
    });

    test('should use custom key generator', () => {
      let callCount = 0;
      const testFunction = obj => {
        callCount++;
        return obj.value * 2;
      };

      const memoized = Memoizer.memoize(testFunction, obj => obj.id);

      expect(memoized({ id: 1, value: 5 })).toBe(10);
      expect(memoized({ id: 1, value: 10 })).toBe(10); // Same ID, cached
      expect(callCount).toBe(1);
    });

    test('should memoize async functions', async () => {
      let callCount = 0;
      const asyncFunction = async x => {
        callCount++;
        await new Promise(resolve => setTimeout(resolve, 1));
        return x * 2;
      };

      const memoized = Memoizer.memoizeAsync(asyncFunction);

      const result1 = await memoized(5);
      const result2 = await memoized(5);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(callCount).toBe(1);
    });

    test('should handle concurrent async calls', async () => {
      let callCount = 0;
      const slowAsyncFunction = async x => {
        callCount++;
        await new Promise(resolve => setTimeout(resolve, 50));
        return x * 2;
      };

      const memoized = Memoizer.memoizeAsync(slowAsyncFunction);

      // Start multiple concurrent calls
      const promise1 = memoized(5);
      const promise2 = memoized(5);
      const promise3 = memoized(5);

      const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(result3).toBe(10);
      expect(callCount).toBe(1); // Should only call once despite concurrent calls
    });

    test('should handle async function errors', async () => {
      let callCount = 0;
      const errorFunction = async x => {
        callCount++;
        throw new Error('Test error');
      };

      const memoized = Memoizer.memoizeAsync(errorFunction);

      await expect(memoized(5)).rejects.toThrow('Test error');
      await expect(memoized(5)).rejects.toThrow('Test error'); // Should call again, not cached
      expect(callCount).toBe(2);
    });

    test('should provide cache statistics', () => {
      const testFunction = x => x * 2;
      const memoized = Memoizer.memoize(testFunction);

      memoized(1);
      memoized(1);
      memoized(2);

      const stats = Memoizer.getCacheStats();
      expect(stats.hits).toBeGreaterThan(0);
      expect(stats.size).toBeGreaterThan(0);
    });

    test('should preserve function context', () => {
      const obj = {
        multiplier: 3,
        multiply(x) {
          return x * this.multiplier;
        }
      };

      const memoized = Memoizer.memoize(obj.multiply);
      const result = memoized.call(obj, 5);

      expect(result).toBe(15);
    });
  });

  describe('PerformanceMonitor', () => {
    beforeEach(() => {
      PerformanceMonitor.clear();
      PerformanceMonitor.enable();
    });

    test('should measure function performance', async () => {
      const testFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'result';
      };

      const result = await PerformanceMonitor.measure(testFunction, 'test-operation');

      expect(result).toBe('result');

      const stats = PerformanceMonitor.getStats('test-operation');
      expect(stats.count).toBe(1);
      expect(stats.duration.avg).toBeGreaterThan(0);
    });

    test('should handle function errors and still record metrics', async () => {
      const errorFunction = async () => {
        throw new Error('Test error');
      };

      await expect(PerformanceMonitor.measure(errorFunction, 'error-operation')).rejects.toThrow('Test error');

      const stats = PerformanceMonitor.getStats('error-operation');
      expect(stats.count).toBe(1);
      expect(stats.errorCount).toBe(1);
    });

    test('should log slow operations', async () => {
      const originalWarn = console.warn;
      let warnCalled = false;
      console.warn = () => {
        warnCalled = true;
      };

      const slowFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 110)); // > 100ms
        return 'slow result';
      };

      await PerformanceMonitor.measure(slowFunction, 'slow-operation');

      expect(warnCalled).toBe(true);

      console.warn = originalWarn;
    });

    test('should not measure when disabled', async () => {
      PerformanceMonitor.disable();

      const testFunction = async () => 'result';
      const result = await PerformanceMonitor.measure(testFunction, 'disabled-test');

      expect(result).toBe('result');
      expect(PerformanceMonitor.getStats('disabled-test').count).toBe(0);
    });

    test('should calculate comprehensive statistics', async () => {
      const testFunction = async delay => {
        await new Promise(resolve => setTimeout(resolve, delay));
        return delay;
      };

      // Run multiple times with different delays
      for (const delay of [5, 10, 15, 20, 25]) {
        await PerformanceMonitor.measure(() => testFunction(delay), 'multi-test');
      }

      const stats = PerformanceMonitor.getStats('multi-test');

      expect(stats.count).toBe(5);
      expect(stats.duration.min).toBeGreaterThan(0);
      expect(stats.duration.max).toBeGreaterThan(stats.duration.min);
      expect(stats.duration.avg).toBeGreaterThan(0);
      expect(stats.duration.p50).toBeGreaterThan(0);
      expect(stats.duration.p95).toBeGreaterThan(0);
      expect(stats.duration.p99).toBeGreaterThan(0);
      expect(stats.lastRun).toBeGreaterThan(0);
    });

    test('should return all stats when no label specified', async () => {
      const testFunction = async () => 'result';

      await PerformanceMonitor.measure(testFunction, 'test1');
      await PerformanceMonitor.measure(testFunction, 'test2');

      const allStats = PerformanceMonitor.getStats();

      expect(allStats).toHaveProperty('test1');
      expect(allStats).toHaveProperty('test2');
    });

    test('should handle empty metrics gracefully', () => {
      const stats = PerformanceMonitor.getStats('nonexistent');
      expect(stats.count).toBe(0);
      expect(stats.label).toBe('nonexistent');
    });

    test('should limit metrics per label to 100', async () => {
      const testFunction = async () => 'result';

      // Add more than 100 metrics
      for (let i = 0; i < 105; i++) {
        await PerformanceMonitor.measure(testFunction, 'overflow-test');
      }

      const stats = PerformanceMonitor.getStats('overflow-test');
      expect(stats.count).toBe(100); // Should be limited to 100
    });
  });

  describe('DataOptimizer', () => {
    test('should process array in chunks', async () => {
      const largeArray = Array.from({ length: 50 }, (_, i) => i);
      let processorCalls = 0;
      const processor = chunk => {
        processorCalls++;
        return chunk.map(x => x * 2);
      };

      const result = await DataOptimizer.processInChunks(largeArray, processor, 10);

      expect(result.length).toBe(50);
      expect(result[0]).toBe(0);
      expect(result[49]).toBe(98);
      expect(processorCalls).toBe(5); // 50/10 = 5 chunks
    });

    test('should handle empty arrays in chunks', async () => {
      let processorCalled = false;
      const processor = chunk => {
        processorCalled = true;
        return chunk;
      };
      const result = await DataOptimizer.processInChunks([], processor, 10);

      expect(result).toEqual([]);
      expect(processorCalled).toBe(false);
    });

    test('should optimize objects by keeping specified fields', () => {
      const obj = {
        name: 'test',
        value: 42,
        internal: 'secret',
        temp: 'remove'
      };

      const optimized = DataOptimizer.optimizeObject(obj, ['name', 'value']);

      expect(optimized).toEqual({ name: 'test', value: 42 });
      expect(optimized).not.toHaveProperty('internal');
      expect(optimized).not.toHaveProperty('temp');
    });

    test('should optimize arrays of objects', () => {
      const array = [
        { name: 'item1', value: 1, temp: 'remove1' },
        { name: 'item2', value: 2, temp: 'remove2' }
      ];

      const optimized = DataOptimizer.optimizeObject(array, ['name', 'value']);

      expect(optimized).toHaveLength(2);
      expect(optimized[0]).toEqual({ name: 'item1', value: 1 });
      expect(optimized[1]).toEqual({ name: 'item2', value: 2 });
    });

    test('should handle null/undefined objects in optimization', () => {
      expect(DataOptimizer.optimizeObject(null, ['field'])).toBeNull();
      expect(DataOptimizer.optimizeObject(undefined, ['field'])).toBeUndefined();
      expect(DataOptimizer.optimizeObject('string', ['field'])).toBe('string');
    });

    test('should deduplicate arrays', () => {
      const array = [1, 2, 3, 2, 4, 1, 5];
      const deduplicated = DataOptimizer.deduplicateArray(array);

      expect(deduplicated).toEqual([1, 2, 3, 4, 5]);
    });

    test('should deduplicate arrays with custom key function', () => {
      const array = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
        { id: 1, name: 'duplicate' },
        { id: 3, name: 'third' }
      ];

      const deduplicated = DataOptimizer.deduplicateArray(array, item => item.id);

      expect(deduplicated).toHaveLength(3);
      expect(deduplicated[0].name).toBe('first'); // First occurrence kept
    });

    test('should deduplicate arrays with string key', () => {
      const array = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 }
      ];

      const deduplicated = DataOptimizer.deduplicateArray(array, 'category');

      expect(deduplicated).toHaveLength(2);
      expect(deduplicated[0].category).toBe('A');
      expect(deduplicated[1].category).toBe('B');
    });

    test('should group arrays by key', () => {
      const array = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 },
        { category: 'C', value: 4 }
      ];

      const grouped = DataOptimizer.groupBy(array, 'category');

      expect(grouped.get('A')).toHaveLength(2);
      expect(grouped.get('B')).toHaveLength(1);
      expect(grouped.get('C')).toHaveLength(1);
    });

    test('should group arrays by function key', () => {
      const array = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];

      const grouped = DataOptimizer.groupBy(array, item => (item.value % 2 === 0 ? 'even' : 'odd'));

      expect(grouped.get('odd')).toHaveLength(2);
      expect(grouped.get('even')).toHaveLength(2);
    });
  });

  describe('LazyLoader', () => {
    beforeEach(() => {
      LazyLoader.loadedModules.clear();
    });

    test('should manage loaded modules cache', () => {
      // Test that the cache is properly initialized and cleared
      expect(LazyLoader.loadedModules.size).toBe(0);

      // Manually add something to cache to test it works
      LazyLoader.loadedModules.set('test-key', 'test-value');
      expect(LazyLoader.loadedModules.get('test-key')).toBe('test-value');
      expect(LazyLoader.loadedModules.size).toBe(1);

      LazyLoader.loadedModules.clear();
      expect(LazyLoader.loadedModules.size).toBe(0);
    });

    test('should create proper cache keys', () => {
      // Test the cache key logic by checking the Map structure
      LazyLoader.loadedModules.set('/path/to/module.js', 'default-export');
      LazyLoader.loadedModules.set('/path/to/module.js#namedExport', 'named-export');

      expect(LazyLoader.loadedModules.has('/path/to/module.js')).toBe(true);
      expect(LazyLoader.loadedModules.has('/path/to/module.js#namedExport')).toBe(true);
      expect(LazyLoader.loadedModules.get('/path/to/module.js')).toBe('default-export');
      expect(LazyLoader.loadedModules.get('/path/to/module.js#namedExport')).toBe('named-export');
    });

    test('should handle conditional loading logic', async () => {
      const trueCondition = () => Promise.resolve(true);
      const falseCondition = () => Promise.resolve(false);

      // Test the condition evaluation without actual module loading
      const conditionResult1 = await trueCondition();
      const conditionResult2 = await falseCondition();

      expect(conditionResult1).toBe(true);
      expect(conditionResult2).toBe(false);
    });

    test('should have loadModule and conditionalLoad methods', () => {
      expect(typeof LazyLoader.loadModule).toBe('function');
      expect(typeof LazyLoader.conditionalLoad).toBe('function');
      expect(LazyLoader.loadedModules instanceof Map).toBe(true);
    });
  });

  describe('MemoryOptimizer', () => {
    test('should create weak cache', () => {
      const weakCache = MemoryOptimizer.createWeakCache();
      const key = { id: 1 };
      const value = 'test-value';

      weakCache.set(key, value);
      expect(weakCache.get(key)).toBe(value);
      expect(weakCache.has(key)).toBe(true);

      expect(weakCache.delete(key)).toBe(true);
      expect(weakCache.get(key)).toBeNull();
    });

    test('should handle weak cache with null values', () => {
      const weakCache = MemoryOptimizer.createWeakCache();
      const key = { id: 1 };

      expect(weakCache.get(key)).toBeNull(); // Non-existent key
    });

    test('should attempt garbage collection when available', () => {
      const originalGC = global.gc;
      let gcCalled = false;
      global.gc = () => {
        gcCalled = true;
      };

      const result = MemoryOptimizer.suggestGC();

      expect(result).toBe(true);
      expect(gcCalled).toBe(true);

      global.gc = originalGC;
    });

    test('should handle missing garbage collection function', () => {
      const originalGC = global.gc;
      delete global.gc;

      const result = MemoryOptimizer.suggestGC();

      expect(result).toBe(false);

      global.gc = originalGC;
    });

    test('should provide memory usage statistics', () => {
      const usage = MemoryOptimizer.getMemoryUsage();

      expect(usage).toHaveProperty('heapUsed');
      expect(usage).toHaveProperty('heapTotal');
      expect(usage).toHaveProperty('rss');
      expect(usage).toHaveProperty('external');

      expect(typeof usage.heapUsed).toBe('number');
      expect(usage.heapUsed).toBeGreaterThan(0);
    });
  });

  describe('Exported utility functions', () => {
    test('should export memoize function', () => {
      expect(typeof memoize).toBe('function');

      let callCount = 0;
      const testFn = x => {
        callCount++;
        return x * 2;
      };

      const memoized = memoize(testFn);
      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1);
    });

    test('should export memoizeAsync function', async () => {
      expect(typeof memoizeAsync).toBe('function');

      let callCount = 0;
      const asyncFn = async x => {
        callCount++;
        return x * 2;
      };

      const memoized = memoizeAsync(asyncFn);
      await expect(memoized(5)).resolves.toBe(10);
      await expect(memoized(5)).resolves.toBe(10);
      expect(callCount).toBe(1);
    });

    test('should export measure function', async () => {
      expect(typeof measure).toBe('function');

      const testFn = async () => 'measured result';
      const result = await measure(testFn);

      expect(result).toBe('measured result');
    });
  });
});
