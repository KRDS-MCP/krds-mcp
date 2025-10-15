/**
 * KRDS 글로벌 패턴 데이터
 * 총 11개의 기본 패턴 정의
 */

export const globalPatterns = [
  {
    id: 'personal-identification',
    name: '개인정보 확인 (Personal Identification Information)',
    category: 'global',
    description: '개인의 신원을 확인하는 패턴',
    purpose: '사용자 본인 확인 및 인증',
    keyGuideline: '개인정보 수집이 꼭 필요한지 신중히 검토하세요',
    components: ['text-input', 'select', 'radio-button', 'button'],
    flow: ['필수 정보만 수집', '수집 목적 명시', '본인인증 수단 제공', '정보 보호 안내'],
    usageGuidelines: [
      '최소한의 정보만 수집',
      '수집 목적과 보관 기간 명시',
      '선택 항목과 필수 항목 구분',
      '안전한 전송 및 저장 보장'
    ],
    accessibilityNotes: '필수 항목 명확히 표시, 오류 메시지 제공',
    examples: ['회원가입 양식', '본인인증 절차', '신청서 작성'],
    codeExample: `<form class="krds-pattern-identification">
  <fieldset>
    <legend>개인정보 입력</legend>
    
    <div class="krds-input">
      <label for="name">이름 <span class="required">*</span></label>
      <input type="text" id="name" required aria-required="true">
    </div>
    
    <div class="krds-input">
      <label for="birthdate">생년월일 <span class="required">*</span></label>
      <input type="date" id="birthdate" required aria-required="true">
    </div>
    
    <div class="krds-radio-group">
      <legend>성별</legend>
      <input type="radio" id="male" name="gender" value="M">
      <label for="male">남성</label>
      <input type="radio" id="female" name="gender" value="F">
      <label for="female">여성</label>
    </div>
    
    <div class="krds-notice">
      <p>수집된 개인정보는 서비스 제공 목적으로만 사용됩니다.</p>
    </div>
  </fieldset>
</form>`
  },

  {
    id: 'help',
    name: '도움말 (Help)',
    category: 'global',
    description: '서비스 사용 방법에 대한 안내 제공',
    purpose: '사용자의 서비스 이해도 향상',
    keyGuideline: '사용자의 숙련도와 맥락에 맞는 도움말 컴포넌트를 설계하세요',
    components: ['help-panel', 'tooltip', 'contextual-help', 'modal'],
    flow: ['도움말 아이콘/링크 제공', '상황별 적절한 도움말 표시', '추가 정보 링크 제공', '피드백 채널 안내'],
    usageGuidelines: ['접근하기 쉬운 위치에 배치', '간결하고 명확한 설명', '단계별 안내 제공', '시각적 보조 자료 활용'],
    accessibilityNotes: '키보드로 접근 가능, 스크린리더 호환',
    examples: ['입력 필드 도움말', '서비스 이용 가이드', 'FAQ 섹션'],
    codeExample: `<div class="krds-pattern-help">
  <div class="krds-help-trigger">
    <button aria-label="도움말 열기" aria-describedby="help-content">
      <svg class="icon-help"><!-- 도움말 아이콘 --></svg>
    </button>
  </div>
  
  <div id="help-content" class="krds-help-content" role="region">
    <h3>도움말</h3>
    <p>이 기능은 다음과 같이 사용합니다:</p>
    <ol>
      <li>첫 번째 단계 설명</li>
      <li>두 번째 단계 설명</li>
    </ol>
    <a href="/full-guide">전체 가이드 보기</a>
  </div>
</div>`
  },

  {
    id: 'consent',
    name: '동의 (Consent)',
    category: 'global',
    description: '사용자의 동의를 받는 패턴',
    purpose: '약관 및 정책에 대한 사용자 동의 확인',
    keyGuideline: '복잡한 약관을 이해하기 쉽게 구조화하여 제공하세요',
    components: ['checkbox', 'button', 'disclosure', 'modal'],
    flow: ['약관 내용 제시', '주요 내용 강조', '개별/전체 동의 선택', '동의 기록 저장'],
    usageGuidelines: [
      '전체 동의와 개별 동의 구분',
      '필수와 선택 항목 명확히 구분',
      '약관 전문 보기 링크 제공',
      '동의 철회 방법 안내'
    ],
    accessibilityNotes: '체크박스와 레이블 연결, 필수 항목 안내',
    examples: ['서비스 이용약관 동의', '개인정보 수집 동의', '마케팅 수신 동의'],
    codeExample: `<div class="krds-pattern-consent">
  <div class="krds-consent-all">
    <input type="checkbox" id="agree-all">
    <label for="agree-all"><strong>전체 동의</strong></label>
  </div>
  
  <div class="krds-consent-items">
    <div class="krds-consent-item">
      <input type="checkbox" id="terms" required>
      <label for="terms">
        [필수] 서비스 이용약관 동의
        <a href="/terms" target="_blank">전문보기</a>
      </label>
    </div>
    
    <div class="krds-consent-item">
      <input type="checkbox" id="privacy" required>
      <label for="privacy">
        [필수] 개인정보 처리방침 동의
        <a href="/privacy" target="_blank">전문보기</a>
      </label>
    </div>
    
    <div class="krds-consent-item">
      <input type="checkbox" id="marketing">
      <label for="marketing">
        [선택] 마케팅 정보 수신 동의
      </label>
    </div>
  </div>
  
  <button type="submit" class="krds-button-primary">동의하고 계속</button>
</div>`
  },

  {
    id: 'list-navigation',
    name: '목록 탐색 (List Navigation)',
    category: 'global',
    description: '목록 형태의 정보를 탐색하는 패턴',
    purpose: '사용자가 목록 항목을 찾고 상호작용',
    keyGuideline: '일관된 형식과 논리적 순서로 목록을 구성하세요',
    components: ['structured-list', 'pagination', 'select', 'button'],
    flow: ['목록 표시', '정렬 옵션 제공', '페이지네이션', '항목 선택/작업'],
    usageGuidelines: ['한 페이지 표시 개수 조절 옵션', '정렬 기준 명시', '선택된 항목 표시', '일괄 작업 기능 제공'],
    accessibilityNotes: '테이블 구조 활용, 현재 페이지 안내',
    examples: ['게시판 목록', '검색 결과 목록', '민원 신청 내역'],
    codeExample: `<div class="krds-pattern-list-nav">
  <div class="krds-list-controls">
    <div class="krds-list-filter">
      <label for="sort">정렬</label>
      <select id="sort">
        <option>최신순</option>
        <option>이름순</option>
        <option>인기순</option>
      </select>
    </div>
    
    <div class="krds-list-count">
      <label for="per-page">표시 개수</label>
      <select id="per-page">
        <option>10개</option>
        <option>20개</option>
        <option>50개</option>
      </select>
    </div>
  </div>
  
  <ul class="krds-list" role="list">
    <li class="krds-list-item">
      <a href="#">항목 1</a>
      <span class="krds-list-meta">2024.01.01</span>
    </li>
    <li class="krds-list-item">
      <a href="#">항목 2</a>
      <span class="krds-list-meta">2024.01.02</span>
    </li>
  </ul>
  
  <nav class="krds-pagination" aria-label="페이지 네비게이션">
    <!-- 페이지네이션 -->
  </nav>
</div>`
  },

  {
    id: 'user-feedback',
    name: '사용자 피드백 (User Feedback)',
    category: 'global',
    description: '사용자 의견 및 경험 수집',
    purpose: '서비스 개선을 위한 피드백 수집',
    keyGuideline: '사용자 작업을 방해하지 않으면서 피드백을 유도하세요',
    components: ['textarea', 'radio-button', 'button', 'modal'],
    flow: ['피드백 요청', '의견 입력', '평점/만족도 선택', '제출 및 감사 인사'],
    usageGuidelines: ['간단한 평가 방법 제공', '선택적 상세 의견 입력', '익명 제출 옵션', '피드백 반영 결과 공유'],
    accessibilityNotes: '폼 요소 레이블링, 제출 결과 알림',
    examples: ['서비스 만족도 조사', '페이지 유용성 평가', '개선 의견 수집'],
    codeExample: `<div class="krds-pattern-feedback">
  <h3>이 페이지가 도움이 되셨나요?</h3>
  
  <div class="krds-feedback-rating">
    <button class="krds-rating-positive" aria-label="도움됨">
      <svg><!-- 좋아요 아이콘 --></svg>
      예
    </button>
    <button class="krds-rating-negative" aria-label="도움안됨">
      <svg><!-- 싫어요 아이콘 --></svg>
      아니오
    </button>
  </div>
  
  <div class="krds-feedback-detail" hidden>
    <label for="feedback-text">
      어떤 점을 개선하면 좋을까요? (선택사항)
    </label>
    <textarea id="feedback-text" rows="4"></textarea>
    
    <button type="submit" class="krds-button">의견 보내기</button>
  </div>
  
  <div class="krds-feedback-thanks" hidden>
    <p>소중한 의견 감사합니다!</p>
  </div>
</div>`
  },

  {
    id: 'detailed-information',
    name: '상세 정보 (Detailed Information)',
    category: 'global',
    description: '포괄적인 콘텐츠 제공',
    purpose: '사용자에게 필요한 모든 정보 전달',
    keyGuideline: '사용자가 기대하는 정보를 명확하고 간결하게 전달하세요',
    components: ['tab', 'accordion', 'table', 'image'],
    flow: ['개요 제시', '섹션별 상세 정보', '관련 자료 링크', '추가 문의 안내'],
    usageGuidelines: ['정보 계층 구조화', '중요 정보 우선 배치', '시각 자료 활용', '관련 정보 링크 제공'],
    accessibilityNotes: '제목 계층 구조, 랜드마크 활용',
    examples: ['정책 상세 안내', '서비스 소개 페이지', '제품 상세 정보'],
    codeExample: `<article class="krds-pattern-detail">
  <header class="krds-detail-header">
    <h1>정책 상세 정보</h1>
    <p class="krds-detail-summary">정책에 대한 간단한 요약</p>
  </header>
  
  <nav class="krds-detail-toc" aria-label="목차">
    <h2>목차</h2>
    <ul>
      <li><a href="#overview">개요</a></li>
      <li><a href="#eligibility">대상</a></li>
      <li><a href="#process">절차</a></li>
      <li><a href="#documents">필요서류</a></li>
    </ul>
  </nav>
  
  <div class="krds-detail-content">
    <section id="overview">
      <h2>개요</h2>
      <p>정책 개요 내용...</p>
    </section>
    
    <section id="eligibility">
      <h2>대상</h2>
      <ul>
        <li>대상 조건 1</li>
        <li>대상 조건 2</li>
      </ul>
    </section>
    
    <section id="process">
      <h2>절차</h2>
      <ol>
        <li>신청서 작성</li>
        <li>서류 제출</li>
        <li>심사</li>
        <li>결과 통보</li>
      </ol>
    </section>
    
    <section id="documents">
      <h2>필요서류</h2>
      <table>
        <caption>제출 서류 목록</caption>
        <thead>
          <tr>
            <th>서류명</th>
            <th>필수여부</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>신청서</td>
            <td>필수</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
  
  <footer class="krds-detail-footer">
    <h2>관련 정보</h2>
    <ul>
      <li><a href="#">관련 정책 1</a></li>
      <li><a href="#">자주 묻는 질문</a></li>
    </ul>
  </footer>
</article>`
  },

  {
    id: 'error-handling',
    name: '오류 처리 (Error Handling)',
    category: 'global',
    description: '시스템 오류 및 사용자 실수 처리',
    purpose: '문제 발생 시 사용자 안내 및 해결',
    keyGuideline: '사용자가 원래 하려던 작업을 완료할 수 있도록 안내하세요',
    components: ['critical-alerts', 'modal', 'button', 'link'],
    flow: ['오류 감지', '명확한 오류 메시지', '해결 방법 제시', '대안 제공'],
    usageGuidelines: ['친근한 어조 사용', '기술적 용어 자제', '구체적 해결 방법 제시', '지원 연락처 제공'],
    accessibilityNotes: "role='alert', 포커스 이동",
    examples: ['404 페이지', '폼 검증 오류', '시스템 오류 페이지'],
    codeExample: `<div class="krds-pattern-error" role="alert">
  <div class="krds-error-icon">
    <svg><!-- 오류 아이콘 --></svg>
  </div>
  
  <h1 class="krds-error-title">페이지를 찾을 수 없습니다</h1>
  
  <div class="krds-error-message">
    <p>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
    <p class="krds-error-code">오류 코드: 404</p>
  </div>
  
  <div class="krds-error-actions">
    <h2>다음을 시도해보세요:</h2>
    <ul>
      <li>웹 주소가 올바른지 확인하세요</li>
      <li>뒤로 가기 버튼을 눌러 이전 페이지로 돌아가세요</li>
      <li>홈페이지에서 원하는 정보를 찾아보세요</li>
    </ul>
    
    <div class="krds-error-buttons">
      <a href="/" class="krds-button-primary">홈으로 가기</a>
      <button onclick="history.back()" class="krds-button-secondary">
        이전 페이지
      </button>
    </div>
  </div>
  
  <div class="krds-error-contact">
    <p>계속 문제가 발생하면 고객센터로 문의하세요</p>
    <p>전화: 1234-5678 | 이메일: help@service.go.kr</p>
  </div>
</div>`
  },

  {
    id: 'input-forms',
    name: '입력 양식 (Input Forms)',
    category: 'global',
    description: '사용자 데이터 수집 및 전송',
    purpose: '정보 입력 및 제출',
    keyGuideline: '여러 입력 컨트롤을 조합하여 완성된 양식을 구성하세요',
    components: ['text-input', 'select', 'checkbox', 'radio-button', 'button'],
    flow: ['양식 설명', '단계별 입력', '유효성 검사', '제출 및 확인'],
    usageGuidelines: ['논리적 그룹화', '진행 상황 표시', '실시간 유효성 검사', '자동 저장 기능'],
    accessibilityNotes: 'fieldset/legend 사용, 오류 메시지 연결',
    examples: ['회원가입 양식', '민원 신청서', '설문조사 양식'],
    codeExample: `<form class="krds-pattern-form">
  <div class="krds-form-progress">
    <span class="current">1. 기본정보</span>
    <span>2. 상세정보</span>
    <span>3. 확인</span>
  </div>
  
  <fieldset class="krds-form-section">
    <legend>기본 정보 입력</legend>
    
    <div class="krds-form-group">
      <label for="name" class="required">이름</label>
      <input type="text" id="name" required aria-required="true">
      <span class="krds-form-help">실명을 입력하세요</span>
    </div>
    
    <div class="krds-form-group">
      <label for="email" class="required">이메일</label>
      <input type="email" id="email" required aria-required="true">
      <span class="krds-form-error" role="alert" hidden>
        올바른 이메일 형식이 아닙니다
      </span>
    </div>
    
    <div class="krds-form-group">
      <label for="phone">전화번호</label>
      <input type="tel" id="phone" pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}">
      <span class="krds-form-help">예: 010-1234-5678</span>
    </div>
  </fieldset>
  
  <div class="krds-form-actions">
    <button type="button" class="krds-button-secondary">임시저장</button>
    <button type="submit" class="krds-button-primary">다음 단계</button>
  </div>
</form>`
  },

  {
    id: 'file-attachments',
    name: '파일 첨부 (File Attachments)',
    category: 'global',
    description: '다운로드 가능한 콘텐츠 제공',
    purpose: '문서 및 자료 공유',
    keyGuideline: '접근 가능한 파일 형식 옵션을 제공하세요',
    components: ['file-upload', 'button', 'link', 'badge'],
    flow: ['파일 선택/드래그', '파일 검증', '업로드 진행', '완료 확인'],
    usageGuidelines: ['허용 파일 형식 명시', '파일 크기 제한 안내', '업로드 진행률 표시', '대체 형식 제공'],
    accessibilityNotes: '파일 정보 읽기, 진행 상태 알림',
    examples: ['증빙서류 첨부', '자료실 다운로드', '양식 파일 제공'],
    codeExample: `<div class="krds-pattern-attachment">
  <div class="krds-attachment-upload">
    <label for="file-upload" class="krds-upload-area">
      <svg class="krds-upload-icon"><!-- 업로드 아이콘 --></svg>
      <span class="krds-upload-text">
        파일을 선택하거나 여기로 드래그하세요
      </span>
      <input type="file" 
             id="file-upload" 
             multiple 
             accept=".pdf,.doc,.docx,.hwp"
             aria-describedby="file-info">
    </label>
    
    <div id="file-info" class="krds-upload-info">
      <p>허용 형식: PDF, DOC, DOCX, HWP</p>
      <p>최대 크기: 10MB</p>
    </div>
  </div>
  
  <div class="krds-attachment-list">
    <h3>첨부된 파일</h3>
    <ul>
      <li class="krds-attachment-item">
        <svg class="krds-file-icon"><!-- 파일 아이콘 --></svg>
        <span class="krds-file-name">문서.pdf</span>
        <span class="krds-file-size">(2.5MB)</span>
        <button class="krds-file-remove" aria-label="문서.pdf 삭제">
          삭제
        </button>
      </li>
    </ul>
  </div>
  
  <div class="krds-attachment-download">
    <h3>다운로드 가능한 파일</h3>
    <ul>
      <li>
        <a href="/files/form.hwp" download>
          신청서 양식 (HWP, 150KB)
        </a>
      </li>
      <li>
        <a href="/files/form.pdf" download>
          신청서 양식 (PDF, 200KB)
        </a>
      </li>
    </ul>
  </div>
</div>`
  },

  {
    id: 'filtering-sorting',
    name: '필터링 및 정렬 (Filtering and Sorting)',
    category: 'global',
    description: '데이터 탐색 및 정제',
    purpose: '효율적인 정보 검색',
    keyGuideline: '사용자가 원하는 정보를 빠르게 찾을 수 있도록 도와주세요',
    components: ['select', 'checkbox', 'radio-button', 'button', 'tag'],
    flow: ['필터 옵션 선택', '정렬 기준 선택', '결과 업데이트', '선택 초기화'],
    usageGuidelines: [
      '자주 사용하는 필터 우선 배치',
      '적용된 필터 명확히 표시',
      '결과 수 실시간 표시',
      '필터 초기화 버튼 제공'
    ],
    accessibilityNotes: '필터 상태 알림, 결과 업데이트 알림',
    examples: ['상품 목록 필터', '검색 결과 정제', '데이터 테이블 정렬'],
    codeExample: `<div class="krds-pattern-filter">
  <div class="krds-filter-panel">
    <h2>필터 옵션</h2>
    
    <div class="krds-filter-group">
      <h3>카테고리</h3>
      <div class="krds-filter-options">
        <label>
          <input type="checkbox" value="cat1">
          카테고리 1 (24)
        </label>
        <label>
          <input type="checkbox" value="cat2">
          카테고리 2 (15)
        </label>
      </div>
    </div>
    
    <div class="krds-filter-group">
      <h3>정렬</h3>
      <select aria-label="정렬 기준">
        <option>최신순</option>
        <option>인기순</option>
        <option>이름순</option>
        <option>가격순</option>
      </select>
    </div>
    
    <div class="krds-filter-actions">
      <button class="krds-button-secondary">초기화</button>
      <button class="krds-button-primary">적용</button>
    </div>
  </div>
  
  <div class="krds-filter-applied">
    <h3>적용된 필터:</h3>
    <div class="krds-filter-tags">
      <span class="krds-tag">
        카테고리 1
        <button aria-label="카테고리 1 필터 제거">×</button>
      </span>
      <span class="krds-tag">
        최신순
        <button aria-label="최신순 정렬 제거">×</button>
      </span>
    </div>
  </div>
  
  <div class="krds-filter-results" aria-live="polite">
    <p>총 <strong>39개</strong>의 결과가 있습니다.</p>
  </div>
</div>`
  },

  {
    id: 'confirmation',
    name: '확인 (Confirmation)',
    category: 'global',
    description: '중요한 작업에 대한 사용자 확인',
    purpose: '실수 방지 및 의도 확인',
    keyGuideline: '불확실성을 줄이고 실수를 방지할 수 있도록 설계하세요',
    components: ['modal', 'button', 'critical-alerts'],
    flow: ['작업 요청', '확인 대화상자', '최종 확인/취소', '작업 수행'],
    usageGuidelines: [
      '작업의 결과 명확히 설명',
      '되돌릴 수 없는 작업 강조',
      '확인과 취소 버튼 구분',
      '실수 클릭 방지 (딜레이 등)'
    ],
    accessibilityNotes: '포커스 트랩, 명확한 버튼 레이블',
    examples: ['삭제 확인', '제출 확인', '결제 확인'],
    codeExample: `<div class="krds-pattern-confirmation" 
     role="dialog" 
     aria-modal="true"
     aria-labelledby="confirm-title">
  
  <div class="krds-confirm-overlay"></div>
  
  <div class="krds-confirm-dialog">
    <div class="krds-confirm-header">
      <svg class="krds-confirm-icon krds-confirm-icon--warning">
        <!-- 경고 아이콘 -->
      </svg>
      <h2 id="confirm-title">정말 삭제하시겠습니까?</h2>
    </div>
    
    <div class="krds-confirm-body">
      <p>이 작업은 되돌릴 수 없습니다.</p>
      <p class="krds-confirm-detail">
        <strong>삭제될 항목:</strong> 문서 10개
      </p>
    </div>
    
    <div class="krds-confirm-actions">
      <button class="krds-button-secondary" onclick="closeDialog()">
        취소
      </button>
      <button class="krds-button-danger" onclick="confirmDelete()">
        삭제
      </button>
    </div>
  </div>
</div>`
  }
];

// 패턴 검색 헬퍼
export function findGlobalPattern(query) {
  const lowerQuery = query.toLowerCase();
  return globalPatterns.filter(
    p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.id.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

// 컴포넌트별 패턴 매핑
export function getPatternsForComponent(componentId) {
  return globalPatterns.filter(p => p.components.includes(componentId));
}

// 패턴 통계
export const globalPatternStats = {
  total: globalPatterns.length,
  averageComponents: Math.round(
    globalPatterns.reduce((sum, p) => sum + p.components.length, 0) / globalPatterns.length
  ),
  mostUsedComponents: getMostUsedComponents()
};

function getMostUsedComponents() {
  const componentCount = {};
  globalPatterns.forEach(p => {
    p.components.forEach(c => {
      componentCount[c] = (componentCount[c] || 0) + 1;
    });
  });

  return Object.entries(componentCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([component, count]) => ({ component, count }));
}
