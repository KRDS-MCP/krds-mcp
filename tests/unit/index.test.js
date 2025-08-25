// Unit tests for main MCP server entry point (index.js)

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

// Mock all external dependencies before importing
jest.unstable_mockModule('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: jest.fn()
}));

jest.unstable_mockModule('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn()
}));

jest.unstable_mockModule('../helpers/index.js', () => ({
  ErrorLogger: {
    logError: jest.fn()
  },
  DataService: {
    clearExpiredCache: jest.fn()
  }
}));

jest.unstable_mockModule('../handlers/index.js', () => ({
  handleGetDesignPrinciples: jest.fn(),
  handleGetColors: jest.fn(),
  handleGetTypography: jest.fn(),
  handleGetComponents: jest.fn(),
  handleGetGlobalPatterns: jest.fn(),
  handleGetServicePatterns: jest.fn(),
  handleGetShapesIcons: jest.fn(),
  handleValidateAccessibility: jest.fn()
}));

jest.unstable_mockModule('../handlers/extended-handlers.js', () => ({
  handleGetDesignTokens: jest.fn(),
  handleGetSystems: jest.fn(),
  handleSearch: jest.fn(),
  handleGenerateCode: jest.fn(),
  handleGetStats: jest.fn()
}));

describe('KRDS MCP Server Main Entry Point', () => {
  let mockServer;
  let mockTransport;
  let mockHandlers;
  let mockExtendedHandlers;
  let originalProcess;
  let originalSetInterval;
  let originalConsoleError;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock Server class
    mockServer = {
      setRequestHandler: jest.fn(),
      connect: jest.fn()
    };

    // Mock Transport class
    mockTransport = {
      connect: jest.fn()
    };

    // Import mocked modules
    const { Server } = await import('@modelcontextprotocol/sdk/server/index.js');
    const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');

    Server.mockReturnValue(mockServer);
    StdioServerTransport.mockReturnValue(mockTransport);

    // Import handlers
    mockHandlers = await import('../handlers/index.js');
    mockExtendedHandlers = await import('../handlers/extended-handlers.js');

    // Mock process and global functions
    originalProcess = global.process;
    originalSetInterval = global.setInterval;
    originalConsoleError = global.console.error;

    global.process = {
      ...originalProcess,
      on: jest.fn(),
      exit: jest.fn()
    };
    global.setInterval = jest.fn();
    global.console.error = jest.fn();
  });

  afterEach(() => {
    // Restore originals
    global.process = originalProcess;
    global.setInterval = originalSetInterval;
    global.console.error = originalConsoleError;

    // Clear all timers
    jest.clearAllTimers();
  });

  describe('Server Initialization', () => {
    test('should create MCP server with correct configuration', async () => {
      // Import the main module to trigger initialization
      await import('../../index.js');

      const { Server } = await import('@modelcontextprotocol/sdk/server/index.js');

      expect(Server).toHaveBeenCalledWith(
        {
          name: 'krds-mcp-server',
          version: '1.0.0'
        },
        {
          capabilities: {
            tools: {}
          }
        }
      );
    });

    test('should setup request handlers for ListTools and CallTool', async () => {
      await import('../../index.js');

      expect(mockServer.setRequestHandler).toHaveBeenCalledTimes(2);

      // Should have handlers for both ListToolsRequestSchema and CallToolRequestSchema
      const calls = mockServer.setRequestHandler.mock.calls;
      expect(calls).toHaveLength(2);
    });

    test('should connect to StdioServerTransport', async () => {
      await import('../../index.js');

      const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
      expect(StdioServerTransport).toHaveBeenCalled();
      expect(mockServer.connect).toHaveBeenCalledWith(mockTransport);
    });
  });

  describe('Tool Registration', () => {
    let toolsHandler;

    beforeEach(async () => {
      await import('../../index.js');

      // Get the ListTools handler from the setRequestHandler calls
      const calls = mockServer.setRequestHandler.mock.calls;
      const listToolsCall = calls.find(
        call =>
          call[0].properties &&
          call[0].properties.method &&
          call[0].properties.method.const === 'tools/list'
      );
      toolsHandler = listToolsCall ? listToolsCall[1] : calls[0][1];
    });

    test('should register all 15 KRDS tools', async () => {
      const result = await toolsHandler();

      expect(result).toHaveProperty('tools');
      expect(Array.isArray(result.tools)).toBe(true);
      expect(result.tools).toHaveLength(15);
    });

    test('should register krds_get_design_principles tool with correct schema', async () => {
      const result = await toolsHandler();

      const tool = result.tools.find(t => t.name === 'krds_get_design_principles');
      expect(tool).toBeDefined();
      expect(tool.description).toBe('KRDS 디자인 원칙 조회');
      expect(tool.inputSchema).toHaveProperty('type', 'object');
      expect(tool.inputSchema.properties).toHaveProperty('principle');
    });

    test('should register krds_get_colors tool with enum categories', async () => {
      const result = await toolsHandler();

      const tool = result.tools.find(t => t.name === 'krds_get_colors');
      expect(tool).toBeDefined();
      expect(tool.description).toBe('KRDS 색상 체계 조회 (완전한 색상 시스템)');

      const categoryProperty = tool.inputSchema.properties.category;
      expect(categoryProperty.enum).toEqual([
        'primary',
        'system',
        'neutral',
        'emphasis',
        'graphic'
      ]);
    });

    test('should register krds_get_typography tool with correct categories', async () => {
      const result = await toolsHandler();

      const tool = result.tools.find(t => t.name === 'krds_get_typography');
      expect(tool).toBeDefined();

      const categoryProperty = tool.inputSchema.properties.category;
      expect(categoryProperty.enum).toEqual([
        'display',
        'heading',
        'body',
        'interactive',
        'utility'
      ]);
    });

    test('should register krds_get_components tool with all component categories', async () => {
      const result = await toolsHandler();

      const tool = result.tools.find(t => t.name === 'krds_get_components');
      expect(tool).toBeDefined();
      expect(tool.description).toBe('KRDS 컴포넌트 정보 조회 (37개 전체 컴포넌트)');

      const categoryProperty = tool.inputSchema.properties.category;
      expect(categoryProperty.enum).toEqual([
        'identity',
        'navigation',
        'layout-expression',
        'action',
        'selection',
        'feedback',
        'help',
        'input',
        'settings',
        'content'
      ]);
    });

    test('should register extended handler tools with correct schemas', async () => {
      const result = await toolsHandler();

      const extendedTools = [
        'krds_get_design_tokens',
        'krds_get_systems',
        'krds_search',
        'krds_generate_code',
        'krds_get_stats'
      ];

      extendedTools.forEach(toolName => {
        const tool = result.tools.find(t => t.name === toolName);
        expect(tool).toBeDefined();
        expect(tool.inputSchema).toHaveProperty('type', 'object');
      });
    });

    test('should register krds_validate_accessibility with required htmlCode parameter', async () => {
      const result = await toolsHandler();

      const tool = result.tools.find(t => t.name === 'krds_validate_accessibility');
      expect(tool).toBeDefined();
      expect(tool.inputSchema.required).toEqual(['htmlCode']);
      expect(tool.inputSchema.properties.htmlCode.type).toBe('string');
    });
  });

  describe('Tool Call Routing', () => {
    let callToolHandler;

    beforeEach(async () => {
      await import('../../index.js');

      // Get the CallTool handler from the setRequestHandler calls
      const calls = mockServer.setRequestHandler.mock.calls;
      const callToolCall = calls.find(
        call =>
          call[0].properties &&
          call[0].properties.method &&
          call[0].properties.method.const === 'tools/call'
      );
      callToolHandler = callToolCall ? callToolCall[1] : calls[1][1];
    });

    test('should route krds_get_design_principles to correct handler', async () => {
      const request = {
        params: {
          name: 'krds_get_design_principles',
          arguments: { principle: 'test' }
        }
      };

      mockHandlers.handleGetDesignPrinciples.mockResolvedValue({ content: [] });

      await callToolHandler(request);

      expect(mockHandlers.handleGetDesignPrinciples).toHaveBeenCalledWith({ principle: 'test' });
    });

    test('should route krds_get_colors to correct handler', async () => {
      const request = {
        params: {
          name: 'krds_get_colors',
          arguments: { category: 'primary' }
        }
      };

      mockHandlers.handleGetColors.mockResolvedValue({ content: [] });

      await callToolHandler(request);

      expect(mockHandlers.handleGetColors).toHaveBeenCalledWith({ category: 'primary' });
    });

    test('should route extended handlers correctly', async () => {
      const extendedToolTests = [
        { name: 'krds_get_design_tokens', handler: mockExtendedHandlers.handleGetDesignTokens },
        { name: 'krds_get_systems', handler: mockExtendedHandlers.handleGetSystems },
        { name: 'krds_search', handler: mockExtendedHandlers.handleSearch },
        { name: 'krds_generate_code', handler: mockExtendedHandlers.handleGenerateCode },
        { name: 'krds_get_stats', handler: mockExtendedHandlers.handleGetStats }
      ];

      for (const { name, handler } of extendedToolTests) {
        handler.mockResolvedValue({ content: [] });

        const request = {
          params: {
            name,
            arguments: { test: 'data' }
          }
        };

        await callToolHandler(request);

        expect(handler).toHaveBeenCalledWith({ test: 'data' });
        handler.mockClear();
      }
    });

    test('should throw McpError for unknown tools', async () => {
      const request = {
        params: {
          name: 'unknown_tool',
          arguments: {}
        }
      };

      await expect(callToolHandler(request)).rejects.toThrow(McpError);
      await expect(callToolHandler(request)).rejects.toThrow('알 수 없는 도구: unknown_tool');
    });

    test('should handle errors from tool handlers', async () => {
      const request = {
        params: {
          name: 'krds_get_design_principles',
          arguments: {}
        }
      };

      const originalError = new Error('Handler error');
      mockHandlers.handleGetDesignPrinciples.mockRejectedValue(originalError);

      await expect(callToolHandler(request)).rejects.toThrow(McpError);
      await expect(callToolHandler(request)).rejects.toThrow(
        '도구 실행 중 오류 발생: Handler error'
      );
    });
  });

  describe('Error Handling and Process Management', () => {
    beforeEach(async () => {
      await import('../../index.js');
    });

    test('should setup uncaught exception handler', () => {
      expect(global.process.on).toHaveBeenCalledWith('uncaughtException', expect.any(Function));
    });

    test('should setup unhandled rejection handler', () => {
      expect(global.process.on).toHaveBeenCalledWith('unhandledRejection', expect.any(Function));
    });

    test('should handle uncaught exceptions properly', async () => {
      const { ErrorLogger } = await import('../helpers/index.js');

      // Get the uncaught exception handler
      const calls = global.process.on.mock.calls;
      const uncaughtCall = calls.find(call => call[0] === 'uncaughtException');
      const handler = uncaughtCall[1];

      const error = new Error('Test uncaught exception');
      error.stack = 'test stack trace';

      handler(error);

      expect(ErrorLogger.logError).toHaveBeenCalledWith(
        'UNCAUGHT_EXCEPTION',
        'CRITICAL',
        '처리되지 않은 예외: Test uncaught exception',
        { stack: 'test stack trace' }
      );
      expect(global.console.error).toHaveBeenCalledWith('치명적 오류:', error);
      expect(global.process.exit).toHaveBeenCalledWith(1);
    });

    test('should handle unhandled promise rejections', async () => {
      const { ErrorLogger } = await import('../helpers/index.js');

      // Get the unhandled rejection handler
      const calls = global.process.on.mock.calls;
      const rejectionCall = calls.find(call => call[0] === 'unhandledRejection');
      const handler = rejectionCall[1];

      const reason = 'Test rejection reason';
      const promise = Promise.resolve();

      handler(reason, promise);

      expect(ErrorLogger.logError).toHaveBeenCalledWith(
        'UNHANDLED_REJECTION',
        'HIGH',
        '처리되지 않은 Promise 거부: Test rejection reason',
        { promise }
      );
      expect(global.console.error).toHaveBeenCalledWith('처리되지 않은 Promise 거부:', reason);
    });

    test('should setup periodic cache cleanup', async () => {
      expect(global.setInterval).toHaveBeenCalledWith(
        expect.any(Function),
        10 * 60 * 1000 // 10 minutes
      );
    });

    test('should call DataService.clearExpiredCache in interval', async () => {
      const { DataService } = await import('../helpers/index.js');

      // Get the interval handler
      const intervalCall = global.setInterval.mock.calls[0];
      const handler = intervalCall[0];

      handler();

      expect(DataService.clearExpiredCache).toHaveBeenCalled();
    });
  });

  describe('Server Startup Messages', () => {
    beforeEach(async () => {
      await import('../../index.js');
    });

    test('should log Korean startup messages', () => {
      expect(global.console.error).toHaveBeenCalledWith('KRDS MCP 서버가 시작되었습니다.');
      expect(global.console.error).toHaveBeenCalledWith(
        '입력 검증 및 오류 처리 시스템이 활성화되었습니다.'
      );
    });
  });

  describe('Korean Language Support', () => {
    let toolsHandler;

    beforeEach(async () => {
      await import('../../index.js');

      const calls = mockServer.setRequestHandler.mock.calls;
      toolsHandler = calls[0][1];
    });

    test('should have Korean descriptions for all tools', async () => {
      const result = await toolsHandler();

      result.tools.forEach(tool => {
        expect(tool.description).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/); // Korean characters
      });
    });

    test('should have Korean parameter descriptions', async () => {
      const result = await toolsHandler();

      const toolsWithKoreanParams = result.tools.filter(tool =>
        Object.values(tool.inputSchema.properties || {}).some(
          prop => prop.description && prop.description.match(/[\u3131-\u3163\uAC00-\uD7A3]/)
        )
      );

      expect(toolsWithKoreanParams.length).toBeGreaterThan(0);
    });
  });
});
