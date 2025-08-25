/**
 * KRDS 개발자 도구 모듈
 * Storybook 통합, 실시간 미리보기, 코드 샌드박스 기능 제공
 */

import { componentLibrary } from './component-library.js';
import { KRDS_DATA } from '../data/index.js';

/**
 * 개발자 도구 설정
 */
export const DEV_TOOLS_CONFIG = {
  storybook: {
    enabled: true,
    port: 6006,
    configPath: '.storybook',
    storiesPattern: 'src/stories/**/*.stories.@(js|jsx|ts|tsx)'
  },

  preview: {
    enabled: true,
    port: 3000,
    hotReload: true,
    themes: ['light', 'dark'],
    viewports: ['mobile', 'tablet', 'desktop']
  },

  sandbox: {
    enabled: true,
    providers: ['codesandbox', 'stackblitz', 'codepen'],
    templates: ['html', 'react', 'vue', 'angular']
  }
};

/**
 * Storybook 통합 클래스
 */
export class KRDSStorybookIntegration {
  constructor() {
    this.stories = new Map();
    this.addons = [
      '@storybook/addon-docs',
      '@storybook/addon-controls',
      '@storybook/addon-viewport',
      '@storybook/addon-backgrounds',
      '@storybook/addon-accessibility',
      '@storybook/addon-actions'
    ];
  }

  /**
   * Storybook 설정 생성
   */
  generateStorybookConfig() {
    return {
      main: {
        stories: [DEV_TOOLS_CONFIG.storybook.storiesPattern],
        addons: this.addons,
        features: {
          previewCsfV3: true,
          storyStoreV7: true
        },
        framework: {
          name: '@storybook/html-webpack5',
          options: {}
        }
      },

      preview: {
        parameters: {
          actions: { argTypesRegex: '^on[A-Z].*' },
          controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
          docs: { inlineStories: true },
          backgrounds: {
            default: 'light',
            values: [
              { name: 'light', value: '#ffffff' },
              { name: 'dark', value: '#121212' }
            ]
          },
          viewport: {
            viewports: {
              mobile: { name: 'Mobile', styles: { width: '360px', height: '640px' } },
              tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
              desktop: { name: 'Desktop', styles: { width: '1200px', height: '800px' } }
            }
          }
        },

        globalTypes: {
          theme: {
            name: 'Theme',
            description: 'KRDS Theme',
            defaultValue: 'light',
            toolbar: {
              icon: 'paintbrush',
              items: [
                { value: 'light', title: 'Light Theme' },
                { value: 'dark', title: 'Dark Theme' }
              ]
            }
          }
        }
      }
    };
  }

  /**
   * 컴포넌트별 스토리 생성
   */
  generateComponentStories(componentId) {
    const component = KRDS_DATA.components.find(c => c.id === componentId);
    if (!component) {
      throw new Error(`Component not found: ${componentId}`);
    }

    const template = componentLibrary.generateTemplateFromMapping(
      { className: `krds-${componentId}`, category: component.category },
      null
    );

    return {
      title: `KRDS/${component.category}/${component.name}`,
      component: componentId,
      argTypes: this.generateArgTypes(component),
      parameters: {
        docs: {
          description: {
            component: component.description
          }
        }
      },

      // 기본 스토리
      Default: {
        args: this.getDefaultArgs(component),
        render: (args, context) => this.renderComponent(componentId, args, context.globals.theme)
      },

      // 변형 스토리들
      ...this.generateVariantStories(componentId, component, template)
    };
  }

