# KRDS MCP Server

한국 정부 디지털 서비스의 표준 디자인 시스템인 KRDS (Korea Government Design System)의 가이드라인을 기반으로 AI 모델에게 디자인 시스템 정보를 제공하는 MCP (Model Context Protocol) 서버입니다.

> 🎯 **목적**: AI 어시스턴트가 한국 정부 웹사이트 및 디지털 서비스 개발 시 KRDS 디자인 가이드라인을 준수할 수 있도록 지원

## 🏗️ 프로젝트 구조

```
krds-mcp/
├── data/                          # 디자인 시스템 데이터
│   ├── design-principles.js      # 디자인 원칙 (7개 핵심 원칙)
│   ├── colors.js                 # 색상 체계 (Primary, System, Neutral 등)
│   ├── typography.js             # 타이포그래피 (Display, Heading, Body 등)
│   ├── components.js             # UI 컴포넌트 (37개 표준 컴포넌트)
│   ├── patterns.js               # 디자인 패턴 (Global, Service 패턴)
│   ├── shapes-icons.js           # 도형 및 아이콘 시스템
│   ├── design-tokens.js          # 디자인 토큰 (색상, 타이포, 스페이싱 등)
│   ├── systems.js                # 시스템 (스페이싱, 그리드, 반응형, 다크모드)
│   └── index.js                  # 데이터 통합 인덱스
├── handlers/                      # MCP 핸들러
│   ├── extended-handlers.js      # 확장 핸들러 (패턴, 토큰, 통계 등)
│   └── index.js                  # 핸들러 통합
├── helpers/                       # 헬퍼 함수들
│   ├── accessibility-validator.js # 접근성 검증 (WCAG 2.1 AA)
│   ├── base-helpers.js           # 기본 유틸리티 함수
│   ├── validation-system.js      # 입력 검증 시스템
│   ├── error-handling.js         # 에러 처리 시스템
│   ├── response-formatter.js     # 응답 포맷터
│   ├── data-service.js          # 데이터 서비스 레이어
│   ├── performance-helpers.js    # 성능 최적화 (캐싱, 메모이제이션)
│   └── index.js                  # 헬퍼 통합 인덱스
├── tests/                        # 테스트 파일
│   ├── unit/                     # 단위 테스트
│   └── integration/              # 통합 테스트
├── index.js                      # MCP 서버 진입점
├── package.json                  # 프로젝트 설정
└── README.md                     # 프로젝트 문서
```

## 🚀 시작하기

### NPX로 간편 실행 (권장)

```bash
# 설치 없이 바로 실행
npx @krds-mcp/krds-mcp

# 도움말 보기
npx @krds-mcp/krds-mcp --help

# 버전 확인
npx @krds-mcp/krds-mcp --version
```

### 로컬 설치

```bash
# 글로벌 설치
npm install -g @krds-mcp/krds-mcp

# 로컬 프로젝트에 설치
npm install @krds-mcp/krds-mcp

# 개발 의존성 설치 (개발자용)
npm install
```

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 린트 및 포맷 검사
npm run quality

# 테스트 실행
npm test

# 개발 모드로 실행 (파일 변경 시 자동 재시작)
npm run dev
```

### MCP 서버 실행

```bash
# 기본 실행
node index.js

# Claude Desktop과 연동하여 사용 (NPX 권장)
# Claude Desktop 설정 파일 (claude_desktop_config.json)에 다음 추가:

# NPX 사용 (권장) - 항상 최신 버전 사용
{
  "mcpServers": {
    "krds-mcp": {
      "command": "npx",
      "args": ["@krds-mcp/krds-mcp"]
    }
  }
}

# 글로벌 설치 후 사용
{
  "mcpServers": {
    "krds-mcp": {
      "command": "krds-mcp"
    }
  }
}

# 로컬 개발용
{
  "mcpServers": {
    "krds-mcp": {
      "command": "node",
      "args": ["C:/projects/krds-mcp/index.js"]
    }
  }
}
```

## 🛠️ 개발 도구

### 코드 품질 관리

```bash
# ESLint 실행
npm run lint
npm run lint:fix

# Prettier 포맷팅
npm run format
npm run format:check

# 전체 품질 검사
npm run quality
```

### 테스트

```bash
# 전체 테스트 실행
npm test

# 유닛 테스트만 실행
npm run test:unit

# 통합 테스트만 실행
npm run test:integration

# 테스트 커버리지 확인
npm run test:coverage

# 테스트 감시 모드
npm run test:watch
```

### 커버리지 리포팅

```bash
# 커버리지 보고서 생성
npm run coverage

