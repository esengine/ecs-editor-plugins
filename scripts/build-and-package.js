#!/usr/bin/env node

/**
 * 自动构建和打包插件
 *
 * 用法:
 *   node scripts/build-and-package.js <category> <pluginId> <version>
 *
 * 示例:
 *   node scripts/build-and-package.js official behavior-tree-editor 1.0.0
 *   node scripts/build-and-package.js community my-plugin 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const CATEGORY = process.argv[2]; // official or community
const PLUGIN_ID = process.argv[3];
const VERSION = process.argv[4];

if (!CATEGORY || !PLUGIN_ID || !VERSION) {
    console.error('Usage: node build-and-package.js <category> <pluginId> <version>');
    console.error('Example: node build-and-package.js official behavior-tree-editor 1.0.0');
    process.exit(1);
}

const PLUGIN_DIR = path.join(__dirname, '..', 'plugins', CATEGORY, PLUGIN_ID);
const MANIFEST_PATH = path.join(PLUGIN_DIR, 'manifest.json');
const VERSIONS_DIR = path.join(PLUGIN_DIR, 'versions');
const ZIP_FILE = path.join(VERSIONS_DIR, `${VERSION}.zip`);
const TEMP_DIR = path.join(__dirname, '..', '.temp', `${PLUGIN_ID}-${VERSION}`);

console.log(`📦 Building and packaging ${CATEGORY}/${PLUGIN_ID} v${VERSION}...\n`);

// 1. 读取 manifest
if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ Manifest not found: ${MANIFEST_PATH}`);
    process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// 2. 验证版本号
const versionInfo = manifest.versions.find(v => v.version === VERSION);
if (!versionInfo) {
    console.error(`❌ Version ${VERSION} not found in manifest.json`);
    process.exit(1);
}

// 3. 检查 ZIP 是否已存在
if (fs.existsSync(ZIP_FILE)) {
    console.error(`❌ Version ${VERSION} already exists: ${ZIP_FILE}`);
    console.error('   Versions are immutable. Please increment the version number.');
    process.exit(1);
}

// 4. 确保 versions 目录存在
if (!fs.existsSync(VERSIONS_DIR)) {
    fs.mkdirSync(VERSIONS_DIR, { recursive: true });
}

// 5. 确保临时目录存在
if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TEMP_DIR, { recursive: true });

try {
    console.log('📥 Cloning repository...');

    // 6. 克隆仓库
    const repoUrl = manifest.repository.url;
    const cloneDir = path.join(TEMP_DIR, 'repo');

    execSync(`git clone --depth 1 ${repoUrl} "${cloneDir}"`, {
        stdio: 'inherit',
        cwd: TEMP_DIR
    });

    // 7. 确定构建目录
    let buildDir;

    if (CATEGORY === 'official') {
        // 官方插件：从 packages/<plugin-id> 构建
        buildDir = path.join(cloneDir, 'packages', PLUGIN_ID);
    } else {
        // 社区插件：从根目录构建
        buildDir = cloneDir;
    }

    if (!fs.existsSync(buildDir)) {
        console.error(`❌ Build directory not found: ${buildDir}`);
        process.exit(1);
    }

    console.log(`📂 Build directory: ${buildDir}\n`);

    // 8. 安装依赖
    console.log('📥 Installing dependencies...');
    execSync('npm install', {
        stdio: 'inherit',
        cwd: buildDir
    });

    // 9. 构建项目
    console.log('\n🔨 Building project...');
    execSync('npm run build', {
        stdio: 'inherit',
        cwd: buildDir
    });

    // 10. 验证构建产物
    const distDir = path.join(buildDir, 'dist');
    if (!fs.existsSync(distDir)) {
        console.error('❌ Build failed: dist/ directory not found');
        process.exit(1);
    }

    // 11. 打包成 ZIP
    console.log('\n📦 Creating ZIP archive...');

    // 使用 PowerShell 创建 ZIP（Windows）
    const zipCommand = `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${ZIP_FILE}' -Force"`;
    execSync(zipCommand, { stdio: 'inherit' });

    // 12. 验证 ZIP 文件
    if (!fs.existsSync(ZIP_FILE)) {
        console.error('❌ Failed to create ZIP file');
        process.exit(1);
    }

    const zipSize = fs.statSync(ZIP_FILE).size;
    console.log(`\n✅ Package created successfully!`);
    console.log(`   File: ${ZIP_FILE}`);
    console.log(`   Size: ${(zipSize / 1024).toFixed(2)} KB`);

    // 13. 清理临时目录
    console.log('\n🧹 Cleaning up...');
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    console.log('\n✨ Done!');

} catch (error) {
    console.error('\n❌ Build failed:', error.message);

    // 清理临时目录
    if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }

    process.exit(1);
}
