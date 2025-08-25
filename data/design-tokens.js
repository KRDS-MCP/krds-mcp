/**
 * KRDS 디자인 토큰 데이터
 * 한국 정부 디지털 서비스의 표준 디자인 토큰 체계
 * KRDS 공식 명명 규칙을 따른 토큰 정의
 */

// 디자인 토큰 명명 구조: namespace-theme-category-component-type-modifier-state-size

export const namespace = 'krds';

export const themes = {
  light: 'light',
  dark: 'dark',
  highContrast: 'high-contrast'
};

export const categories = {
  color: 'color',
  typography: 'typography',
  spacing: 'spacing',
  sizing: 'sizing',
  border: 'border',
  shadow: 'shadow',
  motion: 'motion',
  layout: 'layout'
};

// 색상 토큰
export const colorTokens = {
  // Primary Colors
  'krds-light-color-primary-background-default': '#004494',
  'krds-light-color-primary-background-hover': '#003A8A',
  'krds-light-color-primary-background-pressed': '#003070',
  'krds-light-color-primary-background-disabled': '#ADB5BD',

  'krds-light-color-primary-text-default': '#FFFFFF',
  'krds-light-color-primary-text-disabled': '#E9ECEF',

  'krds-light-color-primary-border-default': '#004494',
  'krds-light-color-primary-border-hover': '#003A8A',
  'krds-light-color-primary-border-focus': '#4A90E2',

  // Secondary Colors
  'krds-light-color-secondary-background-default': '#4A90E2',
  'krds-light-color-secondary-background-hover': '#2E5BDA',
  'krds-light-color-secondary-background-pressed': '#1E4BB8',

  'krds-light-color-secondary-text-default': '#FFFFFF',
  'krds-light-color-secondary-border-default': '#4A90E2',

  // System Colors - Success
  'krds-light-color-success-background-default': '#28A745',
  'krds-light-color-success-background-light': '#D4EDDA',
  'krds-light-color-success-background-dark': '#155724',

  'krds-light-color-success-text-default': '#FFFFFF',
  'krds-light-color-success-text-dark': '#155724',

  'krds-light-color-success-border-default': '#28A745',
  'krds-light-color-success-border-light': '#C3E6CB',

  // System Colors - Warning
  'krds-light-color-warning-background-default': '#FFC107',
  'krds-light-color-warning-background-light': '#FFF3CD',
  'krds-light-color-warning-background-dark': '#856404',

  'krds-light-color-warning-text-default': '#212529',
  'krds-light-color-warning-text-dark': '#856404',

  'krds-light-color-warning-border-default': '#FFC107',
  'krds-light-color-warning-border-light': '#FFEAA7',

  // System Colors - Error
  'krds-light-color-error-background-default': '#DC3545',
  'krds-light-color-error-background-light': '#F8D7DA',
  'krds-light-color-error-background-dark': '#721C24',

  'krds-light-color-error-text-default': '#FFFFFF',
  'krds-light-color-error-text-dark': '#721C24',

  'krds-light-color-error-border-default': '#DC3545',
  'krds-light-color-error-border-light': '#F5C6CB',

  // System Colors - Info
  'krds-light-color-info-background-default': '#17A2B8',
  'krds-light-color-info-background-light': '#D1ECF1',
  'krds-light-color-info-background-dark': '#0C5460',

  'krds-light-color-info-text-default': '#FFFFFF',
  'krds-light-color-info-text-dark': '#0C5460',

  'krds-light-color-info-border-default': '#17A2B8',
  'krds-light-color-info-border-light': '#B3E5FC',

  // Neutral Colors
  'krds-light-color-neutral-background-default': '#FFFFFF',
  'krds-light-color-neutral-background-secondary': '#F8F9FA',
  'krds-light-color-neutral-background-tertiary': '#E9ECEF',
  'krds-light-color-neutral-background-overlay': 'rgba(0, 0, 0, 0.5)',

  'krds-light-color-neutral-text-primary': '#212529',
  'krds-light-color-neutral-text-secondary': '#495057',
  'krds-light-color-neutral-text-tertiary': '#6C757D',
  'krds-light-color-neutral-text-disabled': '#ADB5BD',
  'krds-light-color-neutral-text-placeholder': '#6C757D',
  'krds-light-color-neutral-text-inverse': '#FFFFFF',

  'krds-light-color-neutral-border-default': '#DEE2E6',
  'krds-light-color-neutral-border-secondary': '#CED4DA',
  'krds-light-color-neutral-border-strong': '#495057',
  'krds-light-color-neutral-border-focus': '#80BDFF',

  // Interactive Colors
  'krds-light-color-interactive-background-default': 'transparent',
  'krds-light-color-interactive-background-hover': '#F8F9FA',
  'krds-light-color-interactive-background-pressed': '#E9ECEF',
  'krds-light-color-interactive-background-selected': '#E3F2FD',

  'krds-light-color-interactive-text-default': '#0F4C8C',
  'krds-light-color-interactive-text-hover': '#0C3E74',
  'krds-light-color-interactive-text-visited': '#6F42C1',

  // 다크 모드 색상
  'krds-dark-color-primary-background-default': '#5AA3F0',
  'krds-dark-color-primary-background-hover': '#7BBBF7',
  'krds-dark-color-primary-background-pressed': '#A8D5FA',
  'krds-dark-color-primary-background-disabled': '#495057',

  'krds-dark-color-primary-text-default': '#000000',
  'krds-dark-color-primary-text-disabled': '#6C757D',

  'krds-dark-color-primary-border-default': '#5AA3F0',
  'krds-dark-color-primary-border-hover': '#7BBBF7',
  'krds-dark-color-primary-border-focus': '#A8D5FA',

  'krds-dark-color-secondary-background-default': '#6A9FE2',
  'krds-dark-color-secondary-background-hover': '#8AB7E9',
  'krds-dark-color-secondary-background-pressed': '#A8D5FA',

  'krds-dark-color-secondary-text-default': '#000000',
  'krds-dark-color-secondary-border-default': '#6A9FE2',

  'krds-dark-color-success-background-default': '#34C759',
  'krds-dark-color-success-background-light': '#1A3D21',
  'krds-dark-color-success-background-dark': '#A3D9B1',

  'krds-dark-color-success-text-default': '#000000',
  'krds-dark-color-success-text-dark': '#D4EDDA',

  'krds-dark-color-success-border-default': '#34C759',
  'krds-dark-color-success-border-light': '#1A3D21',

  'krds-dark-color-warning-background-default': '#FFD60A',
  'krds-dark-color-warning-background-light': '#4D441E',
  'krds-dark-color-warning-background-dark': '#FFEAA7',

  'krds-dark-color-warning-text-default': '#000000',
  'krds-dark-color-warning-text-dark': '#FFF3CD',

  'krds-dark-color-warning-border-default': '#FFD60A',
  'krds-dark-color-warning-border-light': '#4D441E',

  'krds-dark-color-error-background-default': '#FF453A',
  'krds-dark-color-error-background-light': '#4A1A1F',
  'krds-dark-color-error-background-dark': '#F5C6CB',

  'krds-dark-color-error-text-default': '#000000',
  'krds-dark-color-error-text-dark': '#F8D7DA',

  'krds-dark-color-error-border-default': '#FF453A',
  'krds-dark-color-error-border-light': '#4A1A1F',

  'krds-dark-color-info-background-default': '#5AC8FA',
  'krds-dark-color-info-background-light': '#193C46',
  'krds-dark-color-info-background-dark': '#B3E5FC',

  'krds-dark-color-info-text-default': '#000000',
  'krds-dark-color-info-text-dark': '#D1ECF1',

  'krds-dark-color-info-border-default': '#5AC8FA',
  'krds-dark-color-info-border-light': '#193C46',

  'krds-dark-color-neutral-background-default': '#121212',
  'krds-dark-color-neutral-background-secondary': '#1E1E1E',
  'krds-dark-color-neutral-background-tertiary': '#2D2D2D',
  'krds-dark-color-neutral-background-overlay': 'rgba(255, 255, 255, 0.1)',

  'krds-dark-color-neutral-text-primary': '#FFFFFF',
  'krds-dark-color-neutral-text-secondary': '#B3B3B3',
  'krds-dark-color-neutral-text-tertiary': '#8E8E93',
  'krds-dark-color-neutral-text-disabled': '#495057',
  'krds-dark-color-neutral-text-placeholder': '#8E8E93',
  'krds-dark-color-neutral-text-inverse': '#121212',

  'krds-dark-color-neutral-border-default': '#3A3A3C',
  'krds-dark-color-neutral-border-secondary': '#48484A',
  'krds-dark-color-neutral-border-strong': '#ADB5BD',
  'krds-dark-color-neutral-border-focus': '#5AA3F0',

  'krds-dark-color-interactive-background-default': 'transparent',
  'krds-dark-color-interactive-background-hover': '#2D2D2D',
  'krds-dark-color-interactive-background-pressed': '#3A3A3C',
  'krds-dark-color-interactive-background-selected': '#1A3D57',

  'krds-dark-color-interactive-text-default': '#5AA3F0',
  'krds-dark-color-interactive-text-hover': '#7BBBF7',
  'krds-dark-color-interactive-text-visited': '#C5A8FF'
};

