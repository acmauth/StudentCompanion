import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';
import preprocess from "svelte-preprocess";

const isProduction = process.env.NODE_ENV === 'production';

const config = {
	preprocess: preprocess(),
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
			},
	}
};

export default config;
