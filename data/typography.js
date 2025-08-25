/**
 * KRDS 타이포그래피 데이터
 * 한국 정부 디지털 서비스의 표준 타이포그래피 체계
 * 공식 KRDS 문서를 기반으로 완성된 타이포그래피 시스템
 */

// 폰트 패밀리 정의
export const fontFamilies = {
  primary: {
    name: 'Pretendard GOV',
    fallback:
      "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
    description: '정부 서비스 표준 서체',
    usage: '모든 UI 텍스트',
    weights: [300, 400, 500, 600, 700, 800, 900]
  },
  secondary: {
    name: 'Noto Sans KR',
    fallback: "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif",
    description: '한글 최적화 서체',
    usage: '본문 텍스트, 긴 글',
    weights: [300, 400, 500, 700, 900]
  },
  monospace: {
    name: 'D2 Coding',
    fallback: "'D2 Coding', 'Courier New', Consolas, Monaco, monospace",
    description: '코드 표시용 고정폭 서체',
    usage: '코드, 데이터',
    weights: [400, 700]
  },
  english: {
    name: 'Inter',
    fallback: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: '영문 최적화 서체',
    usage: '영문 전용 페이지',
    weights: [300, 400, 500, 600, 700, 800, 900]
  }
};

// 폰트 크기 스케일
export const fontScale = {
  xs: '12px', // 0.75rem
  sm: '14px', // 0.875rem
  base: '16px', // 1rem (기준)
  lg: '18px', // 1.125rem
  xl: '20px', // 1.25rem
  '2xl': '24px', // 1.5rem
  '3xl': '28px', // 1.75rem
  '4xl': '32px', // 2rem
  '5xl': '36px', // 2.25rem
  '6xl': '40px', // 2.5rem
  '7xl': '48px', // 3rem
  '8xl': '56px', // 3.5rem
  '9xl': '64px' // 4rem
};

// 폰트 굵기
export const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900'
};

// 행간 스케일
export const lineHeights = {
  none: '1',
  tight: '1.1',
  snug: '1.2',
  normal: '1.3',
  relaxed: '1.4',
  loose: '1.5',
  looser: '1.6',
  loosest: '1.8'
};

// 자간 스케일
export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em'
};

