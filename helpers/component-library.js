/**
 * KRDS 컴포넌트 라이브러리 통합 모듈
 * KRDS-uiux 저장소의 실제 구현체와 연동하여 컴포넌트 라이브러리 기능 제공
 */

import { KRDS_DATA } from '../data/index.js';

/**
 * KRDS-uiux 저장소의 컴포넌트 매핑
 * 실제 HTML 파일과 krds-mcp 컴포넌트 ID 매핑
 */
export const KRDS_COMPONENT_MAPPING = {
  // Action Components
  button: {
    htmlFile: 'button.html',
    variants: ['button_size.html', 'button_state.html'],
    className: 'krds-btn',
    category: 'action'
  },
  link: {
    htmlFile: 'link.html',
    variants: ['link_state.html'],
    className: 'krds-link',
    category: 'action'
  },

  // Input Components
  'text-input': {
    htmlFile: 'text_input.html',
    variants: ['text_input_state.html', 'text_input_size.html'],
    className: 'krds-input',
    category: 'input',
    structure: 'fieldset'
  },
  checkbox: {
    htmlFile: 'checkbox.html',
    variants: ['checkbox_state.html'],
    className: 'krds-checkbox',
    category: 'input'
  },
  radio: {
    htmlFile: 'radio.html',
    variants: ['radio_state.html'],
    className: 'krds-radio',
    category: 'input'
  },
  select: {
    htmlFile: 'select.html',
    variants: ['select_state.html'],
    className: 'krds-select',
    category: 'input'
  },
  textarea: {
    htmlFile: 'textarea.html',
    variants: ['textarea_state.html'],
    className: 'krds-textarea',
    category: 'input'
  },
  'toggle-switch': {
    htmlFile: 'toggle_switch.html',
    variants: ['toggle_switch_size.html'],
    className: 'krds-toggle',
    category: 'input'
  },

  // Navigation Components
  navigation: {
    htmlFile: 'nav.html',
    variants: ['nav_vertical.html', 'nav_horizontal.html'],
    className: 'krds-nav',
    category: 'navigation'
  },
  breadcrumb: {
    htmlFile: 'breadcrumb.html',
    className: 'krds-breadcrumb',
    category: 'navigation'
  },
  pagination: {
    htmlFile: 'pagination.html',
    className: 'krds-pagination',
    category: 'navigation'
  },
  tab: {
    htmlFile: 'tab.html',
    variants: ['tab_vertical.html'],
    className: 'krds-tab',
    category: 'navigation'
  },

  // Feedback Components
  alert: {
    htmlFile: 'alert.html',
    variants: ['alert_type.html'],
    className: 'krds-alert',
    category: 'feedback'
  },
  toast: {
    htmlFile: 'toast.html',
    className: 'krds-toast',
    category: 'feedback'
  },
  loading: {
    htmlFile: 'loading.html',
    variants: ['loading_spinner.html'],
    className: 'krds-loading',
    category: 'feedback'
  },

  // Layout Components
  card: {
    htmlFile: 'card.html',
    variants: ['card_type.html'],
    className: 'krds-card',
    category: 'layout-expression'
  },
  modal: {
    htmlFile: 'modal.html',
    variants: ['modal_size.html'],
    className: 'krds-modal',
    category: 'layout-expression'
  },
  accordion: {
    htmlFile: 'accordion.html',
    className: 'krds-accordion',
    category: 'layout-expression'
  },
  dropdown: {
    htmlFile: 'dropdown.html',
    className: 'krds-dropdown',
    category: 'layout-expression'
  },

  // Content Components
  table: {
    htmlFile: 'table.html',
    variants: ['table_type.html'],
    className: 'krds-table',
    category: 'content'
  },
  list: {
    htmlFile: 'list.html',
    variants: ['list_type.html'],
    className: 'krds-list',
    category: 'content'
  }
};

/**
 * 컴포넌트 라이브러리 클래스
 */
export class KRDSComponentLibrary {
  constructor() {
    this.baseUrl = 'https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/main/html/code/';
    this.componentCache = new Map();
    this.templateCache = new Map();
  }

