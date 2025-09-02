# 기여 가이드라인 (Contributing Guidelines)

[English](./CONTRIBUTING.md) | [한국어](./CONTRIBUTING.ko.md)

KRDS MCP 서버 프로젝트에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 📋 목차

- [기여하기 전에](#기여하기-전에)
- [개발 환경 설정](#개발-환경-설정)
- [코드 스타일](#코드-스타일)
- [테스트 작성](#테스트-작성)
- [Pull Request 프로세스](#pull-request-프로세스)
- [이슈 리포트](#이슈-리포트)
- [릴리스 프로세스](#릴리스-프로세스)

## 🤝 기여하기 전에

### 행동 강령

이 프로젝트는 [Contributor Covenant](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) 행동 강령을 따릅니다.

### 기여 유형

- 🐛 **버그 수정**: 기존 기능의 문제점 해결
- ✨ **새로운 기능**: 새로운 기능 추가
- 📚 **문서화**: 문서 개선 및 추가
- 🧪 **테스트**: 테스트 코드 추가 및 개선
- 🔧 **개선**: 코드 품질 및 성능 개선
- 🌐 **국제화**: 다국어 지원 개선

## 🛠️ 개발 환경 설정

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상
- Git

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/KRDS-MCP/krds-mcp.git
cd krds-mcp

# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 테스트 실행
npm test

# 코드 품질 검사
npm run quality
```

### 개발 도구

- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Jest**: 테스트 프레임워크
- **GitHub Actions**: CI/CD

## 📝 코드 스타일

### JavaScript/Node.js

- ES2022+ 문법 사용
- ES 모듈 사용 (`import`/`export`)
- 함수형 프로그래밍 패러다임 선호
- 명확한 변수명과 함수명 사용

### 주석 및 문서화

```javascript
/**
 * 사용자 인증을 처리합니다.
 * @param {string} username - 사용자명
 * @param {string} password - 비밀번호
 * @returns {Promise<boolean>} 인증 성공 여부
 * @throws {Error} 인증 실패 시
 */
async function authenticateUser(username, password) {
  // 구현...
}
```

### 파일 구조

```
krds-mcp/
├── data/           # 데이터 파일
├── handlers/       # MCP 핸들러
├── helpers/        # 유틸리티 함수
├── tests/          # 테스트 파일
├── bin/            # 실행 파일
└── docs/           # 문서
```

## 🧪 테스트 작성

### 테스트 원칙

- 모든 새로운 기능에 대한 테스트 작성
- 버그 수정 시 회귀 테스트 추가
- 테스트 커버리지 80% 이상 유지
- 명확한 테스트 설명 작성

### 테스트 구조

```javascript
describe('Component: Button', () => {
  describe('기본 동작', () => {
    test('버튼이 올바르게 렌더링되어야 함', () => {
      // 테스트 구현
    });

    test('클릭 이벤트가 올바르게 처리되어야 함', () => {
      // 테스트 구현
    });
  });

  describe('접근성', () => {
    test('WCAG 2.1 AA 기준을 준수해야 함', () => {
      // 테스트 구현
    });
  });
});
```

### 테스트 실행

```bash
# 전체 테스트 실행
npm test

# 특정 테스트 파일 실행
npm test -- tests/unit/colors.test.js

# 커버리지와 함께 실행
npm run test:coverage

# 감시 모드로 실행
npm run test:watch
```

## 🔄 Pull Request 프로세스

### 1. 이슈 생성

기능 추가나 버그 수정 전에 먼저 이슈를 생성하세요.

### 2. 브랜치 생성

```bash
# 메인 브랜치에서 최신 상태로 업데이트
git checkout main
git pull origin main

# 기능 브랜치 생성
git checkout -b feature/새로운-기능
# 또는
git checkout -b fix/버그-수정
```

### 3. 개발 및 커밋

```bash
# 변경사항 개발
# ...

# 변경사항 스테이징
git add .

# 커밋 (Conventional Commits 형식)
git commit -m "feat: 새로운 기능 추가"
git commit -m "fix: 버그 수정"
git commit -m "docs: 문서 업데이트"
```

### 4. 테스트 및 품질 검사

```bash
# 테스트 실행
npm test

# 코드 품질 검사
npm run quality

# 린트 검사
npm run lint

# 포맷 검사
npm run format:check
```

### 5. Pull Request 생성

- 명확한 제목과 설명 작성
- 관련 이슈 링크
- 변경사항 스크린샷 (UI 변경 시)
- 테스트 결과 첨부

### 6. 코드 리뷰

- 리뷰어의 피드백에 적극적으로 응답
- 필요한 경우 추가 수정
- 모든 체크리스트 항목 완료

## 🐛 이슈 리포트

### 버그 리포트

버그를 발견하셨다면 다음 정보를 포함하여 리포트해주세요:

- **버그 설명**: 명확하고 간결한 설명
- **재현 단계**: 버그를 재현하는 단계별 방법
- **예상 동작**: 올바른 동작이 무엇인지
- **실제 동작**: 실제로 발생하는 동작
- **환경 정보**: OS, Node.js 버전, 브라우저 등
- **스크린샷**: 가능한 경우 스크린샷 첨부

### 기능 요청

새로운 기능을 제안하시려면:

- **기능 설명**: 원하는 기능에 대한 명확한 설명
- **사용 사례**: 이 기능이 어떻게 사용될지
- **대안**: 고려해본 다른 해결방법
- **우선순위**: 기능의 중요도

## 🚀 릴리스 프로세스

### 버전 관리

이 프로젝트는 [Semantic Versioning](https://semver.org/)을 따릅니다:

- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 하위 호환성을 유지하는 기능 추가
- **PATCH**: 하위 호환성을 유지하는 버그 수정

### 릴리스 체크리스트

- [ ] 모든 테스트 통과
- [ ] 코드 품질 검사 통과
- [ ] 문서 업데이트 완료
- [ ] CHANGELOG.md 업데이트
- [ ] 버전 태그 생성
- [ ] npm 배포 완료

## 📞 지원 및 문의

- **이슈**: [GitHub Issues](https://github.com/KRDS-MCP/krds-mcp/issues)
- **토론**: [GitHub Discussions](https://github.com/KRDS-MCP/krds-mcp/discussions)
- **문서**: [KRDS 공식 사이트](https://www.krds.go.kr/)

## 🙏 감사의 말

이 프로젝트에 기여해주시는 모든 분들께 감사드립니다. 여러분의 기여가 한국 정부 디지털 서비스의 품질 향상에 큰 도움이 됩니다.

---

**참고**: 이 가이드라인은 프로젝트의 발전에 따라 지속적으로 업데이트됩니다. 최신 정보는 항상 이 문서를 참조해주세요.
