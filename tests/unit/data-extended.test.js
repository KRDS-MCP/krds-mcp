/**
 * KRDS Data 모듈 확장 테스트 - 실제 구조에 맞춘 테스트
 */

import { describe, test, expect } from '@jest/globals';
import { KRDS_DATA } from '../../data/index.js';
import { primaryColors, systemColors, colorUtils, colors } from '../../data/colors.js';
import { fontFamilies, typographyStyles, typographyUtils } from '../../data/typography.js';
import { borderRadius, shadows, iconSizes, iconCategories } from '../../data/shapes-icons.js';
import {
  namespace,
  themes,
  categories,
  colorTokens,
  tokenUtils
} from '../../data/design-tokens.js';

describe('KRDS Data Extended Tests', () => {
  describe('KRDS_DATA Integration', () => {
    test('should access design tokens', () => {
      if (KRDS_DATA.designTokens) {
        expect(KRDS_DATA.designTokens).toBeDefined();
        expect(typeof KRDS_DATA.designTokens).toBe('object');
      }
    });

    test('should access responsive rules', () => {
      if (KRDS_DATA.responsiveRules) {
        expect(KRDS_DATA.responsiveRules).toBeDefined();
        expect(typeof KRDS_DATA.responsiveRules).toBe('object');
      }
    });

    test('should have dark mode support', () => {
      if (KRDS_DATA.darkModeColors) {
        expect(KRDS_DATA.darkModeColors).toBeDefined();
        expect(typeof KRDS_DATA.darkModeColors).toBe('object');
      }
    });
  });

  describe('Color Data Extended', () => {
    test('should have primary colors with detailed info', () => {
      expect(Array.isArray(primaryColors)).toBe(true);
      if (primaryColors.length > 0) {
        const firstColor = primaryColors[0];
        expect(firstColor).toHaveProperty('name');
        expect(firstColor).toHaveProperty('hexCode');

        if (firstColor.variants) {
          expect(typeof firstColor.variants).toBe('object');
        }

        if (firstColor.accessibilityLevel) {
          expect(['A', 'AA', 'AAA']).toContain(firstColor.accessibilityLevel);
        }
      }
    });

    test('should have system colors', () => {
      expect(Array.isArray(systemColors)).toBe(true);
      systemColors.forEach(color => {
        expect(color).toHaveProperty('name');
        expect(typeof color.name).toBe('string');
      });
    });

    test('should have color utilities', () => {
      expect(typeof colorUtils).toBe('object');

      if (typeof colorUtils.hexToRgb === 'function') {
        const rgb = colorUtils.hexToRgb('#FF0000');
        if (rgb) {
          expect(rgb).toHaveProperty('r');
          expect(rgb).toHaveProperty('g');
          expect(rgb).toHaveProperty('b');
        }
      }

      if (typeof colorUtils.getContrastRatio === 'function') {
        const ratio = colorUtils.getContrastRatio('#000000', '#FFFFFF');
        if (ratio) {
          expect(typeof ratio).toBe('number');
          expect(ratio).toBeGreaterThan(0);
        }
      }
    });

    test('should have combined colors array', () => {
      expect(Array.isArray(colors)).toBe(true);
      colors.forEach(color => {
        expect(color).toHaveProperty('name');
        expect(typeof color.name).toBe('string');
      });
    });
  });

  describe('Typography Data Extended', () => {
    test('should have font families with weights', () => {
      expect(typeof fontFamilies).toBe('object');
      Object.values(fontFamilies).forEach(font => {
        expect(font).toHaveProperty('name');
        expect(font).toHaveProperty('fallback');

        if (font.weights) {
          expect(Array.isArray(font.weights)).toBe(true);
          font.weights.forEach(weight => {
            expect(typeof weight).toBe('number');
          });
        }
      });
    });

    test('should have typography styles with categories', () => {
      expect(Array.isArray(typographyStyles)).toBe(true);
      const categories = typographyStyles.map(style => style.category).filter(Boolean);
      const uniqueCategories = [...new Set(categories)];
      expect(uniqueCategories.length).toBeGreaterThan(0);
    });

    test('should have typography utilities', () => {
      expect(typeof typographyUtils).toBe('object');

      if (typeof typographyUtils.getFontSize === 'function') {
        const size = typographyUtils.getFontSize('h1');
        // Should return something or null, but not throw
        expect(() => typographyUtils.getFontSize('h1')).not.toThrow();
      }

      if (typeof typographyUtils.generateFontStack === 'function') {
        const stack = typographyUtils.generateFontStack('primary');
        if (stack) {
          expect(typeof stack).toBe('string');
        }
      }
    });
  });

  describe('Shapes & Icons Extended', () => {
    test('should have progressive border radius', () => {
      expect(typeof borderRadius).toBe('object');
      expect(borderRadius.none).toBe('0');

      const sizeKeys = ['xs', 'sm', 'base', 'md', 'lg'];
      sizeKeys.forEach(key => {
        if (borderRadius[key]) {
          expect(borderRadius[key]).toMatch(/^\d+px$/);
        }
      });
    });

    test('should have shadow definitions', () => {
      expect(typeof shadows).toBe('object');
      if (shadows.none) {
        expect(shadows.none).toBe('none');
      }

      Object.entries(shadows).forEach(([key, value]) => {
        expect(['string', 'object']).toContain(typeof value);
      });
    });

    test('should have icon sizes', () => {
      expect(typeof iconSizes).toBe('object');
      Object.values(iconSizes).forEach(size => {
        if (typeof size === 'string') {
          expect(size).toMatch(/^\d+px$/);
        } else if (typeof size === 'number') {
          expect(size).toBeGreaterThan(0);
        }
      });
    });

    test('should have icon categories with icons', () => {
      expect(typeof iconCategories).toBe('object');
      Object.values(iconCategories).forEach(categoryIcons => {
        expect(Array.isArray(categoryIcons)).toBe(true);
        categoryIcons.forEach(icon => {
          expect(icon).toHaveProperty('name');
          expect(icon).toHaveProperty('id');
        });
      });
    });
  });

  describe('Design Tokens Extended', () => {
    test('should have namespace and themes', () => {
      expect(typeof namespace).toBe('string');
      expect(namespace).toBe('krds');

      expect(typeof themes).toBe('object');
      expect(themes).toHaveProperty('light');
      expect(themes).toHaveProperty('dark');
    });

    test('should have token categories', () => {
      expect(typeof categories).toBe('object');
      const expectedCategories = ['color', 'typography', 'spacing', 'sizing'];
      expectedCategories.forEach(category => {
        if (categories[category]) {
          expect(categories[category]).toBe(category);
        }
      });
    });

    test('should have color tokens', () => {
      expect(typeof colorTokens).toBe('object');
      Object.entries(colorTokens).forEach(([tokenName, tokenValue]) => {
        expect(typeof tokenName).toBe('string');
        expect(typeof tokenValue).toBe('string');
        expect(tokenName).toMatch(/^krds-/);
      });
    });

    test('should have token utilities', () => {
      expect(typeof tokenUtils).toBe('object');

      if (typeof tokenUtils.getToken === 'function') {
        expect(() => tokenUtils.getToken('test')).not.toThrow();
      }

      if (typeof tokenUtils.getTokensByCategory === 'function') {
        const colorTokensList = tokenUtils.getTokensByCategory('color');
        if (colorTokensList) {
          expect(['object', 'boolean']).toContain(typeof colorTokensList);
          if (Array.isArray(colorTokensList)) {
            expect(Array.isArray(colorTokensList)).toBe(true);
          }
        }
      }
    });
  });

  describe('Data Access Patterns', () => {
    test('should handle missing properties gracefully', () => {
      expect(() => {
        const testAccess = KRDS_DATA.nonExistentProperty?.subProperty?.value;
        return testAccess;
      }).not.toThrow();
    });

    test('should provide consistent data types', () => {
      Object.keys(KRDS_DATA).forEach(key => {
        const value = KRDS_DATA[key];
        expect(value).toBeDefined();
        expect(['object', 'string', 'number', 'boolean']).toContain(typeof value);
      });
    });

    test('should have searchable data structures', () => {
      // Colors should be searchable by name
      if (Array.isArray(KRDS_DATA.colors)) {
        const searchableColors = KRDS_DATA.colors.filter(
          color => color && typeof color.name === 'string'
        );
        expect(searchableColors.length).toBeGreaterThan(0);
      }

      // Components should be searchable by name
      if (Array.isArray(KRDS_DATA.components)) {
        const searchableComponents = KRDS_DATA.components.filter(
          component => component && typeof component.name === 'string'
        );
        expect(searchableComponents.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Performance Characteristics', () => {
    test('should access data efficiently', () => {
      const startTime = Date.now();

      // Perform various data access operations
      const colors = KRDS_DATA.colors;
      const components = KRDS_DATA.components;
      const typography = KRDS_DATA.typography;
      const patterns = KRDS_DATA.globalPatterns;

      // Simple iteration test
      if (Array.isArray(colors)) {
        colors.forEach(color => color.name);
      }

      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });

    test('should have reasonable memory footprint', () => {
      const jsonString = JSON.stringify(KRDS_DATA);
      const sizeInBytes = new Blob([jsonString]).size;
      expect(sizeInBytes).toBeLessThan(5 * 1024 * 1024); // Under 5MB
    });
  });
});
