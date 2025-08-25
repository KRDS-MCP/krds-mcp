// Unit tests for KRDS MCP Server helper modules

import { describe, test, expect } from '@jest/globals';
import {
  InputValidator,
  ErrorHandler,
  ResponseFormatter,
  DataService,
  SpecialValidators,
  AccessibilityValidator
} from '../../helpers/index.js';

describe('KRDS MCP Helpers', () => {
  describe('InputValidator', () => {
    test('should validate and sanitize basic input', () => {
      const args = { category: 'primary' };
      const result = InputValidator.validateAndSanitize(args, 'colors', 'Test operation');
      expect(result).toEqual(args);
    });

    test('should handle empty input', () => {
      const result = InputValidator.validateAndSanitize({}, 'colors', 'Test operation');
      expect(result).toEqual({});
    });
  });

  describe('ErrorHandler', () => {
    test('should handle data unavailable error', () => {
      const result = ErrorHandler.handleDataUnavailable('test data', 'test operation');
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0].text).toContain('사용할 수 없습니다');
    });

    test('should handle no results error', () => {
      const result = ErrorHandler.handleNoResults('search term', 'test', 'test operation');
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0].text).toContain('검색 결과를 찾을 수 없습니다');
    });
  });

  describe('ResponseFormatter', () => {
    test('should create text response', () => {
      const text = 'Test response text';
      const result = ResponseFormatter.createTextResponse(text);
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text', text);
    });

    test('should create list response', () => {
      const items = [{ name: 'Item 1' }, { name: 'Item 2' }];
      const formatter = item => `- ${item.name}`;
      const result = ResponseFormatter.createListResponse('Test List', items, formatter);
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0].text).toContain('Test List');
    });

    test('should format color information', () => {
      const color = {
        name: 'Test Blue',
        id: 'blue-500',
        hex: '#3b82f6',
        description: 'Test color'
      };
      const result = ResponseFormatter.formatColor(color);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('DataService', () => {
    test('should check data availability', () => {
      const data = [{ id: 1, name: 'test' }];
      const result = DataService.isDataAvailable(data, 'test data');
      expect(result).toBe(true);
    });

    test('should detect empty data', () => {
      const result = DataService.isDataAvailable([], 'test data');
      expect(result).toBe(false);
    });

    test('should detect null data', () => {
      const result = DataService.isDataAvailable(null, 'test data');
      expect(result).toBe(false);
    });

    test('should query data with basic search', () => {
      const data = [
        { id: 1, name: 'Apple', category: 'fruit' },
        { id: 2, name: 'Orange', category: 'fruit' },
        { id: 3, name: 'Carrot', category: 'vegetable' }
      ];
      const query = { search: 'app', searchFields: ['name'] };
      const result = DataService.queryData(data, query);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Apple');
    });

    test('should filter data by category', () => {
      const data = [
        { id: 1, name: 'Apple', category: 'fruit' },
        { id: 2, name: 'Orange', category: 'fruit' },
        { id: 3, name: 'Carrot', category: 'vegetable' }
      ];
      const query = { filters: { category: 'fruit' } };
      const result = DataService.queryData(data, query);
      expect(result.items).toHaveLength(2);
      expect(result.items.every(item => item.category === 'fruit')).toBe(true);
    });
  });

  describe('SpecialValidators', () => {
    test('should validate valid HTML code', () => {
      const htmlCode = '<div>Valid HTML</div>';
      const result = SpecialValidators.validateHtmlCode(htmlCode);
      expect(result.isValid).toBe(true);
    });

    test('should handle invalid HTML code', () => {
      try {
        const result = SpecialValidators.validateHtmlCode('');
        expect(result.isValid).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle long HTML code', () => {
      try {
        const longHtml = 'a'.repeat(100000);
        const result = SpecialValidators.validateHtmlCode(longHtml);
        expect(result.isValid).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('AccessibilityValidator', () => {
    test('should validate basic HTML structure', () => {
      const htmlCode = '<html lang="ko"><body><h1>Title</h1><p>Content</p></body></html>';
      const result = AccessibilityValidator.validateAccessibility(htmlCode);
      expect(result).toHaveProperty('accessibilityScore');
      expect(typeof result.accessibilityScore).toBe('number');
    });

    test('should detect accessibility issues', () => {
      const htmlCode = '<img src="test.jpg">';
      const result = AccessibilityValidator.validateAccessibility(htmlCode);
      expect(result).toHaveProperty('accessibilityScore');
      expect(Array.isArray(result.issues)).toBe(true);
    });

    test('should analyze HTML structure', () => {
      const htmlCode = '<html><body>Content</body></html>';
      const result = AccessibilityValidator.validateAccessibility(htmlCode);
      expect(result).toHaveProperty('accessibilityScore');
      expect(Array.isArray(result.issues)).toBe(true);
    });

    test('should validate proper accessibility features', () => {
      const htmlCode =
        '<html lang="ko"><body><img src="test.jpg" alt="Test"><button aria-label="Click">Click</button></body></html>';
      const result = AccessibilityValidator.validateAccessibility(htmlCode);
      expect(result.accessibilityScore).toBeGreaterThan(0);
    });
  });
});
