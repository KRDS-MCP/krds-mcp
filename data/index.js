/**
 * KRDS 데이터 모듈 통합 인덱스
 * 모든 디자인 시스템 데이터를 한 곳에서 export
 * 완전한 KRDS 2024 시스템 구현
 */

// 기본 데이터 export
export { designPrinciples } from './design-principles.js';

// 색상 시스템
export {
  colors,
  primaryColors,
  systemColors,
  neutralColors,
  emphasisColors,
  graphicColors,
  transparencyLevels,
  darkModeColors,
  colorUtils,
  accessibilityGuidelines
} from './colors.js';

// 타이포그래피 시스템
export {
  typography,
  typographyStyles,
  fontFamilies,
  fontScale,
  fontWeights,
  lineHeights,
  letterSpacings,
  typographyUtils,
  typographyAccessibility,
  responsiveRules
} from './typography.js';

// 시스템 (기존 호환성)
export {
  spacingSystem,
  gridSystem,
  borderRadius,
  shadows,
  breakpoints,
  responsiveGuidelines,
  darkModeSupport
} from './systems.js';

// 컴포넌트 시스템
export { components, componentsByCategory, findComponent, componentStats } from './components.js';

// 글로벌 패턴
export { globalPatterns, findGlobalPattern, getPatternsForComponent, globalPatternStats } from './patterns-global.js';

// 서비스 패턴
export {
  servicePatterns,
  findServicePattern,
  getServicePatternsForComponent,
  servicePatternStats,
  servicePatternCategories
} from './patterns-service.js';

// Shape & Icons
export {
  shapes,
  icons,
  borderRadius as shapeRadius,
  shadows as shapeShadows,
  shapeGuidelines,
  iconSizes,
  iconCategories,
  iconGuidelines,
  iconStrokes,
  iconUtils
} from './shapes-icons.js';

// 디자인 토큰
export {
  designTokens,
  colorTokens,
  typographyTokens,
  spacingTokens,
  sizingTokens,
  borderTokens,
  shadowTokens,
  motionTokens,
  layoutTokens,
  componentTokens,
  tokenUtils,
  tokenValidation
} from './design-tokens.js';

// 통합된 KRDS 데이터 객체 (동기적 로딩)
import { designPrinciples } from './design-principles.js';
import { colors } from './colors.js';
import { typography } from './typography.js';
import { components } from './components.js';
import { globalPatterns } from './patterns-global.js';
import { servicePatterns } from './patterns-service.js';
import { spacingSystem, gridSystem, breakpoints, responsiveGuidelines, darkModeSupport } from './systems.js';
import { shapes, icons } from './shapes-icons.js';
import { designTokens } from './design-tokens.js';

export const KRDS_DATA = {
  // 기본 시스템
  designPrinciples,
  colors,
  typography,
  spacingSystem,
  gridSystem,
  breakpoints,
  responsiveGuidelines,
  darkModeSupport,

  // 새로 추가된 시스템
  components,
  globalPatterns,
  servicePatterns,
  shapes,
  icons,
  designTokens,

  // 통계 정보
  stats: {
    componentsTotal: components.length,
    globalPatternsTotal: globalPatterns.length,
    servicePatternsTotal: servicePatterns.length,
    colorsTotal: colors.length,
    typographyTotal: typography.length,
    designTokensTotal: Object.keys(designTokens.tokens).reduce(
      (sum, category) => sum + Object.keys(designTokens.tokens[category]).length,
      0
    )
  },

  meta: {
    version: '2.0.0',
    compliance: 'KRDS 2024 Complete',
    lastUpdated: new Date().toISOString(),
    coverage: {
      components: '37/37 (100%)',
      globalPatterns: '11/11 (100%)',
      servicePatterns: '5/5 (100%)',
      designTokens: 'Complete',
      accessibility: 'WCAG 2.1 AA'
    }
  }
};
