import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA = {
  required: ['id', 'name', 'version', 'author', 'description', 'category', 'repository', 'distribution', 'requirements', 'license'],
  properties: {
    id: { type: 'string', pattern: /^[a-z0-9-]+$/ },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    version: { type: 'string', pattern: /^\d+\.\d+\.\d+$/ },
    author: {
      type: 'object',
      required: ['name', 'github'],
      properties: {
        name: { type: 'string' },
        github: { type: 'string' },
        email: { type: 'string', optional: true }
      }
    },
    description: { type: 'string', minLength: 10, maxLength: 500 },
    category: {
      type: 'string',
      enum: ['Tool', 'Window', 'Inspector', 'System', 'ImportExport']
    },
    repository: {
      type: 'object',
      required: ['url'],
      properties: {
        type: { type: 'string', optional: true },
        url: { type: 'string', pattern: /^https:\/\/github\.com\/.+/ }
      }
    },
    distribution: {
      type: 'object',
      required: ['type', 'url'],
      properties: {
        type: { type: 'string', enum: ['cdn', 'npm'] },
        url: { type: 'string', pattern: /^https:\/\/.+/ },
        css: { type: 'string', optional: true }
      }
    },
    requirements: {
      type: 'object',
      required: ['ecs-version'],
      properties: {
        'ecs-version': { type: 'string' },
        'editor-version': { type: 'string', optional: true }
      }
    },
    license: { type: 'string' },
    tags: { type: 'array', optional: true },
    icon: { type: 'string', optional: true },
    homepage: { type: 'string', optional: true },
    screenshots: { type: 'array', optional: true }
  }
};

function validateValue(value, schema, fieldName) {
  const errors = [];

  if (schema.type === 'string') {
    if (typeof value !== 'string') {
      errors.push(`${fieldName} must be a string`);
      return errors;
    }
    if (schema.minLength && value.length < schema.minLength) {
      errors.push(`${fieldName} must be at least ${schema.minLength} characters`);
    }
    if (schema.maxLength && value.length > schema.maxLength) {
      errors.push(`${fieldName} must be at most ${schema.maxLength} characters`);
    }
    if (schema.pattern && !schema.pattern.test(value)) {
      errors.push(`${fieldName} format is invalid`);
    }
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(`${fieldName} must be one of: ${schema.enum.join(', ')}`);
    }
  } else if (schema.type === 'object') {
    if (typeof value !== 'object' || value === null) {
      errors.push(`${fieldName} must be an object`);
      return errors;
    }
    if (schema.required) {
      for (const requiredField of schema.required) {
        if (!(requiredField in value)) {
          errors.push(`${fieldName}.${requiredField} is required`);
        }
      }
    }
    if (schema.properties) {
      for (const [prop, propSchema] of Object.entries(schema.properties)) {
        if (prop in value) {
          errors.push(...validateValue(value[prop], propSchema, `${fieldName}.${prop}`));
        } else if (!propSchema.optional && schema.required?.includes(prop)) {
          errors.push(`${fieldName}.${prop} is required`);
        }
      }
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${fieldName} must be an array`);
    }
  }

  return errors;
}

function validateManifest(manifestPath) {
  console.log(`Validating: ${manifestPath}`);

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file not found: ${manifestPath}`);
  }

  const content = fs.readFileSync(manifestPath, 'utf-8');
  let manifest;

  try {
    manifest = JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON in ${manifestPath}: ${error.message}`);
  }

  const errors = [];

  for (const field of SCHEMA.required) {
    if (!(field in manifest)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  for (const [field, fieldSchema] of Object.entries(SCHEMA.properties)) {
    if (field in manifest) {
      errors.push(...validateValue(manifest[field], fieldSchema, field));
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation errors in ${manifestPath}:\n${errors.join('\n')}`);
  }

  console.log(`✓ Validation passed: ${manifestPath}`);
  return manifest;
}

function validateAllManifests() {
  const pluginsDir = path.resolve(__dirname, '../plugins');
  const errors = [];

  for (const category of ['official', 'community']) {
    const categoryDir = path.join(pluginsDir, category);
    if (!fs.existsSync(categoryDir)) continue;

    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const manifestPath = path.join(categoryDir, file);
      try {
        validateManifest(manifestPath);
      } catch (error) {
        errors.push(`${file}: ${error.message}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('\n❌ Validation failed:\n');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('\n✅ All manifests are valid!');
}

if (process.argv[2]) {
  validateManifest(process.argv[2]);
} else {
  validateAllManifests();
}