// 타이포그래피 토큰
export const typographyTokens = {
  // Font Families
  'krds-typography-font-family-primary':
    'Pretendard GOV, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  'krds-typography-font-family-secondary': 'Noto Sans KR, Malgun Gothic, sans-serif',
  'krds-typography-font-family-monospace': 'D2 Coding, Courier New, Consolas, Monaco, monospace',
  'krds-typography-font-family-english': 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',

  // Font Weights
  'krds-typography-font-weight-light': '300',
  'krds-typography-font-weight-regular': '400',
  'krds-typography-font-weight-medium': '500',
  'krds-typography-font-weight-semibold': '600',
  'krds-typography-font-weight-bold': '700',
  'krds-typography-font-weight-extrabold': '800',
  'krds-typography-font-weight-black': '900',

  // Font Sizes
  'krds-typography-font-size-xs': '12px',
  'krds-typography-font-size-sm': '14px',
  'krds-typography-font-size-base': '16px',
  'krds-typography-font-size-lg': '18px',
  'krds-typography-font-size-xl': '20px',
  'krds-typography-font-size-2xl': '24px',
  'krds-typography-font-size-3xl': '28px',
  'krds-typography-font-size-4xl': '32px',
  'krds-typography-font-size-5xl': '36px',
  'krds-typography-font-size-6xl': '40px',
  'krds-typography-font-size-7xl': '48px',
  'krds-typography-font-size-8xl': '56px',
  'krds-typography-font-size-9xl': '64px',

  // Line Heights
  'krds-typography-line-height-none': '1',
  'krds-typography-line-height-tight': '1.1',
  'krds-typography-line-height-snug': '1.2',
  'krds-typography-line-height-normal': '1.3',
  'krds-typography-line-height-relaxed': '1.4',
  'krds-typography-line-height-loose': '1.5',
  'krds-typography-line-height-looser': '1.6',
  'krds-typography-line-height-loosest': '1.8',

  // Letter Spacings
  'krds-typography-letter-spacing-tighter': '-0.05em',
  'krds-typography-letter-spacing-tight': '-0.025em',
  'krds-typography-letter-spacing-normal': '0',
  'krds-typography-letter-spacing-wide': '0.025em',
  'krds-typography-letter-spacing-wider': '0.05em',
  'krds-typography-letter-spacing-widest': '0.1em'
};

