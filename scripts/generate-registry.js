import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateRegistry() {
  console.log('Generating plugin registry...\n');

  const pluginsDir = path.resolve(__dirname, '../plugins');
  const outputPath = path.resolve(__dirname, '../registry.json');

  const registry = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    cdn: 'https://cdn.jsdelivr.net/gh/esengine/ecs-editor-plugins@gh-pages',
    plugins: []
  };

  // 递归查找所有 manifest.json 文件
  function findManifests(dir, category) {
    const manifests = [];

    function walk(currentDir) {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          walk(itemPath);
        } else if (item === 'manifest.json') {
          manifests.push(itemPath);
        }
      }
    }

    walk(dir);
    return manifests;
  }

  // 遍历 official 和 community 目录
  for (const category of ['official', 'community']) {
    const categoryDir = path.join(pluginsDir, category);
    if (!fs.existsSync(categoryDir)) {
      console.log(`⚠️  Category directory not found: ${category}`);
      continue;
    }

    const manifestPaths = findManifests(categoryDir, category);
    console.log(`Found ${manifestPaths.length} plugins in ${category}/`);

    for (const manifestPath of manifestPaths) {

      try {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const manifest = JSON.parse(content);

        if (!manifest.latestVersion) {
          throw new Error('Missing required field: latestVersion');
        }
        if (!Array.isArray(manifest.versions) || manifest.versions.length === 0) {
          throw new Error('Missing or empty versions array');
        }

        const versions = manifest.versions;
        const latestVersion = manifest.latestVersion;
        const pluginInfo = {
          id: manifest.id,
          name: manifest.name,
          author: manifest.author,
          description: manifest.description,
          category: manifest.category,
          tags: manifest.tags || [],
          icon: manifest.icon,
          repository: manifest.repository,
          license: manifest.license,
          homepage: manifest.homepage,
          screenshots: manifest.screenshots || [],
          latestVersion: latestVersion,
          versions: versions,
          verified: category === 'official',
          category_type: category
        };

        registry.plugins.push(pluginInfo);
        console.log(`  ✓ Added: ${manifest.name} v${latestVersion} (${versions.length} version${versions.length > 1 ? 's' : ''})`);
      } catch (error) {
        console.error(`  ✗ Failed to process ${manifestPath}: ${error.message}`);
      }
    }
  }

  // 排序：官方插件优先，然后按名称排序
  registry.plugins.sort((a, b) => {
    if (a.verified !== b.verified) return b.verified ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  fs.writeFileSync(outputPath, JSON.stringify(registry, null, 2));

  console.log(`\n✅ Registry generated successfully!`);
  console.log(`   Total plugins: ${registry.plugins.length}`);
  console.log(`   Official: ${registry.plugins.filter(p => p.verified).length}`);
  console.log(`   Community: ${registry.plugins.filter(p => !p.verified).length}`);
  console.log(`   Output: ${outputPath}`);
}

generateRegistry();
