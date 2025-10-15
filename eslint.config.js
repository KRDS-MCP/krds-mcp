import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '*.min.js', '.nyc_output/', 'CHANGELOG.md']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        global: 'readonly',
        URL: 'readonly',
        btoa: 'readonly',
        performance: 'readonly',
        Blob: 'readonly',
        require: 'readonly',
        module: 'readonly',
        // Jest globals
        expect: 'readonly',
        test: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        testUtils: 'readonly'
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'max-len': [
        'warn',
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true
        }
      ],
      complexity: ['warn', 25],
      'max-depth': ['warn', 4],
      'max-params': ['warn', 6],
      'max-lines-per-function': ['warn', { max: 350, skipBlankLines: true, skipComments: true }],
      'no-magic-numbers': [
        'warn',
        {
          ignore: [
            0, 1, -1, 2, 3, 4, 5, 6, 8, 9, 10, 15, 16, 24, 25, 36, 43, 44, 50, 60, 80, 96, 100, 114, 128, 200, 255, 299,
            360, 500, 576, 587, 768, 992, 1000, 1024, 1200, 1400, 30000, 100000, 0.05, 0.3, 0.5, 0.95, 0.99, 4.5, 7.0
          ],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true
        }
      ],
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'no-useless-return': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'arrow-spacing': 'error',
      'object-shorthand': 'error',
      'no-param-reassign': ['error', { props: false }],
      'consistent-return': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-case-declarations': 'error'
    }
  },
  // Test files overrides
  {
    files: ['tests/**/*.js', '*.test.js', '**/*.test.js', 'tests/setup.js'],
    rules: {
      'no-magic-numbers': 'off',
      'max-len': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      complexity: 'off',
      'max-lines-per-function': 'off'
    }
  },
  // Data files overrides
  {
    files: ['data/**/*.js'],
    rules: {
      'max-len': ['warn', { code: 120 }],
      'no-magic-numbers': 'off'
    }
  },
  // Helper files overrides
  {
    files: ['helpers/**/*.js'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      complexity: ['warn', 50],
      'max-lines-per-function': 'off'
    }
  },
  // Handler files overrides
  {
    files: ['handlers/**/*.js'],
    rules: {
      'max-lines-per-function': ['warn', { max: 500 }]
    }
  },
  // CLI and main files overrides
  {
    files: ['bin/cli.js', 'index.js'],
    rules: {
      'no-console': 'off', // CLI에서는 console 사용 허용
      'max-lines-per-function': ['warn', { max: 500 }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  },
  // Performance dashboard and dev tools
  {
    files: ['helpers/performance-dashboard.js', 'helpers/dev-tools.js'],
    rules: {
      'no-console': 'off' // 대시보드와 개발 도구에서는 console 사용 허용
    }
  }
];