  /**
   * ArgTypes 생성
   */
  generateArgTypes(component) {
    const argTypes = {
      theme: {
        control: { type: 'select' },
        options: ['light', 'dark'],
        defaultValue: 'light',
        description: '테마 선택'
      }
    };

    // 컴포넌트 카테고리별 매개변수 추가
    switch (component.category) {
      case 'action':
        if (component.id.includes('button')) {
          argTypes.size = {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
            defaultValue: 'medium',
            description: '버튼 크기'
          };
          argTypes.disabled = {
            control: { type: 'boolean' },
            defaultValue: false,
            description: '비활성화 상태'
          };
          argTypes.text = {
            control: { type: 'text' },
            defaultValue: '버튼',
            description: '버튼 텍스트'
          };
        }
        break;

      case 'input':
        argTypes.placeholder = {
          control: { type: 'text' },
          defaultValue: '입력하세요',
          description: '플레이스홀더 텍스트'
        };
        argTypes.disabled = {
          control: { type: 'boolean' },
          defaultValue: false,
          description: '비활성화 상태'
        };
        argTypes.readonly = {
          control: { type: 'boolean' },
          defaultValue: false,
          description: '읽기 전용 상태'
        };
        break;

      case 'feedback':
        if (component.id.includes('alert')) {
          argTypes.type = {
            control: { type: 'select' },
            options: ['success', 'warning', 'error', 'info'],
            defaultValue: 'info',
            description: '알림 타입'
          };
          argTypes.message = {
            control: { type: 'text' },
            defaultValue: '알림 메시지',
            description: '알림 내용'
          };
        }
        break;
    }

    return argTypes;
  }

  /**
   * 기본 Args 생성
   */
  getDefaultArgs(component) {
    const args = { theme: 'light' };

    switch (component.category) {
      case 'action':
        if (component.id.includes('button')) {
          args.size = 'medium';
          args.disabled = false;
          args.text = '버튼';
        }
        break;

      case 'input':
        args.placeholder = '입력하세요';
        args.disabled = false;
        args.readonly = false;
        break;

      case 'feedback':
        if (component.id.includes('alert')) {
          args.type = 'info';
          args.message = '알림 메시지';
        }
        break;
    }

    return args;
  }

  /**
   * 변형 스토리들 생성
   */
  generateVariantStories(componentId, component, template) {
    const stories = {};

    if (template.variants && template.variants.length > 0) {
      template.variants.forEach(variant => {
        const storyName = this.capitalizeFirst(variant);
        stories[storyName] = {
          args: { ...this.getDefaultArgs(component), variant },
          render: (args, context) => this.renderComponent(componentId, args, context.globals.theme)
        };
      });
    }

    // 특별한 스토리들
    if (component.category === 'action' && component.id.includes('button')) {
      stories.AllSizes = {
        render: () => this.renderAllButtonSizes(),
        parameters: { docs: { description: { story: '모든 버튼 크기 변형' } } }
      };

      stories.AllStates = {
        render: () => this.renderAllButtonStates(),
        parameters: { docs: { description: { story: '모든 버튼 상태' } } }
      };
    }

    return stories;
  }

  /**
   * 컴포넌트 렌더링
   */
  renderComponent(componentId, args, theme = 'light') {
    const template = componentLibrary.fetchComponentTemplate(componentId, args.variant);
    let html = template.html;

    // args 기반으로 HTML 수정
    if (args.text && html.includes('>버튼<')) {
      html = html.replace('>버튼<', `>${args.text}<`);
    }

    if (args.placeholder && html.includes('placeholder=')) {
      html = html.replace(/placeholder="[^"]*"/, `placeholder="${args.placeholder}"`);
    }

    if (args.message && html.includes('알림 메시지')) {
      html = html.replace('알림 메시지', args.message);
    }

    // 테마 클래스 추가
    if (theme === 'dark') {
      html = html.replace(/class="([^"]*)"/, 'class="$1 dark-mode"');
    }

    // 상태별 속성 추가
    if (args.disabled) {
      html = html.replace(/(<button[^>]*?)>/, '$1 disabled>');
      html = html.replace(/(<input[^>]*?)>/, '$1 disabled>');
    }

    if (args.readonly) {
      html = html.replace(/(<input[^>]*?)>/, '$1 readonly>');
    }

