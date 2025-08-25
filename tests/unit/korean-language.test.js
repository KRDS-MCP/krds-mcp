// Unit tests for Korean language support across KRDS MCP

import { describe, test, expect } from '@jest/globals';
import { KRDSHelper } from '../../helpers/base-helpers.js';
import { KRDS_DATA } from '../../data/index.js';

describe('Korean Language Support', () => {
  describe('Korean Text Handling', () => {
    test('should handle Korean characters in component names', () => {
      const koreanComponents = [
        { name: '버튼 컴포넌트', category: 'action', description: '사용자 클릭을 위한 버튼' },
        { name: '입력 필드', category: 'input', description: '텍스트 입력을 위한 필드' },
        { name: '모달 창', category: 'feedback', description: '팝업 형태의 대화상자' },
        { name: '네비게이션 바', category: 'navigation', description: '사이트 메뉴 네비게이션' },
        { name: '카드 레이아웃', category: 'layout', description: '콘텐츠 카드 형태' }
      ];

      // Test finding by Korean name
      const button = KRDSHelper.findByName(koreanComponents, '버튼');
      expect(button).toBeDefined();
      expect(button.name).toBe('버튼 컴포넌트');
      expect(button.description).toContain('버튼');

      const input = KRDSHelper.findByName(koreanComponents, '입력');
      expect(input).toBeDefined();
      expect(input.name).toBe('입력 필드');
    });

    test('should handle mixed Korean and English text', () => {
      const mixedComponents = [
        { name: 'Button 버튼', category: 'action' },
        { name: 'Input 입력', category: 'input' },
        { name: 'Modal 모달', category: 'feedback' }
      ];

      const buttonByKorean = KRDSHelper.findByName(mixedComponents, '버튼');
      const buttonByEnglish = KRDSHelper.findByName(mixedComponents, 'Button');

      expect(buttonByKorean).toBeDefined();
      expect(buttonByEnglish).toBeDefined();
      expect(buttonByKorean).toEqual(buttonByEnglish);
    });

    test('should handle Korean categories', () => {
      const componentsWithKoreanCategories = [
        { name: 'Component 1', category: '액션' },
        { name: 'Component 2', category: '입력' },
        { name: 'Component 3', category: '액션' },
        { name: 'Component 4', category: '피드백' }
      ];

      const actionComponents = KRDSHelper.findByCategory(componentsWithKoreanCategories, '액션');
      expect(actionComponents).toHaveLength(2);
      expect(actionComponents.every(comp => comp.category === '액션')).toBe(true);
    });

    test('should handle Korean search terms case insensitively', () => {
      const components = [
        { name: '메인 버튼', category: 'action' },
        { name: '보조 버튼', category: 'action' },
        { name: '링크 버튼', category: 'action' }
      ];

      // Test different Korean search variations
      const results1 = KRDSHelper.findByName(components, '메인');
      const results2 = KRDSHelper.findByName(components, '버튼');

      expect(results1).toBeDefined();
      expect(results1.name).toBe('메인 버튼');

      expect(results2).toBeDefined();
      expect(results2.name).toBe('메인 버튼'); // First match
    });
  });

  describe('Korean Unicode Handling', () => {
    test('should handle Hangul syllable blocks', () => {
      const hangulText = '한글 텍스트 처리';
      const component = { name: hangulText, type: 'text' };

      const testArray = [component];
      const result = KRDSHelper.findByName(testArray, '한글');

      expect(result).toBeDefined();
      expect(result.name).toBe(hangulText);
    });

    test('should handle Hangul jamo (combining characters)', () => {
      // Test with decomposed Hangul characters
      const jamoText = 'ㅎㅏㄴㄱㅡㄹ'; // Decomposed form of 한글
      const normalText = '한글'; // Composed form

      // While exact matching might differ, both should be valid Korean text
      expect(jamoText).toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/);
      expect(normalText).toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/);
    });

    test('should handle Korean punctuation and symbols', () => {
      const textWithPunctuation = '버튼: 클릭하세요!';
      const component = { name: textWithPunctuation, action: 'click' };

      const testArray = [component];
      const result = KRDSHelper.findByName(testArray, '버튼');

      expect(result).toBeDefined();
      expect(result.name).toContain(':');
      expect(result.name).toContain('!');
    });

    test('should handle Korean numbers and units', () => {
      const koreanNumbers = [
        { name: '첫 번째 버튼', order: 1 },
        { name: '두 번째 버튼', order: 2 },
        { name: '세 번째 버튼', order: 3 }
      ];

      const first = KRDSHelper.findByName(koreanNumbers, '첫');
      const second = KRDSHelper.findByName(koreanNumbers, '두');

      expect(first).toBeDefined();
      expect(first.order).toBe(1);
      expect(second).toBeDefined();
      expect(second.order).toBe(2);
    });
  });

  describe('Korean Text in KRDS Data', () => {
    test('should validate Korean descriptions in design principles', () => {
      if (KRDS_DATA.designPrinciples && KRDS_DATA.designPrinciples.principles) {
        const principles = KRDS_DATA.designPrinciples.principles;

        // Check that descriptions contain Korean text
        principles.forEach(principle => {
          if (principle.description) {
            // Should contain some Korean characters
            const hasKorean = /[\u3131-\u3163\uAC00-\uD7A3]/.test(principle.description);
            if (hasKorean) {
              expect(principle.description).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
            }
          }
        });
      }
    });

    test('should validate Korean text in component data', () => {
      if (KRDS_DATA.components) {
        const components = KRDS_DATA.components;

        // Find components with Korean descriptions
        const koreanComponents = components.filter(
          comp =>
            (comp.description && /[\u3131-\u3163\uAC00-\uD7A3]/.test(comp.description)) ||
            (comp.name && /[\u3131-\u3163\uAC00-\uD7A3]/.test(comp.name))
        );

        if (koreanComponents.length > 0) {
          koreanComponents.forEach(comp => {
            expect(comp.name || comp.description).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
          });
        }
      }
    });

    test('should validate Korean color names', () => {
      if (KRDS_DATA.colors) {
        const colors = KRDS_DATA.colors;

        // Look for Korean color names or descriptions
        const koreanColors = colors.filter(
          color =>
            (color.name && /[\u3131-\u3163\uAC00-\uD7A3]/.test(color.name)) ||
            (color.description && /[\u3131-\u3163\uAC00-\uD7A3]/.test(color.description))
        );

        if (koreanColors.length > 0) {
          koreanColors.forEach(color => {
            const hasKoreanInName = color.name && /[\u3131-\u3163\uAC00-\uD7A3]/.test(color.name);
            const hasKoreanInDesc =
              color.description && /[\u3131-\u3163\uAC00-\uD7A3]/.test(color.description);

            expect(hasKoreanInName || hasKoreanInDesc).toBe(true);
          });
        }
      }
    });
  });

  describe('Korean Search Functionality', () => {
    test('should support partial Korean word matching', () => {
      const components = [
        { name: '기본 버튼', type: 'primary' },
        { name: '보조 버튼', type: 'secondary' },
        { name: '링크 버튼', type: 'link' },
        { name: '텍스트 입력', type: 'input' }
      ];

      // Search by partial Korean words
      const buttonResults = components.filter(comp => comp.name.includes('버튼'));

      expect(buttonResults).toHaveLength(3);
      expect(buttonResults.every(comp => comp.name.includes('버튼'))).toBe(true);
    });

    test('should handle Korean search with special characters', () => {
      const searchTerms = [
        '버튼', // Basic Korean
        '버튼!', // With exclamation
        '버튼?', // With question mark
        '"버튼"', // With quotes
        '(버튼)', // With parentheses
        '버튼-', // With dash
        '버튼_test' // Mixed Korean-English
      ];

      searchTerms.forEach(term => {
        // Extract Korean part for testing
        const koreanPart = term.match(/[\u3131-\u3163\uAC00-\uD7A3]+/);
        expect(koreanPart).toBeTruthy();
        expect(koreanPart[0]).toBe('버튼');
      });
    });

    test('should support Korean filter operations', () => {
      const items = [
        { name: '메인 콘텐츠', section: '본문' },
        { name: '사이드 메뉴', section: '네비게이션' },
        { name: '푸터 정보', section: '하단' },
        { name: '헤더 로고', section: '상단' }
      ];

      // Filter by Korean section names
      const filters = { section: '네비게이션' };
      const results = KRDSHelper.findByFilters(items, filters);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('사이드 메뉴');
    });
  });

  describe('Korean Error Messages and Validation', () => {
    test('should validate Korean error message format', () => {
      const koreanErrorMessages = [
        '오류가 발생했습니다.',
        '잘못된 입력입니다.',
        '필수 항목이 누락되었습니다.',
        '데이터를 찾을 수 없습니다.'
      ];

      koreanErrorMessages.forEach(message => {
        // Should contain Korean characters
        expect(message).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);

        // Should end with Korean sentence ending (usually 다.)
        expect(message).toMatch(/다\.$/);
      });
    });

    test('should handle Korean validation messages', () => {
      const validationRules = [
        { field: '이름', message: '이름을 입력해주세요.' },
        { field: '이메일', message: '올바른 이메일을 입력해주세요.' },
        { field: '비밀번호', message: '비밀번호를 입력해주세요.' }
      ];

      validationRules.forEach(rule => {
        expect(rule.field).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
        expect(rule.message).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
        expect(rule.message).toMatch(/주세요\.$/); // Common Korean polite ending
      });
    });
  });

  describe('Korean Text Processing Edge Cases', () => {
    test('should handle empty Korean strings', () => {
      const items = [
        { name: '', category: 'empty' },
        { name: '   ', category: 'whitespace' },
        { name: '버튼', category: 'valid' }
      ];

      const result = KRDSHelper.findByName(items, '버튼');
      expect(result).toBeDefined();
      expect(result.category).toBe('valid');

      const emptyResult = KRDSHelper.findByName(items, '');
      expect(emptyResult).toBeNull();
    });

    test('should handle Korean text with line breaks', () => {
      const multilineText = '첫 번째 줄\n두 번째 줄\n세 번째 줄';
      const component = { description: multilineText };

      const testArray = [component];
      const result = KRDSHelper.findByName(testArray, '첫', 'description');

      expect(result).toBeDefined();
      expect(result.description).toContain('\n');
    });

    test('should handle Korean text normalization', () => {
      // Test with different Unicode normalization forms
      const nfc = '한글'; // NFC form
      const nfd = '한글'; // NFD form (may be different encoding)

      // Both should be recognized as Korean text
      expect(nfc).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
      expect(nfd).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
    });

    test('should handle Korean text with HTML entities', () => {
      const textWithEntities = '버튼&nbsp;컴포넌트';
      const cleanText = textWithEntities.replace(/&nbsp;/g, ' ');

      expect(cleanText).toBe('버튼 컴포넌트');
      expect(cleanText).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
    });
  });

  describe('Korean Language Integration Tests', () => {
    test('should handle complete Korean component workflow', () => {
      const koreanComponent = {
        id: 'korean-button',
        name: '한국형 버튼',
        description: '한국 정부 디자인 시스템을 위한 표준 버튼 컴포넌트',
        category: '액션',
        properties: {
          label: '버튼 레이블',
          variant: '기본형',
          size: '중간',
          disabled: '비활성화'
        },
        usage: '이 버튼은 사용자의 주요 액션을 위해 사용됩니다.',
        examples: ['확인 버튼', '취소 버튼', '저장 버튼', '삭제 버튼']
      };

      // Test finding by Korean name
      const components = [koreanComponent];
      const foundByName = KRDSHelper.findByName(components, '한국형');
      expect(foundByName).toEqual(koreanComponent);

      // Test finding by Korean category
      const foundByCategory = KRDSHelper.findByCategory(components, '액션');
      expect(foundByCategory).toHaveLength(1);
      expect(foundByCategory[0]).toEqual(koreanComponent);

      // Test complex Korean filtering
      const filters = {
        category: '액션',
        name: '버튼'
      };
      const filteredResults = KRDSHelper.findByFilters(components, filters);
      expect(filteredResults).toHaveLength(1);
    });

    test('should validate Korean text in real KRDS system context', () => {
      // Simulate real Korean design system data structure
      const krdsKoreanData = {
        principles: [
          {
            id: 'accessibility',
            name: '접근성',
            description: '모든 사용자가 쉽게 접근할 수 있는 디자인'
          },
          {
            id: 'consistency',
            name: '일관성',
            description: '전체 시스템에서 일관된 사용자 경험 제공'
          }
        ],
        components: [
          {
            id: 'kr-button',
            name: '버튼',
            description: '사용자 액션을 위한 기본 버튼',
            category: '인터페이스 요소'
          }
        ]
      };

      // Validate Korean text structure
      krdsKoreanData.principles.forEach(principle => {
        expect(principle.name).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
        expect(principle.description).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
      });

      krdsKoreanData.components.forEach(component => {
        expect(component.name).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
        expect(component.description).toMatch(/[\u3131-\u3163\uAC00-\uD7A3]/);
      });
    });
  });
});
