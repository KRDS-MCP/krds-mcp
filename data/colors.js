/**
 * KRDS 색상 체계 데이터
 * 한국 정부 디지털 서비스의 표준 색상 체계
 * 공식 KRDS 문서를 기반으로 완성된 색상 시스템
 */

// 메인 색상 팔레트
export const primaryColors = [
  {
    name: 'Government Blue',
    id: 'gov-blue',
    hexCode: '#0F4C8C',
    rgb: 'rgb(15, 76, 140)',
    hsl: 'hsl(209, 81%, 30%)',
    usage: '정부 기관 대표 색상, 주요 액션 버튼',
    category: 'primary',
    accessibilityLevel: 'AAA',
    contrastRatio: '7.2:1',
    wcagCompliant: true,
    variants: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#0F4C8C',
      600: '#0C3E74',
      700: '#093158',
      800: '#062A5C',
      900: '#041E44'
    }
  },
  {
    name: 'Korean Red',
    id: 'korean-red',
    hexCode: '#CD2E3A',
    rgb: 'rgb(205, 46, 58)',
    hsl: 'hsl(355, 64%, 49%)',
    usage: '한국 전통 색상, 강조 포인트',
    category: 'primary',
    accessibilityLevel: 'AA',
    contrastRatio: '4.8:1',
    wcagCompliant: true
  }
];

// 시스템 색상
export const systemColors = [
  {
    name: 'Success',
    id: 'success',
    hexCode: '#28A745',
    rgb: 'rgb(40, 167, 69)',
    hsl: 'hsl(134, 61%, 41%)',
    usage: '성공 상태, 완료, 승인',
    category: 'system',
    accessibilityLevel: 'AA',
    contrastRatio: '4.5:1',
    semanticMeaning: 'positive',
    variants: {
      light: '#D4EDDA',
      default: '#28A745',
      dark: '#155724'
    }
  },
  {
    name: 'Warning',
    id: 'warning',
    hexCode: '#FFC107',
    rgb: 'rgb(255, 193, 7)',
    hsl: 'hsl(45, 100%, 51%)',
    usage: '주의 상태, 경고, 대기',
    category: 'system',
    accessibilityLevel: 'AA',
    contrastRatio: '4.5:1',
    semanticMeaning: 'caution',
    variants: {
      light: '#FFF3CD',
      default: '#FFC107',
      dark: '#856404'
    }
  },
  {
    name: 'Error',
    id: 'error',
    hexCode: '#DC3545',
    rgb: 'rgb(220, 53, 69)',
    hsl: 'hsl(354, 70%, 54%)',
    usage: '오류 상태, 위험, 삭제',
    category: 'system',
    accessibilityLevel: 'AA',
    contrastRatio: '4.5:1',
    semanticMeaning: 'negative',
    variants: {
      light: '#F8D7DA',
      default: '#DC3545',
      dark: '#721C24'
    }
  },
  {
    name: 'Info',
    id: 'info',
    hexCode: '#17A2B8',
    rgb: 'rgb(23, 162, 184)',
    hsl: 'hsl(188, 78%, 41%)',
    usage: '정보 제공, 알림, 도움말',
    category: 'system',
    accessibilityLevel: 'AA',
    contrastRatio: '4.5:1',
    semanticMeaning: 'informative',
    variants: {
      light: '#D1ECF1',
      default: '#17A2B8',
      dark: '#0C5460'
    }
  }
];

