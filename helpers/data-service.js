/**
 * KRDS MCP 서버 데이터 서비스
 * 데이터 검색, 필터링, 캐싱을 담당하는 공통 서비스입니다.
 */

// import { KRDSHelper } from './base-helpers.js';
import { ErrorLogger } from './error-handling.js';

/**
 * 데이터 서비스 클래스
 */
export class DataService {
  static cache = new Map();
  static cacheExpiry = 5 * 60 * 1000; // 5분 캐시

  /**
   * 캐시 키 생성
   * @param {string} operation - 작업명
   * @param {object} params - 매개변수
   * @returns {string} 캐시 키
   */
  static generateCacheKey(operation, params) {
    return `${operation}_${JSON.stringify(params)}`;
  }

  /**
   * 캐시에서 데이터 조회
   * @param {string} key - 캐시 키
   * @returns {any} 캐시된 데이터 또는 null
   */
  static getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  /**
   * 캐시에 데이터 저장
   * @param {string} key - 캐시 키
   * @param {any} data - 저장할 데이터
   */
  static setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // 캐시 크기 제한
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  /**
   * 데이터 가용성 확인
   * @param {any} data - 확인할 데이터
   * @param {string} dataType - 데이터 타입
   * @returns {boolean} 가용성 여부
   */
  static isDataAvailable(data, dataType = 'data') {
    if (!data) {
      ErrorLogger.logError('DATA_UNAVAILABLE', 'MEDIUM', `${dataType} 데이터가 없습니다`, {
        dataType
      });
      return false;
    }

    if (Array.isArray(data) && data.length === 0) {
      ErrorLogger.logError('DATA_EMPTY', 'LOW', `${dataType} 데이터가 비어있습니다`, { dataType });
      return false;
    }

    return true;
  }

