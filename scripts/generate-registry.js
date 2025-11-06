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
    cdn: 'https://cdn.jsdelivr.net/gh/esengine/ecs-editor-plugins@latest',
    plugins: []
  };

  // 遍历 official 和 community 目录
  for (const category of ['official', 'community']) {
    const categoryDir = path.join(pluginsDir, category);
    if (!fs.existsSync(categoryDir)) {
      console.log(`⚠️  Category directory not found: ${category}`);
      continue;
    }

    // 获取该分类下的所有插件目录
    const pluginDirs = fs.readdirSync(categoryDir).filter(item => {
      const itemPath = path.join(categoryDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    console.log(`Found ${pluginDirs.length} plugins in ${category}/`);

    for (const pluginId of pluginDirs) {
      const manifestPath = path.join(categoryDir, pluginId, 'manifest.json');

      if (!fs.existsSync(manifestPath)) {
        console.log(`  ⚠️  Skipping ${pluginId}: no manifest.json`);
        continue;
      }

      try {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const manifest = JSON.parse(content);

        // 构建版本信息
        const versionInfo = {
          version: manifest.version,
          releaseDate: new Date().toISOString(),
          changes: manifest.description || 'No release notes',
          zipUrl: manifest.distribution?.url || '',
          requirements: manifest.requirements || {
            'ecs-version': '>=1.0.0'
          }
        };

        // 添加插件信息到 registry
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
          latestVersion: manifest.version,
          versions: [versionInfo],
          verified: category === 'official',
          category_type: category
        };

        registry.plugins.push(pluginInfo);
        console.log(`  ✓ Added: ${manifest.name} v${manifest.version}`);
      } catch (error) {
        console.error(`  ✗ Failed to process ${pluginId}: ${error.message}`);
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
