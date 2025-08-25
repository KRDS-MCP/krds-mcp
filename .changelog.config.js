/**
 * Conventional Changelog Configuration
 * 한국어와 영어를 모두 지원하는 CHANGELOG 생성 설정
 */

module.exports = {
  // Conventional Commits 타입 정의
  types: [
    { type: 'feat', section: '✨ Features / 새로운 기능' },
    { type: 'fix', section: '🐛 Bug Fixes / 버그 수정' },
    { type: 'perf', section: '⚡ Performance / 성능 개선' },
    { type: 'refactor', section: '♻️ Refactoring / 리팩토링' },
    { type: 'style', section: '💄 Styles / 스타일' },
    { type: 'docs', section: '📝 Documentation / 문서' },
    { type: 'test', section: '✅ Tests / 테스트' },
    { type: 'build', section: '📦 Build System / 빌드 시스템' },
    { type: 'ci', section: '🎯 CI/CD' },
    { type: 'chore', section: '🔧 Chores / 기타 작업' },
    { type: 'revert', section: '⏪ Reverts / 되돌리기' }
  ],

  // 커밋 메시지 파싱 규칙
  parserOpts: {
    noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', '주요 변경사항'],
    headerPattern: /^(\w+)(?:\(([^)]*)\))?: (.+)$/,
    headerCorrespondence: ['type', 'scope', 'subject']
  },

  // CHANGELOG 생성 규칙
  writerOpts: {
    transform: (commit, context) => {
      // Breaking Changes 강조
      if (commit.notes && commit.notes.length > 0) {
        commit.important = true;
      }

      // 타입별 이모지 추가
      const typeEmojis = {
        feat: '✨',
        fix: '🐛',
        perf: '⚡',
        refactor: '♻️',
        style: '💄',
        docs: '📝',
        test: '✅',
        build: '📦',
        ci: '🎯',
        chore: '🔧',
        revert: '⏪'
      };

      if (typeEmojis[commit.type]) {
        commit.type = `${typeEmojis[commit.type]} ${commit.type}`;
      }

      // 스코프 포맷팅
      if (commit.scope === '*') {
        commit.scope = '';
      }

      // 짧은 해시 생성
      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7);
      }

      // PR 링크 추가
      if (commit.references) {
        commit.references.forEach(ref => {
          if (ref.issue) {
            ref.issueLink = `https://github.com/${context.owner}/${context.repository}/issues/${ref.issue}`;
          }
        });
      }

      return commit;
    },

    // 그룹별 정렬
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],

    // 노트 키워드
    noteGroupsSort: 'title',

    // 템플릿 커스터마이징
    mainTemplate: `{{#if unreleased}}
## [Unreleased]

{{#each commitGroups}}
{{#if commits}}
### {{title}}

{{#each commits}}
- {{#if scope}}**{{scope}}**: {{/if}}{{subject}}{{#if shortHash}} ({{shortHash}}){{/if}}
{{/each}}

{{/if}}
{{/each}}
{{/if}}
{{#each releases}}
## {{#if @root.linkCompare}}[{{version}}]({{@root.host}}/{{@root.owner}}/{{@root.repository}}/compare/{{previousTag}}...{{currentTag}}){{else}}{{version}}{{/if}}{{#if title}} - {{title}}{{/if}}{{#if date}} ({{date}}){{/if}}

{{#if major}}
### 💥 Breaking Changes / 주요 변경사항

{{#each major}}
- {{subject}}
{{/each}}

{{/if}}
{{#each commitGroups}}
{{#if commits}}
### {{title}}

{{#each commits}}
- {{#if scope}}**{{scope}}**: {{/if}}{{subject}}{{#if shortHash}} ({{shortHash}}){{/if}}
{{/each}}

{{/if}}
{{/each}}
{{#if committers}}
### Contributors / 기여자

{{#each committers}}
- {{name}} ({{email}})
{{/each}}

{{/if}}
{{/each}}
`
  }
};
