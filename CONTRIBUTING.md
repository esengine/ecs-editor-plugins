# Contributing to ECS Editor Plugins

Thank you for your interest in contributing to the ECS Editor Plugins marketplace! This document provides guidelines for submitting your plugin.

## 📋 Prerequisites

Before submitting your plugin, ensure:

1. ✅ Your plugin is in a **public GitHub repository**
2. ✅ Plugin implements the `IEditorModule` interface
3. ✅ Includes a `manifest.json` file with all required fields
4. ✅ Has a clear README with usage instructions
5. ✅ Is licensed under an open source license (MIT, Apache 2.0, GPL, etc.)
6. ✅ Has been tested with the latest ECS Editor version

## 🚀 Submission Process

### Step 1: Develop Your Plugin

Use our [Plugin Template](PLUGIN_TEMPLATE/) as a starting point:

```bash
# Clone or download the template
cp -r PLUGIN_TEMPLATE my-awesome-plugin
cd my-awesome-plugin

# Install dependencies
npm install

# Start development
npm run dev
```

See the [Plugin Development Guide](docs/PLUGIN_DEVELOPMENT.md) for detailed instructions.

### Step 2: Build and Test

```bash
# Build your plugin
npm run build

# Test in ECS Editor
# Copy dist/ to <project>/plugins/my-plugin/
```

Make sure your plugin:
- Loads without errors
- Doesn't conflict with other plugins
- Follows ECS Editor best practices
- Has good performance

### Step 3: Publish to GitHub

```bash
# Commit your code
git add .
git commit -m "Initial release"

# Tag your version
git tag v1.0.0
git push origin main --tags

# Create a GitHub Release (optional but recommended)
gh release create v1.0.0 --notes "Initial release"
```

### Step 4: Create Metadata File

Fork this repository and create a JSON file in `plugins/community/`:

```bash
# Fork the repository
gh repo fork esengine/ecs-editor-plugins

# Clone your fork
git clone https://github.com/YOUR_USERNAME/ecs-editor-plugins.git
cd ecs-editor-plugins

# Create your plugin metadata
nano plugins/community/my-awesome-plugin.json
```

Use this template for your JSON file:

```json
{
  "id": "my-awesome-plugin",
  "name": "My Awesome Plugin",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "github": "yourusername",
    "email": "you@example.com"
  },
  "description": "A detailed description of what your plugin does (min 10 chars, max 500)",
  "category": "Tool",
  "tags": ["utility", "helper", "tool"],
  "icon": "Package",
  "repository": {
    "type": "github",
    "url": "https://github.com/yourusername/my-awesome-plugin"
  },
  "distribution": {
    "type": "cdn",
    "url": "https://cdn.jsdelivr.net/gh/yourusername/my-awesome-plugin@1.0.0/dist/index.js",
    "css": "https://cdn.jsdelivr.net/gh/yourusername/my-awesome-plugin@1.0.0/dist/style.css"
  },
  "requirements": {
    "ecs-version": ">=2.0.0",
    "editor-version": ">=1.0.0"
  },
  "license": "MIT",
  "homepage": "https://github.com/yourusername/my-awesome-plugin",
  "screenshots": [
    "https://raw.githubusercontent.com/yourusername/my-awesome-plugin/main/screenshots/1.png"
  ]
}
```

### Step 5: Submit Pull Request

```bash
# Add your metadata file
git add plugins/community/my-awesome-plugin.json
git commit -m "Add my-awesome-plugin to marketplace"
git push origin main

# Create Pull Request
gh pr create \
  --title "Add my-awesome-plugin to marketplace" \
  --body "Submitting my plugin for review"
```

## 🔍 Review Process

Once you submit your PR:

1. **Automated Checks** (~2 minutes)
   - JSON validation
   - Repository accessibility check
   - Distribution URL verification
   - Basic security scan

2. **Manual Review** (1-7 days)
   - Code quality review
   - Security audit
   - Functionality testing
   - Documentation review

3. **Approval**
   - If approved, your PR will be merged
   - Your plugin appears in the marketplace within minutes
   - Users can install it immediately

## 🔐 Security Guidelines

Your plugin **MUST NOT**:
- ❌ Use `eval()` or `Function()` constructor
- ❌ Access file system directly (use provided APIs)
- ❌ Execute arbitrary shell commands
- ❌ Make network requests to untrusted sources
- ❌ Collect user data without consent
- ❌ Contain obfuscated code

Your plugin **SHOULD**:
- ✅ Use TypeScript for better type safety
- ✅ Handle errors gracefully
- ✅ Follow React best practices (if using UI)
- ✅ Minimize dependencies
- ✅ Document all public APIs

## 📝 Metadata Requirements

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (lowercase, hyphen-separated) |
| `name` | string | Display name (1-100 chars) |
| `version` | string | Semantic version (e.g., "1.0.0") |
| `author` | object | Author information |
| `author.name` | string | Your name |
| `author.github` | string | GitHub username |
| `description` | string | Plugin description (10-500 chars) |
| `category` | enum | One of: Tool, Window, Inspector, System, ImportExport |
| `repository.url` | string | GitHub repository URL |
| `distribution.type` | enum | "cdn" or "npm" |
| `distribution.url` | string | HTTPS URL to main file |
| `requirements.ecs-version` | string | Required ECS version |
| `license` | string | License identifier (e.g., "MIT") |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `author.email` | string | Contact email |
| `tags` | array | Keywords for search |
| `icon` | string | Lucide icon name |
| `distribution.css` | string | CSS file URL |
| `requirements.editor-version` | string | Required editor version |
| `homepage` | string | Plugin homepage |
| `screenshots` | array | Screenshot URLs |

## 🎨 Categories

Choose the most appropriate category:

- **Tool**: Utility tools and helpers
- **Window**: New editor windows/panels
- **Inspector**: Custom property inspectors
- **System**: System-level plugins
- **ImportExport**: Import/export functionality

## 🏷️ Recommended Tags

Use relevant tags to help users find your plugin:

- `visual-editor`, `utility`, `tool`, `helper`
- `ai`, `pathfinding`, `physics`, `animation`
- `import`, `export`, `converter`
- `debugging`, `profiling`, `testing`

## 📊 Plugin Updates

To update your plugin:

1. Update version in your repository
2. Create new git tag (e.g., `v1.1.0`)
3. Update the JSON file in this repository
4. Submit a new PR

## ❓ Questions?

- 📖 Read the [Plugin Development Guide](docs/PLUGIN_DEVELOPMENT.md)
- 💬 Ask in [Discussions](https://github.com/esengine/ecs-editor-plugins/discussions)
- 🐛 Report issues in [Issues](https://github.com/esengine/ecs-editor-plugins/issues)

## 📜 Code of Conduct

Please be respectful and professional in all interactions. We follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## 📄 License

By submitting a plugin, you agree that:
- Your plugin is open source
- Your plugin metadata can be distributed under MIT license
- You have the rights to submit the plugin

---

Thank you for contributing to the ECS Editor ecosystem! 🎉
