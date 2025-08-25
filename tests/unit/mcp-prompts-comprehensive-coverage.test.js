/**
 * Comprehensive tests for mcp-prompts.js
 * Tests McpPrompts class prompt generation and management
 * Target: 60%+ coverage for prompt generation logic (currently 37.38%)
 */

import { McpPrompts, mcpPrompts } from '../../helpers/mcp-prompts.js';

describe('MCP Prompts - Comprehensive Coverage Tests', () => {
  let prompts;

  beforeEach(() => {
    prompts = new McpPrompts();
  });

  describe('constructor and initialization', () => {
    test('should initialize with prompts map', () => {
      expect(prompts.prompts).toBeInstanceOf(Map);
      expect(prompts.prompts.size).toBeGreaterThan(0);
    });

    test('should initialize all required prompt categories', () => {
      expect(prompts.prompts.has('krds-design-audit')).toBe(true);
      expect(prompts.prompts.has('krds-compliance-check')).toBe(true);
      expect(prompts.prompts.has('krds-code-review')).toBe(true);
      expect(prompts.prompts.has('krds-css-optimization')).toBe(true);
      expect(prompts.prompts.has('krds-accessibility-audit')).toBe(true);
      expect(prompts.prompts.has('krds-color-contrast-check')).toBe(true);
      expect(prompts.prompts.has('krds-design-recommendation')).toBe(true);
      expect(prompts.prompts.has('krds-pattern-selection')).toBe(true);
      expect(prompts.prompts.has('krds-component-generator')).toBe(true);
      expect(prompts.prompts.has('krds-component-migration')).toBe(true);
      expect(prompts.prompts.has('krds-responsive-design')).toBe(true);
    });
  });

  describe('addDesignAnalysisPrompts', () => {
    test('should add design analysis prompts with correct structure', () => {
      const auditPrompt = prompts.prompts.get('krds-design-audit');

      expect(auditPrompt).toBeDefined();
      expect(auditPrompt.name).toBe('krds-design-audit');
      expect(auditPrompt.title).toBe('KRDS 디자인 시스템 감사');
      expect(auditPrompt.description).toContain('KRDS 가이드라인을 준수하는지 분석');
      expect(auditPrompt.arguments).toHaveLength(2);

      const designAreaArg = auditPrompt.arguments.find(arg => arg.name === 'design_area');
      expect(designAreaArg.required).toBe(false);

      const componentArg = auditPrompt.arguments.find(arg => arg.name === 'specific_component');
      expect(componentArg.required).toBe(false);
    });

    test('should add compliance check prompt', () => {
      const compliancePrompt = prompts.prompts.get('krds-compliance-check');

      expect(compliancePrompt).toBeDefined();
      expect(compliancePrompt.title).toBe('KRDS 준수성 점검');
      expect(compliancePrompt.arguments).toHaveLength(2);
    });
  });

  describe('addCodeReviewPrompts', () => {
    test('should add code review prompts', () => {
      const reviewPrompt = prompts.prompts.get('krds-code-review');

      expect(reviewPrompt).toBeDefined();
      expect(reviewPrompt.title).toBe('KRDS 기반 코드 리뷰');

      const codeArg = reviewPrompt.arguments.find(arg => arg.name === 'code_snippet');
      expect(codeArg.required).toBe(true);

      const focusArg = reviewPrompt.arguments.find(arg => arg.name === 'review_focus');
      expect(focusArg.required).toBe(false);
    });

    test('should add CSS optimization prompt', () => {
      const cssPrompt = prompts.prompts.get('krds-css-optimization');

      expect(cssPrompt).toBeDefined();
      expect(cssPrompt.title).toBe('KRDS CSS 최적화 제안');

      const cssCodeArg = cssPrompt.arguments.find(arg => arg.name === 'css_code');
      expect(cssCodeArg.required).toBe(true);
    });
  });

  describe('addAccessibilityPrompts', () => {
    test('should add accessibility audit prompt', () => {
      const auditPrompt = prompts.prompts.get('krds-accessibility-audit');

      expect(auditPrompt).toBeDefined();
      expect(auditPrompt.title).toBe('KRDS 접근성 감사');
      expect(auditPrompt.description).toContain('WCAG 2.1 AA');

      const htmlArg = auditPrompt.arguments.find(arg => arg.name === 'html_content');
      expect(htmlArg.required).toBe(true);
    });

    test('should add color contrast check prompt', () => {
      const contrastPrompt = prompts.prompts.get('krds-color-contrast-check');

      expect(contrastPrompt).toBeDefined();
      expect(contrastPrompt.title).toBe('KRDS 색상 대비 검사');

      const foregroundArg = contrastPrompt.arguments.find(arg => arg.name === 'foreground_color');
      const backgroundArg = contrastPrompt.arguments.find(arg => arg.name === 'background_color');

      expect(foregroundArg.required).toBe(true);
      expect(backgroundArg.required).toBe(true);
    });
  });

  describe('addDesignGuidePrompts', () => {
    test('should add design recommendation prompt', () => {
      const recPrompt = prompts.prompts.get('krds-design-recommendation');

      expect(recPrompt).toBeDefined();
      expect(recPrompt.title).toBe('KRDS 디자인 추천');

      const useCaseArg = recPrompt.arguments.find(arg => arg.name === 'use_case');
      expect(useCaseArg.required).toBe(true);
    });

    test('should add pattern selection prompt', () => {
      const patternPrompt = prompts.prompts.get('krds-pattern-selection');

      expect(patternPrompt).toBeDefined();
      expect(patternPrompt.title).toBe('KRDS 패턴 선택 가이드');

      const serviceTypeArg = patternPrompt.arguments.find(arg => arg.name === 'service_type');
      expect(serviceTypeArg.required).toBe(true);
    });
  });

  describe('addComponentDevelopmentPrompts', () => {
    test('should add component generator prompt', () => {
      const generatorPrompt = prompts.prompts.get('krds-component-generator');

      expect(generatorPrompt).toBeDefined();
      expect(generatorPrompt.title).toBe('KRDS 컴포넌트 생성기');

      const componentTypeArg = generatorPrompt.arguments.find(arg => arg.name === 'component_type');
      expect(componentTypeArg.required).toBe(true);
    });

    test('should add component migration prompt', () => {
      const migrationPrompt = prompts.prompts.get('krds-component-migration');

      expect(migrationPrompt).toBeDefined();
      expect(migrationPrompt.title).toBe('KRDS 컴포넌트 마이그레이션');

      const currentCodeArg = migrationPrompt.arguments.find(arg => arg.name === 'current_code');
      expect(currentCodeArg.required).toBe(true);
    });

    test('should add responsive design prompt', () => {
      const responsivePrompt = prompts.prompts.get('krds-responsive-design');

      expect(responsivePrompt).toBeDefined();
      expect(responsivePrompt.title).toBe('KRDS 반응형 디자인 가이드');
      expect(responsivePrompt.arguments).toHaveLength(2);
    });
  });

  describe('listPrompts', () => {
    test('should return paginated prompt list', async () => {
      const result = await prompts.listPrompts(null, 5);

      expect(result).toHaveProperty('prompts');
      expect(result.prompts).toHaveLength(5);
      expect(result).toHaveProperty('nextCursor');
    });

    test('should handle pagination cursor', async () => {
      // First, get a valid cursor by making a request with a small limit
      const firstResult = await prompts.listPrompts(null, 2);

      // If there's a nextCursor, use it for pagination
      if (firstResult.nextCursor) {
        const result = await prompts.listPrompts(firstResult.nextCursor, 3);
        expect(result.prompts).toBeDefined();
        expect(Array.isArray(result.prompts)).toBe(true);
      } else {
        // If no nextCursor, just verify pagination with null cursor works
        const result = await prompts.listPrompts(null, 3);
        expect(result.prompts).toHaveLength(3);
      }
    });

    test('should handle errors in listPrompts', async () => {
      // Test with invalid cursor that should cause error
      await expect(prompts.listPrompts('invalid-cursor-format', 10)).rejects.toThrow();
    });

    test('should not include nextCursor when no more items', async () => {
      // Test with a large limit to get all items at once
      const result = await prompts.listPrompts(null, 1000);

      expect(result).not.toHaveProperty('nextCursor');
    });
  });

  describe('getPrompt', () => {
    test('should return null for unknown prompt', async () => {
      const result = await prompts.getPrompt('unknown-prompt');
      expect(result).toBeNull();
    });

    test('should return prompt with messages for valid prompt', async () => {
      const result = await prompts.getPrompt('krds-design-audit', {
        design_area: 'color'
      });

      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('messages');
      expect(result.messages).toHaveLength(3); // system + user + assistant messages
      expect(result.messages[0].role).toBe('system');
      expect(result.messages[1].role).toBe('user');
      expect(result.messages[2].role).toBe('assistant');
    });

    test('should validate required arguments', async () => {
      await expect(prompts.getPrompt('krds-code-review', {})).rejects.toThrow(
        'Required argument missing: code_snippet'
      );
    });

    test('should handle prompts without required arguments', async () => {
      const result = await prompts.getPrompt('krds-design-audit', {});

      expect(result).toBeDefined();
      expect(result.messages).toHaveLength(3);
    });

    test('should handle errors in getPrompt', async () => {
      // Mock generatePromptMessages to throw error
      prompts.generatePromptMessages = () => Promise.reject(new Error('Generation error'));

      await expect(prompts.getPrompt('krds-design-audit', {})).rejects.toThrow('Generation error');
    });

    test('should include reference content when available', async () => {
      const result = await prompts.getPrompt('krds-design-audit', {
        design_area: 'components'
      });

      expect(result.messages.length).toBeGreaterThanOrEqual(2);
      // May include reference content as additional message
    });
  });

  describe('validatePromptArguments', () => {
    test('should pass validation for prompts with no required args', () => {
      const prompt = {
        arguments: [{ name: 'optional_arg', required: false }]
      };

      expect(() => {
        prompts.validatePromptArguments(prompt, {});
      }).not.toThrow();
    });

    test('should pass validation when required args are provided', () => {
      const prompt = {
        arguments: [
          { name: 'required_arg', required: true },
          { name: 'optional_arg', required: false }
        ]
      };

      expect(() => {
        prompts.validatePromptArguments(prompt, { required_arg: 'value' });
      }).not.toThrow();
    });

    test('should throw error for missing required args', () => {
      const prompt = {
        arguments: [{ name: 'required_arg', required: true }]
      };

      expect(() => {
        prompts.validatePromptArguments(prompt, {});
      }).toThrow('Required argument missing: required_arg');
    });

    test('should throw error for empty required args', () => {
      const prompt = {
        arguments: [{ name: 'required_arg', required: true }]
      };

      expect(() => {
        prompts.validatePromptArguments(prompt, { required_arg: '' });
      }).toThrow('Required argument missing: required_arg');
    });

    test('should handle prompts without arguments', () => {
      const prompt = {};

      expect(() => {
        prompts.validatePromptArguments(prompt, {});
      }).not.toThrow();
    });
  });

  describe('generatePromptMessages', () => {
    test('should generate system and user messages', async () => {
      const prompt = {
        name: 'test-prompt',
        description: 'Test prompt',
        arguments: []
      };

      const messages = await prompts.generatePromptMessages(prompt, {});

      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe('system');
      expect(messages[1].role).toBe('user');
    });

    test('should include reference content when available', async () => {
      const prompt = {
        name: 'krds-design-audit',
        description: 'Design audit',
        arguments: []
      };

      const messages = await prompts.generatePromptMessages(prompt, {});

      expect(messages.length).toBeGreaterThanOrEqual(2);
      // May include reference content as third message
      if (messages.length > 2) {
        expect(messages[2].role).toBe('assistant');
      }
    });
  });

  describe('generateSystemMessage', () => {
    test('should generate base context for unknown prompts', async () => {
      const prompt = { name: 'unknown-prompt', description: 'Test' };
      const message = await prompts.generateSystemMessage(prompt, {});

      expect(message).toContain('KRDS (Korea Government Design System)');
      expect(message).toContain('사용자 중심');
      expect(message).toContain('포용성');
    });

    test('should add specific context for accessibility audit', async () => {
      const prompt = { name: 'krds-accessibility-audit', description: 'Accessibility audit' };
      const message = await prompts.generateSystemMessage(prompt, {});

      expect(message).toContain('WCAG 2.1 AA');
      expect(message).toContain('한국어 웹 접근성');
    });

    test('should add specific context for design audit', async () => {
      const prompt = { name: 'krds-design-audit', description: 'Design audit' };
      const message = await prompts.generateSystemMessage(prompt, {});

      expect(message).toContain('Government Blue');
      expect(message).toContain('Display XL');
      expect(message).toContain('46개 컴포넌트');
    });

    test('should add specific context for component generator', async () => {
      const prompt = { name: 'krds-component-generator', description: 'Component generator' };
      const message = await prompts.generateSystemMessage(prompt, {});

      expect(message).toContain('HTML5 시맨틱 마크업');
      expect(message).toContain('CSS3 모던 기법');
      expect(message).toContain('반응형 디자인');
    });
  });

  describe('generateUserMessage', () => {
    test('should generate user message with title', async () => {
      const prompt = {
        name: 'test-prompt',
        title: 'Test Prompt',
        arguments: []
      };

      const message = await prompts.generateUserMessage(prompt, {});

      expect(message).toContain('Test Prompt을 수행해주세요');
    });

    test('should include provided arguments in message', async () => {
      const prompt = {
        name: 'test-prompt',
        title: 'Test Prompt',
        arguments: [{ name: 'test_arg', description: 'Test argument' }]
      };

      const message = await prompts.generateUserMessage(prompt, {
        test_arg: 'test value'
      });

      expect(message).toContain('제공된 정보:');
      expect(message).toContain('- Test argument: test value');
    });

    test('should add specific instructions for code review', async () => {
      const prompt = { name: 'krds-code-review', title: 'Code Review' };
      const message = await prompts.generateUserMessage(prompt, {});

      expect(message).toContain('KRDS 가이드라인 준수 여부');
      expect(message).toContain('접근성 개선점');
      expect(message).toContain('코드 품질 및 최적화');
    });

    test('should add specific instructions for accessibility audit', async () => {
      const prompt = { name: 'krds-accessibility-audit', title: 'Accessibility Audit' };
      const message = await prompts.generateUserMessage(prompt, {});

      expect(message).toContain('키보드 내비게이션');
      expect(message).toContain('스크린 리더 호환성');
      expect(message).toContain('ARIA 속성');
    });

    test('should add specific instructions for design recommendation', async () => {
      const prompt = { name: 'krds-design-recommendation', title: 'Design Recommendation' };
      const message = await prompts.generateUserMessage(prompt, {});

      expect(message).toContain('적합한 KRDS 컴포넌트');
      expect(message).toContain('권장 디자인 패턴');
    });

    test('should add specific instructions for component generator', async () => {
      const prompt = { name: 'krds-component-generator', title: 'Component Generator' };
      const message = await prompts.generateUserMessage(prompt, {});

      expect(message).toContain('HTML 구조');
      expect(message).toContain('CSS 스타일');
      expect(message).toContain('접근성 속성');
    });
  });

  describe('generateReferenceContent', () => {
    test('should return null for unknown prompts', async () => {
      const prompt = { name: 'unknown-prompt' };
      const content = await prompts.generateReferenceContent(prompt, {});

      expect(content).toBeNull();
    });

    test('should generate design audit references', async () => {
      const prompt = { name: 'krds-design-audit' };
      const content = await prompts.generateReferenceContent(prompt, {});

      expect(content).toContain('## KRDS 참고 자료');
      expect(content).toContain('### 디자인 원칙');
      expect(content).toContain('### 주요 색상');
    });

    test('should generate component references', async () => {
      const prompt = { name: 'krds-component-generator' };
      const content = await prompts.generateReferenceContent(prompt, {
        component_type: 'button'
      });

      expect(content).toContain('## KRDS 컴포넌트 참고');
      expect(content).toContain('### 관련 컴포넌트');
      expect(content).toContain('### 디자인 토큰');
    });

    test('should generate accessibility references', async () => {
      const prompt = { name: 'krds-accessibility-audit' };
      const content = await prompts.generateReferenceContent(prompt, {});

      expect(content).toContain('## 접근성 참고 사항');
      expect(content).toContain('### WCAG 2.1 AA 주요 기준');
      expect(content).toContain('### 한국 웹 접근성 가이드라인');
    });
  });

  describe('Helper methods', () => {
    test('should get color summary', () => {
      const summary = prompts.getColorSummary();

      expect(summary).toContain('Government Blue');
      expect(summary).toContain('Korean Red');
    });

    test('should get typography summary', () => {
      const summary = prompts.getTypographySummary();

      expect(summary).toContain('Display XL');
      expect(summary).toContain('64px');
    });

    test('should get component summary', () => {
      const summary = prompts.getComponentSummary();

      expect(summary).toContain('46개 컴포넌트');
      expect(summary).toContain('action');
    });

    test('should get design audit references with args', () => {
      const references = prompts.getDesignAuditReferences({});

      expect(references).toContain('사용자 중심');
      expect(references).toContain('Government Blue');
    });

    test('should get component references with matching components', () => {
      const references = prompts.getComponentReferences({ component_type: 'button' });

      expect(references).toContain('버튼 (Button)');
    });

    test('should get component references with no matches', () => {
      const references = prompts.getComponentReferences({ component_type: 'nonexistent' });

      expect(references).toContain('관련 컴포넌트 없음');
    });

    test('should get accessibility references', () => {
      const references = prompts.getAccessibilityReferences();

      expect(references).toContain('색상 대비: 4.5:1');
      expect(references).toContain('키보드 접근');
      expect(references).toContain('한국어 스크린 리더');
    });
  });

  describe('getPromptStats', () => {
    test('should return comprehensive statistics', () => {
      const stats = prompts.getPromptStats();

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('categories');
      expect(stats).toHaveProperty('argumentStats');
      expect(stats).toHaveProperty('averageArguments');

      expect(stats.total).toBeGreaterThan(0);
      expect(typeof stats.averageArguments).toBe('number');
    });

    test('should categorize prompts correctly', () => {
      const stats = prompts.getPromptStats();

      expect(stats.categories).toHaveProperty('design');
      expect(stats.categories).toHaveProperty('code');
      expect(stats.categories).toHaveProperty('accessibility');
    });

    test('should count arguments correctly', () => {
      const stats = prompts.getPromptStats();

      // Should have prompts with different argument counts
      expect(Object.keys(stats.argumentStats).length).toBeGreaterThan(1);
    });
  });

  describe('Global instance', () => {
    test('should export mcpPrompts instance', () => {
      expect(mcpPrompts).toBeInstanceOf(McpPrompts);
      expect(mcpPrompts.prompts.size).toBeGreaterThan(0);
    });
  });

  describe('Error handling and edge cases', () => {
    test('should handle malformed prompt definitions', () => {
      const malformedPrompt = {
        name: 'malformed'
        // Missing required properties
      };

      expect(() => {
        prompts.validatePromptArguments(malformedPrompt, {});
      }).not.toThrow();
    });

    test('should handle empty arguments gracefully', async () => {
      const prompt = {
        name: 'test',
        title: 'Test',
        arguments: []
      };

      const message = await prompts.generateUserMessage(prompt, {});
      expect(message).toBeDefined();
      expect(typeof message).toBe('string');
    });

    test('should handle null/undefined args in user message', async () => {
      const prompt = {
        name: 'test',
        title: 'Test',
        arguments: [{ name: 'test_arg', description: 'Test' }]
      };

      const message = await prompts.generateUserMessage(prompt, {
        test_arg: null,
        undefined_arg: undefined
      });

      expect(message).toContain('Test: null');
    });
  });
});