  /**
   * 컴포넌트 HTML 템플릿 가져오기
   */
  async fetchComponentTemplate(componentId, variant = null) {
    const mapping = KRDS_COMPONENT_MAPPING[componentId];
    if (!mapping) {
      throw new Error(`Unknown component: ${componentId}`);
    }

    const fileName = variant && mapping.variants?.includes(variant) ? variant : mapping.htmlFile;

    const cacheKey = `${componentId}-${fileName}`;

    if (this.templateCache.has(cacheKey)) {
      return this.templateCache.get(cacheKey);
    }

    try {
      // 실제로는 WebFetch를 사용하거나 로컬 파일을 읽어야 하지만,
      // 현재는 알려진 구조를 기반으로 템플릿 생성
      const template = this.generateTemplateFromMapping(mapping, variant);
      this.templateCache.set(cacheKey, template);
      return template;
    } catch (error) {
      // 실제 파일을 가져올 수 없는 경우 기본 템플릿 사용
      return this.generateFallbackTemplate(componentId, mapping, variant);
    }
  }

  /**
   * 매핑 정보를 기반으로 템플릿 생성
   */
  generateTemplateFromMapping(mapping, variant) {
    const { className, category, structure } = mapping;

    switch (category) {
      case 'action':
        return this.generateActionTemplate(className, variant);
      case 'input':
        return this.generateInputTemplate(className, structure, variant);
      case 'navigation':
        return this.generateNavigationTemplate(className, variant);
      case 'feedback':
        return this.generateFeedbackTemplate(className, variant);
      case 'layout-expression':
        return this.generateLayoutTemplate(className, variant);
      case 'content':
        return this.generateContentTemplate(className, variant);
      default:
        return this.generateGenericTemplate(className, variant);
    }
  }

  /**
   * Action 컴포넌트 템플릿 생성
   */
  generateActionTemplate(className, variant) {
    if (className === 'krds-btn') {
      const sizeClass = variant?.includes('size') ? this.extractSizeFromVariant(variant) : '';
      const stateClass = variant?.includes('state') ? this.extractStateFromVariant(variant) : '';

      return {
        html: `<button type="button" class="${className}${sizeClass ? ` ${sizeClass}` : ''}${stateClass ? ` ${stateClass}` : ''}">버튼</button>`,
        css: this.generateButtonCSS(className),
        variants: ['small', 'medium', 'large', 'xlarge', 'disabled', 'hover', 'focus']
      };
    }

    if (className === 'krds-link') {
      return {
        html: `<a href="#" class="${className}">링크</a>`,
        css: this.generateLinkCSS(className),
        variants: ['visited', 'hover', 'focus', 'active']
      };
    }

    return { html: `<div class="${className}">액션 컴포넌트</div>`, css: '', variants: [] };
  }

  /**
   * Input 컴포넌트 템플릿 생성
   */
  generateInputTemplate(className, structure, variant) {
    if (structure === 'fieldset') {
      const inputType = className.includes('textarea') ? 'textarea' : 'input';
      const stateAttrs = this.getStateAttributes(variant);

      if (inputType === 'textarea') {
        return {
          html: `<div class="fieldset">
  <div class="form-group">
    <div class="form-tit">
      <label for="textarea-input">텍스트 영역</label>
    </div>
    <div class="form-conts">
      <textarea id="textarea-input" class="${className}" placeholder="내용을 입력하세요"${stateAttrs}></textarea>
    </div>
    <p class="form-hint">텍스트 영역 도움말</p>
  </div>
</div>`,
          css: this.generateTextareaCSS(className),
          variants: ['readonly', 'disabled', 'focus', 'error']
        };
      }

      return {
        html: `<div class="fieldset">
  <div class="form-group">
    <div class="form-tit">
      <label for="text-input">텍스트 입력</label>
    </div>
    <div class="form-conts">
      <input type="text" id="text-input" class="${className}" placeholder="텍스트 입력"${stateAttrs}>
    </div>
    <p class="form-hint">입력 도움말</p>
  </div>
</div>`,
        css: this.generateInputCSS(className),
        variants: ['readonly', 'disabled', 'focus', 'error', 'small', 'large']
      };
    }

    // Checkbox, Radio 등
    if (className === 'krds-checkbox') {
      const stateAttrs = this.getStateAttributes(variant);
      return {
        html: `<div class="form-check">
  <input type="checkbox" id="checkbox-1" class="${className}"${stateAttrs}>
  <label for="checkbox-1">체크박스 옵션</label>
</div>`,
        css: this.generateCheckboxCSS(className),
        variants: ['checked', 'disabled', 'indeterminate']
      };
    }

    if (className === 'krds-radio') {
      const stateAttrs = this.getStateAttributes(variant);
      return {
        html: `<div class="form-check">
  <input type="radio" id="radio-1" name="radio-group" class="${className}"${stateAttrs}>
  <label for="radio-1">라디오 옵션</label>
</div>`,
        css: this.generateRadioCSS(className),
        variants: ['checked', 'disabled']
      };
    }

    return { html: `<div class="${className}">입력 컴포넌트</div>`, css: '', variants: [] };
  }

