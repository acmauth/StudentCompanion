import { registerPlugin } from '@capacitor/core';

export interface AppLauncherPluginType {
	/** Launches the installed Android app with the given package name. */
	launchApp(options: { packageName: string }): Promise<{ launched: boolean }>;
}

// Custom native plugin. Registered once here: Capacitor warns
// ("Cannot register plugins twice") on every repeated registerPlugin() call.
export const AppLauncherPlugin = registerPlugin<AppLauncherPluginType>('AppLauncherPlugin');
