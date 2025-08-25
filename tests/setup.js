// Jest setup file for KRDS MCP Server tests

// Global test configuration
global.console = {
  ...console,
  // Suppress console.log in tests unless NODE_ENV is 'test-verbose'
  log: process.env.NODE_ENV === 'test-verbose' ? console.warn : () => {},
  warn: console.warn,
  error: console.error
};

// Mock process.exit to prevent tests from exiting
process.exit = () => {};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Common test utilities
global.testUtils = {
  // Helper to create mock MCP requests
  createMockRequest: (tool, args = {}) => ({
    id: `test-${Date.now()}`,
    method: 'tools/call',
    params: {
      name: tool,
      arguments: args
    }
  }),

  // Helper to validate MCP response format
  validateMcpResponse: response => {
    expect(response).toHaveProperty('content');
    expect(Array.isArray(response.content)).toBe(true);
    expect(response.content.length).toBeGreaterThan(0);
    expect(response.content[0]).toHaveProperty('type');
    expect(response.content[0]).toHaveProperty('text');
  },

  // Helper to test error responses
  validateErrorResponse: (response, expectedMessage) => {
    expect(response).toHaveProperty('isError', true);
    if (expectedMessage) {
      expect(response.content[0].text).toContain(expectedMessage);
    }
  },

  // Helper to wait for async operations
  wait: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))
};

global.mockConsole = () => {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};

  return {
    restore: () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    }
  };
};
