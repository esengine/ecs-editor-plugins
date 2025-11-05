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
    lastUpdated: new Date().toISOString(),
    cdn: 'https://cdn.jsdelivr.net/gh/esengine/ecs-editor-plugins@latest',
    plugins: []
  };

  for (const category of ['official', 'community']) {
    const categoryDir = path.join(pluginsDir, category);
    if (!fs.existsSync(categoryDir)) {
      console.log(`⚠️  Category directory not found: ${category}`);
      continue;
    }

    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));

    console.log(`Found ${files.length} plugins in ${category}/`);

    for (const file of files) {
      const manifestPath = path.join(categoryDir, file);
      try {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const manifest = JSON.parse(content);

        manifest.verified = category === 'official';
        manifest.category_type = category;

        registry.plugins.push(manifest);
        console.log(`  ✓ Added: ${manifest.name} (${manifest.version})`);
      } catch (error) {
        console.error(`  ✗ Failed to process ${file}: ${error.message}`);
      }
    }
  }

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
