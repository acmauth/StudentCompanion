import adapterStatic from '@sveltejs/adapter-static';
import preprocess from "svelte-preprocess";

const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapterStatic({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false
		}),
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
