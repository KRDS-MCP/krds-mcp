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
  Memoizer,
  PerformanceMonitor,
  DataOptimizer,
  LazyLoader,
  MemoryOptimizer,
  memoize,
  memoizeAsync,
  measure
} from './performance-helpers.js';

// 기존 모듈들
export { AccessibilityValidator } from './accessibility-validator.js';
export { KRDSHelper } from './base-helpers.js';

// 새로운 모듈들
export {
  InputValidator,
  ValidationSchemas,
  ValidationError,
  SpecialValidators
} from './validation-system.js';
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

// Performance and optimization modules
export {
  PerformanceCache as _PerformanceCache,
  Memoizer as _Memoizer,
  PerformanceMonitor as _PerformanceMonitor,
  DataOptimizer as _DataOptimizer,
  LazyLoader as _LazyLoader,
  MemoryOptimizer as _MemoryOptimizer,
  memoize as _memoize,
  memoizeAsync as _memoizeAsync,
  measure as _measure
};

// 기존 코드와의 호환성을 위한 통합 객체
export const KRDSHelperLegacy = {
  findByName: KRDSHelper.findByName,
  findByCategory: KRDSHelper.findByCategory,
  validateAccessibility: AccessibilityValidator.validateAccessibility,
  generateComponent: null, // 이 함수는 별도 파일로 분리 예정
  generateResponsiveComponent: null, // 이 함수는 별도 파일로 분리 예정
  generateDarkModeComponent: null // 이 함수는 별도 파일로 분리 예정
};