// 타이포그래피 스타일 정의
export const typographyStyles = [
  {
    id: 'display-xl',
    name: 'Display XL',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale['9xl'],
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.black,
    letterSpacing: letterSpacings.tighter,
    usage: '랜딩 페이지 메인 타이틀',
    category: 'display',
    htmlTag: 'h1',
    accessibilityNotes: '페이지당 한 개만 사용',
    responsive: {
      mobile: '48px',
      tablet: '56px',
      desktop: '64px'
    },
    css: {
      textDecoration: 'none',
      textTransform: 'none'
    }
  },
  {
    id: 'display-lg',
    name: 'Display Large',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale['6xl'],
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.tight,
    usage: '메인 타이틀, 히어로 섹션',
    category: 'display',
    htmlTag: 'h1',
    responsive: {
      mobile: '32px',
      tablet: '36px',
      desktop: '40px'
    }
  },
  {
    id: 'display-md',
    name: 'Display Medium',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale['5xl'],
    lineHeight: lineHeights.snug,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.tight,
    usage: '페이지 타이틀',
    category: 'display',
    htmlTag: 'h1',
    responsive: {
      mobile: '28px',
      tablet: '32px',
      desktop: '36px'
    }
  },
  {
    id: 'heading-1',
    name: 'Heading 1',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale['4xl'],
    lineHeight: lineHeights.snug,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.normal,
    usage: '섹션 타이틀',
    category: 'heading',
    htmlTag: 'h1',
    responsive: {
      mobile: '24px',
      tablet: '28px',
      desktop: '32px'
    }
  },
  {
    id: 'heading-2',
    name: 'Heading 2',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale['3xl'],
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.normal,
    usage: '하위 섹션 제목',
    category: 'heading',
    htmlTag: 'h2',
    responsive: {
      mobile: '20px',
      tablet: '24px',
      desktop: '28px'
    }
  },
  {
    id: 'heading-3',
    name: 'Heading 3',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale['2xl'],
    lineHeight: lineHeights.relaxed,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.normal,
    usage: '소제목',
    category: 'heading',
    htmlTag: 'h3',
    responsive: {
      mobile: '18px',
      tablet: '20px',
      desktop: '24px'
    }
  },
  {
    id: 'heading-4',
    name: 'Heading 4',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale.xl,
    lineHeight: lineHeights.relaxed,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.normal,
    usage: '카드 제목, 폼 제목',
    category: 'heading',
    htmlTag: 'h4',
    responsive: {
      mobile: '16px',
      tablet: '18px',
      desktop: '20px'
    }
  },
  {
    id: 'heading-5',
    name: 'Heading 5',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale.lg,
    lineHeight: lineHeights.relaxed,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.normal,
    usage: '작은 제목',
    category: 'heading',
    htmlTag: 'h5',
    responsive: {
      mobile: '14px',
      tablet: '16px',
      desktop: '18px'
    }
  },
  {
    id: 'body-xl',
    name: 'Body XL',
    fontFamily: fontFamilies.secondary.name,
    fallback: fontFamilies.secondary.fallback,
    fontSize: fontScale.xl,
    lineHeight: lineHeights.looser,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacings.normal,
    usage: '중요한 본문, 리드 문단',
    category: 'body',
    htmlTag: 'p',
    responsive: {
      mobile: '18px',
      tablet: '19px',
      desktop: '20px'
    }
  },
  {
    id: 'body-lg',
    name: 'Body Large',
    fontFamily: fontFamilies.secondary.name,
    fallback: fontFamilies.secondary.fallback,
    fontSize: fontScale.lg,
    lineHeight: lineHeights.looser,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacings.normal,
    usage: '강조 본문, 리드 텍스트',
    category: 'body',
    htmlTag: 'p',
    responsive: {
      mobile: '16px',
      tablet: '17px',
      desktop: '18px'
    }
  },
  {
    id: 'body-base',
    name: 'Body Regular',
    fontFamily: fontFamilies.secondary.name,
    fallback: fontFamilies.secondary.fallback,
    fontSize: fontScale.base,
    lineHeight: lineHeights.looser,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacings.normal,
    usage: '일반 본문, 기본 텍스트',
    category: 'body',
    htmlTag: 'p',
    isDefault: true,
    responsive: {
      mobile: '14px',
      tablet: '15px',
      desktop: '16px'
    }
  },
  {
    id: 'body-sm',
    name: 'Body Small',
    fontFamily: fontFamilies.secondary.name,
    fallback: fontFamilies.secondary.fallback,
    fontSize: fontScale.sm,
    lineHeight: lineHeights.loose,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacings.normal,
    usage: '보조 텍스트, 설명',
    category: 'body',
    htmlTag: 'p',
    responsive: {
      mobile: '12px',
      tablet: '13px',
      desktop: '14px'
    }
  },
  {
    id: 'caption',
    name: 'Caption',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale.xs,
    lineHeight: lineHeights.relaxed,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacings.wide,
    usage: '캡션, 메타 정보, 저작권',
    category: 'utility',
    htmlTag: 'span',
    responsive: {
      mobile: '11px',
      tablet: '11px',
      desktop: '12px'
    }
  },
  {
    id: 'label-lg',
    name: 'Label Large',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale.base,
    lineHeight: lineHeights.loose,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacings.normal,
    usage: '중요한 라벨, 버튼 텍스트',
    category: 'interactive',
    htmlTag: 'label',
    responsive: {
      mobile: '14px',
      tablet: '15px',
      desktop: '16px'
    }
  },
  {
    id: 'label-md',
    name: 'Label Medium',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale.sm,
    lineHeight: lineHeights.loose,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacings.normal,
    usage: '일반 라벨, 폼 라벨',
    category: 'interactive',
    htmlTag: 'label',
    responsive: {
      mobile: '13px',
      tablet: '13px',
      desktop: '14px'
    }
  },
  {
    id: 'label-sm',
    name: 'Label Small',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale.xs,
    lineHeight: lineHeights.relaxed,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacings.wide,
    usage: '작은 라벨, 태그, 배지',
    category: 'interactive',
    htmlTag: 'span',
    responsive: {
      mobile: '11px',
      tablet: '11px',
      desktop: '12px'
    }
  },
  {
    id: 'button-lg',
    name: 'Button Large',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale.lg,
    lineHeight: lineHeights.none,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.normal,
    usage: '큰 버튼 텍스트',
    category: 'interactive',
    htmlTag: 'button',
    responsive: {
      mobile: '16px',
      tablet: '17px',
      desktop: '18px'
    }
  },
  {
    id: 'button-md',
    name: 'Button Medium',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale.base,
    lineHeight: lineHeights.none,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.normal,
    usage: '기본 버튼 텍스트',
    category: 'interactive',
    htmlTag: 'button',
    responsive: {
      mobile: '14px',
      tablet: '15px',
      desktop: '16px'
    }
  },
  {
    id: 'button-sm',
    name: 'Button Small',
    fontFamily: fontFamilies.primary.name,
    fallback: fontFamilies.primary.fallback,
    fontSize: fontScale.sm,
    lineHeight: lineHeights.none,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.normal,
    usage: '작은 버튼 텍스트',
    category: 'interactive',
    htmlTag: 'button',
    responsive: {
      mobile: '12px',
      tablet: '13px',
      desktop: '14px'
    }
  },
  {
    id: 'code',
    name: 'Code',
    fontFamily: fontFamilies.monospace.name,
    fallback: fontFamilies.monospace.fallback,
    fontSize: fontScale.sm,
    lineHeight: lineHeights.relaxed,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacings.normal,
    usage: '인라인 코드',
    category: 'utility',
    htmlTag: 'code',
    responsive: {
      mobile: '13px',
      tablet: '13px',
      desktop: '14px'
    }
  }
];

