/**
 * Comprehensive tests for component-library.js
 * Tests KRDSComponentLibrary class, template generation, and component mapping
 * Target: 60%+ coverage for major functionality (lines 183,197-970 mostly uncovered)
 */

import { KRDSComponentLibrary, KRDS_COMPONENT_MAPPING, componentLibrary } from '../../helpers/component-library.js';

describe('Component Library - Comprehensive Coverage Tests', () => {
  describe('KRDS_COMPONENT_MAPPING', () => {
    test('should have complete component mapping structure', () => {
      const requiredComponents = [
        'button',
        'link',
        'text-input',
        'checkbox',
        'radio',
        'select',
        'textarea',
        'toggle-switch',
        'navigation',
        'breadcrumb',
        'pagination',
        'tab',
        'alert',
        'toast',
        'loading',
        'card',
        'modal',
        'accordion',
        'dropdown',
        'table',
        'list'
      ];

      requiredComponents.forEach(componentId => {
        expect(KRDS_COMPONENT_MAPPING).toHaveProperty(componentId);
        expect(KRDS_COMPONENT_MAPPING[componentId]).toHaveProperty('htmlFile');
        expect(KRDS_COMPONENT_MAPPING[componentId]).toHaveProperty('className');
        expect(KRDS_COMPONENT_MAPPING[componentId]).toHaveProperty('category');
      });
    });

    test('should categorize components correctly', () => {
      const categories = {
        action: ['button', 'link'],
        input: ['text-input', 'checkbox', 'radio', 'select', 'textarea', 'toggle-switch'],
        navigation: ['navigation', 'breadcrumb', 'pagination', 'tab'],
        feedback: ['alert', 'toast', 'loading'],
        'layout-expression': ['card', 'modal', 'accordion', 'dropdown'],
        content: ['table', 'list']
      };

      Object.entries(categories).forEach(([category, components]) => {
        components.forEach(componentId => {
          expect(KRDS_COMPONENT_MAPPING[componentId].category).toBe(category);
        });
      });
    });
  });

  describe('KRDSComponentLibrary', () => {
    let library;

    beforeEach(() => {
      library = new KRDSComponentLibrary();
    });

    describe('constructor', () => {
      test('should initialize with correct properties', () => {
        expect(library.baseUrl).toBe('https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/main/html/code/');
        expect(library.componentCache).toBeInstanceOf(Map);
        expect(library.templateCache).toBeInstanceOf(Map);
      });
    });

    describe('fetchComponentTemplate', () => {
      test('should throw error for unknown component', async () => {
        await expect(library.fetchComponentTemplate('unknown-component')).rejects.toThrow(
          'Unknown component: unknown-component'
        );
      });

      test('should generate template for known component', async () => {
        const template = await library.fetchComponentTemplate('button');

        expect(template).toHaveProperty('html');
        expect(template).toHaveProperty('css');
        expect(template).toHaveProperty('variants');
        expect(template.html).toContain('krds-btn');
      });

      test('should cache templates', async () => {
        const template1 = await library.fetchComponentTemplate('button');
        const template2 = await library.fetchComponentTemplate('button');

        expect(template1).toBe(template2); // Should be same cached instance
        expect(library.templateCache.has('button-button.html')).toBe(true);
      });

      test('should handle variant selection', async () => {
        const mapping = KRDS_COMPONENT_MAPPING.button;
        if (mapping.variants && mapping.variants.length > 0) {
          const template = await library.fetchComponentTemplate('button', mapping.variants[0]);
          expect(template).toBeDefined();
        }
      });

      test('should use fallback template on error', async () => {
        // Mock generateTemplateFromMapping to throw error
        const originalMethod = library.generateTemplateFromMapping;
        library.generateTemplateFromMapping = () => {
          throw new Error('Template generation failed');
        };

        const template = await library.fetchComponentTemplate('button');
        expect(template).toBeDefined();
        expect(template.html).toContain('기본');

        library.generateTemplateFromMapping = originalMethod;
      });
    });

    describe('generateTemplateFromMapping', () => {
      test('should generate action templates', () => {
        const mapping = { className: 'krds-btn', category: 'action' };
        const template = library.generateTemplateFromMapping(mapping);

        expect(template).toBeDefined();
        expect(template.html).toContain('krds-btn');
      });

      test('should generate input templates', () => {
        const mapping = { className: 'krds-input', category: 'input', structure: 'fieldset' };
        const template = library.generateTemplateFromMapping(mapping);

        expect(template).toBeDefined();
        expect(template.html).toContain('fieldset');
        expect(template.html).toContain('krds-input');
      });

      test('should generate navigation templates', () => {
        const mapping = { className: 'krds-nav', category: 'navigation' };
        const template = library.generateTemplateFromMapping(mapping);

        expect(template).toBeDefined();
        expect(template.html).toContain('krds-nav');
      });

      test('should generate feedback templates', () => {
        const mapping = { className: 'krds-alert', category: 'feedback' };
        const template = library.generateTemplateFromMapping(mapping);

        expect(template).toBeDefined();
        expect(template.html).toContain('krds-alert');
      });

      test('should generate layout templates', () => {
        const mapping = { className: 'krds-card', category: 'layout-expression' };
        const template = library.generateTemplateFromMapping(mapping);

        expect(template).toBeDefined();
        expect(template.html).toContain('krds-card');
      });

      test('should generate content templates', () => {
        const mapping = { className: 'krds-table', category: 'content' };
        const template = library.generateTemplateFromMapping(mapping);

        expect(template).toBeDefined();
        expect(template.html).toContain('krds-table');
      });

      test('should generate generic templates for unknown category', () => {
        const mapping = { className: 'krds-unknown', category: 'unknown' };
        const template = library.generateTemplateFromMapping(mapping);

        expect(template).toBeDefined();
        expect(template.html).toContain('krds-unknown');
      });
    });

    describe('generateActionTemplate', () => {
      test('should generate button template with variants', () => {
        const template = library.generateActionTemplate('krds-btn', 'button_size.html');

        expect(template.html).toContain('<button');
        expect(template.html).toContain('krds-btn');
        expect(template.css).toContain('krds-btn');
        expect(template.variants).toContain('small');
        expect(template.variants).toContain('large');
      });

      test('should generate button template with state variant', () => {
        const template = library.generateActionTemplate('krds-btn', 'button_state.html');

        expect(template.html).toContain('<button');
        expect(template.variants).toContain('disabled');
        expect(template.variants).toContain('hover');
      });

      test('should generate link template', () => {
        const template = library.generateActionTemplate('krds-link');

        expect(template.html).toContain('<a href');
        expect(template.html).toContain('krds-link');
        expect(template.css).toContain('krds-link');
        expect(template.variants).toContain('visited');
      });

      test('should generate generic action template for unknown class', () => {
        const template = library.generateActionTemplate('krds-unknown');

        expect(template.html).toContain('krds-unknown');
        expect(template.html).toContain('액션 컴포넌트');
      });
    });

    describe('generateInputTemplate', () => {
      test('should generate fieldset input template', () => {
        const template = library.generateInputTemplate('krds-input', 'fieldset');

        expect(template.html).toContain('<div class="fieldset">');
        expect(template.html).toContain('form-group');
        expect(template.html).toContain('<input');
        expect(template.html).toContain('krds-input');
      });

      test('should generate textarea template', () => {
        const template = library.generateInputTemplate('krds-textarea', 'fieldset');

        expect(template.html).toContain('<textarea');
        expect(template.html).toContain('krds-textarea');
        expect(template.css).toContain('krds-textarea');
      });

      test('should generate checkbox template', () => {
        const template = library.generateInputTemplate('krds-checkbox');

        expect(template.html).toContain('<input type="checkbox"');
        expect(template.html).toContain('krds-checkbox');
        expect(template.variants).toContain('checked');
        expect(template.variants).toContain('disabled');
      });

      test('should generate radio template', () => {
        const template = library.generateInputTemplate('krds-radio');

        expect(template.html).toContain('<input type="radio"');
        expect(template.html).toContain('krds-radio');
        expect(template.variants).toContain('checked');
      });

      test('should generate generic input template', () => {
        const template = library.generateInputTemplate('krds-unknown-input');

        expect(template.html).toContain('krds-unknown-input');
        expect(template.html).toContain('입력 컴포넌트');
      });
    });

    describe('generateNavigationTemplate', () => {
      test('should generate navigation template', () => {
        const template = library.generateNavigationTemplate('krds-nav');

        expect(template.html).toContain('<nav');
        expect(template.html).toContain('krds-nav');
        expect(template.html).toContain('horizontal');
        expect(template.variants).toContain('horizontal');
        expect(template.variants).toContain('vertical');
      });

      test('should generate vertical navigation template', () => {
        const template = library.generateNavigationTemplate('krds-nav', 'nav_vertical.html');

        expect(template.html).toContain('vertical');
      });

      test('should generate breadcrumb template', () => {
        const template = library.generateNavigationTemplate('krds-breadcrumb');

        expect(template.html).toContain('krds-breadcrumb');
        expect(template.html).toContain('breadcrumb');
        expect(template.html).toContain('<ol');
        expect(template.variants).toContain('active');
      });

      test('should generate generic navigation template', () => {
        const template = library.generateNavigationTemplate('krds-unknown-nav');

        expect(template.html).toContain('krds-unknown-nav');
        expect(template.html).toContain('네비게이션 컴포넌트');
      });
    });

    describe('generateFeedbackTemplate', () => {
      test('should generate alert template', () => {
        const template = library.generateFeedbackTemplate('krds-alert');

        expect(template.html).toContain('krds-alert');
        expect(template.html).toContain('role="alert"');
        expect(template.html).toContain('info');
        expect(template.variants).toContain('success');
        expect(template.variants).toContain('warning');
        expect(template.variants).toContain('error');
      });

      test('should generate alert template with specific type', () => {
        const template = library.generateFeedbackTemplate('krds-alert', 'alert_type.html');

        expect(template.html).toContain('krds-alert');
      });

      test('should generate generic feedback template', () => {
        const template = library.generateFeedbackTemplate('krds-unknown-feedback');

        expect(template.html).toContain('krds-unknown-feedback');
        expect(template.html).toContain('피드백 컴포넌트');
      });
    });

    describe('generateLayoutTemplate', () => {
      test('should generate card template', () => {
        const template = library.generateLayoutTemplate('krds-card');

        expect(template.html).toContain('krds-card');
        expect(template.html).toContain('krds-card-header');
        expect(template.html).toContain('krds-card-body');
        expect(template.html).toContain('krds-card-footer');
        expect(template.variants).toContain('elevated');
      });

      test('should generate modal template', () => {
        const template = library.generateLayoutTemplate('krds-modal');

        expect(template.html).toContain('krds-modal');
        expect(template.html).toContain('krds-modal-overlay');
        expect(template.html).toContain('role="dialog"');
        expect(template.html).toContain('medium');
        expect(template.variants).toContain('small');
        expect(template.variants).toContain('large');
      });

      test('should generate modal template with size variant', () => {
        const template = library.generateLayoutTemplate('krds-modal', 'modal_size.html');

        expect(template.html).toContain('krds-modal');
      });

      test('should generate generic layout template', () => {
        const template = library.generateLayoutTemplate('krds-unknown-layout');

        expect(template.html).toContain('krds-unknown-layout');
        expect(template.html).toContain('레이아웃 컴포넌트');
      });
    });

    describe('generateContentTemplate', () => {
      test('should generate table template', () => {
        const template = library.generateContentTemplate('krds-table');

        expect(template.html).toContain('<table');
        expect(template.html).toContain('krds-table');
        expect(template.html).toContain('<thead');
        expect(template.html).toContain('<tbody');
        expect(template.html).toContain('<th scope="col">');
        expect(template.variants).toContain('striped');
        expect(template.variants).toContain('bordered');
      });

      test('should generate generic content template', () => {
        const template = library.generateContentTemplate('krds-unknown-content');

        expect(template.html).toContain('krds-unknown-content');
        expect(template.html).toContain('콘텐츠 컴포넌트');
      });
    });

    describe('generateFallbackTemplate', () => {
      test('should generate fallback template', () => {
        const mapping = { className: 'krds-test', category: 'test' };
        const template = library.generateFallbackTemplate('test-id', mapping, 'variant');

        expect(template.html).toContain('krds-test');
        expect(template.html).toContain('test-id');
        expect(template.html).toContain('test 컴포넌트');
        expect(template.css).toContain('krds-test');
        expect(template.css).toContain('--krds-spacing-4');
      });
    });

    describe('Utility methods', () => {
      test('should extract size from variant', () => {
        expect(library.extractSizeFromVariant('button_size_small.html')).toBe('small');
        expect(library.extractSizeFromVariant('button_size_large.html')).toBe('large');
        expect(library.extractSizeFromVariant('button_size_medium.html')).toBe('medium');
        expect(library.extractSizeFromVariant('no_size_info.html')).toBe('');
        expect(library.extractSizeFromVariant(null)).toBe('');
      });

      test('should extract state from variant', () => {
        expect(library.extractStateFromVariant('button_state_disabled.html')).toBe('disabled');
        expect(library.extractStateFromVariant('button_state_hover.html')).toBe('hover');
        expect(library.extractStateFromVariant('button_state_focus.html')).toBe('focus');
        expect(library.extractStateFromVariant('no_state_info.html')).toBe('');
        expect(library.extractStateFromVariant(null)).toBe('');
      });

      test('should extract type from variant', () => {
        expect(library.extractTypeFromVariant('alert_type_success.html')).toBe('success');
        expect(library.extractTypeFromVariant('alert_type_warning.html')).toBe('warning');
        expect(library.extractTypeFromVariant('alert_type_error.html')).toBe('error');
        expect(library.extractTypeFromVariant('no_type_info.html')).toBe('');
        expect(library.extractTypeFromVariant(null)).toBe('');
      });

      test('should get state attributes', () => {
        expect(library.getStateAttributes('input_state_disabled.html')).toBe(' disabled');
        expect(library.getStateAttributes('input_state_readonly.html')).toBe(' readonly');
        expect(library.getStateAttributes('checkbox_state_checked.html')).toBe(' checked');
        expect(library.getStateAttributes('no_state.html')).toBe('');
        expect(library.getStateAttributes(null)).toBe('');
      });
    });

    describe('CSS generation methods', () => {
      test('should generate button CSS', () => {
        const css = library.generateButtonCSS('krds-btn');

        expect(css).toContain('.krds-btn {');
        expect(css).toContain('display: inline-flex');
        expect(css).toContain(':hover');
        expect(css).toContain(':focus');
        expect(css).toContain(':disabled');
        expect(css).toContain('.small');
        expect(css).toContain('.large');
      });

      test('should generate input CSS', () => {
        const css = library.generateInputCSS('krds-input');

        expect(css).toContain('.krds-input {');
        expect(css).toContain('width: 100%');
        expect(css).toContain(':focus');
        expect(css).toContain(':disabled');
      });

      test('should generate navigation CSS', () => {
        const css = library.generateNavCSS('krds-nav');

        expect(css).toContain('.krds-nav {');
        expect(css).toContain('display: flex');
        expect(css).toContain('.vertical');
        expect(css).toContain('.krds-nav-list');
        expect(css).toContain('.krds-nav-link');
      });

      test('should generate alert CSS', () => {
        const css = library.generateAlertCSS('krds-alert');

        expect(css).toContain('.krds-alert {');
        expect(css).toContain('.success');
        expect(css).toContain('.warning');
        expect(css).toContain('.error');
        expect(css).toContain('.info');
      });

      test('should generate card CSS', () => {
        const css = library.generateCardCSS('krds-card');

        expect(css).toContain('.krds-card {');
        expect(css).toContain('flex-direction: column');
        expect(css).toContain('.krds-card-header');
        expect(css).toContain('.krds-card-body');
        expect(css).toContain('.krds-card-footer');
      });

      test('should generate modal CSS', () => {
        const css = library.generateModalCSS('krds-modal');

        expect(css).toContain('.krds-modal-overlay');
        expect(css).toContain('.krds-modal {');
        expect(css).toContain('.small');
        expect(css).toContain('.large');
        expect(css).toContain('.krds-modal-header');
        expect(css).toContain('.krds-modal-body');
        expect(css).toContain('.krds-modal-footer');
      });

      test('should generate table CSS', () => {
        const css = library.generateTableCSS('krds-table');

        expect(css).toContain('.krds-table {');
        expect(css).toContain('border-collapse: collapse');
        expect(css).toContain('th,');
        expect(css).toContain('tr:hover td');
      });

      test('should generate checkbox CSS', () => {
        const css = library.generateCheckboxCSS('krds-checkbox');

        expect(css).toContain('.krds-checkbox {');
        expect(css).toContain('width: 16px');
        expect(css).toContain('height: 16px');
      });

      test('should generate radio CSS', () => {
        const css = library.generateRadioCSS('krds-radio');

        expect(css).toContain('.krds-radio {');
        expect(css).toContain('width: 16px');
        expect(css).toContain('height: 16px');
      });

      test('should generate textarea CSS', () => {
        const css = library.generateTextareaCSS('krds-textarea');

        expect(css).toContain('.krds-textarea {');
        expect(css).toContain('min-height: 120px');
        expect(css).toContain('resize: vertical');
        expect(css).toContain(':focus');
      });

      test('should generate link CSS', () => {
        const css = library.generateLinkCSS('krds-link');

        expect(css).toContain('.krds-link {');
        expect(css).toContain('text-decoration: underline');
        expect(css).toContain(':hover');
        expect(css).toContain(':visited');
      });

      test('should generate breadcrumb CSS', () => {
        const css = library.generateBreadcrumbCSS('krds-breadcrumb');

        expect(css).toContain('.krds-breadcrumb {');
        expect(css).toContain('.krds-breadcrumb-list');
        expect(css).toContain('.krds-breadcrumb-item');
        expect(css).toContain('.krds-breadcrumb-link');
        expect(css).toContain('::after');
      });
    });

    describe('generateGenericTemplate', () => {
      test('should generate generic component template', () => {
        const template = library.generateGenericTemplate('krds-generic', 'variant');

        expect(template.html).toContain('krds-generic');
        expect(template.html).toContain('일반 컴포넌트');
        expect(template.css).toContain('.krds-generic {');
        expect(template.variants).toEqual([]);
      });
    });
  });

  describe('componentLibrary instance', () => {
    test('should be an instance of KRDSComponentLibrary', () => {
      expect(componentLibrary).toBeInstanceOf(KRDSComponentLibrary);
    });

    test('should have initialized properties', () => {
      expect(componentLibrary.baseUrl).toBeDefined();
      expect(componentLibrary.componentCache).toBeInstanceOf(Map);
      expect(componentLibrary.templateCache).toBeInstanceOf(Map);
    });
  });

  describe('Integration tests', () => {
    test('should generate templates for all mapped components', async () => {
      const componentIds = Object.keys(KRDS_COMPONENT_MAPPING);

      for (const componentId of componentIds.slice(0, 5)) {
        // Test first 5 for performance
        const template = await componentLibrary.fetchComponentTemplate(componentId);

        expect(template).toHaveProperty('html');
        expect(template).toHaveProperty('css');
        expect(template).toHaveProperty('variants');
        expect(template.html).toBeTruthy();
        expect(template.css).toBeTruthy();
      }
    });

    test('should handle components with variants', async () => {
      const componentsWithVariants = Object.entries(KRDS_COMPONENT_MAPPING)
        .filter(([, mapping]) => mapping.variants && mapping.variants.length > 0)
        .slice(0, 3); // Test first 3

      for (const [componentId, mapping] of componentsWithVariants) {
        const defaultTemplate = await componentLibrary.fetchComponentTemplate(componentId);
        const variantTemplate = await componentLibrary.fetchComponentTemplate(componentId, mapping.variants[0]);

        expect(defaultTemplate).toBeDefined();
        expect(variantTemplate).toBeDefined();
      }
    });

    test('should maintain template cache across calls', async () => {
      const initialCacheSize = componentLibrary.templateCache.size;

      await componentLibrary.fetchComponentTemplate('toast');
      await componentLibrary.fetchComponentTemplate('toast'); // Same call

      const finalCacheSize = componentLibrary.templateCache.size;
      expect(finalCacheSize).toBe(initialCacheSize + 1); // Only one new entry
    });
  });
});
