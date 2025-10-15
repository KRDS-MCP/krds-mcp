/**
 * KRDS 헬퍼 모듈 통합 인덱스
 * 모든 헬퍼 클래스와 함수를 한 곳에서 export
 */

import { AccessibilityValidator } from './accessibility-validator.js';
import { KRDSHelper } from './base-helpers.js';
import {
  InputValidator as _InputValidator,
  ValidationSchemas as _ValidationSchemas,
  ValidationError as _ValidationError,
  SpecialValidators as _SpecialValidators
} from './validation-system.js';
import {
  ErrorHandler as _ErrorHandler,
  ErrorLogger as _ErrorLogger,
  UserFriendlyMessages as _UserFriendlyMessages,
  ErrorTypes as _ErrorTypes,
  ErrorSeverity as _ErrorSeverity,
  wrapHandler as _wrapHandler,
  wrapHandlerWithMetrics as _wrapHandlerWithMetrics
} from './error-handling.js';
import { ResponseFormatter as _ResponseFormatter } from './response-formatter.js';
import { DataService as _DataService } from './data-service.js';
import {
  PerformanceCache,
  EnhancedPerformanceCache,
  Memoizer,
  PerformanceMonitor,
  RedisCacheAdapter,
  HybridCache,
  measure,
  globalCache,
  memoize,
  memoizeAsync,
  DataOptimizer,
  LazyLoader,
  MemoryOptimizer
} from './performance-helpers.js';
import { componentLibrary } from './component-library.js';
import { devTools } from './dev-tools.js';

// MCP 2025 모듈들
import { mcpLogger, McpLogger, McpLogLevel, ErrorLoggerAdapter } from './mcp-logging.js';
import { mcpResources, McpResources } from './mcp-resources.js';
import { McpPagination, PaginationConfig, PaginationHelpers } from './mcp-pagination.js';
import { mcpPrompts, McpPrompts } from './mcp-prompts.js';

// 국제화 및 성능 대시보드
import {
  I18n,
  i18n,
  t,
  setLanguage,
  getLanguage,
  formatDate,
  formatNumber,
  formatCurrency,
  LocalizedErrorMessages,
  LocalizedResponseFormatter,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
} from './i18n.js';
import { PerformanceDashboard, performanceDashboard } from './performance-dashboard.js';

// 기존 모듈들
export { AccessibilityValidator } from './accessibility-validator.js';
export { KRDSHelper } from './base-helpers.js';

// 새로운 모듈들
export { InputValidator, ValidationSchemas, ValidationError, SpecialValidators } from './validation-system.js';
export {
  ErrorHandler,
  ErrorLogger,
  UserFriendlyMessages,
  ErrorTypes,
  ErrorSeverity,
  wrapHandler,
  wrapHandlerWithMetrics
} from './error-handling.js';
export { ResponseFormatter } from './response-formatter.js';
export { DataService } from './data-service.js';

// 컴포넌트 라이브러리 및 개발자 도구
export { componentLibrary, KRDSComponentLibrary, KRDS_COMPONENT_MAPPING } from './component-library.js';
export {
  devTools,
  KRDSDevTools,
  KRDSStorybookIntegration,
  KRDSLivePreview,
  KRDSCodeSandbox,
  DEV_TOOLS_CONFIG
} from './dev-tools.js';

// Performance and optimization modules
export {
  PerformanceCache,
  EnhancedPerformanceCache,
  Memoizer,
  PerformanceMonitor,
  RedisCacheAdapter,
  HybridCache,
  measure,
  globalCache,
  memoize,
  memoizeAsync,
  DataOptimizer,
  LazyLoader,
  MemoryOptimizer
};

// MCP 2025 기능 모듈들
export { mcpLogger, McpLogger, McpLogLevel, ErrorLoggerAdapter } from './mcp-logging.js';
export { mcpResources, McpResources } from './mcp-resources.js';
export { McpPagination, PaginationConfig, PaginationHelpers } from './mcp-pagination.js';
export { mcpPrompts, McpPrompts } from './mcp-prompts.js';

// 국제화 및 성능 대시보드
export {
  I18n,
  i18n,
  t,
  setLanguage,
  getLanguage,
  formatDate,
  formatNumber,
  formatCurrency,
  LocalizedErrorMessages,
  LocalizedResponseFormatter,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
} from './i18n.js';
export { PerformanceDashboard, performanceDashboard } from './performance-dashboard.js';

// 기존 코드와의 호환성을 위한 통합 객체
export const KRDSHelperLegacy = {
  findByName: KRDSHelper.findByName,
  findByCategory: KRDSHelper.findByCategory,
  validateAccessibility: AccessibilityValidator.validateAccessibility,
  generateComponent: null, // 이 함수는 별도 파일로 분리 예정
  generateResponsiveComponent: null, // 이 함수는 별도 파일로 분리 예정
  generateDarkModeComponent: null // 이 함수는 별도 파일로 분리 예정
};