# 커버리지 요약 확인
npm run coverage:report
```

## 📚 사용 가능한 MCP 도구들

### 1. 디자인 원칙 조회

- **도구명**: `krds_get_design_principles`
- **설명**: KRDS 7대 디자인 원칙 조회
- **매개변수**:
  - `principle` (선택): 특정 원칙 이름

### 2. 색상 체계 조회

- **도구명**: `krds_get_colors`
- **설명**: KRDS 색상 체계 조회 (완전한 색상 시스템)
- **매개변수**:
  - `category` (선택): primary, system, neutral, emphasis, graphic
  - `color` (선택): 특정 색상 이름 또는 ID

### 3. 타이포그래피 조회

- **도구명**: `krds_get_typography`
- **설명**: KRDS 타이포그래피 체계 조회
- **매개변수**:
  - `category` (선택): display, heading, body, interactive, utility
  - `style` (선택): 특정 스타일 ID 또는 이름

### 4. 컴포넌트 조회

- **도구명**: `krds_get_components`
- **설명**: KRDS 37개 표준 컴포넌트 정보 조회
- **매개변수**:
  - `category` (선택): identity, navigation, layout-expression, action, selection, feedback, help, input, settings, content
  - `component` (선택): 특정 컴포넌트 이름 또는 ID
  - `includeCode` (선택): HTML 코드 예제 포함 여부

### 5. 글로벌 패턴 조회

- **도구명**: `krds_get_global_patterns`
- **설명**: KRDS 11개 기본 패턴 조회
- **매개변수**:
  - `pattern` (선택): 특정 패턴 이름 또는 ID
  - `component` (선택): 특정 컴포넌트가 사용되는 패턴 찾기
  - `includeCode` (선택): HTML 코드 예제 포함 여부

### 6. 서비스 패턴 조회

- **도구명**: `krds_get_service_patterns`
- **설명**: KRDS 5개 서비스별 패턴 조회
- **매개변수**:
  - `pattern` (선택): 특정 서비스 패턴 이름 또는 ID
  - `includeCode` (선택): HTML 코드 예제 포함 여부
  - `includeMetrics` (선택): 성과 지표 정보 포함 여부

### 7. 도형 및 아이콘 조회

- **도구명**: `krds_get_shapes_icons`
- **설명**: KRDS Shape 및 Icons 정보 조회
- **매개변수**:
  - `type`: shapes, icons, both
  - `iconCategory` (선택): system, status, action, communication, file, government
  - `iconId` (선택): 특정 아이콘 ID

### 8. 디자인 토큰 조회

- **도구명**: `krds_get_design_tokens`
- **설명**: KRDS 디자인 토큰 조회 (완전한 토큰 시스템)
- **매개변수**:
  - `category` (선택): color, typography, spacing, sizing, border, shadow, motion, layout, component
  - `tokenName` (선택): 특정 토큰 이름
  - `theme` (선택): light, dark
  - `format` (선택): json, css, style-dictionary

### 9. 시스템 정보 조회

- **도구명**: `krds_get_systems`
- **설명**: KRDS 기본 시스템 정보 조회
- **매개변수**:
  - `system`: spacing, grid, responsive, darkmode

### 10. 접근성 검증

- **도구명**: `krds_validate_accessibility`
- **설명**: HTML 코드의 접근성 검증 (WCAG 2.1 AA 기준)
- **매개변수**:
  - `htmlCode` (필수): 검증할 HTML 코드

### 11. 통합 검색

- **도구명**: `krds_search`
- **설명**: KRDS 전체 데이터에서 통합 검색
- **매개변수**:
  - `query` (필수): 검색할 키워드
  - `type` (선택): all, principles, colors, typography, components, global-patterns, service-patterns, icons, tokens
  - `detailed` (선택): 상세 정보 포함 여부

### 12. 코드 생성

- **도구명**: `krds_generate_code`
- **설명**: KRDS 컴포넌트/패턴의 HTML/CSS 코드 생성
- **매개변수**:
  - `type` (필수): component, global-pattern, service-pattern
  - `id` (필수): 컴포넌트/패턴 ID
  - `variant` (선택): 컴포넌트 변형
  - `theme` (선택): light, dark

### 13. 통계 정보

- **도구명**: `krds_get_stats`
- **설명**: KRDS 시스템 통계 및 준수율 정보
- **매개변수**:
  - `detailed` (선택): 상세 통계 포함 여부

## ⚡ 주요 특징

- **완전한 KRDS 데이터**: 최신 KRDS 가이드라인의 모든 요소 포함
- **MCP 프로토콜 지원**: Claude 및 기타 AI 모델과 완벽 호환
- **한국어 우선 지원**: 한국어 에러 메시지 및 설명
- **접근성 검증**: WCAG 2.1 AA 기준 자동 검증
- **성능 최적화**: 캐싱, 메모이제이션, 레이지 로딩
- **확장 가능한 구조**: 모듈화된 설계로 쉬운 기능 추가

## 🔧 모듈화의 장점

### 1. 가독성 향상

- 각 파일이 특정 기능에 집중
- 코드 구조가 명확해짐

### 2. 유지보수성

- 특정 기능 수정 시 해당 파일만 수정
- 버그 추적이 용이

### 3. 재사용성

- 필요한 모듈만 import하여 사용
- 다른 프로젝트에서도 활용 가능

### 4. 테스트 용이성

- 각 모듈별로 독립적인 테스트 작성 가능
- 단위 테스트 작성이 쉬워짐

## 🎯 주요 기능

### 디자인 시스템 데이터

- **디자인 원칙**: 사용자 중심, 포용성, 간결성 등 7가지 원칙
- **색상 체계**: 16가지 표준 색상과 변형
- **타이포그래피**: 13가지 텍스트 스타일과 반응형 설정
- **컴포넌트**: 30+ UI 컴포넌트와 사용 가이드라인
- **패턴**: 로그인, 민원신청, 검색 등 7가지 디자인 패턴

### 시스템 정보

- **스페이싱**: 4px부터 128px까지의 표준 간격
- **그리드**: 12컬럼 그리드 시스템과 브레이크포인트
- **반응형**: 모바일 우선 설계 가이드라인
- **다크모드**: CSS 변수 기반 테마 시스템

### 접근성 지원

- **WCAG 2.1 AA** 수준 준수
- **HTML 접근성 검증** 도구
- **접근성 점수** 및 개선 제안
- **색상 대비** 검증

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다! 다음 단계를 따라주세요:

### 1. 개발 환경 설정

```bash
# 저장소 포크 및 클론
git clone git@github.com:KRDS-MCP/krds-mcp.git
cd krds-mcp

