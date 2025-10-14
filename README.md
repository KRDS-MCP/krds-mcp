# KRDS MCP Server

[![CI/CD Pipeline](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/ci.yml)
[![CodeQL](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/codeql.yml/badge.svg)](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/codeql.yml)
[![codecov](https://codecov.io/gh/KRDS-MCP/krds-mcp/branch/main/graph/badge.svg)](https://codecov.io/gh/KRDS-MCP/krds-mcp)
[![Tests](https://img.shields.io/badge/tests-60%20passing-brightgreen)](https://github.com/KRDS-MCP/krds-mcp/actions)
[![Coverage](https://img.shields.io/badge/coverage-80%25-green)](https://codecov.io/gh/KRDS-MCP/krds-mcp)
[![npm version](https://img.shields.io/npm/v/@krds-mcp/krds-mcp)](https://www.npmjs.com/package/@krds-mcp/krds-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@krds-mcp/krds-mcp)](https://www.npmjs.com/package/@krds-mcp/krds-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [한국어](./README.ko.md)

A Model Context Protocol (MCP) server that provides design system information to AI models based on the KRDS (Korea Government Design System) guidelines, which is the standard design system for Korean government digital services.

**Purpose**: Support AI assistants in complying with KRDS design guidelines when developing Korean government websites and digital services.

## Quick Start with NPX (Recommended)

Using `npx` allows you to run the latest version of the KRDS MCP server without installation. This method is most convenient and stable when integrating with AI assistants like Claude Desktop.

### 1. Integration with AI Tools

#### Claude Desktop

Add the following `mcpServers` entry to your Claude Desktop configuration file (`claude_desktop_config.json`):

```jsonc
{
  "mcpServers": {
    "krds-mcp": {
      "command": "npx",
      "args": ["@krds-mcp/krds-mcp"],
      "env": {}
    }
  }
}
```

Now restart Claude Desktop, and the AI will be able to utilize KRDS design system information.

#### Visual Studio Code

1. Global installation:

```powershell
npm install -g @krds-mcp/krds-mcp
```

2. Add the following to VS Code settings (`settings.json`):

```jsonc
{
  "ai.experimental.contextProviders": {
    "krds-mcp": {
      "command": "krds-mcp",
      "title": "KRDS Design System",
      "when": "resourceExtname =~ /\\.(js|jsx|ts|tsx|html|css)$/"
    }
  }
}
```

#### Claude Code

For Claude Code, create a `claude.json` file in your project root directory and add:

```jsonc
{
  "contextProviders": {
    "krds-mcp": {
      "command": "npx",
      "args": ["@krds-mcp/krds-mcp"],
      "env": {}
    }
  }
}
```

#### Cursor

For Cursor, create a `.cursor` directory in your project root and add the following to `settings.json`:

```jsonc
{
  "contextProviders": {
    "krds-mcp": {
      "command": "npx @krds-mcp/krds-mcp",
      "enabled": true,
      "filePattern": "**/*.{js,jsx,ts,tsx,html,css}"
    }
  }
}
```

### 2. Direct Terminal Execution

Use this when you want to verify server operation or run it independently:

```powershell
# Run server (basic command)
npx @krds-mcp/krds-mcp

# View help (check all available command options)
npx @krds-mcp/krds-mcp --help

# Check version
npx @krds-mcp/krds-mcp --version
```

## Project Structure

```text
krds-mcp/
├── data/                          # Design system data
│   ├── design-principles.js      # Design principles (7 core principles)
│   ├── colors.js                 # Color system (Primary, System, Neutral, etc.)
│   ├── typography.js             # Typography (Display, Heading, Body, etc.)
│   ├── components.js             # UI components (37 standard components)
│   ├── patterns.js               # Design patterns (Global, Service patterns)
│   ├── shapes-icons.js           # Shapes and icons system
│   ├── design-tokens.js          # Design tokens (colors, typography, spacing, etc.)
│   ├── systems.js                # Systems (spacing, grid, responsive, dark mode)
│   └── index.js                  # Data integration index
├── handlers/                      # MCP handlers
│   ├── extended-handlers.js      # Extended handlers (patterns, tokens, stats)
│   └── index.js                  # Handler integration
├── helpers/                       # Helper functions
│   ├── accessibility-validator.js # Accessibility validation (WCAG 2.1 AA)
│   ├── base-helpers.js           # Basic utility functions
│   ├── validation-system.js      # Input validation system
│   ├── error-handling.js         # Error handling system
│   ├── response-formatter.js     # Response formatter
│   ├── data-service.js          # Data service layer
│   ├── performance-helpers.js    # Performance optimization
│   └── index.js                  # Helper integration index
├── tests/                        # Test files
│   ├── unit/                    # Unit tests
│   └── integration/             # Integration tests
├── index.js                      # MCP server entry point
├── package.json                  # Project configuration
└── README.md                     # Project documentation
```

## Getting Started

### NPX Quick Start (Recommended)

```powershell
# Run without installation
npx @krds-mcp/krds-mcp

# View help
npx @krds-mcp/krds-mcp --help

# Check version
npx @krds-mcp/krds-mcp --version
```

### Local Installation

```powershell
# Global installation
npm install -g @krds-mcp/krds-mcp

# Local project installation
npm install @krds-mcp/krds-mcp

# Development dependencies (for developers)
npm install
```

### Development Environment Setup

```powershell
# Install dependencies
npm install

# Run lint and format checks
npm run quality

# Run tests
npm test

# Run in development mode (auto-restart on file changes)
npm run dev
```

## Key Features

- **Complete KRDS Data**: Includes all elements from the latest KRDS guidelines
- **MCP Protocol Support**: Full compatibility with Claude and other AI models
- **Korean Priority**: Korean error messages and descriptions
- **Accessibility Validation**: Automatic validation against WCAG 2.1 AA standards
- **Performance Optimization**: Caching, memoization, lazy loading
- **Extensible Structure**: Modularized design for easy feature additions
- **Internationalization (i18n)**: Full Korean and English language support
- **Performance Dashboard**: Real-time performance monitoring and recommendations

## Quality Metrics

- **Tests**: 160+ tests passing (includes 107 new tests for i18n and performance monitoring)
- **Test Coverage**: Target 80% (significantly improved with new test suites)
- **Code Quality**: ESLint + Prettier integrated configuration
- **Security**: Automatic CodeQL security scanning
- **Compatibility**: Supports Node.js 18, 20, 21
- **Performance**: Caching and memoization optimization
- **Monitoring**: Real-time performance dashboard with alerting

## Advanced Features

### Internationalization (i18n)

The server now supports full Korean and English localization:

```javascript
import { I18n, t, setLanguage } from './helpers/i18n.js';

// Change language
setLanguage('en');

// Translate messages
console.log(t('common.success')); // "Success"
console.log(t('errors.validation.required', { field: 'email' })); // "email is required"

// Format dates, numbers, and currency
console.log(formatDate(new Date())); // Locale-specific date format
console.log(formatNumber(1234567)); // Locale-specific number format
console.log(formatCurrency(10000, 'KRW')); // Locale-specific currency format
```

### Performance Dashboard

Monitor server performance in real-time:

```javascript
import { performanceDashboard } from './helpers/performance-dashboard.js';

// Start monitoring (auto-starts in development mode)
performanceDashboard.start();

// Get current status
const status = performanceDashboard.getStatus();

// Generate performance report
const report = performanceDashboard.generateReport('1h');

// Get recommendations
console.log(report.recommendations);
```

The dashboard automatically tracks:
- Memory usage (heap, RSS, external)
- Cache hit rates and performance
- Operation durations and error rates
- Performance warnings and recommendations

## Contributing

See [Contributing Guidelines](https://github.com/KRDS-MCP/krds-mcp/blob/main/CONTRIBUTING.md) for detailed information.

## License

This project is distributed under the MIT License.

## Links

- [KRDS (Korea Design System)](https://www.krds.go.kr/)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Project Issue Tracker](https://github.com/KRDS-MCP/krds-mcp/issues)
- [Contributing Guidelines](https://github.com/KRDS-MCP/krds-mcp/blob/main/CONTRIBUTING.md)