// 스페이싱 토큰
export const spacingTokens = {
  'krds-spacing-0': '0',
  'krds-spacing-1': '4px',
  'krds-spacing-2': '8px',
  'krds-spacing-3': '12px',
  'krds-spacing-4': '16px',
  'krds-spacing-5': '20px',
  'krds-spacing-6': '24px',
  'krds-spacing-7': '28px',
  'krds-spacing-8': '32px',
  'krds-spacing-9': '36px',
  'krds-spacing-10': '40px',
  'krds-spacing-11': '44px',
  'krds-spacing-12': '48px',
  'krds-spacing-14': '56px',
  'krds-spacing-16': '64px',
  'krds-spacing-20': '80px',
  'krds-spacing-24': '96px',
  'krds-spacing-28': '112px',
  'krds-spacing-32': '128px',
  'krds-spacing-36': '144px',
  'krds-spacing-40': '160px',
  'krds-spacing-44': '176px',
  'krds-spacing-48': '192px',
  'krds-spacing-52': '208px',
  'krds-spacing-56': '224px',
  'krds-spacing-60': '240px',
  'krds-spacing-64': '256px',
  'krds-spacing-72': '288px',
  'krds-spacing-80': '320px',
  'krds-spacing-96': '384px'
};

// 사이즈 토큰
export const sizingTokens = {
  // Width/Height
  'krds-sizing-0': '0',
  'krds-sizing-1': '4px',
  'krds-sizing-2': '8px',
  'krds-sizing-3': '12px',
  'krds-sizing-4': '16px',
  'krds-sizing-5': '20px',
  'krds-sizing-6': '24px',
  'krds-sizing-8': '32px',
  'krds-sizing-10': '40px',
  'krds-sizing-12': '48px',
  'krds-sizing-14': '56px',
  'krds-sizing-16': '64px',
  'krds-sizing-20': '80px',
  'krds-sizing-24': '96px',
  'krds-sizing-28': '112px',
  'krds-sizing-32': '128px',
  'krds-sizing-36': '144px',
  'krds-sizing-40': '160px',
  'krds-sizing-44': '176px',
  'krds-sizing-48': '192px',
  'krds-sizing-52': '208px',
  'krds-sizing-56': '224px',
  'krds-sizing-60': '240px',
  'krds-sizing-64': '256px',
  'krds-sizing-72': '288px',
  'krds-sizing-80': '320px',
  'krds-sizing-96': '384px',

  'krds-sizing-1-2': '50%',
  'krds-sizing-1-3': '33.333333%',
  'krds-sizing-2-3': '66.666667%',
  'krds-sizing-1-4': '25%',
  'krds-sizing-2-4': '50%',
  'krds-sizing-3-4': '75%',
  'krds-sizing-1-5': '20%',
  'krds-sizing-2-5': '40%',
  'krds-sizing-3-5': '60%',
  'krds-sizing-4-5': '80%',
  'krds-sizing-1-6': '16.666667%',
  'krds-sizing-5-6': '83.333333%',
  'krds-sizing-full': '100%',

  'krds-sizing-screen': '100vh',
  'krds-sizing-min': 'min-content',
  'krds-sizing-max': 'max-content',
  'krds-sizing-fit': 'fit-content'
};