  /**
   * Navigation 컴포넌트 템플릿 생성
   */
  generateNavigationTemplate(className, variant) {
    if (className === 'krds-nav') {
      const direction = variant?.includes('vertical') ? 'vertical' : 'horizontal';

      return {
        html: `<nav class="${className} ${direction}" aria-label="주 네비게이션">
  <ul class="krds-nav-list">
    <li class="krds-nav-item">
      <a href="#" class="krds-nav-link">메뉴 1</a>
    </li>
    <li class="krds-nav-item">
      <a href="#" class="krds-nav-link active">메뉴 2</a>
    </li>
    <li class="krds-nav-item">
      <a href="#" class="krds-nav-link">메뉴 3</a>
    </li>
  </ul>
</nav>`,
        css: this.generateNavCSS(className),
        variants: ['horizontal', 'vertical', 'active', 'disabled']
      };
    }

    if (className === 'krds-breadcrumb') {
      return {
        html: `<nav class="${className}" aria-label="breadcrumb">
  <ol class="krds-breadcrumb-list">
    <li class="krds-breadcrumb-item">
      <a href="#" class="krds-breadcrumb-link">홈</a>
    </li>
    <li class="krds-breadcrumb-item">
      <a href="#" class="krds-breadcrumb-link">카테고리</a>
    </li>
    <li class="krds-breadcrumb-item active" aria-current="page">
      현재 페이지
    </li>
  </ol>
</nav>`,
        css: this.generateBreadcrumbCSS(className),
        variants: ['active', 'hover']
      };
    }

    return { html: `<div class="${className}">네비게이션 컴포넌트</div>`, css: '', variants: [] };
  }

  /**
   * Feedback 컴포넌트 템플릿 생성
   */
  generateFeedbackTemplate(className, variant) {
    if (className === 'krds-alert') {
      const alertType = this.extractTypeFromVariant(variant) || 'info';

      return {
        html: `<div class="${className} ${alertType}" role="alert">
  <div class="krds-alert-content">
    <strong class="krds-alert-title">알림</strong>
    <p class="krds-alert-message">이것은 ${alertType} 타입의 알림 메시지입니다.</p>
  </div>
  <button type="button" class="krds-alert-close" aria-label="알림 닫기">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`,
        css: this.generateAlertCSS(className),
        variants: ['success', 'warning', 'error', 'info']
      };
    }

    return { html: `<div class="${className}">피드백 컴포넌트</div>`, css: '', variants: [] };
  }

