/**
 * KRDS 서비스 패턴 데이터
 * 총 5개의 서비스별 패턴 정의
 */

export const servicePatterns = [
  {
    id: 'visit',
    name: '방문 (Visit)',
    category: 'service',
    description: '사용자가 디지털 서비스와 처음 상호작용하는 지점',
    purpose: '서비스 진입점 제공 및 첫인상 형성',
    keyGuideline: '대부분의 사용자는 구체적인 맥락 없이 서비스를 방문하게 되므로 명확하고 간결하게 구성되어야 한다',
    components: ['header', 'main-menu', 'carousel', 'button', 'link'],
    flow: ['서비스 식별', '주요 기능 파악', '탐색 시작', '원하는 작업 선택'],
    usageGuidelines: [
      '서비스 목적 명확히 전달',
      '주요 작업 즉시 접근 가능',
      '시각적 계층 구조 활용',
      '신규 사용자 안내 제공'
    ],
    accessibilityNotes: '명확한 랜드마크, 키보드 네비게이션 지원',
    examples: ['홈페이지 메인', '서비스 랜딩 페이지', '포털 대시보드'],
    implementationSteps: [
      '브랜드 아이덴티티 표시',
      '주요 서비스 메뉴 구성',
      '핵심 기능 바로가기 배치',
      '공지사항 및 새소식 영역',
      '자주 찾는 서비스 섹션'
    ],
    codeExample: `<div class="krds-pattern-visit">
  <!-- 마스트헤드 -->
  <header class="krds-masthead" role="banner">
    <div class="krds-masthead__container">
      <img src="gov-logo.svg" alt="대한민국 정부">
      <span class="krds-masthead__org">기관명</span>
    </div>
  </header>
  
  <!-- 헤더 및 주 메뉴 -->
  <header class="krds-header">
    <h1 class="krds-service-name">서비스명</h1>
    <nav class="krds-main-menu" aria-label="주 메뉴">
      <ul>
        <li><a href="#services">주요 서비스</a></li>
        <li><a href="#info">정보 마당</a></li>
        <li><a href="#support">고객 지원</a></li>
      </ul>
    </nav>
  </header>
  
  <!-- 메인 콘텐츠 -->
  <main class="krds-main">
    <!-- 비주얼 배너 -->
    <section class="krds-hero">
      <h2>국민과 함께하는 디지털 정부</h2>
      <p>쉽고 빠른 온라인 민원 서비스</p>
      <a href="#start" class="krds-button-primary">서비스 시작하기</a>
    </section>
    
    <!-- 주요 서비스 -->
    <section class="krds-quick-services">
      <h2>자주 찾는 서비스</h2>
      <div class="krds-service-grid">
        <a href="#" class="krds-service-card">
          <svg class="krds-service-icon"><!-- 아이콘 --></svg>
          <span>민원 신청</span>
        </a>
        <a href="#" class="krds-service-card">
          <svg class="krds-service-icon"><!-- 아이콘 --></svg>
          <span>진행 상황 조회</span>
        </a>
        <a href="#" class="krds-service-card">
          <svg class="krds-service-icon"><!-- 아이콘 --></svg>
          <span>증명서 발급</span>
        </a>
      </div>
    </section>
    
    <!-- 공지사항 -->
    <section class="krds-notices">
      <h2>공지사항</h2>
      <ul class="krds-notice-list">
        <li>
          <a href="#">시스템 점검 안내</a>
          <time>2024.01.15</time>
        </li>
        <li>
          <a href="#">신규 서비스 오픈</a>
          <time>2024.01.10</time>
        </li>
      </ul>
    </section>
  </main>
</div>`,
    metrics: {
      bounceRate: '방문 후 즉시 이탈률',
      clickThrough: '주요 서비스 클릭률',
      timeToAction: '첫 행동까지 소요 시간'
    }
  },

  {
    id: 'search',
    name: '검색 (Search)',
    category: 'service',
    description: '대량의 데이터에서 사용자가 원하는 정보를 찾도록 지원',
    purpose: '효율적인 정보 탐색 및 발견',
    keyGuideline:
      '사용자가 찾고자 하는 것을 알 때 주요 탐색 방법이며, 직접적인 콘텐츠를 찾지 못할 때 맥락적 단서를 제공한다',
    components: ['text-input', 'button', 'select', 'tag', 'structured-list', 'pagination'],
    flow: ['검색어 입력', '검색 실행', '결과 표시', '결과 정제', '상세 보기'],
    usageGuidelines: [
      '자동완성 기능 제공',
      '검색 필터 옵션',
      '검색어 하이라이트',
      '연관 검색어 제시',
      "'결과 없음' 시 대안 제공"
    ],
    accessibilityNotes: '검색 결과 수 알림, 필터 상태 안내',
    examples: ['통합 검색', '민원 검색', '법령 검색', '자료실 검색'],
    implementationSteps: [
      '검색창 배치 및 디자인',
      '실시간 검색어 제안',
      '검색 결과 레이아웃',
      '필터 및 정렬 옵션',
      '검색 히스토리 관리'
    ],
    codeExample: `<div class="krds-pattern-search">
  <!-- 검색 폼 -->
  <form class="krds-search-form" role="search">
    <div class="krds-search-input-group">
      <label for="search" class="sr-only">검색어 입력</label>
      <input type="search" 
             id="search" 
             class="krds-search-input"
             placeholder="검색어를 입력하세요"
             aria-describedby="search-help"
             autocomplete="off">
      
      <!-- 자동완성 -->
      <div class="krds-search-autocomplete" hidden>
        <ul role="listbox">
          <li role="option">검색 제안 1</li>
          <li role="option">검색 제안 2</li>
        </ul>
      </div>
      
      <button type="submit" class="krds-search-button">
        <svg aria-hidden="true"><!-- 검색 아이콘 --></svg>
        <span>검색</span>
      </button>
    </div>
    
    <div id="search-help" class="krds-search-help">
      띄어쓰기로 여러 단어를 검색할 수 있습니다
    </div>
  </form>
  
  <!-- 검색 필터 -->
  <div class="krds-search-filters">
    <h2 class="sr-only">검색 필터</h2>
    
    <div class="krds-filter-group">
      <label for="category">분류</label>
      <select id="category">
        <option>전체</option>
        <option>공지사항</option>
        <option>자료실</option>
        <option>FAQ</option>
      </select>
    </div>
    
    <div class="krds-filter-group">
      <label for="period">기간</label>
      <select id="period">
        <option>전체</option>
        <option>1주일</option>
        <option>1개월</option>
        <option>1년</option>
      </select>
    </div>
    
    <div class="krds-filter-group">
      <label for="sort">정렬</label>
      <select id="sort">
        <option>정확도순</option>
        <option>최신순</option>
        <option>조회순</option>
      </select>
    </div>
  </div>
  
  <!-- 검색 결과 -->
  <div class="krds-search-results">
    <div class="krds-search-summary" aria-live="polite">
      <h2>"<mark>검색어</mark>"에 대한 검색 결과</h2>
      <p>총 <strong>123건</strong>이 검색되었습니다.</p>
    </div>
    
    <ol class="krds-search-list">
      <li class="krds-search-item">
        <h3>
          <a href="#">검색 결과 제목에 <mark>검색어</mark> 포함</a>
        </h3>
        <p class="krds-search-snippet">
          검색 결과 본문 미리보기에 <mark>검색어</mark>가 
          하이라이트되어 표시됩니다...
        </p>
        <div class="krds-search-meta">
          <span class="krds-search-category">공지사항</span>
          <time>2024.01.15</time>
          <span class="krds-search-views">조회 150</span>
        </div>
      </li>
    </ol>
    
    <!-- 페이지네이션 -->
    <nav class="krds-pagination" aria-label="검색 결과 페이지">
      <ul>
        <li><a href="#" aria-current="page">1</a></li>
        <li><a href="#">2</a></li>
        <li><a href="#">3</a></li>
      </ul>
    </nav>
  </div>
  
  <!-- 결과 없음 -->
  <div class="krds-search-no-results" hidden>
    <svg class="krds-no-results-icon"><!-- 아이콘 --></svg>
    <h2>검색 결과가 없습니다</h2>
    <p>다른 검색어를 입력하거나 아래 제안을 확인해보세요.</p>
    
    <div class="krds-search-suggestions">
      <h3>추천 검색어</h3>
      <ul class="krds-tag-list">
        <li><a href="#" class="krds-tag">관련 키워드 1</a></li>
        <li><a href="#" class="krds-tag">관련 키워드 2</a></li>
      </ul>
    </div>
  </div>
</div>`,
    metrics: {
      searchSuccess: '검색 성공률',
      queryRefinement: '검색어 수정 비율',
      resultsClickThrough: '결과 클릭률',
      zeroResults: '결과 없음 비율'
    }
  },

  {
    id: 'login',
    name: '로그인 (Login)',
    category: 'service',
    description: '사용자 신원 확인 및 인증',
    purpose: '개인화된 서비스 접근 권한 부여',
    keyGuideline: '사용자 신원을 확인하고 개인화된 경험에 접근할 수 있도록 한다',
    components: ['text-input', 'button', 'checkbox', 'link', 'modal'],
    flow: ['로그인 페이지 접근', '인증 정보 입력', '추가 인증 (필요시)', '로그인 성공/실패', '서비스 이용'],
    usageGuidelines: [
      '다양한 로그인 방법 제공',
      '비밀번호 보기/숨기기 기능',
      '로그인 상태 유지 옵션',
      '비밀번호 찾기 링크',
      '보안 안내 메시지'
    ],
    accessibilityNotes: '오류 메시지 명확히 전달, 폼 레이블 연결',
    examples: ['일반 로그인', '간편 로그인', '공동인증서 로그인', '생체인증 로그인'],
    implementationSteps: ['로그인 방식 선택', '인증 정보 입력 폼', '유효성 검사', '보안 처리', '세션 관리'],
    codeExample: `<div class="krds-pattern-login">
  <div class="krds-login-container">
    <h1 class="krds-login-title">로그인</h1>
    
    <!-- 로그인 방식 선택 -->
    <div class="krds-login-tabs" role="tablist">
      <button role="tab" aria-selected="true" aria-controls="id-login">
        아이디 로그인
      </button>
      <button role="tab" aria-selected="false" aria-controls="cert-login">
        인증서 로그인
      </button>
      <button role="tab" aria-selected="false" aria-controls="simple-login">
        간편 로그인
      </button>
    </div>
    
    <!-- 아이디 로그인 -->
    <div id="id-login" role="tabpanel" class="krds-login-panel">
      <form class="krds-login-form">
        <div class="krds-form-group">
          <label for="username">아이디</label>
          <input type="text" 
                 id="username" 
                 name="username"
                 required
                 autocomplete="username"
                 aria-describedby="username-error">
          <span id="username-error" class="krds-error" role="alert" hidden>
            아이디를 입력하세요
          </span>
        </div>
        
        <div class="krds-form-group">
          <label for="password">비밀번호</label>
          <div class="krds-password-input">
            <input type="password" 
                   id="password" 
                   name="password"
                   required
                   autocomplete="current-password"
                   aria-describedby="password-error">
            <button type="button" 
                    class="krds-password-toggle"
                    aria-label="비밀번호 표시">
              <svg><!-- 눈 아이콘 --></svg>
            </button>
          </div>
          <span id="password-error" class="krds-error" role="alert" hidden>
            비밀번호를 입력하세요
          </span>
        </div>
        
        <div class="krds-login-options">
          <label class="krds-checkbox">
            <input type="checkbox" name="remember">
            <span>로그인 상태 유지</span>
          </label>
          
          <div class="krds-login-links">
            <a href="#find-id">아이디 찾기</a>
            <span aria-hidden="true">|</span>
            <a href="#find-password">비밀번호 찾기</a>
          </div>
        </div>
        
        <button type="submit" class="krds-button-primary krds-button-full">
          로그인
        </button>
      </form>
      
      <div class="krds-login-security">
        <svg class="krds-security-icon"><!-- 보안 아이콘 --></svg>
        <p>보안 접속 중입니다. 개인정보는 암호화되어 전송됩니다.</p>
      </div>
    </div>
    
    <!-- 인증서 로그인 -->
    <div id="cert-login" role="tabpanel" class="krds-login-panel" hidden>
      <div class="krds-cert-options">
        <button class="krds-cert-button">
          <svg><!-- 공동인증서 아이콘 --></svg>
          <span>공동인증서</span>
        </button>
        <button class="krds-cert-button">
          <svg><!-- 금융인증서 아이콘 --></svg>
          <span>금융인증서</span>
        </button>
      </div>
    </div>
    
    <!-- 간편 로그인 -->
    <div id="simple-login" role="tabpanel" class="krds-login-panel" hidden>
      <div class="krds-simple-options">
        <button class="krds-simple-button">
          <img src="kakao.png" alt="카카오">
          <span>카카오로 로그인</span>
        </button>
        <button class="krds-simple-button">
          <img src="naver.png" alt="네이버">
          <span>네이버로 로그인</span>
        </button>
        <button class="krds-simple-button">
          <img src="pass.png" alt="PASS">
          <span>PASS로 로그인</span>
        </button>
      </div>
    </div>
    
    <!-- 회원가입 안내 -->
    <div class="krds-login-signup">
      <p>아직 회원이 아니신가요?</p>
      <a href="#signup" class="krds-button-secondary">회원가입</a>
    </div>
  </div>
</div>`,
    metrics: {
      loginSuccess: '로그인 성공률',
      loginTime: '평균 로그인 소요 시간',
      passwordReset: '비밀번호 재설정 비율',
      methodUsage: '로그인 방식별 사용률'
    }
  },

  {
    id: 'application',
    name: '신청 (Application)',
    category: 'service',
    description: '사용자가 양식을 작성하여 요구사항을 전달',
    purpose: '민원 및 서비스 신청 처리',
    keyGuideline: '공식적인 요청과 특정 서비스 문의를 포함하며, 표준 절차를 넘어서는 민원 신청을 다룬다',
    components: ['text-input', 'select', 'radio-button', 'checkbox', 'file-upload', 'button', 'step-indicator'],
    flow: ['신청 유형 선택', '신청서 작성', '첨부 서류 업로드', '내용 검토 및 확인', '제출 및 접수증 발급'],
    usageGuidelines: [
      '단계별 진행 표시',
      '임시저장 기능 제공',
      '필수/선택 항목 구분',
      '작성 도움말 제공',
      '제출 전 최종 검토'
    ],
    accessibilityNotes: '폼 그룹화, 오류 메시지 즉시 제공',
    examples: ['민원 신청', '증명서 발급 신청', '보조금 신청', '허가/신고 신청'],
    implementationSteps: ['신청 자격 확인', '단계별 양식 구성', '파일 첨부 처리', '유효성 검사', '접수 확인 및 추적'],
    codeExample: `<div class="krds-pattern-application">
  <!-- 진행 단계 표시 -->
  <ol class="krds-steps" aria-label="신청 단계">
    <li class="krds-step-completed">
      <span>1</span> 유형 선택
    </li>
    <li class="krds-step-current" aria-current="step">
      <span>2</span> 정보 입력
    </li>
    <li class="krds-step">
      <span>3</span> 서류 첨부
    </li>
    <li class="krds-step">
      <span>4</span> 확인 및 제출
    </li>
  </ol>
  
  <!-- 신청 양식 -->
  <form class="krds-application-form">
    <h1>민원 신청서 작성</h1>
    
    <!-- 신청인 정보 -->
    <fieldset class="krds-form-section">
      <legend>신청인 정보</legend>
      
      <div class="krds-form-row">
        <div class="krds-form-group">
          <label for="app-name" class="required">성명</label>
          <input type="text" id="app-name" required>
        </div>
        
        <div class="krds-form-group">
          <label for="app-phone" class="required">연락처</label>
          <input type="tel" id="app-phone" required>
        </div>
      </div>
      
      <div class="krds-form-group">
        <label for="app-email">이메일</label>
        <input type="email" id="app-email">
        <span class="krds-form-help">처리 결과를 이메일로 받으실 수 있습니다</span>
      </div>
    </fieldset>
    
    <!-- 신청 내용 -->
    <fieldset class="krds-form-section">
      <legend>신청 내용</legend>
      
      <div class="krds-form-group">
        <label for="app-type" class="required">민원 종류</label>
        <select id="app-type" required>
          <option value="">선택하세요</option>
          <option>건축 허가</option>
          <option>사업자 등록</option>
          <option>증명서 발급</option>
        </select>
      </div>
      
      <div class="krds-form-group">
        <label for="app-title" class="required">제목</label>
        <input type="text" id="app-title" required>
      </div>
      
      <div class="krds-form-group">
        <label for="app-content" class="required">상세 내용</label>
        <textarea id="app-content" rows="6" required></textarea>
        <span class="krds-char-count">0 / 1000</span>
      </div>
    </fieldset>
    
    <!-- 첨부 파일 -->
    <fieldset class="krds-form-section">
      <legend>첨부 파일</legend>
      
      <div class="krds-file-upload">
        <label for="app-files" class="krds-upload-label">
          <svg><!-- 업로드 아이콘 --></svg>
          <span>파일을 선택하거나 드래그하세요</span>
          <input type="file" id="app-files" multiple>
        </label>
        
        <div class="krds-file-info">
          <p>허용 형식: PDF, JPG, PNG, HWP, DOC</p>
          <p>최대 크기: 파일당 10MB, 총 50MB</p>
        </div>
        
        <ul class="krds-file-list">
          <!-- 업로드된 파일 목록 -->
        </ul>
      </div>
    </fieldset>
    
    <!-- 개인정보 동의 -->
    <div class="krds-agreement">
      <label class="krds-checkbox">
        <input type="checkbox" required>
        <span>[필수] 개인정보 수집 및 이용에 동의합니다</span>
      </label>
      <a href="#privacy" class="krds-link-detail">상세보기</a>
    </div>
    
    <!-- 버튼 영역 -->
    <div class="krds-form-actions">
      <button type="button" class="krds-button-secondary">
        임시저장
      </button>
      <button type="button" class="krds-button-secondary">
        이전 단계
      </button>
      <button type="submit" class="krds-button-primary">
        다음 단계
      </button>
    </div>
  </form>
  
  <!-- 도움말 패널 -->
  <aside class="krds-help-panel">
    <h2>작성 도움말</h2>
    <div class="krds-help-content">
      <h3>필수 서류 안내</h3>
      <ul>
        <li>신분증 사본</li>
        <li>관련 증빙 서류</li>
      </ul>
      
      <h3>처리 기간</h3>
      <p>접수 후 7일 이내 처리됩니다.</p>
      
      <h3>문의</h3>
      <p>전화: 02-1234-5678</p>
    </div>
  </aside>
</div>`,
    metrics: {
      completionRate: '신청 완료율',
      abandonmentRate: '중도 포기율',
      errorRate: '오류 발생률',
      averageTime: '평균 작성 시간'
    }
  },

  {
    id: 'policy-verification',
    name: '정책정보 확인 (Policy Information Verification)',
    category: 'service',
    description: '정부 및 기관의 정책 정보 검토',
    purpose: '정책, 지침, 법적 정보 확인',
    keyGuideline: '사용자가 정부/기관의 행동 계획, 지침, 법적 정보를 검토할 수 있도록 한다',
    components: ['structured-list', 'accordion', 'tab', 'link', 'button', 'disclosure'],
    flow: ['정책 카테고리 선택', '정책 목록 탐색', '상세 정보 확인', '관련 자료 다운로드', '추가 정보 요청'],
    usageGuidelines: [
      '정책 분류 체계 제공',
      '시행일/개정일 명시',
      '핵심 내용 요약',
      '전문 다운로드 제공',
      '관련 정책 연결'
    ],
    accessibilityNotes: '문서 구조화, 다운로드 파일 형식 안내',
    examples: ['법령 정보', '정책 안내', '시행령/시행규칙', '고시/공고'],
    implementationSteps: [
      '정책 분류 체계 구성',
      '검색 및 필터 기능',
      '상세 정보 레이아웃',
      '버전 관리 시스템',
      '피드백 수집 체계'
    ],
    codeExample: `<div class="krds-pattern-policy">
  <!-- 정책 검색 -->
  <div class="krds-policy-search">
    <form role="search">
      <label for="policy-search" class="sr-only">정책 검색</label>
      <input type="search" 
             id="policy-search" 
             placeholder="정책명 또는 키워드 검색">
      <button type="submit">검색</button>
    </form>
  </div>
  
  <!-- 정책 분류 -->
  <nav class="krds-policy-categories">
    <h2>정책 분야</h2>
    <ul>
      <li><a href="#" aria-current="page">전체</a></li>
      <li><a href="#">경제/산업</a></li>
      <li><a href="#">복지/보건</a></li>
      <li><a href="#">교육/문화</a></li>
      <li><a href="#">환경/에너지</a></li>
    </ul>
  </nav>
  
  <!-- 정책 목록 -->
  <div class="krds-policy-list">
    <h2>복지/보건 정책</h2>
    
    <article class="krds-policy-item">
      <header class="krds-policy-header">
        <h3>
          <a href="#policy-detail">저출산·고령사회 기본계획</a>
        </h3>
        <div class="krds-policy-meta">
          <span class="krds-policy-status">시행중</span>
          <time>시행일: 2024.01.01</time>
        </div>
      </header>
      
      <div class="krds-policy-summary">
        <p>저출산 및 인구 고령화에 대응하기 위한 종합적인 정책 방안...</p>
      </div>
      
      <div class="krds-policy-tags">
        <span class="krds-tag">저출산</span>
        <span class="krds-tag">고령화</span>
        <span class="krds-tag">인구정책</span>
      </div>
    </article>
  </div>
  
  <!-- 정책 상세 -->
  <article class="krds-policy-detail" id="policy-detail">
    <header class="krds-policy-detail-header">
      <h1>저출산·고령사회 기본계획</h1>
      <div class="krds-policy-info">
        <dl>
          <dt>소관부처</dt>
          <dd>보건복지부</dd>
          <dt>시행일</dt>
          <dd>2024년 1월 1일</dd>
          <dt>법적근거</dt>
          <dd>저출산·고령사회기본법</dd>
        </dl>
      </div>
    </header>
    
    <!-- 정책 내용 탭 -->
    <div class="krds-policy-content">
      <div class="krds-tabs" role="tablist">
        <button role="tab" aria-selected="true" aria-controls="overview">
          개요
        </button>
        <button role="tab" aria-selected="false" aria-controls="details">
          주요내용
        </button>
        <button role="tab" aria-selected="false" aria-controls="schedule">
          추진일정
        </button>
        <button role="tab" aria-selected="false" aria-controls="resources">
          관련자료
        </button>
      </div>
      
      <div id="overview" role="tabpanel">
        <h2>정책 개요</h2>
        <div class="krds-policy-overview">
          <h3>추진 배경</h3>
          <p>우리나라는 세계 최저 수준의 출산율과 급속한 고령화로...</p>
          
          <h3>정책 목표</h3>
          <ul>
            <li>출산율 회복을 위한 사회 환경 조성</li>
            <li>고령사회 대응 체계 구축</li>
            <li>인구구조 변화 대응력 강화</li>
          </ul>
        </div>
      </div>
      
      <div id="details" role="tabpanel" hidden>
        <h2>주요 내용</h2>
        <div class="krds-policy-details">
          <section>
            <h3>1. 출산·양육 지원 강화</h3>
            <ul>
              <li>출산지원금 확대</li>
              <li>육아휴직 제도 개선</li>
              <li>보육 인프라 확충</li>
            </ul>
          </section>
        </div>
      </div>
      
      <div id="schedule" role="tabpanel" hidden>
        <h2>추진 일정</h2>
        <table class="krds-policy-schedule">
          <caption>단계별 추진 계획</caption>
          <thead>
            <tr>
              <th>단계</th>
              <th>기간</th>
              <th>주요 과제</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1단계</td>
              <td>2024.1 ~ 2024.6</td>
              <td>제도 기반 마련</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div id="resources" role="tabpanel" hidden>
        <h2>관련 자료</h2>
        <ul class="krds-policy-resources">
          <li>
            <a href="#" download>
              <svg><!-- 파일 아이콘 --></svg>
              기본계획 전문 (PDF, 2.5MB)
            </a>
          </li>
          <li>
            <a href="#" download>
              <svg><!-- 파일 아이콘 --></svg>
              요약 보고서 (HWP, 500KB)
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 관련 정책 -->
    <aside class="krds-policy-related">
      <h2>관련 정책</h2>
      <ul>
        <li><a href="#">아동수당 지원 정책</a></li>
        <li><a href="#">노인 일자리 창출 방안</a></li>
        <li><a href="#">가족친화 기업 인증제</a></li>
      </ul>
    </aside>
    
    <!-- 의견 수렴 -->
    <div class="krds-policy-feedback">
      <h2>정책 의견 제출</h2>
      <p>본 정책에 대한 의견이 있으시면 제출해 주세요.</p>
      <a href="#feedback" class="krds-button-secondary">의견 제출하기</a>
    </div>
  </article>
</div>`,
    metrics: {
      viewCount: '정책 조회수',
      downloadCount: '자료 다운로드 수',
      feedbackCount: '의견 제출 수',
      shareCount: '공유 횟수'
    }
  }
];

