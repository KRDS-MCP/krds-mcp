/**
 * KRDS Performance Helpers Enhanced Test Coverage
 * Targeting 60%+ coverage for helpers/performance-helpers.js
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  PerformanceCache,
  PerformanceMonitor,
  memoize,
  measure
} from '../../helpers/performance-helpers.js';

describe('Performance Helpers Enhanced Coverage', () => {
  describe('PerformanceCache', () => {
    let cache;

    beforeEach(() => {
      cache = new PerformanceCache(3, 1000);
    });

    test('should create cache with custom parameters', () => {
      const customCache = new PerformanceCache(5, 2000);
      expect(customCache.maxSize).toBe(5);
      expect(customCache.ttl).toBe(2000);
    });

    test('should store and retrieve items', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    test('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    test('should implement LRU eviction', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // This should evict key1

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key4')).toBe('value4');
    });

    test('should handle TTL expiration', async () => {
      const shortTtlCache = new PerformanceCache(10, 50); // 50ms TTL
      shortTtlCache.set('key', 'value');

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(shortTtlCache.get('key')).toBeNull();
    });

    test('should maintain LRU order on access', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      // Access key1 to make it most recently used
      cache.get('key1');

      // Add new item, should evict key2 (least recently used)
      cache.set('key4', 'value4');
      expect(cache.get('key2')).toBeNull();
      expect(cache.get('key1')).toBe('value1');
    });

    test('should handle invalid timestamp gracefully', () => {
      cache.cache.set('invalidKey', { data: 'value', timestamp: 'invalid' });
      expect(cache.get('invalidKey')).toBeNull();
    });

    test('should clear cache', () => {
      cache.set('key1', 'value1');
      cache.clear();
      expect(cache.get('key1')).toBeNull();
      expect(cache.cache.size).toBe(0);
    });

    test('should get cache statistics', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('nonexistent');

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(0.5);
    });
  });

  describe('PerformanceMonitor', () => {
    beforeEach(() => {
      // Clear metrics before each test
      PerformanceMonitor.metrics.clear();
    });

    test('should have static properties', () => {
      expect(typeof PerformanceMonitor.enabled).toBe('boolean');
      expect(PerformanceMonitor.metrics instanceof Map).toBe(true);
    });

    test('should measure function performance', async () => {
      PerformanceMonitor.enabled = true;
      const fn = () => 42;
      const result = await PerformanceMonitor.measure(fn, 'test-function');

      expect(result).toBe(42);

      const stats = PerformanceMonitor.getStats('test-function');
      expect(stats.count).toBe(1);
    });

    test('should handle disabled monitoring', async () => {
      const originalEnabled = PerformanceMonitor.enabled;
      PerformanceMonitor.enabled = false;

      const fn = () => 42;
      const result = await PerformanceMonitor.measure(fn, 'test-function');

      expect(result).toBe(42);
      const stats = PerformanceMonitor.getStats('test-function');
      expect(stats).toEqual(expect.objectContaining({ count: 0 }));

      PerformanceMonitor.enabled = originalEnabled;
    });
  });

  describe('Memoize', () => {
    test('should memoize function results', () => {
      let callCount = 0;
      const fn = x => {
        callCount++;
        return x * 2;
      };

      const memoized = memoize(fn);
      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1);
    });

    test('should handle different arguments', () => {
      let callCount = 0;
      const fn = (x, y) => {
        callCount++;
        return x + y;
      };

      const memoized = memoize(fn);
      expect(memoized(1, 2)).toBe(3);
      expect(memoized(1, 2)).toBe(3);
      expect(callCount).toBe(1);

      expect(memoized(2, 3)).toBe(5);
      expect(callCount).toBe(2);
    });
  });

  describe('Measure function', () => {
    test('should measure function execution time', async () => {
      const fn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };

      const result = await measure(fn, 'test-operation');
      expect(result).toBe(499500);
    });

    test('should measure async function execution time', async () => {
      const fn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'done';
      };

      const result = await measure(fn, 'async-test');
      expect(result).toBe('done');
    });

    test('should be a function', () => {
      expect(typeof measure).toBe('function');
    });
  });

  describe('Integration tests', () => {
    test('should work with all components together', () => {
      const cache = new PerformanceCache(5, 1000);
      const monitor = new PerformanceMonitor();

      expect(cache).toBeInstanceOf(PerformanceCache);
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
      expect(typeof memoize).toBe('function');
      expect(typeof measure).toBe('function');
    });
  });
});
