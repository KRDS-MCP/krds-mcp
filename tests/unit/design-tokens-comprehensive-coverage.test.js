/**
 * Comprehensive tests for design-tokens.js
 * Tests utility functions, validation, and token management
 * Target: 60%+ coverage for uncovered lines
 */

import {
  tokenUtils,
  tokenValidation,
  designTokens,
  namespace,
  themes,
  categories,
  colorTokens,
  typographyTokens,
  spacingTokens,
  sizingTokens,
  borderTokens,
  shadowTokens,
  motionTokens,
  layoutTokens,
  componentTokens
} from '../../data/design-tokens.js';

describe('Design Tokens - Comprehensive Coverage Tests', () => {
  describe('tokenUtils', () => {
    describe('getToken', () => {
      test('should return token value for valid token name', () => {
        const result = tokenUtils.getToken('krds-light-color-primary-background-default');
        expect(result).toBe('#004494');
      });

      test('should return null for invalid token name', () => {
        const result = tokenUtils.getToken('invalid-token-name');
        expect(result).toBeNull();
      });

      test('should return null for token with unknown category', () => {
        const result = tokenUtils.getToken('krds-light-unknown-something');
        expect(result).toBeNull();
      });

      test('should handle token names with multiple hyphens', () => {
        const result = tokenUtils.getToken('krds-light-color-neutral-text-primary');
        expect(result).toBe('#212529');
      });

      test('should handle empty or null token names', () => {
        expect(tokenUtils.getToken('')).toBeNull();
        expect(tokenUtils.getToken(null)).toBeNull();
        expect(tokenUtils.getToken(undefined)).toBeNull();
      });
    });

    describe('getTokensByCategory', () => {
      test('should return all tokens for valid category', () => {
        const result = tokenUtils.getTokensByCategory('color');
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
        expect(Object.keys(result).length).toBeGreaterThan(0);
      });

      test('should return empty object for invalid category', () => {
        const result = tokenUtils.getTokensByCategory('invalid-category');
        expect(result).toEqual({});
      });

      test('should return empty object for null/undefined category', () => {
        expect(tokenUtils.getTokensByCategory(null)).toEqual({});
        expect(tokenUtils.getTokensByCategory(undefined)).toEqual({});
        expect(tokenUtils.getTokensByCategory('')).toEqual({});
      });

      test('should return typography tokens for typography category', () => {
        const result = tokenUtils.getTokensByCategory('typography');
        expect(result).toBeDefined();
        expect(result['krds-typography-font-family-primary']).toBeDefined();
      });

      test('should return spacing tokens for spacing category', () => {
        const result = tokenUtils.getTokensByCategory('spacing');
        expect(result).toBeDefined();
        expect(result['krds-spacing-4']).toBe('16px');
      });
    });

    describe('searchTokens', () => {
      test('should find tokens matching query', () => {
        const results = tokenUtils.searchTokens('primary');
        expect(results.length).toBeGreaterThan(0);

        // Should include description for each result
        results.forEach(result => {
          expect(result).toHaveProperty('category');
          expect(result).toHaveProperty('name');
          expect(result).toHaveProperty('value');
          expect(result).toHaveProperty('description');
        });
      });

      test('should return empty array for non-matching query', () => {
        const results = tokenUtils.searchTokens('nonexistenttoken');
        expect(results).toEqual([]);
      });

      test('should handle case insensitive search', () => {
        const lowerResults = tokenUtils.searchTokens('primary');
        const upperResults = tokenUtils.searchTokens('PRIMARY');
        const mixedResults = tokenUtils.searchTokens('Primary');

        expect(lowerResults.length).toBe(upperResults.length);
        expect(lowerResults.length).toBe(mixedResults.length);
      });

      test('should handle empty query', () => {
        const results = tokenUtils.searchTokens('');
        // Should return all tokens when query is empty
        expect(results.length).toBeGreaterThan(0);
      });

      test('should search in token names correctly', () => {
        const results = tokenUtils.searchTokens('background');
        const hasBackgroundTokens = results.some(result => result.name.toLowerCase().includes('background'));
        expect(hasBackgroundTokens).toBe(true);
      });
    });

    describe('getTokenDescription', () => {
      test('should generate description for color token', () => {
        const description = tokenUtils.getTokenDescription('krds-light-color-primary-background-default');
        expect(description).toContain('color');
        expect(description).toContain('primary');
        expect(description).toContain('background');
      });

      test('should generate description for typography token', () => {
        const description = tokenUtils.getTokenDescription('krds-typography-font-family-primary');
        expect(description).toContain('typography');
        expect(description).toContain('font');
        expect(description).toContain('family');
      });

      test('should handle tokens with modifier', () => {
        const description = tokenUtils.getTokenDescription('krds-light-color-primary-background-hover-state');
        expect(description).toContain('hover');
        expect(description).toContain('state');
      });

      test('should handle minimal token names', () => {
        const description = tokenUtils.getTokenDescription('krds-test-category');
        expect(description).toBe('category');
      });

      test('should handle tokens with state information', () => {
        const description = tokenUtils.getTokenDescription('krds-theme-color-type-modifier-state');
        expect(description).toContain('상태');
      });
    });

    describe('generateCSSVariables', () => {
      test('should generate CSS variables for light theme', () => {
        const cssVars = tokenUtils.generateCSSVariables('light');
        expect(cssVars).toBeDefined();
        expect(typeof cssVars).toBe('object');
        expect(Object.keys(cssVars).length).toBeGreaterThan(0);

        // Should have CSS variable format
        const firstKey = Object.keys(cssVars)[0];
        expect(firstKey).toMatch(/^--krds-/);
      });

      test('should generate CSS variables for dark theme', () => {
        const cssVars = tokenUtils.generateCSSVariables('dark');
        expect(cssVars).toBeDefined();
        expect(typeof cssVars).toBe('object');
      });

      test('should include theme-neutral tokens for both themes', () => {
        const lightVars = tokenUtils.generateCSSVariables('light');
        const darkVars = tokenUtils.generateCSSVariables('dark');

        // Typography tokens should be in both
        expect(lightVars['--krds-typography-font-size-base']).toBeDefined();
        expect(darkVars['--krds-typography-font-size-base']).toBeDefined();
      });

      test('should default to light theme when no theme specified', () => {
        const defaultVars = tokenUtils.generateCSSVariables();
        const lightVars = tokenUtils.generateCSSVariables('light');

        // Should have same number of variables
        expect(Object.keys(defaultVars).length).toBe(Object.keys(lightVars).length);
      });

      test('should exclude wrong theme tokens', () => {
        const lightVars = tokenUtils.generateCSSVariables('light');
        const darkTokenExists = Object.keys(lightVars).some(key => key.includes('-dark-color-'));
        expect(darkTokenExists).toBe(false);
      });
    });

    describe('tokensToCSS', () => {
      test('should generate valid CSS string', () => {
        const css = tokenUtils.tokensToCSS('light');
        expect(css).toMatch(/^:root \{/);
        expect(css).toMatch(/\}$/);
        expect(css).toContain('--krds-');
      });

      test('should generate CSS for dark theme', () => {
        const css = tokenUtils.tokensToCSS('dark');
        expect(css).toContain(':root {');
        expect(css).toContain('}');
        expect(css).toContain('--krds-');
      });

      test('should include proper CSS variable format', () => {
        const css = tokenUtils.tokensToCSS('light');
        const lines = css.split('\n').filter(line => line.trim().startsWith('--'));

        lines.forEach(line => {
          expect(line).toMatch(/^\s*--krds-[\w-]+:\s*[^;]+;$/);
        });
      });

      test('should handle empty theme gracefully', () => {
        const css = tokenUtils.tokensToCSS('');
        expect(css).toContain(':root {');
        expect(css).toContain('}');
      });
    });

    describe('exportTokensAsJSON', () => {
      test('should export tokens in default format', () => {
        const exported = tokenUtils.exportTokensAsJSON();
        expect(exported).toBeDefined();
        expect(exported).toHaveProperty('tokens');
        expect(exported).toHaveProperty('meta');
      });

      test('should export tokens in style-dictionary format', () => {
        const exported = tokenUtils.exportTokensAsJSON('style-dictionary');
        expect(exported).toBeDefined();
        expect(typeof exported).toBe('object');
        // Should have nested structure
        expect(Object.keys(exported).length).toBeGreaterThan(0);
      });

      test('should handle unknown format gracefully', () => {
        const exported = tokenUtils.exportTokensAsJSON('unknown-format');
        expect(exported).toEqual(designTokens);
      });
    });

    describe('convertToStyleDictionary', () => {
      test('should convert tokens to style dictionary format', () => {
        const converted = tokenUtils.convertToStyleDictionary();
        expect(converted).toBeDefined();
        expect(typeof converted).toBe('object');

        // Should have nested structure without krds- prefix
        const hasNestedStructure = Object.keys(converted).some(
          key => converted[key] && typeof converted[key] === 'object'
        );
        expect(hasNestedStructure).toBe(true);
      });

      test('should have values in correct format', () => {
        const converted = tokenUtils.convertToStyleDictionary();

        // Find a nested value
        const findValueObject = obj => {
          for (const key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
              if (obj[key].value) {
                return obj[key];
              }
              const nested = findValueObject(obj[key]);
              if (nested) {
                return nested;
              }
            }
          }
          return null;
        };

        const valueObject = findValueObject(converted);
        expect(valueObject).toBeDefined();
        expect(valueObject).toHaveProperty('value');
      });
    });
  });

  describe('tokenValidation', () => {
    describe('validateTokenName', () => {
      test('should validate correct token names', () => {
        const validNames = [
          'krds-light-color-primary-background-default',
          'krds-typography-font-size-base',
          'krds-spacing-4'
        ];

        validNames.forEach(name => {
          expect(tokenValidation.validateTokenName(name)).toBe(true);
        });
      });

      test('should reject invalid token names', () => {
        const invalidNames = [
          'invalid-token-name',
          'krds-invalid-theme-color',
          'krds-light-invalid-category',
          'not-krds-token',
          ''
        ];

        invalidNames.forEach(name => {
          expect(tokenValidation.validateTokenName(name)).toBe(false);
        });
      });

      test('should handle null/undefined token names', () => {
        expect(tokenValidation.validateTokenName(null)).toBe(false);
        expect(tokenValidation.validateTokenName(undefined)).toBe(false);
      });
    });

    describe('validateColorValue', () => {
      test('should validate hex colors', () => {
        const validHex = ['#000000', '#FFFFFF', '#FF0000', '#123', '#abc', '#ABC'];
        validHex.forEach(color => {
          expect(tokenValidation.validateColorValue(color)).toBe(true);
        });
      });

      test('should validate rgb colors', () => {
        const validRgb = ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(128, 64, 192)'];
        validRgb.forEach(color => {
          expect(tokenValidation.validateColorValue(color)).toBe(true);
        });
      });

      test('should validate rgba colors', () => {
        const validRgba = ['rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 1.0)', 'rgba(128, 64, 192, 0.8)'];
        validRgba.forEach(color => {
          expect(tokenValidation.validateColorValue(color)).toBe(true);
        });
      });

      test('should reject invalid color values', () => {
        const invalidColors = [
          '#GGG',
          '#12345',
          'rgb(256, 0, 0)',
          'rgb(0, -1, 0)',
          'rgba(0, 0, 0)',
          'invalid-color',
          '',
          null,
          undefined
        ];
        invalidColors.forEach(color => {
          expect(tokenValidation.validateColorValue(color)).toBe(false);
        });
      });

      test('should handle edge cases for rgb validation', () => {
        expect(tokenValidation.validateColorValue('rgb(0, 0, 0)')).toBe(true);
        expect(tokenValidation.validateColorValue('rgb(255, 255, 255)')).toBe(true);
        expect(tokenValidation.validateColorValue('rgb(256, 0, 0)')).toBe(false);
        expect(tokenValidation.validateColorValue('rgb(-1, 0, 0)')).toBe(false);
      });
    });

    describe('validateAllTokens', () => {
      test('should validate all color tokens', () => {
        const errors = tokenValidation.validateAllTokens();
        expect(Array.isArray(errors)).toBe(true);
      });

      test('should return errors for invalid tokens if any exist', () => {
        // Mock a color token with invalid value
        const originalTokens = designTokens.tokens.color;
        designTokens.tokens.color = {
          ...originalTokens,
          'krds-test-invalid-color': 'invalid-color-value'
        };

        const errors = tokenValidation.validateAllTokens();

        // Restore original tokens
        designTokens.tokens.color = originalTokens;

        expect(errors.some(error => error.includes('Invalid color value'))).toBe(true);
      });

      test('should detect invalid token names', () => {
        // Mock a token with invalid name
        const originalTokens = designTokens.tokens.color;
        designTokens.tokens.color = {
          ...originalTokens,
          'invalid-token-name': '#000000'
        };

        const errors = tokenValidation.validateAllTokens();

        // Restore original tokens
        designTokens.tokens.color = originalTokens;

        expect(errors.some(error => error.includes('Invalid token name'))).toBe(true);
      });
    });
  });

  describe('Token constants and structure', () => {
    test('should have valid namespace', () => {
      expect(namespace).toBe('krds');
    });

    test('should have all required themes', () => {
      expect(themes).toHaveProperty('light');
      expect(themes).toHaveProperty('dark');
      expect(themes).toHaveProperty('highContrast');
    });

    test('should have all required categories', () => {
      const requiredCategories = ['color', 'typography', 'spacing', 'sizing', 'border', 'shadow', 'motion', 'layout'];
      requiredCategories.forEach(category => {
        expect(categories).toHaveProperty(category);
      });
    });

    test('should have design tokens structure', () => {
      expect(designTokens).toHaveProperty('meta');
      expect(designTokens).toHaveProperty('tokens');
      expect(designTokens.meta).toHaveProperty('namespace');
      expect(designTokens.meta).toHaveProperty('version');
    });

    test('should have all token categories in design tokens', () => {
      const tokenCategories = Object.keys(designTokens.tokens);
      expect(tokenCategories).toContain('color');
      expect(tokenCategories).toContain('typography');
      expect(tokenCategories).toContain('spacing');
      expect(tokenCategories).toContain('sizing');
      expect(tokenCategories).toContain('border');
      expect(tokenCategories).toContain('shadow');
      expect(tokenCategories).toContain('motion');
      expect(tokenCategories).toContain('layout');
      expect(tokenCategories).toContain('component');
    });
  });

  describe('Token values integrity', () => {
    test('should have consistent color token values', () => {
      expect(colorTokens['krds-light-color-primary-background-default']).toBe('#004494');
      expect(colorTokens['krds-light-color-success-background-default']).toBe('#28A745');
      expect(colorTokens['krds-light-color-error-background-default']).toBe('#DC3545');
    });

    test('should have consistent typography token values', () => {
      expect(typographyTokens['krds-typography-font-size-base']).toBe('16px');
      expect(typographyTokens['krds-typography-font-weight-normal']).toBe('400');
      expect(typographyTokens['krds-typography-line-height-normal']).toBe('1.3');
    });

    test('should have consistent spacing token values', () => {
      expect(spacingTokens['krds-spacing-4']).toBe('16px');
      expect(spacingTokens['krds-spacing-8']).toBe('32px');
      expect(spacingTokens['krds-spacing-16']).toBe('64px');
    });

    test('should have proper sizing token values', () => {
      expect(sizingTokens['krds-sizing-full']).toBe('100%');
      expect(sizingTokens['krds-sizing-1-2']).toBe('50%');
      expect(sizingTokens['krds-sizing-1-4']).toBe('25%');
    });

    test('should have valid border token values', () => {
      expect(borderTokens['krds-border-radius-base']).toBe('6px');
      expect(borderTokens['krds-border-width-1']).toBe('1px');
      expect(borderTokens['krds-border-style-solid']).toBe('solid');
    });

    test('should have proper shadow token values', () => {
      expect(shadowTokens['krds-shadow-none']).toBe('none');
      expect(shadowTokens['krds-shadow-base']).toContain('rgba');
    });

    test('should have motion token values', () => {
      expect(motionTokens['krds-motion-duration-normal']).toBe('300ms');
      expect(motionTokens['krds-motion-easing-ease']).toContain('cubic-bezier');
    });

    test('should have layout token values', () => {
      expect(layoutTokens['krds-layout-container-md']).toBe('768px');
      expect(layoutTokens['krds-layout-grid-columns']).toBe('12');
    });

    test('should have component token values', () => {
      expect(componentTokens['krds-component-button-height-md']).toBe('40px');
      expect(componentTokens['krds-component-modal-width-md']).toBe('500px');
    });
  });
});