// 보더 토큰
export const borderTokens = {
  // Border Radius
  'krds-border-radius-none': '0',
  'krds-border-radius-xs': '2px',
  'krds-border-radius-sm': '4px',
  'krds-border-radius-base': '6px',
  'krds-border-radius-md': '8px',
  'krds-border-radius-lg': '12px',
  'krds-border-radius-xl': '16px',
  'krds-border-radius-2xl': '20px',
  'krds-border-radius-3xl': '24px',
  'krds-border-radius-full': '9999px',

  // Border Width
  'krds-border-width-0': '0',
  'krds-border-width-1': '1px',
  'krds-border-width-2': '2px',
  'krds-border-width-4': '4px',
  'krds-border-width-8': '8px',

  // Border Style
  'krds-border-style-solid': 'solid',
  'krds-border-style-dashed': 'dashed',
  'krds-border-style-dotted': 'dotted',
  'krds-border-style-none': 'none'
};

// 그림자 토큰
export const shadowTokens = {
  'krds-shadow-none': 'none',
  'krds-shadow-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'krds-shadow-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  'krds-shadow-base': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'krds-shadow-md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  'krds-shadow-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  'krds-shadow-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  'krds-shadow-2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
  'krds-shadow-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Focus Shadow
  'krds-shadow-focus-primary': '0 0 0 3px rgba(15, 76, 140, 0.1)',
  'krds-shadow-focus-error': '0 0 0 3px rgba(220, 53, 69, 0.1)',
  'krds-shadow-focus-success': '0 0 0 3px rgba(40, 167, 69, 0.1)',
  'krds-shadow-focus-warning': '0 0 0 3px rgba(255, 193, 7, 0.1)'
};

// 모션 토큰
export const motionTokens = {
  'krds-motion-duration-instant': '0ms',
  'krds-motion-duration-fast': '150ms',
  'krds-motion-duration-normal': '300ms',
  'krds-motion-duration-slow': '500ms',
  'krds-motion-duration-slower': '700ms',

  'krds-motion-easing-linear': 'cubic-bezier(0, 0, 1, 1)',
  'krds-motion-easing-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  'krds-motion-easing-ease-in': 'cubic-bezier(0.42, 0, 1, 1)',
  'krds-motion-easing-ease-out': 'cubic-bezier(0, 0, 0.58, 1)',
  'krds-motion-easing-ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
  'krds-motion-easing-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // Common Transitions
  'krds-motion-transition-colors':
    'color 150ms ease, background-color 150ms ease, border-color 150ms ease',
  'krds-motion-transition-opacity': 'opacity 150ms ease',
  'krds-motion-transition-shadow': 'box-shadow 150ms ease',
  'krds-motion-transition-transform': 'transform 150ms ease',
  'krds-motion-transition-all': 'all 150ms ease'
};