  /**
   * Layout 컴포넌트 템플릿 생성
   */
  generateLayoutTemplate(className, variant) {
    if (className === 'krds-card') {
      return {
        html: `<div class="${className}">
  <div class="krds-card-header">
    <h3 class="krds-card-title">카드 제목</h3>
  </div>
  <div class="krds-card-body">
    <p class="krds-card-text">카드 내용이 여기에 표시됩니다.</p>
  </div>
  <div class="krds-card-footer">
    <button type="button" class="krds-btn">액션</button>
  </div>
</div>`,
        css: this.generateCardCSS(className),
        variants: ['elevated', 'outlined', 'filled']
      };
    }

    if (className === 'krds-modal') {
      const size = this.extractSizeFromVariant(variant) || 'medium';

      return {
        html: `<div class="krds-modal-overlay">
  <div class="${className} ${size}" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <div class="krds-modal-header">
      <h2 id="modal-title" class="krds-modal-title">모달 제목</h2>
      <button type="button" class="krds-modal-close" aria-label="모달 닫기">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="krds-modal-body">
      <p>모달 내용이 여기에 표시됩니다.</p>
    </div>
    <div class="krds-modal-footer">
      <button type="button" class="krds-btn">확인</button>
      <button type="button" class="krds-btn secondary">취소</button>
    </div>
  </div>
</div>`,
        css: this.generateModalCSS(className),
        variants: ['small', 'medium', 'large', 'fullscreen']
      };
    }

    return { html: `<div class="${className}">레이아웃 컴포넌트</div>`, css: '', variants: [] };
  }

  /**
   * Content 컴포넌트 템플릿 생성
   */
  generateContentTemplate(className, variant) {
    if (className === 'krds-table') {
      return {
        html: `<table class="${className}">
  <thead class="krds-table-header">
    <tr>
      <th scope="col">이름</th>
      <th scope="col">나이</th>
      <th scope="col">직업</th>
      <th scope="col">액션</th>
    </tr>
  </thead>
  <tbody class="krds-table-body">
    <tr>
      <td>홍길동</td>
      <td>30</td>
      <td>개발자</td>
      <td>
        <button type="button" class="krds-btn small">편집</button>
      </td>
    </tr>
    <tr>
      <td>김영희</td>
      <td>25</td>
      <td>디자이너</td>
      <td>
        <button type="button" class="krds-btn small">편집</button>
      </td>
    </tr>
  </tbody>
</table>`,
        css: this.generateTableCSS(className),
        variants: ['striped', 'bordered', 'hover', 'compact']
      };
    }

    return { html: `<div class="${className}">콘텐츠 컴포넌트</div>`, css: '', variants: [] };
  }

  /**
   * 기본 템플릿 생성 (fallback)
   */
  generateFallbackTemplate(componentId, mapping, variant) {
    return {
      html: `<div class="${mapping.className}">
  <!-- ${componentId} 컴포넌트 -->
  <span>기본 ${mapping.category} 컴포넌트</span>
</div>`,
      css: `/* ${mapping.className} 기본 스타일 */
.${mapping.className} {
  display: block;
  padding: var(--krds-spacing-4);
  border: 1px solid var(--krds-light-color-neutral-border-default);
  border-radius: var(--krds-border-radius-base);
}`,
      variants: []
    };
  }

  /**
   * 유틸리티 메서드들
   */
  extractSizeFromVariant(variant) {
    if (!variant) {
      return '';
    }
    const sizeMatch = variant.match(/(xsmall|small|medium|large|xlarge)/);
    return sizeMatch ? sizeMatch[1] : '';
  }

  extractStateFromVariant(variant) {
    if (!variant) {
      return '';
    }
    const stateMatch = variant.match(/(disabled|hover|focus|active|readonly|error)/);
    return stateMatch ? stateMatch[1] : '';
  }

  extractTypeFromVariant(variant) {
    if (!variant) {
      return '';
    }

    // Try multiple patterns to extract type information
    const patterns = [
      // Pattern: component_type_success.html
      /^(alert|button|card|modal|table|list)_type_(success|warning|error|info)\.html$/,
      // Pattern: component_warning.html
      /^[^_]+_(success|warning|error|info)\.html$/,
      // Pattern: alert_error.html (without _type_)
      /^(alert|button|card|modal|table|list)_(success|warning|error|info)\.html$/,
      // Pattern: info_component.html
      /^(success|warning|error|info)_[^_]+\.html$/
    ];

    for (const pattern of patterns) {
      const match = variant.match(pattern);
      if (match) {
        // Return the captured type group (could be match[1] or match[2] depending on pattern)
        const typeGroups = match
          .slice(1)
          .filter(group => ['success', 'warning', 'error', 'info'].includes(group));
        if (typeGroups.length > 0) {
          return typeGroups[0];
        }
      }
    }

    return '';
  }

