export default {
  // Test environment
  testEnvironment: 'node',

  // Module system for ES modules
  transform: {},

  // Test file patterns
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],

  // Coverage configuration (default off, use --coverage flag)
  collectCoverage: false,
  collectCoverageFrom: [
    'index.js',
    'data/**/*.js',
    'handlers/**/*.js',
    'helpers/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/*.config.js',
    '!**/*.test.js',
    '!tests/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 30,
      lines: 35,
      statements: 35
    }
  },

  // Test setup
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test timeout
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset modules between tests
  resetModules: true,

  // Error handling
  errorOnDeprecated: true,

  // Watch mode
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/coverage/', '<rootDir>/.git/']
};
