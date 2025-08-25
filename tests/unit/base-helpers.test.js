// Unit tests for base helpers (base-helpers.js) - Enhanced Coverage

import { describe, test, expect, beforeEach } from '@jest/globals';
import { KRDSHelper } from '../../helpers/base-helpers.js';

describe('KRDSHelper Base Utilities', () => {
  describe('findByName', () => {
    const testArray = [
      { name: 'Button Component', type: 'action' },
      { name: 'Input Field', type: 'input' },
      { title: 'Header Section', type: 'layout' },
      { name: '버튼 컴포넌트', type: 'action' },
      { name: 'Test Button', description: 'A test button' }
    ];

    test('should find item by exact name match', () => {
      const result = KRDSHelper.findByName(testArray, 'Button Component');

      expect(result).toBeDefined();
      expect(result.name).toBe('Button Component');
      expect(result.type).toBe('action');
    });

    test('should find item by partial name match (case insensitive)', () => {
      const result = KRDSHelper.findByName(testArray, 'button');

      expect(result).toBeDefined();
      expect(result.name).toBe('Button Component');
    });

    test('should find item using custom search field', () => {
      const result = KRDSHelper.findByName(testArray, 'Header', 'title');

      expect(result).toBeDefined();
      expect(result.title).toBe('Header Section');
      expect(result.type).toBe('layout');
    });

    test('should handle Korean text searches', () => {
      const result = KRDSHelper.findByName(testArray, '버튼');

      expect(result).toBeDefined();
      expect(result.name).toBe('버튼 컴포넌트');
      expect(result.type).toBe('action');
    });

    test('should handle mixed case searches', () => {
      const result = KRDSHelper.findByName(testArray, 'INPUT FIELD');

      expect(result).toBeDefined();
      expect(result.name).toBe('Input Field');
    });

    test('should return undefined for non-existent items', () => {
      const result = KRDSHelper.findByName(testArray, 'NonExistent');

      expect(result).toBeUndefined();
    });

    test('should return null for empty search term', () => {
      const result = KRDSHelper.findByName(testArray, '');

      expect(result).toBeNull();
    });

    test('should return null for null search term', () => {
      const result = KRDSHelper.findByName(testArray, null);

      expect(result).toBeNull();
    });

    test('should return null for undefined search term', () => {
      const result = KRDSHelper.findByName(testArray, undefined);

      expect(result).toBeNull();
    });

    test('should handle null array', () => {
      const result = KRDSHelper.findByName(null, 'Button');

      expect(result).toBeNull();
    });

    test('should handle undefined array', () => {
      const result = KRDSHelper.findByName(undefined, 'Button');

      expect(result).toBeNull();
    });

    test('should handle arrays with null items', () => {
      const arrayWithNulls = [null, { name: 'Test' }, undefined];
      const result = KRDSHelper.findByName(arrayWithNulls, 'Test');
      expect(result.name).toBe('Test');
    });

    test('should handle arrays with mixed object structures', () => {
      const mixedArray = [
        { name: 'Item1' },
        { title: 'Item2' },
        { label: 'Item3' },
        'not an object'
      ];
      const result = KRDSHelper.findByName(mixedArray, 'Item1');
      expect(result.name).toBe('Item1');
    });

    test('should handle non-array input', () => {
      const result = KRDSHelper.findByName('not an array', 'Button');

      expect(result).toBeNull();
    });

    test('should handle empty array', () => {
      const result = KRDSHelper.findByName([], 'Button');

      expect(result).toBeUndefined();
    });

    test('should handle items without search field', () => {
      const arrayWithoutNames = [{ type: 'action' }, { description: 'No name field' }];

      const result = KRDSHelper.findByName(arrayWithoutNames, 'Button');

      expect(result).toBeUndefined();
    });

    test('should find first matching item when multiple matches exist', () => {
      const arrayWithDuplicates = [
        { name: 'Button Primary', type: 'primary' },
        { name: 'Button Secondary', type: 'secondary' }
      ];

      const result = KRDSHelper.findByName(arrayWithDuplicates, 'Button');

      expect(result).toBeDefined();
      expect(result.type).toBe('primary'); // First match
    });
  });

  describe('findByCategory', () => {
    const testArray = [
      { name: 'Button', category: 'action' },
      { name: 'Input', category: 'input' },
      { name: 'Link', category: 'action' },
      { name: 'Modal', category: 'feedback' },
      { name: '알림', category: 'feedback' }
    ];

    test('should find all items in specified category', () => {
      const result = KRDSHelper.findByCategory(testArray, 'action');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Button');
      expect(result[1].name).toBe('Link');
    });

    test('should handle case insensitive category search', () => {
      const result = KRDSHelper.findByCategory(testArray, 'ACTION');

      expect(result).toHaveLength(2);
      expect(result.every(item => item.category === 'action')).toBe(true);
    });

    test('should handle Korean categories', () => {
      const arrayWithKorean = [
        { name: 'Component1', category: '액션' },
        { name: 'Component2', category: '입력' },
        { name: 'Component3', category: '액션' }
      ];

      const result = KRDSHelper.findByCategory(arrayWithKorean, '액션');

      expect(result).toHaveLength(2);
      expect(result.every(item => item.category === '액션')).toBe(true);
    });

    test('should return empty array for non-existent category', () => {
      const result = KRDSHelper.findByCategory(testArray, 'nonexistent');

      expect(result).toEqual([]);
    });

    test('should return empty array for null array', () => {
      const result = KRDSHelper.findByCategory(null, 'action');

      expect(result).toEqual([]);
    });

    test('should return empty array for undefined array', () => {
      const result = KRDSHelper.findByCategory(undefined, 'action');

      expect(result).toEqual([]);
    });

    test('should return empty array for non-array input', () => {
      const result = KRDSHelper.findByCategory('not an array', 'action');

      expect(result).toEqual([]);
    });

    test('should return empty array for null category', () => {
      const result = KRDSHelper.findByCategory(testArray, null);

      expect(result).toEqual([]);
    });

    test('should return empty array for undefined category', () => {
      const result = KRDSHelper.findByCategory(testArray, undefined);

      expect(result).toEqual([]);
    });

    test('should handle items without category field', () => {
      const arrayWithoutCategory = [{ name: 'Item1' }, { name: 'Item2', category: 'action' }];

      const result = KRDSHelper.findByCategory(arrayWithoutCategory, 'action');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Item2');
    });
  });

  describe('findByFilters', () => {
    const testArray = [
      { name: 'Button', category: 'action', size: 'medium', priority: 1 },
      { name: 'Input', category: 'input', size: 'large', priority: 2 },
      { name: 'Link', category: 'action', size: 'small', priority: 1 },
      { name: 'Modal', category: 'feedback', size: 'large', priority: 3 },
      { name: 'Card', category: 'layout', tags: ['responsive', 'modern'], priority: 2 }
    ];

    test('should filter by single string property', () => {
      const filters = { category: 'action' };
      const result = KRDSHelper.findByFilters(testArray, filters);

      expect(result).toHaveLength(2);
      expect(result.every(item => item.category === 'action')).toBe(true);
    });

    test('should filter by multiple properties', () => {
      const filters = { category: 'action', size: 'medium' };
      const result = KRDSHelper.findByFilters(testArray, filters);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Button');
    });

    test('should filter by number property', () => {
      const filters = { priority: 2 };
      const result = KRDSHelper.findByFilters(testArray, filters);

      expect(result).toHaveLength(2);
      expect(result.every(item => item.priority === 2)).toBe(true);
    });

    test('should filter by array property', () => {
      // The array filter logic expects the item property to contain the filter value
      // So we need a different approach for this test
      const itemsWithStringTags = [
        { name: 'Component1', tags: 'responsive modern' },
        { name: 'Component2', tags: 'legacy static' },
        { name: 'Component3', tags: 'responsive clean' }
      ];

      const filters = { tags: ['responsive'] };
      const result = KRDSHelper.findByFilters(itemsWithStringTags, filters);

      expect(result).toHaveLength(2);
      expect(result.every(item => item.tags.includes('responsive'))).toBe(true);
    });

    test('should handle partial string matches (case insensitive)', () => {
      const filters = { name: 'but' };
      const result = KRDSHelper.findByFilters(testArray, filters);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Button');
    });

    test('should handle mixed filter types', () => {
      const filters = {
        category: 'action',
        priority: 1,
        size: 'small'
      };
      const result = KRDSHelper.findByFilters(testArray, filters);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Link');
    });

    test('should return empty array when no matches found', () => {
      const filters = { category: 'nonexistent' };
      const result = KRDSHelper.findByFilters(testArray, filters);

      expect(result).toEqual([]);
    });

    test('should return empty array for null array', () => {
      const filters = { category: 'action' };
      const result = KRDSHelper.findByFilters(null, filters);

      expect(result).toEqual([]);
    });

    test('should return empty array for undefined array', () => {
      const filters = { category: 'action' };
      const result = KRDSHelper.findByFilters(undefined, filters);

      expect(result).toEqual([]);
    });

    test('should return empty array for non-array input', () => {
      const filters = { category: 'action' };
      const result = KRDSHelper.findByFilters('not an array', filters);

      expect(result).toEqual([]);
    });

    test('should return empty array for null filters', () => {
      const result = KRDSHelper.findByFilters(testArray, null);

      expect(result).toEqual([]);
    });

    test('should return empty array for undefined filters', () => {
      const result = KRDSHelper.findByFilters(testArray, undefined);

      expect(result).toEqual([]);
    });

    test('should handle empty filters object', () => {
      const result = KRDSHelper.findByFilters(testArray, {});

      expect(result).toEqual(testArray); // All items should match empty filters
    });

    test('should handle items missing filter properties', () => {
      const arrayWithMissingProps = [
        { name: 'Complete', category: 'action', size: 'medium' },
        { name: 'Incomplete' }, // Missing category and size
        { category: 'action' } // Missing name and size
      ];

      const filters = { category: 'action' };
      const result = KRDSHelper.findByFilters(arrayWithMissingProps, filters);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Complete');
      expect(result[1].category).toBe('action');
    });

    test('should handle boolean filter values', () => {
      const arrayWithBooleans = [
        { name: 'Item1', active: true },
        { name: 'Item2', active: false },
        { name: 'Item3', active: true }
      ];

      const filters = { active: true };
      const result = KRDSHelper.findByFilters(arrayWithBooleans, filters);

      expect(result).toHaveLength(2);
      expect(result.every(item => item.active === true)).toBe(true);
    });
  });

  describe('isValidColorCode', () => {
    describe('HEX color validation', () => {
      test('should validate 6-digit HEX colors', () => {
        const validHexColors = ['#FF0000', '#00FF00', '#0000FF', '#123456', '#ABCDEF', '#abcdef'];

        validHexColors.forEach(color => {
          expect(KRDSHelper.isValidColorCode(color)).toBe(true);
        });
      });

      test('should validate 3-digit HEX colors', () => {
        const validShortHexColors = ['#F00', '#0F0', '#00F', '#123', '#ABC', '#abc'];

        validShortHexColors.forEach(color => {
          expect(KRDSHelper.isValidColorCode(color)).toBe(true);
        });
      });

      test('should reject invalid HEX colors', () => {
        const invalidHexColors = [
          '#GGGGGG', // Invalid characters
          '#12345', // 5 digits
          '#1234567', // 7 digits
          'FF0000', // Missing #
          '#', // Just hash
          '#GG', // Invalid short format
          '#12G' // Mixed valid/invalid
        ];

        invalidHexColors.forEach(color => {
          expect(KRDSHelper.isValidColorCode(color)).toBe(false);
        });
      });
    });

    describe('RGB color validation', () => {
      test('should validate RGB colors', () => {
        const validRgbColors = [
          'rgb(255, 0, 0)',
          'rgb(0, 255, 0)',
          'rgb(0, 0, 255)',
          'rgb(128, 128, 128)',
          'rgb(0, 0, 0)',
          'rgb(255, 255, 255)',
          'rgb(123, 45, 67)'
        ];

        validRgbColors.forEach(color => {
          expect(KRDSHelper.isValidColorCode(color)).toBe(true);
        });
      });

      test('should validate RGB colors with different spacing', () => {
        const rgbWithSpacing = [
          'rgb(255,0,0)', // No spaces
          'rgb( 255 , 0 , 0 )', // Extra spaces
          'rgb(255, 0, 0)', // Standard spacing
          'rgb(255,255,255)' // No spaces
        ];

        rgbWithSpacing.forEach(color => {
          expect(KRDSHelper.isValidColorCode(color)).toBe(true);
        });
      });

      test('should reject invalid RGB colors', () => {
        const invalidRgbColors = [
          'rgb(256, 0, 0)', // Values > 255
          'rgb(-1, 0, 0)', // Negative values
          'rgb(255, 0)', // Missing blue component
          'rgb(255, 0, 0, 0)', // Too many components
          'rgb(255.5, 0, 0)', // Decimal values
          'rgb(a, b, c)', // Non-numeric values
          'rgb(300, 400, 500)', // All values > 255
          'RGB(255, 0, 0)' // Wrong case
        ];

        invalidRgbColors.forEach(color => {
          expect(KRDSHelper.isValidColorCode(color)).toBe(false);
        });
      });
    });

    describe('HSL color validation', () => {
      test('should validate HSL colors', () => {
        const validHslColors = [
          'hsl(0, 100%, 50%)',
          'hsl(120, 100%, 50%)',
          'hsl(240, 100%, 50%)',
          'hsl(360, 100%, 100%)',
          'hsl(0, 0%, 0%)',
          'hsl(180, 50%, 25%)'
        ];

        validHslColors.forEach(color => {
          expect(KRDSHelper.isValidColorCode(color)).toBe(true);
        });
      });

      test('should validate HSL colors with different spacing', () => {
        const hslWithSpacing = [
          'hsl(0,100%,50%)', // No spaces
          'hsl( 0 , 100% , 50% )', // Extra spaces
          'hsl(0, 100%, 50%)' // Standard spacing
        ];

        hslWithSpacing.forEach(color => {
          expect(KRDSHelper.isValidColorCode(color)).toBe(true);
        });
      });

      test('should reject invalid HSL colors', () => {
        const invalidHslColors = [
          'hsl(361, 100%, 50%)', // Hue > 360
          'hsl(0, 101%, 50%)', // Saturation > 100%
          'hsl(0, 100%, 101%)', // Lightness > 100%
          'hsl(-1, 100%, 50%)', // Negative hue
          'hsl(0, -1%, 50%)', // Negative saturation
          'hsl(0, 100%, -1%)', // Negative lightness
          'hsl(0, 100)', // Missing lightness
          'hsl(0, 100%, 50%, 1)', // Too many components
          'HSL(0, 100%, 50%)' // Wrong case
        ];

        invalidHslColors.forEach(color => {
          expect(KRDSHelper.isValidColorCode(color)).toBe(false);
        });
      });
    });

    describe('Edge cases and error handling', () => {
      test('should handle null input', () => {
        expect(KRDSHelper.isValidColorCode(null)).toBe(false);
      });

      test('should handle undefined input', () => {
        expect(KRDSHelper.isValidColorCode(undefined)).toBe(false);
      });

      test('should handle empty string', () => {
        expect(KRDSHelper.isValidColorCode('')).toBe(false);
      });

      test('should handle non-string input', () => {
        expect(KRDSHelper.isValidColorCode(123)).toBe(false);
        expect(KRDSHelper.isValidColorCode({})).toBe(false);
        expect(KRDSHelper.isValidColorCode([])).toBe(false);
        expect(KRDSHelper.isValidColorCode(true)).toBe(false);
      });

      test('should handle whitespace-only strings', () => {
        expect(KRDSHelper.isValidColorCode('   ')).toBe(false);
        expect(KRDSHelper.isValidColorCode('\t')).toBe(false);
        expect(KRDSHelper.isValidColorCode('\n')).toBe(false);
      });

      test('should handle random strings', () => {
        const randomStrings = [
          'not a color',
          'red', // Named colors not supported
          'blue',
          'transparent',
          '123456',
          'css-color'
        ];

        randomStrings.forEach(str => {
          expect(KRDSHelper.isValidColorCode(str)).toBe(false);
        });
      });
    });
  });

  describe('Integration tests', () => {
    test('should work with real KRDS color data', () => {
      const krdsColors = [
        { name: 'Primary Blue', code: '#0066CC', category: 'primary' },
        { name: 'Secondary Orange', code: '#FF6600', category: 'secondary' },
        { name: 'Success Green', code: 'rgb(40, 167, 69)', category: 'system' },
        { name: 'Warning Yellow', code: 'hsl(45, 100%, 50%)', category: 'system' }
      ];

      // Test finding by name
      const primaryBlue = KRDSHelper.findByName(krdsColors, 'Primary');
      expect(primaryBlue).toBeDefined();
      expect(primaryBlue.code).toBe('#0066CC');

      // Test finding by category
      const systemColors = KRDSHelper.findByCategory(krdsColors, 'system');
      expect(systemColors).toHaveLength(2);

      // Test color code validation
      krdsColors.forEach(color => {
        expect(KRDSHelper.isValidColorCode(color.code)).toBe(true);
      });

      // Test complex filtering
      const filters = { category: 'system' };
      const filteredColors = KRDSHelper.findByFilters(krdsColors, filters);
      expect(filteredColors).toHaveLength(2);
      expect(filteredColors.every(color => color.category === 'system')).toBe(true);
    });

    test('should handle Korean component names', () => {
      const koreanComponents = [
        { name: '버튼 컴포넌트', category: '액션', type: 'interactive' },
        { name: '입력 필드', category: '입력', type: 'form' },
        { name: '모달 창', category: '피드백', type: 'overlay' }
      ];

      // Test Korean name search
      const button = KRDSHelper.findByName(koreanComponents, '버튼');
      expect(button).toBeDefined();
      expect(button.name).toBe('버튼 컴포넌트');

      // Test Korean category filtering
      const actionComponents = KRDSHelper.findByCategory(koreanComponents, '액션');
      expect(actionComponents).toHaveLength(1);
      expect(actionComponents[0].name).toBe('버튼 컴포넌트');
    });
  });
});
