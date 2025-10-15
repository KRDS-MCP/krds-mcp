// Unit tests for performance helpers (performance-helpers.js)

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { PerformanceCache } from '../../helpers/performance-helpers.js';

describe('Performance Helpers', () => {
  describe('PerformanceCache', () => {
    let cache;
    let originalDateNow;

    beforeEach(() => {
      // Mock Date.now for consistent testing
      originalDateNow = Date.now;
      let mockTime = 1000000; // Start at a fixed time
      Date.now = jest.fn(() => mockTime);

      // Helper to advance time
      global.advanceTime = ms => {
        mockTime += ms;
      };

      cache = new PerformanceCache();
    });

    afterEach(() => {
      Date.now = originalDateNow;
      delete global.advanceTime;
    });

    describe('Constructor and initialization', () => {
      test('should create cache with default parameters', () => {
        const defaultCache = new PerformanceCache();

        expect(defaultCache.maxSize).toBe(1000);
        expect(defaultCache.ttl).toBe(5 * 60 * 1000); // 5 minutes
        expect(defaultCache.hits).toBe(0);
        expect(defaultCache.misses).toBe(0);
        expect(defaultCache.cache).toBeInstanceOf(Map);
      });

      test('should create cache with custom parameters', () => {
        const customCache = new PerformanceCache(500, 10000);

        expect(customCache.maxSize).toBe(500);
        expect(customCache.ttl).toBe(10000);
        expect(customCache.hits).toBe(0);
        expect(customCache.misses).toBe(0);
      });

      test('should initialize empty cache', () => {
        expect(cache.cache.size).toBe(0);
      });
    });

    describe('Basic cache operations', () => {
      test('should store and retrieve data', () => {
        const key = 'test-key';
        const data = { value: 'test-data' };

        cache.set(key, data);
        const result = cache.get(key);

        expect(result).toEqual(data);
        expect(cache.hits).toBe(1);
        expect(cache.misses).toBe(0);
      });

      test('should return null for non-existent keys', () => {
        const result = cache.get('non-existent');

        expect(result).toBeNull();
        expect(cache.hits).toBe(0);
        expect(cache.misses).toBe(1);
      });

      test('should handle multiple keys', () => {
        const testData = [
          { key: 'key1', data: 'data1' },
          { key: 'key2', data: { complex: 'object' } },
          { key: 'key3', data: [1, 2, 3] }
        ];

        // Store all data
        testData.forEach(({ key, data }) => {
          cache.set(key, data);
        });

        // Retrieve and verify all data
        testData.forEach(({ key, data }) => {
          expect(cache.get(key)).toEqual(data);
        });

        expect(cache.hits).toBe(3);
        expect(cache.misses).toBe(0);
      });

      test('should overwrite existing keys', () => {
        const key = 'test-key';
        const originalData = 'original';
        const newData = 'updated';

        cache.set(key, originalData);
        cache.set(key, newData);

        const result = cache.get(key);
        expect(result).toBe(newData);
      });
    });

    describe('TTL (Time To Live) functionality', () => {
      test('should return data within TTL', () => {
        const key = 'ttl-test';
        const data = 'test-data';

        cache.set(key, data);

        // Advance time but stay within TTL (5 minutes default)
        global.advanceTime(4 * 60 * 1000); // 4 minutes

        const result = cache.get(key);
        expect(result).toBe(data);
        expect(cache.hits).toBe(1);
      });

      test('should expire data after TTL', () => {
        const key = 'ttl-test';
        const data = 'test-data';

        cache.set(key, data);

        // Advance time beyond TTL
        global.advanceTime(6 * 60 * 1000); // 6 minutes (beyond 5 minute TTL)

        const result = cache.get(key);
        expect(result).toBeNull();
        expect(cache.misses).toBe(1);
        expect(cache.cache.has(key)).toBe(false); // Should be deleted
      });

      test('should handle custom TTL', () => {
        const shortTTLCache = new PerformanceCache(1000, 1000); // 1 second TTL
        const key = 'short-ttl';
        const data = 'expires-quickly';

        shortTTLCache.set(key, data);

        // Within TTL
        expect(shortTTLCache.get(key)).toBe(data);

        // Beyond TTL
        global.advanceTime(1500); // 1.5 seconds
        expect(shortTTLCache.get(key)).toBeNull();
      });

      test('should update timestamp on each set', () => {
        const key = 'timestamp-test';

        cache.set(key, 'data1');
        global.advanceTime(2 * 60 * 1000); // 2 minutes
        cache.set(key, 'data2'); // Reset timestamp
        global.advanceTime(4 * 60 * 1000); // 4 more minutes (6 total, but 4 since last set)

        // Should still be valid because timestamp was reset
        expect(cache.get(key)).toBe('data2');
      });
    });

    describe('LRU (Least Recently Used) eviction', () => {
      test('should evict oldest item when cache is full', () => {
        const smallCache = new PerformanceCache(2); // Size limit of 2

        smallCache.set('key1', 'data1');
        smallCache.set('key2', 'data2');
        smallCache.set('key3', 'data3'); // Should evict key1

        expect(smallCache.get('key1')).toBeNull(); // Evicted
        expect(smallCache.get('key2')).toBe('data2'); // Still there
        expect(smallCache.get('key3')).toBe('data3'); // Newest
        expect(smallCache.cache.size).toBe(2);
      });

      test('should maintain LRU order correctly', () => {
        const smallCache = new PerformanceCache(3);

        // Fill cache
        smallCache.set('a', 'data-a');
        smallCache.set('b', 'data-b');
        smallCache.set('c', 'data-c');

        // Access 'a' to make it recently used
        smallCache.get('a');

        // Add new item, should evict 'b' (oldest unused)
        smallCache.set('d', 'data-d');

        expect(smallCache.get('a')).toBe('data-a'); // Still there (recently accessed)
        expect(smallCache.get('b')).toBeNull(); // Evicted
        expect(smallCache.get('c')).toBe('data-c'); // Still there
        expect(smallCache.get('d')).toBe('data-d'); // Newest
      });

      test('should handle repeated evictions', () => {
        const tinyCache = new PerformanceCache(1); // Size limit of 1

        tinyCache.set('key1', 'data1');
        expect(tinyCache.cache.size).toBe(1);

        tinyCache.set('key2', 'data2'); // Evicts key1
        expect(tinyCache.cache.size).toBe(1);
        expect(tinyCache.get('key1')).toBeNull();
        expect(tinyCache.get('key2')).toBe('data2');

        tinyCache.set('key3', 'data3'); // Evicts key2
        expect(tinyCache.cache.size).toBe(1);
        expect(tinyCache.get('key2')).toBeNull();
        expect(tinyCache.get('key3')).toBe('data3');
      });
    });

    describe('Statistics tracking', () => {
      test('should track hits correctly', () => {
        cache.set('key1', 'data1');
        cache.set('key2', 'data2');

        cache.get('key1'); // Hit
        cache.get('key2'); // Hit
        cache.get('key1'); // Hit again

        expect(cache.hits).toBe(3);
        expect(cache.misses).toBe(0);
      });

      test('should track misses correctly', () => {
        cache.get('nonexistent1'); // Miss
        cache.get('nonexistent2'); // Miss

        expect(cache.hits).toBe(0);
        expect(cache.misses).toBe(2);
      });

      test('should track expired items as misses', () => {
        cache.set('expiring-key', 'data');

        global.advanceTime(6 * 60 * 1000); // Beyond TTL
        cache.get('expiring-key'); // Should be a miss

        expect(cache.hits).toBe(0);
        expect(cache.misses).toBe(1);
      });

      test('should maintain separate hit/miss counts', () => {
        cache.set('key1', 'data1');

        cache.get('key1'); // Hit
        cache.get('nonexistent'); // Miss
        cache.get('key1'); // Hit
        cache.get('another-miss'); // Miss

        expect(cache.hits).toBe(2);
        expect(cache.misses).toBe(2);
      });
    });

    describe('Cache clearing and management', () => {
      test('should clear all cache data', () => {
        cache.set('key1', 'data1');
        cache.set('key2', 'data2');
        cache.get('key1'); // Generate some stats

        expect(cache.cache.size).toBe(2);
        expect(cache.hits).toBe(1);

        cache.clear();

        expect(cache.cache.size).toBe(0);
        // Note: Stats are preserved after clear in the current implementation
      });

      test('should handle clearing empty cache', () => {
        cache.clear();
        expect(cache.cache.size).toBe(0);
      });
    });

    describe('Data type support', () => {
      test('should support string data', () => {
        cache.set('string-key', 'string-value');
        expect(cache.get('string-key')).toBe('string-value');
      });

      test('should support object data', () => {
        const objectData = { name: 'Test Object', value: 42 };
        cache.set('object-key', objectData);
        expect(cache.get('object-key')).toEqual(objectData);
      });

      test('should support array data', () => {
        const arrayData = [1, 2, 3, 'test', { nested: true }];
        cache.set('array-key', arrayData);
        expect(cache.get('array-key')).toEqual(arrayData);
      });

      test('should support null data', () => {
        cache.set('null-key', null);
        expect(cache.get('null-key')).toBeNull();
        expect(cache.hits).toBe(1); // Should count as hit even for null
      });

      test('should support undefined data', () => {
        cache.set('undefined-key', undefined);
        expect(cache.get('undefined-key')).toBeUndefined();
        expect(cache.hits).toBe(1); // Should count as hit even for undefined
      });

      test('should support boolean data', () => {
        cache.set('true-key', true);
        cache.set('false-key', false);

        expect(cache.get('true-key')).toBe(true);
        expect(cache.get('false-key')).toBe(false);
      });

      test('should support number data', () => {
        cache.set('number-key', 42);
        cache.set('float-key', 3.14159);
        cache.set('zero-key', 0);

        expect(cache.get('number-key')).toBe(42);
        expect(cache.get('float-key')).toBe(3.14159);
        expect(cache.get('zero-key')).toBe(0);
      });
    });

    describe('Key types and edge cases', () => {
      test('should support string keys', () => {
        cache.set('string-key', 'data');
        expect(cache.get('string-key')).toBe('data');
      });

      test('should support numeric keys', () => {
        cache.set(123, 'numeric-key-data');
        expect(cache.get(123)).toBe('numeric-key-data');
      });

      test('should handle empty string keys', () => {
        cache.set('', 'empty-string-key-data');
        expect(cache.get('')).toBe('empty-string-key-data');
      });

      test('should handle special character keys', () => {
        const specialKeys = ['key-with-dashes', 'key_with_underscores', 'key.with.dots', 'key/with/slashes'];

        specialKeys.forEach((key, index) => {
          cache.set(key, `data-${index}`);
        });

        specialKeys.forEach((key, index) => {
          expect(cache.get(key)).toBe(`data-${index}`);
        });
      });

      test('should handle Unicode keys', () => {
        const unicodeKeys = ['키-한국어', '键-中文', 'クラウド-日本語'];

        unicodeKeys.forEach((key, index) => {
          cache.set(key, `unicode-data-${index}`);
        });

        unicodeKeys.forEach((key, index) => {
          expect(cache.get(key)).toBe(`unicode-data-${index}`);
        });
      });
    });

    describe('Performance characteristics', () => {
      test('should handle large number of operations efficiently', () => {
        const iterations = 1000;
        const startTime = process.hrtime();

        // Perform many operations
        for (let i = 0; i < iterations; i++) {
          cache.set(`key-${i}`, `data-${i}`);
        }

        for (let i = 0; i < iterations; i++) {
          cache.get(`key-${i}`);
        }

        const [seconds, nanoseconds] = process.hrtime(startTime);
        const totalTime = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

        // Should complete in reasonable time (less than 100ms for 2000 operations)
        expect(totalTime).toBeLessThan(100);
        expect(cache.hits).toBe(iterations);
      });

      test('should maintain constant time complexity for basic operations', () => {
        // Fill cache with many items
        for (let i = 0; i < 100; i++) {
          cache.set(`bulk-key-${i}`, `bulk-data-${i}`);
        }

        const measureOperation = operation => {
          const start = process.hrtime();
          operation();
          const [seconds, nanoseconds] = process.hrtime(start);
          return seconds * 1000000 + nanoseconds / 1000; // Convert to microseconds
        };

        // Measure get operation
        const getTime = measureOperation(() => cache.get('bulk-key-50'));

        // Measure set operation
        const setTime = measureOperation(() => cache.set('new-key', 'new-data'));

        // Operations should be very fast (under 1ms = 1000 microseconds)
        expect(getTime).toBeLessThan(1000);
        expect(setTime).toBeLessThan(1000);
      });
    });

    describe('Error handling and edge cases', () => {
      test('should handle malformed timestamp data gracefully', () => {
        // Manually insert item with invalid timestamp to test resilience
        cache.cache.set('manual-key', { data: 'test', timestamp: 'invalid' });

        // Should handle gracefully (treat as expired)
        const result = cache.get('manual-key');
        expect(result).toBeNull();
        expect(cache.misses).toBe(1);
      });

      test('should handle extremely large cache sizes', () => {
        const hugeCache = new PerformanceCache(1000000); // 1 million items

        expect(hugeCache.maxSize).toBe(1000000);
        expect(hugeCache.cache.size).toBe(0);

        // Should initialize without issues
        hugeCache.set('test', 'data');
        expect(hugeCache.get('test')).toBe('data');
      });

      test('should handle zero cache size', () => {
        const zeroCache = new PerformanceCache(0);

        // Any set operation should immediately evict
        zeroCache.set('key', 'data');
        expect(zeroCache.cache.size).toBe(0);
        expect(zeroCache.get('key')).toBeNull();
      });

      test('should handle negative TTL', () => {
        const negativeTTLCache = new PerformanceCache(100, -1000);

        negativeTTLCache.set('key', 'data');

        // Negative TTL should cause immediate expiration
        expect(negativeTTLCache.get('key')).toBeNull();
      });

      test('should handle zero TTL', () => {
        const zeroTTLCache = new PerformanceCache(100, 0);

        zeroTTLCache.set('key', 'data');

        // Zero TTL should cause immediate expiration
        expect(zeroTTLCache.get('key')).toBeNull();
      });
    });

    describe('Real-world usage scenarios', () => {
      test('should simulate KRDS component caching', () => {
        const componentCache = new PerformanceCache(50, 60000); // 50 components, 1 minute TTL

        // Simulate caching component data
        const componentData = {
          id: 'krds-button',
          name: 'KRDS Button',
          html: '<button class="krds-btn">Click me</button>',
          css: '.krds-btn { background: #0066CC; color: white; }'
        };

        componentCache.set('button-primary', componentData);

        // Simulate multiple accesses (common in web applications)
        for (let i = 0; i < 10; i++) {
          const result = componentCache.get('button-primary');
          expect(result).toEqual(componentData);
        }

        expect(componentCache.hits).toBe(10);
        expect(componentCache.misses).toBe(0);
      });

      test('should simulate design token caching with expiration', () => {
        const tokenCache = new PerformanceCache(100, 2000); // 2 second TTL for testing

        // Cache design tokens
        const tokens = {
          'color-primary': '#0066CC',
          'color-secondary': '#FF6600',
          'spacing-medium': '16px'
        };

        Object.entries(tokens).forEach(([key, value]) => {
          tokenCache.set(key, value);
        });

        // Immediate access should work
        expect(tokenCache.get('color-primary')).toBe('#0066CC');

        // Simulate tokens expiring (design system update)
        global.advanceTime(3000); // 3 seconds

        // Should be expired
        expect(tokenCache.get('color-primary')).toBeNull();
        expect(tokenCache.misses).toBe(1);
      });

      test('should handle concurrent access patterns', () => {
        const sharedCache = new PerformanceCache();

        // Simulate multiple "users" accessing cached data
        const users = ['user1', 'user2', 'user3'];
        const resources = ['header', 'footer', 'navigation'];

        // Users cache their resources
        users.forEach(user => {
          resources.forEach(resource => {
            sharedCache.set(`${user}-${resource}`, `${resource} data for ${user}`);
          });
        });

        // All users access all resources (simulating shared components)
        users.forEach(user => {
          resources.forEach(resource => {
            const data = sharedCache.get(`${user}-${resource}`);
            expect(data).toBe(`${resource} data for ${user}`);
          });
        });

        expect(sharedCache.hits).toBe(9); // 3 users × 3 resources
        expect(sharedCache.cache.size).toBe(9);
      });
    });
  });
});