  /**
   * 안전한 데이터 접근
   * @param {object} obj - 객체
   * @param {string} path - 접근 경로 (예: 'a.b.c')
   * @param {any} defaultValue - 기본값
   * @returns {any} 값 또는 기본값
   */
  static safeGet(obj, path, defaultValue = null) {
    if (!obj || typeof obj !== 'object') {
      return defaultValue;
    }

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * 통합 검색 함수
   * @param {Array} data - 검색할 데이터 배열
   * @param {string} query - 검색어
   * @param {Array} searchFields - 검색할 필드들
   * @param {object} options - 검색 옵션
   * @returns {Array} 검색 결과
   */
  static searchData(data, query, searchFields = ['name'], options = {}) {
    if (!this.isDataAvailable(data, 'search target')) {
      return [];
    }

    const { caseSensitive = false, exactMatch = false, maxResults = 1000 } = options;

    const searchTerm = caseSensitive ? query : query.toLowerCase();

    try {
      const results = data.filter(item => {
        return searchFields.some(field => {
          const value = this.safeGet(item, field, '');
          const searchValue = caseSensitive ? String(value) : String(value).toLowerCase();

          if (exactMatch) {
            return searchValue === searchTerm;
          }
          return searchValue.includes(searchTerm);
        });
      });

      return results.slice(0, maxResults);
    } catch (error) {
      ErrorLogger.logError('SEARCH_ERROR', 'MEDIUM', `검색 중 오류 발생: ${error.message}`, {
        query,
        searchFields
      });
      return [];
    }
  }

  /**
   * 필터링 함수
   * @param {Array} data - 필터링할 데이터
   * @param {object} filters - 필터 조건
   * @param {object} options - 필터 옵션
   * @returns {Array} 필터링된 결과
   */
  static filterData(data, filters, options = {}) {
    if (!this.isDataAvailable(data, 'filter target')) {
      return [];
    }

    const { strict = false } = options;

    try {
      return data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null) {
            return true;
          }

          const itemValue = this.safeGet(item, key);

          if (strict) {
            return itemValue === value;
          }
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
        });
      });
    } catch (error) {
      ErrorLogger.logError('FILTER_ERROR', 'MEDIUM', `필터링 중 오류 발생: ${error.message}`, {
        filters
      });
      return [];
    }
  }

  /**
   * 페이지네이션 적용
   * @param {Array} data - 페이지네이션할 데이터
   * @param {number} page - 페이지 번호 (1부터 시작)
   * @param {number} pageSize - 페이지 크기
   * @returns {object} 페이지네이션 결과
   */
  static paginate(data, page = 1, pageSize = 10) {
    if (!this.isDataAvailable(data, 'pagination target')) {
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0
      };
    }

    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = data.slice(startIndex, endIndex);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  /**
   * 정렬 함수
   * @param {Array} data - 정렬할 데이터
   * @param {string} sortBy - 정렬 기준 필드
   * @param {string} order - 정렬 순서 ('asc' | 'desc')
   * @returns {Array} 정렬된 데이터
   */
  static sortData(data, sortBy, order = 'asc') {
    if (!this.isDataAvailable(data, 'sort target')) {
      return [];
    }

    try {
      return [...data].sort((a, b) => {
        const aValue = this.safeGet(a, sortBy, '');
        const bValue = this.safeGet(b, sortBy, '');

        let comparison = 0;

        if (aValue < bValue) {
          comparison = -1;
        } else if (aValue > bValue) {
          comparison = 1;
        }

        return order === 'desc' ? -comparison : comparison;
      });
    } catch (error) {
      ErrorLogger.logError('SORT_ERROR', 'MEDIUM', `정렬 중 오류 발생: ${error.message}`, {
        sortBy,
        order
      });
      return data;
    }
  }

  /**
   * 데이터 검증 및 정규화
   * @param {object} item - 검증할 항목
   * @param {object} schema - 검증 스키마
   * @returns {object} 정규화된 항목
   */
  static normalizeItem(item, schema = {}) {
    if (!item || typeof item !== 'object') {
      return {};
    }

    const normalized = {};

    Object.keys(schema).forEach(key => {
      const value = this.safeGet(item, key);
      const fieldSchema = schema[key];

      if (fieldSchema.required && (value === undefined || value === null)) {
        normalized[key] = fieldSchema.default || '';
      } else if (value !== undefined && value !== null) {
        // 타입 변환
        switch (fieldSchema.type) {
          case 'string':
            normalized[key] = String(value);
            break;
          case 'number':
            normalized[key] = Number(value) || 0;
            break;
          case 'boolean':
            normalized[key] = Boolean(value);
            break;
          case 'array':
            normalized[key] = Array.isArray(value) ? value : [value];
            break;
          default:
            normalized[key] = value;
        }
      } else if (fieldSchema.default !== undefined) {
        normalized[key] = fieldSchema.default;
      }
    });

    return normalized;
  }

  /**
   * 통합 데이터 조회 함수
   * @param {Array} data - 데이터 배열
   * @param {object} query - 조회 조건
   * @param {object} options - 조회 옵션
   * @returns {object} 조회 결과
   */
  static queryData(data, query = {}, options = {}) {
    const cacheKey = this.generateCacheKey('queryData', { query, options });
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    let result = data;

    if (query.search && query.searchFields) {
      result = this.searchData(result, query.search, query.searchFields, {
        caseSensitive: query.caseSensitive,
        exactMatch: query.exactMatch
      });
    }

    if (query.filters) {
      result = this.filterData(result, query.filters, {
        strict: query.strict
      });
    }

    if (query.sortBy) {
      result = this.sortData(result, query.sortBy, query.order);
    }

    let paginationResult = null;
    if (query.page || query.pageSize) {
      paginationResult = this.paginate(result, query.page, query.pageSize);
      result = paginationResult.items;
    }

    const finalResult = {
      items: result,
      total: paginationResult ? paginationResult.total : result.length,
      pagination: paginationResult
    };

    this.setCache(cacheKey, finalResult);
    return finalResult;
  }

  /**
   * 캐시 통계
   * @returns {object} 캐시 통계 정보
   */
  static getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    this.cache.forEach(entry => {
      if (now - entry.timestamp < this.cacheExpiry) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    });

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      hitRate: this.hitRate || 0,
      maxSize: 100,
      cacheExpiry: this.cacheExpiry
    };
  }

  /**
   * 캐시 정리
   */
  static clearExpiredCache() {
    const now = Date.now();
    const keysToDelete = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp >= this.cacheExpiry) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));

    ErrorLogger.logError('CACHE_CLEANUP', 'LOW', `만료된 캐시 ${keysToDelete.length}개 정리`, {
      cleaned: keysToDelete.length
    });
  }

  /**
   * 전체 캐시 클리어
   */
  static clearCache() {
    const size = this.cache.size;
    this.cache.clear();

    ErrorLogger.logError('CACHE_CLEAR', 'LOW', '전체 캐시 클리어 완료', { clearedEntries: size });
  }
}