  getStateAttributes(variant) {
    if (!variant) {
      return '';
    }
    if (variant.includes('disabled')) {
      return ' disabled';
    }
    if (variant.includes('readonly')) {
      return ' readonly';
    }
    if (variant.includes('checked')) {
      return ' checked';
    }
    return '';
  }

  /**
   * CSS 생성 메서드들
   */
  generateButtonCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--krds-component-button-height-md);
  padding: 0 var(--krds-component-button-padding-x-md);
  border: var(--krds-component-button-border-width) solid var(--krds-light-color-primary-border-default);
  border-radius: var(--krds-component-button-border-radius);
  background-color: var(--krds-light-color-primary-background-default);
  color: var(--krds-light-color-primary-text-default);
  font-size: var(--krds-typography-font-size-base);
  font-weight: var(--krds-typography-font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: var(--krds-motion-transition-colors);
}

.${className}:hover {
  background-color: var(--krds-light-color-primary-background-hover);
  border-color: var(--krds-light-color-primary-border-hover);
}

.${className}:focus {
  outline: none;
  box-shadow: var(--krds-shadow-focus-primary);
}

.${className}:disabled {
  background-color: var(--krds-light-color-primary-background-disabled);
  color: var(--krds-light-color-primary-text-disabled);
  cursor: not-allowed;
}

.${className}.small {
  height: var(--krds-component-button-height-sm);
  padding: 0 var(--krds-component-button-padding-x-sm);
  font-size: var(--krds-typography-font-size-sm);
}

.${className}.large {
  height: var(--krds-component-button-height-lg);
  padding: 0 var(--krds-component-button-padding-x-lg);
  font-size: var(--krds-typography-font-size-lg);
}`;
  }

  generateInputCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  width: 100%;
  height: var(--krds-component-input-height-md);
  padding: 0 var(--krds-component-input-padding-x);
  border: var(--krds-component-input-border-width) solid var(--krds-light-color-neutral-border-default);
  border-radius: var(--krds-component-input-border-radius);
  background-color: var(--krds-light-color-neutral-background-default);
  color: var(--krds-light-color-neutral-text-primary);
  font-size: var(--krds-typography-font-size-base);
  transition: var(--krds-motion-transition-colors);
}

.${className}:focus {
  outline: none;
  border-color: var(--krds-light-color-primary-border-focus);
  box-shadow: var(--krds-shadow-focus-primary);
}

.${className}:disabled {
  background-color: var(--krds-light-color-neutral-background-tertiary);
  color: var(--krds-light-color-neutral-text-disabled);
  cursor: not-allowed;
}`;
  }

  generateNavCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  display: flex;
}

.${className}.vertical {
  flex-direction: column;
}

.krds-nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.${className}.vertical .krds-nav-list {
  flex-direction: column;
}

.krds-nav-item {
  margin: 0;
}

.krds-nav-link {
  display: block;
  padding: var(--krds-spacing-3) var(--krds-spacing-4);
  color: var(--krds-light-color-interactive-text-default);
  text-decoration: none;
  transition: var(--krds-motion-transition-colors);
}

.krds-nav-link:hover {
  background-color: var(--krds-light-color-interactive-background-hover);
  color: var(--krds-light-color-interactive-text-hover);
}

