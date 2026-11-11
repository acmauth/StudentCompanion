module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2022: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				// Parse <script lang="ts"> with the TypeScript parser (Svelte 5 components use
				// typed $props(), interfaces, `import type`, ...)
				parser: '@typescript-eslint/parser'
			},
			rules: {
				// Undefined names are caught by TypeScript/svelte-check; the core rule misreports
				// type-only globals such as HTMLIonModalElement (as typescript-eslint recommends)
				'no-undef': 'off',
				// Real compile errors still fail lint; Svelte's compiler *warnings* (a11y etc.) are
				// already reported by svelte-check / the editor, so don't duplicate them as errors here
				'svelte/valid-compile': ['error', { ignoreWarnings: true }],
				// The core rule doesn't understand TypeScript (types/interfaces count as unused)
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					'error',
					{ argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }
				]
			}
		}
	]
};
