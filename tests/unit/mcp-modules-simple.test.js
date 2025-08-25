/**
 * MCP 2025 모듈 단순 테스트 - 커버리지 개선용
 */

import { describe, test, expect } from '@jest/globals';
import { McpLogger, McpLogLevel, mcpLogger } from '../../helpers/mcp-logging.js';
import { McpResources, mcpResources } from '../../helpers/mcp-resources.js';
import {
  McpPagination,
  PaginationConfig,
  PaginationHelpers
} from '../../helpers/mcp-pagination.js';
import { McpPrompts, mcpPrompts } from '../../helpers/mcp-prompts.js';

describe('MCP 2025 모듈 단순 테스트', () => {
  describe('McpLogger 추가 기능', () => {
    test('should set minimum log level', () => {
      const logger = new McpLogger();
      logger.setMinimumLogLevel(McpLogLevel.WARNING);
      expect(logger.minLogLevel).toBe(McpLogLevel.WARNING);
    });

    test('should manage logger levels', () => {
      const logger = new McpLogger();
      logger.setLoggerLevel('test', McpLogLevel.DEBUG);
      const loggers = logger.getLoggers();
      expect(loggers.length).toBeGreaterThan(0);
    });

    test('should enable/disable loggers', () => {
      const logger = new McpLogger();
      logger.setLoggerEnabled('test', false);
      logger.setLoggerEnabled('test', true);
      expect(logger.shouldLog(McpLogLevel.INFO, 'test')).toBe(true);
    });

    test('should clear buffer', () => {
      const logger = new McpLogger();
      logger.log(McpLogLevel.INFO, 'test');
      logger.clearBuffer();
      expect(logger.getLogStats().totalBuffered).toBe(0);
    });

    test('should use convenience methods', () => {
      const logger = new McpLogger();
      logger.emergency('test');
      logger.alert('test');
      logger.critical('test');
      logger.error('test');
      logger.warning('test');
      logger.notice('test');
      logger.info('test');
      logger.debug('test');
      expect(true).toBe(true); // 메서드 호출이 성공하면 통과
    });
  });

  describe('McpPagination 추가 기능', () => {
    test('should validate cursor', () => {
      const cursor = McpPagination.createCursor({ index: 0 });
      expect(McpPagination.isValidCursor(cursor)).toBe(true);
      expect(McpPagination.isValidCursor('invalid')).toBe(false);
    });

    test('should get field values', () => {
      const obj = { user: { name: 'test' } };
      expect(McpPagination.getFieldValue(obj, 'user.name')).toBe('test');
      expect(McpPagination.getFieldValue(obj, 'missing.field')).toBeNull();
    });

    test('should calculate fuzzy score', () => {
      expect(McpPagination.calculateFuzzyScore('test', 'test')).toBe(1.0);
      expect(McpPagination.calculateFuzzyScore('', 'test')).toBe(0.0);
      expect(McpPagination.calculateFuzzyScore('test', 'tast')).toBeGreaterThan(0.5);
    });

    test('should create metadata', () => {
      const meta = McpPagination.createMetadata(100, 10, 0, true);
      expect(meta.total).toBe(100);
      expect(meta.pageSize).toBe(10);
      expect(meta.hasNextPage).toBe(true);
    });

    test('should get stats', () => {
      const result = {
        items: [1, 2, 3],
        pagination: {
          totalItems: 10,
          pageSize: 3,
          startIndex: 0,
          endIndex: 2
        }
      };
      const stats = McpPagination.getStats(result);
      expect(stats.efficiency).toBeDefined();
      expect(stats.navigation).toBeDefined();
      expect(stats.performance).toBeDefined();
    });

    test('should perform search', () => {
      const items = [
        { name: 'Apple', category: 'fruit' },
        { name: 'Banana', category: 'fruit' }
      ];
      const results = McpPagination.performSearch(items, 'apple', ['name']);
      expect(results.length).toBe(1);
      expect(results[0]).toHaveProperty('_score');
    });

    test('should paginate search results', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        name: `Item ${i}`,
        content: i % 2 === 0 ? 'test content' : 'other content'
      }));

      const result = McpPagination.paginateSearchResults(
        items,
        'test',
        ['name', 'content'],
        null,
        10
      );

      expect(result.items.length).toBeLessThanOrEqual(10);
      expect(result.searchMetadata).toBeDefined();
      expect(result.searchMetadata.query).toBe('test');
    });
  });

  describe('PaginationHelpers 기능', () => {
    test('should validate page size', () => {
      expect(PaginationHelpers.validatePageSize(25)).toBe(25);
      expect(PaginationHelpers.validatePageSize(-5)).toBe(PaginationConfig.MIN_PAGE_SIZE); // -5는 1로 클램핑됨
      expect(PaginationHelpers.validatePageSize(2000)).toBe(PaginationConfig.MAX_PAGE_SIZE);
      expect(PaginationHelpers.validatePageSize('invalid')).toBe(
        PaginationConfig.DEFAULT_PAGE_SIZE
      );
    });

    test('should format response', () => {
      const result = {
        items: [1, 2, 3],
        nextCursor: 'next',
        pagination: { total: 100 }
      };
      const formatted = PaginationHelpers.formatResponse(result, 'data');
      expect(formatted.data).toEqual([1, 2, 3]);
      expect(formatted.nextCursor).toBe('next');
      expect(formatted._meta).toBeDefined();
    });

    test('should create error response', () => {
      const error = PaginationHelpers.createErrorResponse('Test error', 'TEST');
      expect(error.error.message).toBe('Test error');
      expect(error.error.code).toBe('TEST');
    });
  });

  describe('McpResources 추가 기능', () => {
    test('should list resources with pagination', async () => {
      const resources = new McpResources();
      const result = await resources.listResources(null, 5);
      expect(result.resources).toBeDefined();
      expect(result.resources.length).toBeLessThanOrEqual(5);
    });

    test('should get resource stats', () => {
      const resources = new McpResources();
      const stats = resources.getResourceStats();
      expect(stats.totalResources).toBeDefined();
      expect(stats.totalTemplates).toBeDefined();
      expect(stats.categories).toBeDefined();
    });

    test('should generate documentation', () => {
      const resources = new McpResources();
      const docs = resources.generateApiDocumentation();
      expect(docs).toContain('KRDS MCP API');
      expect(docs).toContain('krds_get_colors');
    });

    test('should generate Claude config', () => {
      const resources = new McpResources();
      const config = resources.generateClaudeDesktopConfig();
      expect(config).toContain('krds-mcp');
      expect(config).toContain('command');
    });

    test('should handle subscriptions', () => {
      const resources = new McpResources();
      const callback = () => {};
      resources.subscribe(callback);
      expect(resources.subscribers.has(callback)).toBe(true);
      resources.unsubscribe(callback);
      expect(resources.subscribers.has(callback)).toBe(false);
    });

    test('should read valid resources', async () => {
      const resources = new McpResources();
      const resourceList = await resources.listResources();
      if (resourceList.resources && resourceList.resources.length > 0) {
        const uri = resourceList.resources[0].uri;
        const content = await resources.readResource(uri);
        expect(content).toBeDefined();
      }
    });
  });

  describe('McpPrompts 추가 기능', () => {
    test('should list prompts', async () => {
      const prompts = new McpPrompts();
      const result = await prompts.listPrompts();
      expect(result.prompts).toBeDefined();
      expect(Array.isArray(result.prompts)).toBe(true);
      expect(result.prompts.length).toBeGreaterThan(0);
    });

    test('should get specific prompt', async () => {
      const prompts = new McpPrompts();
      const promptExists = prompts.prompts.has('krds-design-audit');
      expect(promptExists).toBe(true);

      if (promptExists) {
        const promptData = prompts.prompts.get('krds-design-audit');
        expect(promptData.name).toBe('krds-design-audit');
      }
    });

    test('should get non-existent prompt', async () => {
      const prompts = new McpPrompts();
      const prompt = await prompts.getPrompt('non-existent');
      expect(prompt).toBeNull();
    });

    test('should have prompt methods', () => {
      const prompts = new McpPrompts();
      expect(typeof prompts.getPrompt).toBe('function');
      expect(typeof prompts.listPrompts).toBe('function');
      expect(typeof prompts.getPromptStats).toBe('function');
    });

    test('should get prompt stats', () => {
      const prompts = new McpPrompts();
      const stats = prompts.getPromptStats();
      expect(stats.total).toBeDefined();
      expect(stats.categories).toBeDefined();
    });

    test('should have prompts map', () => {
      const prompts = new McpPrompts();
      expect(prompts.prompts).toBeInstanceOf(Map);
      expect(prompts.prompts.size).toBeGreaterThan(0);
    });
  });

  describe('글로벌 인스턴스 테스트', () => {
    test('should have working global instances', () => {
      expect(mcpLogger).toBeInstanceOf(McpLogger);
      expect(mcpResources).toBeInstanceOf(McpResources);
      expect(mcpPrompts).toBeInstanceOf(McpPrompts);
    });

    test('should have server integration capability', () => {
      const mockServer = { notification: () => {} };
      mcpLogger.setServer(mockServer);
      expect(mcpLogger.getLogStats().serverConnected).toBe(true);
    });
  });
});
