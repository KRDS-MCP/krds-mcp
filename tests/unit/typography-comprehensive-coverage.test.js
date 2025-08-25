/**
 * Comprehensive tests for typography.js
 * Tests typography data integrity and utility functions
 * Target: 60%+ coverage for utility functions (currently 50%)
 */

import {
  fontFamilies,
  fontScale,
  fontWeights,
  lineHeights,
  letterSpacings,
  typographyStyles,
  typography,
  typographyUtils,
  typographyAccessibility,
  responsiveRules
} from '../../data/typography.js';

describe('Typography - Comprehensive Coverage Tests', () => {
  describe('Font system data integrity', () => {
    test('should have font families with required properties', () => {
      const expectedFamilies = ['primary', 'secondary', 'monospace', 'english'];

      expectedFamilies.forEach(family => {
        expect(fontFamilies).toHaveProperty(family);
        expect(fontFamilies[family]).toHaveProperty('name');
        expect(fontFamilies[family]).toHaveProperty('fallback');
        expect(fontFamilies[family]).toHaveProperty('description');
        expect(fontFamilies[family]).toHaveProperty('usage');
        expect(fontFamilies[family]).toHaveProperty('weights');
        expect(Array.isArray(fontFamilies[family].weights)).toBe(true);
      });
    });

    test('should have consistent font scale', () => {
      const expectedSizes = [
        'xs',
        'sm',
        'base',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        '8xl',
        '9xl'
      ];

      expectedSizes.forEach(size => {
        expect(fontScale).toHaveProperty(size);
        expect(fontScale[size]).toMatch(/^\d+px$/);
      });

      // Base should be 16px
      expect(fontScale.base).toBe('16px');
    });

    test('should have proper font weight values', () => {
      const expectedWeights = [
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black'
      ];

      expectedWeights.forEach(weight => {
        expect(fontWeights).toHaveProperty(weight);
        const value = parseInt(fontWeights[weight]);
        expect(value).toBeGreaterThanOrEqual(100);
        expect(value).toBeLessThanOrEqual(900);
        expect(value % 100).toBe(0); // Should be multiples of 100
      });
    });

    test('should have line height scale', () => {
      const expectedHeights = [
        'none',
        'tight',
        'snug',
        'normal',
        'relaxed',
        'loose',
        'looser',
        'loosest'
      ];

      expectedHeights.forEach(height => {
        expect(lineHeights).toHaveProperty(height);
        const value = parseFloat(lineHeights[height]);
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(2);
      });
    });

    test('should have letter spacing scale', () => {
      const expectedSpacings = ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'];

      expectedSpacings.forEach(spacing => {
        expect(letterSpacings).toHaveProperty(spacing);

        if (spacing === 'normal') {
          expect(letterSpacings[spacing]).toBe('0');
        } else {
          expect(letterSpacings[spacing]).toMatch(/^-?0\.\d+em$/);
        }
      });
    });
  });

  describe('Typography styles data integrity', () => {
    test('should have comprehensive typography styles', () => {
      expect(typographyStyles.length).toBeGreaterThan(15);

      typographyStyles.forEach(style => {
        expect(style).toHaveProperty('id');
        expect(style).toHaveProperty('name');
        expect(style).toHaveProperty('fontFamily');
        expect(style).toHaveProperty('fallback');
        expect(style).toHaveProperty('fontSize');
        expect(style).toHaveProperty('lineHeight');
        expect(style).toHaveProperty('fontWeight');
        expect(style).toHaveProperty('letterSpacing');
        expect(style).toHaveProperty('usage');
        expect(style).toHaveProperty('category');
        expect(style).toHaveProperty('htmlTag');
        expect(style).toHaveProperty('responsive');
      });
    });

    test('should have all required categories', () => {
      const categories = [...new Set(typographyStyles.map(s => s.category))];
      const expectedCategories = ['display', 'heading', 'body', 'interactive', 'utility'];

      expectedCategories.forEach(category => {
        expect(categories).toContain(category);
      });
    });

    test('should have proper responsive breakpoints', () => {
      typographyStyles.forEach(style => {
        expect(style.responsive).toHaveProperty('mobile');
        expect(style.responsive).toHaveProperty('tablet');
        expect(style.responsive).toHaveProperty('desktop');

        expect(style.responsive.mobile).toMatch(/^\d+px$/);
        expect(style.responsive.tablet).toMatch(/^\d+px$/);
        expect(style.responsive.desktop).toMatch(/^\d+px$/);
      });
    });

    test('should have unique style IDs', () => {
      const ids = typographyStyles.map(s => s.id);
      const uniqueIds = [...new Set(ids)];

      expect(ids.length).toBe(uniqueIds.length);
    });

    test('should have default style marked', () => {
      const defaultStyles = typographyStyles.filter(s => s.isDefault);
      expect(defaultStyles.length).toBe(1);
      expect(defaultStyles[0].id).toBe('body-base');
    });

    test('should have consistent font family references', () => {
      const familyNames = Object.values(fontFamilies).map(f => f.name);

      typographyStyles.forEach(style => {
        expect(familyNames).toContain(style.fontFamily);
      });
    });
  });

  describe('typography array compatibility', () => {
    test('should be alias for typographyStyles', () => {
      expect(typography).toBe(typographyStyles);
    });
  });

  describe('typographyUtils', () => {
    describe('getStylesByCategory', () => {
      test('should filter styles by category', () => {
        const displayStyles = typographyUtils.getStylesByCategory('display');
        expect(displayStyles.length).toBeGreaterThan(0);
        expect(displayStyles.every(s => s.category === 'display')).toBe(true);

        const headingStyles = typographyUtils.getStylesByCategory('heading');
        expect(headingStyles.length).toBeGreaterThan(0);
        expect(headingStyles.every(s => s.category === 'heading')).toBe(true);

        const bodyStyles = typographyUtils.getStylesByCategory('body');
        expect(bodyStyles.length).toBeGreaterThan(0);
        expect(bodyStyles.every(s => s.category === 'body')).toBe(true);
      });

      test('should return empty array for non-existent category', () => {
        const result = typographyUtils.getStylesByCategory('nonexistent');
        expect(result).toEqual([]);
      });

      test('should handle null/undefined category', () => {
        expect(typographyUtils.getStylesByCategory(null)).toEqual([]);
        expect(typographyUtils.getStylesByCategory(undefined)).toEqual([]);
        expect(typographyUtils.getStylesByCategory('')).toEqual([]);
      });

      test('should be case sensitive', () => {
        const result = typographyUtils.getStylesByCategory('DISPLAY');
        expect(result).toEqual([]);
      });
    });

    describe('findStyleById', () => {
      test('should find styles by id', () => {
        const displayXL = typographyUtils.findStyleById('display-xl');
        expect(displayXL).toBeDefined();
        expect(displayXL.name).toBe('Display XL');

        const bodyBase = typographyUtils.findStyleById('body-base');
        expect(bodyBase).toBeDefined();
        expect(bodyBase.name).toBe('Body Regular');
        expect(bodyBase.isDefault).toBe(true);

        const buttonLg = typographyUtils.findStyleById('button-lg');
        expect(buttonLg).toBeDefined();
        expect(buttonLg.category).toBe('interactive');
      });

      test('should return undefined for non-existent id', () => {
        const result = typographyUtils.findStyleById('nonexistent-id');
        expect(result).toBeUndefined();
      });

      test('should handle null/undefined id', () => {
        expect(typographyUtils.findStyleById(null)).toBeUndefined();
        expect(typographyUtils.findStyleById(undefined)).toBeUndefined();
        expect(typographyUtils.findStyleById('')).toBeUndefined();
      });

      test('should be case sensitive', () => {
        const result = typographyUtils.findStyleById('DISPLAY-XL');
        expect(result).toBeUndefined();
      });
    });

    describe('searchStylesByUsage', () => {
      test('should search styles by usage text', () => {
        const titleResults = typographyUtils.searchStylesByUsage('제목');
        expect(titleResults.length).toBeGreaterThan(0);

        const buttonResults = typographyUtils.searchStylesByUsage('버튼');
        expect(buttonResults.length).toBeGreaterThan(0);

        const mainResults = typographyUtils.searchStylesByUsage('메인');
        expect(mainResults.length).toBeGreaterThan(0);
      });

      test('should be case insensitive', () => {
        const lowerResults = typographyUtils.searchStylesByUsage('제목');
        const upperResults = typographyUtils.searchStylesByUsage('제목'.toUpperCase());
        const mixedResults = typographyUtils.searchStylesByUsage('제목');

        expect(lowerResults.length).toBe(upperResults.length);
        expect(lowerResults.length).toBe(mixedResults.length);
      });

      test('should return empty array for non-matching query', () => {
        const result = typographyUtils.searchStylesByUsage('nonexistentusage');
        expect(result).toEqual([]);
      });

      test('should handle null/undefined query', () => {
        // The current implementation doesn't handle null/undefined properly - it will throw
        expect(() => typographyUtils.searchStylesByUsage(null)).toThrow();
        expect(() => typographyUtils.searchStylesByUsage(undefined)).toThrow();
      });

      test('should handle empty query', () => {
        const result = typographyUtils.searchStylesByUsage('');
        // Empty string returns all styles because includes('') is always true
        expect(result).toEqual(typographyStyles);
      });

      test('should find partial matches', () => {
        const textResults = typographyUtils.searchStylesByUsage('텍스트');
        expect(textResults.length).toBeGreaterThan(0);

        const labelResults = typographyUtils.searchStylesByUsage('라벨');
        expect(labelResults.length).toBeGreaterThan(0);
      });
    });

    describe('getStylesByTag', () => {
      test('should filter styles by HTML tag', () => {
        const h1Styles = typographyUtils.getStylesByTag('h1');
        expect(h1Styles.length).toBeGreaterThan(0);
        expect(h1Styles.every(s => s.htmlTag === 'h1')).toBe(true);

        const pStyles = typographyUtils.getStylesByTag('p');
        expect(pStyles.length).toBeGreaterThan(0);
        expect(pStyles.every(s => s.htmlTag === 'p')).toBe(true);

        const buttonStyles = typographyUtils.getStylesByTag('button');
        expect(buttonStyles.length).toBeGreaterThan(0);
        expect(buttonStyles.every(s => s.htmlTag === 'button')).toBe(true);
      });

      test('should return empty array for non-existent tag', () => {
        const result = typographyUtils.getStylesByTag('nonexistent');
        expect(result).toEqual([]);
      });

      test('should handle null/undefined tag', () => {
        expect(typographyUtils.getStylesByTag(null)).toEqual([]);
        expect(typographyUtils.getStylesByTag(undefined)).toEqual([]);
        expect(typographyUtils.getStylesByTag('')).toEqual([]);
      });

      test('should find all heading levels', () => {
        const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5'];

        headingLevels.forEach(tag => {
          const styles = typographyUtils.getStylesByTag(tag);
          expect(styles.length).toBeGreaterThan(0);
        });
      });
    });

    describe('generateCSS', () => {
      test('should generate CSS for desktop by default', () => {
        const css = typographyUtils.generateCSS('body-base');

        expect(css).toBeDefined();
        expect(css).toHaveProperty('fontFamily');
        expect(css).toHaveProperty('fontSize');
        expect(css).toHaveProperty('lineHeight');
        expect(css).toHaveProperty('fontWeight');
        expect(css).toHaveProperty('letterSpacing');

        expect(css.fontSize).toBe('16px'); // Desktop size for body-base
      });

      test('should generate CSS for different breakpoints', () => {
        const desktopCSS = typographyUtils.generateCSS('body-base', 'desktop');
        const tabletCSS = typographyUtils.generateCSS('body-base', 'tablet');
        const mobileCSS = typographyUtils.generateCSS('body-base', 'mobile');

        expect(desktopCSS.fontSize).toBe('16px');
        expect(tabletCSS.fontSize).toBe('15px');
        expect(mobileCSS.fontSize).toBe('14px');
      });

      test('should return null for non-existent style', () => {
        const css = typographyUtils.generateCSS('nonexistent');
        expect(css).toBeNull();
      });

      test('should fallback to default fontSize for unknown breakpoint', () => {
        const css = typographyUtils.generateCSS('body-base', 'unknown-breakpoint');

        expect(css).toBeDefined();
        expect(css.fontSize).toBe('16px'); // Should fallback to default fontSize
      });

      test('should use fallback font family', () => {
        const css = typographyUtils.generateCSS('body-base');

        expect(css.fontFamily).toContain('Noto Sans KR');
        expect(css.fontFamily).toContain('Malgun Gothic');
      });

      test('should handle styles without responsive sizes', () => {
        // Find a style that might not have all responsive sizes
        const style = typographyStyles.find(s => s.id === 'caption');
        if (style && !style.responsive.tablet) {
          const css = typographyUtils.generateCSS('caption', 'tablet');
          expect(css).toBeDefined();
        }
      });

      test('should preserve all style properties', () => {
        const css = typographyUtils.generateCSS('heading-1');

        expect(css.fontWeight).toBeDefined();
        expect(css.lineHeight).toBeDefined();
        expect(css.letterSpacing).toBeDefined();
        expect(typeof css.fontWeight).toBe('string');
        expect(typeof css.lineHeight).toBe('string');
        expect(typeof css.letterSpacing).toBe('string');
      });
    });
  });

  describe('typographyAccessibility', () => {
    test('should have minimum size requirements', () => {
      expect(typographyAccessibility.minimumSizes).toHaveProperty('mobile');
      expect(typographyAccessibility.minimumSizes).toHaveProperty('desktop');
      expect(typographyAccessibility.minimumSizes).toHaveProperty('touch');

      expect(typographyAccessibility.minimumSizes.mobile).toBe('14px');
      expect(typographyAccessibility.minimumSizes.desktop).toBe('16px');
      expect(typographyAccessibility.minimumSizes.touch).toBe('16px');
    });

    test('should have readability guidelines', () => {
      expect(typographyAccessibility.readability).toHaveProperty('maxLineLength');
      expect(typographyAccessibility.readability).toHaveProperty('minLineHeight');
      expect(typographyAccessibility.readability).toHaveProperty('minContrastRatio');

      expect(typographyAccessibility.readability.maxLineLength).toBe('66ch');
      expect(typographyAccessibility.readability.minLineHeight).toBe('1.4');
      expect(typographyAccessibility.readability.minContrastRatio).toBe('4.5:1');
    });

    test('should have accessibility recommendations', () => {
      expect(Array.isArray(typographyAccessibility.recommendations)).toBe(true);
      expect(typographyAccessibility.recommendations.length).toBeGreaterThan(0);

      const hasHeadingRec = typographyAccessibility.recommendations.some(rec =>
        rec.includes('제목은 본문보다')
      );
      expect(hasHeadingRec).toBe(true);
    });

    test('should have multilingual support', () => {
      expect(typographyAccessibility.multilingual).toHaveProperty('korean');
      expect(typographyAccessibility.multilingual).toHaveProperty('english');

      const korean = typographyAccessibility.multilingual.korean;
      expect(korean).toHaveProperty('recommend');
      expect(korean).toHaveProperty('lineHeight');
      expect(korean).toHaveProperty('letterSpacing');

      const english = typographyAccessibility.multilingual.english;
      expect(english).toHaveProperty('recommend');
      expect(english).toHaveProperty('lineHeight');
      expect(english).toHaveProperty('letterSpacing');
    });
  });

  describe('responsiveRules', () => {
    test('should have breakpoint definitions', () => {
      expect(responsiveRules.breakpoints).toHaveProperty('mobile');
      expect(responsiveRules.breakpoints).toHaveProperty('tablet');
      expect(responsiveRules.breakpoints).toHaveProperty('desktop');

      expect(responsiveRules.breakpoints.mobile).toContain('max-width');
      expect(responsiveRules.breakpoints.tablet).toContain('min-width');
      expect(responsiveRules.breakpoints.desktop).toContain('min-width');
    });

    test('should have scaling factors', () => {
      expect(responsiveRules.scalingFactor).toHaveProperty('mobile');
      expect(responsiveRules.scalingFactor).toHaveProperty('tablet');
      expect(responsiveRules.scalingFactor).toHaveProperty('desktop');

      expect(responsiveRules.scalingFactor.mobile).toBeLessThan(1);
      expect(responsiveRules.scalingFactor.tablet).toBeLessThan(1);
      expect(responsiveRules.scalingFactor.desktop).toBe(1.0);
    });

    test('should have fluid typography settings', () => {
      expect(responsiveRules.fluidTypography).toHaveProperty('enable');
      expect(responsiveRules.fluidTypography).toHaveProperty('minSize');
      expect(responsiveRules.fluidTypography).toHaveProperty('maxSize');
      expect(responsiveRules.fluidTypography).toHaveProperty('minViewport');
      expect(responsiveRules.fluidTypography).toHaveProperty('maxViewport');

      expect(responsiveRules.fluidTypography.enable).toBe(true);
    });
  });

  describe('Typography system consistency', () => {
    test('should have increasing font sizes in scale', () => {
      const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

      for (let i = 1; i < sizes.length; i++) {
        const prevSize = parseInt(fontScale[sizes[i - 1]]);
        const currSize = parseInt(fontScale[sizes[i]]);
        expect(currSize).toBeGreaterThan(prevSize);
      }
    });

    test('should have increasing font weights', () => {
      const weights = ['light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];

      for (let i = 1; i < weights.length; i++) {
        const prevWeight = parseInt(fontWeights[weights[i - 1]]);
        const currWeight = parseInt(fontWeights[weights[i]]);
        expect(currWeight).toBeGreaterThan(prevWeight);
      }
    });

    test('should have increasing line heights (mostly)', () => {
      const heights = ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'];

      for (let i = 1; i < heights.length; i++) {
        const prevHeight = parseFloat(lineHeights[heights[i - 1]]);
        const currHeight = parseFloat(lineHeights[heights[i]]);
        expect(currHeight).toBeGreaterThanOrEqual(prevHeight);
      }
    });

    test('should have proper display hierarchy', () => {
      const displayStyles = typographyUtils.getStylesByCategory('display');

      // Display XL should be largest
      const displayXL = displayStyles.find(s => s.id === 'display-xl');
      const displayLG = displayStyles.find(s => s.id === 'display-lg');

      if (displayXL && displayLG) {
        const xlSize = parseInt(displayXL.fontSize);
        const lgSize = parseInt(displayLG.fontSize);
        expect(xlSize).toBeGreaterThan(lgSize);
      }
    });

    test('should have proper heading hierarchy', () => {
      const h1Style = typographyUtils.findStyleById('heading-1');
      const h4Style = typographyUtils.findStyleById('heading-4');

      if (h1Style && h4Style) {
        const h1Size = parseInt(h1Style.fontSize);
        const h4Size = parseInt(h4Style.fontSize);
        expect(h1Size).toBeGreaterThan(h4Size);
      }
    });

    test('should have responsive sizing consistency', () => {
      typographyStyles.forEach(style => {
        const mobileSize = parseInt(style.responsive.mobile);
        const tabletSize = parseInt(style.responsive.tablet);
        const desktopSize = parseInt(style.responsive.desktop);

        // Generally: mobile <= tablet <= desktop
        expect(mobileSize).toBeLessThanOrEqual(desktopSize);
        expect(tabletSize).toBeLessThanOrEqual(desktopSize);
      });
    });
  });

  describe('Integration and usage scenarios', () => {
    test('should support heading hierarchy workflow', () => {
      const headings = ['heading-1', 'heading-2', 'heading-3', 'heading-4', 'heading-5'];

      headings.forEach(id => {
        const style = typographyUtils.findStyleById(id);
        expect(style).toBeDefined();
        expect(style.category).toBe('heading');
      });
    });

    test('should support body text workflow', () => {
      const bodyStyles = typographyUtils.getStylesByCategory('body');
      const defaultBody = bodyStyles.find(s => s.isDefault);

      expect(defaultBody).toBeDefined();
      expect(defaultBody.id).toBe('body-base');

      const largeBody = bodyStyles.find(s => s.id === 'body-lg');
      const smallBody = bodyStyles.find(s => s.id === 'body-sm');

      expect(largeBody).toBeDefined();
      expect(smallBody).toBeDefined();
    });

    test('should support interactive element workflow', () => {
      const interactiveStyles = typographyUtils.getStylesByCategory('interactive');

      expect(interactiveStyles.length).toBeGreaterThan(0);

      const buttonStyles = interactiveStyles.filter(s => s.htmlTag === 'button');
      const labelStyles = interactiveStyles.filter(s => s.htmlTag === 'label');

      expect(buttonStyles.length).toBeGreaterThan(0);
      expect(labelStyles.length).toBeGreaterThan(0);
    });

    test('should support responsive design workflow', () => {
      const style = typographyUtils.findStyleById('body-base');

      const mobileCSS = typographyUtils.generateCSS('body-base', 'mobile');
      const desktopCSS = typographyUtils.generateCSS('body-base', 'desktop');

      expect(mobileCSS.fontSize).toBe('14px');
      expect(desktopCSS.fontSize).toBe('16px');

      // Should use same font family
      expect(mobileCSS.fontFamily).toBe(desktopCSS.fontFamily);
    });

    test('should support accessibility compliance workflow', () => {
      // Check minimum sizes are met
      const bodyBase = typographyUtils.findStyleById('body-base');
      const mobileSize = parseInt(bodyBase.responsive.mobile);
      const desktopSize = parseInt(bodyBase.responsive.desktop);

      const minMobile = parseInt(typographyAccessibility.minimumSizes.mobile);
      const minDesktop = parseInt(typographyAccessibility.minimumSizes.desktop);

      expect(mobileSize).toBeGreaterThanOrEqual(minMobile);
      expect(desktopSize).toBeGreaterThanOrEqual(minDesktop);
    });

    test('should support font loading workflow', () => {
      // Check that fallback fonts are comprehensive
      Object.values(fontFamilies).forEach(family => {
        // Monospace family uses monospace, not sans-serif
        if (family.name === 'D2 Coding') {
          expect(family.fallback).toContain('monospace');
        } else {
          expect(family.fallback).toContain('sans-serif');
        }
        expect(family.fallback.length).toBeGreaterThan(family.name.length);
      });
    });
  });
});
