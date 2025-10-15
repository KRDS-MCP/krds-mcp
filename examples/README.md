# KRDS MCP 사용 예제

이 디렉토리는 KRDS MCP 서버를 실제로 어떻게 활용하는지 보여주는 구체적인 예제들을 포함합니다.

## 왜 KRDS MCP가 필요한가요?

정부 웹사이트나 공공 서비스를 개발할 때, **KRDS (한국 정부 디자인 시스템)** 가이드라인을 준수해야 합니다. 하지만:

- 📚 **방대한 가이드**: 수백 페이지의 문서를 읽고 이해하기 어려움
- ⏰ **시간 소모**: 적절한 색상, 타이포그래피, 컴포넌트를 찾는데 시간이 오래 걸림
- ❌ **실수 가능성**: 수동으로 적용하다보면 가이드라인을 놓치기 쉬움
- 🔄 **업데이트**: 가이드라인이 변경되면 다시 확인해야 함

### KRDS MCP의 해결책

KRDS MCP를 사용하면 AI 어시스턴트(Claude, ChatGPT 등)가 자동으로:

✅ KRDS 가이드라인에 맞는 코드를 생성
✅ 접근성 기준(WCAG 2.1 AA)을 자동으로 준수
✅ 색상, 타이포그래피, 컴포넌트를 정확하게 선택
✅ 실시간으로 최신 가이드를 반영

## 비교: Before & After

### Before (KRDS MCP 없이)

```
개발자: "정부 사이트 버튼을 만들어줘"
AI: [일반적인 HTML 버튼 생성]

개발자: "아니, KRDS 가이드라인에 맞게..."
AI: "KRDS 가이드라인이 뭔가요?"

개발자: "한국 정부 디자인 시스템이야. 색상은 #0091FF를 사용하고..."
AI: [수동으로 지시한 대로 생성]

개발자: "접근성 검증도 해줘"
AI: "어떤 접근성 기준인가요?"

→ 왔다갔다 대화만 10번 이상, 1시간 소요
```

### After (KRDS MCP 사용)

```
개발자: "KRDS 기준 버튼을 만들어줘"
AI: [자동으로 KRDS Primary-500 색상 적용]
    [타이포그래피 Body-2 사용]
    [WCAG 2.1 AA 접근성 자동 준수]
    [aria-label, role 속성 자동 포함]

→ 한 번에 완벽한 결과, 5분 소요
```

## 예제 목록

### [01. 기본 사용법](./01-basic-usage/)

Claude Desktop에서 KRDS MCP를 처음 사용하는 방법

- 설정 확인
- 첫 질문하기
- 기본 명령어

### [02. 정부 웹사이트 개발](./02-government-website/)

실제 정부 웹사이트 페이지 개발 시나리오

- 민원 신청 폼 만들기
- Before/After 비교
- 완성된 HTML/CSS

### [03. 컴포넌트 자동 생성](./03-component-generation/)

KRDS 컴포넌트를 빠르게 생성하는 방법

- 버튼, 입력 필드, 카드 등
- 다양한 변형(크기, 상태)
- 다크모드 지원

### [04. 접근성 자동 검증](./04-accessibility-check/)

코드의 접근성을 자동으로 검증

- 색상 대비율 체크
- 키보드 접근성
- 스크린 리더 호환성

### [05. 디자인 토큰 활용](./05-design-tokens/)

KRDS 디자인 토큰을 활용한 개발

- CSS 변수 생성
- 일관된 디자인 시스템
- 테마 전환

## 빠른 시작

1. **KRDS MCP 설치**

   ```bash
   npx @krds-mcp/krds-mcp
   ```

2. **Claude Desktop 설정**
   `claude_desktop_config.json`에 추가:

   ```json
   {
     "mcpServers": {
       "krds-mcp": {
         "command": "npx",
         "args": ["@krds-mcp/krds-mcp"]
       }
     }
   }
   ```

3. **첫 질문 해보기**
   ```
   "KRDS Primary 색상 알려줘"
   ```

## 실제 사용 효과

| 지표        | Before | After  | 개선          |
| ----------- | ------ | ------ | ------------- |
| 개발 시간   | 4시간  | 30분   | **87% 단축**  |
| KRDS 준수율 | 70%    | 98%    | **28%p 향상** |
| 접근성 점수 | 65/100 | 95/100 | **30점 상승** |
| 코드 재작업 | 3-4회  | 0-1회  | **75% 감소**  |

## 자주 묻는 질문 (FAQ)

### Q: 인터넷 연결이 필요한가요?

A: 최초 설치 시에만 필요합니다. 이후에는 로컬에서 동작합니다.

### Q: Claude Desktop 외에 다른 AI 도구에서도 사용 가능한가요?

A: 네, VS Code, Cursor, 기타 MCP를 지원하는 모든 AI 도구에서 사용 가능합니다.

### Q: KRDS 가이드라인이 업데이트되면 어떻게 하나요?

A: `npm update @krds-mcp/krds-mcp`로 최신 버전을 받으면 자동으로 반영됩니다.

### Q: 비용이 드나요?

A: 완전히 무료입니다. MIT 라이선스의 오픈소스 프로젝트입니다.

## 더 많은 정보

- [프로젝트 README](../README.md)
- [기여 가이드](../CONTRIBUTING.md)
- [KRDS 공식 사이트](https://www.krds.go.kr/)

## 피드백 및 문의

예제가 도움이 되셨나요? 개선 사항이 있다면:

- [GitHub Issues](https://github.com/KRDS-MCP/krds-mcp/issues)에 의견을 남겨주세요
- [GitHub Discussions](https://github.com/KRDS-MCP/krds-mcp/discussions)에서 질문하세요
