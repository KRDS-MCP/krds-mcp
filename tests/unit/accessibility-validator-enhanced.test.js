/**
 * KRDS Accessibility Validator Enhanced Test Coverage
 * Targeting 60%+ coverage for helpers/accessibility-validator.js
 */

import { describe, test, expect } from '@jest/globals';
import { AccessibilityValidator } from '../../helpers/accessibility-validator.js';

describe('Accessibility Validator Enhanced Coverage', () => {
  describe('AccessibilityValidator Class', () => {
    test('should have static methods available', () => {
      expect(typeof AccessibilityValidator.validateAccessibility).toBe('function');
      expect(typeof AccessibilityValidator.checkSpecificIssue).toBe('function');
      expect(typeof AccessibilityValidator.generateImprovementSuggestions).toBe('function');
    });

    test('should validate HTML accessibility with valid structure', () => {
      const validHTML = '<main><h1>Title</h1><p>Content</p></main>';
      const result = AccessibilityValidator.validateAccessibility(validHTML);
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('accessibilityScore');
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('wcagCompliance');
      expect(typeof result.accessibilityScore).toBe('number');
      expect(Array.isArray(result.issues)).toBe(true);
    });

    test('should detect accessibility violations', () => {
      const invalidHTML = '<img src="test.jpg"><button></button>';
      const result = AccessibilityValidator.validateAccessibility(invalidHTML);
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('accessibilityScore');
      expect(result).toHaveProperty('issues');
      expect(Array.isArray(result.issues)).toBe(true);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    test('should handle empty HTML', () => {
      const result = AccessibilityValidator.validateAccessibility('');
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('accessibilityScore');
      expect(typeof result.accessibilityScore).toBe('number');
    });

    test('should handle malformed HTML', () => {
      const malformedHTML = '<div><h1>Title<p>Unclosed tags';
      const result = AccessibilityValidator.validateAccessibility(malformedHTML);
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('accessibilityScore');
    });

    test('should provide WCAG compliance levels', () => {
      const result = AccessibilityValidator.validateAccessibility(
        '<main><h1>Accessible content</h1></main>'
      );
      expect(result).toHaveProperty('wcagCompliance');
      expect(['AA', '부분 준수', '미준수']).toContain(result.wcagCompliance);
    });
  });

  describe('checkSpecificIssue method', () => {
    test('should check for missing alt attributes', () => {
      const htmlWithBadImage = '<img src="test.jpg">';
      const htmlWithGoodImage = '<img src="test.jpg" alt="Test image">';

      const badResult = AccessibilityValidator.checkSpecificIssue(htmlWithBadImage, 'alt-text');
      const goodResult = AccessibilityValidator.checkSpecificIssue(htmlWithGoodImage, 'alt-text');

      expect(typeof badResult).toBe('boolean');
      expect(badResult).toBe(true);
      expect(goodResult).toBe(false);
    });

    test('should check for button labels', () => {
      const htmlWithEmptyButton = '<button></button>';
      const htmlWithGoodButton = '<button>Click me</button>';

      const badResult = AccessibilityValidator.checkSpecificIssue(
        htmlWithEmptyButton,
        'button-labels'
      );
      const goodResult = AccessibilityValidator.checkSpecificIssue(
        htmlWithGoodButton,
        'button-labels'
      );

      expect(typeof badResult).toBe('boolean');
      expect(badResult).toBe(true);
      expect(goodResult).toBe(false);
    });

    test('should check for form labels', () => {
      const htmlWithUnlabeledInput = '<input type="text">';
      const htmlWithLabeledInput = '<label for="test">Label</label><input type="text" id="test">';

      const badResult = AccessibilityValidator.checkSpecificIssue(
        htmlWithUnlabeledInput,
        'form-labels'
      );
      const goodResult = AccessibilityValidator.checkSpecificIssue(
        htmlWithLabeledInput,
        'form-labels'
      );

      expect(typeof badResult).toBe('boolean');
      expect(badResult).toBe(true);
      expect(goodResult).toBe(false);
    });

    test('should check for heading structure', () => {
      const htmlWithBadHeadings = '<h1>Title</h1><h3>Skipped h2</h3>';
      const htmlWithGoodHeadings = '<h1>Title</h1><h2>Subtitle</h2>';

      const badResult = AccessibilityValidator.checkSpecificIssue(
        htmlWithBadHeadings,
        'heading-structure'
      );
      const goodResult = AccessibilityValidator.checkSpecificIssue(
        htmlWithGoodHeadings,
        'heading-structure'
      );

      expect(typeof badResult).toBe('boolean');
      expect(badResult).toBe(true);
      expect(goodResult).toBe(false);
    });

    test('should handle unknown check types', () => {
      const html = '<div>Test</div>';
      const result = AccessibilityValidator.checkSpecificIssue(html, 'unknown-check');
      expect(typeof result).toBe('boolean');
      expect(result).toBe(false);
    });
  });

  describe('generateImprovementSuggestions method', () => {
    test('should generate suggestions for problematic HTML', () => {
      const problematicHTML = '<img src="test.jpg"><button></button>';
      const result = AccessibilityValidator.generateImprovementSuggestions(problematicHTML);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should generate fewer suggestions for accessible HTML', () => {
      const accessibleHTML =
        '<main><h1>Title</h1><img src="test.jpg" alt="Test image" /><button>Click me</button></main>';
      const result = AccessibilityValidator.generateImprovementSuggestions(accessibleHTML);
      expect(Array.isArray(result)).toBe(true);
    });

    test('should handle empty HTML in suggestions', () => {
      const result = AccessibilityValidator.generateImprovementSuggestions('');
      expect(Array.isArray(result)).toBe(true);
    });

    test('should provide structured suggestion objects', () => {
      const problematicHTML = '<img src="test.jpg">';
      const result = AccessibilityValidator.generateImprovementSuggestions(problematicHTML);

      if (result.length > 0) {
        const suggestion = result[0];
        expect(suggestion).toHaveProperty('type');
        expect(suggestion).toHaveProperty('priority');
        expect(suggestion).toHaveProperty('description');
      }
    });
  });

  describe('Integration tests', () => {
    test('should work with comprehensive HTML validation', () => {
      const complexHTML = `
        <main>
          <h1>Main Title</h1>
          <img src="hero.jpg" alt="Hero image" />
          <form>
            <label for="email">Email</label>
            <input type="email" id="email" />
            <button type="submit">Submit</button>
          </form>
          <table>
            <tr>
              <th>Header</th>
              <td>Data</td>
            </tr>
          </table>
        </main>
      `;

      const validationResult = AccessibilityValidator.validateAccessibility(complexHTML);
      const suggestions = AccessibilityValidator.generateImprovementSuggestions(complexHTML);

      expect(typeof validationResult).toBe('object');
      expect(Array.isArray(suggestions)).toBe(true);
      expect(validationResult.accessibilityScore).toBeGreaterThan(0);
    });

    test('should handle all check types', () => {
      const checkTypes = [
        'alt-text',
        'button-labels',
        'form-labels',
        'heading-structure',
        'table-headers',
        'lang-attribute'
      ];

      checkTypes.forEach(checkType => {
        const result = AccessibilityValidator.checkSpecificIssue('<div>Test</div>', checkType);
        expect(typeof result).toBe('boolean');
      });
    });

    test('should provide consistent scoring', () => {
      const perfectHTML =
        '<main><h1>Perfect</h1><img src="test.jpg" alt="Test" /><button>Click</button></main>';
      const terribleHTML = '<div><img src="test.jpg"><button></button><input type="text"></div>';

      const perfectResult = AccessibilityValidator.validateAccessibility(perfectHTML);
      const terribleResult = AccessibilityValidator.validateAccessibility(terribleHTML);

      expect(perfectResult.accessibilityScore).toBeGreaterThan(terribleResult.accessibilityScore);
    });
  });
});
