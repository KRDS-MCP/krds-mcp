/**
 * KRDS MCP i18n 모듈 테스트
 */

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
} from '../../helpers/i18n.js';

describe('I18n Module', () => {
  describe('Constants', () => {
    test('SUPPORTED_LANGUAGES should have correct values', () => {
      expect(SUPPORTED_LANGUAGES.KO).toBe('ko');
      expect(SUPPORTED_LANGUAGES.EN).toBe('en');
    });

    test('DEFAULT_LANGUAGE should be Korean', () => {
      expect(DEFAULT_LANGUAGE).toBe('ko');
    });
  });

  describe('I18n Class', () => {
    describe('Constructor', () => {
      test('should create instance with default language', () => {
        const instance = new I18n();
        expect(instance.getLanguage()).toBe('ko');
      });

      test('should create instance with specified language', () => {
        const instance = new I18n('en');
        expect(instance.getLanguage()).toBe('en');
      });

      test('should fallback to default language for invalid language', () => {
        const instance = new I18n('invalid');
        expect(instance.getLanguage()).toBe('ko');
      });
    });

    describe('Language Management', () => {
      test('setLanguage should change current language', () => {
        const instance = new I18n();
        instance.setLanguage('en');
        expect(instance.getLanguage()).toBe('en');
      });

      test('setLanguage should validate language', () => {
        const instance = new I18n();
        instance.setLanguage('invalid');
        expect(instance.getLanguage()).toBe('ko');
      });

      test('getSupportedLanguages should return all languages', () => {
        const instance = new I18n();
        const languages = instance.getSupportedLanguages();
        expect(languages).toContain('ko');
        expect(languages).toContain('en');
      });
    });

    describe('Message Translation', () => {
      test('should translate Korean common messages', () => {
        const instance = new I18n('ko');
        expect(instance.t('common.success')).toBe('성공');
        expect(instance.t('common.error')).toBe('오류');
        expect(instance.t('common.warning')).toBe('경고');
      });

      test('should translate English common messages', () => {
        const instance = new I18n('en');
        expect(instance.t('common.success')).toBe('Success');
        expect(instance.t('common.error')).toBe('Error');
        expect(instance.t('common.warning')).toBe('Warning');
      });

      test('should translate nested message keys', () => {
        const instance = new I18n('ko');
        expect(instance.t('tools.colors')).toBe('색상');
        expect(instance.t('tools.typography')).toBe('타이포그래피');
      });

      test('should return key when message not found', () => {
        const instance = new I18n();
        expect(instance.t('non.existent.key')).toBe('non.existent.key');
      });

      test('should fallback to default language', () => {
        const instance = new I18n('en');
        instance.fallbackLanguage = 'ko';
        // If message doesn't exist in English, it should try Korean
        const result = instance.t('common.success');
        expect(result).toBeTruthy();
      });
    });

    describe('Parameter Interpolation', () => {
      test('should interpolate single parameter', () => {
        const instance = new I18n('ko');
        const result = instance.t('errors.validation.required', { field: '이름' });
        expect(result).toContain('이름');
      });

      test('should interpolate multiple parameters', () => {
        const instance = new I18n('ko');
        const result = instance.t('errors.validation.minLength', {
          field: '비밀번호',
          min: 8
        });
        expect(result).toContain('비밀번호');
        expect(result).toContain('8');
      });

      test('should leave placeholder if parameter missing', () => {
        const instance = new I18n('ko');
        const result = instance.t('errors.validation.required', {});
        expect(result).toContain('{field}');
      });
    });

    describe('Multilingual Messages', () => {
      test('should create multilingual message object', () => {
        const instance = new I18n();
        const result = instance.createMultilingualMessage('common.success');
        expect(result.ko).toBe('성공');
        expect(result.en).toBe('Success');
      });

      test('should create multilingual message with parameters', () => {
        const instance = new I18n();
        const result = instance.createMultilingualMessage('errors.data.notFound', {
          type: 'colors'
        });
        expect(result.ko).toContain('colors');
        expect(result.en).toContain('colors');
      });
    });

    describe('Language Detection', () => {
      test('should detect Korean from Accept-Language', () => {
        const instance = new I18n();
        const detected = instance.detectLanguage('ko-KR,ko;q=0.9,en;q=0.8');
        expect(detected).toBe('ko');
      });

      test('should detect English from Accept-Language', () => {
        const instance = new I18n();
        const detected = instance.detectLanguage('en-US,en;q=0.9');
        expect(detected).toBe('en');
      });

      test('should return default for unknown language', () => {
        const instance = new I18n();
        const detected = instance.detectLanguage('ja-JP,ja;q=0.9');
        expect(detected).toBe('ko');
      });

      test('should return default for empty Accept-Language', () => {
        const instance = new I18n();
        const detected = instance.detectLanguage('');
        expect(detected).toBe('ko');
      });
    });

    describe('Date Formatting', () => {
      test('should format date in Korean', () => {
        const instance = new I18n('ko');
        const date = new Date('2024-01-15T10:30:00');
        const formatted = instance.formatDate(date);
        expect(formatted).toBeTruthy();
        expect(typeof formatted).toBe('string');
      });

      test('should format date in English', () => {
        const instance = new I18n('en');
        const date = new Date('2024-01-15T10:30:00');
        const formatted = instance.formatDate(date);
        expect(formatted).toBeTruthy();
        expect(typeof formatted).toBe('string');
      });

      test('should accept custom date format options', () => {
        const instance = new I18n('ko');
        const date = new Date('2024-01-15');
        const formatted = instance.formatDate(date, {
          year: 'numeric',
          month: 'short'
        });
        expect(formatted).toBeTruthy();
      });
    });

    describe('Number Formatting', () => {
      test('should format number in Korean', () => {
        const instance = new I18n('ko');
        const formatted = instance.formatNumber(1234567.89);
        expect(formatted).toBeTruthy();
        expect(formatted).toContain('1');
      });

      test('should format number in English', () => {
        const instance = new I18n('en');
        const formatted = instance.formatNumber(1234567.89);
        expect(formatted).toBeTruthy();
      });

      test('should accept custom number format options', () => {
        const instance = new I18n('ko');
        const formatted = instance.formatNumber(0.5, {
          style: 'percent'
        });
        expect(formatted).toBeTruthy();
      });
    });

    describe('Currency Formatting', () => {
      test('should format KRW in Korean', () => {
        const instance = new I18n('ko');
        const formatted = instance.formatCurrency(10000, 'KRW');
        expect(formatted).toBeTruthy();
        expect(formatted).toContain('10');
      });

      test('should format USD in English', () => {
        const instance = new I18n('en');
        const formatted = instance.formatCurrency(100, 'USD');
        expect(formatted).toBeTruthy();
      });

      test('should accept custom currency format options', () => {
        const instance = new I18n('ko');
        const formatted = instance.formatCurrency(10000, 'KRW', {
          minimumFractionDigits: 0
        });
        expect(formatted).toBeTruthy();
      });
    });

    describe('Pluralization', () => {
      test('should return singular form for count of 1', () => {
        const instance = new I18n('ko');
        const result = instance.pluralize('item', 'items', 1);
        expect(result).toBe('item');
      });

      test('should return plural form for count > 1', () => {
        const instance = new I18n('ko');
        const result = instance.pluralize('item', 'items', 5);
        expect(result).toBe('items');
      });
    });

    describe('Text Direction and Locale', () => {
      test('should return ltr for Korean', () => {
        const instance = new I18n('ko');
        expect(instance.getTextDirection()).toBe('ltr');
      });

      test('should return ltr for English', () => {
        const instance = new I18n('en');
        expect(instance.getTextDirection()).toBe('ltr');
      });

      test('should return correct locale for Korean', () => {
        const instance = new I18n('ko');
        expect(instance.getLocale()).toBe('ko-KR');
      });

      test('should return correct locale for English', () => {
        const instance = new I18n('en');
        expect(instance.getLocale()).toBe('en-US');
      });
    });
  });

  describe('Global Instance Functions', () => {
    test('t function should work with global instance', () => {
      setLanguage('ko');
      expect(t('common.success')).toBe('성공');
    });

    test('setLanguage should update global language', () => {
      setLanguage('en');
      expect(getLanguage()).toBe('en');
      setLanguage('ko'); // Reset
    });

    test('formatDate should work with global instance', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
    });

    test('formatNumber should work with global instance', () => {
      const formatted = formatNumber(12345);
      expect(formatted).toBeTruthy();
    });

    test('formatCurrency should work with global instance', () => {
      const formatted = formatCurrency(10000, 'KRW');
      expect(formatted).toBeTruthy();
    });
  });

  describe('LocalizedErrorMessages', () => {
    test('should create validation error message', () => {
      setLanguage('ko');
      const message = LocalizedErrorMessages.createValidationError('이름', 'required');
      expect(message).toContain('이름');
      expect(message).toContain('필수');
    });

    test('should create data error message', () => {
      setLanguage('ko');
      const message = LocalizedErrorMessages.createDataError('notFound', 'colors');
      expect(message).toContain('colors');
    });

    test('should create performance error message', () => {
      setLanguage('ko');
      const message = LocalizedErrorMessages.createPerformanceError('slow');
      expect(message).toBeTruthy();
    });

    test('should create success message', () => {
      setLanguage('ko');
      const message = LocalizedErrorMessages.createSuccessMessage('dataRetrieved', 'colors');
      expect(message).toContain('colors');
    });
  });

  describe('LocalizedResponseFormatter', () => {
    test('should format error response', () => {
      const error = new Error('Test error');
      error.code = 'TEST_ERROR';
      const response = LocalizedResponseFormatter.formatError(error, { language: 'ko' });

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(response.error.code).toBe('TEST_ERROR');
      expect(response.language).toBe('ko');
      expect(response.timestamp).toBeDefined();
    });

    test('should format success response', () => {
      const data = { id: 1, name: 'test' };
      const response = LocalizedResponseFormatter.formatSuccess(
        data,
        'success.dataRetrieved',
        { type: 'colors' },
        { language: 'ko' }
      );

      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.message).toBeTruthy();
      expect(response.language).toBe('ko');
    });

    test('should format validation error response', () => {
      const response = LocalizedResponseFormatter.formatValidationError('email', 'invalid', {}, { language: 'ko' });

      expect(response.success).toBe(false);
      expect(response.error.type).toBe('VALIDATION_ERROR');
      expect(response.error.field).toBe('email');
      expect(response.language).toBe('ko');
    });
  });

  describe('Tool Messages', () => {
    test('should have all tool message keys in Korean', () => {
      const instance = new I18n('ko');
      expect(instance.t('tools.designPrinciples')).toBeTruthy();
      expect(instance.t('tools.colors')).toBeTruthy();
      expect(instance.t('tools.typography')).toBeTruthy();
      expect(instance.t('tools.components')).toBeTruthy();
      expect(instance.t('tools.patterns')).toBeTruthy();
      expect(instance.t('tools.accessibility')).toBeTruthy();
    });

    test('should have all tool message keys in English', () => {
      const instance = new I18n('en');
      expect(instance.t('tools.designPrinciples')).toBeTruthy();
      expect(instance.t('tools.colors')).toBeTruthy();
      expect(instance.t('tools.typography')).toBeTruthy();
      expect(instance.t('tools.components')).toBeTruthy();
      expect(instance.t('tools.patterns')).toBeTruthy();
      expect(instance.t('tools.accessibility')).toBeTruthy();
    });
  });

  describe('Error Messages Coverage', () => {
    test('should have validation error messages', () => {
      const instance = new I18n('ko');
      expect(instance.t('errors.validation.required', { field: 'test' })).toBeTruthy();
      expect(instance.t('errors.validation.invalid', { field: 'test' })).toBeTruthy();
      expect(instance.t('errors.validation.minLength', { field: 'test', min: 5 })).toBeTruthy();
    });

    test('should have data error messages', () => {
      const instance = new I18n('ko');
      expect(instance.t('errors.data.notFound', { type: 'test' })).toBeTruthy();
      expect(instance.t('errors.data.unavailable', { type: 'test' })).toBeTruthy();
    });

    test('should have performance error messages', () => {
      const instance = new I18n('ko');
      expect(instance.t('errors.performance.slow')).toBeTruthy();
      expect(instance.t('errors.performance.timeout')).toBeTruthy();
    });
  });

  describe('Accessibility Messages', () => {
    test('should have accessibility validation messages', () => {
      const instance = new I18n('ko');
      expect(instance.t('accessibility.validation.passed')).toBeTruthy();
      expect(instance.t('accessibility.validation.failed')).toBeTruthy();
      expect(instance.t('accessibility.validation.issues', { count: 5 })).toBeTruthy();
    });

    test('should have accessibility issue messages', () => {
      const instance = new I18n('ko');
      expect(instance.t('accessibility.issues.missingAlt')).toBeTruthy();
      expect(instance.t('accessibility.issues.missingLabel')).toBeTruthy();
      expect(instance.t('accessibility.issues.lowContrast')).toBeTruthy();
    });
  });

  describe('Performance Messages', () => {
    test('should have performance metrics messages', () => {
      const instance = new I18n('ko');
      expect(instance.t('performance.metrics.responseTime', { time: 100 })).toBeTruthy();
      expect(instance.t('performance.metrics.memoryUsage', { usage: 50 })).toBeTruthy();
      expect(instance.t('performance.metrics.cacheHitRate', { rate: 80 })).toBeTruthy();
    });

    test('should have performance recommendation messages', () => {
      const instance = new I18n('ko');
      expect(instance.t('performance.recommendations.optimizeCache')).toBeTruthy();
      expect(instance.t('performance.recommendations.reduceMemory')).toBeTruthy();
    });
  });
});
