/**
 * Comprehensive tests for base-helpers.js
 * Tests KRDSHelper class utility methods
 * Target: 60%+ coverage for helper utilities (currently 33.04%)
 */

import { KRDSHelper } from '../../helpers/base-helpers.js';

describe('Base Helpers - Comprehensive Coverage Tests', () => {
  describe('findByName', () => {
    const testArray = [
      { name: 'Primary Button', category: 'button' },
      { name: 'Secondary Button', category: 'button' },
      { name: 'Text Input', category: 'input' },
      { title: 'Custom Title', category: 'custom' }
    ];

    test('should find items by name (case insensitive)', () => {
      const result = KRDSHelper.findByName(testArray, 'primary');
      expect(result).toEqual({ name: 'Primary Button', category: 'button' });
    });

    test('should find items with partial name match', () => {
      const result = KRDSHelper.findByName(testArray, 'text');
      expect(result).toEqual({ name: 'Text Input', category: 'input' });
    });

    test('should return undefined for non-existent name', () => {
      const result = KRDSHelper.findByName(testArray, 'nonexistent');
      expect(result).toBeUndefined();
    });

    test('should use custom search field', () => {
      const result = KRDSHelper.findByName(testArray, 'custom title', 'title');
      expect(result).toEqual({ title: 'Custom Title', category: 'custom' });
    });

    test('should handle null/undefined array', () => {
      expect(KRDSHelper.findByName(null, 'test')).toBeNull();
      expect(KRDSHelper.findByName(undefined, 'test')).toBeNull();
    });

    test('should handle empty array', () => {
      const result = KRDSHelper.findByName([], 'test');
      expect(result).toBeUndefined();
    });

    test('should handle null/undefined name', () => {
      expect(KRDSHelper.findByName(testArray, null)).toBeNull();
      expect(KRDSHelper.findByName(testArray, undefined)).toBeNull();
      expect(KRDSHelper.findByName(testArray, '')).toBeNull();
    });

    test('should handle non-array input', () => {
      expect(KRDSHelper.findByName('not-array', 'test')).toBeNull();
      expect(KRDSHelper.findByName({}, 'test')).toBeNull();
    });

    test('should handle items without search field', () => {
      const arrayWithMissingFields = [
        { name: 'Valid Item' },
        { category: 'no-name' },
        { name: null }
      ];

      const result = KRDSHelper.findByName(arrayWithMissingFields, 'valid');
      expect(result).toEqual({ name: 'Valid Item' });
    });
  });

  describe('findByCategory', () => {
    const testArray = [
      { name: 'Item 1', category: 'button' },
      { name: 'Item 2', category: 'BUTTON' },
      { name: 'Item 3', category: 'input' },
      { name: 'Item 4', category: 'Input' }
    ];

    test('should find all items by category (case insensitive)', () => {
      const result = KRDSHelper.findByCategory(testArray, 'button');
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Item 1');
      expect(result[1].name).toBe('Item 2');
    });

    test('should handle mixed case categories', () => {
      const result = KRDSHelper.findByCategory(testArray, 'INPUT');
      expect(result).toHaveLength(2);
    });

    test('should return empty array for non-existent category', () => {
      const result = KRDSHelper.findByCategory(testArray, 'nonexistent');
      expect(result).toEqual([]);
    });

    test('should handle null/undefined array', () => {
      expect(KRDSHelper.findByCategory(null, 'test')).toEqual([]);
      expect(KRDSHelper.findByCategory(undefined, 'test')).toEqual([]);
    });

    test('should handle empty array', () => {
      const result = KRDSHelper.findByCategory([], 'test');
      expect(result).toEqual([]);
    });

    test('should handle null/undefined category', () => {
      expect(KRDSHelper.findByCategory(testArray, null)).toEqual([]);
      expect(KRDSHelper.findByCategory(testArray, undefined)).toEqual([]);
      expect(KRDSHelper.findByCategory(testArray, '')).toEqual([]);
    });

    test('should handle non-array input', () => {
      expect(KRDSHelper.findByCategory('not-array', 'test')).toEqual([]);
      expect(KRDSHelper.findByCategory({}, 'test')).toEqual([]);
    });

    test('should handle items without category field', () => {
      const arrayWithMissingCategories = [
        { name: 'Item 1', category: 'button' },
        { name: 'Item 2' },
        { name: 'Item 3', category: null }
      ];

      const result = KRDSHelper.findByCategory(arrayWithMissingCategories, 'button');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Item 1');
    });
  });

  describe('findByFilters', () => {
    const testArray = [
      { name: 'Button Primary', category: 'button', size: 'large', priority: 1 },
      { name: 'Button Secondary', category: 'button', size: 'medium', priority: 2 },
      { name: 'Input Text', category: 'input', size: 'small', priority: 1 },
      { name: 'Link Component', category: 'link', size: 'medium', priority: 3 }
    ];

    test('should filter by string values', () => {
      const result = KRDSHelper.findByFilters(testArray, { category: 'button' });
      expect(result).toHaveLength(2);
      expect(result.every(item => item.category === 'button')).toBe(true);
    });

    test('should filter by partial string match', () => {
      const result = KRDSHelper.findByFilters(testArray, { name: 'button' });
      expect(result).toHaveLength(2);
    });

    test('should filter by number values', () => {
      const result = KRDSHelper.findByFilters(testArray, { priority: 1 });
      expect(result).toHaveLength(2);
      expect(result.every(item => item.priority === 1)).toBe(true);
    });

    test('should filter by array values (any match)', () => {
      const result = KRDSHelper.findByFilters(testArray, { size: ['large', 'small'] });
      expect(result).toHaveLength(2);
      expect(result.some(item => item.size === 'large')).toBe(true);
      expect(result.some(item => item.size === 'small')).toBe(true);
    });

    test('should filter by multiple criteria', () => {
      const result = KRDSHelper.findByFilters(testArray, {
        category: 'button',
        size: 'large'
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Button Primary');
    });

    test('should handle case insensitive string filtering', () => {
      const result = KRDSHelper.findByFilters(testArray, { category: 'BUTTON' });
      expect(result).toHaveLength(2);
    });

    test('should handle case insensitive array filtering', () => {
      const result = KRDSHelper.findByFilters(testArray, { size: ['LARGE', 'SMALL'] });
      expect(result).toHaveLength(2);
    });

    test('should return empty array for non-matching filters', () => {
      const result = KRDSHelper.findByFilters(testArray, { category: 'nonexistent' });
      expect(result).toEqual([]);
    });

    test('should handle null/undefined array', () => {
      expect(KRDSHelper.findByFilters(null, { category: 'test' })).toEqual([]);
      expect(KRDSHelper.findByFilters(undefined, { category: 'test' })).toEqual([]);
    });

    test('should handle null/undefined filters', () => {
      expect(KRDSHelper.findByFilters(testArray, null)).toEqual([]);
      expect(KRDSHelper.findByFilters(testArray, undefined)).toEqual([]);
    });

    test('should handle empty filters object', () => {
      const result = KRDSHelper.findByFilters(testArray, {});
      expect(result).toEqual(testArray);
    });

    test('should handle non-array input', () => {
      expect(KRDSHelper.findByFilters('not-array', { test: 'value' })).toEqual([]);
    });

    test('should handle boolean filter values', () => {
      const arrayWithBooleans = [
        { name: 'Item 1', active: true },
        { name: 'Item 2', active: false }
      ];

      const result = KRDSHelper.findByFilters(arrayWithBooleans, { active: true });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Item 1');
    });

    test('should handle missing fields in items', () => {
      const result = KRDSHelper.findByFilters(testArray, { nonexistentField: 'value' });
      expect(result).toEqual([]);
    });
  });

  describe('isValidColorCode', () => {
    test('should validate 6-digit hex colors', () => {
      expect(KRDSHelper.isValidColorCode('#000000')).toBe(true);
      expect(KRDSHelper.isValidColorCode('#FFFFFF')).toBe(true);
      expect(KRDSHelper.isValidColorCode('#123ABC')).toBe(true);
      expect(KRDSHelper.isValidColorCode('#abcdef')).toBe(true);
    });

    test('should validate 3-digit hex colors', () => {
      expect(KRDSHelper.isValidColorCode('#000')).toBe(true);
      expect(KRDSHelper.isValidColorCode('#FFF')).toBe(true);
      expect(KRDSHelper.isValidColorCode('#1A2')).toBe(true);
      expect(KRDSHelper.isValidColorCode('#abc')).toBe(true);
    });

    test('should validate RGB colors', () => {
      expect(KRDSHelper.isValidColorCode('rgb(0, 0, 0)')).toBe(true);
      expect(KRDSHelper.isValidColorCode('rgb(255, 255, 255)')).toBe(true);
      expect(KRDSHelper.isValidColorCode('rgb(128, 64, 192)')).toBe(true);
    });

    test('should validate HSL colors', () => {
      expect(KRDSHelper.isValidColorCode('hsl(0, 0%, 0%)')).toBe(true);
      expect(KRDSHelper.isValidColorCode('hsl(360, 100%, 100%)')).toBe(true);
      expect(KRDSHelper.isValidColorCode('hsl(180, 50%, 75%)')).toBe(true);
    });

    test('should reject invalid hex colors', () => {
      expect(KRDSHelper.isValidColorCode('#GGG')).toBe(false);
      expect(KRDSHelper.isValidColorCode('#12345')).toBe(false);
      expect(KRDSHelper.isValidColorCode('123ABC')).toBe(false);
      expect(KRDSHelper.isValidColorCode('#1234567')).toBe(false);
    });

    test('should reject invalid RGB colors', () => {
      expect(KRDSHelper.isValidColorCode('rgb(256, 0, 0)')).toBe(false);
      expect(KRDSHelper.isValidColorCode('rgb(-1, 0, 0)')).toBe(false);
      expect(KRDSHelper.isValidColorCode('rgb(0, 0)')).toBe(false);
      expect(KRDSHelper.isValidColorCode('rgb(0, 0, 0, 0)')).toBe(false);
    });

    test('should reject invalid HSL colors', () => {
      expect(KRDSHelper.isValidColorCode('hsl(361, 0%, 0%)')).toBe(false);
      expect(KRDSHelper.isValidColorCode('hsl(-1, 0%, 0%)')).toBe(false);
      expect(KRDSHelper.isValidColorCode('hsl(0, 101%, 0%)')).toBe(false);
      expect(KRDSHelper.isValidColorCode('hsl(0, 0%, 101%)')).toBe(false);
    });

    test('should handle null/undefined/empty input', () => {
      expect(KRDSHelper.isValidColorCode(null)).toBe(false);
      expect(KRDSHelper.isValidColorCode(undefined)).toBe(false);
      expect(KRDSHelper.isValidColorCode('')).toBe(false);
    });

    test('should handle non-string input', () => {
      expect(KRDSHelper.isValidColorCode(123)).toBe(false);
      expect(KRDSHelper.isValidColorCode({})).toBe(false);
      expect(KRDSHelper.isValidColorCode([])).toBe(false);
    });

    test('should handle edge cases for RGB validation', () => {
      expect(KRDSHelper.isValidColorCode('rgb(0, 0, 255)')).toBe(true);
      expect(KRDSHelper.isValidColorCode('rgb(255, 0, 0)')).toBe(true);
    });

    test('should handle edge cases for HSL validation', () => {
      expect(KRDSHelper.isValidColorCode('hsl(0, 0%, 0%)')).toBe(true);
      expect(KRDSHelper.isValidColorCode('hsl(360, 100%, 100%)')).toBe(true);
    });
  });

  describe('calculateContrastRatio', () => {
    test('should calculate contrast for valid hex colors', () => {
      const ratio = KRDSHelper.calculateContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeGreaterThan(1);
      expect(typeof ratio).toBe('number');
    });

    test('should handle same colors (minimum contrast)', () => {
      const ratio = KRDSHelper.calculateContrastRatio('#000000', '#000000');
      expect(ratio).toBe(1);
    });

    test('should calculate different contrasts for different color pairs', () => {
      const blackWhite = KRDSHelper.calculateContrastRatio('#000000', '#FFFFFF');
      const blackGray = KRDSHelper.calculateContrastRatio('#000000', '#808080');

      expect(blackWhite).toBeGreaterThan(blackGray);
    });

    test('should return 1 for invalid colors', () => {
      expect(KRDSHelper.calculateContrastRatio('invalid', '#FFFFFF')).toBe(1);
      expect(KRDSHelper.calculateContrastRatio('#000000', 'invalid')).toBe(1);
      expect(KRDSHelper.calculateContrastRatio('invalid1', 'invalid2')).toBe(1);
    });

    test('should handle null/undefined colors', () => {
      expect(KRDSHelper.calculateContrastRatio(null, '#FFFFFF')).toBe(1);
      expect(KRDSHelper.calculateContrastRatio('#000000', undefined)).toBe(1);
    });

    test('should handle 3-digit hex colors', () => {
      const ratio = KRDSHelper.calculateContrastRatio('#000', '#FFF');
      expect(ratio).toBeGreaterThan(1);
    });

    test('should handle various brightness levels', () => {
      const darkRatio = KRDSHelper.calculateContrastRatio('#111111', '#222222');
      const lightRatio = KRDSHelper.calculateContrastRatio('#DDDDDD', '#EEEEEE');

      expect(darkRatio).toBeGreaterThanOrEqual(1);
      expect(lightRatio).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getAccessibilityLevel', () => {
    test('should return AAA for high contrast ratios', () => {
      expect(KRDSHelper.getAccessibilityLevel(7.0)).toBe('AAA');
      expect(KRDSHelper.getAccessibilityLevel(10.0)).toBe('AAA');
    });

    test('should return AA for medium contrast ratios', () => {
      expect(KRDSHelper.getAccessibilityLevel(4.5)).toBe('AA');
      expect(KRDSHelper.getAccessibilityLevel(6.9)).toBe('AA');
    });

    test('should return A for low contrast ratios', () => {
      expect(KRDSHelper.getAccessibilityLevel(3.0)).toBe('A');
      expect(KRDSHelper.getAccessibilityLevel(4.4)).toBe('A');
    });

    test('should return Fail for very low contrast ratios', () => {
      expect(KRDSHelper.getAccessibilityLevel(2.9)).toBe('Fail');
      expect(KRDSHelper.getAccessibilityLevel(1.0)).toBe('Fail');
    });

    test('should handle edge cases', () => {
      expect(KRDSHelper.getAccessibilityLevel(0)).toBe('Fail');
      expect(KRDSHelper.getAccessibilityLevel(100)).toBe('AAA');
    });

    test('should handle exact threshold values', () => {
      expect(KRDSHelper.getAccessibilityLevel(3.0)).toBe('A');
      expect(KRDSHelper.getAccessibilityLevel(4.5)).toBe('AA');
      expect(KRDSHelper.getAccessibilityLevel(7.0)).toBe('AAA');
    });
  });

  describe('getBreakpoint', () => {
    test('should return correct breakpoints for different widths', () => {
      expect(KRDSHelper.getBreakpoint(300)).toBe('xs');
      expect(KRDSHelper.getBreakpoint(600)).toBe('sm');
      expect(KRDSHelper.getBreakpoint(800)).toBe('md');
      expect(KRDSHelper.getBreakpoint(1100)).toBe('lg');
      expect(KRDSHelper.getBreakpoint(1300)).toBe('xl');
      expect(KRDSHelper.getBreakpoint(1500)).toBe('xxl');
    });

    test('should handle edge cases at breakpoint boundaries', () => {
      expect(KRDSHelper.getBreakpoint(575)).toBe('xs');
      expect(KRDSHelper.getBreakpoint(576)).toBe('sm');
      expect(KRDSHelper.getBreakpoint(767)).toBe('sm');
      expect(KRDSHelper.getBreakpoint(768)).toBe('md');
      expect(KRDSHelper.getBreakpoint(991)).toBe('md');
      expect(KRDSHelper.getBreakpoint(992)).toBe('lg');
      expect(KRDSHelper.getBreakpoint(1199)).toBe('lg');
      expect(KRDSHelper.getBreakpoint(1200)).toBe('xl');
      expect(KRDSHelper.getBreakpoint(1399)).toBe('xl');
      expect(KRDSHelper.getBreakpoint(1400)).toBe('xxl');
    });

    test('should handle zero and negative values', () => {
      expect(KRDSHelper.getBreakpoint(0)).toBe('xs');
      expect(KRDSHelper.getBreakpoint(-100)).toBe('xs');
    });
  });

  describe('normalizeCSSValue', () => {
    test('should normalize number values with default unit', () => {
      expect(KRDSHelper.normalizeCSSValue(16)).toBe('16px');
      expect(KRDSHelper.normalizeCSSValue(0)).toBe('0px');
      expect(KRDSHelper.normalizeCSSValue(100)).toBe('100px');
    });

    test('should normalize number values with custom unit', () => {
      expect(KRDSHelper.normalizeCSSValue(16, 'rem')).toBe('16rem');
      expect(KRDSHelper.normalizeCSSValue(50, '%')).toBe('50%');
      expect(KRDSHelper.normalizeCSSValue(2, 'em')).toBe('2em');
    });

    test('should preserve values that already have units', () => {
      expect(KRDSHelper.normalizeCSSValue('16px')).toBe('16px');
      expect(KRDSHelper.normalizeCSSValue('50%')).toBe('50%');
      expect(KRDSHelper.normalizeCSSValue('2em')).toBe('2em');
      expect(KRDSHelper.normalizeCSSValue('100vh')).toBe('100vh');
    });

    test('should normalize string numbers without units', () => {
      expect(KRDSHelper.normalizeCSSValue('16')).toBe('16px');
      expect(KRDSHelper.normalizeCSSValue('16', 'rem')).toBe('16rem');
    });

    test('should handle decimal values', () => {
      expect(KRDSHelper.normalizeCSSValue(1.5)).toBe('1.5px');
      expect(KRDSHelper.normalizeCSSValue('2.5')).toBe('2.5px');
      expect(KRDSHelper.normalizeCSSValue(0.5, 'rem')).toBe('0.5rem');
    });

    test('should handle zero values', () => {
      expect(KRDSHelper.normalizeCSSValue(0)).toBe('0px');
      expect(KRDSHelper.normalizeCSSValue('0')).toBe('0px');
    });

    test('should handle invalid values gracefully', () => {
      expect(KRDSHelper.normalizeCSSValue('invalid')).toBe('invalid');
      expect(KRDSHelper.normalizeCSSValue('')).toBe('');
      expect(KRDSHelper.normalizeCSSValue(null)).toBeNull();
      expect(KRDSHelper.normalizeCSSValue(undefined)).toBeUndefined();
    });

    test('should handle special CSS values', () => {
      expect(KRDSHelper.normalizeCSSValue('auto')).toBe('auto');
      expect(KRDSHelper.normalizeCSSValue('inherit')).toBe('inherit');
      expect(KRDSHelper.normalizeCSSValue('initial')).toBe('initial');
    });
  });

  describe('deepClone', () => {
    test('should clone primitive values', () => {
      expect(KRDSHelper.deepClone(null)).toBeNull();
      expect(KRDSHelper.deepClone(undefined)).toBeUndefined();
      expect(KRDSHelper.deepClone(42)).toBe(42);
      expect(KRDSHelper.deepClone('string')).toBe('string');
      expect(KRDSHelper.deepClone(true)).toBe(true);
    });

    test('should clone Date objects', () => {
      const date = new Date('2023-01-01');
      const cloned = KRDSHelper.deepClone(date);

      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
      expect(cloned instanceof Date).toBe(true);
    });

    test('should clone arrays', () => {
      const array = [1, 'two', { three: 3 }, [4, 5]];
      const cloned = KRDSHelper.deepClone(array);

      expect(cloned).toEqual(array);
      expect(cloned).not.toBe(array);
      expect(cloned[2]).not.toBe(array[2]);
      expect(cloned[3]).not.toBe(array[3]);
    });

    test('should clone objects', () => {
      const obj = {
        name: 'test',
        number: 42,
        nested: {
          prop: 'value'
        },
        array: [1, 2, 3]
      };
      const cloned = KRDSHelper.deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.nested).not.toBe(obj.nested);
      expect(cloned.array).not.toBe(obj.array);
    });

    test('should handle circular references gracefully', () => {
      // Note: This implementation doesn't handle circular references
      // but should not crash on deeply nested objects
      const deepObj = { level: 1 };
      let current = deepObj;
      for (let i = 2; i <= 5; i++) {
        current.next = { level: i };
        current = current.next;
      }

      const cloned = KRDSHelper.deepClone(deepObj);
      expect(cloned.level).toBe(1);
      expect(cloned.next.level).toBe(2);
    });

    test('should preserve object property ownership', () => {
      const obj = Object.create(null);
      obj.ownProp = 'value';

      const cloned = KRDSHelper.deepClone(obj);
      expect(cloned.ownProp).toBe('value');
      expect(Object.prototype.hasOwnProperty.call(cloned, 'ownProp')).toBe(true);
    });
  });

  describe('deepMerge', () => {
    test('should merge simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = KRDSHelper.deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    test('should merge nested objects', () => {
      const target = {
        level1: {
          a: 1,
          b: 2,
          nested: {
            x: 10
          }
        }
      };
      const source = {
        level1: {
          b: 3,
          c: 4,
          nested: {
            y: 20
          }
        }
      };
      const result = KRDSHelper.deepMerge(target, source);

      expect(result.level1.a).toBe(1);
      expect(result.level1.b).toBe(3);
      expect(result.level1.c).toBe(4);
      expect(result.level1.nested.x).toBe(10);
      expect(result.level1.nested.y).toBe(20);
    });

    test('should handle null/undefined target', () => {
      const source = { a: 1, b: 2 };

      expect(KRDSHelper.deepMerge(null, source)).toBe(source);
      expect(KRDSHelper.deepMerge(undefined, source)).toBe(source);
    });

    test('should handle null/undefined source', () => {
      const target = { a: 1, b: 2 };

      expect(KRDSHelper.deepMerge(target, null)).toBe(target);
      expect(KRDSHelper.deepMerge(target, undefined)).toBe(target);
    });

    test('should handle non-object inputs', () => {
      expect(KRDSHelper.deepMerge('string', { a: 1 })).toEqual({ a: 1 });
      expect(KRDSHelper.deepMerge({ a: 1 }, 'string')).toEqual({ a: 1 });
    });

    test('should not deep merge arrays', () => {
      const target = { arr: [1, 2, 3] };
      const source = { arr: [4, 5] };
      const result = KRDSHelper.deepMerge(target, source);

      expect(result.arr).toEqual([4, 5]);
      expect(result.arr).toBe(source.arr);
    });

    test('should preserve original objects', () => {
      const target = { a: { x: 1 } };
      const source = { a: { y: 2 } };
      const result = KRDSHelper.deepMerge(target, source);

      expect(target.a).not.toHaveProperty('y');
      expect(result.a.x).toBe(1);
      expect(result.a.y).toBe(2);
    });
  });

  describe('validate', () => {
    test('should validate email addresses', () => {
      expect(KRDSHelper.validate('user@example.com', 'email')).toBe(true);
      expect(KRDSHelper.validate('test.email@domain.co.kr', 'email')).toBe(true);
      expect(KRDSHelper.validate('invalid-email', 'email')).toBe(false);
      expect(KRDSHelper.validate('', 'email')).toBe(false);
      expect(KRDSHelper.validate('@domain.com', 'email')).toBe(false);
    });

    test('should validate phone numbers', () => {
      expect(KRDSHelper.validate('010-1234-5678', 'phone')).toBe(true);
      expect(KRDSHelper.validate('(02) 123-4567', 'phone')).toBe(true);
      expect(KRDSHelper.validate('+82 10 1234 5678', 'phone')).toBe(true);
      expect(KRDSHelper.validate('02-123-4567', 'phone')).toBe(true);
      expect(KRDSHelper.validate('invalid-phone', 'phone')).toBe(false);
    });

    test('should validate URLs', () => {
      expect(KRDSHelper.validate('https://example.com', 'url')).toBe(true);
      expect(KRDSHelper.validate('http://test.domain.co.kr', 'url')).toBe(true);
      expect(KRDSHelper.validate('ftp://files.example.com', 'url')).toBe(true);
      expect(KRDSHelper.validate('invalid-url', 'url')).toBe(false);
      expect(KRDSHelper.validate('', 'url')).toBe(false);
    });

    test('should validate numbers', () => {
      expect(KRDSHelper.validate('42', 'number')).toBe(true);
      expect(KRDSHelper.validate('3.14', 'number')).toBe(true);
      expect(KRDSHelper.validate('-10', 'number')).toBe(true);
      expect(KRDSHelper.validate(42, 'number')).toBe(true);
      expect(KRDSHelper.validate('not-a-number', 'number')).toBe(false);
      expect(KRDSHelper.validate(Infinity, 'number')).toBe(false);
      expect(KRDSHelper.validate(NaN, 'number')).toBe(false);
    });

    test('should validate integers', () => {
      expect(KRDSHelper.validate('42', 'integer')).toBe(true);
      expect(KRDSHelper.validate(42, 'integer')).toBe(true);
      expect(KRDSHelper.validate('-10', 'integer')).toBe(true);
      expect(KRDSHelper.validate('3.14', 'integer')).toBe(false);
      expect(KRDSHelper.validate('not-integer', 'integer')).toBe(false);
    });

    test('should validate required fields', () => {
      expect(KRDSHelper.validate('some value', 'required')).toBe(true);
      expect(KRDSHelper.validate('', 'required')).toBe(false);
      expect(KRDSHelper.validate(null, 'required')).toBe(false);
      expect(KRDSHelper.validate(undefined, 'required')).toBe(false);
      expect(KRDSHelper.validate(0, 'required')).toBe(true);
      expect(KRDSHelper.validate(false, 'required')).toBe(true);
    });

    test('should return true for unknown validation types', () => {
      expect(KRDSHelper.validate('any value', 'unknown-type')).toBe(true);
      expect(KRDSHelper.validate('any value', '')).toBe(true);
      expect(KRDSHelper.validate('any value', null)).toBe(true);
    });

    test('should handle edge cases', () => {
      expect(KRDSHelper.validate(0, 'email')).toBe(false);
      expect(KRDSHelper.validate(null, 'phone')).toBe(false);
      expect(KRDSHelper.validate(undefined, 'url')).toBe(false);
    });
  });
});
