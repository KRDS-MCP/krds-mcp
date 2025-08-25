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
  let messageId = 1;

  // Helper to send a request and get a response
  const callTool = (name, params) => {
    return new Promise((resolve, reject) => {
      if (!isServerReady) {
        reject(new Error('Server not ready'));
        return;
      }

      const currentId = messageId++;
      const request = {
        jsonrpc: '2.0',
        id: currentId,
        method: 'tools/call',
        params: { name, arguments: params }
      };

      const responseListener = data => {
        const output = data.toString();
        // Process each JSON object in the buffer
        output
          .split('\n')
          .filter(line => line.trim())
          .forEach(line => {
            try {
              const response = JSON.parse(line);
              if (response.id === currentId) {
                // Clean up listener to avoid memory leaks
                serverProcess.stdout.removeListener('data', responseListener);
                clearTimeout(timeout);
                resolve(response);
              }
            } catch (e) {
              // Ignore non-JSON output
            }
          });
      };

      const timeout = setTimeout(() => {
        serverProcess.stdout.removeListener('data', responseListener);
        reject(new Error(`Timeout waiting for response for tool: ${name}`));
      }, 10000);

      serverProcess.stdout.on('data', responseListener);
      serverProcess.stdin.write(`${JSON.stringify(request)}\n`);
    });
  };

  beforeAll(async () => {
    serverProcess = spawn('node', ['index.js'], {
      cwd: projectRoot,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server failed to start within timeout'));
      }, 15000);

      const onData = data => {
        const output = data.toString();
        if (output.includes('KRDS MCP 서버가 시작되었습니다')) {
          isServerReady = true;
          clearTimeout(timeout);
          // Clean up listeners
          serverProcess.stdout.removeListener('data', onData);
          serverProcess.stderr.removeListener('data', onData);
          resolve();
        } else if (output.includes('Error:')) {
          clearTimeout(timeout);
          reject(new Error(`Server error on startup: ${output}`));
        }
      };

      serverProcess.stdout.on('data', onData);
      serverProcess.stderr.on('data', onData);
    });
  }, 20000);

  afterAll(done => {
    if (serverProcess) {
      serverProcess.kill();
    }
    done();
  });

  test('server should start successfully', () => {
    expect(isServerReady).toBe(true);
    expect(serverProcess.pid).toBeDefined();
  });

  describe('Tool: krds_get_design_principles', () => {
    test('should return all principles', async () => {
      const response = await callTool('krds_get_design_principles', {});
      expect(response.result).toBeDefined();
      expect(response.result.content.length).toBeGreaterThan(0);
    });
  });

  describe('Tool: krds_get_colors', () => {
    test('should return primary colors', async () => {
      const response = await callTool('krds_get_colors', { category: 'primary' });
      expect(response.result).toBeDefined();
      expect(response.result.content.length).toBeGreaterThan(0);
    });
  });

  describe('Tool: krds_validate_accessibility', () => {
    test('should validate correct HTML', async () => {
      const response = await callTool('krds_validate_accessibility', {
        htmlCode: '<html><body><button>Test</button></body></html>'
      });
      expect(response.result).toBeDefined();
      expect(response.result.content[0].text).toContain('접근성 검증 결과');
    });

    test('should fail without htmlCode', async () => {
      const response = await callTool('krds_validate_accessibility', {});
      expect(response.error).toBeDefined();
      expect(response.error.code).toBe(-32600); // Invalid Request, as per current server implementation
      expect(response.error.message).toContain('htmlCode');
    });
  });

  describe('Tool: krds_search', () => {
    test('should return results for a valid query', async () => {
      const response = await callTool('krds_search', { query: '버튼' });
      expect(response.result).toBeDefined();
      expect(response.result.content.length).toBeGreaterThan(0);
    });

    test('should fail without a query', async () => {
      const response = await callTool('krds_search', { type: 'all' });
      expect(response.error).toBeDefined();
      expect(response.error.code).toBe(-32600);
      expect(response.error.message).toContain('query');
    });
  });

  describe('Tool: krds_generate_code', () => {
    test('should generate code for a component', async () => {
      const response = await callTool('krds_generate_code', {
        type: 'component',
        id: 'accordion'
      });
      expect(response.result).toBeDefined();
      expect(response.result.content[0].text).toContain('accordion');
    });

    test('should fail without a type', async () => {
      const response = await callTool('krds_generate_code', { id: 'accordion' });
      expect(response.error).toBeDefined();
      expect(response.error.code).toBe(-32600);
      expect(response.error.message).toContain('type');
    });

    test('should fail without an id', async () => {
      const response = await callTool('krds_generate_code', { type: 'component' });
      expect(response.error).toBeDefined();
      expect(response.error.code).toBe(-32600);
      expect(response.error.message).toContain('id');
    });

    test('should fail with an invalid type', async () => {
      const response = await callTool('krds_generate_code', {
        type: 'invalid-type',
        id: 'accordion'
      });
      expect(response.error).toBeDefined();
      expect(response.error.code).toBe(-32600);
      expect(response.error.message).toContain('type');
    });
  });

  describe('Tool: krds_get_stats', () => {
    test('should return basic stats', async () => {
      const response = await callTool('krds_get_stats', {});
      expect(response.result).toBeDefined();
      expect(response.result.content[0].text).toContain('컴포넌트');
    });
  });

  describe('Error Handling', () => {
    test('should return an error for a non-existent tool', async () => {
      const response = await callTool('non_existent_tool', {});
      expect(response.error).toBeDefined();
      expect(response.error.code).toBe(-32601); // Method not found
      expect(response.error.message).toContain('non_existent_tool');
    });
  });
});
