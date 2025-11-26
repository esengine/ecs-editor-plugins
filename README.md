# ECS Editor Plugins Registry

[中文文档](README_zh.md) | English

Official and community plugins registry for ECS Framework Editor.

## 🎯 What is this?

This repository serves as the **plugin marketplace registry** for ECS Framework Editor. It contains:
- Plugin metadata (not the actual plugin code)
- Automated validation and security checks
- Official and community plugin listings

## 📦 Browse Plugins

### Official Plugins
Plugins developed and maintained by the ECS Framework team:
- **Behavior Tree Editor** - Visual behavior tree editor with execution visualization

### Community Plugins
High-quality plugins contributed by the community, reviewed and approved by maintainers.

Browse all available plugins in the [Plugin Marketplace](https://github.com/esengine/ecs-editor-plugins/blob/main/registry.json).

## 🚀 Submit Your Plugin

Want to add your plugin to the marketplace? Follow these steps:

### Quick Start

1. **Use our template** to create your plugin:
   ```bash
   # Copy the plugin template
   cp -r PLUGIN_TEMPLATE my-awesome-plugin
   cd my-awesome-plugin
   npm install
   ```

2. **Develop your plugin** following the [Plugin Development Guide](CONTRIBUTING.md)

3. **Build and publish** to your GitHub repository:
   ```bash
   npm run build
   git tag v1.0.0
   git push --tags
   ```

4. **Submit metadata** to this registry:
   - Fork this repository
   - Create `plugins/community/your-plugin-name.json`
   - Submit a Pull Request

### Plugin Metadata Example

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
  "description": "An awesome plugin for ECS Editor",
  "category": "Tool",
  "tags": ["utility", "helper"],
  "icon": "Package",
  "repository": {
    "type": "github",
    "url": "https://github.com/yourusername/my-awesome-plugin"
  },
  "distribution": {
    "type": "cdn",
    "url": "https://cdn.jsdelivr.net/gh/yourusername/my-awesome-plugin@1.0.0/dist/index.js"
  },
  "requirements": {
    "ecs-version": ">=2.0.0"
  },
  "license": "MIT",
  "homepage": "https://github.com/yourusername/my-awesome-plugin"
}
```

## 🔐 Security & Review Process

All plugin submissions go through:

### Automated Checks (2-5 minutes)
- ✅ JSON schema validation
- ✅ Repository accessibility verification
- ✅ Distribution URL checking
- ✅ Basic security pattern scanning

### Manual Review (1-7 days)
- ✅ Code quality review
- ✅ Security audit
- ✅ Functionality testing
- ✅ Documentation review

### Security Requirements

Your plugin **MUST NOT**:
- ❌ Use `eval()` or `Function()` constructor
- ❌ Access file system directly (use provided APIs)
- ❌ Execute arbitrary shell commands
- ❌ Contain obfuscated code
- ❌ Collect user data without consent

Your plugin **SHOULD**:
- ✅ Use TypeScript for type safety
- ✅ Handle errors gracefully
- ✅ Follow React best practices
- ✅ Minimize dependencies
- ✅ Document all public APIs

## 📊 Plugin Statistics

![Total Plugins](https://img.shields.io/badge/total%20plugins-1-blue)
![Official Plugins](https://img.shields.io/badge/official-1-green)
![Community Plugins](https://img.shields.io/badge/community-0-orange)

## 📚 Documentation

- [Contributing Guide](CONTRIBUTING.md) - How to submit your plugin
- [Plugin Template](PLUGIN_TEMPLATE/) - Starter template for plugin development
- [Metadata Schema](CONTRIBUTING.md#metadata-requirements) - Required fields for plugin metadata

## 🛠️ For Maintainers

### Validate Plugin Submissions

```bash
# Install dependencies
npm install

# Validate a specific manifest
node scripts/validate-manifest.js plugins/community/plugin-name.json

# Check repository security
node scripts/check-repo-security.js plugins/community/plugin-name.json

# Generate registry.json
npm run generate-registry
```

### Approve Plugin

1. Review the PR
2. Run automated checks
3. Manually review the plugin code
4. Merge the PR
5. Registry will be auto-updated via GitHub Actions

## 🤝 Community

- 💬 [Discussions](https://github.com/esengine/ecs-editor-plugins/discussions) - Ask questions and share ideas
- 🐛 [Issues](https://github.com/esengine/ecs-editor-plugins/issues) - Report bugs or request features
- 📖 [ECS Framework Documentation](https://github.com/esengine/ecs-framework)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Thank you to all plugin developers who contribute to the ECS Editor ecosystem!

---

Made with ❤️ by the ECS Framework Team
