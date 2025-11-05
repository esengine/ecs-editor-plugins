# My ECS Plugin

An awesome plugin for ECS Framework Editor.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

### From Plugin Marketplace (Recommended)

1. Open ECS Editor
2. Go to **Plugins** → **Marketplace**
3. Search for "My Plugin"
4. Click **Install**

### Manual Installation

1. Clone this repository
2. Build the plugin:
   ```bash
   npm install
   npm run build
   ```
3. Copy to your project's `plugins/` directory

## Usage

After installation, you can use the plugin by:

1. Opening the command palette (`Ctrl+Shift+P`)
2. Type "Say Hello"
3. Press Enter

## Configuration

Add to your project's plugin configuration:

```json
{
  "my-plugin": {
    "enabled": true,
    "option1": "value1"
  }
}
```

## Development

### Setup

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Testing

Load the plugin in ECS Editor for testing:

1. Copy the `dist/` folder to `<project>/plugins/my-plugin/`
2. Reload the editor

## API

### Commands

- `my-plugin.hello` - Say hello

### Events

The plugin listens to these events:
- `project:loaded` - When a project is loaded

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- 📖 [Documentation](https://github.com/yourusername/my-ecs-plugin)
- 🐛 [Report Issues](https://github.com/yourusername/my-ecs-plugin/issues)
