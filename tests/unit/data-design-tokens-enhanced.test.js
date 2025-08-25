/**
 * KRDS Design Tokens Enhanced Test Coverage
 * Targeting 60%+ coverage for data/design-tokens.js
 */

import { describe, test, expect } from '@jest/globals';
import {
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
  designTokens,
  tokenUtils
} from '../../data/design-tokens.js';

describe('KRDS Design Tokens Enhanced Coverage', () => {
  describe('Basic Token Constants', () => {
    test('should have correct namespace', () => {
      expect(namespace).toBe('krds');
    });

    test('should have themes object', () => {
      expect(themes).toEqual({
        light: 'light',
        dark: 'dark',
        highContrast: 'high-contrast'
      });
    });

    test('should have categories object', () => {
      expect(categories).toBeDefined();
      expect(categories.color).toBe('color');
      expect(categories.typography).toBe('typography');
      expect(categories.spacing).toBe('spacing');
    });
  });

  describe('Color Tokens', () => {
    test('should have primary color tokens', () => {
      expect(colorTokens['krds-light-color-primary-background-default']).toBe('#004494');
      expect(colorTokens['krds-light-color-primary-text-default']).toBe('#FFFFFF');
    });

    test('should have secondary color tokens', () => {
      expect(colorTokens['krds-light-color-secondary-background-default']).toBe('#4A90E2');
    });

    test('should have system color tokens', () => {
      const systemKeys = Object.keys(colorTokens).filter(
        key =>
          key.includes('success') ||
          key.includes('warning') ||
          key.includes('error') ||
          key.includes('info')
      );
      expect(systemKeys.length).toBeGreaterThan(0);
    });
  });

  describe('Typography Tokens', () => {
    test('should have typography tokens defined', () => {
      expect(typographyTokens).toBeDefined();
      expect(typeof typographyTokens).toBe('object');
    });

    test('should have font family tokens', () => {
      const fontKeys = Object.keys(typographyTokens).filter(key => key.includes('font-family'));
      expect(fontKeys.length).toBeGreaterThan(0);
    });
  });

  describe('Spacing and Sizing Tokens', () => {
    test('should have spacing tokens', () => {
      expect(spacingTokens).toBeDefined();
      expect(typeof spacingTokens).toBe('object');
    });

    test('should have sizing tokens', () => {
      expect(sizingTokens).toBeDefined();
      expect(typeof sizingTokens).toBe('object');
    });
  });

  describe('Visual Effect Tokens', () => {
    test('should have border tokens', () => {
      expect(borderTokens).toBeDefined();
      expect(typeof borderTokens).toBe('object');
    });

    test('should have shadow tokens', () => {
      expect(shadowTokens).toBeDefined();
      expect(typeof shadowTokens).toBe('object');
    });

    test('should have motion tokens', () => {
      expect(motionTokens).toBeDefined();
      expect(typeof motionTokens).toBe('object');
    });
  });

  describe('Design Tokens Collection', () => {
    test('should have design tokens object', () => {
      expect(designTokens).toBeDefined();
      expect(designTokens.tokens).toBeDefined();
    });

    test('should have color tokens in collection', () => {
      expect(designTokens.tokens.color).toBeDefined();
      expect(typeof designTokens.tokens.color).toBe('object');
    });

    test('should have typography tokens in collection', () => {
      expect(designTokens.tokens.typography).toBeDefined();
    });

    test('should have spacing tokens in collection', () => {
      expect(designTokens.tokens.spacing).toBeDefined();
    });
  });

  describe('Token Utilities', () => {
    test('should have getToken function', () => {
      expect(typeof tokenUtils.getToken).toBe('function');
    });

    test('should get token by name', () => {
      const result = tokenUtils.getToken('color', 'krds-light-color-primary-background-default');
      expect(result).toBeDefined();
    });

    test('should return null for non-existent token', () => {
      const result = tokenUtils.getToken('color', 'non-existent-token');
      expect(result).toBeNull();
    });

    test('should have getTokensByCategory function', () => {
      expect(typeof tokenUtils.getTokensByCategory).toBe('function');
    });

    test('should get tokens by category', () => {
      const colorTokens = tokenUtils.getTokensByCategory('color');
      expect(typeof colorTokens).toBe('object');
      expect(Object.keys(colorTokens).length).toBeGreaterThan(0);
    });

    test('should return empty object for non-existent category', () => {
      const result = tokenUtils.getTokensByCategory('non-existent');
      expect(result).toEqual({});
    });

    test('should have searchTokens function', () => {
      expect(typeof tokenUtils.searchTokens).toBe('function');
    });

    test('should search tokens by query', () => {
      const results = tokenUtils.searchTokens('primary');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      results.forEach(result => {
        expect(result).toHaveProperty('category');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('value');
        expect(result.name.toLowerCase()).toContain('primary');
      });
    });

    test('should search tokens case insensitively', () => {
      const results1 = tokenUtils.searchTokens('PRIMARY');
      const results2 = tokenUtils.searchTokens('primary');
      expect(results1.length).toEqual(results2.length);
    });

    test('should return empty array for no matches', () => {
      const results = tokenUtils.searchTokens('nonexistentquery12345');
      expect(results).toEqual([]);
    });

    test('should have getTokenDescription function', () => {
      expect(typeof tokenUtils.getTokenDescription).toBe('function');
    });

    test('should generate token description', () => {
      const description = tokenUtils.getTokenDescription(
        'krds-light-color-primary-background-default'
      );
      expect(typeof description).toBe('string');
      expect(description).toContain('color');
      expect(description).toContain('primary');
    });

    test('should handle token names with states', () => {
      const description = tokenUtils.getTokenDescription(
        'krds-light-color-primary-background-hover'
      );
      expect(description).toContain('hover');
      expect(description).toContain('상태');
    });

    test('should have generateCSSVariables function', () => {
      expect(typeof tokenUtils.generateCSSVariables).toBe('function');
    });

    test('should generate CSS variables', () => {
      const cssVars = tokenUtils.generateCSSVariables('color');
      expect(typeof cssVars).toBe('object');
      const varNames = Object.keys(cssVars);
      expect(varNames.some(name => name.startsWith('--'))).toBe(true);
    });

    test('should have generateSCSSVariables function', () => {
      expect(typeof tokenUtils.generateSCSSVariables).toBe('function');
    });

    test('should generate SCSS variables', () => {
      const scssVars = tokenUtils.generateSCSSVariables('color');
      expect(typeof scssVars).toBe('string');
      expect(scssVars).toContain('$krds-');
    });

    test('should have getTokenValue function', () => {
      expect(typeof tokenUtils.getTokenValue).toBe('function');
    });

    test('should get token value by full name', () => {
      const value = tokenUtils.getTokenValue('krds-light-color-primary-background-default');
      expect(value).toBe('#004494');
    });

    test('should return null for non-existent token value', () => {
      const value = tokenUtils.getTokenValue('non-existent-token');
      expect(value).toBeNull();
    });

    test('should have validateTokenName function', () => {
      expect(typeof tokenUtils.validateTokenName).toBe('function');
    });

    test('should validate correct token names', () => {
      const isValid = tokenUtils.validateTokenName('krds-light-color-primary-background-default');
      expect(isValid).toBe(true);
    });

    test('should reject invalid token names', () => {
      const isValid = tokenUtils.validateTokenName('invalid-token-name');
      expect(isValid).toBe(false);
    });

    test('should have getThemeTokens function', () => {
      expect(typeof tokenUtils.getThemeTokens).toBe('function');
    });

    test('should get light theme tokens', () => {
      const lightTokens = tokenUtils.getThemeTokens('light');
      expect(typeof lightTokens).toBe('object');
      expect(Object.keys(lightTokens).length).toBeGreaterThan(0);
    });

    test('should get dark theme tokens', () => {
      const darkTokens = tokenUtils.getThemeTokens('dark');
      expect(typeof darkTokens).toBe('object');
    });
  });

  describe('Token Integration', () => {
    test('should have consistent token naming', () => {
      Object.keys(colorTokens).forEach(tokenName => {
        expect(tokenName).toMatch(/^krds-/);
        expect(tokenName).toMatch(/-(light|dark)-/);
        expect(tokenName).toMatch(/-color-/);
      });
    });

    test('should have all required theme variants', () => {
      const lightTokens = Object.keys(colorTokens).filter(key => key.includes('-light-'));
      const darkTokens = Object.keys(colorTokens).filter(key => key.includes('-dark-'));

      expect(lightTokens.length).toBeGreaterThan(0);
      expect(darkTokens.length).toBeGreaterThan(0);
    });

    test('should maintain token value format consistency', () => {
      Object.values(colorTokens).forEach(value => {
        expect(typeof value).toBe('string');
        // Allow hex colors, rgb/rgba values, and transparent
        expect(value).toMatch(/^(#[0-9A-F]{6}|#[0-9A-F]{3}|rgb\(.+\)|rgba\(.+\)|transparent)$/i);
      });
    });
  });
});
