import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isProduction = process.env.NODE_ENV === 'production';
console.log("isProduction", isProduction);

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: isProduction
			? adapterStatic({
				pages: 'build',
				assets: 'build',
				fallback: 'index.html',
				precompress: false
			})
			: adapterAuto(),
			alias: {
				$stores: "src/stores",
				$components: "src/lib/components",
				$shared: "src/lib/components/shared",
				$images: "src/lib/static/images",
				$types: "src/lib/types",
				$customIcons: "src/lib/static/customIcons",
				$src: "src",
				$debug: "src/debug",
			},
csrf: {
      trustedOrigins: ['*'],
    }

	}

};

export default config;
