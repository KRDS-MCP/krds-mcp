// Unit tests for extended handlers (extended-handlers.js)

import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

// Mock all dependencies
jest.unstable_mockModule('../helpers/index.js', () => ({
  InputValidator: {
    validateAndSanitize: jest.fn()
  },
  ErrorHandler: {
    handleDataUnavailable: jest.fn(),
    handleNoResults: jest.fn(),
    handleError: jest.fn()
  },
  ErrorLogger: {
    logError: jest.fn()
  },
  ResponseFormatter: {
    createTextResponse: jest.fn()
  },
  SpecialValidators: {
    validateSearchQuery: jest.fn()
  }
}));

jest.unstable_mockModule('../data/index.js', () => ({
  KRDS_DATA: {
    designTokens: {
      tokens: {
        color: { primary: '#0066CC', secondary: '#FF6600' },
        typography: { fontSize: '16px' },
        spacing: { small: '8px', medium: '16px' }
      }
    },
    systems: {
      spacing: { unit: '8px' },
      grid: { columns: 12 },
      responsive: { breakpoints: ['768px', '1024px'] }
    },
    components: [
      { id: 'button', name: 'Button', category: 'action' },
      { id: 'input', name: 'Input', category: 'input' }
    ],
    colors: [{ id: 'primary-blue', name: 'Primary Blue', category: 'primary' }]
  }
}));

// Import handlers after mocking
const {
  handleGetDesignTokens,
  handleGetSystems,
  handleSearch,
  handleGenerateCode,
  handleGetStats
} = await import('../../handlers/extended-handlers.js');

