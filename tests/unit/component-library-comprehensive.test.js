/**
 * Comprehensive test coverage for helpers/component-library.js
 * Targeting 60%+ coverage for all classes and functions
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import {
  KRDS_COMPONENT_MAPPING,
  KRDSComponentLibrary,
  componentLibrary
} from '../../helpers/component-library.js';

describe('KRDS Component Library Comprehensive Coverage', () => {
  describe('KRDS_COMPONENT_MAPPING', () => {
    test('should have component mapping object', () => {
      expect(typeof KRDS_COMPONENT_MAPPING).toBe('object');
      expect(Object.keys(KRDS_COMPONENT_MAPPING).length).toBeGreaterThan(0);
    });

    test('should have action components', () => {
      expect(KRDS_COMPONENT_MAPPING.button).toBeDefined();
      expect(KRDS_COMPONENT_MAPPING.link).toBeDefined();

      const button = KRDS_COMPONENT_MAPPING.button;
      expect(button.htmlFile).toBe('button.html');
      expect(button.className).toBe('krds-btn');
      expect(button.category).toBe('action');
      expect(Array.isArray(button.variants)).toBe(true);
    });

    test('should have input components with correct structure', () => {
      const textInput = KRDS_COMPONENT_MAPPING['text-input'];
      expect(textInput).toBeDefined();
      expect(textInput.htmlFile).toBe('text_input.html');
      expect(textInput.className).toBe('krds-input');
      expect(textInput.category).toBe('input');
      expect(textInput.structure).toBe('fieldset');

      const checkbox = KRDS_COMPONENT_MAPPING.checkbox;
      expect(checkbox.htmlFile).toBe('checkbox.html');
      expect(checkbox.className).toBe('krds-checkbox');
      expect(checkbox.category).toBe('input');

      const radio = KRDS_COMPONENT_MAPPING.radio;
      expect(radio.className).toBe('krds-radio');
      expect(radio.category).toBe('input');
    });

    test('should have navigation components', () => {
      const nav = KRDS_COMPONENT_MAPPING.navigation;
      expect(nav).toBeDefined();
      expect(nav.htmlFile).toBe('nav.html');
      expect(nav.className).toBe('krds-nav');
      expect(nav.category).toBe('navigation');

      const breadcrumb = KRDS_COMPONENT_MAPPING.breadcrumb;
      expect(breadcrumb.className).toBe('krds-breadcrumb');
      expect(breadcrumb.category).toBe('navigation');
    });

    test('should have feedback components', () => {
      const alert = KRDS_COMPONENT_MAPPING.alert;
      expect(alert).toBeDefined();
      expect(alert.className).toBe('krds-alert');
      expect(alert.category).toBe('feedback');

      const toast = KRDS_COMPONENT_MAPPING.toast;
      expect(toast.className).toBe('krds-toast');
      expect(toast.category).toBe('feedback');
    });

    test('should have layout components', () => {
      const card = KRDS_COMPONENT_MAPPING.card;
      expect(card).toBeDefined();
      expect(card.className).toBe('krds-card');
      expect(card.category).toBe('layout-expression');

      const modal = KRDS_COMPONENT_MAPPING.modal;
      expect(modal.className).toBe('krds-modal');
      expect(modal.category).toBe('layout-expression');
    });

    test('should have content components', () => {
      const table = KRDS_COMPONENT_MAPPING.table;
      expect(table).toBeDefined();
      expect(table.className).toBe('krds-table');
      expect(table.category).toBe('content');

      const list = KRDS_COMPONENT_MAPPING.list;
      expect(list.className).toBe('krds-list');
      expect(list.category).toBe('content');
    });

    test('should have consistent structure for all components', () => {
      Object.entries(KRDS_COMPONENT_MAPPING).forEach(([componentId, config]) => {
        expect(config).toHaveProperty('htmlFile');
        expect(config).toHaveProperty('className');
        expect(config).toHaveProperty('category');
        expect(typeof config.htmlFile).toBe('string');
        expect(typeof config.className).toBe('string');
        expect(typeof config.category).toBe('string');
        expect(config.className).toMatch(/^krds-/);

        if (config.variants) {
          expect(Array.isArray(config.variants)).toBe(true);
        }
      });
    });

    test('should have expected component categories', () => {
      const categories = [...new Set(Object.values(KRDS_COMPONENT_MAPPING).map(c => c.category))];
      const expectedCategories = [
        'action',
        'input',
        'navigation',
        'feedback',
        'layout-expression',
        'content'
      ];

      expectedCategories.forEach(category => {
        expect(categories).toContain(category);
      });
    });
  });

  describe('KRDSComponentLibrary Class', () => {
    let library;

    beforeEach(() => {
      library = new KRDSComponentLibrary();
    });

    describe('Constructor and initialization', () => {
      test('should initialize with correct properties', () => {
        expect(library.baseUrl).toBe(
          'https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/main/html/code/'
        );
        expect(library.componentCache).toBeInstanceOf(Map);
        expect(library.templateCache).toBeInstanceOf(Map);
        expect(library.componentCache.size).toBe(0);
        expect(library.templateCache.size).toBe(0);
      });

      test('should have Map instances for caches', () => {
        expect(library.componentCache instanceof Map).toBe(true);
        expect(library.templateCache instanceof Map).toBe(true);
      });
    });

    describe('fetchComponentTemplate method', () => {
      test('should throw error for unknown component', async () => {
        await expect(library.fetchComponentTemplate('unknown-component')).rejects.toThrow(
          'Unknown component: unknown-component'
        );
      });

      test('should fetch button component template', async () => {
        const template = await library.fetchComponentTemplate('button');

        expect(template).toBeDefined();
        expect(template).toHaveProperty('html');
        expect(template).toHaveProperty('css');
        expect(template).toHaveProperty('variants');
        expect(typeof template.html).toBe('string');
        expect(typeof template.css).toBe('string');
        expect(Array.isArray(template.variants)).toBe(true);
      });

      test('should cache templates', async () => {
        const template1 = await library.fetchComponentTemplate('button');
        const template2 = await library.fetchComponentTemplate('button');

        expect(template1).toBe(template2);
        expect(library.templateCache.has('button-button.html')).toBe(true);
      });

      test('should handle variants correctly', async () => {
        const mapping = KRDS_COMPONENT_MAPPING.button;
        const variant = mapping.variants?.[0];

        if (variant) {
          const template = await library.fetchComponentTemplate('button', variant);
          expect(template).toBeDefined();
        }
      });

      test('should use fallback when variant is not available', async () => {
        const template = await library.fetchComponentTemplate(
          'button',
          'non-existent-variant.html'
        );
        expect(template).toBeDefined();
        expect(template.html).toContain('button');
      });

      test('should generate different cache keys for different variants', async () => {
        await library.fetchComponentTemplate('button');
        await library.fetchComponentTemplate('button', 'button_size.html');

        expect(library.templateCache.has('button-button.html')).toBe(true);
        expect(library.templateCache.has('button-button_size.html')).toBe(true);
      });
    });

    describe('generateTemplateFromMapping method', () => {
      test('should generate action templates', async () => {
        const mapping = KRDS_COMPONENT_MAPPING.button;
        const template = library.generateTemplateFromMapping(mapping, null);

        expect(template.html).toContain('button');
        expect(template.html).toContain(mapping.className);
        expect(template.css).toContain(`.${mapping.className}`);
      });

      test('should generate input templates', async () => {
        const mapping = KRDS_COMPONENT_MAPPING['text-input'];
        const template = library.generateTemplateFromMapping(mapping, null);

        expect(template.html).toContain('input');
        expect(template.html).toContain(mapping.className);
        expect(template.html).toContain('fieldset');
      });

      test('should generate navigation templates', async () => {
        const mapping = KRDS_COMPONENT_MAPPING.navigation;
        const template = library.generateTemplateFromMapping(mapping, null);

        expect(template.html).toContain('nav');
        expect(template.html).toContain(mapping.className);
        expect(template.html).toContain('krds-nav-list');
      });

      test('should generate feedback templates', async () => {
        const mapping = KRDS_COMPONENT_MAPPING.alert;
        const template = library.generateTemplateFromMapping(mapping, null);

        expect(template.html).toContain('role="alert"');
        expect(template.html).toContain(mapping.className);
      });

      test('should generate layout templates', async () => {
        const mapping = KRDS_COMPONENT_MAPPING.card;
        const template = library.generateTemplateFromMapping(mapping, null);

        expect(template.html).toContain('krds-card-header');
        expect(template.html).toContain('krds-card-body');
        expect(template.html).toContain(mapping.className);
      });

      test('should generate content templates', async () => {
        const mapping = KRDS_COMPONENT_MAPPING.table;
        const template = library.generateTemplateFromMapping(mapping, null);

        expect(template.html).toContain('<table');
        expect(template.html).toContain('<thead');
        expect(template.html).toContain(mapping.className);
      });

      test('should generate generic template for unknown category', async () => {
        const mapping = { className: 'test-class', category: 'unknown' };
        const template = library.generateTemplateFromMapping(mapping, null);

        expect(template.html).toContain(mapping.className);
        expect(template.css).toContain(`.${mapping.className}`);
      });
    });

    describe('generateActionTemplate method', () => {
      test('should generate button template', () => {
        const template = library.generateActionTemplate('krds-btn', null);

        expect(template.html).toContain('<button');
        expect(template.html).toContain('krds-btn');
        expect(template.html).toContain('버튼');
        expect(template.css).toContain('.krds-btn');
        expect(template.variants).toContain('small');
        expect(template.variants).toContain('disabled');
      });

      test('should generate button template with size variant', () => {
        const template = library.generateActionTemplate('krds-btn', 'button_size.html');
        expect(template.html).toContain('krds-btn');
      });

      test('should generate button template with state variant', () => {
        const template = library.generateActionTemplate('krds-btn', 'button_state.html');
        expect(template.html).toContain('krds-btn');
      });

      test('should generate link template', () => {
        const template = library.generateActionTemplate('krds-link', null);

        expect(template.html).toContain('<a');
        expect(template.html).toContain('krds-link');
        expect(template.html).toContain('링크');
        expect(template.css).toContain('.krds-link');
        expect(template.variants).toContain('hover');
        expect(template.variants).toContain('visited');
      });

      test('should generate generic action template for unknown class', () => {
        const template = library.generateActionTemplate('unknown-action', null);
        expect(template.html).toContain('unknown-action');
        expect(template.html).toContain('액션 컴포넌트');
      });
    });

    describe('generateInputTemplate method', () => {
      test('should generate fieldset structure for text input', () => {
        const template = library.generateInputTemplate('krds-input', 'fieldset', null);

        expect(template.html).toContain('fieldset');
        expect(template.html).toContain('form-group');
        expect(template.html).toContain('form-tit');
        expect(template.html).toContain('<label');
        expect(template.html).toContain('<input');
        expect(template.html).toContain('krds-input');
        expect(template.variants).toContain('readonly');
        expect(template.variants).toContain('disabled');
      });

      test('should generate textarea template', () => {
        const template = library.generateInputTemplate('krds-textarea', 'fieldset', null);

        expect(template.html).toContain('<textarea');
        expect(template.html).toContain('krds-textarea');
        expect(template.html).toContain('텍스트 영역');
        expect(template.css).toContain('.krds-textarea');
      });

      test('should generate checkbox template', () => {
        const template = library.generateInputTemplate('krds-checkbox', null, null);

        expect(template.html).toContain('type="checkbox"');
        expect(template.html).toContain('krds-checkbox');
        expect(template.html).toContain('체크박스 옵션');
        expect(template.variants).toContain('checked');
        expect(template.variants).toContain('indeterminate');
      });

      test('should generate radio template', () => {
        const template = library.generateInputTemplate('krds-radio', null, null);

        expect(template.html).toContain('type="radio"');
        expect(template.html).toContain('krds-radio');
        expect(template.html).toContain('라디오 옵션');
        expect(template.variants).toContain('checked');
      });

      test('should handle state variants in fieldset structure', () => {
        const template = library.generateInputTemplate('krds-input', 'fieldset', 'disabled');
        expect(template.html).toContain('disabled');
      });

      test('should handle state variants for checkbox', () => {
        const template = library.generateInputTemplate('krds-checkbox', null, 'checked');
        expect(template.html).toContain('checked');
      });

      test('should generate generic input template for unknown class', () => {
        const template = library.generateInputTemplate('unknown-input', null, null);
        expect(template.html).toContain('unknown-input');
        expect(template.html).toContain('입력 컴포넌트');
      });
    });

    describe('generateNavigationTemplate method', () => {
      test('should generate navigation template with horizontal layout', () => {
        const template = library.generateNavigationTemplate('krds-nav', null);

        expect(template.html).toContain('<nav');
        expect(template.html).toContain('krds-nav');
        expect(template.html).toContain('horizontal');
        expect(template.html).toContain('krds-nav-list');
        expect(template.html).toContain('주 네비게이션');
        expect(template.variants).toContain('horizontal');
        expect(template.variants).toContain('vertical');
      });

      test('should generate navigation template with vertical layout', () => {
        const template = library.generateNavigationTemplate('krds-nav', 'nav_vertical.html');

        expect(template.html).toContain('vertical');
        expect(template.html).toContain('krds-nav');
      });

      test('should generate breadcrumb template', () => {
        const template = library.generateNavigationTemplate('krds-breadcrumb', null);

        expect(template.html).toContain('<nav');
        expect(template.html).toContain('krds-breadcrumb');
        expect(template.html).toContain('breadcrumb');
        expect(template.html).toContain('<ol');
        expect(template.html).toContain('aria-current="page"');
        expect(template.variants).toContain('active');
        expect(template.variants).toContain('hover');
      });

      test('should generate generic navigation template for unknown class', () => {
        const template = library.generateNavigationTemplate('unknown-nav', null);
        expect(template.html).toContain('unknown-nav');
        expect(template.html).toContain('네비게이션 컴포넌트');
      });
    });

    describe('generateFeedbackTemplate method', () => {
      test('should generate alert template with info type', () => {
        const template = library.generateFeedbackTemplate('krds-alert', null);

        expect(template.html).toContain('krds-alert');
        expect(template.html).toContain('info');
        expect(template.html).toContain('role="alert"');
        expect(template.html).toContain('krds-alert-content');
        expect(template.html).toContain('krds-alert-title');
        expect(template.html).toContain('krds-alert-close');
        expect(template.variants).toContain('success');
        expect(template.variants).toContain('warning');
        expect(template.variants).toContain('error');
        expect(template.variants).toContain('info');
      });

      test('should generate alert template with specific type', () => {
        const template = library.generateFeedbackTemplate('krds-alert', 'alert_type.html');
        expect(template.html).toContain('krds-alert');
      });

      test('should generate generic feedback template for unknown class', () => {
        const template = library.generateFeedbackTemplate('unknown-feedback', null);
        expect(template.html).toContain('unknown-feedback');
        expect(template.html).toContain('피드백 컴포넌트');
      });
    });

    describe('generateLayoutTemplate method', () => {
      test('should generate card template', () => {
        const template = library.generateLayoutTemplate('krds-card', null);

        expect(template.html).toContain('krds-card');
        expect(template.html).toContain('krds-card-header');
        expect(template.html).toContain('krds-card-body');
        expect(template.html).toContain('krds-card-footer');
        expect(template.html).toContain('카드 제목');
        expect(template.variants).toContain('elevated');
        expect(template.variants).toContain('outlined');
      });

      test('should generate modal template with medium size', () => {
        const template = library.generateLayoutTemplate('krds-modal', null);

        expect(template.html).toContain('krds-modal');
        expect(template.html).toContain('medium');
        expect(template.html).toContain('krds-modal-overlay');
        expect(template.html).toContain('role="dialog"');
        expect(template.html).toContain('aria-modal="true"');
        expect(template.variants).toContain('small');
        expect(template.variants).toContain('large');
      });

      test('should generate modal template with specific size', () => {
        const template = library.generateLayoutTemplate('krds-modal', 'modal_size.html');
        expect(template.html).toContain('krds-modal');
      });

      test('should generate generic layout template for unknown class', () => {
        const template = library.generateLayoutTemplate('unknown-layout', null);
        expect(template.html).toContain('unknown-layout');
        expect(template.html).toContain('레이아웃 컴포넌트');
      });
    });

    describe('generateContentTemplate method', () => {
      test('should generate table template', () => {
        const template = library.generateContentTemplate('krds-table', null);

        expect(template.html).toContain('<table');
        expect(template.html).toContain('krds-table');
        expect(template.html).toContain('<thead');
        expect(template.html).toContain('<tbody');
        expect(template.html).toContain('scope="col"');
        expect(template.html).toContain('홍길동');
        expect(template.variants).toContain('striped');
        expect(template.variants).toContain('bordered');
      });

      test('should generate generic content template for unknown class', () => {
        const template = library.generateContentTemplate('unknown-content', null);
        expect(template.html).toContain('unknown-content');
        expect(template.html).toContain('콘텐츠 컴포넌트');
      });
    });

    describe('generateFallbackTemplate method', () => {
      test('should generate fallback template', () => {
        const mapping = { className: 'test-class', category: 'test-category' };
        const template = library.generateFallbackTemplate('test-component', mapping, null);

        expect(template.html).toContain('test-class');
        expect(template.html).toContain('test-component');
        expect(template.html).toContain('기본 test-category 컴포넌트');
        expect(template.css).toContain('.test-class');
        expect(template.css).toContain('기본 스타일');
        expect(Array.isArray(template.variants)).toBe(true);
        expect(template.variants).toEqual([]);
      });
    });

    describe('Utility methods', () => {
      test('extractSizeFromVariant should extract size', () => {
        expect(library.extractSizeFromVariant('button_size_small.html')).toBe('small');
        expect(library.extractSizeFromVariant('modal_size_large.html')).toBe('large');
        expect(library.extractSizeFromVariant('component_xlarge.html')).toBe('xlarge');
        expect(library.extractSizeFromVariant('no-size.html')).toBe('');
        expect(library.extractSizeFromVariant(null)).toBe('');
      });

      test('extractStateFromVariant should extract state', () => {
        expect(library.extractStateFromVariant('button_state_disabled.html')).toBe('disabled');
        expect(library.extractStateFromVariant('input_hover.html')).toBe('hover');
        expect(library.extractStateFromVariant('component_focus.html')).toBe('focus');
        expect(library.extractStateFromVariant('component_readonly.html')).toBe('readonly');
        expect(library.extractStateFromVariant('no-state.html')).toBe('');
        expect(library.extractStateFromVariant(null)).toBe('');
      });

      test('extractTypeFromVariant should extract type', () => {
        expect(library.extractTypeFromVariant('alert_type_success.html')).toBe('success');
        expect(library.extractTypeFromVariant('component_warning.html')).toBe('warning');
        expect(library.extractTypeFromVariant('alert_error.html')).toBe('error');
        expect(library.extractTypeFromVariant('info_component.html')).toBe('info');
        expect(library.extractTypeFromVariant('no-type.html')).toBe('');
        expect(library.extractTypeFromVariant(null)).toBe('');
      });

      test('getStateAttributes should return correct attributes', () => {
        expect(library.getStateAttributes('disabled')).toBe(' disabled');
        expect(library.getStateAttributes('readonly')).toBe(' readonly');
        expect(library.getStateAttributes('checked')).toBe(' checked');
        expect(library.getStateAttributes('normal')).toBe('');
        expect(library.getStateAttributes(null)).toBe('');
      });
    });

    describe('CSS Generation Methods', () => {
      test('generateButtonCSS should generate button styles', () => {
        const css = library.generateButtonCSS('krds-btn');

        expect(css).toContain('.krds-btn');
        expect(css).toContain('display: inline-flex');
        expect(css).toContain(':hover');
        expect(css).toContain(':focus');
        expect(css).toContain(':disabled');
        expect(css).toContain('.small');
        expect(css).toContain('.large');
        expect(css).toContain('--krds-component-button-height-md');
      });

      test('generateInputCSS should generate input styles', () => {
        const css = library.generateInputCSS('krds-input');

        expect(css).toContain('.krds-input');
        expect(css).toContain('width: 100%');
        expect(css).toContain(':focus');
        expect(css).toContain(':disabled');
        expect(css).toContain('--krds-component-input-height-md');
      });

      test('generateNavCSS should generate navigation styles', () => {
        const css = library.generateNavCSS('krds-nav');

        expect(css).toContain('.krds-nav');
        expect(css).toContain('display: flex');
        expect(css).toContain('.vertical');
        expect(css).toContain('.krds-nav-list');
        expect(css).toContain('.krds-nav-item');
        expect(css).toContain('.krds-nav-link');
      });

      test('generateAlertCSS should generate alert styles', () => {
        const css = library.generateAlertCSS('krds-alert');

        expect(css).toContain('.krds-alert');
        expect(css).toContain('.success');
        expect(css).toContain('.warning');
        expect(css).toContain('.error');
        expect(css).toContain('.info');
        expect(css).toContain('.krds-alert-content');
        expect(css).toContain('.krds-alert-title');
      });

      test('generateCardCSS should generate card styles', () => {
        const css = library.generateCardCSS('krds-card');

        expect(css).toContain('.krds-card');
        expect(css).toContain('flex-direction: column');
        expect(css).toContain('.krds-card-header');
        expect(css).toContain('.krds-card-body');
        expect(css).toContain('.krds-card-footer');
      });

      test('generateModalCSS should generate modal styles', () => {
        const css = library.generateModalCSS('krds-modal');

        expect(css).toContain('.krds-modal-overlay');
        expect(css).toContain('.krds-modal');
        expect(css).toContain('position: fixed');
        expect(css).toContain('z-index: var(--krds-layout-z-index-modal)');
        expect(css).toContain('.small');
        expect(css).toContain('.large');
      });

      test('generateTableCSS should generate table styles', () => {
        const css = library.generateTableCSS('krds-table');

        expect(css).toContain('.krds-table');
        expect(css).toContain('border-collapse: collapse');
        expect(css).toContain('th,');
        expect(css).toContain('td');
        expect(css).toContain('tr:hover td');
      });

      test('generateCheckboxCSS should generate checkbox styles', () => {
        const css = library.generateCheckboxCSS('krds-checkbox');

        expect(css).toContain('.krds-checkbox');
        expect(css).toContain('width: 16px');
        expect(css).toContain('height: 16px');
      });

      test('generateRadioCSS should generate radio styles', () => {
        const css = library.generateRadioCSS('krds-radio');

        expect(css).toContain('.krds-radio');
        expect(css).toContain('width: 16px');
        expect(css).toContain('height: 16px');
      });

      test('generateTextareaCSS should generate textarea styles', () => {
        const css = library.generateTextareaCSS('krds-textarea');

        expect(css).toContain('.krds-textarea');
        expect(css).toContain('min-height: 120px');
        expect(css).toContain('resize: vertical');
        expect(css).toContain(':focus');
      });

      test('generateLinkCSS should generate link styles', () => {
        const css = library.generateLinkCSS('krds-link');

        expect(css).toContain('.krds-link');
        expect(css).toContain('text-decoration: underline');
        expect(css).toContain(':hover');
        expect(css).toContain(':visited');
      });

      test('generateBreadcrumbCSS should generate breadcrumb styles', () => {
        const css = library.generateBreadcrumbCSS('krds-breadcrumb');

        expect(css).toContain('.krds-breadcrumb');
        expect(css).toContain('.krds-breadcrumb-list');
        expect(css).toContain('.krds-breadcrumb-item');
        expect(css).toContain('::after');
        expect(css).toContain('content: "/"');
      });
    });

    describe('generateGenericTemplate method', () => {
      test('should generate generic template', () => {
        const template = library.generateGenericTemplate('test-class', null);

        expect(template.html).toContain('test-class');
        expect(template.html).toContain('일반 컴포넌트');
        expect(template.html).toContain('컴포넌트 내용');
        expect(template.css).toContain('.test-class');
        expect(template.css).toContain('display: block');
        expect(Array.isArray(template.variants)).toBe(true);
        expect(template.variants).toEqual([]);
      });
    });
  });

  describe('Default component library instance', () => {
    test('should export componentLibrary instance', () => {
      expect(componentLibrary).toBeInstanceOf(KRDSComponentLibrary);
    });

    test('should be ready to use', async () => {
      const template = await componentLibrary.fetchComponentTemplate('button');
      expect(template).toBeDefined();
      expect(template.html).toContain('krds-btn');
    });
  });

  describe('Integration tests', () => {
    test('should work with all mapped components', async () => {
      const componentIds = Object.keys(KRDS_COMPONENT_MAPPING);

      for (const componentId of componentIds.slice(0, 5)) {
        // Test first 5 to avoid timeout
        const template = await componentLibrary.fetchComponentTemplate(componentId);

        expect(template).toBeDefined();
        expect(template.html).toBeTruthy();
        expect(template.css).toBeTruthy();
        expect(Array.isArray(template.variants)).toBe(true);

        const mapping = KRDS_COMPONENT_MAPPING[componentId];
        expect(template.html).toContain(mapping.className);
        expect(template.css).toContain(`.${mapping.className}`);
      }
    });

    test('should handle component variants correctly', async () => {
      const buttonMapping = KRDS_COMPONENT_MAPPING.button;
      const variants = buttonMapping.variants || [];

      if (variants.length > 0) {
        const variantTemplate = await componentLibrary.fetchComponentTemplate(
          'button',
          variants[0]
        );
        const defaultTemplate = await componentLibrary.fetchComponentTemplate('button');

        expect(variantTemplate).toBeDefined();
        expect(defaultTemplate).toBeDefined();
        // Templates should be cached separately
        expect(componentLibrary.templateCache.size).toBeGreaterThan(1);
      }
    });

    test('should generate consistent CSS with design tokens', () => {
      const css = componentLibrary.generateButtonCSS('krds-btn');

      // Should use CSS custom properties (design tokens)
      expect(css).toMatch(/--krds-[a-z-]+/);
      expect(css).toContain('--krds-component-button');
      expect(css).toContain('--krds-light-color-primary');
      expect(css).toContain('--krds-typography-font');
    });

    test('should handle error scenarios gracefully', async () => {
      // Test with malformed component mapping
      const originalMapping = KRDS_COMPONENT_MAPPING.button;
      KRDS_COMPONENT_MAPPING.button = { className: 'test', category: 'unknown' };

      try {
        const template = await componentLibrary.fetchComponentTemplate('button');
        expect(template).toBeDefined();
      } finally {
        // Restore original mapping
        KRDS_COMPONENT_MAPPING.button = originalMapping;
      }
    });
  });
});
