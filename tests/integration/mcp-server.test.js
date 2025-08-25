// Integration tests for KRDS MCP Server

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

describe('KRDS MCP Server Integration Tests', () => {
  let serverProcess;
  let isServerReady = false;

  beforeAll(async () => {
    // Start the MCP server
    serverProcess = spawn('node', ['index.js'], {
      cwd: projectRoot,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Wait for server to be ready
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server failed to start within timeout'));
      }, 10000);

      const checkServerReady = data => {
        const output = data.toString();
        if (
          output.includes('KRDS MCP 서버가 시작되었습니다') ||
          output.includes('Server started') ||
          output.includes('tools registered') ||
          output.includes('입력 검증 및 오류 처리 시스템이 활성화되었습니다')
        ) {
          isServerReady = true;
          clearTimeout(timeout);
          resolve();
        }
      };

      serverProcess.stdout.on('data', checkServerReady);
      serverProcess.stderr.on('data', checkServerReady);

      serverProcess.stderr.on('data', data => {
        const output = data.toString();

        // Don't fail on warnings, only on actual errors
        if (output.includes('Error:') && !output.includes('Warning:')) {
          clearTimeout(timeout);
          reject(new Error(`Server error: ${output}`));
        }
      });

      serverProcess.on('error', error => {
        clearTimeout(timeout);
        reject(new Error(`Failed to start server: ${error.message}`));
      });

      serverProcess.on('exit', code => {
        if (code !== 0 && code !== null) {
          clearTimeout(timeout);
          reject(new Error(`Server exited with code ${code}`));
        }
      });
    });
  }, 15000);

  afterAll(done => {
    if (serverProcess) {
      serverProcess.kill();
      serverProcess.on('exit', () => {
        done();
      });
    } else {
      done();
    }
  });

  test('server should start successfully', () => {
    expect(isServerReady).toBe(true);
    expect(serverProcess.pid).toBeDefined();
  });

  test('server should respond to simple input', done => {
    if (!isServerReady) {
      done.fail('Server not ready');
      return;
    }

    const testMessage = `${JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    })}\n`;

    let responseReceived = false;
    const timeout = setTimeout(() => {
      if (!responseReceived) {
        done.fail('No response received within timeout');
      }
    }, 5000);

    serverProcess.stdout.on('data', data => {
      const output = data.toString();
      try {
        const response = JSON.parse(output);
        if (response.id === 1) {
          responseReceived = true;
          clearTimeout(timeout);

          expect(response).toHaveProperty('result');
          expect(response.result).toHaveProperty('tools');
          expect(Array.isArray(response.result.tools)).toBe(true);
          expect(response.result.tools.length).toBeGreaterThan(0);

          done();
        }
      } catch (error) {
        // Ignore non-JSON output
      }
    });

    serverProcess.stdin.write(testMessage);
  });

  test('server should handle tool call requests', done => {
    if (!isServerReady) {
      done.fail('Server not ready');
      return;
    }

    const testMessage = `${JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'krds_get_design_principles',
        arguments: {}
      }
    })}\n`;

    let responseReceived = false;
    const timeout = setTimeout(() => {
      if (!responseReceived) {
        done.fail('No response received within timeout');
      }
    }, 5000);

    serverProcess.stdout.on('data', data => {
      const output = data.toString();
      try {
        const response = JSON.parse(output);
        if (response.id === 2) {
          responseReceived = true;
          clearTimeout(timeout);

          expect(response).toHaveProperty('result');
          expect(response.result).toHaveProperty('content');
          expect(Array.isArray(response.result.content)).toBe(true);
          expect(response.result.content.length).toBeGreaterThan(0);

          done();
        }
      } catch (error) {
        // Ignore non-JSON output
      }
    });

    serverProcess.stdin.write(testMessage);
  });

  test('server should handle invalid tool calls gracefully', done => {
    if (!isServerReady) {
      done.fail('Server not ready');
      return;
    }

    const testMessage = `${JSON.stringify({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'non_existent_tool',
        arguments: {}
      }
    })}\n`;

    let responseReceived = false;
    const timeout = setTimeout(() => {
      if (!responseReceived) {
        done.fail('No response received within timeout');
      }
    }, 5000);

    serverProcess.stdout.on('data', data => {
      const output = data.toString();
      try {
        const response = JSON.parse(output);
        if (response.id === 3) {
          responseReceived = true;
          clearTimeout(timeout);

          // Should receive an error response
          expect(response).toHaveProperty('error');
          expect(response.error).toHaveProperty('message');

          done();
        }
      } catch (error) {
        // Ignore non-JSON output
      }
    });

    serverProcess.stdin.write(testMessage);
  });

  test('server should handle multiple tool types', done => {
    if (!isServerReady) {
      done.fail('Server not ready');
      return;
    }

    const testMessage = `${JSON.stringify({
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'krds_get_colors',
        arguments: { category: 'primary' }
      }
    })}\n`;

    let responseReceived = false;
    const timeout = setTimeout(() => {
      if (!responseReceived) {
        done.fail('No response received within timeout');
      }
    }, 5000);

    serverProcess.stdout.on('data', data => {
      const output = data.toString();
      try {
        const response = JSON.parse(output);
        if (response.id === 4) {
          responseReceived = true;
          clearTimeout(timeout);

          expect(response).toHaveProperty('result');
          expect(response.result).toHaveProperty('content');
          expect(Array.isArray(response.result.content)).toBe(true);

          done();
        }
      } catch (error) {
        // Ignore non-JSON output
      }
    });

    serverProcess.stdin.write(testMessage);
  });
});
