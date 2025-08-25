/**
 * KRDS 컴포넌트 데이터
 * 총 37개의 공식 KRDS 컴포넌트 정의
 */

export const components = [
  // Identity 컴포넌트
  {
    id: 'masthead',
    name: '마스트헤드 (Masthead)',
    category: 'identity',
    description: '정부 기관 식별을 위한 최상단 영역',
    usageGuidelines: [
      '페이지 최상단에 위치',
      '정부 로고와 기관명 포함 필수',
      '높이는 40px 고정',
      '배경색은 정부 표준 색상 사용'
    ],
    accessibilityNotes: '스크린리더를 위한 랜드마크 역할 설정 필요',
    codeExample: `<header role="banner" class="krds-masthead">
  <div class="krds-masthead__container">
    <a href="/" class="krds-masthead__logo">
      <img src="gov-logo.svg" alt="대한민국 정부" />
      <span class="krds-masthead__org-name">기관명</span>
    </a>
  </div>
</header>`,
    props: {
      logoSrc: '정부 로고 이미지 경로',
      orgName: '기관명',
      link: '홈페이지 링크'
    }
  },
  {
    id: 'identifier',
    name: '식별자 (Identifier)',
    category: 'identity',
    description: '정부 기관 및 서비스 식별 정보 표시',
    usageGuidelines: [
      '푸터 영역에 필수 포함',
      '기관 정보와 인증 마크 표시',
      '저작권 및 라이선스 정보 포함',
      '연락처 정보 제공'
    ],
    accessibilityNotes: 'contentinfo 랜드마크 역할 지정',
    codeExample: `<div class="krds-identifier">
  <div class="krds-identifier__logo">
    <img src="org-logo.svg" alt="기관 로고" />
  </div>
  <div class="krds-identifier__info">
    <p class="krds-identifier__name">기관명</p>
    <p class="krds-identifier__address">주소</p>
    <p class="krds-identifier__contact">대표전화: 000-0000-0000</p>
  </div>
</div>`
  },
  {
    id: 'header',
    name: '헤더 (Header)',
    category: 'identity',
    description: '서비스명과 주요 네비게이션을 포함하는 상단 영역',
    usageGuidelines: [
      '마스트헤드 바로 아래 위치',
      '서비스 로고와 이름 포함',
      '주 메뉴 네비게이션 포함',
      '검색 기능 제공 권장'
    ],
    accessibilityNotes: 'banner 랜드마크, 키보드 네비게이션 지원 필수',
    codeExample: `<header class="krds-header">
  <div class="krds-header__container">
    <h1 class="krds-header__service-name">서비스명</h1>
    <nav class="krds-header__nav" aria-label="주 메뉴">
      <ul>
        <li><a href="#">메뉴1</a></li>
        <li><a href="#">메뉴2</a></li>
      </ul>
    </nav>
  </div>
</header>`
  },
  {
    id: 'footer',
    name: '푸터 (Footer)',
    category: 'identity',
    description: '페이지 하단 정보 영역',
    usageGuidelines: [
      '페이지 최하단에 위치',
      '사이트맵 링크 제공',
      '정책 및 약관 링크 포함',
      '접근성 정보 제공'
    ],
    accessibilityNotes: 'contentinfo 랜드마크 역할 지정',
    codeExample: `<footer class="krds-footer" role="contentinfo">
  <div class="krds-footer__container">
    <nav class="krds-footer__nav">
      <ul>
        <li><a href="#">개인정보처리방침</a></li>
        <li><a href="#">이용약관</a></li>
        <li><a href="#">접근성 정책</a></li>
      </ul>
    </nav>
  </div>
</footer>`
  },

  // Navigation 컴포넌트
  {
    id: 'skip-link',
    name: '건너뛰기 링크 (Skip Link)',
    category: 'navigation',
    description: '키보드 사용자를 위한 주요 콘텐츠 바로가기 링크',
    usageGuidelines: [
      '페이지 최상단에 위치',
      '포커스 시에만 표시',
      '주 콘텐츠로 바로 이동',
      'Tab 키로 접근 가능'
    ],
    accessibilityNotes: '키보드 접근성 필수 요소',
    codeExample: `<a href="#main-content" class="krds-skip-link">
  본문 바로가기
</a>
<main id="main-content">
  <!-- 주요 콘텐츠 -->
</main>`
  },
  {
    id: 'main-menu',
    name: '주 메뉴 (Main Menu)',
    category: 'navigation',
    description: '사이트의 주요 네비게이션 메뉴',
    usageGuidelines: [
      '1단계 메뉴는 7개 이하 권장',
      '드롭다운 메뉴는 2단계까지',
      '현재 위치 표시 필수',
      '모바일 대응 햄버거 메뉴 제공'
    ],
    accessibilityNotes: 'aria-current로 현재 페이지 표시, 키보드 네비게이션 지원',
    codeExample: `<nav class="krds-main-menu" aria-label="주 메뉴">
  <button class="krds-main-menu__toggle" aria-expanded="false">
    <span class="sr-only">메뉴 열기</span>
  </button>
  <ul class="krds-main-menu__list">
    <li><a href="#" aria-current="page">현재 페이지</a></li>
    <li><a href="#">메뉴 항목</a></li>
  </ul>
</nav>`
  },
  {
    id: 'breadcrumb',
    name: '브레드크럼 (Breadcrumb)',
    category: 'navigation',
    description: '현재 페이지의 계층 구조 표시',
    usageGuidelines: [
      '홈 > 카테고리 > 현재 페이지 형식',
      '현재 페이지는 링크 제외',
      '화살표(>) 구분자 사용',
      '3단계 이상 시 생략(...) 사용 가능'
    ],
    accessibilityNotes: "aria-label='현재 위치' 추가, 구조화된 데이터 마크업",
    codeExample: `<nav aria-label="현재 위치" class="krds-breadcrumb">
  <ol>
    <li><a href="/">홈</a></li>
    <li><a href="/category">카테고리</a></li>
    <li aria-current="page">현재 페이지</li>
  </ol>
</nav>`
  },
  {
    id: 'side-navigation',
    name: '사이드 네비게이션 (Side Navigation)',
    category: 'navigation',
    description: '좌측 또는 우측 보조 메뉴',
    usageGuidelines: [
      '현재 섹션 내 하위 메뉴 표시',
      '계층 구조 시각적 표현',
      '현재 페이지 강조 표시',
      '접고 펼치기 기능 제공'
    ],
    accessibilityNotes: 'aria-expanded로 확장 상태 표시',
    codeExample: `<nav class="krds-side-nav" aria-label="섹션 메뉴">
  <ul>
    <li>
      <a href="#" aria-current="page">현재 페이지</a>
      <ul>
        <li><a href="#">하위 메뉴 1</a></li>
        <li><a href="#">하위 메뉴 2</a></li>
      </ul>
    </li>
  </ul>
</nav>`
  },
  {
    id: 'in-page-navigation',
    name: '페이지 내 네비게이션 (In-page Navigation)',
    category: 'navigation',
    description: '긴 페이지 내 섹션 이동 메뉴',
    usageGuidelines: [
      '스크롤 시 고정 위치 유지',
      '현재 섹션 자동 하이라이트',
      '부드러운 스크롤 애니메이션',
      '목차 형태로 구성'
    ],
    accessibilityNotes: '현재 섹션 aria-current 표시',
    codeExample: `<nav class="krds-in-page-nav" aria-label="페이지 내 이동">
  <h2>목차</h2>
  <ul>
    <li><a href="#section1">섹션 1</a></li>
    <li><a href="#section2" aria-current="true">섹션 2</a></li>
    <li><a href="#section3">섹션 3</a></li>
  </ul>
</nav>`
  },
  {
    id: 'pagination',
    name: '페이지네이션 (Pagination)',
    category: 'navigation',
    description: '여러 페이지로 나뉜 콘텐츠 탐색',
    usageGuidelines: [
      '현재 페이지 명확히 표시',
      '이전/다음 버튼 제공',
      '첫 페이지/마지막 페이지 링크',
      '페이지 번호 직접 입력 옵션'
    ],
    accessibilityNotes: 'aria-label로 페이지 번호 읽기, 현재 페이지 aria-current',
    codeExample: `<nav class="krds-pagination" aria-label="페이지 네비게이션">
  <ul>
    <li><a href="#" aria-label="이전 페이지">이전</a></li>
    <li><a href="#" aria-current="page">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#" aria-label="다음 페이지">다음</a></li>
  </ul>
</nav>`
  },
  {
    id: 'tab-bars',
    name: '탭 바 (Tab Bars)',
    category: 'navigation',
    description: '관련 콘텐츠 그룹 간 전환',
    usageGuidelines: [
      '2-5개 탭 권장',
      '현재 탭 시각적 구분',
      '탭 패널과 연결',
      '키보드 화살표 키 지원'
    ],
    accessibilityNotes: "role='tablist', aria-selected, aria-controls 사용",
    codeExample: `<div class="krds-tabs">
  <ul role="tablist">
    <li role="presentation">
      <button role="tab" aria-selected="true" aria-controls="panel1">탭 1</button>
    </li>
    <li role="presentation">
      <button role="tab" aria-selected="false" aria-controls="panel2">탭 2</button>
    </li>
  </ul>
  <div id="panel1" role="tabpanel">탭 1 내용</div>
  <div id="panel2" role="tabpanel" hidden>탭 2 내용</div>
</div>`
  },

  // Layout & Expression 컴포넌트
  {
    id: 'structured-list',
    name: '구조화된 목록 (Structured List)',
    category: 'layout-expression',
    description: '정보를 체계적으로 표시하는 목록',
    usageGuidelines: [
      '일관된 형식 유지',
      '시각적 계층 구조 표현',
      '관련 정보 그룹화',
      '적절한 여백과 구분선 사용'
    ],
    accessibilityNotes: '의미있는 HTML 구조 사용 (dl, dt, dd)',
    codeExample: `<dl class="krds-structured-list">
  <div class="krds-structured-list__item">
    <dt>항목명</dt>
    <dd>항목 설명</dd>
  </div>
  <div class="krds-structured-list__item">
    <dt>항목명 2</dt>
    <dd>항목 설명 2</dd>
  </div>
</dl>`
  },
  {
    id: 'critical-alerts',
    name: '중요 알림 (Critical Alerts)',
    category: 'layout-expression',
    description: '긴급하거나 중요한 정보 전달',
    usageGuidelines: [
      '페이지 상단에 표시',
      '명확한 색상 구분 (빨강/주황)',
      '아이콘과 함께 표시',
      '닫기 버튼 제공 (선택적)'
    ],
    accessibilityNotes: "role='alert', aria-live='assertive' 사용",
    codeExample: `<div class="krds-alert krds-alert--critical" role="alert" aria-live="assertive">
  <svg class="krds-alert__icon" aria-hidden="true"><!-- 경고 아이콘 --></svg>
  <div class="krds-alert__content">
    <h2 class="krds-alert__title">긴급 공지</h2>
    <p class="krds-alert__message">중요한 시스템 점검이 예정되어 있습니다.</p>
  </div>
  <button class="krds-alert__close" aria-label="알림 닫기">×</button>
</div>`
  },
  {
    id: 'calendar',
    name: '달력 (Calendar)',
    category: 'layout-expression',
    description: '날짜 선택 및 일정 표시',
    usageGuidelines: [
      '월 단위 기본 표시',
      '오늘 날짜 강조',
      '선택 가능/불가능 날짜 구분',
      '이전/다음 달 네비게이션'
    ],
    accessibilityNotes: '테이블 구조 사용, aria-label로 날짜 읽기',
    codeExample: `<div class="krds-calendar">
  <div class="krds-calendar__header">
    <button aria-label="이전 달">◀</button>
    <h2>2024년 1월</h2>
    <button aria-label="다음 달">▶</button>
  </div>
  <table class="krds-calendar__table">
    <thead>
      <tr>
        <th scope="col">일</th>
        <th scope="col">월</th>
        <!-- ... -->
      </tr>
    </thead>
    <tbody>
      <!-- 날짜 셀들 -->
    </tbody>
  </table>
</div>`
  },
  {
    id: 'disclosure',
    name: '공개/숨김 (Disclosure)',
    category: 'layout-expression',
    description: '콘텐츠를 접고 펼치는 기능',
    usageGuidelines: [
      '제목 클릭으로 토글',
      '화살표 아이콘으로 상태 표시',
      '부드러운 전환 애니메이션',
      '기본값 설정 가능 (열림/닫힘)'
    ],
    accessibilityNotes: 'aria-expanded, aria-controls 사용',
    codeExample: `<div class="krds-disclosure">
  <button class="krds-disclosure__trigger" 
          aria-expanded="false" 
          aria-controls="disclosure-content">
    <span>상세 정보 보기</span>
    <svg aria-hidden="true"><!-- 화살표 아이콘 --></svg>
  </button>
  <div id="disclosure-content" class="krds-disclosure__content" hidden>
    <!-- 숨겨진 콘텐츠 -->
  </div>
</div>`
  },
  {
    id: 'modal',
    name: '모달 (Modal)',
    category: 'layout-expression',
    description: '팝업 형태의 대화상자',
    usageGuidelines: ['배경 딤 처리', 'ESC 키로 닫기', '포커스 트랩 구현', '닫기 버튼 필수'],
    accessibilityNotes: "role='dialog', aria-modal='true', 포커스 관리",
    codeExample: `<div class="krds-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="krds-modal__overlay"></div>
  <div class="krds-modal__content">
    <h2 id="modal-title">모달 제목</h2>
    <div class="krds-modal__body">
      <!-- 모달 내용 -->
    </div>
    <button class="krds-modal__close" aria-label="닫기">×</button>
  </div>
</div>`
  },
  {
    id: 'badge',
    name: '배지 (Badge)',
    category: 'layout-expression',
    description: '상태나 수량을 표시하는 작은 레이블',
    usageGuidelines: [
      '간단한 텍스트나 숫자',
      '색상으로 의미 구분',
      '아이콘과 함께 사용 가능',
      '적절한 크기 유지'
    ],
    accessibilityNotes: '스크린리더를 위한 전체 텍스트 제공',
    codeExample: `<span class="krds-badge krds-badge--new">
  <span class="sr-only">새로운 항목</span>
  NEW
</span>
<span class="krds-badge krds-badge--count">
  <span class="sr-only">알림 5개</span>
  5
</span>`
  },
  {
    id: 'accordion',
    name: '아코디언 (Accordion)',
    category: 'layout-expression',
    description: '여러 섹션을 접고 펼치는 컴포넌트',
    usageGuidelines: [
      '한 번에 하나만 열기 옵션',
      '모두 닫힌 상태 허용',
      '섹션 제목 명확히 표시',
      '부드러운 전환 효과'
    ],
    accessibilityNotes: 'aria-expanded, aria-controls, 키보드 네비게이션',
    codeExample: `<div class="krds-accordion">
  <div class="krds-accordion__item">
    <h3>
      <button class="krds-accordion__trigger" 
              aria-expanded="false" 
              aria-controls="panel1">
        섹션 1
      </button>
    </h3>
    <div id="panel1" class="krds-accordion__panel" hidden>
      <!-- 패널 내용 -->
    </div>
  </div>
</div>`
  },
  {
    id: 'image',
    name: '이미지 (Image)',
    category: 'layout-expression',
    description: '반응형 이미지 표시',
    usageGuidelines: [
      '적절한 대체 텍스트 제공',
      '반응형 크기 조절',
      '레이지 로딩 적용',
      '캡션 제공 (필요시)'
    ],
    accessibilityNotes: "의미있는 alt 텍스트, 장식용은 alt=''",
    codeExample: `<figure class="krds-image">
  <img src="image.jpg" 
       alt="이미지 설명" 
       loading="lazy"
       class="krds-image__img">
  <figcaption class="krds-image__caption">이미지 캡션</figcaption>
</figure>`
  },
  {
    id: 'carousel',
    name: '캐러셀 (Carousel)',
    category: 'layout-expression',
    description: '여러 콘텐츠를 슬라이드로 표시',
    usageGuidelines: [
      '자동 재생 일시정지 버튼',
      '이전/다음 네비게이션',
      '인디케이터 표시',
      '키보드 접근 가능'
    ],
    accessibilityNotes: 'aria-live, 일시정지 기능 필수',
    codeExample: `<div class="krds-carousel" aria-label="이미지 슬라이드">
  <div class="krds-carousel__track" aria-live="polite">
    <div class="krds-carousel__slide" aria-hidden="false">슬라이드 1</div>
    <div class="krds-carousel__slide" aria-hidden="true">슬라이드 2</div>
  </div>
  <button class="krds-carousel__prev" aria-label="이전 슬라이드">◀</button>
  <button class="krds-carousel__next" aria-label="다음 슬라이드">▶</button>
  <button class="krds-carousel__pause" aria-label="일시정지">⏸</button>
</div>`
  },
  {
    id: 'tab',
    name: '탭 (Tab)',
    category: 'layout-expression',
    description: '콘텐츠를 탭으로 구분하여 표시',
    usageGuidelines: [
      '관련 콘텐츠 그룹화',
      '활성 탭 명확히 표시',
      '탭 패널 즉시 전환',
      '좌우 화살표 키 지원'
    ],
    accessibilityNotes: 'ARIA 탭 패턴 준수',
    codeExample: `<div class="krds-tab">
  <div role="tablist" aria-label="탭 메뉴">
    <button role="tab" aria-selected="true" aria-controls="tabpanel1">탭 1</button>
    <button role="tab" aria-selected="false" aria-controls="tabpanel2">탭 2</button>
  </div>
  <div id="tabpanel1" role="tabpanel">탭 1 내용</div>
  <div id="tabpanel2" role="tabpanel" hidden>탭 2 내용</div>
</div>`
  },
  {
    id: 'table',
    name: '테이블 (Table)',
    category: 'layout-expression',
    description: '구조화된 데이터 표시',
    usageGuidelines: [
      '명확한 헤더 제공',
      '반응형 스크롤 처리',
      '행/열 하이라이트',
      '정렬 기능 (선택적)'
    ],
    accessibilityNotes: 'scope 속성, caption 제공',
    codeExample: `<div class="krds-table-wrapper">
  <table class="krds-table">
    <caption>데이터 테이블 설명</caption>
    <thead>
      <tr>
        <th scope="col">제목 1</th>
        <th scope="col">제목 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>데이터 1</td>
        <td>데이터 2</td>
      </tr>
    </tbody>
  </table>
</div>`
  },
  {
    id: 'splash-screen',
    name: '스플래시 화면 (Splash Screen)',
    category: 'layout-expression',
    description: '앱/서비스 로딩 중 표시 화면',
    usageGuidelines: [
      '브랜드 로고 중앙 배치',
      '로딩 인디케이터 표시',
      '최소 표시 시간 설정',
      '부드러운 페이드 효과'
    ],
    accessibilityNotes: 'aria-live로 로딩 상태 알림',
    codeExample: `<div class="krds-splash" role="status" aria-live="polite">
  <div class="krds-splash__logo">
    <img src="logo.svg" alt="서비스 로고">
  </div>
  <div class="krds-splash__spinner">
    <span class="sr-only">로딩 중...</span>
  </div>
</div>`
  },
  {
    id: 'text-list',
    name: '텍스트 목록 (Text List)',
    category: 'layout-expression',
    description: '순서가 있거나 없는 텍스트 목록',
    usageGuidelines: [
      '적절한 들여쓰기',
      '일관된 불릿/번호 스타일',
      '중첩 목록 지원',
      '충분한 행간 확보'
    ],
    accessibilityNotes: '의미에 맞는 ol/ul 사용',
    codeExample: `<ul class="krds-list krds-list--bullet">
  <li>목록 항목 1</li>
  <li>목록 항목 2
    <ul>
      <li>하위 항목 1</li>
      <li>하위 항목 2</li>
    </ul>
  </li>
</ul>`
  },

  // Action 컴포넌트
  {
    id: 'link',
    name: '링크 (Link)',
    category: 'action',
    description: '페이지 이동 또는 앵커 링크',
    usageGuidelines: [
      '명확한 링크 텍스트',
      '밑줄 또는 색상 구분',
      '호버/포커스 상태 표시',
      '외부 링크 아이콘 표시'
    ],
    accessibilityNotes: '의미있는 링크 텍스트, 새 창 열기 알림',
    codeExample: `<a href="/page" class="krds-link">
  페이지 링크
</a>
<a href="https://external.com" 
   class="krds-link krds-link--external" 
   target="_blank" 
   rel="noopener">
  외부 링크
  <span class="sr-only">(새 창에서 열림)</span>
  <svg aria-hidden="true"><!-- 외부 링크 아이콘 --></svg>
</a>`
  },
  {
    id: 'button',
    name: '버튼 (Button)',
    category: 'action',
    description: '사용자 액션 트리거',
    usageGuidelines: [
      '명확한 레이블',
      'Primary/Secondary 구분',
      '적절한 크기 (최소 44px)',
      '비활성 상태 표시'
    ],
    accessibilityNotes: 'button 요소 사용, 상태 변화 알림',
    codeExample: `<button class="krds-button krds-button--primary">
  주요 액션
</button>
<button class="krds-button krds-button--secondary">
  보조 액션
</button>
<button class="krds-button" disabled>
  비활성 버튼
</button>`
  },

  // Selection 컴포넌트
  {
    id: 'radio-button',
    name: '라디오 버튼 (Radio Button)',
    category: 'selection',
    description: '단일 선택 옵션',
    usageGuidelines: [
      '2개 이상 옵션 제공',
      '기본 선택값 설정',
      '그룹 레이블 필수',
      '충분한 터치 영역'
    ],
    accessibilityNotes: 'fieldset/legend 사용, 그룹화',
    codeExample: `<fieldset class="krds-radio-group">
  <legend>선택 옵션</legend>
  <div class="krds-radio">
    <input type="radio" id="radio1" name="options" value="1" checked>
    <label for="radio1">옵션 1</label>
  </div>
  <div class="krds-radio">
    <input type="radio" id="radio2" name="options" value="2">
    <label for="radio2">옵션 2</label>
  </div>
</fieldset>`
  },
  {
    id: 'checkbox',
    name: '체크박스 (Checkbox)',
    category: 'selection',
    description: '다중 선택 옵션',
    usageGuidelines: [
      '독립적 선택 가능',
      '전체 선택 옵션 제공',
      '명확한 레이블',
      '충분한 클릭 영역'
    ],
    accessibilityNotes: 'label과 연결, 상태 변화 감지',
    codeExample: `<div class="krds-checkbox">
  <input type="checkbox" id="check1">
  <label for="check1">동의합니다</label>
</div>
<div class="krds-checkbox">
  <input type="checkbox" id="check2" checked>
  <label for="check2">선택된 항목</label>
</div>`
  },
  {
    id: 'select',
    name: '셀렉트 (Select)',
    category: 'selection',
    description: '드롭다운 선택 메뉴',
    usageGuidelines: [
      '기본값 또는 플레이스홀더',
      '옵션 그룹화 지원',
      '검색 기능 (많은 옵션 시)',
      '키보드 네비게이션'
    ],
    accessibilityNotes: 'label 연결, optgroup 사용',
    codeExample: `<div class="krds-select">
  <label for="select1">선택하세요</label>
  <select id="select1" class="krds-select__control">
    <option value="">선택...</option>
    <optgroup label="그룹 1">
      <option value="1">옵션 1</option>
      <option value="2">옵션 2</option>
    </optgroup>
  </select>
</div>`
  },
  {
    id: 'tag',
    name: '태그 (Tag)',
    category: 'selection',
    description: '카테고리나 필터 표시/선택',
    usageGuidelines: ['제거 가능 옵션', '색상/아이콘 구분', '선택/비선택 상태', '그룹으로 표시'],
    accessibilityNotes: '삭제 버튼 레이블, 선택 상태 알림',
    codeExample: `<div class="krds-tag" role="group" aria-label="선택된 태그">
  <span class="krds-tag__item">
    태그 1
    <button class="krds-tag__remove" aria-label="태그 1 제거">×</button>
  </span>
  <span class="krds-tag__item">
    태그 2
    <button class="krds-tag__remove" aria-label="태그 2 제거">×</button>
  </span>
</div>`
  },
  {
    id: 'toggle-switch',
    name: '토글 스위치 (Toggle Switch)',
    category: 'selection',
    description: '켜기/끄기 상태 전환',
    usageGuidelines: [
      '즉시 적용되는 설정',
      '명확한 온/오프 상태',
      '레이블 위치 일관성',
      '상태 텍스트 표시 (선택적)'
    ],
    accessibilityNotes: "role='switch', aria-checked 사용",
    codeExample: `<div class="krds-toggle">
  <input type="checkbox" 
         id="toggle1" 
         class="krds-toggle__input"
         role="switch"
         aria-checked="false">
  <label for="toggle1" class="krds-toggle__label">
    <span class="krds-toggle__text">알림 설정</span>
    <span class="krds-toggle__switch"></span>
  </label>
</div>`
  },

  // Feedback 컴포넌트
  {
    id: 'step-indicator',
    name: '단계 표시기 (Step Indicator)',
    category: 'feedback',
    description: '프로세스 진행 상황 표시',
    usageGuidelines: [
      '현재 단계 강조',
      '완료/진행중/대기 구분',
      '단계 이름 표시',
      '클릭 가능 여부 명시'
    ],
    accessibilityNotes: "aria-current='step', 진행률 알림",
    codeExample: `<ol class="krds-steps" aria-label="진행 단계">
  <li class="krds-steps__item krds-steps__item--completed">
    <span class="krds-steps__number">1</span>
    <span class="krds-steps__label">완료됨</span>
  </li>
  <li class="krds-steps__item krds-steps__item--current" aria-current="step">
    <span class="krds-steps__number">2</span>
    <span class="krds-steps__label">진행 중</span>
  </li>
  <li class="krds-steps__item">
    <span class="krds-steps__number">3</span>
    <span class="krds-steps__label">대기</span>
  </li>
</ol>`
  },
  {
    id: 'spinner',
    name: '스피너 (Spinner)',
    category: 'feedback',
    description: '로딩 상태 표시',
    usageGuidelines: [
      '적절한 크기 선택',
      '로딩 텍스트 함께 표시',
      '배경 오버레이 (선택적)',
      '타임아웃 처리'
    ],
    accessibilityNotes: "role='status', aria-live='polite'",
    codeExample: `<div class="krds-spinner" role="status" aria-live="polite">
  <svg class="krds-spinner__icon" aria-hidden="true">
    <!-- 스피너 애니메이션 -->
  </svg>
  <span class="krds-spinner__text">처리 중입니다...</span>
</div>`
  },

  // Help 컴포넌트
  {
    id: 'help-panel',
    name: '도움말 패널 (Help Panel)',
    category: 'help',
    description: '상세한 도움말 정보 제공',
    usageGuidelines: ['사이드 패널로 표시', '관련 콘텐츠 링크', '검색 기능 제공', '닫기 버튼 포함'],
    accessibilityNotes: '랜드마크 역할, 키보드 접근',
    codeExample: `<aside class="krds-help-panel" aria-label="도움말">
  <div class="krds-help-panel__header">
    <h2>도움말</h2>
    <button class="krds-help-panel__close" aria-label="도움말 닫기">×</button>
  </div>
  <div class="krds-help-panel__content">
    <!-- 도움말 내용 -->
  </div>
</aside>`
  },
  {
    id: 'tutorial-panel',
    name: '튜토리얼 패널 (Tutorial Panel)',
    category: 'help',
    description: '단계별 사용 안내',
    usageGuidelines: ['순차적 진행', '건너뛰기 옵션', '진행 표시기', '이전/다음 네비게이션'],
    accessibilityNotes: '단계 정보 제공, 포커스 관리',
    codeExample: `<div class="krds-tutorial" role="dialog" aria-label="튜토리얼">
  <div class="krds-tutorial__step">
    <h3>1단계: 시작하기</h3>
    <p>튜토리얼 내용...</p>
  </div>
  <div class="krds-tutorial__nav">
    <button>이전</button>
    <span>1 / 5</span>
    <button>다음</button>
    <button>건너뛰기</button>
  </div>
</div>`
  },
  {
    id: 'contextual-help',
    name: '문맥 도움말 (Contextual Help)',
    category: 'help',
    description: '특정 요소에 대한 즉각적 도움말',
    usageGuidelines: [
      '물음표 아이콘 사용',
      '클릭/호버로 표시',
      '간단명료한 설명',
      '링크 제공 (상세 정보)'
    ],
    accessibilityNotes: 'aria-describedby 연결',
    codeExample: `<div class="krds-field">
  <label for="input1">
    입력 필드
    <button class="krds-help-icon" 
            aria-label="도움말" 
            aria-describedby="help1">?</button>
  </label>
  <input type="text" id="input1">
  <div id="help1" class="krds-help-text" role="tooltip">
    이 필드에 대한 설명입니다.
  </div>
</div>`
  },
  {
    id: 'coach-mark',
    name: '코치 마크 (Coach Mark)',
    category: 'help',
    description: '새 기능이나 중요 요소 강조',
    usageGuidelines: ['첫 방문 시 표시', '말풍선 형태', '순차적 표시 가능', '다시 보지 않기 옵션'],
    accessibilityNotes: '포커스 이동, 닫기 가능',
    codeExample: `<div class="krds-coach-mark" role="tooltip">
  <div class="krds-coach-mark__arrow"></div>
  <div class="krds-coach-mark__content">
    <p>새로운 기능을 확인해보세요!</p>
    <button class="krds-coach-mark__close">확인</button>
  </div>
</div>`
  },
  {
    id: 'tooltip',
    name: '툴팁 (Tooltip)',
    category: 'help',
    description: '추가 정보를 간단히 표시',
    usageGuidelines: ['호버/포커스 시 표시', '짧은 텍스트만', '자동 위치 조정', '지연 시간 설정'],
    accessibilityNotes: "role='tooltip', aria-describedby",
    codeExample: `<button class="krds-button" 
        aria-describedby="tooltip1">
  버튼
</button>
<div id="tooltip1" 
     role="tooltip" 
     class="krds-tooltip">
  버튼 설명
</div>`
  },

  // Input 컴포넌트
  {
    id: 'date-input',
    name: '날짜 입력 (Date Input)',
    category: 'input',
    description: '날짜 선택 입력 필드',
    usageGuidelines: ['달력 위젯 제공', '직접 입력 가능', '형식 안내 표시', '유효성 검사'],
    accessibilityNotes: '날짜 형식 설명, 달력 키보드 접근',
    codeExample: `<div class="krds-date-input">
  <label for="date1">날짜 선택</label>
  <input type="date" 
         id="date1" 
         class="krds-date-input__field"
         aria-describedby="date1-format">
  <span id="date1-format" class="krds-date-input__format">
    YYYY-MM-DD 형식
  </span>
</div>`
  },
  {
    id: 'textarea',
    name: '텍스트영역 (Textarea)',
    category: 'input',
    description: '여러 줄 텍스트 입력',
    usageGuidelines: [
      '크기 조절 가능',
      '글자 수 표시',
      '자동 높이 조절 (선택적)',
      '최대 길이 제한'
    ],
    accessibilityNotes: 'label 연결, 글자 수 실시간 알림',
    codeExample: `<div class="krds-textarea">
  <label for="textarea1">내용 입력</label>
  <textarea id="textarea1" 
            class="krds-textarea__field"
            maxlength="500"
            aria-describedby="textarea1-count"></textarea>
  <span id="textarea1-count" class="krds-textarea__count">
    0 / 500
  </span>
</div>`
  },
  {
    id: 'text-input',
    name: '텍스트 입력 (Text Input)',
    category: 'input',
    description: '한 줄 텍스트 입력 필드',
    usageGuidelines: [
      '적절한 타입 지정',
      '플레이스홀더 제공',
      '유효성 검사 피드백',
      '필수 항목 표시'
    ],
    accessibilityNotes: 'label 필수, 오류 메시지 연결',
    codeExample: `<div class="krds-input">
  <label for="text1" class="krds-input__label">
    이름 <span class="krds-input__required">*</span>
  </label>
  <input type="text" 
         id="text1" 
         class="krds-input__field"
         required
         aria-describedby="text1-error">
  <span id="text1-error" class="krds-input__error" role="alert">
    필수 입력 항목입니다
  </span>
</div>`
  },
  {
    id: 'file-upload',
    name: '파일 업로드 (File Upload)',
    category: 'input',
    description: '파일 선택 및 업로드',
    usageGuidelines: [
      '드래그 앤 드롭 지원',
      '파일 형식 제한 표시',
      '파일 크기 제한 안내',
      '업로드 진행률 표시'
    ],
    accessibilityNotes: '파일 정보 읽기, 진행 상태 알림',
    codeExample: `<div class="krds-file-upload">
  <label for="file1" class="krds-file-upload__label">
    파일 선택
  </label>
  <input type="file" 
         id="file1" 
         class="krds-file-upload__input"
         accept=".pdf,.doc,.docx"
         aria-describedby="file1-info">
  <span id="file1-info" class="krds-file-upload__info">
    PDF, DOC, DOCX (최대 10MB)
  </span>
  <div class="krds-file-upload__list">
    <!-- 선택된 파일 목록 -->
  </div>
</div>`
  },

  // Settings 컴포넌트
  {
    id: 'language-switcher',
    name: '언어 전환 (Language Switcher)',
    category: 'settings',
    description: '다국어 전환 선택',
    usageGuidelines: ['현재 언어 표시', '지원 언어 목록', '국기 아이콘 (선택적)', '즉시 적용'],
    accessibilityNotes: '현재 언어 알림, 언어 변경 확인',
    codeExample: `<div class="krds-language-switcher">
  <button class="krds-language-switcher__trigger" 
          aria-label="언어 선택" 
          aria-expanded="false">
    <span>한국어</span>
    <svg aria-hidden="true"><!-- 화살표 --></svg>
  </button>
  <ul class="krds-language-switcher__list" hidden>
    <li><button lang="ko" aria-current="true">한국어</button></li>
    <li><button lang="en">English</button></li>
    <li><button lang="zh">中文</button></li>
  </ul>
</div>`
  },
  {
    id: 'resize',
    name: '크기 조절 (Resize)',
    category: 'settings',
    description: '글자 크기 조절 기능',
    usageGuidelines: [
      '3-5단계 크기 제공',
      '현재 크기 표시',
      '초기화 버튼',
      '쿠키/로컬스토리지 저장'
    ],
    accessibilityNotes: '현재 크기 상태 알림',
    codeExample: `<div class="krds-resize" role="group" aria-label="글자 크기 조절">
  <button class="krds-resize__decrease" aria-label="글자 작게">A-</button>
  <button class="krds-resize__reset" aria-label="기본 크기">A</button>
  <button class="krds-resize__increase" aria-label="글자 크게">A+</button>
  <span class="sr-only">현재 크기: 보통</span>
</div>`
  },

  // Content 컴포넌트
  {
    id: 'accessible-multimedia',
    name: '접근 가능한 멀티미디어 (Accessible Multimedia)',
    category: 'content',
    description: '비디오/오디오 콘텐츠',
    usageGuidelines: ['자막 제공', '수어 통역 (선택적)', '대체 텍스트 제공', '키보드 컨트롤'],
    accessibilityNotes: '자막, 오디오 설명, 키보드 접근',
    codeExample: `<div class="krds-media">
  <video class="krds-media__video" controls>
    <source src="video.mp4" type="video/mp4">
    <track kind="captions" src="captions.vtt" srclang="ko" label="한국어 자막">
    <p>브라우저가 비디오를 지원하지 않습니다.</p>
  </video>
  <div class="krds-media__transcript">
    <details>
      <summary>대체 텍스트 보기</summary>
      <p>비디오 내용 텍스트...</p>
    </details>
  </div>
</div>`
  },
  {
    id: 'hidden-content',
    name: '숨김 콘텐츠 (Hidden Content)',
    category: 'content',
    description: '스크린리더 전용 콘텐츠',
    usageGuidelines: [
      '시각적으로 숨김',
      '스크린리더는 읽기 가능',
      '중요 정보 제공',
      '건너뛰기 링크 등'
    ],
    accessibilityNotes: 'sr-only 클래스 사용',
    codeExample: `<span class="sr-only">
  스크린리더 사용자를 위한 추가 정보
</span>
<div aria-hidden="true">
  <!-- 장식용 요소 (스크린리더 무시) -->
</div>`
  }
];

// 카테고리별 컴포넌트 그룹화 헬퍼
export const componentsByCategory = {
  identity: components.filter(c => c.category === 'identity'),
  navigation: components.filter(c => c.category === 'navigation'),
  'layout-expression': components.filter(c => c.category === 'layout-expression'),
  action: components.filter(c => c.category === 'action'),
  selection: components.filter(c => c.category === 'selection'),
  feedback: components.filter(c => c.category === 'feedback'),
  help: components.filter(c => c.category === 'help'),
  input: components.filter(c => c.category === 'input'),
  settings: components.filter(c => c.category === 'settings'),
  content: components.filter(c => c.category === 'content')
};

// 컴포넌트 검색 헬퍼
export function findComponent(query) {
  const lowerQuery = query.toLowerCase();
  return components.filter(
    c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.id.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery)
  );
}

// 컴포넌트 통계
export const componentStats = {
  total: components.length,
  byCategory: Object.entries(componentsByCategory).map(([category, items]) => ({
    category,
    count: items.length
  }))
};