// 레이아웃 토큰
export const layoutTokens = {
  // Container Sizes
  'krds-layout-container-xs': '480px',
  'krds-layout-container-sm': '640px',
  'krds-layout-container-md': '768px',
  'krds-layout-container-lg': '1024px',
  'krds-layout-container-xl': '1280px',
  'krds-layout-container-2xl': '1536px',

  'krds-layout-breakpoint-xs': '480px',
  'krds-layout-breakpoint-sm': '640px',
  'krds-layout-breakpoint-md': '768px',
  'krds-layout-breakpoint-lg': '1024px',
  'krds-layout-breakpoint-xl': '1280px',
  'krds-layout-breakpoint-2xl': '1536px',

  'krds-layout-grid-columns': '12',
  'krds-layout-grid-gap': '24px',
  'krds-layout-grid-gap-sm': '16px',
  'krds-layout-grid-gap-lg': '32px',

  // Z-Index
  'krds-layout-z-index-hide': '-1',
  'krds-layout-z-index-auto': 'auto',
  'krds-layout-z-index-base': '0',
  'krds-layout-z-index-docked': '10',
  'krds-layout-z-index-dropdown': '1000',
  'krds-layout-z-index-sticky': '1100',
  'krds-layout-z-index-banner': '1200',
  'krds-layout-z-index-overlay': '1300',
  'krds-layout-z-index-modal': '1400',
  'krds-layout-z-index-popover': '1500',
  'krds-layout-z-index-skiplink': '1600',
  'krds-layout-z-index-toast': '1700',
  'krds-layout-z-index-tooltip': '1800'
};

// 컴포넌트별 토큰
export const componentTokens = {
  'krds-component-button-height-sm': '32px',
  'krds-component-button-height-md': '40px',
  'krds-component-button-height-lg': '48px',
  'krds-component-button-padding-x-sm': '12px',
  'krds-component-button-padding-x-md': '16px',
  'krds-component-button-padding-x-lg': '24px',
  'krds-component-button-border-radius': '6px',
  'krds-component-button-border-width': '1px',

  'krds-component-input-height-sm': '32px',
  'krds-component-input-height-md': '40px',
  'krds-component-input-height-lg': '48px',
  'krds-component-input-padding-x': '12px',
  'krds-component-input-border-radius': '4px',
  'krds-component-input-border-width': '1px',

  'krds-component-card-padding': '24px',
  'krds-component-card-padding-sm': '16px',
  'krds-component-card-padding-lg': '32px',
  'krds-component-card-border-radius': '12px',
  'krds-component-card-border-width': '1px',

  'krds-component-modal-width-sm': '400px',
  'krds-component-modal-width-md': '500px',
  'krds-component-modal-width-lg': '800px',
  'krds-component-modal-width-xl': '1200px',
  'krds-component-modal-border-radius': '16px',

  'krds-component-header-height': '64px',
  'krds-component-header-height-sm': '56px',

  'krds-component-sidebar-width': '280px',
  'krds-component-sidebar-width-collapsed': '64px',

  'krds-component-nav-item-height': '44px',
  'krds-component-nav-item-padding-x': '16px',

  'krds-component-table-cell-padding-x': '12px',
  'krds-component-table-cell-padding-y': '8px',
  'krds-component-table-header-height': '48px',
  'krds-component-table-row-height': '52px'
};

// 통합 디자인 토큰
export const designTokens = {
  // 기본 정보
  meta: {
    namespace,
    version: '1.0.0',
    description: 'KRDS Design Tokens - 한국 정부 디지털 서비스 디자인 토큰',
    lastUpdated: new Date().toISOString()
  },

  // 토큰 데이터
  tokens: {
    color: colorTokens,
    typography: typographyTokens,
    spacing: spacingTokens,
    sizing: sizingTokens,
    border: borderTokens,
    shadow: shadowTokens,
    motion: motionTokens,
    layout: layoutTokens,
    component: componentTokens
  }
};

