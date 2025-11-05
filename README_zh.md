# ECS 编辑器插件注册中心

中文文档 | [English](README.md)

ECS Framework 编辑器的官方和社区插件注册中心。

## 🎯 这是什么？

本仓库作为 **ECS Framework 编辑器的插件市场注册中心**，包含：
- 插件元数据（不是实际的插件代码）
- 自动化验证和安全检查
- 官方和社区插件列表

## 📦 浏览插件

### 官方插件
由 ECS Framework 团队开发和维护的插件：
- **行为树编辑器** - 可视化行为树编辑器，支持执行可视化

### 社区插件
由社区贡献的高质量插件，经过维护者审核和批准。

在[插件市场](https://github.com/esengine/ecs-editor-plugins/blob/main/registry.json)浏览所有可用插件。

## 🚀 提交您的插件

想要将您的插件添加到市场？请按照以下步骤操作：

### 快速开始

1. **使用我们的模板**创建您的插件：
   ```bash
   # 复制插件模板
   cp -r PLUGIN_TEMPLATE my-awesome-plugin
   cd my-awesome-plugin
   npm install
   ```

2. **开发您的插件**，遵循[插件开发指南](CONTRIBUTING.md)

3. **构建并发布**到您的 GitHub 仓库：
   ```bash
   npm run build
   git tag v1.0.0
   git push --tags
   ```

4. **提交元数据**到本注册中心：
   - Fork 本仓库
   - 创建 `plugins/community/your-plugin-name.json`
   - 提交 Pull Request

### 插件元数据示例

```json
{
  "id": "my-awesome-plugin",
  "name": "我的超棒插件",
  "version": "1.0.0",
  "author": {
    "name": "你的名字",
    "github": "yourusername",
    "email": "you@example.com"
  },
  "description": "一个用于 ECS 编辑器的超棒插件",
  "category": "Tool",
  "tags": ["实用工具", "辅助"],
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

## 🔐 安全与审核流程

所有插件提交都将经过：

### 自动检查（2-5 分钟）
- ✅ JSON 格式验证
- ✅ 仓库可访问性验证
- ✅ 分发 URL 检查
- ✅ 基础安全模式扫描

### 人工审核（1-7 天）
- ✅ 代码质量审查
- ✅ 安全审计
- ✅ 功能测试
- ✅ 文档审查

### 安全要求

您的插件**禁止**：
- ❌ 使用 `eval()` 或 `Function()` 构造函数
- ❌ 直接访问文件系统（请使用提供的 API）
- ❌ 执行任意 shell 命令
- ❌ 包含混淆代码
- ❌ 在未经同意的情况下收集用户数据

您的插件**应该**：
- ✅ 使用 TypeScript 以提高类型安全
- ✅ 优雅地处理错误
- ✅ 遵循 React 最佳实践
- ✅ 最小化依赖
- ✅ 记录所有公共 API

## 📊 插件统计

![总插件数](https://img.shields.io/badge/总插件数-1-blue)
![官方插件](https://img.shields.io/badge/官方-1-green)
![社区插件](https://img.shields.io/badge/社区-0-orange)

## 📚 文档

- [贡献指南](CONTRIBUTING.md) - 如何提交您的插件
- [插件模板](PLUGIN_TEMPLATE/) - 插件开发的起始模板
- [元数据结构](CONTRIBUTING.md#metadata-requirements) - 插件元数据的必填字段

## 🛠️ 维护者

### 验证插件提交

```bash
# 安装依赖
npm install

# 验证特定的清单文件
node scripts/validate-manifest.js plugins/community/plugin-name.json

# 检查仓库安全性
node scripts/check-repo-security.js plugins/community/plugin-name.json

# 生成 registry.json
npm run generate-registry
```

### 批准插件

1. 审查 PR
2. 运行自动检查
3. 手动审查插件代码
4. 合并 PR
5. Registry 将通过 GitHub Actions 自动更新

## 🤝 社区

- 💬 [讨论区](https://github.com/esengine/ecs-editor-plugins/discussions) - 提问和分享想法
- 🐛 [Issues](https://github.com/esengine/ecs-editor-plugins/issues) - 报告 bug 或请求功能
- 📖 [ECS Framework 文档](https://github.com/esengine/ecs-framework)

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

感谢所有为 ECS 编辑器生态系统做出贡献的插件开发者！

---

由 ECS Framework 团队用 ❤️ 制作
