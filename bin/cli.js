#!/usr/bin/env node
/**
 * KRDS MCP Server CLI Entry Point
 * npx @krds-mcp/krds-mcp로 실행 가능
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = join(__dirname, '..', 'index.js');

// CLI 인자 파싱
const args = process.argv.slice(2);

// 도움말 표시
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🇰🇷 KRDS MCP Server - 한국 정부 디자인 시스템 MCP 서버

사용법:
  npx @krds-mcp/krds-mcp [옵션]

옵션:
  --help, -h     도움말 표시
  --version, -v  버전 정보 표시
  --config       설정 파일 경로 지정

설치 후 Claude Desktop 설정:
{
  "mcpServers": {
    "krds-mcp": {
      "command": "npx",
      "args": ["@krds-mcp/krds-mcp"]
    }
  }
}

더 많은 정보: https://github.com/KRDS-MCP/krds-mcp
  `);
  process.exit(0);
}

// 버전 정보 표시
if (args.includes('--version') || args.includes('-v')) {
  const { readFile } = await import('fs/promises');
  const packageContent = await readFile(join(__dirname, '..', 'package.json'), 'utf8');
  const packageJson = JSON.parse(packageContent);
  console.log(`@krds-mcp/krds-mcp v${packageJson.version}`);
  process.exit(0);
}

// MCP 서버 실행
console.log('🇰🇷 KRDS MCP 서버를 시작합니다...');

const child = spawn('node', [serverPath, ...args], {
  stdio: 'inherit',
  shell: false
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
