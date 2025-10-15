/**
 * KRDS 시스템 데이터
 * 스페이싱, 그리드, 반응형 시스템 정의
 */

export const spacingSystem = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px'
};

export const gridSystem = {
  container: {
    maxWidth: {
      sm: '540px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
      xxl: '1320px'
    },
    padding: {
      mobile: '16px',
      tablet: '24px',
      desktop: '32px'
    }
  },
  columns: 12,
  gutters: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px'
  },
  utilities: {
    display: ['block', 'inline-block', 'flex', 'inline-flex', 'grid', 'none'],
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    justifyContent: ['start', 'end', 'center', 'between', 'around', 'evenly'],
    alignItems: ['start', 'end', 'center', 'baseline', 'stretch'],
    textAlign: ['left', 'center', 'right', 'justify']
  }
};

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
};

export const responsiveGuidelines = {
  principles: ['모바일 우선(Mobile First) 설계', '콘텐츠 우선 접근법', '터치 인터페이스 최적화', '성능과 접근성 고려'],
  breakpointStrategy: {
    mobile: {
      range: '320px - 767px',
      guidelines: [
        '단일 열 레이아웃 사용',
        '최소 44px 터치 영역 확보',
        '간결한 네비게이션 제공',
        '큰 텍스트와 버튼 사용'
      ],
      typography: {
        minFontSize: '16px',
        lineHeight: '1.5',
        touchTarget: '44px'
      }
    },
    tablet: {
      range: '768px - 1023px',
      guidelines: ['2-3열 그리드 레이아웃', '가로/세로 모드 지원', '적응형 네비게이션', '중간 크기 터치 영역'],
      typography: {
        scaleFactor: '1.1',
        maxContentWidth: '720px'
      }
    },
    desktop: {
      range: '1024px - 1439px',
      guidelines: ['다열 그리드 레이아웃', '마우스/키보드 최적화', '사이드바 활용', '호버 상태 제공'],
      typography: {
        scaleFactor: '1.2',
        maxContentWidth: '1200px'
      }
    },
    wide: {
      range: '1440px+',
      guidelines: ['최대 너비 제한', '여백 활용', '다단 레이아웃', '대형 화면 최적화'],
      typography: {
        scaleFactor: '1.3',
        maxContentWidth: '1400px'
      }
    }
  },
  commonPatterns: {
    navigation: {
      mobile: '햄버거 메뉴 + 드로어',
      tablet: '탭 네비게이션',
      desktop: '수평 메뉴바'
    },
    layout: {
      mobile: '스택 레이아웃',
      tablet: '2열 사이드바',
      desktop: '3열 그리드'
    },
    images: {
      strategy: '반응형 이미지 사용',
      techniques: ['srcset', 'picture 요소', 'CSS object-fit'],
      optimization: 'WebP, AVIF 형식 활용'
    }
  }
};

export const darkModeSupport = {
  colors: {
    primary: {
      light: '#0066CC',
      dark: '#4A90E2'
    },
    background: {
      light: '#FFFFFF',
      dark: '#1A1A1A'
    },
    surface: {
      light: '#F8F9FA',
      dark: '#2D2D2D'
    },
    text: {
      primary: {
        light: '#212529',
        dark: '#FFFFFF'
      },
      secondary: {
        light: '#6C757D',
        dark: '#B0B0B0'
      }
    },
    border: {
      light: '#DEE2E6',
      dark: '#404040'
    }
  },
  implementation: {
    cssVariables: {
      '--krds-color-primary': 'var(--krds-primary-light)',
      '--krds-color-background': 'var(--krds-bg-light)',
      '--krds-color-text': 'var(--krds-text-light)'
    },
    mediaQuery: '@media (prefers-color-scheme: dark)',
    storageKey: 'krds-theme-preference'
  },
  guidelines: [
    '시스템 설정 존중 (prefers-color-scheme)',
    '사용자 선택 우선',
    '충분한 색상 대비 유지',
    '아이콘과 이미지 적응'
  ]
};
