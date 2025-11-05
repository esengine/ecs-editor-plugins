import { IEditorModule, IModuleContext } from '@esengine/editor-core';

/**
 * Example plugin module for ECS Framework Editor
 */
export class MyPluginModule implements IEditorModule {
    readonly id = 'my-plugin';
    readonly name = 'My Plugin';
    readonly version = '1.0.0';

    async load(context: IModuleContext): Promise<void> {
        console.log('[MyPlugin] Loading plugin...');

        // Register commands
        this.registerCommands(context);

        // Register panels
        this.registerPanels(context);

        // Subscribe to events
        this.subscribeEvents(context);

        console.log('[MyPlugin] Plugin loaded successfully');
    }

    async unload(): Promise<void> {
        console.log('[MyPlugin] Unloading plugin...');
    }

    private registerCommands(context: IModuleContext): void {
        // Example: Register a command
        context.commands.register({
            id: 'my-plugin.hello',
            label: 'Say Hello',
            icon: 'Smile',
            keybinding: { key: 'H', ctrl: true, shift: true },
            execute: async () => {
                console.log('Hello from My Plugin!');
                // You can access other services through context
            }
        });
    }

    private registerPanels(context: IModuleContext): void {
        // Example: Register a panel
        // context.panels.register({
        //     id: 'my-plugin.panel',
        //     title: 'My Panel',
        //     component: MyPanelComponent
        // });
    }

    private subscribeEvents(context: IModuleContext): void {
        // Example: Subscribe to editor events
        context.eventBus.on('project:loaded', () => {
            console.log('[MyPlugin] Project loaded');
        });
    }
}

// Export default instance for easy loading
export default new MyPluginModule();
