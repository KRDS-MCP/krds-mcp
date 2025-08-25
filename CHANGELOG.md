# Changelog

All notable changes to the KRDS MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2024-08-25

### 🔧 Chores / 기타 작업

- **deps**: update dependencies and replace deprecated GitHub Actions
- **workflow**: add automatic changelog generation with conventional commits
- **release**: improve release workflow with bilingual changelog support

## [1.0.3] - 2024-08-24

### ✨ Features / 새로운 기능

- **darkmode**: 다크 모드 색상 추가 및 코드 생성 핸들러 개선
- **devtools**: 디자인 코드 개선 및 개발자 도구 개선

### 🔧 Chores / 기타 작업

- **npm**: NPM 배포를 위한 registry-url 설정 추가
- **docs**: README.md 파일의 코드 블록 형식 수정

## [1.0.2] - 2024-08-23

### 🔧 Chores / 기타 작업

- **workflow**: 릴리스 작업 흐름을 단순화하고 불필요한 단계 제거

## [1.0.1] - 2024-08-22

### ✨ Features / 새로운 기능

- **core**: Initial KRDS MCP Server implementation
- **components**: 37개 KRDS 컴포넌트 지원
- **patterns**: 11개 글로벌 패턴 및 5개 서비스 패턴 제공
- **accessibility**: WCAG 2.1 AA 기준 접근성 검증 기능
- **tokens**: 완전한 디자인 토큰 시스템 구현

### 🔧 Chores / 기타 작업

- **ci**: GitHub Actions CI/CD 파이프라인 설정
- **test**: 포괄적인 테스트 스위트 구축
- **docs**: 한국어/영어 이중 언어 문서화

---

**Full Changelog**: https://github.com/KRDS-MCP/krds-mcp/blob/main/CHANGELOG.md

## 컨벤션 / Conventions

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/) 규격을 따릅니다.

### 커밋 타입 / Commit Types

- `feat`: ✨ 새로운 기능 추가 (New features)
- `fix`: 🐛 버그 수정 (Bug fixes)
- `docs`: 📝 문서 변경 (Documentation changes)
- `style`: 💄 코드 스타일 변경 (Code style changes)
- `refactor`: ♻️ 리팩토링 (Code refactoring)
- `test`: ✅ 테스트 추가 또는 수정 (Test changes)
- `chore`: 🔧 빌드 도구, 패키지 매니저 설정 등 (Build tools, package manager, etc.)
- `perf`: ⚡ 성능 개선 (Performance improvements)
- `ci`: 🎯 CI 설정 변경 (CI configuration changes)
- `build`: 📦 빌드 시스템 변경 (Build system changes)
- `revert`: ⏪ 이전 커밋 되돌리기 (Revert previous commits)

### 예시 / Examples

```bash
feat(components): Button 컴포넌트에 다크 모드 지원 추가
fix(accessibility): 색상 대비 검증 로직 수정
docs(readme): 설치 가이드 업데이트
```