// 기존 호환성을 위한 배열
export const typography = typographyStyles;

// 타이포그래피 유틸리티 함수
export const typographyUtils = {
  // 카테고리별 스타일 필터
  getStylesByCategory(category) {
    return typographyStyles.filter(style => style.category === category);
  },

  // ID로 스타일 찾기
  findStyleById(id) {
    return typographyStyles.find(style => style.id === id);
  },

  // 사용 목적별 스타일 검색
  searchStylesByUsage(query) {
    return typographyStyles.filter(
      style => style.usage && style.usage.toLowerCase().includes(query.toLowerCase())
    );
  },

  // HTML 태그별 스타일 필터
  getStylesByTag(tag) {
    return typographyStyles.filter(style => style.htmlTag === tag);
  },

  // CSS 문자열 생성
  generateCSS(styleId, breakpoint = 'desktop') {
    const style = this.findStyleById(styleId);
    if (!style) {
      return null;
    }

    const fontSize =
      breakpoint === 'desktop'
        ? style.fontSize
        : (style.responsive && style.responsive[breakpoint]) || style.fontSize;

    return {
      fontFamily: style.fallback || style.fontFamily,
      fontSize,
      lineHeight: style.lineHeight,
      fontWeight: style.fontWeight,
      letterSpacing: style.letterSpacing
    };
  }
};

// 타이포그래피 접근성 가이드라인
export const typographyAccessibility = {
  minimumSizes: {
    mobile: '14px',
    desktop: '16px',
    touch: '16px' // 터치 인터페이스 최소 크기
  },

  readability: {
    maxLineLength: '66ch', // 최적 줄 길이
    minLineHeight: '1.4', // 최소 행간
    minContrastRatio: '4.5:1' // 최소 명도 대비
  },

  recommendations: [
    '제목은 본문보다 최소 1.2배 이상 크게',
    '행간은 글자 크기의 1.4배 이상 권장',
    '한 줄에 45-75자가 읽기 가장 편함',
    '중요한 정보는 굵기나 색상으로 강조'
  ],

  multilingual: {
    korean: {
      recommend: fontFamilies.secondary.name,
      lineHeight: '1.6', // 한글 최적 행간
      letterSpacing: '0' // 한글은 자간 조정 불필요
    },
    english: {
      recommend: fontFamilies.english.name,
      lineHeight: '1.4',
      letterSpacing: '0.01em'
    }
  }
};

// 반응형 타이포그래피 규칙
export const responsiveRules = {
  breakpoints: {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)'
  },

  scalingFactor: {
    mobile: 0.875, // 87.5%
    tablet: 0.9375, // 93.75%
    desktop: 1.0 // 100%
  },

  fluidTypography: {
    enable: true,
    minSize: '14px',
    maxSize: '18px',
    minViewport: '320px',
    maxViewport: '1200px'
  }
};
