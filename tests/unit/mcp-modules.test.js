/**
 * MCP 2025 모듈 기본 테스트
 */

import { describe, test, expect } from '@jest/globals';
import { McpLogger, McpLogLevel, mcpLogger } from '../../helpers/mcp-logging.js';
import { McpResources, mcpResources } from '../../helpers/mcp-resources.js';
import { McpPagination, PaginationConfig } from '../../helpers/mcp-pagination.js';
import { McpPrompts, mcpPrompts } from '../../helpers/mcp-prompts.js';

describe('MCP 2025 Modules Basic Tests', () => {
  describe('MCP Logging System', () => {
    test('should have correct log levels', () => {
      expect(McpLogLevel.EMERGENCY).toBe('emergency');
      expect(McpLogLevel.ERROR).toBe('error');
      expect(McpLogLevel.INFO).toBe('info');
      expect(McpLogLevel.DEBUG).toBe('debug');
    });

    test('should create logger instance', () => {
      const logger = new McpLogger();
      expect(logger).toBeInstanceOf(McpLogger);
      expect(logger.loggers.size).toBeGreaterThan(0);
    });

    test('should sanitize sensitive data', () => {
      const logger = new McpLogger();
      const sensitiveData = {
        username: 'test-user',
        password: 'secret123',
        normal: 'normal-data'
      };

      const sanitized = logger.sanitizeData(sensitiveData);
      expect(sanitized.username).toBe('test-user');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.normal).toBe('normal-data');
    });

    test('should validate log levels', () => {
      const logger = new McpLogger();
      expect(logger.shouldLog(McpLogLevel.INFO)).toBe(true);
      expect(logger.shouldLog(McpLogLevel.DEBUG)).toBe(false); // default is INFO
    });

    test('global logger should be initialized', () => {
      expect(mcpLogger).toBeInstanceOf(McpLogger);
      expect(typeof mcpLogger.info).toBe('function');
    });
  });

  describe('MCP Pagination System', () => {
    test('should have configuration constants', () => {
      expect(PaginationConfig.DEFAULT_PAGE_SIZE).toBe(50);
      expect(PaginationConfig.MAX_PAGE_SIZE).toBe(1000);
      expect(PaginationConfig.MIN_PAGE_SIZE).toBe(1);
    });

    test('should create and parse cursors', () => {
      const data = { index: 0, totalItems: 100 };
      const cursor = McpPagination.createCursor(data);

      expect(cursor).toBeDefined();
      expect(typeof cursor).toBe('string');

      const parsed = McpPagination.parseCursor(cursor);
      expect(parsed.index).toBe(0);
      expect(parsed.totalItems).toBe(100);
    });

    test('should paginate arrays', () => {
      const testData = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
      const result = McpPagination.paginateArray(testData, null, 10);

      expect(result.items).toHaveLength(10);
      expect(result.pagination.totalItems).toBe(50);
      expect(result.pagination.hasNextPage).toBe(true);
    });

    test('should handle empty arrays', () => {
      const result = McpPagination.paginateArray([], null, 10);

      expect(result.items).toHaveLength(0);
      expect(result.pagination.totalItems).toBe(0);
      expect(result.pagination.hasNextPage).toBe(false);
    });

    test('should calculate fuzzy scores', () => {
      expect(McpPagination.calculateFuzzyScore('test', 'test')).toBe(1.0);
      expect(McpPagination.calculateFuzzyScore('', 'test')).toBe(0.0);
    });
  });

  describe('MCP Resources System', () => {
    test('should create resource manager', () => {
      const manager = new McpResources();
      expect(manager).toBeInstanceOf(McpResources);
      expect(manager.resources).toBeInstanceOf(Map);
    });

    test('should generate API documentation', () => {
      const manager = new McpResources();
      const apiDoc = manager.generateApiDocumentation();

      expect(apiDoc).toContain('KRDS MCP API');
      expect(apiDoc).toContain('krds_get_colors');
    });

    test('should generate Claude Desktop config', () => {
      const manager = new McpResources();
      const config = manager.generateClaudeDesktopConfig();

      expect(config).toContain('krds-mcp');
      expect(config).toContain('command');
    });

    test('should manage resources', () => {
      const manager = new McpResources();
      const stats = manager.getResourceStats();

      expect(stats).toHaveProperty('totalResources');
      expect(stats).toHaveProperty('totalTemplates');
      expect(stats.totalResources).toBeGreaterThanOrEqual(0);
    });

    test('global resource manager should be initialized', () => {
      expect(mcpResources).toBeInstanceOf(McpResources);
      expect(typeof mcpResources.listResources).toBe('function');
    });
  });

  describe('MCP Prompts System', () => {
    test('should create prompt manager', () => {
      const manager = new McpPrompts();
      expect(manager).toBeInstanceOf(McpPrompts);
      expect(manager.prompts).toBeInstanceOf(Map);
    });

    test('should manage prompts', () => {
      const manager = new McpPrompts();
      manager.initializePrompts();

      const prompts = manager.listPrompts();
      expect(prompts).toBeDefined();

      const stats = manager.getPromptStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('categories');
    });

    test('global prompt manager should be initialized', () => {
      expect(mcpPrompts).toBeInstanceOf(McpPrompts);
      expect(typeof mcpPrompts.getPrompt).toBe('function');
    });
  });

  describe('Integration Tests', () => {
    test('all MCP modules should work together', () => {
      // Test that all modules are importable and basic functionality works
      expect(mcpLogger).toBeDefined();
      expect(mcpResources).toBeDefined();
      expect(McpPagination).toBeDefined();
      expect(mcpPrompts).toBeDefined();

      // Test basic operations don't throw errors
      expect(() => mcpLogger.info('Test message')).not.toThrow();
      expect(() => mcpResources.getResourceStats()).not.toThrow();
      expect(() => McpPagination.createCursor({ index: 0 })).not.toThrow();
      expect(() => mcpPrompts.listPrompts()).not.toThrow();
    });
  });
});