# 의존성 설치
npm install

# 개발 도구 확인
npm run quality
```

### 2. 개발 프로세스

1. 이슈를 생성하거나 기존 이슈를 확인하세요
2. 기능 브랜치를 생성하세요 (`feature/새기능명` 또는 `fix/버그수정명`)
3. 변경사항을 구현하세요
4. 테스트를 작성하고 실행하세요: `npm test`
5. 코드 품질을 확인하세요: `npm run quality`
6. 변경사항을 커밋하세요
7. Pull Request를 생성하세요

### 3. 코드 스타일 가이드

- ESLint 설정을 따라주세요: `npm run lint`
- Prettier 포맷팅을 사용하세요: `npm run format`
- 모든 테스트가 통과해야 합니다: `npm test`
- 커버리지는 80% 이상을 유지해야 합니다

### 4. 커밋 메시지 규칙

```
type(scope): description

예시:
feat(handlers): add global patterns handler
fix(validation): resolve input validation issue
docs(readme): update installation guide
test(unit): add tests for color validation
```

### 5. Pull Request 요구사항

- [ ] 모든 테스트 통과
- [ ] 코드 품질 검사 통과
- [ ] 적절한 테스트 커버리지
- [ ] 문서 업데이트 (필요시)
- [ ] KRDS 가이드라인 준수

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📊 프로젝트 상태

### 배지

[![CI/CD Pipeline](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/ci.yml)
[![CodeQL](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/codeql.yml/badge.svg)](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/codeql.yml)
[![codecov](https://codecov.io/gh/KRDS-MCP/krds-mcp/branch/main/graph/badge.svg)](https://codecov.io/gh/KRDS-MCP/krds-mcp)
[![Tests](https://img.shields.io/badge/tests-60%20passing-brightgreen)](https://github.com/KRDS-MCP/krds-mcp/actions)
[![Coverage](https://img.shields.io/badge/coverage-80%25-green)](https://codecov.io/gh/KRDS-MCP/krds-mcp)
[![npm version](https://img.shields.io/npm/v/@krds-mcp/krds-mcp)](https://www.npmjs.com/package/@krds-mcp/krds-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@krds-mcp/krds-mcp)](https://www.npmjs.com/package/@krds-mcp/krds-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### 품질 메트릭

- **테스트**: 60개 테스트 모두 통과 ✅
- **테스트 커버리지**: 목표 80% (현재 측정 중)
- **코드 품질**: ESLint + Prettier 통합 설정
- **보안**: CodeQL 자동 보안 스캔
- **호환성**: Node.js 18, 20, 21 지원
- **성능**: 캐싱 및 메모이제이션 최적화

## 📁 추가 파일 구조

```
krds-mcp/
├── .github/                    # GitHub 설정
│   ├── workflows/              # CI/CD 파이프라인
│   │   ├── ci.yml             # 메인 CI/CD
│   │   └── codeql.yml         # 보안 스캔
│   ├── ISSUE_TEMPLATE/        # 이슈 템플릿
│   └── pull_request_template.md
├── tests/                      # 테스트 파일
│   ├── setup.js               # 테스트 설정
│   ├── unit/                  # 유닛 테스트
│   └── integration/           # 통합 테스트
├── coverage/                   # 커버리지 보고서
├── .eslintrc.json             # ESLint 설정
├── .prettierrc.json           # Prettier 설정
├── jest.config.js             # Jest 설정
└── ...
```

## 🔗 관련 링크

- [KRDS (Korea Design System)](https://www.krds.go.kr/)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [프로젝트 이슈 트래커](https://github.com/KRDS-MCP/krds-mcp/issues)
- [기여 가이드라인](https://github.com/KRDS-MCP/krds-mcp/blob/main/CONTRIBUTING.md)
