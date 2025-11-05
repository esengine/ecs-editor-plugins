import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DANGEROUS_PATTERNS = [
  { pattern: /eval\s*\(/g, message: 'Usage of eval() is not allowed' },
  { pattern: /Function\s*\(/g, message: 'Usage of Function() constructor is not allowed' },
  { pattern: /new\s+Function\s*\(/g, message: 'Usage of new Function() is not allowed' },
  { pattern: /\.innerHTML\s*=/g, message: 'Direct innerHTML assignment is discouraged (XSS risk)' },
  { pattern: /document\.write\s*\(/g, message: 'Usage of document.write() is not allowed' },
  { pattern: /dangerouslySetInnerHTML/g, message: 'Usage of dangerouslySetInnerHTML is discouraged' },
  { pattern: /__proto__/g, message: 'Prototype pollution risk detected' },
  { pattern: /child_process/g, message: 'Usage of child_process is not allowed' },
  { pattern: /require\s*\(\s*['"`]fs['"`]\s*\)/g, message: 'File system access should be through API only' }
];

async function checkGitHubRepository(repoUrl) {
  console.log(`\nChecking repository: ${repoUrl}`);

  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');

  const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Repository not found or not accessible: ${repoUrl}`);
    }

    const repoData = await response.json();
    console.log(`✓ Repository exists: ${repoData.full_name}`);
    console.log(`  - Stars: ${repoData.stargazers_count}`);
    console.log(`  - License: ${repoData.license?.spdx_id || 'None'}`);
    console.log(`  - Last updated: ${repoData.updated_at}`);

    return repoData;
  } catch (error) {
    throw new Error(`Failed to check repository: ${error.message}`);
  }
}

async function checkDistributionUrl(distUrl) {
  console.log(`\nChecking distribution URL: ${distUrl}`);

  try {
    const response = await fetch(distUrl, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Distribution URL not accessible (HTTP ${response.status})`);
    }
    console.log(`✓ Distribution URL is accessible`);
    return true;
  } catch (error) {
    throw new Error(`Failed to check distribution URL: ${error.message}`);
  }
}

async function scanRepositoryCode(repoUrl) {
  console.log(`\nScanning repository code for security issues...`);

  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');

  const searchUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/contents`;

  try {
    const response = await fetch(searchUrl);
    if (!response.ok) return;

    const files = await response.json();
    const warnings = [];

    for (const file of files) {
      if (file.type === 'file' && (file.name.endsWith('.ts') || file.name.endsWith('.js'))) {
        const fileResponse = await fetch(file.download_url);
        const content = await fileResponse.text();

        for (const { pattern, message } of DANGEROUS_PATTERNS) {
          if (pattern.test(content)) {
            warnings.push(`${file.name}: ${message}`);
          }
        }
      }
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  Security warnings found:');
      warnings.forEach(w => console.log(`  - ${w}`));
      console.log('\nPlease review these patterns manually.');
    } else {
      console.log('✓ No obvious security issues detected');
    }

  } catch (error) {
    console.log(`⚠️  Could not scan repository: ${error.message}`);
  }
}

async function checkManifestSecurity(manifestPath) {
  console.log(`\n=== Security Check for ${path.basename(manifestPath)} ===`);

  const content = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(content);

  await checkGitHubRepository(manifest.repository.url);

  await checkDistributionUrl(manifest.distribution.url);

  if (manifest.distribution.css) {
    await checkDistributionUrl(manifest.distribution.css);
  }

  await scanRepositoryCode(manifest.repository.url);

  console.log(`\n✅ Security check completed for ${manifest.name}`);
}

async function checkAllManifests() {
  const pluginsDir = path.resolve(__dirname, '../plugins');
  const errors = [];

  for (const category of ['official', 'community']) {
    const categoryDir = path.join(pluginsDir, category);
    if (!fs.existsSync(categoryDir)) continue;

    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const manifestPath = path.join(categoryDir, file);
      try {
        await checkManifestSecurity(manifestPath);
      } catch (error) {
        errors.push(`${file}: ${error.message}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('\n❌ Security check failed:\n');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('\n✅ All security checks passed!');
}

if (process.argv[2]) {
  await checkManifestSecurity(process.argv[2]);
} else {
  await checkAllManifests();
}
