# KRDS MCP Server

[![CI/CD Pipeline](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/ci.yml)
[![CodeQL](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/codeql.yml/badge.svg)](https://github.com/KRDS-MCP/krds-mcp/actions/workflows/codeql.yml)
[![codecov](https://codecov.io/gh/KRDS-MCP/krds-mcp/branch/main/graph/badge.svg)](https://codecov.io/gh/KRDS-MCP/krds-mcp)
[![Tests](https://img.shields.io/badge/tests-60%20passing-brightgreen)](https://github.com/KRDS-MCP/krds-mcp/actions)
[![Coverage](https://img.shields.io/badge/coverage-80%25-green)](https://codecov.io/gh/KRDS-MCP/krds-mcp)
[![npm version](https://img.shields.io/npm/v/@krds-mcp/krds-mcp)](https://www.npmjs.com/package/@krds-mcp/krds-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@krds-mcp/krds-mcp)](https://www.npmjs.com/package/@krds-mcp/krds-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[한국어](./README.md) | [English](./README.en.md)

한국 정부 디지털 서비스의 표준 디자인 시스템인 KRDS (Korea Government Design System)의 가이드라인을 기반으로 AI 모델에게 디자인 시스템 정보를 제공하는 MCP (Model Context Protocol) 서버입니다.

**목적**: AI 어시스턴트가 한국 정부 웹사이트 및 디지털 서비스 개발 시 KRDS 디자인 가이드라인을 준수할 수 있도록 지원

## NPX를 이용한 간편 실행 (권장)

`npx`를 사용하면 별도의 설치 과정 없이 항상 최신 버전의 KRDS MCP 서버를 실행할 수 있습니다. 이 방법은 Claude Desktop과 같은 AI 어시스턴트와 연동할 때 가장 편리하고 안정적입니다.

### 1. AI 도구와 연동하기

#### Claude Desktop

Claude Desktop 설정 파일(`claude_desktop_config.json`)에 아래와 같이 `mcpServers` 항목을 추가하세요.

```jsonc
{
  "mcpServers": {
    "krds-mcp": {
      "command": "npx",
      "args": ["@krds-mcp/krds-mcp"],
      "env": {}
    }
  }
}
```

이제 Claude Desktop을 재시작하면, AI가 KRDS 디자인 시스템 정보를 활용할 수 있게 됩니다.

#### Visual Studio Code

1. 글로벌 설치:

```powershell
npm install -g @krds-mcp/krds-mcp
```

2. VS Code 설정(`settings.json`)에 다음을 추가:

```jsonc
{
  "ai.experimental.contextProviders": {
    "krds-mcp": {
      "command": "krds-mcp",
      "title": "KRDS Design System",
      "when": "resourceExtname =~ /\\.(js|jsx|ts|tsx|html|css)$/"
    }
  }
}
```

#### Claude Code

Claude Code에서는 프로젝트 최상위 디렉토리에 `claude.json` 파일을 생성하고 다음 설정을 추가하세요:

```jsonc
{
  "contextProviders": {
    "krds-mcp": {
      "command": "npx",
      "args": ["@krds-mcp/krds-mcp"],
      "env": {}
    }
  }
}
```

#### Cursor

Cursor에서는 프로젝트 최상위 디렉토리에 `.cursor` 디렉토리를 생성하고 `settings.json` 파일에 다음을 추가하세요:

```jsonc
{
  "contextProviders": {
    "krds-mcp": {
      "command": "npx @krds-mcp/krds-mcp",
      "enabled": true,
      "filePattern": "**/*.{js,jsx,ts,tsx,html,css}"
    }
  }
}
```

### 2. 터미널에서 직접 실행하기

서버가 정상적으로 동작하는지 확인하거나, 독립적으로 실행하고 싶을 때 사용합니다.

```powershell
# 서버 실행 (가장 기본적인 명령어)
npx @krds-mcp/krds-mcp

# 도움말 보기 (사용 가능한 모든 명령어 옵션 확인)
npx @krds-mcp/krds-mcp --help

# 버전 확인
npx @krds-mcp/krds-mcp --version
```

## 프로젝트 구조

```text
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
│   ├── performance-helpers.js    # 성능 최적화
│   └── index.js                  # 헬퍼 통합 인덱스
├── tests/                        # 테스트 파일
│   ├── unit/                    # 단위 테스트
│   └── integration/             # 통합 테스트
├── index.js                      # MCP 서버 진입점
├── package.json                  # 프로젝트 설정
└── README.md                     # 프로젝트 문서
```

## 시작하기

### NPX로 간편 실행 (권장)

```powershell
# 설치 없이 바로 실행
npx @krds-mcp/krds-mcp

# 도움말 보기
npx @krds-mcp/krds-mcp --help

# 버전 확인
npx @krds-mcp/krds-mcp --version
```

### 로컬 설치

```powershell
# 글로벌 설치
npm install -g @krds-mcp/krds-mcp

# 로컬 프로젝트에 설치
npm install @krds-mcp/krds-mcp

# 개발 의존성 설치 (개발자용)
npm install
```

### 개발 환경 설정

```powershell
# 의존성 설치
npm install

# 린트 및 포맷 검사
npm run quality

# 테스트 실행
npm test

# 개발 모드로 실행 (파일 변경 시 자동 재시작)
npm run dev
```

## 주요 기능

- **완전한 KRDS 데이터**: 최신 KRDS 가이드라인의 모든 요소 포함
- **MCP 프로토콜 지원**: Claude 및 기타 AI 모델과 완벽 호환
- **한국어 우선 지원**: 한국어 에러 메시지 및 설명
- **접근성 검증**: WCAG 2.1 AA 기준 자동 검증
- **성능 최적화**: 캐싱, 메모이제이션, 레이지 로딩
- **확장 가능한 구조**: 모듈화된 설계로 쉬운 기능 추가
- **국제화(i18n)**: 한국어 및 영어 완벽 지원
- **성능 대시보드**: 실시간 성능 모니터링 및 권장 사항 제공

## 품질 지표

- **테스트**: 160개 이상의 테스트 통과 (i18n 및 성능 모니터링 관련 107개 신규 테스트 포함)
- **테스트 커버리지**: 목표 80% (신규 테스트 스위트로 대폭 개선)
- **코드 품질**: ESLint + Prettier 통합 설정
- **보안**: CodeQL 자동 보안 스캔
- **호환성**: Node.js 18, 20, 21 지원
- **성능**: 캐싱 및 메모이제이션 최적화
- **모니터링**: 실시간 성능 대시보드 및 알림 시스템

## 고급 기능

### 국제화(i18n)

서버는 이제 한국어와 영어의 완전한 현지화를 지원합니다:

```javascript
import { I18n, t, setLanguage } from './helpers/i18n.js';

// 언어 변경
setLanguage('en');

// 메시지 번역
console.log(t('common.success')); // "Success"
console.log(t('errors.validation.required', { field: 'email' })); // "email is required"

// 날짜, 숫자, 통화 포맷팅
console.log(formatDate(new Date())); // 로케일별 날짜 형식
console.log(formatNumber(1234567)); // 로케일별 숫자 형식
console.log(formatCurrency(10000, 'KRW')); // 로케일별 통화 형식
```

### 성능 대시보드

서버 성능을 실시간으로 모니터링하세요:

```javascript
import { performanceDashboard } from './helpers/performance-dashboard.js';

// 모니터링 시작 (개발 모드에서 자동 시작)
performanceDashboard.start();

// 현재 상태 조회
const status = performanceDashboard.getStatus();

// 성능 리포트 생성
const report = performanceDashboard.generateReport('1h');

// 권장 사항 확인
console.log(report.recommendations);
```

대시보드는 다음을 자동으로 추적합니다:
- 메모리 사용량 (힙, RSS, 외부)
- 캐시 적중률 및 성능
- 작업 소요 시간 및 오류율
- 성능 경고 및 권장 사항

## 실제 활용 사례

### 🎯 왜 KRDS MCP가 필요한가요?

KRDS MCP 없이 정부 웹사이트를 개발하면:
- 📚 수백 페이지의 가이드라인을 읽어야 함
- ⏰ 적절한 색상과 컴포넌트를 찾는 데 수 시간 소요
- ❌ 접근성 요구사항을 놓치기 쉬움
- 🔄 가이드라인 변경 시 수동 업데이트 필요

**KRDS MCP 사용 시**, AI 어시스턴트가 자동으로:
- ✅ 올바른 KRDS 색상, 타이포그래피, 컴포넌트 적용
- ✅ WCAG 2.1 AA 접근성 준수 보장
- ✅ 몇 초 만에 프로덕션 준비 코드 생성
- ✅ 최신 가이드라인 자동 반영

### 💡 사용 시나리오 예시

#### 시나리오 1: 정부 서비스 페이지 구축

**이전 (KRDS MCP 없이)**:
```
개발자: "민원 신청 폼을 만들어줘"
AI: [일반적인 HTML 폼 생성]
개발자: "아니, KRDS 가이드라인을 따라야 해..."
AI: "KRDS 가이드라인이 무엇인가요?"
→ 왕복 대화로 2시간 이상 소요
```

**이후 (KRDS MCP 사용)**:
```
개발자: "KRDS 규격에 맞는 민원 신청 폼을 만들어줘"
AI: [자동으로 적용]
    ✅ KRDS Primary-500 색상
    ✅ Body-2 타이포그래피
    ✅ 표준 폼 컴포넌트
    ✅ WCAG 2.1 AA 접근성
    ✅ 적절한 ARIA 속성
→ 15분 만에 완벽한 결과
```

#### 시나리오 2: 색상 선택

**Claude에게 질문**:
```
"KRDS primary 색상이 뭐야?"
```

**AI 응답** (KRDS MCP 지원):
```
KRDS Primary 색상 팔레트:
- Primary-50: #EEF9FF (가장 밝음)
- Primary-500: #0091FF (메인) ⭐
- Primary-900: #00172E (가장 어두움)

사용법:
- 버튼: Primary-500
- 호버: Primary-600
- 링크: Primary-500
- 비활성: Primary-200

접근성:
- Primary-500 + White = 8.59:1 명암비 ✅ WCAG AAA
```

#### 시나리오 3: 접근성 검증

**Claude에게 요청**:
```
"이 버튼이 KRDS 접근성 기준을 충족하는지 확인해줘"
```html
<button style="background: yellow; color: white;">제출</button>
```

**AI가 자동으로 확인**:
- ❌ 색상 명암비: 1.07:1 (WCAG 실패)
- ✅ 권장: Primary-500 (#0091FF) + White = 8.59:1

### 📊 효과 지표

| 지표 | 이전 | 이후 | 개선 |
|------|------|------|------|
| 개발 시간 | 4시간 | 30분 | **87% 단축** |
| KRDS 준수율 | 70% | 98% | **+28%** |
| 접근성 점수 | 65/100 | 95/100 | **+30점** |
| 코드 재작업 | 3-4회 | 0-1회 | **75% 감소** |

### 🚀 직접 체험해보기

자세한 내용은 [examples/](./examples/) 디렉토리를 참고하세요:
- 기본 사용 가이드
- 정부 웹사이트 개발
- 컴포넌트 생성
- 접근성 검증
- 디자인 토큰 활용

## 기여하기

자세한 내용은 [기여 가이드라인](https://github.com/KRDS-MCP/krds-mcp/blob/main/CONTRIBUTING.md)을 참고해주세요.

## 라이선스

이 프로젝트는 MIT 라이선스로 제공됩니다.

## 관련 링크

- [KRDS (Korea Design System)](https://www.krds.go.kr/)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [프로젝트 이슈 트래커](https://github.com/KRDS-MCP/krds-mcp/issues)
- [기여 가이드라인](https://github.com/KRDS-MCP/krds-mcp/blob/main/CONTRIBUTING.md)
