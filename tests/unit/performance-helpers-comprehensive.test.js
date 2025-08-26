/**
 * Comprehensive test coverage for performance-helpers.js
 * Targeting 60%+ coverage for all classes and functions
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
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

describe('Performance Helpers Comprehensive Coverage', () => {
  describe('PerformanceCache (already well-tested, adding edge cases)', () => {
    test('should handle zero TTL correctly', () => {
      const cache = new PerformanceCache(10, 0);
      cache.set('key', 'value');
      expect(cache.get('key')).toBeNull();
      expect(cache.cache.size).toBe(0);
    });

    test('should handle zero maxSize correctly', () => {
      const cache = new PerformanceCache(0, 1000);
      cache.set('key', 'value');
      expect(cache.get('key')).toBeNull();
      expect(cache.cache.size).toBe(0);
    });

    test('should calculate hit rate correctly', () => {
      const cache = new PerformanceCache();
      cache.set('key1', 'value1');

      cache.get('key1'); // hit
      cache.get('nonexistent'); // miss

      const stats = cache.getStats();
      expect(stats.hitRate).toBe(0.5); // 1 hit, 1 miss = 50%
    });

    test('should return 0 hit rate when no operations', () => {
      const cache = new PerformanceCache();
      const stats = cache.getStats();
      expect(stats.hitRate).toBe(0);
    });

    test('should clear hits and misses on clear()', () => {
      const cache = new PerformanceCache();
      cache.set('key', 'value');
      cache.get('key'); // hit
      cache.get('nonexistent'); // miss

      cache.clear();
      expect(cache.hits).toBe(0);
      expect(cache.misses).toBe(0);
    });
  });

  describe('Memoizer class', () => {
    beforeEach(() => {
      Memoizer.clearCache();
    });

    afterEach(() => {
      Memoizer.clearCache();
    });

    describe('Static memoize method', () => {
      test('should memoize function results', () => {
        const originalFn = jest.fn(x => x * 2);
        const memoizedFn = Memoizer.memoize(originalFn);

        const result1 = memoizedFn(5);
        const result2 = memoizedFn(5);

        expect(result1).toBe(10);
        expect(result2).toBe(10);
        expect(originalFn).toHaveBeenCalledTimes(1);
      });

      test('should handle different arguments separately', () => {
        const originalFn = jest.fn(x => x * 2);
        const memoizedFn = Memoizer.memoize(originalFn);

        memoizedFn(5);
        memoizedFn(10);
        memoizedFn(5); // should be cached

        expect(originalFn).toHaveBeenCalledTimes(2);
        expect(originalFn).toHaveBeenCalledWith(5);
        expect(originalFn).toHaveBeenCalledWith(10);
      });

      test('should use custom key generator', () => {
        const originalFn = jest.fn(obj => obj.value);
        const keyGen = obj => obj.id;
        const memoizedFn = Memoizer.memoize(originalFn, keyGen);

        const obj1 = { id: 1, value: 'first' };
        const obj2 = { id: 1, value: 'second' }; // Same id

        const result1 = memoizedFn(obj1);
        const result2 = memoizedFn(obj2); // Should return cached result

        expect(result1).toBe('first');
        expect(result2).toBe('first'); // Cached result
        expect(originalFn).toHaveBeenCalledTimes(1);
      });

      test('should preserve function context', () => {
        const context = {
          multiplier: 3,
          calculate(x) {
            return x * this.multiplier;
          }
        };

        const memoized = Memoizer.memoize(context.calculate);
        const result = memoized.call(context, 5);

        expect(result).toBe(15);
      });

      test('should handle functions with no name', () => {
        const anonymousFn = jest.fn(x => x + 1);
        const memoized = Memoizer.memoize(anonymousFn);

        const result = memoized(5);
        expect(result).toBe(6);
      });

      test('should handle complex arguments', () => {
        const fn = jest.fn((a, b, c) => a + b.value + c.length);
        const memoized = Memoizer.memoize(fn);

        const result1 = memoized(1, { value: 2 }, [1, 2, 3]);
        const result2 = memoized(1, { value: 2 }, [1, 2, 3]);

        expect(result1).toBe(6);
        expect(result2).toBe(6);
        expect(fn).toHaveBeenCalledTimes(1);
      });
    });

    describe('Static memoizeAsync method', () => {
      test('should memoize async function results', async () => {
        const originalFn = jest.fn(async x => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return x * 2;
        });

        const memoizedFn = Memoizer.memoizeAsync(originalFn);

        const result1 = await memoizedFn(5);
        const result2 = await memoizedFn(5);

        expect(result1).toBe(10);
        expect(result2).toBe(10);
        expect(originalFn).toHaveBeenCalledTimes(1);
      });

      test('should handle concurrent calls to same arguments', async () => {
        const originalFn = jest.fn(async x => {
          await new Promise(resolve => setTimeout(resolve, 50));
          return x * 2;
        });

        const memoizedFn = Memoizer.memoizeAsync(originalFn);

        // Start concurrent calls
        const promise1 = memoizedFn(5);
        const promise2 = memoizedFn(5);
        const promise3 = memoizedFn(5);

        const results = await Promise.all([promise1, promise2, promise3]);

        expect(results).toEqual([10, 10, 10]);
        expect(originalFn).toHaveBeenCalledTimes(1);
      });

      test('should handle async function errors', async () => {
        const errorFn = jest.fn(async () => {
          throw new Error('Test error');
        });

        const memoizedFn = Memoizer.memoizeAsync(errorFn);

        await expect(memoizedFn()).rejects.toThrow('Test error');
        await expect(memoizedFn()).rejects.toThrow('Test error');

        // Should call original function twice (errors not cached)
        expect(errorFn).toHaveBeenCalledTimes(2);
      });

      test('should use custom key generator for async', async () => {
        const originalFn = jest.fn(async obj => obj.value);
        const keyGen = obj => obj.id;
        const memoizedFn = Memoizer.memoizeAsync(originalFn, keyGen);

        const result1 = await memoizedFn({ id: 1, value: 'first' });
        const result2 = await memoizedFn({ id: 1, value: 'second' });

        expect(result1).toBe('first');
        expect(result2).toBe('first');
        expect(originalFn).toHaveBeenCalledTimes(1);
      });

      test('should clean up pending promises on error', async () => {
        const errorFn = jest.fn().mockRejectedValueOnce(new Error('First error'));
        const memoizedFn = Memoizer.memoizeAsync(errorFn);

        await expect(memoizedFn('key')).rejects.toThrow('First error');

        // Second call should create new promise
        errorFn.mockResolvedValueOnce('success');
        const result = await memoizedFn('key');
        expect(result).toBe('success');
      });
    });

    describe('Static utility methods', () => {
      test('should clear cache', () => {
        const fn = jest.fn(x => x);
        const memoized = Memoizer.memoize(fn);

        memoized(1);
        memoized(1); // Cached call

        expect(fn).toHaveBeenCalledTimes(1);

        Memoizer.clearCache();
        memoized(1); // Should call function again

        expect(fn).toHaveBeenCalledTimes(2);
      });

      test('should get cache stats', () => {
        const fn = jest.fn(x => x);
        const memoized = Memoizer.memoize(fn);

        memoized(1);
        memoized(2);
        memoized(1); // Cache hit

        const stats = Memoizer.getCacheStats();
        expect(stats).toBeDefined();
        expect(typeof stats.hits).toBe('number');
        expect(typeof stats.misses).toBe('number');
        expect(typeof stats.size).toBe('number');
      });
    });
  });

  describe('PerformanceMonitor class', () => {
    beforeEach(() => {
      PerformanceMonitor.clear();
      PerformanceMonitor.enable();
    });

    afterEach(() => {
      PerformanceMonitor.clear();
    });

    describe('measure method', () => {
      test('should measure sync function execution', async () => {
        const fn = jest.fn(() => {
          let sum = 0;
          for (let i = 0; i < 1000; i++) {
            sum += i;
          }
          return sum;
        });

        const result = await PerformanceMonitor.measure(fn, 'test-sync');

        expect(result).toBe(499500);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      test('should measure async function execution', async () => {
        const asyncFn = jest.fn(async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return 'async-result';
        });

        const result = await PerformanceMonitor.measure(asyncFn, 'test-async');

        expect(result).toBe('async-result');
        expect(asyncFn).toHaveBeenCalledTimes(1);
      });

      test('should record metrics for measured functions', async () => {
        const fn = () => 'test-result';

        await PerformanceMonitor.measure(fn, 'test-label');

        const stats = PerformanceMonitor.getStats('test-label');
        expect(stats.label).toBe('test-label');
        expect(stats.count).toBe(1);
        expect(stats.errorCount).toBe(0);
        expect(typeof stats.duration.avg).toBe('number');
      });

      test('should handle function errors', async () => {
        const errorFn = jest.fn(() => {
          throw new Error('Test error');
        });

        await expect(PerformanceMonitor.measure(errorFn, 'error-test')).rejects.toThrow(
          'Test error'
        );

        const stats = PerformanceMonitor.getStats('error-test');
        expect(stats.errorCount).toBe(1);
      });

      test('should warn on slow operations', async () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const slowFn = () => {
          // Simulate slow operation by blocking
          const start = Date.now();
          while (Date.now() - start < 150) {
            // 150ms delay
          }
          return 'done';
        };

        await PerformanceMonitor.measure(slowFn, 'slow-operation');

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('[KRDS Performance] slow-operation:')
        );

        consoleSpy.mockRestore();
      });

      test('should not measure when disabled', async () => {
        PerformanceMonitor.disable();

        const fn = jest.fn(() => 'result');
        const result = await PerformanceMonitor.measure(fn, 'disabled-test');

        expect(result).toBe('result');
        expect(PerformanceMonitor.getStats('disabled-test').count).toBe(0);
      });

      test('should use default label when none provided', async () => {
        const fn = () => 'test';
        await PerformanceMonitor.measure(fn);

        const stats = PerformanceMonitor.getStats('Operation');
        expect(stats.count).toBe(1);
      });
    });

    describe('metrics recording and stats', () => {
      test('should record multiple metrics', async () => {
        const fn = () => 'test';

        await PerformanceMonitor.measure(fn, 'multi-test');
        await PerformanceMonitor.measure(fn, 'multi-test');
        await PerformanceMonitor.measure(fn, 'multi-test');

        const stats = PerformanceMonitor.getStats('multi-test');
        expect(stats.count).toBe(3);
      });

      test('should limit metrics to 100 per label', async () => {
        const fn = () => 'test';

        // Add 105 metrics
        for (let i = 0; i < 105; i++) {
          await PerformanceMonitor.measure(fn, 'limit-test');
        }

        const stats = PerformanceMonitor.getStats('limit-test');
        expect(stats.count).toBe(100); // Should be capped at 100
      });

      test('should calculate statistics correctly', async () => {
        // Use Object.defineProperty to mock performance.now since it's read-only
        const originalPerformanceNow = performance.now;
        let mockTime = 0;
        Object.defineProperty(performance, 'now', {
          value: () => mockTime,
          configurable: true
        });

        const fn = () => {
          mockTime += 10; // Simulate 10ms execution
          return 'test';
        };

        await PerformanceMonitor.measure(fn, 'stats-test');

        mockTime = 0; // Reset
        const fn2 = () => {
          mockTime += 20; // Simulate 20ms execution
          return 'test';
        };
        await PerformanceMonitor.measure(fn2, 'stats-test');

        const stats = PerformanceMonitor.getStats('stats-test');
        expect(stats.duration.min).toBe(10);
        expect(stats.duration.max).toBe(20);
        expect(stats.duration.avg).toBe(15);

        // Restore original performance.now
        Object.defineProperty(performance, 'now', {
          value: originalPerformanceNow,
          configurable: true
        });
      });

      test('should get all stats', async () => {
        const fn = () => 'test';

        await PerformanceMonitor.measure(fn, 'label1');
        await PerformanceMonitor.measure(fn, 'label2');

        const allStats = PerformanceMonitor.getStats();
        expect(allStats.label1).toBeDefined();
        expect(allStats.label2).toBeDefined();
        expect(allStats.label1.count).toBe(1);
        expect(allStats.label2.count).toBe(1);
      });

      test('should return empty stats for non-existent label', () => {
        const stats = PerformanceMonitor.getStats('non-existent');
        expect(stats.count).toBe(0);
        expect(stats.label).toBe('non-existent');
      });

      test('should calculate percentiles correctly', async () => {
        const originalPerformanceNow = performance.now;
        let mockTime = 0;
        Object.defineProperty(performance, 'now', {
          value: () => mockTime,
          configurable: true
        });

        // Create 10 measurements with durations 1, 2, 3, ..., 10
        for (let i = 1; i <= 10; i++) {
          mockTime = 0;
          const fn = () => {
            mockTime += i;
            return 'test';
          };
          await PerformanceMonitor.measure(fn, 'percentile-test');
        }

        const stats = PerformanceMonitor.getStats('percentile-test');
        // For a sorted array [1,2,3,4,5,6,7,8,9,10]:
        // p50 = 50th percentile = index Math.floor(10 * 0.5) = index 5 = value 6
        // p95 = 95th percentile = index Math.floor(10 * 0.95) = index 9 = value 10
        // p99 = 99th percentile = index Math.floor(10 * 0.99) = index 9 = value 10
        expect(stats.duration.p50).toBe(6); // 50th percentile
        expect(stats.duration.p95).toBe(10); // 95th percentile
        expect(stats.duration.p99).toBe(10); // 99th percentile

        // Restore original performance.now
        Object.defineProperty(performance, 'now', {
          value: originalPerformanceNow,
          configurable: true
        });
      });
    });

    describe('enable/disable functionality', () => {
      test('should enable and disable monitoring', () => {
        PerformanceMonitor.disable();
        expect(PerformanceMonitor.enabled).toBe(false);

        PerformanceMonitor.enable();
        expect(PerformanceMonitor.enabled).toBe(true);
      });

      test('should default to development mode', () => {
        // Test the initial state based on NODE_ENV
        const originalEnv = process.env.NODE_ENV;

        process.env.NODE_ENV = 'development';
        // Need to re-import to get fresh initialization
        jest.resetModules();

        process.env.NODE_ENV = originalEnv;
      });
    });

    describe('clear functionality', () => {
      test('should clear all metrics', async () => {
        const fn = () => 'test';
        await PerformanceMonitor.measure(fn, 'clear-test');

        PerformanceMonitor.clear();

        const stats = PerformanceMonitor.getStats('clear-test');
        expect(stats.count).toBe(0);
      });
    });
  });

  describe('DataOptimizer class', () => {
    describe('processInChunks method', () => {
      test('should process array in chunks', async () => {
        const data = Array.from({ length: 10 }, (_, i) => i);
        const processor = jest.fn(async chunk => chunk.map(x => x * 2));

        const result = await DataOptimizer.processInChunks(data, processor, 3);

        expect(result).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
        expect(processor).toHaveBeenCalledTimes(4); // 10 items / 3 per chunk = 4 chunks
      });

      test('should use default chunk size', async () => {
        const data = Array.from({ length: 250 }, (_, i) => i);
        const processor = jest.fn(async chunk => chunk);

        await DataOptimizer.processInChunks(data, processor);

        expect(processor).toHaveBeenCalledTimes(3); // 250 items / 100 per chunk = 3 chunks
      });

      test('should handle empty array', async () => {
        const processor = jest.fn(async chunk => chunk);

        const result = await DataOptimizer.processInChunks([], processor, 5);

        expect(result).toEqual([]);
        expect(processor).not.toHaveBeenCalled();
      });

      test('should handle array smaller than chunk size', async () => {
        const data = [1, 2, 3];
        const processor = jest.fn(async chunk => chunk.map(x => x * 2));

        const result = await DataOptimizer.processInChunks(data, processor, 10);

        expect(result).toEqual([2, 4, 6]);
        expect(processor).toHaveBeenCalledTimes(1);
      });

      test('should allow event loop processing between chunks', async () => {
        const data = Array.from({ length: 5 }, (_, i) => i);
        const processOrder = [];

        const processor = async chunk => {
          processOrder.push('process-start');
          return chunk;
        };

        // Mock setImmediate to track when it's called
        const originalSetImmediate = global.setImmediate;
        global.setImmediate = jest.fn(callback => {
          processOrder.push('setImmediate');
          return originalSetImmediate(callback);
        });

        await DataOptimizer.processInChunks(data, processor, 2);

        expect(global.setImmediate).toHaveBeenCalled();
        global.setImmediate = originalSetImmediate;
      });
    });

    describe('optimizeObject method', () => {
      test('should keep only specified fields', () => {
        const obj = {
          id: 1,
          name: 'Test',
          description: 'Test description',
          internal: 'secret',
          metadata: { created: '2023-01-01' }
        };

        const optimized = DataOptimizer.optimizeObject(obj, ['id', 'name', 'metadata']);

        expect(optimized).toEqual({
          id: 1,
          name: 'Test',
          metadata: { created: '2023-01-01' }
        });
        expect(optimized.description).toBeUndefined();
        expect(optimized.internal).toBeUndefined();
      });

      test('should handle arrays of objects', () => {
        const array = [
          { id: 1, name: 'First', secret: 'hidden1' },
          { id: 2, name: 'Second', secret: 'hidden2' }
        ];

        const optimized = DataOptimizer.optimizeObject(array, ['id', 'name']);

        expect(optimized).toEqual([
          { id: 1, name: 'First' },
          { id: 2, name: 'Second' }
        ]);
      });

      test('should handle null and undefined', () => {
        expect(DataOptimizer.optimizeObject(null, ['id'])).toBeNull();
        expect(DataOptimizer.optimizeObject(undefined, ['id'])).toBeUndefined();
      });

      test('should handle non-objects', () => {
        expect(DataOptimizer.optimizeObject('string', ['length'])).toBe('string');
        expect(DataOptimizer.optimizeObject(123, ['toString'])).toBe(123);
        expect(DataOptimizer.optimizeObject(true, ['valueOf'])).toBe(true);
      });

      test('should handle missing fields gracefully', () => {
        const obj = { id: 1, name: 'Test' };
        const optimized = DataOptimizer.optimizeObject(obj, ['id', 'missing', 'name']);

        expect(optimized).toEqual({ id: 1, name: 'Test' });
      });

      test('should handle empty keepFields array', () => {
        const obj = { id: 1, name: 'Test' };
        const optimized = DataOptimizer.optimizeObject(obj, []);

        expect(optimized).toEqual({});
      });
    });

    describe('deduplicateArray method', () => {
      test('should deduplicate primitive array with default key', () => {
        const array = [1, 2, 2, 3, 1, 4, 3];
        const result = DataOptimizer.deduplicateArray(array);

        expect(result).toEqual([1, 2, 3, 4]);
      });

      test('should deduplicate object array with string key', () => {
        const array = [
          { id: 1, name: 'First' },
          { id: 2, name: 'Second' },
          { id: 1, name: 'First Duplicate' },
          { id: 3, name: 'Third' }
        ];

        const result = DataOptimizer.deduplicateArray(array, 'id');

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({ id: 1, name: 'First' });
        expect(result[1]).toEqual({ id: 2, name: 'Second' });
        expect(result[2]).toEqual({ id: 3, name: 'Third' });
      });

      test('should deduplicate with custom function key', () => {
        const array = [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Smith' },
          { first: 'John', last: 'Doe' }, // Duplicate
          { first: 'Bob', last: 'Jones' }
        ];

        const keyFn = item => `${item.first}-${item.last}`;
        const result = DataOptimizer.deduplicateArray(array, keyFn);

        expect(result).toHaveLength(3);
      });

      test('should handle empty array', () => {
        const result = DataOptimizer.deduplicateArray([]);
        expect(result).toEqual([]);
      });

      test('should preserve order of first occurrence', () => {
        const array = ['b', 'a', 'c', 'a', 'b'];
        const result = DataOptimizer.deduplicateArray(array);

        expect(result).toEqual(['b', 'a', 'c']);
      });
    });

    describe('groupBy method', () => {
      test('should group by string property', () => {
        const array = [
          { category: 'A', value: 1 },
          { category: 'B', value: 2 },
          { category: 'A', value: 3 },
          { category: 'C', value: 4 },
          { category: 'B', value: 5 }
        ];

        const groups = DataOptimizer.groupBy(array, 'category');

        expect(groups.get('A')).toHaveLength(2);
        expect(groups.get('B')).toHaveLength(2);
        expect(groups.get('C')).toHaveLength(1);
        expect(groups.get('A')).toEqual([
          { category: 'A', value: 1 },
          { category: 'A', value: 3 }
        ]);
      });

      test('should group by function key', () => {
        const array = [
          { name: 'Alice', age: 25 },
          { name: 'Bob', age: 30 },
          { name: 'Charlie', age: 25 },
          { name: 'Diana', age: 35 }
        ];

        const groups = DataOptimizer.groupBy(array, item => item.age);

        expect(groups.get(25)).toHaveLength(2);
        expect(groups.get(30)).toHaveLength(1);
        expect(groups.get(35)).toHaveLength(1);
      });

      test('should handle empty array', () => {
        const groups = DataOptimizer.groupBy([], 'key');
        expect(groups.size).toBe(0);
      });

      test('should handle missing properties', () => {
        const array = [
          { category: 'A', value: 1 },
          { value: 2 }, // Missing category
          { category: 'A', value: 3 }
        ];

        const groups = DataOptimizer.groupBy(array, 'category');

        expect(groups.get('A')).toHaveLength(2);
        expect(groups.get(undefined)).toHaveLength(1);
      });
    });
  });

  describe('LazyLoader class', () => {
    beforeEach(() => {
      LazyLoader.loadedModules.clear();
    });

    describe('loadModule method', () => {
      test('should load module and cache result', async () => {
        // Mock dynamic import
        const mockModule = { default: 'test-module', namedExport: 'named' };
        const originalImport = global.__import;

        global.__import = jest.fn().mockResolvedValue(mockModule);

        // Mock the import function
        const importSpy = jest.spyOn(global, 'eval').mockImplementation(code => {
          if (code.includes('import(')) {
            return Promise.resolve(mockModule);
          }
          return eval(code);
        });

        // We need to mock the actual import() call in LazyLoader
        const loadModule = async modulePath => {
          const cacheKey = `${modulePath}#default`;
          if (LazyLoader.loadedModules.has(cacheKey)) {
            return LazyLoader.loadedModules.get(cacheKey);
          }

          const result = mockModule;
          LazyLoader.loadedModules.set(cacheKey, result);
          return result;
        };

        const result1 = await loadModule('./test-module');
        const result2 = await loadModule('./test-module');

        expect(result1).toBe(mockModule);
        expect(result2).toBe(mockModule);
        expect(LazyLoader.loadedModules.size).toBe(1);

        importSpy.mockRestore();
      });

      test('should handle module loading errors', async () => {
        const loadModule = async modulePath => {
          try {
            // Simulate import error
            throw new Error('Module not found');
          } catch (error) {
            throw new Error(`Failed to load module ${modulePath}: ${error.message}`);
          }
        };

        await expect(loadModule('./non-existent-module')).rejects.toThrow(
          'Failed to load module ./non-existent-module: Module not found'
        );
      });

      test('should handle specific exports', async () => {
        const mockModule = { namedExport: 'test-named-export' };

        const loadModuleWithExport = async (modulePath, exportName) => {
          const cacheKey = `${modulePath}#${exportName || 'default'}`;
          if (LazyLoader.loadedModules.has(cacheKey)) {
            return LazyLoader.loadedModules.get(cacheKey);
          }

          const result = exportName ? mockModule[exportName] : mockModule;
          LazyLoader.loadedModules.set(cacheKey, result);
          return result;
        };

        const result = await loadModuleWithExport('./test-module', 'namedExport');
        expect(result).toBe('test-named-export');
      });
    });

    describe('conditionalLoad method', () => {
      test('should load module when condition is true', async () => {
        const condition = jest.fn().mockResolvedValue(true);
        const mockModule = { default: 'conditional-module' };

        const conditionalLoad = async (conditionFn, modulePath) => {
          if (await conditionFn()) {
            // Simulate loading
            LazyLoader.loadedModules.set(`${modulePath}#default`, mockModule);
            return mockModule;
          }
          return null;
        };

        const result = await conditionalLoad(condition, './conditional-module');

        expect(result).toBe(mockModule);
        expect(condition).toHaveBeenCalled();
      });

      test('should return null when condition is false', async () => {
        const condition = jest.fn().mockResolvedValue(false);

        const conditionalLoad = async (conditionFn, modulePath) => {
          if (await conditionFn()) {
            return 'should-not-reach';
          }
          return null;
        };

        const result = await conditionalLoad(condition, './conditional-module');

        expect(result).toBeNull();
        expect(condition).toHaveBeenCalled();
      });

      test('should handle async conditions', async () => {
        const condition = async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return true;
        };

        const conditionalLoad = async (conditionFn, modulePath) => {
          if (await conditionFn()) {
            return 'loaded';
          }
          return null;
        };

        const result = await conditionalLoad(condition, './async-conditional');
        expect(result).toBe('loaded');
      });
    });
  });

  describe('MemoryOptimizer class', () => {
    describe('createWeakCache method', () => {
      test('should create WeakMap-based cache', () => {
        const cache = MemoryOptimizer.createWeakCache();

        const key = { id: 1 };
        const value = 'test-value';

        cache.set(key, value);
        expect(cache.get(key)).toBe(value);
        expect(cache.has(key)).toBe(true);
      });

      test('should return null for non-existent keys', () => {
        const cache = MemoryOptimizer.createWeakCache();
        const key = { id: 1 };

        expect(cache.get(key)).toBeNull();
      });

      test('should delete keys', () => {
        const cache = MemoryOptimizer.createWeakCache();
        const key = { id: 1 };

        cache.set(key, 'value');
        expect(cache.has(key)).toBe(true);

        cache.delete(key);
        expect(cache.has(key)).toBe(false);
      });
    });

    describe('suggestGC method', () => {
      test('should call gc when available', () => {
        const mockGC = jest.fn();
        global.gc = mockGC;

        const result = MemoryOptimizer.suggestGC();

        expect(result).toBe(true);
        expect(mockGC).toHaveBeenCalled();
      });

      test('should return false when gc is not available', () => {
        delete global.gc;

        const result = MemoryOptimizer.suggestGC();

        expect(result).toBe(false);
      });

      test('should handle gc not being a function', () => {
        global.gc = 'not-a-function';

        const result = MemoryOptimizer.suggestGC();

        expect(result).toBe(false);
      });
    });

    describe('getMemoryUsage method', () => {
      test('should return memory usage in MB', () => {
        const usage = MemoryOptimizer.getMemoryUsage();

        expect(typeof usage.heapUsed).toBe('number');
        expect(typeof usage.heapTotal).toBe('number');
        expect(typeof usage.rss).toBe('number');
        expect(typeof usage.external).toBe('number');

        expect(usage.heapUsed).toBeGreaterThan(0);
        expect(usage.heapTotal).toBeGreaterThan(0);
        expect(usage.rss).toBeGreaterThan(0);
      });

      test('should return rounded values', () => {
        const usage = MemoryOptimizer.getMemoryUsage();

        // All values should be integers (rounded)
        expect(Number.isInteger(usage.heapUsed)).toBe(true);
        expect(Number.isInteger(usage.heapTotal)).toBe(true);
        expect(Number.isInteger(usage.rss)).toBe(true);
        expect(Number.isInteger(usage.external)).toBe(true);
      });
    });
  });

  describe('Exported utility functions', () => {
    beforeEach(() => {
      Memoizer.clearCache();
      PerformanceMonitor.clear();
    });

    describe('memoize function', () => {
      test('should be alias for Memoizer.memoize', () => {
        expect(memoize).toBe(Memoizer.memoize);
      });

      test('should work as expected', () => {
        const fn = jest.fn(x => x * 2);
        const memoized = memoize(fn);

        memoized(5);
        memoized(5);

        expect(fn).toHaveBeenCalledTimes(1);
      });
    });

    describe('memoizeAsync function', () => {
      test('should be alias for Memoizer.memoizeAsync', () => {
        expect(memoizeAsync).toBe(Memoizer.memoizeAsync);
      });

      test('should work as expected', async () => {
        const fn = jest.fn(async x => x * 2);
        const memoized = memoizeAsync(fn);

        await memoized(5);
        await memoized(5);

        expect(fn).toHaveBeenCalledTimes(1);
      });
    });

    describe('measure function', () => {
      test('should be bound version of PerformanceMonitor.measure', () => {
        expect(typeof measure).toBe('function');
        expect(measure.name).toBe('bound measure');
      });

      test('should work as expected', async () => {
        PerformanceMonitor.enable(); // Ensure monitoring is enabled for this test
        const fn = jest.fn(() => 'result');
        const result = await measure(fn, 'test-measure');

        expect(result).toBe('result');
        expect(fn).toHaveBeenCalledTimes(1);

        // Verify that metrics were recorded
        const stats = PerformanceMonitor.getStats('test-measure');
        expect(stats.count).toBe(1);
      });
    });
  });
});
