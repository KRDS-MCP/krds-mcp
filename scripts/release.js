#!/usr/bin/env node
// scripts/release.js - Cross-platform Node.js release script

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function execCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    process.exit(1);
  }
}

async function main() {
  try {
    // Get current version
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const currentVersion = packageJson.version;
    
    console.log(`🔍 Current version: ${currentVersion}`);
    
    // Ask for new version
    const newVersion = await question(`Enter new version (current: ${currentVersion}): `);
    
    if (!newVersion) {
      console.error('❌ Version cannot be empty');
      process.exit(1);
    }
    
    // Validate version format
    if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
      console.error('❌ Invalid version format. Please use semantic versioning (e.g., 1.0.8)');
      process.exit(1);
    }
    
    console.log(`🚀 Creating release for version ${newVersion}...`);
    
    // Run quality checks
    console.log('🔍 Running quality checks...');
    execCommand('npm run quality');
    
    // Update package.json version
    packageJson.version = newVersion;
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
    
    // Commit changes
    execCommand('git add package.json');
    execCommand(`git commit -m "chore(release): bump version to ${newVersion}"`);
    
    // Create and push tag
    execCommand(`git tag "v${newVersion}"`);
    execCommand('git push origin main');
    execCommand(`git push origin "v${newVersion}"`);
    
    console.log(`✅ Release v${newVersion} created successfully!`);
    console.log('🎯 GitHub Actions will now handle the release process.');
    
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();