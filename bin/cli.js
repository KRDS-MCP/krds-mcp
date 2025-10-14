#!/usr/bin/env node
/**
 * KRDS MCP Server CLI Entry Point
 * npx @krds-mcp/krds-mcp로 실행 가능
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile, access } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = join(__dirname, '..', 'index.js');

// CLI 인자 파싱
const args = process.argv.slice(2);

/**
 * 도움말 표시
 */
function showHelp() {
  console.log(`
🇰🇷 KRDS MCP Server - 한국 정부 디자인 시스템 MCP 서버

사용법:
  npx @krds-mcp/krds-mcp [명령어] [옵션]

명령어:
  start           서버 시작 (기본값)
  config          설정 파일 생성
  validate        설정 파일 검증
  test            테스트 실행
  info            시스템 정보 표시
  debug           디버그 모드로 실행

옵션:
  --help, -h           도움말 표시
  --version, -v       버전 정보 표시
  --config <path>     설정 파일 경로 지정
  --debug             디버그 모드 활성화
  --verbose           상세 로그 출력
  --port <number>     포트 번호 (개발 모드)
  --host <host>       호스트 주소 (개발 모드)

설치 후 Claude Desktop 설정:
{
  "mcpServers": {
    "krds-mcp": {
      "command": "npx",
      "args": ["@krds-mcp/krds-mcp"]
    }
  }
}

예시:
  npx @krds-mcp/krds-mcp start
  npx @krds-mcp/krds-mcp config
  npx @krds-mcp/krds-mcp validate
  npx @krds-mcp/krds-mcp --debug

더 많은 정보: https://github.com/KRDS-MCP/krds-mcp
  `);
}

/**
 * 버전 정보 표시
 */
async function showVersion() {
  try {
    const packageContent = await readFile(join(__dirname, '..', 'package.json'), 'utf8');
    const packageJson = JSON.parse(packageContent);
    console.log(`@krds-mcp/krds-mcp v${packageJson.version}`);
    console.log(`Node.js ${process.version}`);
    console.log(`Platform: ${process.platform} ${process.arch}`);
  } catch (error) {
    console.error('버전 정보를 읽을 수 없습니다:', error.message);
    process.exit(1);
  }
}

/**
 * 설정 파일 생성
 */
async function generateConfig() {
  const configTemplate = {
    mcpServers: {
      'krds-mcp': {
        command: 'npx',
        args: ['@krds-mcp/krds-mcp'],
        env: {
          NODE_ENV: 'production',
          DEBUG: 'false'
        }
      }
    }
  };

  const configPath = join(process.cwd(), 'claude_desktop_config.json');

  try {
    await writeFile(configPath, JSON.stringify(configTemplate, null, 2), 'utf8');
    console.log(`✅ 설정 파일이 생성되었습니다: ${configPath}`);
    console.log('📝 Claude Desktop에서 이 파일을 사용하세요.');
  } catch (error) {
    console.error('❌ 설정 파일 생성 실패:', error.message);
    process.exit(1);
  }
}

/**
 * 설정 파일 검증
 */
async function validateConfig() {
  const configPath = join(process.cwd(), 'claude_desktop_config.json');

  try {
    await access(configPath);
    const configContent = await readFile(configPath, 'utf8');
    const config = JSON.parse(configContent);

    if (config.mcpServers && config.mcpServers['krds-mcp']) {
      console.log('✅ 설정 파일이 유효합니다.');
      console.log('📋 현재 설정:');
      console.log(JSON.stringify(config.mcpServers['krds-mcp'], null, 2));
    } else {
      console.log('⚠️  설정 파일에 krds-mcp 서버 설정이 없습니다.');
      console.log('💡 "npx @krds-mcp/krds-mcp config" 명령어로 설정 파일을 생성하세요.');
    }
  } catch (error) {
    console.log('❌ 설정 파일을 찾을 수 없습니다.');
    console.log('💡 "npx @krds-mcp/krds-mcp config" 명령어로 설정 파일을 생성하세요.');
  }
}