// 토큰 유틸리티 함수
export const tokenUtils = {
  // 토큰 값 조회
  getToken(tokenName) {
    const [category] = tokenName.replace(`${namespace}-`, '').split('-');

    if (designTokens.tokens[category]) {
      return designTokens.tokens[category][tokenName];
    }
    return null;
  },

  // 카테고리별 토큰 조회
  getTokensByCategory(category) {
    return designTokens.tokens[category] || {};
  },

  // 토큰 검색
  searchTokens(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(designTokens.tokens).forEach(([category, tokens]) => {
      Object.entries(tokens).forEach(([tokenName, value]) => {
        if (tokenName.toLowerCase().includes(lowerQuery)) {
          results.push({
            category,
            name: tokenName,
            value,
            description: this.getTokenDescription(tokenName)
          });
        }
      });
    });

    return results;
  },

  // 토큰 설명 생성
  getTokenDescription(tokenName) {
    const parts = tokenName.split('-');
    const category = parts[2];
    const subcategory = parts[3];
    const type = parts[4];
    const modifier = parts[5];
    const state = parts[6];

    let description = `${category}`;
    if (subcategory) {
      description += ` ${subcategory}`;
    }
    if (type) {
      description += ` ${type}`;
    }
    if (modifier) {
      description += ` (${modifier})`;
    }
    if (state) {
      description += ` - ${state} 상태`;
    }

    return description;
  },

  // CSS 변수 생성
  generateCSSVariables(theme = 'light') {
    const cssVars = {};

    Object.entries(designTokens.tokens).forEach(([_category, tokens]) => {
      Object.entries(tokens).forEach(([tokenName, value]) => {
        if (
          tokenName.includes(theme) ||
          (!tokenName.includes('-light-') && !tokenName.includes('-dark-'))
        ) {
          const cssVarName = `--${tokenName}`;
          cssVars[cssVarName] = value;
        }
      });
    });

    return cssVars;
  },

  // 토큰을 CSS 문자열로 변환
  tokensToCSS(theme = 'light') {
    const cssVars = this.generateCSSVariables(theme);
    let css = ':root {\n';

    Object.entries(cssVars).forEach(([varName, value]) => {
      css += `  ${varName}: ${value};\n`;
    });

    css += '}';
    return css;
  },

  // JSON 형식으로 토큰 내보내기
  exportTokensAsJSON(format = 'style-dictionary') {
    if (format === 'style-dictionary') {
      return this.convertToStyleDictionary();
    }
    return designTokens;
  },

  // Style Dictionary 형식으로 변환
  convertToStyleDictionary() {
    const styleDictionary = {};

    Object.entries(designTokens.tokens).forEach(([_category, tokens]) => {
      Object.entries(tokens).forEach(([tokenName, value]) => {
        const path = tokenName.replace(`${namespace}-`, '').split('-');
        let current = styleDictionary;

        path.forEach((part, index) => {
          if (index === path.length - 1) {
            current[part] = { value };
          } else {
            if (!current[part]) {
              current[part] = {};
            }
            current = current[part];
          }
        });
      });
    });

    return styleDictionary;
  }
};

// 토큰 검증 함수
export const tokenValidation = {
  // 토큰 이름 유효성 검사
  validateTokenName(tokenName) {
    const pattern = new RegExp(
      `^${namespace}-(${Object.keys(themes).join('|')})-(${Object.keys(categories).join('|')})-`
    );
    return pattern.test(tokenName);
  },

  // 색상 값 유효성 검사
  validateColorValue(value) {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\d+,\s*\d+,\s*\d+\)$/;
    const rgbaPattern = /^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/;

    return hexPattern.test(value) || rgbPattern.test(value) || rgbaPattern.test(value);
  },

  // 모든 토큰 검증
  validateAllTokens() {
    const errors = [];

    Object.entries(designTokens.tokens.color).forEach(([tokenName, value]) => {
      if (!this.validateTokenName(tokenName)) {
        errors.push(`Invalid token name: ${tokenName}`);
      }
      if (!this.validateColorValue(value)) {
        errors.push(`Invalid color value for ${tokenName}: ${value}`);
      }
    });

    return errors;
  }
};

// 기본 export
export default designTokens;