.krds-nav-link.active {
  background-color: var(--krds-light-color-interactive-background-selected);
  font-weight: var(--krds-typography-font-weight-semibold);
}`;
  }

  generateAlertCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  display: flex;
  align-items: flex-start;
  padding: var(--krds-spacing-4);
  border: 1px solid;
  border-radius: var(--krds-border-radius-base);
  background-color: var(--krds-light-color-neutral-background-secondary);
}

.${className}.success {
  border-color: var(--krds-light-color-success-border-default);
  background-color: var(--krds-light-color-success-background-light);
  color: var(--krds-light-color-success-text-dark);
}

.${className}.warning {
  border-color: var(--krds-light-color-warning-border-default);
  background-color: var(--krds-light-color-warning-background-light);
  color: var(--krds-light-color-warning-text-dark);
}

.${className}.error {
  border-color: var(--krds-light-color-error-border-default);
  background-color: var(--krds-light-color-error-background-light);
  color: var(--krds-light-color-error-text-dark);
}

.${className}.info {
  border-color: var(--krds-light-color-info-border-default);
  background-color: var(--krds-light-color-info-background-light);
  color: var(--krds-light-color-info-text-dark);
}

.krds-alert-content {
  flex: 1;
}

.krds-alert-title {
  display: block;
  margin-bottom: var(--krds-spacing-2);
  font-weight: var(--krds-typography-font-weight-semibold);
}

.krds-alert-message {
  margin: 0;
}

.krds-alert-close {
  margin-left: var(--krds-spacing-3);
  padding: 0;
  border: none;
  background: transparent;
  font-size: var(--krds-typography-font-size-lg);
  cursor: pointer;
}`;
  }

  generateCardCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  display: flex;
  flex-direction: column;
  border: var(--krds-component-card-border-width) solid var(--krds-light-color-neutral-border-default);
  border-radius: var(--krds-component-card-border-radius);
  background-color: var(--krds-light-color-neutral-background-default);
  box-shadow: var(--krds-shadow-sm);
}

.krds-card-header {
  padding: var(--krds-component-card-padding);
  border-bottom: 1px solid var(--krds-light-color-neutral-border-default);
}

.krds-card-title {
  margin: 0;
  font-size: var(--krds-typography-font-size-lg);
  font-weight: var(--krds-typography-font-weight-semibold);
}

.krds-card-body {
  flex: 1;
  padding: var(--krds-component-card-padding);
}

.krds-card-text {
  margin: 0;
}

.krds-card-footer {
  padding: var(--krds-component-card-padding);
  border-top: 1px solid var(--krds-light-color-neutral-border-default);
}`;
  }

  generateModalCSS(className) {
    return `/* ${className} 스타일 */
.krds-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--krds-light-color-neutral-background-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--krds-layout-z-index-modal);
}

.${className} {
  width: var(--krds-component-modal-width-md);
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--krds-component-modal-border-radius);
  background-color: var(--krds-light-color-neutral-background-default);
  box-shadow: var(--krds-shadow-2xl);
  display: flex;
  flex-direction: column;
}

.${className}.small {
  width: var(--krds-component-modal-width-sm);
}

.${className}.large {
  width: var(--krds-component-modal-width-lg);
}

.krds-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--krds-spacing-6);
  border-bottom: 1px solid var(--krds-light-color-neutral-border-default);
}

.krds-modal-title {
  margin: 0;
  font-size: var(--krds-typography-font-size-xl);
  font-weight: var(--krds-typography-font-weight-semibold);
}

.krds-modal-close {
  padding: var(--krds-spacing-2);
  border: none;
  background: transparent;
  font-size: var(--krds-typography-font-size-xl);
  cursor: pointer;
}

.krds-modal-body {
  flex: 1;
  padding: var(--krds-spacing-6);
  overflow-y: auto;
}

.krds-modal-footer {
  display: flex;
  gap: var(--krds-spacing-3);
  justify-content: flex-end;
  padding: var(--krds-spacing-6);
  border-top: 1px solid var(--krds-light-color-neutral-border-default);
}`;
  }

  generateTableCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--krds-light-color-neutral-border-default);
}

.${className} th,
.${className} td {
  padding: var(--krds-component-table-cell-padding-y) var(--krds-component-table-cell-padding-x);
  text-align: left;
  border-bottom: 1px solid var(--krds-light-color-neutral-border-default);
}

.${className} th {
  background-color: var(--krds-light-color-neutral-background-secondary);
  font-weight: var(--krds-typography-font-weight-semibold);
  color: var(--krds-light-color-neutral-text-primary);
}

.${className} tr:hover td {
  background-color: var(--krds-light-color-interactive-background-hover);
}`;
  }

  generateCheckboxCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  width: 16px;
  height: 16px;
  margin-right: var(--krds-spacing-2);
  cursor: pointer;
}`;
  }

  generateRadioCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  width: 16px;
  height: 16px;
  margin-right: var(--krds-spacing-2);
  cursor: pointer;
}`;
  }

  generateTextareaCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  width: 100%;
  min-height: 120px;
  padding: var(--krds-component-input-padding-x);
  border: var(--krds-component-input-border-width) solid var(--krds-light-color-neutral-border-default);
  border-radius: var(--krds-component-input-border-radius);
  background-color: var(--krds-light-color-neutral-background-default);
  color: var(--krds-light-color-neutral-text-primary);
  font-size: var(--krds-typography-font-size-base);
  font-family: var(--krds-typography-font-family-primary);
  resize: vertical;
  transition: var(--krds-motion-transition-colors);
}

