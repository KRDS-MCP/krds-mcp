/**
 * KRDS Component Library Enhanced Test Coverage
 * Targeting 60%+ coverage for helpers/component-library.js
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { KRDS_COMPONENT_MAPPING, KRDSComponentLibrary, componentLibrary } from '../../helpers/component-library.js';

describe('Component Library Enhanced Coverage', () => {
  describe('KRDS_COMPONENT_MAPPING', () => {
    test('should have component mapping object', () => {
      expect(KRDS_COMPONENT_MAPPING).toBeDefined();
      expect(typeof KRDS_COMPONENT_MAPPING).toBe('object');
    });

    test('should have button component mapping', () => {
      expect(KRDS_COMPONENT_MAPPING.button).toBeDefined();
      expect(KRDS_COMPONENT_MAPPING.button.htmlFile).toBe('button.html');
      expect(KRDS_COMPONENT_MAPPING.button.className).toBe('krds-btn');
      expect(KRDS_COMPONENT_MAPPING.button.category).toBe('action');
    });

    test('should have input component mapping', () => {
      expect(KRDS_COMPONENT_MAPPING['text-input']).toBeDefined();
      expect(KRDS_COMPONENT_MAPPING['text-input'].className).toBe('krds-input');
      expect(KRDS_COMPONENT_MAPPING['text-input'].category).toBe('input');
    });

    test('should have various component categories', () => {
      const categories = ['action', 'input', 'navigation', 'feedback', 'layout-expression', 'content'];
      const foundCategories = new Set();

      Object.values(KRDS_COMPONENT_MAPPING).forEach(mapping => {
        foundCategories.add(mapping.category);
      });

      categories.forEach(category => {
        expect(Array.from(foundCategories)).toContain(category);
      });
    });

    test('should have consistent mapping structure', () => {
      Object.entries(KRDS_COMPONENT_MAPPING).forEach(([componentId, mapping]) => {
        expect(mapping).toHaveProperty('htmlFile');
        expect(mapping).toHaveProperty('className');
        expect(mapping).toHaveProperty('category');
        expect(typeof mapping.htmlFile).toBe('string');
        expect(typeof mapping.className).toBe('string');
        expect(typeof mapping.category).toBe('string');
      });
    });
  });

  describe('KRDSComponentLibrary Class', () => {
    let library;

    beforeEach(() => {
      library = new KRDSComponentLibrary();
    });

    test('should create instance with template cache', () => {
      expect(library).toBeDefined();
      expect(library.templateCache instanceof Map).toBe(true);
      expect(library.componentCache instanceof Map).toBe(true);
    });

    test('should get component data', async () => {
      const component = await library.getComponent('button');
      expect(component).toBeDefined();
      expect(typeof component).toBe('object');
      // The component has metadata fields like id, name, className, etc.
      expect(component).toHaveProperty('id');
      expect(component).toHaveProperty('name');
    });

    test('should handle invalid component', async () => {
      const component = await library.getComponent('invalid-component');
      expect(component).toBeNull();
    });

    test('should get all components', () => {
      const components = library.getAllComponents();
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);
    });

    test('should get components by category', () => {
      const actionComponents = library.getComponentsByCategory('action');
      expect(Array.isArray(actionComponents)).toBe(true);

      const inputComponents = library.getComponentsByCategory('input');
      expect(Array.isArray(inputComponents)).toBe(true);
    });

    test('should handle invalid category', () => {
      const components = library.getComponentsByCategory('invalid-category');
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBe(0);
    });

    test('should search components', () => {
      const searchResults = library.searchComponents('button');
      expect(Array.isArray(searchResults)).toBe(true);
      expect(searchResults.length).toBeGreaterThan(0);

      const foundButton = searchResults.some(
        component => component.id === 'button' || component.className.includes('btn')
      );
      expect(foundButton).toBe(true);
    });

    test('should handle empty search query', () => {
      const results = library.searchComponents('');
      expect(Array.isArray(results)).toBe(true);
    });

    test('should check if component exists', () => {
      expect(library.hasComponent('button')).toBe(true);
      expect(library.hasComponent('invalid-component')).toBe(false);
    });

    test('should get component metadata', () => {
      const metadata = library.getComponentMetadata('button');
      expect(metadata).toBeDefined();
      expect(metadata).toHaveProperty('htmlFile');
      expect(metadata).toHaveProperty('className');
      expect(metadata).toHaveProperty('category');
    });

    test('should handle metadata for invalid component', () => {
      const metadata = library.getComponentMetadata('invalid-component');
      expect(metadata).toBeNull();
    });

    test('should fetch component template', async () => {
      const template = await library.fetchComponentTemplate('button');
      expect(typeof template).toBe('object');
      expect(template).toBeDefined();
    });

    test('should handle template variants', async () => {
      const primaryTemplate = await library.fetchComponentTemplate('button', 'primary');
      const secondaryTemplate = await library.fetchComponentTemplate('button', 'secondary');

      expect(typeof primaryTemplate).toBe('object');
      expect(typeof secondaryTemplate).toBe('object');
    });

    test('should cache templates', async () => {
      const template1 = await library.fetchComponentTemplate('button');
      const template2 = await library.fetchComponentTemplate('button');

      expect(template1).toBe(template2);
      expect(library.templateCache.size).toBeGreaterThan(0);
    });

    test('should generate templates from mapping', () => {
      const buttonMapping = KRDS_COMPONENT_MAPPING.button;
      const template = library.generateTemplateFromMapping(buttonMapping);

      expect(typeof template).toBe('object');
      expect(template).toBeDefined();
    });

    test('should handle different template types', () => {
      const buttonTemplate = library.generateTemplateFromMapping(KRDS_COMPONENT_MAPPING.button);
      const inputTemplate = library.generateTemplateFromMapping(KRDS_COMPONENT_MAPPING['text-input']);

      expect(typeof buttonTemplate).toBe('object');
      expect(typeof inputTemplate).toBe('object');
      expect(buttonTemplate).not.toBe(inputTemplate);
    });

    test('should extract size from variant', () => {
      expect(library.extractSizeFromVariant('small')).toBe('small');
      expect(library.extractSizeFromVariant('large')).toBe('large');
      expect(library.extractSizeFromVariant('medium')).toBe('medium');
      expect(library.extractSizeFromVariant('')).toBe('');
      expect(library.extractSizeFromVariant('primary')).toBe('');
    });

    test('should extract state from variant', () => {
      expect(library.extractStateFromVariant('disabled')).toBe('disabled');
      expect(library.extractStateFromVariant('hover')).toBe('hover');
      expect(library.extractStateFromVariant('focus')).toBe('focus');
      expect(library.extractStateFromVariant('normal')).toBe('');
      expect(library.extractStateFromVariant('')).toBe('');
    });

    test('should extract type from variant', () => {
      // Based on the actual implementation, these methods look for specific patterns
      // Let's test with what they actually extract
      expect(library.extractTypeFromVariant('alert_type_success.html')).toBe('success');
      expect(library.extractTypeFromVariant('button_warning.html')).toBe('warning');
      expect(library.extractTypeFromVariant('simple')).toBe('');
      expect(library.extractTypeFromVariant('')).toBe('');
    });

    test('should generate state attributes', () => {
      const disabledAttrs = library.getStateAttributes('disabled');
      expect(disabledAttrs).toContain('disabled');

      const readonlyAttrs = library.getStateAttributes('readonly');
      expect(readonlyAttrs).toContain('readonly');
    });

    test('should generate CSS for different components', () => {
      const buttonCSS = library.generateButtonCSS('krds-btn');
      const inputCSS = library.generateInputCSS('krds-input');

      expect(typeof buttonCSS).toBe('string');
      expect(typeof inputCSS).toBe('string');
      expect(buttonCSS).toContain('krds-btn');
      expect(inputCSS).toContain('krds-input');
    });
  });

  describe('Default component library instance', () => {
    test('should export default instance', () => {
      expect(componentLibrary).toBeDefined();
      expect(componentLibrary instanceof KRDSComponentLibrary).toBe(true);
    });

    test('should work with default instance methods', async () => {
      const component = await componentLibrary.getComponent('button');
      expect(component).toBeDefined();

      const allComponents = componentLibrary.getAllComponents();
      expect(Array.isArray(allComponents)).toBe(true);

      const hasButton = componentLibrary.hasComponent('button');
      expect(hasButton).toBe(true);
    });

    test('should maintain consistent state', async () => {
      const component1 = await componentLibrary.getComponent('button');
      const component2 = await componentLibrary.getComponent('button');

      expect(component1).toBe(component2);
    });
  });

  describe('Integration tests', () => {
    test('should work with multiple component types', async () => {
      const button = await componentLibrary.getComponent('button');
      const input = await componentLibrary.getComponent('text-input');
      const nav = await componentLibrary.getComponent('navigation');

      expect(button).toBeDefined();
      expect(input).toBeDefined();
      expect(nav).toBeDefined();
    });

    test('should search across all components', () => {
      const buttonResults = componentLibrary.searchComponents('button');
      expect(buttonResults.length).toBeGreaterThan(0);

      const inputResults = componentLibrary.searchComponents('input');
      expect(inputResults.length).toBeGreaterThan(0);
    });

    test('should handle component categories correctly', () => {
      const categories = ['action', 'input', 'navigation', 'feedback', 'layout-expression', 'content'];

      categories.forEach(category => {
        const components = componentLibrary.getComponentsByCategory(category);
        expect(Array.isArray(components)).toBe(true);
      });
    });
  });
});
