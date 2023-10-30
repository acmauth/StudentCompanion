<!-- src/routes/Scrape.svelte -->
<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import cheerio from 'cheerio';

	let scrapedHTML = '';

	onMount(async () => {
		try {
			const targetURL = 'http://localhost:3000/proxy?url=https://www.auth.gr/weekly-menu/';
			const response = await axios.get(targetURL);
			const htmlContent = response.data;
			const $ = cheerio.load(htmlContent);

			const days = $('.kt-blocks-accordion-title');
			const dailyMenus = $('.kt-accordion-panel-inner');
			dailyMenus.each(function (idx, el) {
				scrapedHTML += $(days[idx]).html();
				scrapedHTML += $(el).html();
			});
		} catch (error) {
			console.error('Error while scraping data:', error);
		}
	});
</script>

<h1>Μενού Λέσχης</h1>
<div>{@html scrapedHTML}</div>