// 중성 색상 (그레이스케일)
export const neutralColors = [
  {
    name: 'Black',
    id: 'black',
    hexCode: '#000000',
    rgb: 'rgb(0, 0, 0)',
    hsl: 'hsl(0, 0%, 0%)',
    usage: '최고 대비, 순수 텍스트',
    category: 'neutral',
    accessibilityLevel: 'AAA',
    contrastRatio: '21:1'
  },
  {
    name: 'Gray 900',
    id: 'gray-900',
    hexCode: '#212529',
    rgb: 'rgb(33, 37, 41)',
    hsl: 'hsl(210, 11%, 15%)',
    usage: '주요 텍스트, 제목',
    category: 'neutral',
    accessibilityLevel: 'AAA',
    contrastRatio: '15.8:1'
  },
  {
    name: 'Gray 800',
    id: 'gray-800',
    hexCode: '#343A40',
    rgb: 'rgb(52, 58, 64)',
    hsl: 'hsl(210, 10%, 23%)',
    usage: '보조 텍스트',
    category: 'neutral',
    accessibilityLevel: 'AAA',
    contrastRatio: '12.6:1'
  },
  {
    name: 'Gray 700',
    id: 'gray-700',
    hexCode: '#495057',
    rgb: 'rgb(73, 80, 87)',
    hsl: 'hsl(210, 9%, 31%)',
    usage: '비활성 텍스트',
    category: 'neutral',
    accessibilityLevel: 'AA',
    contrastRatio: '9.5:1'
  },
  {
    name: 'Gray 600',
    id: 'gray-600',
    hexCode: '#6C757D',
    rgb: 'rgb(108, 117, 125)',
    hsl: 'hsl(210, 8%, 46%)',
    usage: '플레이스홀더 텍스트',
    category: 'neutral',
    accessibilityLevel: 'AA',
    contrastRatio: '6.1:1'
  },
  {
    name: 'Gray 500',
    id: 'gray-500',
    hexCode: '#ADB5BD',
    rgb: 'rgb(173, 181, 189)',
    hsl: 'hsl(210, 10%, 71%)',
    usage: '비활성 요소, 아이콘',
    category: 'neutral',
    accessibilityLevel: 'AA',
    contrastRatio: '3.9:1'
  },
  {
    name: 'Gray 400',
    id: 'gray-400',
    hexCode: '#CED4DA',
    rgb: 'rgb(206, 212, 218)',
    hsl: 'hsl(210, 14%, 83%)',
    usage: '테두리, 구분선',
    category: 'neutral',
    accessibilityLevel: 'AA',
    contrastRatio: '2.9:1'
  },
  {
    name: 'Gray 300',
    id: 'gray-300',
    hexCode: '#DEE2E6',
    rgb: 'rgb(222, 226, 230)',
    hsl: 'hsl(210, 17%, 89%)',
    usage: '연한 테두리',
    category: 'neutral',
    accessibilityLevel: 'AA',
    contrastRatio: '2.3:1'
  },
  {
    name: 'Gray 200',
    id: 'gray-200',
    hexCode: '#E9ECEF',
    rgb: 'rgb(233, 236, 239)',
    hsl: 'hsl(210, 16%, 93%)',
    usage: '배경 구분',
    category: 'neutral',
    accessibilityLevel: 'AAA',
    contrastRatio: '1.9:1'
  },
  {
    name: 'Gray 100',
    id: 'gray-100',
    hexCode: '#F8F9FA',
    rgb: 'rgb(248, 249, 250)',
    hsl: 'hsl(210, 17%, 98%)',
    usage: '연한 배경, 페이지 배경',
    category: 'neutral',
    accessibilityLevel: 'AAA',
    contrastRatio: '1.1:1'
  },
  {
    name: 'White',
    id: 'white',
    hexCode: '#FFFFFF',
    rgb: 'rgb(255, 255, 255)',
    hsl: 'hsl(0, 0%, 100%)',
    usage: '기본 배경, 카드 배경',
    category: 'neutral',
    accessibilityLevel: 'AAA',
    contrastRatio: '1:1'
  }
];

// 강조 색상
export const emphasisColors = [
  {
    name: 'Electric Blue',
    id: 'electric-blue',
    hexCode: '#007BFF',
    rgb: 'rgb(0, 123, 255)',
    hsl: 'hsl(211, 100%, 50%)',
    usage: '하이퍼링크, 포커스 상태',
    category: 'emphasis',
    accessibilityLevel: 'AA',
    contrastRatio: '4.8:1'
  },
  {
    name: 'Vibrant Green',
    id: 'vibrant-green',
    hexCode: '#20C997',
    rgb: 'rgb(32, 201, 151)',
    hsl: 'hsl(162, 73%, 46%)',
    usage: '새로운 기능, 알림 배지',
    category: 'emphasis',
    accessibilityLevel: 'AA',
    contrastRatio: '4.2:1'
  }
];

