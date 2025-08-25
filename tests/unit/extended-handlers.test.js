// Unit tests for extended handlers (extended-handlers.js)

import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

// Import handlers
const {
  handleGetDesignTokens,
  handleGetSystems,
  handleSearch,
  handleGenerateCode,
  handleGetStats
} = await import('../../handlers/extended-handlers.js');

describe('Extended Handlers', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('handleGetDesignTokens', () => {
    test('should handle valid design token requests', async () => {
      const args = { category: 'color', format: 'json' };
      const result = await handleGetDesignTokens(args);

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('디자인 토큰');
    });

    test('should handle all valid categories', async () => {
      const validCategories = [
        'color',
        'typography',
        'spacing',
        'sizing',
        'border',
        'shadow',
        'motion',
        'layout'
      ];

      for (const category of validCategories) {
        const result = await handleGetDesignTokens({ category });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content[0].type).toBe('text');
      }
    });

    test('should handle invalid category gracefully', async () => {
      const args = { category: 'invalid-category' };

      // Should throw an MCP error for invalid input
      await expect(handleGetDesignTokens(args)).rejects.toThrow(McpError);
    });

    test('should support different output formats', async () => {
      const testFormats = ['json', 'css', 'style-dictionary'];

      for (const format of testFormats) {
        const result = await handleGetDesignTokens({ format });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content[0].type).toBe('text');
      }
    });

    test('should support light and dark themes', async () => {
      const testThemes = ['light', 'dark'];

      for (const theme of testThemes) {
        const result = await handleGetDesignTokens({ theme });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content[0].type).toBe('text');
        expect(result.content[0].text).toContain(theme);
      }
    });

    test('should handle token name filtering', async () => {
      const args = { tokenName: 'primary' };
      const result = await handleGetDesignTokens(args);

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
    });

    test('should handle empty arguments', async () => {
      const result = await handleGetDesignTokens({});

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
    });
  });

  describe('handleGetSystems', () => {
    test('should return system overview when no specific system requested', async () => {
      const result = await handleGetSystems({});

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('시스템 정보');
    });

    test('should handle valid system types', async () => {
      const validSystems = ['spacing', 'grid', 'responsive', 'darkmode'];

      for (const system of validSystems) {
        const result = await handleGetSystems({ system });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content[0].type).toBe('text');
      }
    });

    test('should handle invalid system type', async () => {
      // Should throw an MCP error for invalid input
      await expect(handleGetSystems({ system: 'invalid' })).rejects.toThrow(McpError);
    });
  });

  describe('handleSearch', () => {
    test('should handle valid search queries', async () => {
      const args = { query: 'button', type: 'all' };
      const result = await handleSearch(args);

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
    });

    test('should validate search query', async () => {
      const args = { query: 'test query' };
      const result = await handleSearch(args);

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    });

    test('should handle invalid search query', async () => {
      // Test with very short query
      const args = { query: 'a' };
      const result = await handleSearch(args);

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    });

    test('should support different search types', async () => {
      const searchTypes = ['all', 'components', 'colors', 'typography'];

      for (const type of searchTypes) {
        const result = await handleSearch({ query: 'test', type });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
      }
    });

    test('should handle detailed search option', async () => {
      const result = await handleSearch({
        query: 'button',
        type: 'components',
        detailed: true
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    });

    test('should handle Korean search queries', async () => {
      const result = await handleSearch({ query: '버튼', type: 'all' });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    });

    test('should handle empty search results', async () => {
      const result = await handleSearch({
        query: 'nonexistentquery12345',
        type: 'all'
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    });
  });

  describe('handleGenerateCode', () => {
    test('should validate required arguments', async () => {
      // Should throw an MCP error for missing required arguments
      await expect(handleGenerateCode({})).rejects.toThrow(McpError);
    });

    test('should support different code generation types', async () => {
      const validTypes = ['component', 'global-pattern', 'service-pattern'];

      for (const type of validTypes) {
        const result = await handleGenerateCode({
          type,
          id: 'test-id'
        });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
      }
    });

    test('should support theme variants', async () => {
      const themes = ['light', 'dark'];

      for (const theme of themes) {
        const result = await handleGenerateCode({
          type: 'component',
          id: 'button',
          theme
        });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
      }
    });

    test('should handle component variants', async () => {
      const result = await handleGenerateCode({
        type: 'component',
        id: 'button',
        variant: 'primary'
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    });

    test('should handle invalid type', async () => {
      // Should throw an MCP error for invalid type
      await expect(
        handleGenerateCode({
          type: 'invalid-type',
          id: 'test'
        })
      ).rejects.toThrow(McpError);
    });
  });

  describe('handleGetStats', () => {
    test('should support basic stats request', async () => {
      const result = await handleGetStats({});

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('통계');
    });

    test('should support detailed stats request', async () => {
      const result = await handleGetStats({ detailed: true });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('상세');
    });
  });

  describe('Error Handling', () => {
    test('should handle null arguments gracefully', async () => {
      // Some handlers should work with null (treated as empty object)
      const result1 = await handleGetDesignTokens(null);
      expect(result1).toBeDefined();
      expect(result1.content).toBeDefined();

      const result2 = await handleGetSystems(null);
      expect(result2).toBeDefined();
      expect(result2.content).toBeDefined();

      const result3 = await handleGetStats(null);
      expect(result3).toBeDefined();
      expect(result3.content).toBeDefined();

      // These require specific parameters, so should throw errors
      await expect(handleSearch(null)).rejects.toThrow(McpError);
      await expect(handleGenerateCode(null)).rejects.toThrow(McpError);
    });

    test('should handle undefined arguments gracefully', async () => {
      // Most handlers should throw errors for undefined input where required params are needed
      await expect(handleSearch(undefined)).rejects.toThrow(McpError);

      // These should work with undefined (treated as empty object)
      const result1 = await handleGetDesignTokens(undefined);
      expect(result1).toBeDefined();
      expect(result1.content).toBeDefined();

      const result2 = await handleGetSystems(undefined);
      expect(result2).toBeDefined();
      expect(result2.content).toBeDefined();

      const result3 = await handleGetStats(undefined);
      expect(result3).toBeDefined();
      expect(result3.content).toBeDefined();
    });

    test('should handle empty object arguments', async () => {
      // These should work with empty objects
      const result1 = await handleGetDesignTokens({});
      expect(result1).toBeDefined();
      expect(result1.content).toBeDefined();

      const result2 = await handleGetSystems({});
      expect(result2).toBeDefined();
      expect(result2.content).toBeDefined();

      const result3 = await handleGetStats({});
      expect(result3).toBeDefined();
      expect(result3.content).toBeDefined();

      // generateCode requires type and id, so should throw error
      await expect(handleGenerateCode({})).rejects.toThrow(McpError);
    });
  });

  describe('Response Format', () => {
    test('all handlers should return consistent response format', async () => {
      const responses = [
        await handleGetDesignTokens({ category: 'color' }),
        await handleGetSystems({}),
        await handleSearch({ query: 'test' }),
        await handleGenerateCode({ type: 'component', id: 'button' }),
        await handleGetStats({})
      ];

      responses.forEach(response => {
        expect(response).toBeDefined();
        expect(response.content).toBeDefined();
        expect(Array.isArray(response.content)).toBe(true);
        expect(response.content.length).toBeGreaterThan(0);
        expect(response.content[0]).toHaveProperty('type');
        expect(response.content[0]).toHaveProperty('text');
        expect(typeof response.content[0].text).toBe('string');
      });
    });
  });
});
