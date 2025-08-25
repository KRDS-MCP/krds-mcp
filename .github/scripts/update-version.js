#!/usr/bin/env node

/**
 * Pre-commit script for version update
 * package.json의 버전을 자동으로 업데이트
 */

const fs = require('fs');
const path = require('path');

// 커맨드 라인 인자에서 버전 가져오기
const newVersion = process.argv[2];

if (!newVersion) {
  console.log('No version provided, skipping version update');
  process.exit(0);
}

// package.json 경로
const packagePath = path.join(process.cwd(), 'package.json');

try {
  // package.json 읽기
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // 버전 업데이트
  const oldVersion = packageJson.version;
  packageJson.version = newVersion;

  // package.json 저장
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

  console.log(`✅ Version updated: ${oldVersion} → ${newVersion}`);

  // package-lock.json도 있으면 업데이트
  const packageLockPath = path.join(process.cwd(), 'package-lock.json');
  if (fs.existsSync(packageLockPath)) {
    const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
    packageLock.version = newVersion;
    if (packageLock.packages && packageLock.packages['']) {
      packageLock.packages[''].version = newVersion;
    }
    fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2) + '\n');
    console.log('✅ package-lock.json updated');
  }
} catch (error) {
  console.error('❌ Error updating version:', error.message);
  process.exit(1);
}