.${className}:focus {
  outline: none;
  border-color: var(--krds-light-color-primary-border-focus);
  box-shadow: var(--krds-shadow-focus-primary);
}`;
  }

  generateLinkCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  color: var(--krds-light-color-interactive-text-default);
  text-decoration: underline;
  cursor: pointer;
  transition: var(--krds-motion-transition-colors);
}

.${className}:hover {
  color: var(--krds-light-color-interactive-text-hover);
}

.${className}:visited {
  color: var(--krds-light-color-interactive-text-visited);
}`;
  }

  generateBreadcrumbCSS(className) {
    return `/* ${className} 스타일 */
.${className} {
  display: block;
}

.krds-breadcrumb-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.krds-breadcrumb-item {
  display: flex;
  align-items: center;
}

.krds-breadcrumb-item:not(:last-child)::after {
  content: "/";
  margin: 0 var(--krds-spacing-2);
  color: var(--krds-light-color-neutral-text-tertiary);
}

.krds-breadcrumb-link {
  color: var(--krds-light-color-interactive-text-default);
  text-decoration: none;
}

.krds-breadcrumb-link:hover {
  color: var(--krds-light-color-interactive-text-hover);
  text-decoration: underline;
}

.krds-breadcrumb-item.active {
  color: var(--krds-light-color-neutral-text-primary);
}`;
  }

  generateGenericTemplate(className, variant) {
    return {
      html: `<div class="${className}">
  <!-- 일반 컴포넌트 -->
  <span>컴포넌트 내용</span>
</div>`,
      css: `/* ${className} 스타일 */
.${className} {
  display: block;
  padding: var(--krds-spacing-4);
}`,
      variants: []
    };
  }

  /**
   * 컴포넌트 ID로 컴포넌트 정보 가져오기
   */
  getComponent(componentId) {
    // Check cache first
    if (this.componentCache.has(componentId)) {
      return this.componentCache.get(componentId);
    }

    const mapping = KRDS_COMPONENT_MAPPING[componentId];
    if (!mapping) {
      return null;
    }

    const component = {
      id: componentId,
      name: componentId,
      ...mapping
    };

    // Cache the component
    this.componentCache.set(componentId, component);
    return component;
  }

  /**
   * 모든 컴포넌트 가져오기
   */
  getAllComponents() {
    return Object.keys(KRDS_COMPONENT_MAPPING).map(id => ({
      id,
      name: id,
      ...KRDS_COMPONENT_MAPPING[id]
    }));
  }

  /**
   * 카테고리별 컴포넌트 가져오기
   */
  getComponentsByCategory(category) {
    return this.getAllComponents().filter(component => component.category === category);
  }

  /**
   * 컴포넌트 검색
   */
  searchComponents(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllComponents().filter(
      component =>
        component.name.toLowerCase().includes(lowerQuery) ||
        component.id.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 컴포넌트 존재 여부 확인
   */
  hasComponent(componentId) {
    return Object.prototype.hasOwnProperty.call(KRDS_COMPONENT_MAPPING, componentId);
  }

  /**
   * 컴포넌트 메타데이터 가져오기
   */
  getComponentMetadata(componentId) {
    return this.getComponent(componentId);
  }

  /**
   * 컴포넌트 설정 로드
   */
  loadComponentConfig(componentId) {
    return this.getComponent(componentId);
  }
}

// 기본 인스턴스 export
export const componentLibrary = new KRDSComponentLibrary();
