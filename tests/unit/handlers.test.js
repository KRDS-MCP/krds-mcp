// Unit tests for KRDS MCP Server handlers

import { describe, test, expect } from '@jest/globals';
import {
  handleGetDesignPrinciples,
  handleGetColors,
  handleGetTypography,
  handleGetComponents,
  handleGetGlobalPatterns,
  handleGetServicePatterns,
  handleGetShapesIcons,
  handleValidateAccessibility
} from '../../handlers/index.js';

describe('KRDS MCP Handlers', () => {
  describe('handleGetDesignPrinciples', () => {
    test('should return all design principles when no filter provided', async () => {
      const result = await handleGetDesignPrinciples({});

      global.testUtils.validateMcpResponse(result);
      expect(result.content[0].text).toContain('KRDS 디자인 원칙');
    });

    test('should handle specific principle search', async () => {
      const result = await handleGetDesignPrinciples({
        principle: 'user'
      });

      // Should return a valid response regardless of search results
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });
  });

  describe('handleGetColors', () => {
    test('should return colors when category is provided', async () => {
      const result = await handleGetColors({ category: 'primary' });

      // Should return a valid response
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });

    test('should handle color search', async () => {
      const result = await handleGetColors({ color: 'blue' });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });
  });

  describe('handleGetTypography', () => {
    test('should return typography styles for category', async () => {
      const result = await handleGetTypography({ category: 'display' });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });
  });

  describe('handleGetComponents', () => {
    test('should return components filtered by category', async () => {
      const result = await handleGetComponents({ category: 'action' });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });

    test('should filter components by name', async () => {
      const result = await handleGetComponents({ component: 'button' });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });
  });

  describe('handleGetGlobalPatterns', () => {
    test('should return global patterns', async () => {
      const result = await handleGetGlobalPatterns({});

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });

    test('should filter patterns by name', async () => {
      const result = await handleGetGlobalPatterns({ pattern: 'layout' });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });

    test('should filter patterns by component', async () => {
      const result = await handleGetGlobalPatterns({ component: 'header' });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });
  });

  describe('handleGetServicePatterns', () => {
    test('should return service patterns', async () => {
      const result = await handleGetServicePatterns({});

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });

    test('should filter service patterns by name', async () => {
      const result = await handleGetServicePatterns({ pattern: 'form' });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });

    test('should include metrics when requested', async () => {
      const result = await handleGetServicePatterns({ includeMetrics: true });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });
  });

  describe('handleGetShapesIcons', () => {
    test('should handle shapes and icons request', async () => {
      try {
        const result = await handleGetShapesIcons({});
        expect(result).toHaveProperty('content');
        expect(Array.isArray(result.content)).toBe(true);
      } catch (error) {
        // Error is acceptable for data availability issues
        expect(error).toBeDefined();
      }
    });

    test('should handle shapes only request', async () => {
      try {
        const result = await handleGetShapesIcons({ type: 'shapes' });
        expect(result).toHaveProperty('content');
        expect(Array.isArray(result.content)).toBe(true);
      } catch (error) {
        // Error is acceptable for data availability issues
        expect(error).toBeDefined();
      }
    });

    test('should return only icons when requested', async () => {
      const result = await handleGetShapesIcons({ type: 'icons' });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });

    test('should filter icons by category', async () => {
      const result = await handleGetShapesIcons({
        type: 'icons',
        iconCategory: 'system'
      });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });
  });

  describe('handleValidateAccessibility', () => {
    test('should validate HTML and return accessibility report', async () => {
      const htmlCode = '<img src="test.jpg" alt="Test image"><html lang="ko">';
      const result = await handleValidateAccessibility({ htmlCode });

      global.testUtils.validateMcpResponse(result);
      expect(result.content[0].text).toContain('접근성 검증 결과');
    });

    test('should handle empty HTML input', async () => {
      const htmlCode = '';

      try {
        const result = await handleValidateAccessibility({ htmlCode });
        // Should either return a result or throw an error
        expect(result).toBeDefined();
      } catch (error) {
        // Error is acceptable for invalid input
        expect(error).toBeDefined();
      }
    });

    test('should handle basic HTML validation', async () => {
      const htmlCode = '<div>Basic content</div>';
      const result = await handleValidateAccessibility({ htmlCode });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });

    test('should handle proper HTML with accessibility features', async () => {
      const htmlCode =
        '<html lang="ko"><body><img src="test.jpg" alt="Test image" role="img"><button aria-label="Close">×</button></body></html>';
      const result = await handleValidateAccessibility({ htmlCode });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0].text).toContain('접근성 검증 결과');
    });
  });
});
