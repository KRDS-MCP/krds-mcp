# 릴리스 가이드

이 문서는 KRDS MCP Server의 버전 관리, GitHub 릴리스, NPM 배포를 통합 관리하는 방법을 설명합니다.

## 🔄 자동화된 릴리스 프로세스

### 1. 세미자동 릴리스 (권장)

```bash
# 패치 버전 업 (1.0.0 → 1.0.1)
npm run release:patch

# 마이너 버전 업 (1.0.0 → 1.1.0) 
npm run release:minor

# 메이저 버전 업 (1.0.0 → 2.0.0)
npm run release:major
```

**이 명령들이 수행하는 작업:**
1. `package.json` 버전 자동 업데이트
2. Git 태그 생성 (`v1.0.1` 형식)
3. GitHub에 태그 푸시
4. GitHub Actions 자동 트리거

### 2. 수동 릴리스

```bash
# 1. 품질 검사
npm run quality

# 2. 버전 수동 설정
npm version 1.2.0 --no-git-tag-version

# 3. 태그 생성 및 푸시
git add package.json
git commit -m "Release v1.2.0"
git tag v1.2.0
git push origin main --tags
```

## 🚀 GitHub Actions 자동화

`v*` 태그가 푸시되면 `.github/workflows/release.yml`이 자동 실행:

### 수행 작업:
1. **품질 검증**: lint, format, test 실행
2. **GitHub 릴리스 생성**: 
   - 태그 기반 자동 릴리스 노트
   - 설치 방법 및 변경사항 포함
3. **NPM 배포**: `@krds-mcp/krds-mcp` 패키지 배포
4. **배지 업데이트**: README의 버전 배지 자동 업데이트

## 📋 릴리스 체크리스트

### 릴리스 전 준비사항:
- [ ] 모든 테스트 통과 (`npm test`)
- [ ] 코드 품질 검사 통과 (`npm run quality`)
- [ ] 문서 업데이트 완료
- [ ] Breaking changes 확인
- [ ] CHANGELOG 작성 (선택사항)

### 릴리스 후 확인사항:
- [ ] GitHub 릴리스 페이지 확인
- [ ] NPM 패키지 배포 확인
- [ ] 배지 상태 확인
- [ ] 설치 테스트: `npx @krds-mcp/krds-mcp@latest`

## 🔐 필요한 시크릿 설정

GitHub 저장소 Settings → Secrets에서 설정:

```
NPM_TOKEN: npm 배포를 위한 토큰
GITHUB_TOKEN: 자동 생성됨 (별도 설정 불필요)
```

### NPM 토큰 생성 방법:
1. npmjs.com 로그인
2. Profile → Access Tokens
3. "Generate New Token" → "Automation" 선택
4. 생성된 토큰을 GitHub Secrets에 `NPM_TOKEN`으로 저장

## 📈 버전 명명 규칙

Semantic Versioning (SemVer) 사용:

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): 새로운 기능 추가 (하위 호환)
- **PATCH** (1.0.0 → 1.0.1): 버그 수정

### 예시:
- `1.0.1`: 버그 수정, 문서 업데이트
- `1.1.0`: 새로운 MCP 도구 추가
- `2.0.0`: API 구조 변경, Breaking change

## 🔄 자동 배포 파이프라인

```
코드 커밋 → 태그 푸시 → GitHub Actions → 품질 검사 → GitHub 릴리스 → NPM 배포 → 배지 업데이트
```

## 🛠️ 트러블슈팅

### NPM 배포 실패 시:
1. NPM_TOKEN 확인
2. 패키지명 충돌 확인
3. 버전 중복 확인

### GitHub Actions 실패 시:
1. 권한 설정 확인
2. 의존성 설치 로그 확인
3. 테스트 실패 원인 분석

## 📊 릴리스 통계

각 릴리스 후 자동 생성되는 배지들:
- 버전 배지: 현재 NPM 버전 표시
- 다운로드 배지: 월간 다운로드 수
- 테스트 배지: 테스트 통과 현황

이를 통해 프로젝트 상태를 한눈에 파악할 수 있습니다.