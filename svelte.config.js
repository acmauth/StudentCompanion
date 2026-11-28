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
				$components: "src/lib/components",
				$common: "src/lib/components/common",
				$services: "src/lib/services",
				$methods: "src/lib/methods",
				$assets: "src/lib/assets",
				$src: "src",
				$lib: "src/lib",
				$debug: "src/debug",
			},
csrf: {
      trustedOrigins: ['*'],
    }

	}

};

export default config;