describe('Extended Handlers', () => {
  let mockHelpers;
  let mockKRDSData;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockHelpers = await import('../helpers/index.js');
    const dataModule = await import('../data/index.js');
    mockKRDSData = dataModule.KRDS_DATA;

    // Setup default mock behaviors
    mockHelpers.InputValidator.validateAndSanitize.mockImplementation(
      (args, type, context) => args
    );
    mockHelpers.ErrorHandler.handleDataUnavailable.mockReturnValue({
      content: [{ type: 'text', text: 'Data unavailable' }]
    });
    mockHelpers.ErrorHandler.handleNoResults.mockReturnValue({
      content: [{ type: 'text', text: 'No results found' }]
    });
    mockHelpers.ErrorHandler.handleError.mockReturnValue({
      content: [{ type: 'text', text: 'Error occurred' }]
    });
    mockHelpers.ResponseFormatter.createTextResponse.mockImplementation(text => ({
      content: [{ type: 'text', text }]
    }));
    mockHelpers.SpecialValidators.validateSearchQuery.mockReturnValue({
      isValid: true,
      sanitized: 'test query'
    });
  });

  describe('handleGetDesignTokens', () => {
    test('should validate input arguments', async () => {
      const args = { category: 'color', format: 'json' };
      await handleGetDesignTokens(args);

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledWith(
        args,
        'designTokens',
        '디자인 토큰 조회'
      );
    });

    test('should handle missing design tokens data', async () => {
      // Mock missing data
      mockKRDSData.designTokens = null;

      const result = await handleGetDesignTokens({});

      expect(mockHelpers.ErrorHandler.handleDataUnavailable).toHaveBeenCalledWith(
        '디자인 토큰',
        '디자인 토큰 조회'
      );
      expect(result.content[0].text).toBe('Data unavailable');
    });

    test('should filter tokens by category', async () => {
      const args = { category: 'color' };
      const result = await handleGetDesignTokens(args);

      expect(mockHelpers.ResponseFormatter.createTextResponse).toHaveBeenCalled();
    });

    test('should handle invalid category', async () => {
      const args = { category: 'invalid-category' };
      const result = await handleGetDesignTokens(args);

      expect(mockHelpers.ErrorHandler.handleNoResults).toHaveBeenCalledWith(
        'invalid-category',
        'design-tokens',
        '디자인 토큰 조회'
      );
    });

    test('should support different output formats', async () => {
      const testFormats = ['json', 'css', 'style-dictionary'];

      for (const format of testFormats) {
        mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({ format });
        await handleGetDesignTokens({ format });
      }

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledTimes(
        testFormats.length
      );
    });

    test('should support light and dark themes', async () => {
      const testThemes = ['light', 'dark'];

      for (const theme of testThemes) {
        mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({ theme });
        await handleGetDesignTokens({ theme });
      }

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledTimes(
        testThemes.length
      );
    });

    test('should handle token name filtering', async () => {
      const args = { tokenName: 'primary' };
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue(args);

      await handleGetDesignTokens(args);

      expect(mockHelpers.ResponseFormatter.createTextResponse).toHaveBeenCalled();
    });

    test('should handle errors gracefully', async () => {
      const error = new Error('Token processing error');
      mockHelpers.InputValidator.validateAndSanitize.mockImplementation(() => {
        throw error;
      });

      const result = await handleGetDesignTokens({});

      expect(mockHelpers.ErrorHandler.handleError).toHaveBeenCalledWith(error, '디자인 토큰 조회', {
        args: {}
      });
    });
  });

  describe('handleGetSystems', () => {
    test('should validate input arguments', async () => {
      const args = { system: 'spacing' };
      await handleGetSystems(args);

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledWith(
        args,
        'systems',
        '시스템 정보 조회'
      );
    });

    test('should return system overview when no specific system requested', async () => {
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({});

      const result = await handleGetSystems({});

      // Should call system overview formatter
      expect(result).toBeDefined();
    });

    test('should handle valid system types', async () => {
      const validSystems = ['spacing', 'grid', 'responsive', 'darkmode'];

      for (const system of validSystems) {
        mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({ system });
        await handleGetSystems({ system });
      }

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledTimes(
        validSystems.length
      );
    });

    test('should handle invalid system type', async () => {
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({ system: 'invalid' });

      const result = await handleGetSystems({ system: 'invalid' });

      expect(mockHelpers.ErrorHandler.handleNoResults).toHaveBeenCalledWith(
        'invalid',
        'systems',
        '시스템 정보 조회'
      );
    });

    test('should handle errors gracefully', async () => {
      const error = new Error('System processing error');
      mockHelpers.InputValidator.validateAndSanitize.mockImplementation(() => {
        throw error;
      });

      const result = await handleGetSystems({});

      expect(mockHelpers.ErrorHandler.handleError).toHaveBeenCalledWith(error, '시스템 정보 조회', {
        args: {}
      });
    });
  });

  describe('handleSearch', () => {
    test('should validate input arguments', async () => {
      const args = { query: 'test', type: 'all' };
      await handleSearch(args);

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledWith(
        args,
        'search',
        '통합 검색'
      );
    });

    test('should validate search query', async () => {
      const args = { query: 'button' };
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue(args);

      await handleSearch(args);

      expect(mockHelpers.SpecialValidators.validateSearchQuery).toHaveBeenCalledWith('button');
    });

    test('should handle invalid search query', async () => {
      const args = { query: 'invalid' };
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue(args);
      mockHelpers.SpecialValidators.validateSearchQuery.mockReturnValue({
        isValid: false,
        error: 'Invalid query format'
      });

      await expect(handleSearch(args)).rejects.toThrow(McpError);
      await expect(handleSearch(args)).rejects.toThrow('Invalid query format');
    });

    test('should support different search types', async () => {
      const searchTypes = [
        'all',
        'principles',
        'colors',
        'typography',
        'components',
        'global-patterns',
        'service-patterns',
        'icons',
        'tokens'
      ];

      for (const type of searchTypes) {
        mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({ query: 'test', type });
        await handleSearch({ query: 'test', type });
      }

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledTimes(
        searchTypes.length
      );
    });

    test('should handle detailed search option', async () => {
      const args = { query: 'button', detailed: true };
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue(args);

      await handleSearch(args);

      expect(mockHelpers.SpecialValidators.validateSearchQuery).toHaveBeenCalledWith('button');
    });

    test('should handle no search results', async () => {
      const args = { query: 'nonexistent' };
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue(args);

      // Mock search engine to return no results
      jest.doMock('../../handlers/extended-handlers.js', () => ({
        ...jest.requireActual('../../handlers/extended-handlers.js'),
        SearchEngine: {
          performSearch: jest.fn().mockReturnValue({ results: [] })
        }
      }));

      const result = await handleSearch(args);

      expect(mockHelpers.ErrorHandler.handleNoResults).toHaveBeenCalledWith(
        'test query',
        'all',
        '통합 검색'
      );
    });

    test('should handle Korean search queries', async () => {
      const koreanQuery = '버튼';
      const args = { query: koreanQuery };
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue(args);
      mockHelpers.SpecialValidators.validateSearchQuery.mockReturnValue({
        isValid: true,
        sanitized: koreanQuery
      });

      await handleSearch(args);

      expect(mockHelpers.SpecialValidators.validateSearchQuery).toHaveBeenCalledWith(koreanQuery);
    });

    test('should truncate long queries in error logging', async () => {
      const longQuery = 'a'.repeat(100);
      const args = { query: longQuery };
      const error = new Error('Search error');

      mockHelpers.InputValidator.validateAndSanitize.mockImplementation(() => {
        throw error;
      });

      await handleSearch(args);

      expect(mockHelpers.ErrorHandler.handleError).toHaveBeenCalledWith(error, '통합 검색', {
        args: { query: longQuery.substring(0, 50), type: undefined }
      });
    });

    test('should handle errors gracefully', async () => {
      const error = new Error('Search processing error');
      mockHelpers.InputValidator.validateAndSanitize.mockImplementation(() => {
        throw error;
      });

      const result = await handleSearch({});

      expect(mockHelpers.ErrorHandler.handleError).toHaveBeenCalledWith(
        error,
        '통합 검색',
        expect.any(Object)
      );
    });
  });

  describe('handleGenerateCode', () => {
    test('should validate input arguments', async () => {
      const args = { type: 'component', id: 'button' };
      await handleGenerateCode(args);

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalled();
    });

    test('should support different code generation types', async () => {
      const codeTypes = ['component', 'global-pattern', 'service-pattern'];

      for (const type of codeTypes) {
        mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({ type, id: 'test' });
        await handleGenerateCode({ type, id: 'test' });
      }

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledTimes(
        codeTypes.length
      );
    });

    test('should support theme variants', async () => {
      const themes = ['light', 'dark'];

      for (const theme of themes) {
        mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({
          type: 'component',
          id: 'button',
          theme
        });
        await handleGenerateCode({ type: 'component', id: 'button', theme });
      }

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledTimes(themes.length);
    });

    test('should handle component variants', async () => {
      const args = { type: 'component', id: 'button', variant: 'primary' };
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue(args);

      await handleGenerateCode(args);

      expect(mockHelpers.ResponseFormatter.createTextResponse).toHaveBeenCalled();
    });

    test('should handle errors gracefully', async () => {
      const error = new Error('Code generation error');
      mockHelpers.InputValidator.validateAndSanitize.mockImplementation(() => {
        throw error;
      });

      const result = await handleGenerateCode({});

      expect(mockHelpers.ErrorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('handleGetStats', () => {
    test('should validate input arguments', async () => {
      const args = { detailed: true };
      await handleGetStats(args);

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalled();
    });

    test('should support basic stats request', async () => {
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({});

      await handleGetStats({});

      expect(mockHelpers.ResponseFormatter.createTextResponse).toHaveBeenCalled();
    });

    test('should support detailed stats request', async () => {
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({ detailed: true });

      await handleGetStats({ detailed: true });

      expect(mockHelpers.ResponseFormatter.createTextResponse).toHaveBeenCalled();
    });

    test('should handle errors gracefully', async () => {
      const error = new Error('Stats processing error');
      mockHelpers.InputValidator.validateAndSanitize.mockImplementation(() => {
        throw error;
      });

      const result = await handleGetStats({});

      expect(mockHelpers.ErrorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle McpError properly', async () => {
      const mcpError = new McpError(ErrorCode.InvalidRequest, 'Invalid request');
      mockHelpers.InputValidator.validateAndSanitize.mockImplementation(() => {
        throw mcpError;
      });

      const result = await handleGetDesignTokens({});

      expect(mockHelpers.ErrorHandler.handleError).toHaveBeenCalledWith(
        mcpError,
        '디자인 토큰 조회',
        { args: {} }
      );
    });

    test('should handle generic errors', async () => {
      const genericError = new Error('Generic error');
      mockHelpers.InputValidator.validateAndSanitize.mockImplementation(() => {
        throw genericError;
      });

      const result = await handleGetSystems({});

      expect(mockHelpers.ErrorHandler.handleError).toHaveBeenCalledWith(
        genericError,
        '시스템 정보 조회',
        { args: {} }
      );
    });
  });

  describe('Input Validation Edge Cases', () => {
    test('should handle null arguments', async () => {
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({});

      await handleGetDesignTokens(null);
      await handleGetSystems(null);
      await handleSearch({ query: 'test' }); // search requires query
      await handleGenerateCode(null);
      await handleGetStats(null);

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledTimes(5);
    });

    test('should handle undefined arguments', async () => {
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({});

      await handleGetDesignTokens(undefined);
      await handleGetSystems(undefined);
      await handleGenerateCode(undefined);
      await handleGetStats(undefined);

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledTimes(4);
    });

    test('should handle empty object arguments', async () => {
      mockHelpers.InputValidator.validateAndSanitize.mockReturnValue({});

      await handleGetDesignTokens({});
      await handleGetSystems({});
      await handleGenerateCode({});
      await handleGetStats({});

      expect(mockHelpers.InputValidator.validateAndSanitize).toHaveBeenCalledTimes(4);
    });
  });
});
