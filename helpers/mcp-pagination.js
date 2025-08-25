/**
 * MCP 2025 Pagination 시스템 구현
 * 커서 기반 페이지네이션을 지원하는 유틸리티
 */

import { mcpLogger } from './mcp-logging.js';

/**
 * MCP 페이지네이션 유틸리티
 */
export class McpPagination {
  /**
   * 커서 생성
   * @param {object} data - 커서 데이터
   * @returns {string} Base64 인코딩된 커서
   */
  static createCursor(data) {
    try {
      const cursorData = {
        ...data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      return Buffer.from(JSON.stringify(cursorData)).toString('base64');
    } catch (error) {
      mcpLogger.error('Failed to create cursor', 'pagination', { data, error: error.message });
      throw new Error('Failed to create pagination cursor');
    }
  }

  /**
   * 커서 파싱
   * @param {string} cursor - Base64 인코딩된 커서
   * @returns {object} 파싱된 커서 데이터
   */
  static parseCursor(cursor) {
    try {
      if (!cursor || typeof cursor !== 'string') {
        return null;
      }

      const decoded = Buffer.from(cursor, 'base64').toString('utf8');
      const data = JSON.parse(decoded);

      // 커서 유효성 검증
      if (!data.timestamp || !data.version) {
        throw new Error('Invalid cursor format');
      }

      // 커서 만료 검증 (24시간)
      const createdTime = new Date(data.timestamp);
      const now = new Date();
      const diffHours = (now - createdTime) / (1000 * 60 * 60);

      if (diffHours > 24) {
        throw new Error('Cursor has expired');
      }

      return data;
    } catch (error) {
      mcpLogger.warning('Failed to parse cursor', 'pagination', { cursor, error: error.message });
      throw new Error('Invalid pagination cursor');
    }
  }

  /**
   * 배열 페이지네이션
   * @param {Array} items - 전체 아이템 배열
   * @param {string} cursor - 페이지네이션 커서
   * @param {number} limit - 페이지 크기
   * @param {string} sortField - 정렬 필드 (선택사항)
   * @param {string} sortOrder - 정렬 순서 ('asc' 또는 'desc')
   * @returns {object} 페이지네이션 결과
   */
  static paginateArray(items, cursor = null, limit = 50, sortField = null, sortOrder = 'asc') {
    try {
      // 입력 검증
      if (!Array.isArray(items)) {
        throw new Error('Items must be an array');
      }

      let validatedLimit = limit;
      if (validatedLimit <= 0 || validatedLimit > 1000) {
        validatedLimit = Math.min(Math.max(validatedLimit, 1), 1000); // 1-1000 범위로 제한
      }

      // 정렬 (선택사항)
      const sortedItems = [...items];
      if (sortField) {
        sortedItems.sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];

          let comparison = 0;
          if (aVal < bVal) {
            comparison = -1;
          }
          if (aVal > bVal) {
            comparison = 1;
          }

          return sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      // 커서 파싱
      let startIndex = 0;
      if (cursor) {
        const cursorData = this.parseCursor(cursor);
        startIndex = cursorData.index || 0;

        // 커서 데이터 무결성 검증
        if (cursorData.totalItems && cursorData.totalItems !== items.length) {
          mcpLogger.warning('Cursor total items mismatch', 'pagination', {
            cursorTotal: cursorData.totalItems,
            actualTotal: items.length
          });
        }
      }

      // 페이지 슬라이싱
      const endIndex = Math.min(startIndex + validatedLimit, sortedItems.length);
      const pageItems = sortedItems.slice(startIndex, endIndex);

      // 결과 구성
      const result = {
        items: pageItems,
        pagination: {
          totalItems: sortedItems.length,
          pageSize: pageItems.length,
          startIndex,
          endIndex: endIndex - 1,
          hasNextPage: endIndex < sortedItems.length,
          hasPreviousPage: startIndex > 0
        }
      };

      // nextCursor 생성
      if (endIndex < sortedItems.length) {
        result.nextCursor = this.createCursor({
          index: endIndex,
          totalItems: sortedItems.length,
          limit: validatedLimit,
          sortField,
          sortOrder
        });
      }

      // previousCursor 생성 (선택사항)
      if (startIndex > 0) {
        const prevStartIndex = Math.max(0, startIndex - validatedLimit);
        result.previousCursor = this.createCursor({
          index: prevStartIndex,
          totalItems: sortedItems.length,
          limit: validatedLimit,
          sortField,
          sortOrder
        });
      }

      mcpLogger.debug('Array paginated', 'pagination', {
        totalItems: sortedItems.length,
        pageSize: pageItems.length,
        startIndex,
        endIndex,
        hasNextPage: result.pagination.hasNextPage
      });

      return result;
    } catch (error) {
      mcpLogger.error('Array pagination failed', 'pagination', {
        itemsLength: items?.length,
        cursor,
        limit,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * 검색 결과 페이지네이션
   * @param {Array} items - 전체 아이템 배열
   * @param {string} query - 검색어
   * @param {Array} searchFields - 검색 대상 필드들
   * @param {string} cursor - 페이지네이션 커서
   * @param {number} limit - 페이지 크기
   * @returns {object} 페이지네이션된 검색 결과
   */
  static paginateSearchResults(items, query, searchFields, cursor = null, limit = 50) {
    try {
      // 검색 수행
      const searchResults = this.performSearch(items, query, searchFields);

      // 검색 결과에 점수 기반 정렬 적용
      const sortedResults = searchResults.sort((a, b) => (b._score || 0) - (a._score || 0));

      // 페이지네이션 적용
      const paginationResult = this.paginateArray(sortedResults, cursor, limit);

      // 검색 메타데이터 추가
      paginationResult.searchMetadata = {
        query,
        searchFields,
        totalMatches: sortedResults.length,
        originalTotal: items.length
      };

      return paginationResult;
    } catch (error) {
      mcpLogger.error('Search pagination failed', 'pagination', {
        query,
        searchFields,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * 검색 수행
   * @param {Array} items - 검색 대상 아이템들
   * @param {string} query - 검색어
   * @param {Array} searchFields - 검색 필드들
   * @returns {Array} 검색 결과 (점수 포함)
   */
  static performSearch(items, query, searchFields) {
    if (!query || !query.trim()) {
      return items.map(item => ({ ...item, _score: 1.0 }));
    }

    const queryLower = query.toLowerCase().trim();
    const queryWords = queryLower.split(/\s+/);

    return items
      .map(item => {
        let score = 0;
        let matches = 0;

        searchFields.forEach(field => {
          const fieldValue = this.getFieldValue(item, field);
          if (!fieldValue) {
            return;
          }

          const fieldValueLower = fieldValue.toString().toLowerCase();

          // 정확한 매치
          if (fieldValueLower.includes(queryLower)) {
            score += 10;
            matches++;
          }

          // 단어별 매치
          queryWords.forEach(word => {
            if (fieldValueLower.includes(word)) {
              score += 5;
              matches++;
            }
          });

          // 퍼지 매치 (편집 거리 기반)
          const fuzzyScore = this.calculateFuzzyScore(fieldValueLower, queryLower);
          if (fuzzyScore > PaginationConfig.FUZZY_MATCH_THRESHOLD) {
            score += fuzzyScore * 3;
            matches++;
          }
        });

        return matches > 0 ? { ...item, _score: score } : null;
      })
      .filter(item => item !== null);
  }

  /**
   * 중첩된 필드 값 가져오기
   * @param {object} obj - 객체
   * @param {string} field - 필드 경로 (예: 'user.name')
   * @returns {*} 필드 값
   */
  static getFieldValue(obj, field) {
    return field.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * 퍼지 매칭 점수 계산
   * @param {string} str1 - 첫 번째 문자열
   * @param {string} str2 - 두 번째 문자열
   * @returns {number} 유사도 점수 (0-1)
   */
  static calculateFuzzyScore(str1, str2) {
    if (str1 === str2) {
      return 1.0;
    }
    if (str1.length === 0 || str2.length === 0) {
      return 0.0;
    }

    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return 1.0 - distance / maxLength;
  }

  /**
   * 페이지네이션 메타데이터 생성
   * @param {number} total - 전체 아이템 수
   * @param {number} pageSize - 현재 페이지 크기
   * @param {number} startIndex - 시작 인덱스
   * @param {boolean} hasNextPage - 다음 페이지 존재 여부
   * @returns {object} 메타데이터
   */
  static createMetadata(total, pageSize, startIndex, hasNextPage) {
    return {
      total,
      pageSize,
      startIndex,
      endIndex: startIndex + pageSize - 1,
      hasNextPage,
      hasPreviousPage: startIndex > 0,
      estimatedPages: Math.ceil(total / Math.max(pageSize, 1))
    };
  }

  /**
   * 커서 유효성 검증
   * @param {string} cursor - 검증할 커서
   * @returns {boolean} 유효성 여부
   */
  static isValidCursor(cursor) {
    try {
      this.parseCursor(cursor);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 페이지네이션 통계
   * @param {object} paginationResult - 페이지네이션 결과
   * @returns {object} 통계 정보
   */
  static getStats(paginationResult) {
    const { items, pagination } = paginationResult;

    return {
      efficiency: {
        loadRatio: pagination.pageSize / pagination.totalItems,
        compressionRatio: items.length / pagination.totalItems
      },
      navigation: {
        currentPosition: pagination.startIndex / pagination.totalItems,
        progressPercentage: Math.round(((pagination.endIndex + 1) / pagination.totalItems) * 100)
      },
      performance: {
        itemsPerPage: pagination.pageSize,
        totalPages: Math.ceil(pagination.totalItems / Math.max(pagination.pageSize, 1)),
        remainingItems: pagination.totalItems - (pagination.endIndex + 1)
      }
    };
  }
}

/**
 * 페이지네이션 설정
 */
export const PaginationConfig = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 1000,
  MIN_PAGE_SIZE: 1,
  CURSOR_TTL_HOURS: 24,
  SEARCH_SCORE_THRESHOLD: 0.1,
  FUZZY_MATCH_THRESHOLD: 0.7
};

/**
 * 페이지네이션 헬퍼 함수들
 */
export const PaginationHelpers = {
  /**
   * 안전한 페이지 크기 검증
   * @param {number} size - 요청된 페이지 크기
   * @returns {number} 검증된 페이지 크기
   */
  validatePageSize(size) {
    if (typeof size !== 'number' || isNaN(size)) {
      return PaginationConfig.DEFAULT_PAGE_SIZE;
    }

    return Math.min(Math.max(size, PaginationConfig.MIN_PAGE_SIZE), PaginationConfig.MAX_PAGE_SIZE);
  },

  /**
   * 페이지네이션 응답 포맷터
   * @param {object} result - 페이지네이션 결과
   * @param {string} dataKey - 데이터 키 이름
   * @returns {object} 포맷된 응답
   */
  formatResponse(result, dataKey = 'items') {
    const response = {
      [dataKey]: result.items
    };

    if (result.nextCursor) {
      response.nextCursor = result.nextCursor;
    }

    if (result.previousCursor) {
      response.previousCursor = result.previousCursor;
    }

    if (result.pagination) {
      response._meta = {
        pagination: result.pagination
      };
    }

    return response;
  },

  /**
   * 에러 응답 생성
   * @param {string} message - 에러 메시지
   * @param {string} code - 에러 코드
   * @returns {object} 에러 응답
   */
  createErrorResponse(message, code = 'PAGINATION_ERROR') {
    return {
      error: {
        code,
        message,
        timestamp: new Date().toISOString()
      }
    };
  }
};

export default McpPagination;
