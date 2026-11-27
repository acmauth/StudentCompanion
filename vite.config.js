import { sveltekit } from '@sveltejs/kit/vite';
import { defaultClientConditions } from 'vite';
import { defineConfig } from 'vitest/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
	plugins: [sveltekit(), nodePolyfills()],

	// vite-plugin-svelte 3 sets conditions: ['svelte'], which replaces Vite 6's defaults.
	// Without 'browser', `svelte` resolves to its SSR build, where lifecycle functions are no-ops.

	resolve: {
		conditions: [...defaultClientConditions]
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
                allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', '.aristomate.gr', 'aristomate.auth.gr']
        }
});
