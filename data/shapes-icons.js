/**
 * KRDS Shape & Icons 데이터
 * 한국 정부 디지털 서비스의 표준 Shape 및 Icons 체계
 */

// 둥근 모서리 (Border Radius) 시스템
export const borderRadius = {
  none: '0',
  xs: '2px',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px' // 완전한 원형
};

// Shape 가이드라인
export const shapeGuidelines = {
  buttons: {
    primary: borderRadius.md,
    secondary: borderRadius.md,
    text: borderRadius.sm
  },
  cards: {
    default: borderRadius.lg,
    compact: borderRadius.md,
    featured: borderRadius.xl
  },
  inputs: {
    text: borderRadius.sm,
    select: borderRadius.sm,
    textarea: borderRadius.md
  },
  modal: {
    dialog: borderRadius.xl,
    alert: borderRadius.lg
  },
  badges: {
    pill: borderRadius.full,
    square: borderRadius.sm
  },
  images: {
    avatar: borderRadius.full,
    thumbnail: borderRadius.md,
    hero: borderRadius.xl
  }
};

// 그림자 (Elevation) 시스템
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // 컴포넌트별 그림자
  button: {
    default: 'none',
    hover: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    active: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    focus: '0 0 0 3px rgba(15, 76, 140, 0.1)'
  },
  card: {
    flat: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    floating: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  modal: {
    backdrop: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    dialog: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  dropdown: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  tooltip: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
};

// 아이콘 시스템
export const iconSizes = {
  xs: '12px',
  sm: '16px',
  base: '20px',
  md: '24px',
  lg: '32px',
  xl: '40px',
  '2xl': '48px',
  '3xl': '64px'
};

// 아이콘 카테고리
export const iconCategories = {
  // 시스템 아이콘
  system: [
    {
      id: 'home',
      name: '홈',
      description: '홈페이지, 메인화면',
      usage: '주 메뉴, 브레드크럼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'search',
      name: '검색',
      description: '검색 기능',
      usage: '검색창, 검색 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
        <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'menu',
      name: '메뉴',
      description: '햄버거 메뉴',
      usage: '모바일 메뉴 토글',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="4" x2="20" y1="6" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="4" x2="20" y1="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="4" x2="20" y1="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'close',
      name: '닫기',
      description: '모달, 팝업 닫기',
      usage: '닫기 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m18 6-12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m6 6 12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'arrow-right',
      name: '오른쪽 화살표',
      description: '다음, 진행',
      usage: '버튼, 네비게이션',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'arrow-left',
      name: '왼쪽 화살표',
      description: '이전, 뒤로가기',
      usage: '뒤로가기 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'arrow-down',
      name: '아래쪽 화살표',
      description: '드롭다운, 확장',
      usage: '셀렉트박스, 아코디언',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'arrow-up',
      name: '위쪽 화살표',
      description: '접기, 상단으로',
      usage: '아코디언, TOP 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m18 15-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    }
  ],

  // 상태 아이콘
  status: [
    {
      id: 'check',
      name: '체크',
      description: '완료, 성공',
      usage: '성공 메시지, 체크박스',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'alert-circle',
      name: '경고 원형',
      description: '주의, 경고',
      usage: '경고 메시지',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <line x1="12" x2="12" y1="8" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" x2="12.01" y1="16" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'info',
      name: '정보',
      description: '안내, 정보 제공',
      usage: '정보 메시지',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="m12 16v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'x-circle',
      name: '오류 원형',
      description: '오류, 실패',
      usage: '에러 메시지',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="m15 9-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m9 9 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'loading',
      name: '로딩',
      description: '처리 중, 로딩',
      usage: '스피너, 진행 상태',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12a9 9 0 11-6.219-8.56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    }
  ],

  // 액션 아이콘
  action: [
    {
      id: 'plus',
      name: '추가',
      description: '새로 추가',
      usage: '추가 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'edit',
      name: '편집',
      description: '수정, 편집',
      usage: '편집 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'trash',
      name: '삭제',
      description: '삭제, 제거',
      usage: '삭제 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m3 6 18 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'download',
      name: '다운로드',
      description: '파일 다운로드',
      usage: '다운로드 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" x2="12" y1="15" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'upload',
      name: '업로드',
      description: '파일 업로드',
      usage: '업로드 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="17,8 12,3 7,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" x2="12" y1="3" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'print',
      name: '프린트',
      description: '인쇄',
      usage: '인쇄 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="6,9 6,2 18,2 18,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect width="12" height="6" x="6" y="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'share',
      name: '공유',
      description: '공유하기',
      usage: '공유 버튼',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/>
        <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/>
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" stroke="currentColor" stroke-width="2"/>
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" stroke="currentColor" stroke-width="2"/>
      </svg>`
    }
  ],

  // 통신 아이콘
  communication: [
    {
      id: 'phone',
      name: '전화',
      description: '전화 연결',
      usage: '연락처, 고객센터',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'mail',
      name: '이메일',
      description: '이메일 전송',
      usage: '문의하기, 연락처',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="16" x="2" y="4" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m22 7-10 5L2 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'message-circle',
      name: '메시지',
      description: '채팅, 상담',
      usage: '실시간 상담',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m3 20.29 1.71-1.71A9.09 9.09 0 0 0 21 12a9 9 0 1 0-9 9c2.33 0 4.53-.88 6.24-2.58L20.29 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    }
  ],

  // 파일 아이콘
  file: [
    {
      id: 'file-text',
      name: '텍스트 파일',
      description: '문서 파일',
      usage: '파일 목록',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="16" x2="8" y1="13" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="16" x2="8" y1="17" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="10" x2="8" y1="9" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'image',
      name: '이미지',
      description: '이미지 파일',
      usage: '이미지 업로드',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
        <circle cx="9" cy="9" r="2" stroke="currentColor" stroke-width="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'paperclip',
      name: '첨부파일',
      description: '파일 첨부',
      usage: '첨부파일',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    }
  ],

  // 정부 특화 아이콘
  government: [
    {
      id: 'government',
      name: '정부청사',
      description: '정부 기관',
      usage: '기관 식별',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 21V7l8-4v18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 21V11l-6-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 9v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 12v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 15v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 18v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'shield',
      name: '보안',
      description: '보안, 개인정보 보호',
      usage: '보안 안내',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'certificate',
      name: '인증서',
      description: '공인인증서, 인증',
      usage: '로그인, 인증',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="5" stroke="currentColor" stroke-width="2"/>
        <path d="m9 21 3-3 3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 21h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      id: 'document',
      name: '공문서',
      description: '공식 문서',
      usage: '법령, 공고',
      svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="10" cy="13" r="2" stroke="currentColor" stroke-width="2"/>
        <path d="m16 19-2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    }
  ]
};

// 아이콘 사용 가이드라인
export const iconGuidelines = {
  sizing: {
    touch: '최소 44px 터치 영역',
    inline: '텍스트와 같은 라인에서는 16-20px',
    button: '버튼 내부에서는 16-24px',
    navigation: '네비게이션에서는 24-32px'
  },

  color: {
    default: 'currentColor 사용 권장',
    interactive: '호버/포커스 시 색상 변화',
    status: '의미에 따른 색상 (빨강=오류, 초록=성공)',
    disabled: '50% 투명도 적용'
  },

  accessibility: {
    altText: '스크린리더를 위한 대체 텍스트 필수',
    focusable: '인터랙티브 아이콘은 키보드 접근 가능',
    context: '아이콘만으로 의미 전달 금지, 텍스트 라벨 병행'
  },

  consistency: [
    '동일한 의미는 동일한 아이콘 사용',
    '스트로크 두께 일관성 유지 (2px 권장)',
    '라운드 캡 스타일 사용',
    '24x24 기준 그리드에서 디자인'
  ]
};

// 아이콘 스트로크 설정
export const iconStrokes = {
  thin: '1px',
  regular: '1.5px',
  medium: '2px', // 기본값
  thick: '2.5px',
  bold: '3px'
};

// 아이콘 유틸리티 함수
export const iconUtils = {
  // 카테고리별 아이콘 조회
  getIconsByCategory(category) {
    return iconCategories[category] || [];
  },

  // 아이콘 검색
  searchIcons(query) {
    const allIcons = Object.values(iconCategories).flat();
    return allIcons.filter(
      icon => icon.name.includes(query) || icon.description.includes(query) || icon.usage.includes(query)
    );
  },

  // 아이콘 ID로 찾기
  findIconById(id) {
    const allIcons = Object.values(iconCategories).flat();
    return allIcons.find(icon => icon.id === id);
  },

  // SVG 아이콘 컴포넌트 생성
  generateIconComponent(iconId, size = 'base', color = 'currentColor') {
    const icon = this.findIconById(iconId);
    if (!icon) {
      return null;
    }

    const sizeValue = iconSizes[size] || size;

    return {
      id: iconId,
      name: icon.name,
      svg: icon.svg,
      size: sizeValue,
      color,
      className: `krds-icon krds-icon-${iconId}`,
      ariaLabel: icon.name
    };
  }
};

// 통합 export
export const shapes = {
  borderRadius,
  shapeGuidelines,
  shadows
};

export const icons = {
  sizes: iconSizes,
  categories: iconCategories,
  guidelines: iconGuidelines,
  strokes: iconStrokes,
  utils: iconUtils
};