// 그래픽 색상 (차트, 그래프용)
export const graphicColors = [
  {
    name: 'Chart Blue',
    id: 'chart-blue',
    hexCode: '#4285F4',
    rgb: 'rgb(66, 133, 244)',
    usage: '데이터 시각화 - 시리즈 1',
    category: 'graphic'
  },
  {
    name: 'Chart Green',
    id: 'chart-green',
    hexCode: '#34A853',
    rgb: 'rgb(52, 168, 83)',
    usage: '데이터 시각화 - 시리즈 2',
    category: 'graphic'
  },
  {
    name: 'Chart Orange',
    id: 'chart-orange',
    hexCode: '#FBBC04',
    rgb: 'rgb(251, 188, 4)',
    usage: '데이터 시각화 - 시리즈 3',
    category: 'graphic'
  },
  {
    name: 'Chart Red',
    id: 'chart-red',
    hexCode: '#EA4335',
    rgb: 'rgb(234, 67, 53)',
    usage: '데이터 시각화 - 시리즈 4',
    category: 'graphic'
  },
  {
    name: 'Chart Purple',
    id: 'chart-purple',
    hexCode: '#9C27B0',
    rgb: 'rgb(156, 39, 176)',
    usage: '데이터 시각화 - 시리즈 5',
    category: 'graphic'
  }
];

// 투명도 레벨
export const transparencyLevels = {
  '05': '0.05', // 5% 불투명도
  10: '0.10', // 10% 불투명도
  20: '0.20', // 20% 불투명도
  30: '0.30', // 30% 불투명도
  40: '0.40', // 40% 불투명도
  50: '0.50', // 50% 불투명도
  60: '0.60', // 60% 불투명도
  70: '0.70', // 70% 불투명도
  80: '0.80', // 80% 불투명도
  90: '0.90', // 90% 불투명도
  95: '0.95' // 95% 불투명도
};

// 다크모드 색상
export const darkModeColors = {
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    elevated: '#2D2D2D'
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    disabled: '#666666'
  },
  primary: {
    main: '#5AA3F0',
    dark: '#4A90E2'
  }
};

// 통합 색상 배열 (기존 호환성)
export const colors = [...primaryColors, ...systemColors, ...neutralColors, ...emphasisColors, ...graphicColors];

// 색상 유틸리티 함수
export const colorUtils = {
  // 카테고리별 색상 필터
  getColorsByCategory(category) {
    return colors.filter(color => color.category === category);
  },

  // ID로 색상 찾기
  findColorById(id) {
    return colors.find(color => color.id === id);
  },

  // 접근성 레벨별 색상 필터
  getColorsByAccessibility(level) {
    return colors.filter(color => color.accessibilityLevel === level);
  },

  // 사용 목적별 색상 검색
  searchColorsByUsage(query) {
    return colors.filter(color => color.usage && color.usage.toLowerCase().includes(query.toLowerCase()));
  },

  // 투명도 적용된 색상 생성
  getColorWithOpacity(colorId, opacity) {
    const color = this.findColorById(colorId);
    if (!color) {
      return null;
    }

    const hex = color.hexCode.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
};

// 색상 접근성 가이드라인
export const accessibilityGuidelines = {
  minimumContrast: {
    normal: '4.5:1', // WCAG AA
    large: '3:1', // WCAG AA (큰 텍스트)
    enhanced: '7:1' // WCAG AAA
  },

  colorBlindness: {
    avoidCombinations: [
      '빨강-초록 조합은 적록색약자가 구분하기 어려움',
      '파랑-보라 조합은 청황색약자가 구분하기 어려움'
    ],
    safePalette: ['파랑', '노랑', '검정', '흰색']
  },

  recommendations: [
    '색상만으로 정보를 전달하지 말 것',
    '텍스트와 아이콘을 함께 사용',
    '충분한 명도 대비 확보',
    '색상 의미의 일관성 유지'
  ]
};
