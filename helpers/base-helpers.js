/**
 * KRDS 기본 헬퍼 함수들
 * 공통적으로 사용되는 유틸리티 함수들
 */

export class KRDSHelper {
  /**
   * 이름으로 배열에서 항목 찾기
   * @param {Array} array - 검색할 배열
   * @param {string} name - 찾을 이름
   * @param {string} searchField - 검색할 필드명 (기본값: 'name')
   * @returns {object|null} 찾은 항목 또는 null
   */
  static findByName(array, name, searchField = 'name') {
    if (!array || !Array.isArray(array) || !name) {
      return null;
    }

    return array.find(
      item => item[searchField] && item[searchField].toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * 카테고리로 배열에서 항목들 찾기
   * @param {Array} array - 검색할 배열
   * @param {string} category - 찾을 카테고리
   * @returns {Array} 찾은 항목들의 배열
   */
  static findByCategory(array, category) {
    if (!array || !Array.isArray(array) || !category) {
      return [];
    }

    return array.filter(
      item => item.category && item.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * 배열에서 여러 조건으로 검색
   * @param {Array} array - 검색할 배열
   * @param {object} filters - 검색 조건들
   * @returns {Array} 검색 결과
   */
  static findByFilters(array, filters) {
    if (!array || !Array.isArray(array) || !filters) {
      return [];
    }

    return array.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key];
        const itemValue = item[key];

        if (typeof filterValue === 'string') {
          return itemValue && itemValue.toLowerCase().includes(filterValue.toLowerCase());
        }

        if (typeof filterValue === 'number') {
          return itemValue === filterValue;
        }

        if (Array.isArray(filterValue)) {
          return filterValue.some(
            val => itemValue && itemValue.toLowerCase().includes(val.toLowerCase())
          );
        }

        return itemValue === filterValue;
      });
    });
  }

  /**
   * 색상 코드 유효성 검사
   * @param {string} colorCode - 검사할 색상 코드
   * @returns {boolean} 유효성 여부
   */
  static isValidColorCode(colorCode) {
    if (!colorCode || typeof colorCode !== 'string') {
      return false;
    }

    // HEX 색상 코드 검사
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexPattern.test(colorCode)) {
      return true;
    }

    // RGB 색상 코드 검사
    const rgbPattern = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
    const rgbMatch = colorCode.match(rgbPattern);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
    }

    // HSL 색상 코드 검사
    const hslPattern = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
    const hslMatch = colorCode.match(hslPattern);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
    }

    return false;
  }

  /**
   * 색상 대비 비율 계산 (간단한 버전)
   * @param {string} color1 - 첫 번째 색상
   * @param {string} color2 - 두 번째 색상
   * @returns {number} 대비 비율
   */
  static calculateContrastRatio(color1, color2) {
    // 간단한 대비 계산 (실제로는 더 복잡한 알고리즘 필요)
    if (!this.isValidColorCode(color1) || !this.isValidColorCode(color2)) {
      return 1;
    }

    // HEX를 RGB로 변환하여 밝기 계산
    const getBrightness = color => {
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
      }
      return 128; // 기본값
    };

    const brightness1 = getBrightness(color1);
    const brightness2 = getBrightness(color2);

    const lighter = Math.max(brightness1, brightness2);
    const darker = Math.min(brightness1, brightness2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * 접근성 수준 판정
   * @param {number} contrastRatio - 대비 비율
   * @returns {string} 접근성 수준
   */
  static getAccessibilityLevel(contrastRatio) {
    if (contrastRatio >= 7.0) {
      return 'AAA';
    }
    if (contrastRatio >= 4.5) {
      return 'AA';
    }
    if (contrastRatio >= 3.0) {
      return 'A';
    }
    return 'Fail';
  }

  /**
   * 반응형 브레이크포인트 확인
   * @param {number} width - 화면 너비
   * @returns {string} 브레이크포인트
   */
  static getBreakpoint(width) {
    if (width < 576) {
      return 'xs';
    }
    if (width < 768) {
      return 'sm';
    }
    if (width < 992) {
      return 'md';
    }
    if (width < 1200) {
      return 'lg';
    }
    if (width < 1400) {
      return 'xl';
    }
    return 'xxl';
  }

  /**
   * CSS 값 정규화
   * @param {string|number} value - 정규화할 값
   * @param {string} unit - 단위 (기본값: 'px')
   * @returns {string} 정규화된 CSS 값
   */
  static normalizeCSSValue(value, unit = 'px') {
    if (typeof value === 'number') {
      return `${value}${unit}`;
    }

    if (typeof value === 'string') {
      // 이미 단위가 있으면 그대로 반환
      if (/[a-z%]+$/i.test(value)) {
        return value;
      }

      // 숫자만 있으면 단위 추가
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        return `${numValue}${unit}`;
      }
    }

    return value;
  }

  /**
   * 깊은 복사 (Deep Clone)
   * @param {any} obj - 복사할 객체
   * @returns {any} 복사된 객체
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item));
    }

    if (typeof obj === 'object') {
      const cloned = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }

    return obj;
  }

  /**
   * 객체 병합 (Deep Merge)
   * @param {object} target - 대상 객체
   * @param {object} source - 소스 객체
   * @returns {object} 병합된 객체
   */
  static deepMerge(target, source) {
    if (!target || typeof target !== 'object') {
      return source;
    }

    if (!source || typeof source !== 'object') {
      return target;
    }

    const result = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  /**
   * 유효성 검사 헬퍼
   * @param {any} value - 검사할 값
   * @param {string} type - 검사할 타입
   * @returns {boolean} 유효성 여부
   */
  static validate(value, type) {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^[\d\s\-+()]+$/.test(value);
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      case 'number':
        return !isNaN(parseFloat(value)) && isFinite(value);
      case 'integer':
        return Number.isInteger(Number(value));
      case 'required':
        return value !== null && value !== undefined && value !== '';
      default:
        return true;
    }
  }
}