    return html;
  }

  /**
   * 모든 버튼 크기 렌더링
   */
  renderAllButtonSizes() {
    const sizes = ['small', 'medium', 'large'];
    return sizes
      .map(size => {
        return `<div style="margin: 8px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold;">${size}</label>
        <button type="button" class="krds-btn ${size}">버튼 ${size}</button>
      </div>`;
      })
      .join('');
  }

  /**
   * 모든 버튼 상태 렌더링
   */
  renderAllButtonStates() {
    const states = [
      { name: 'default', html: '<button type="button" class="krds-btn">기본</button>' },
      {
        name: 'hover',
        html: '<button type="button" class="krds-btn" style="background-color: var(--krds-light-color-primary-background-hover);">호버</button>'
      },
      {
        name: 'disabled',
        html: '<button type="button" class="krds-btn" disabled>비활성화</button>'
      }
    ];

    return states
      .map(state => {
        return `<div style="margin: 8px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold;">${state.name}</label>
        ${state.html}
      </div>`;
      })
      .join('');
  }

  /**
   * 문자열 첫 글자 대문자화
   */
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/**
 * 라이브 미리보기 클래스
 */
export class KRDSLivePreview {
  constructor() {
    this.currentTheme = 'light';
    this.currentViewport = 'desktop';
    this.hotReloadEnabled = true;
  }

  /**
   * 미리보기 HTML 생성
   */
  generatePreviewHTML(componentId, options = {}) {
    const { theme = 'light', viewport = 'desktop', props = {} } = options;

    const template = componentLibrary.fetchComponentTemplate(componentId);
    const cssTokens = this.generateThemeCSS(theme);

    return `<!DOCTYPE html>
<html lang="ko" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KRDS Component Preview - ${componentId}</title>
  <style>
    ${cssTokens}
    ${template.css}
    
    /* 미리보기 전용 스타일 */
    body {
      margin: 0;
      padding: 20px;
      font-family: var(--krds-typography-font-family-primary);
      background-color: var(--krds-light-color-neutral-background-default);
      color: var(--krds-light-color-neutral-text-primary);
      transition: var(--krds-motion-transition-colors);
    }
    
    .preview-container {
      max-width: ${this.getViewportWidth(viewport)};
      margin: 0 auto;
      padding: 20px;
      border: 1px solid var(--krds-light-color-neutral-border-default);
      border-radius: var(--krds-border-radius-base);
      background-color: var(--krds-light-color-neutral-background-default);
    }
    
    .preview-controls {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 10px;
      z-index: 1000;
    }
    
    .control-btn {
      padding: 8px 12px;
      border: 1px solid var(--krds-light-color-neutral-border-default);
      border-radius: var(--krds-border-radius-sm);
      background: var(--krds-light-color-neutral-background-default);
      color: var(--krds-light-color-neutral-text-primary);
      cursor: pointer;
      font-size: 12px;
    }
    
    .control-btn:hover {
      background: var(--krds-light-color-interactive-background-hover);
    }
    
    .control-btn.active {
      background: var(--krds-light-color-primary-background-default);
      color: var(--krds-light-color-primary-text-default);
    }
    
    /* 다크모드 스타일 */
    [data-theme="dark"] {
      ${this.generateDarkModeOverrides()}
    }
  </style>
</head>
<body>
  <div class="preview-controls">
    <button class="control-btn ${theme === 'light' ? 'active' : ''}" onclick="switchTheme('light')">
      ☀️ Light
    </button>
    <button class="control-btn ${theme === 'dark' ? 'active' : ''}" onclick="switchTheme('dark')">
      🌙 Dark
    </button>
    <select class="control-btn" onchange="switchViewport(this.value)">
      <option value="mobile" ${viewport === 'mobile' ? 'selected' : ''}>📱 Mobile</option>
      <option value="tablet" ${viewport === 'tablet' ? 'selected' : ''}>📟 Tablet</option>
      <option value="desktop" ${viewport === 'desktop' ? 'selected' : ''}>💻 Desktop</option>
    </select>
  </div>
  
  <div class="preview-container">
    <h1>KRDS Component: ${componentId}</h1>
    <div class="component-preview">
      ${template.html}
    </div>
  </div>
  
  <script>
    function switchTheme(newTheme) {
      document.documentElement.setAttribute('data-theme', newTheme);
      document.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(newTheme));
      });
      
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({ type: 'themeChange', theme: newTheme }, '*');
      }
    }
    
    function switchViewport(viewport) {
      const container = document.querySelector('.preview-container');
      container.style.maxWidth = getViewportWidth(viewport);
      
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({ type: 'viewportChange', viewport }, '*');
      }
    }
    
    function getViewportWidth(viewport) {
      const widths = {
        mobile: '360px',
        tablet: '768px',
        desktop: '1200px'
      };
      return widths[viewport] || widths.desktop;
    }
    
    // 핫 리로드 지원
    if (${DEV_TOOLS_CONFIG.preview.hotReload}) {
      const eventSource = new EventSource('/dev/hot-reload');
      eventSource.onmessage = function(event) {
        if (event.data === 'reload') {
          location.reload();
        }
      };
    }
  </script>
</body>
</html>`;
  }