/**
 * 시스템 정보 표시
 */
async function showSystemInfo() {
  try {
    const packageContent = await readFile(join(__dirname, '..', 'package.json'), 'utf8');
    const packageJson = JSON.parse(packageContent);

    console.log('🔍 KRDS MCP Server 시스템 정보');
    console.log('================================');
    console.log(`버전: ${packageJson.version}`);
    console.log(`Node.js: ${process.version}`);
    console.log(`플랫폼: ${process.platform} ${process.arch}`);
    console.log(`메모리: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB 사용 중`);
    console.log(`업타임: ${Math.round(process.uptime())}초`);
    console.log(`작업 디렉토리: ${process.cwd()}`);
    console.log(`서버 경로: ${serverPath}`);

    // 서버 파일 존재 확인
    if (existsSync(serverPath)) {
      console.log('✅ 서버 파일이 존재합니다.');
    } else {
      console.log('❌ 서버 파일을 찾을 수 없습니다.');
    }

    console.log('================================');
  } catch (error) {
    console.error('시스템 정보를 읽을 수 없습니다:', error.message);
  }
}

/**
 * 테스트 실행
 */
function runTests() {
  console.log('🧪 KRDS MCP Server 테스트를 실행합니다...');

  const testProcess = spawn('npm', ['test'], {
    stdio: 'inherit',
    shell: true,
    cwd: join(__dirname, '..')
  });

  testProcess.on('error', error => {
    console.error('❌ 테스트 실행 오류:', error.message);
    process.exit(1);
  });

  testProcess.on('exit', code => {
    if (code === 0) {
      console.log('✅ 모든 테스트가 통과했습니다.');
    } else {
      console.log('❌ 일부 테스트가 실패했습니다.');
    }
    process.exit(code || 0);
  });
}

// 명령어 처리 (async IIFE로 감싸기)
(async () => {
  const command = args[0];

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    await showVersion();
    process.exit(0);
  }

  // 명령어별 실행
  switch (command) {
    case 'config':
      await generateConfig();
      break;

    case 'validate':
      await validateConfig();
      break;

    case 'test':
      runTests();
      break;

    case 'info':
      await showSystemInfo();
      break;

    case 'start':
    case undefined:
      // MCP 서버 실행
      console.log('🇰🇷 KRDS MCP 서버를 시작합니다...');

      // 디버그 모드 확인
      const isDebugMode = args.includes('--debug') || process.env.DEBUG === 'true';
      const isVerbose = args.includes('--verbose');

      if (isDebugMode) {
        console.log('🐛 디버그 모드가 활성화되었습니다.');
        process.env.DEBUG = 'true';
      }

      if (isVerbose) {
        console.log('📝 상세 로그가 활성화되었습니다.');
        process.env.DEBUG_VERBOSE = 'true';
      }

      const child = spawn('node', [serverPath, ...args.filter(arg => !arg.startsWith('--'))], {
        stdio: 'inherit',
        shell: false,
        env: {
          ...process.env,
          NODE_ENV: isDebugMode ? 'development' : 'production'
        }
      });

      child.on('error', error => {
        console.error('❌ KRDS MCP 서버 실행 오류:', error.message);
        process.exit(1);
      });

      child.on('exit', code => {
        process.exit(code || 0);
      });

      // Graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 KRDS MCP 서버를 종료합니다...');
        child.kill('SIGINT');
      });

      process.on('SIGTERM', () => {
        child.kill('SIGTERM');
      });
      break;

    default:
      console.error(`❌ 알 수 없는 명령어: ${command}`);
      console.log('💡 "npx @krds-mcp/krds-mcp --help"로 사용법을 확인하세요.');
      process.exit(1);
  }
})().catch(error => {
  console.error('❌ 실행 오류:', error.message);
  if (process.env.DEBUG === 'true') {
    console.error(error.stack);
  }
  process.exit(1);
});