// 패턴 검색 헬퍼
export function findServicePattern(query) {
  const lowerQuery = query.toLowerCase();
  return servicePatterns.filter(
    p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.id.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

// 컴포넌트별 서비스 패턴 매핑
export function getServicePatternsForComponent(componentId) {
  return servicePatterns.filter(p => p.components.includes(componentId));
}

// 서비스 패턴 통계
export const servicePatternStats = {
  total: servicePatterns.length,
  averageComponents: Math.round(
    servicePatterns.reduce((sum, p) => sum + p.components.length, 0) / servicePatterns.length
  ),
  averageSteps: Math.round(servicePatterns.reduce((sum, p) => sum + p.flow.length, 0) / servicePatterns.length),
  componentsUsage: getComponentsUsage()
};

function getComponentsUsage() {
  const usage = {};
  servicePatterns.forEach(p => {
    p.components.forEach(c => {
      usage[c] = (usage[c] || 0) + 1;
    });
  });

  return Object.entries(usage)
    .sort((a, b) => b[1] - a[1])
    .map(([component, count]) => ({ component, count }));
}

// 서비스 패턴 카테고리
export const servicePatternCategories = {
  entry: ['visit'],
  discovery: ['search'],
  authentication: ['login'],
  transaction: ['application'],
  information: ['policy-verification']
};