  /**
   * 테마별 CSS 생성
   */
  generateThemeCSS(theme) {
    const tokens = KRDS_DATA.designTokens.tokens;
    let css = ':root {\n';

    // 기본 토큰
    Object.entries(tokens.color).forEach(([name, value]) => {
      if (theme === 'dark' && name.includes('-dark-')) {
        css += `  --${name}: ${value};\n`;
      } else if (theme === 'light' && name.includes('-light-')) {
        css += `  --${name}: ${value};\n`;
      } else if (!name.includes('-light-') && !name.includes('-dark-')) {
        css += `  --${name}: ${value};\n`;
      }
    });

    // 다른 카테고리 토큰들
    [
      'typography',
      'spacing',
      'sizing',
      'border',
      'shadow',
      'motion',
      'layout',
      'component'
    ].forEach(category => {
      if (tokens[category]) {
        Object.entries(tokens[category]).forEach(([name, value]) => {
          css += `  --${name}: ${value};\n`;
        });
      }
    });

    css += '}\n';
    return css;
  }

  /**
   * 다크모드 오버라이드 스타일
   */
  generateDarkModeOverrides() {
    return `
      color-scheme: dark;
      
      body {
        background-color: var(--krds-dark-color-neutral-background-default);
        color: var(--krds-dark-color-neutral-text-primary);
      }
      
      .preview-container {
        border-color: var(--krds-dark-color-neutral-border-default);
        background-color: var(--krds-dark-color-neutral-background-secondary);
      }
      
      .control-btn {
        border-color: var(--krds-dark-color-neutral-border-default);
        background-color: var(--krds-dark-color-neutral-background-secondary);
        color: var(--krds-dark-color-neutral-text-primary);
      }
    `;
  }

  /**
   * 뷰포트 너비 가져오기
   */
  getViewportWidth(viewport) {
    const widths = {
      mobile: '360px',
      tablet: '768px',
      desktop: '1200px'
    };
    return widths[viewport] || widths.desktop;
  }
}

/**
 * 코드 샌드박스 클래스
 */
export class KRDSCodeSandbox {
  constructor() {
    this.providers = {
      codesandbox: {
        name: 'CodeSandbox',
        url: 'https://codesandbox.io/api/v1/sandboxes/define',
        method: 'POST'
      },
      stackblitz: {
        name: 'StackBlitz',
        url: 'https://stackblitz.com/fork/',
        method: 'GET'
      },
      codepen: {
        name: 'CodePen',
        url: 'https://codepen.io/pen/define',
        method: 'POST'
      }
    };
  }

  /**
   * 샌드박스 URL 생성
   */
  generateSandboxURL(componentId, provider = 'codesandbox', template = 'html') {
    const template_data = this.generateTemplateData(componentId, template);

    switch (provider) {
      case 'codesandbox':
        return this.generateCodeSandboxURL(template_data);
      case 'stackblitz':
        return this.generateStackBlitzURL(template_data);
      case 'codepen':
        return this.generateCodePenURL(template_data);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  /**
   * 템플릿 데이터 생성
   */
  generateTemplateData(componentId, template) {
    const componentTemplate = componentLibrary.fetchComponentTemplate(componentId);

    const templates = {
      html: this.generateHTMLTemplate(componentId, componentTemplate),
      react: this.generateReactTemplate(componentId, componentTemplate),
      vue: this.generateVueTemplate(componentId, componentTemplate),
      angular: this.generateAngularTemplate(componentId, componentTemplate)
    };

    return templates[template] || templates.html;
  }

  /**
   * HTML 템플릿 생성
   */
  generateHTMLTemplate(componentId, componentTemplate) {
    return {
      'package.json': {
        content: JSON.stringify(
          {
            name: `krds-${componentId}-example`,
            version: '1.0.0',
            description: `KRDS ${componentId} component example`,
            main: 'index.html',
            scripts: {
              start: 'serve .',
              dev: 'serve .'
            },
            devDependencies: {
              serve: '^14.0.0'
            },
            keywords: ['krds', 'design-system', componentId]
          },
          null,
          2
        )
      },

      'index.html': {
        content: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KRDS ${componentId} Example</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>KRDS ${componentId} Component</h1>
    <div class="example">
      ${componentTemplate.html}
    </div>
    
    <div class="code-block">
      <h2>HTML Code</h2>
      <pre><code>${this.escapeHTML(componentTemplate.html)}</code></pre>
    </div>
  </div>
</body>
</html>`
      },

      'styles.css': {
        content: `/* KRDS Design Tokens */
${this.generateBasicCSS()}

/* Component Styles */
${componentTemplate.css}

/* Example Styles */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: var(--krds-typography-font-family-primary);
}

.example {
  padding: 20px;
  border: 1px solid var(--krds-light-color-neutral-border-default);
  border-radius: var(--krds-border-radius-base);
  margin: 20px 0;
  background-color: var(--krds-light-color-neutral-background-default);
}

.code-block {
  margin: 20px 0;
}

.code-block pre {
  background: var(--krds-light-color-neutral-background-secondary);
  padding: 16px;
  border-radius: var(--krds-border-radius-sm);
  overflow-x: auto;
}

.code-block code {
  font-family: var(--krds-typography-font-family-monospace);
  font-size: 14px;
}`
      }
    };
  }

  /**
   * React 템플릿 생성
   */
  generateReactTemplate(componentId, componentTemplate) {
    return {
      'package.json': {
        content: JSON.stringify(
          {
            name: `krds-${componentId}-react`,
            version: '1.0.0',
            dependencies: {
              react: '^18.0.0',
              'react-dom': '^18.0.0',
              'react-scripts': '^5.0.0'
            },
            scripts: {
              start: 'react-scripts start',
              build: 'react-scripts build'
            }
          },
          null,
          2
        )
      },

      'src/App.js': {
        content: `import React from 'react';
import './App.css';
import ${this.toPascalCase(componentId)}Component from './components/${this.toPascalCase(componentId)}Component';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>KRDS ${componentId} Component</h1>
        <${this.toPascalCase(componentId)}Component />
      </header>
    </div>
  );
}

export default App;`
      },

      [`src/components/${this.toPascalCase(componentId)}Component.js`]: {
        content: `import React from 'react';

const ${this.toPascalCase(componentId)}Component = () => {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${componentTemplate.html}\` }} />
  );
};

export default ${this.toPascalCase(componentId)}Component;`
      },

      'src/App.css': {
        content: `${this.generateBasicCSS()}\n${componentTemplate.css}`
      },

      'src/index.js': {
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
      },

      'public/index.html': {
        content: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>KRDS ${componentId} React Example</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`
      }
    };
  }

  /**
   * CodeSandbox URL 생성
   */
  generateCodeSandboxURL(templateData) {
    const parameters = btoa(
      JSON.stringify({
        files: templateData
      })
    );

    return `${this.providers.codesandbox.url}?parameters=${parameters}`;
  }

  /**
   * StackBlitz URL 생성
   */
  generateStackBlitzURL(templateData) {
    const projectId = `krds-${Date.now()}`;
    return `${this.providers.stackblitz.url}${projectId}`;
  }

  /**
   * CodePen URL 생성
   */
  generateCodePenURL(templateData) {
    const data = {
      title: `KRDS Component Example`,
      html: templateData['index.html']?.content || '',
      css: templateData['styles.css']?.content || '',
      js: ''
    };

    return `${this.providers.codepen.url}?data=${btoa(JSON.stringify(data))}`;
  }

  /**
   * 기본 CSS 생성
   */
  generateBasicCSS() {
    return `/* KRDS Basic Tokens */
:root {
  --krds-typography-font-family-primary: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --krds-light-color-neutral-background-default: #ffffff;
  --krds-light-color-neutral-background-secondary: #f8f9fa;
  --krds-light-color-neutral-border-default: #dee2e6;
  --krds-border-radius-base: 6px;
  --krds-border-radius-sm: 4px;
  --krds-spacing-4: 16px;
}`;
  }

  /**
   * HTML 이스케이프
   */
  escapeHTML(html) {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * PascalCase 변환
   */
  toPascalCase(str) {
    return str
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  generateVueTemplate(componentId, componentTemplate) {
    // Vue 템플릿 구현 (간소화)
    return this.generateHTMLTemplate(componentId, componentTemplate);
  }

  generateAngularTemplate(componentId, componentTemplate) {
    // Angular 템플릿 구현 (간소화)
    return this.generateHTMLTemplate(componentId, componentTemplate);
  }
}

/**
 * 개발자 도구 통합 클래스
 */
export class KRDSDevTools {
  constructor() {
    this.storybook = new KRDSStorybookIntegration();
    this.preview = new KRDSLivePreview();
    this.sandbox = new KRDSCodeSandbox();
  }

  /**
   * 전체 개발 환경 설정 생성
   */
  generateDevEnvironment(componentIds = []) {
    return {
      storybook: {
        config: this.storybook.generateStorybookConfig(),
        stories: componentIds.reduce((acc, id) => {
          acc[id] = this.storybook.generateComponentStories(id);
          return acc;
        }, {})
      },

      preview: {
        config: DEV_TOOLS_CONFIG.preview,
        templates: componentIds.reduce((acc, id) => {
          acc[id] = this.preview.generatePreviewHTML(id);
          return acc;
        }, {})
      },

      sandbox: {
        urls: componentIds.reduce((acc, id) => {
          acc[id] = {
            codesandbox: this.sandbox.generateSandboxURL(id, 'codesandbox'),
            stackblitz: this.sandbox.generateSandboxURL(id, 'stackblitz'),
            codepen: this.sandbox.generateSandboxURL(id, 'codepen')
          };
          return acc;
        }, {})
      }
    };
  }

  /**
   * 개발자 문서 생성
   */
  generateDeveloperDocs() {
    return `# KRDS 개발자 도구 가이드

## 🚀 시작하기

### Storybook 설정
\`\`\`bash
npm install --save-dev @storybook/html
npx storybook init
\`\`\`

### 라이브 미리보기 실행
\`\`\`bash
npm run dev:preview
\`\`\`

### 코드 샌드박스 활용
- CodeSandbox: 온라인 개발 환경
- StackBlitz: 브라우저 기반 IDE
- CodePen: 프로토타이핑 도구

## 📚 사용 가능한 도구

### 1. Storybook 통합
- 컴포넌트별 스토리 자동 생성
- 인터랙티브 문서화
- 접근성 테스트 자동화

### 2. 실시간 미리보기
- 핫 리로드 지원
- 다중 테마 지원 (Light/Dark)
- 반응형 뷰포트 테스트

### 3. 코드 샌드박스
- HTML, React, Vue, Angular 템플릿 지원
- 원클릭 샌드박스 생성
- 공유 가능한 예제 코드

## 🛠️ 고급 기능

### 커스텀 테마 생성
\`\`\`javascript
const customTheme = {
  name: 'custom',
  tokens: {
    // 커스텀 토큰 정의
  }
};
\`\`\`

### 컴포넌트 변형 테스트
\`\`\`javascript
// 모든 변형 자동 생성
const allVariants = devTools.generateAllVariants('button');
\`\`\`

## 📋 체크리스트

- [ ] Storybook 스토리 작성
- [ ] 접근성 테스트 통과
- [ ] 다크모드 호환성 확인
- [ ] 반응형 디자인 검증
- [ ] 코드 샌드박스 예제 생성
`;
  }
}

// 기본 인스턴스들 export
export const devTools = new KRDSDevTools();
export const storybookIntegration = new KRDSStorybookIntegration();
export const livePreview = new KRDSLivePreview();
export const codeSandbox = new KRDSCodeSandbox();
